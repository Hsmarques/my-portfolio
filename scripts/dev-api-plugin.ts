import type { Plugin } from "vite";
import { getFallbackCatalog } from "../shared/fallbackCatalog";

/**
 * Serves /api/photos during `pnpm dev` so the SPA can run without `vercel dev`.
 * Uses Cloudinary when credentials exist; otherwise the local fallback catalog.
 */
export function devPhotosApiPlugin(): Plugin {
  return {
    name: "dev-photos-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/photos")) return next();

        try {
          const url = new URL(req.url, "http://localhost");
          const id = url.searchParams.get("id")?.trim();
          const series = url.searchParams.get("series")?.trim();
          const view = url.searchParams.get("view")?.trim() || "catalog";

          let payload: unknown;

          const hasCreds = !!(
            process.env.CLOUDINARY_URL ||
            (process.env.CLOUDINARY_CLOUD_NAME &&
              process.env.CLOUDINARY_API_KEY &&
              process.env.CLOUDINARY_API_SECRET)
          );

          if (hasCreds) {
            const catalogMod = await server.ssrLoadModule("/api/_lib/catalog.ts");
            if (id) {
              const photo = await catalogMod.loadPhotoById(id);
              if (!photo) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "That photograph could not be found." }));
                return;
              }
              payload = { photo };
            } else {
              const catalog = await catalogMod.loadCatalog();
              if (series) {
                const entry = catalog.series.find((item: { slug: string }) => item.slug === series);
                if (!entry) {
                  res.statusCode = 404;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "That series could not be found." }));
                  return;
                }
                const photos = entry.photoIds
                  .map((photoId: string) =>
                    catalog.photos.find((photo: { id: string }) => photo.id === photoId),
                  )
                  .filter(Boolean);
                payload = { series: entry, photos };
              } else if (view === "list") {
                payload = catalog.photos;
              } else {
                payload = catalog;
              }
            }
          } else {
            const catalog = getFallbackCatalog();
            if (id) {
              const photo = catalog.photos.find((photo) => photo.id === id);
              if (!photo) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "That photograph could not be found." }));
                return;
              }
              payload = { photo };
            } else if (series) {
              const entry = catalog.series.find((item) => item.slug === series);
              if (!entry) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "That series could not be found." }));
                return;
              }
              const photos = entry.photoIds
                .map((photoId) => catalog.photos.find((photo) => photo.id === photoId))
                .filter(Boolean);
              payload = { series: entry, photos };
            } else if (view === "list") {
              payload = catalog.photos;
            } else {
              payload = catalog;
            }
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(payload));
        } catch (error) {
          console.error("dev photos api error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Photos are temporarily unavailable." }));
        }
      });
    },
  };
}
