import {
  ALT_FALLBACK,
  PROVISIONAL_FEATURED_IDS,
  PROVISIONAL_SERIES_BY_ID,
  looksLikeFilename,
  titleForSeries,
} from "./collections";

type CloudinaryResource = {
  public_id: string;
  width: number;
  height: number;
  created_at?: string;
  folder?: string;
  tags?: string[];
  image_metadata?: Record<string, unknown>;
  context?: {
    custom?: Record<string, string | string[] | undefined>;
  };
};

export type PhotoExif = {
  camera?: string;
  lens?: string;
  focalLengthMm?: number;
  aperture?: string;
  shutter?: string;
  iso?: number;
};

export type Photo = {
  id: string;
  publicId: string;
  src: string;
  srcFull: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  seriesSlug?: string;
  place?: string;
  year?: number;
  caption?: string;
  createdAt?: string;
  featured?: boolean;
  exif?: PhotoExif;
};

export type Series = {
  id: string;
  slug: string;
  title: string;
  coverId: string;
  photoIds: string[];
};

export type PhotosPayload = {
  photos: Photo[];
  series: Series[];
  featuredIds: string[];
};

type CacheEntry = {
  payload: PhotosPayload;
  byId: Map<string, Photo>;
  expiresAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: CacheEntry | null = null;

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";

export function hasCloudinaryCredentials() {
  return !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
}

async function getCloudinary() {
  const { v2: cloudinary } = await import("cloudinary");
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinary;
}

function parseTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(String).map((t) => t.trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function readContextString(
  context: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string | undefined {
  if (!context) return undefined;
  const value = context[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]) return String(value[0]).trim();
  return undefined;
}

function parseYear(raw: string | undefined, createdAt?: string): number | undefined {
  if (raw) {
    const match = raw.match(/(\d{4})/);
    if (match) return Number(match[1]);
  }
  return undefined;
}

function formatShutter(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") {
    if (value > 0 && value < 1) return `1/${Math.round(1 / value)}s`;
    return `${value}s`;
  }
  const str = String(value);
  if (/^\d+\/\d+$/.test(str)) return `${str}s`;
  return str.endsWith("s") ? str : `${str}s`;
}

function extractExif(
  meta: Record<string, unknown> | undefined,
  context: Record<string, string | string[] | undefined> | undefined,
): PhotoExif {
  const metaObj = meta || {};
  const apertureRaw = metaObj.FNumber ?? metaObj.ApertureValue;
  const isoRaw = metaObj.ISO ?? metaObj.ISOSpeedRatings ?? metaObj.PhotographicSensitivity;
  const focal =
    metaObj.FocalLengthIn35mmFilm ?? metaObj.FocalLength ?? metaObj.FocalLengthIn35mmFormat;

  return {
    camera:
      readContextString(context, "camera") ||
      (typeof metaObj.Model === "string" ? metaObj.Model : undefined) ||
      (typeof metaObj.CameraModelName === "string" ? metaObj.CameraModelName : undefined),
    lens:
      readContextString(context, "lens") ||
      (typeof metaObj.LensModel === "string" ? metaObj.LensModel : undefined) ||
      (typeof metaObj.Lens === "string" ? metaObj.Lens : undefined),
    focalLengthMm:
      typeof focal === "number"
        ? focal
        : typeof focal === "string" && focal
          ? Number.parseFloat(focal)
          : undefined,
    aperture:
      apertureRaw !== undefined && apertureRaw !== null && apertureRaw !== ""
        ? `f/${apertureRaw}`
        : undefined,
    shutter: formatShutter(metaObj.ExposureTime ?? metaObj.ShutterSpeedValue),
    iso:
      typeof isoRaw === "number"
        ? isoRaw
        : typeof isoRaw === "string" && isoRaw
          ? Number.parseInt(isoRaw, 10)
          : undefined,
  };
}

function seriesFromPublicId(publicId: string): string | undefined {
  const parts = publicId.split("/");
  // my-portfolio/coast/frame → coast; my-portfolio/frame → undefined
  if (parts.length >= 3) {
    return parts[parts.length - 2]?.toLowerCase();
  }
  return undefined;
}

function resolveSeriesSlug(
  id: string,
  publicId: string,
  tags: string[],
): string | undefined {
  const seriesTag = tags.find((t) => t.toLowerCase().startsWith("series:"));
  if (seriesTag) return seriesTag.slice("series:".length).toLowerCase();

  const known = tags.find((t) =>
    ["coast", "oxford", "portugal", "quiet", "street"].includes(t.toLowerCase()),
  );
  if (known) return known.toLowerCase();

  const fromFolder = seriesFromPublicId(publicId);
  if (fromFolder && fromFolder !== cloudinaryFolder.toLowerCase()) {
    return fromFolder;
  }

  return PROVISIONAL_SERIES_BY_ID[id];
}

function mapResource(
  resource: CloudinaryResource,
  toUrl: (
    publicId: string,
    options: {
      width?: number;
      quality?: string | number;
      format?: "auto";
      crop?: string;
    },
  ) => string,
): Photo {
  const context = resource.context?.custom || {};
  const resourceTags = parseTags(resource.tags);
  const contextTags = parseTags(context.tags);
  const tags = Array.from(new Set([...resourceTags, ...contextTags]));

  const id = resource.public_id.split("/").pop() || resource.public_id;
  const place = readContextString(context, "place") || readContextString(context, "location");
  const caption =
    readContextString(context, "caption") || readContextString(context, "description");
  const yearRaw = readContextString(context, "year");
  const year = parseYear(yearRaw);
  const altRaw =
    readContextString(context, "alt") ||
    (typeof resource.image_metadata?.ImageDescription === "string"
      ? resource.image_metadata.ImageDescription
      : undefined);
  const alt =
    altRaw && !looksLikeFilename(altRaw) ? altRaw : ALT_FALLBACK;

  const featured =
    tags.some((t) => t.toLowerCase() === "featured") ||
    PROVISIONAL_FEATURED_IDS.includes(id);

  const seriesSlug = resolveSeriesSlug(id, resource.public_id, tags);
  const exif = extractExif(resource.image_metadata, context);
  const hasExif = Object.values(exif).some((v) => v !== undefined && v !== null && v !== "");

  return {
    id,
    publicId: resource.public_id,
    src: toUrl(resource.public_id, {
      width: 600,
      quality: "auto",
      format: "auto",
      crop: "limit",
    }),
    srcFull: toUrl(resource.public_id, {
      width: 1600,
      quality: "auto",
      format: "auto",
      crop: "limit",
    }),
    alt,
    width: resource.width || 0,
    height: resource.height || 0,
    tags,
    seriesSlug,
    place,
    year,
    caption,
    createdAt: resource.created_at
      ? new Date(resource.created_at).toISOString()
      : undefined,
    featured,
    exif: hasExif ? exif : undefined,
  };
}

function buildSeries(photos: Photo[]): Series[] {
  const buckets = new Map<string, Photo[]>();
  for (const photo of photos) {
    const slug = photo.seriesSlug || "archive";
    const list = buckets.get(slug) || [];
    list.push(photo);
    buckets.set(slug, list);
  }

  const preferredOrder = ["coast", "oxford", "portugal", "quiet", "archive"];
  const slugs = Array.from(buckets.keys()).sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    const av = ai === -1 ? preferredOrder.length : ai;
    const bv = bi === -1 ? preferredOrder.length : bi;
    if (av !== bv) return av - bv;
    return a.localeCompare(b);
  });

  return slugs.map((slug) => {
    const list = buckets.get(slug) || [];
    const cover =
      list.find((p) => p.featured) ||
      list[0];
    return {
      id: slug,
      slug,
      title: titleForSeries(slug),
      coverId: cover?.id || list[0]?.id || slug,
      photoIds: list.map((p) => p.id),
    };
  });
}

async function fetchAllResources(cloudinary: Awaited<ReturnType<typeof getCloudinary>>) {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    let request = cloudinary.search
      .expression(`folder:${cloudinaryFolder}`)
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(500);

    if (nextCursor) {
      request = request.next_cursor(nextCursor);
    }

    const result = await request.execute();
    resources.push(...((result.resources || []) as CloudinaryResource[]));
    nextCursor = result.next_cursor as string | undefined;
  } while (nextCursor);

  resources.sort((a, b) => {
    const dateA = a.created_at ? Date.parse(a.created_at) : 0;
    const dateB = b.created_at ? Date.parse(b.created_at) : 0;
    return dateB - dateA;
  });

  return resources;
}

export async function getPhotosPayload(force = false): Promise<PhotosPayload> {
  const now = Date.now();
  if (!force && cache && cache.expiresAt > now) {
    return cache.payload;
  }

  const cloudinary = await getCloudinary();
  const resources = await fetchAllResources(cloudinary);

  const toUrl = (
    publicId: string,
    options: {
      width?: number;
      quality?: string | number;
      format?: "auto";
      crop?: string;
    },
  ) =>
    cloudinary.url(publicId, {
      secure: true,
      transformation: [
        {
          ...options,
          fetch_format: options.format === "auto" ? "auto" : undefined,
        },
      ],
    });

  const photos = resources.map((resource) => mapResource(resource, toUrl));
  const series = buildSeries(photos);
  const featuredIds = photos.filter((p) => p.featured).map((p) => p.id);
  const payload: PhotosPayload = {
    photos,
    series,
    featuredIds:
      featuredIds.length > 0
        ? featuredIds
        : photos.slice(0, Math.min(5, photos.length)).map((p) => p.id),
  };

  const byId = new Map<string, Photo>();
  for (const photo of photos) {
    byId.set(photo.id, photo);
    byId.set(photo.publicId, photo);
  }

  cache = {
    payload,
    byId,
    expiresAt: now + CACHE_TTL_MS,
  };

  return payload;
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const decoded = decodeURIComponent(id);

  if (cache && cache.expiresAt > Date.now()) {
    const hit = cache.byId.get(decoded);
    if (hit) return hit;
  }

  // Prefer cache-backed lookup; refresh once if needed.
  const payload = await getPhotosPayload(cache === null);
  if (cache) {
    const hit = cache.byId.get(decoded);
    if (hit) return hit;
  }
  const fromPayload = payload.photos.find(
    (p) => p.id === decoded || p.publicId === decoded,
  );
  if (fromPayload) return fromPayload;

  // Targeted Cloudinary fetch so the single-photo route never depends on the client list.
  const cloudinary = await getCloudinary();
  const candidates = [
    decoded,
    `${cloudinaryFolder}/${decoded}`,
    decoded.includes("/") ? decoded.split("/").pop()! : null,
  ].filter(Boolean) as string[];

  for (const publicId of candidates) {
    try {
      const resource = (await cloudinary.api.resource(publicId, {
        image_metadata: true,
        context: true,
        tags: true,
      })) as CloudinaryResource;

      const toUrl = (
        pid: string,
        options: {
          width?: number;
          quality?: string | number;
          format?: "auto";
          crop?: string;
        },
      ) =>
        cloudinary.url(pid, {
          secure: true,
          transformation: [
            {
              ...options,
              fetch_format: options.format === "auto" ? "auto" : undefined,
            },
          ],
        });

      return mapResource(resource, toUrl);
    } catch {
      // try next candidate
    }
  }

  return null;
}
