/**
 * Vite middleware: serves /api/photos and /api/photo for local darkroom testing.
 * Uses production Cloudinary-backed data when available, then applies provisional
 * series / featured grouping so the new UI shape works before this branch deploys.
 */

const ALT_FALLBACK = "Photograph by Hugo Marques";
const PRODUCTION =
  process.env.PHOTOS_API_PROXY ||
  "https://my-portfolio-sandy-nine-68.vercel.app";

const PROVISIONAL_SERIES_BY_ID = {
  Oxford_seujq0: "oxford",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie": "coast",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu": "coast",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi": "coast",
  "IMG_1971+SG3": "coast",
  "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o": "coast",
  "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o": "coast",
  "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o": "coast",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c": "portugal",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c": "portugal",
  "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c": "portugal",
  "IMG_1767+IH5": "portugal",
  Background_c6fncd: "quiet",
  "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828": "quiet",
};

const SERIES_TITLES = {
  coast: "Coast",
  oxford: "Oxford",
  portugal: "Portugal",
  quiet: "Quiet",
};

const PROVISIONAL_FEATURED_IDS = [
  "IMG_1971+SG3",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
  "Oxford_seujq0",
];

function looksLikeFilename(value) {
  const v = String(value || "").trim();
  if (!v) return true;
  if (v.includes("/")) return true;
  if (/\.(jpe?g|png|webp|gif|heic|tiff?)$/i.test(v)) return true;
  if (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(v)) return true;
  if (/^IMG[_-]?\d+/i.test(v)) return true;
  return false;
}

function titleForSeries(slug) {
  if (SERIES_TITLES[slug]) return SERIES_TITLES[slug];
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizePhoto(raw) {
  const id = raw.id;
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const seriesTag = tags.find((t) =>
    String(t).toLowerCase().startsWith("series:"),
  );
  const seriesSlug =
    (seriesTag && String(seriesTag).slice(7).toLowerCase()) ||
    PROVISIONAL_SERIES_BY_ID[id] ||
    "archive";
  const featured =
    tags.some((t) => String(t).toLowerCase() === "featured") ||
    PROVISIONAL_FEATURED_IDS.includes(id);
  const altRaw = raw.alt;
  const alt =
    altRaw && !looksLikeFilename(altRaw) ? altRaw : ALT_FALLBACK;

  return {
    id,
    publicId: raw.publicId || raw.public_id || id,
    src: raw.src,
    srcFull: raw.srcFull || raw.src,
    alt,
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

function buildPayload(photos) {
  const buckets = new Map();
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

  const featuredIds = photos.filter((p) => p.featured).map((p) => p.id);

  return {
    photos,
    series,
    featuredIds:
      featuredIds.length > 0
        ? featuredIds
        : photos.slice(0, Math.min(5, photos.length)).map((p) => p.id),
  };
}

let cached;
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

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function darkroomPhotosMiddleware() {
  return {
    name: "darkroom-photos-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
