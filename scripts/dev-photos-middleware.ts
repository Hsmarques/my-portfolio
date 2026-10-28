/**
 * Vite middleware: serves /api/photos and /api/photo for local darkroom testing.
 * Uses production Cloudinary-backed data when available, then applies the shared
 * series / featured / alt config so the UI matches the deployed API shape.
 */
import {
  PROVISIONAL_FEATURED_IDS,
  PROVISIONAL_SERIES_BY_ID,
  resolveAlt,
  titleForSeries,
} from "../api/_lib/seriesConfig";

const PRODUCTION =
  process.env.PHOTOS_API_PROXY ||
  "https://my-portfolio-sandy-nine-68.vercel.app";

function normalizePhoto(raw: Record<string, any>) {
  const id = String(raw.id);
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : [];
  const seriesTag = tags.find((t) => t.toLowerCase().startsWith("series:"));
  const seriesSlug =
    (seriesTag && seriesTag.slice(7).toLowerCase()) ||
    PROVISIONAL_SERIES_BY_ID[id] ||
    "archive";
  const featured =
    tags.some((t) => t.toLowerCase() === "featured") ||
    PROVISIONAL_FEATURED_IDS.includes(id);
  const publicId = String(raw.publicId || raw.public_id || id);

  return {
    id,
    publicId,
    src: raw.src,
    srcFull: raw.srcFull || raw.src,
    alt: resolveAlt(raw.alt, publicId, id),
    width: raw.width || 0,
    height: raw.height || 0,
    tags,
    seriesSlug,
    place: raw.place,
    year: raw.year,
    caption: raw.caption,
    createdAt: raw.createdAt,
    featured,
    exif: raw.exif && Object.keys(raw.exif).length ? raw.exif : undefined,
  };
}

function buildPayload(photos: ReturnType<typeof normalizePhoto>[]) {
  const buckets = new Map<string, typeof photos>();
  for (const photo of photos) {
    const slug = photo.seriesSlug || "archive";
    const list = buckets.get(slug) || [];
    list.push(photo);
    buckets.set(slug, list);
  }

  const preferred = ["coast", "oxford", "portugal", "quiet", "archive"];
  const slugs = Array.from(buckets.keys()).sort((a, b) => {
    const ai = preferred.indexOf(a);
    const bi = preferred.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.localeCompare(b);
  });

  const series = slugs.map((slug) => {
    const list = buckets.get(slug) || [];
    const cover = list.find((p) => p.featured) || list[0];
    return {
      id: slug,
      slug,
      title: titleForSeries(slug),
      coverId: cover?.id || slug,
      photoIds: list.map((p) => p.id),
    };
  });

  const byId = new Map(photos.map((p) => [p.id, p]));
  const provisionalFeatured = PROVISIONAL_FEATURED_IDS.filter((id) =>
    byId.has(id),
  );
  const taggedFeatured = photos
    .filter((p) => p.tags.some((t) => t.toLowerCase() === "featured"))
    .map((p) => p.id);

  return {
    photos,
    series,
    featuredIds:
      taggedFeatured.length > 0
        ? taggedFeatured
        : provisionalFeatured.length > 0
          ? provisionalFeatured
          : photos.slice(0, Math.min(5, photos.length)).map((p) => p.id),
  };
}

let cached: ReturnType<typeof buildPayload> | undefined;
let cachedAt = 0;

async function loadPayload() {
  const now = Date.now();
  if (cached && now - cachedAt < 60_000) return cached;

  const res = await fetch(`${PRODUCTION}/api/photos`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Upstream photos failed: ${res.status}`);
  const data = await res.json();

  let photos;
  if (Array.isArray(data)) {
    photos = data.map(normalizePhoto);
  } else if (data?.photos) {
    photos = data.photos.map(normalizePhoto);
  } else {
    photos = [];
  }

  cached = buildPayload(photos);
  cachedAt = now;
  return cached;
}

function sendJson(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function darkroomPhotosMiddleware() {
  return {
    name: "darkroom-photos-middleware",
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        try {
          const url = new URL(req.url || "/", "http://localhost");
          if (url.pathname === "/api/photos") {
            const payload = await loadPayload();
            return sendJson(res, 200, payload);
          }
          if (url.pathname === "/api/photo") {
            const id = url.searchParams.get("id");
            if (!id) return sendJson(res, 400, { error: "Missing photo id." });
            const payload = await loadPayload();
            const photo = payload.photos.find(
              (p) => p.id === id || p.publicId === id,
            );
            if (!photo) {
              return sendJson(res, 404, { error: "Photo not found." });
            }
            return sendJson(res, 200, photo);
          }
        } catch (error) {
          console.error("[darkroom-photos-middleware]", error);
          return sendJson(res, 500, {
            error: "Photos could not be loaded right now.",
          });
        }
        return next();
      });
    },
  };
}
