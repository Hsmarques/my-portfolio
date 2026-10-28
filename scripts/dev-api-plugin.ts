/**
 * Local Vite middleware that serves /api/photos and /api/collections.
 * Uses Cloudinary when credentials exist; otherwise proxies production
 * for the list and applies the same mapping/collections logic.
 */
import type { Plugin } from "vite";

const PRODUCTION_PHOTOS =
  "https://my-portfolio-hugo-marques-projects-923c6d66.vercel.app/api/photos";

function hasCloudinaryCredentials() {
  return !!(
    process.env.CLOUDINARY_URL ||
    (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
}

async function handleWithServerHandlers(
  url: URL,
  req: import("http").IncomingMessage,
  res: import("http").ServerResponse,
) {
  const path = url.pathname;

  if (path === "/api/photos") {
    const { GET } = await import("../api/photos");
    const request = new Request(`http://local${url.pathname}${url.search}`, {
      method: "GET",
      headers: req.headers as HeadersInit,
    });
    const response = await GET(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
    return true;
  }

  if (path === "/api/collections") {
    const { GET } = await import("../api/collections");
    const response = await GET();
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
    return true;
  }

  return false;
}

async function proxyProductionList(): Promise<any[]> {
  const response = await fetch(PRODUCTION_PHOTOS);
  if (!response.ok) {
    throw new Error("Upstream photos unavailable");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function enrichLegacyPhoto(photo: any) {
  const id = photo.id;
  const publicId = photo.publicId || photo.id;
  return {
    ...photo,
    publicId,
    alt:
      photo.alt &&
      photo.alt !== id &&
      !String(photo.alt).includes("/") &&
      !/^[0-9A-F]{8}-/i.test(photo.alt)
        ? photo.alt
        : undefined,
  };
}

export function devApiPlugin(): Plugin {
  return {
    name: "dev-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (!req.url?.startsWith("/api/")) return next();

          const url = new URL(req.url, "http://localhost");

          if (hasCloudinaryCredentials()) {
            const handled = await handleWithServerHandlers(url, req, res);
            if (handled) return;
            return next();
          }

          // No credentials: use production list + local collections logic
          if (url.pathname === "/api/photos") {
            const id = url.searchParams.get("id");
            const list = await proxyProductionList();
            const { mapCloudinaryResource } = await import(
              "../api/_lib/mapPhoto"
            );

            // Production already mapped; normalize alts via map helpers for ids we know
            const normalized = list.map((photo) => {
              const enriched = enrichLegacyPhoto(photo);
              // Re-run alt fallback through mapCloudinaryResource shape
              return mapCloudinaryResource(
                {
                  public_id: enriched.publicId || `my-portfolio/${enriched.id}`,
                  width: enriched.width,
                  height: enriched.height,
                  created_at: enriched.createdAt,
                  tags: enriched.tags,
                  context: {
                    custom: {
                      alt:
                        enriched.alt && enriched.alt !== enriched.id
                          ? enriched.alt
                          : undefined,
                      place: enriched.place,
                      year: enriched.year,
                      caption: enriched.caption,
                    },
                  },
                  image_metadata: {},
                  exif: enriched.exif || {},
                },
                (publicId, options) => {
                  // Prefer existing Cloudinary delivery URLs from production payload
                  if (options.width && options.width >= 1600 && enriched.srcFull) {
                    return enriched.srcFull;
                  }
                  if (enriched.src) return enriched.src;
                  return `https://res.cloudinary.com/dbqlz3a3q/image/upload/c_limit,f_auto,q_auto,w_${options.width || 900}/${publicId}`;
                },
              );
            });

            if (id) {
              const photo = normalized.find(
                (p) => p.id === id || p.publicId === id,
              );
              if (!photo) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Photo not found." }));
                return;
              }
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(photo));
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(normalized));
            return;
          }

          if (url.pathname === "/api/collections") {
            const list = await proxyProductionList();
            const { buildCollections } = await import(
              "../src/lib/collections"
            );
            const photos = list.map((photo) => ({
              ...photo,
              publicId: photo.publicId || photo.id,
              alt: photo.alt || "Coast and street photograph",
              tags: photo.tags || [],
            }));
            const payload = buildCollections(photos);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
            return;
          }

          next();
        } catch (error) {
          console.error("[dev-api-plugin]", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "Photos could not be loaded. Please try again later.",
            }),
          );
        }
      });
    },
  };
}
