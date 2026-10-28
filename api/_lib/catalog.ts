import type { Photo, PhotoCatalog, Series } from "../../shared/photos";
import {
  ALT_FALLBACK_BY_ID,
  FEATURED_IDS,
  PROVISIONAL_SERIES_BY_ID,
  SERIES_DEFINITIONS,
  isFilenameLikeAlt,
} from "../../shared/seriesConfig";

type CloudinaryResource = {
  public_id: string;
  width: number;
  height: number;
  created_at?: string;
  folder?: string;
  tags?: string[];
  image_metadata?: Record<string, unknown>;
  exif?: Record<string, unknown>;
  context?: {
    custom?: Record<string, string | string[] | undefined>;
  };
};

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  catalog: PhotoCatalog;
};

let catalogCache: CacheEntry | null = null;

export function hasCloudinaryCredentials(): boolean {
  return !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
}

function configureCloudinary(cloudinary: {
  config: (options?: Record<string, unknown>) => void;
}) {
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
}

function idFromPublicId(publicId: string): string {
  return publicId.split("/").pop() || publicId;
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function yearFromValue(value: unknown): string | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  const match = raw.match(/(20\d{2}|19\d{2})/);
  return match?.[1];
}

function parseTags(resource: CloudinaryResource, context: Record<string, string | string[] | undefined>): string[] {
  const fromResource = Array.isArray(resource.tags) ? resource.tags : [];
  const rawContext = context.tags;
  const fromContext = rawContext
    ? typeof rawContext === "string"
      ? rawContext.split(",").map((tag) => tag.trim()).filter(Boolean)
      : rawContext.map((tag) => tag.trim()).filter(Boolean)
    : [];
  return [...new Set([...fromResource, ...fromContext])];
}

function seriesSlugsFor(
  id: string,
  folder: string | undefined,
  tags: string[],
): { slugs: string[]; provisional: boolean } {
  const known = new Set(SERIES_DEFINITIONS.map((s) => s.slug));
  const fromTags = tags.map((t) => t.toLowerCase()).filter((t) => known.has(t));
  if (fromTags.length > 0) {
    return { slugs: [...new Set(fromTags)], provisional: false };
  }

  if (folder) {
    const parts = folder.split("/").map((p) => p.toLowerCase());
    const fromFolder = parts.filter((p) => known.has(p) && p !== cloudinaryFolder.toLowerCase());
    if (fromFolder.length > 0) {
      return { slugs: [...new Set(fromFolder)], provisional: false };
    }
  }

  const provisional = PROVISIONAL_SERIES_BY_ID[id];
  if (provisional) return { slugs: [provisional], provisional: true };
  return { slugs: [], provisional: true };
}

function buildExif(
  resource: CloudinaryResource,
  context: Record<string, string | string[] | undefined>,
): Photo["exif"] {
  const meta = {
    ...(resource.image_metadata || {}),
    ...(resource.exif || {}),
  } as Record<string, unknown>;

  const apertureNum = meta.FNumber ?? meta.fnumber;
  const exposure = meta.ExposureTime ?? meta.exposure_time;
  const iso = meta.ISO ?? meta.ISOSpeedRatings ?? meta.iso;

  return {
    camera:
      asString(context.camera) ||
      asString(meta.Model) ||
      asString(meta.CameraModelName) ||
      undefined,
    lens:
      asString(context.lens) ||
      asString(meta.LensModel) ||
      asString(meta.Lens) ||
      undefined,
    focalLengthMm: (() => {
      const value = meta.FocalLengthIn35mmFilm ?? meta.FocalLength;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : undefined;
    })(),
    aperture: apertureNum != null ? `f/${apertureNum}` : undefined,
    shutter: exposure != null ? `${exposure}s` : undefined,
    iso: (() => {
      const num = typeof iso === "number" ? iso : Number(iso);
      return Number.isFinite(num) ? num : undefined;
    })(),
  };
}

function mapResource(
  resource: CloudinaryResource,
  toUrl: (publicId: string, width: number) => string,
): Photo {
  const publicId = resource.public_id;
  const id = idFromPublicId(publicId);
  const context = resource.context?.custom || {};
  const tags = parseTags(resource, context);
  const folder = resource.folder || publicId.split("/").slice(0, -1).join("/") || undefined;
  const { slugs } = seriesSlugsFor(id, folder, tags);

  const place =
    asString(context.place) ||
    asString(context.location) ||
    asString(context.city) ||
    undefined;
  const year =
    yearFromValue(context.year) ||
    yearFromValue(context.date) ||
    undefined;
  const caption =
    asString(context.caption) ||
    asString(context.Caption) ||
    asString(context.description) ||
    undefined;

  const contextAlt = asString(context.alt) || asString(context.Alt);
  const metaDescription = asString(resource.image_metadata?.ImageDescription);
  const altCandidate = contextAlt || metaDescription;
  const alt = !isFilenameLikeAlt(altCandidate, publicId, id)
    ? (altCandidate as string)
    : ALT_FALLBACK_BY_ID[id] || "Photograph";

  return {
    id,
    publicId,
    src: toUrl(publicId, 900),
    srcFull: toUrl(publicId, 1600),
    alt,
    width: resource.width || 0,
    height: resource.height || 0,
    tags,
    folder,
    seriesSlugs: slugs,
    place,
    year,
    caption,
    createdAt: resource.created_at
      ? new Date(resource.created_at).toISOString()
      : undefined,
    exif: buildExif(resource, context),
  };
}

function buildSeries(photos: Photo[]): Series[] {
  const bySlug = new Map<string, Photo[]>();
  for (const photo of photos) {
    for (const slug of photo.seriesSlugs || []) {
      const list = bySlug.get(slug) || [];
      list.push(photo);
      bySlug.set(slug, list);
    }
  }

  return SERIES_DEFINITIONS.flatMap((def) => {
    const list = bySlug.get(def.slug) || [];
    if (list.length === 0) return [];
    const provisional = list.every((photo) => {
      const knownTags = photo.tags.map((t) => t.toLowerCase());
      return !knownTags.includes(def.slug);
    });
    return [
      {
        slug: def.slug,
        title: def.title,
        coverId: list[0].id,
        photoIds: list.map((p) => p.id),
        provisional,
      },
    ];
  });
}

function buildFeatured(photos: Photo[]): string[] {
  const ids = new Set(photos.map((p) => p.id));
  const fromConfig = FEATURED_IDS.filter((id) => ids.has(id));
  if (fromConfig.length > 0) return fromConfig;
  return photos.slice(0, Math.min(7, photos.length)).map((p) => p.id);
}

async function fetchAllResources(cloudinary: {
  search: {
    expression: (expr: string) => {
      with_field: (field: string) => any;
      max_results: (n: number) => any;
      next_cursor: (cursor: string) => any;
      execute: () => Promise<{ resources?: CloudinaryResource[]; next_cursor?: string }>;
    };
  };
}): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    let query = cloudinary.search
      .expression(`folder:${cloudinaryFolder}`)
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(500);

    if (nextCursor) {
      query = query.next_cursor(nextCursor);
    }

    const result = await query.execute();
    resources.push(...((result.resources || []) as CloudinaryResource[]));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  resources.sort((a, b) => {
    const dateA = a.created_at ? Date.parse(a.created_at) : 0;
    const dateB = b.created_at ? Date.parse(b.created_at) : 0;
    return dateB - dateA;
  });

  return resources;
}

export async function loadCatalog(options?: { bypassCache?: boolean }): Promise<PhotoCatalog> {
  if (!options?.bypassCache && catalogCache && catalogCache.expiresAt > Date.now()) {
    return catalogCache.catalog;
  }

  if (!hasCloudinaryCredentials()) {
    throw new Error("Photos are temporarily unavailable.");
  }

  const { v2: cloudinary } = await import("cloudinary");
  configureCloudinary(cloudinary);

  const toUrl = (publicId: string, width: number) =>
    cloudinary.url(publicId, {
      secure: true,
      transformation: [
        {
          width,
          quality: "auto",
          crop: "limit",
          fetch_format: "auto",
        },
      ],
    });

  const resources = await fetchAllResources(cloudinary);
  const photos = resources.map((resource) => mapResource(resource, toUrl));
  const catalog: PhotoCatalog = {
    photos,
    series: buildSeries(photos),
    featured: buildFeatured(photos),
  };

  catalogCache = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    catalog,
  };

  return catalog;
}

export async function loadPhotoById(id: string): Promise<Photo | null> {
  if (catalogCache && catalogCache.expiresAt > Date.now()) {
    const cached = catalogCache.catalog.photos.find((p) => p.id === id);
    if (cached) return cached;
  }

  if (!hasCloudinaryCredentials()) {
    throw new Error("Photos are temporarily unavailable.");
  }

  const { v2: cloudinary } = await import("cloudinary");
  configureCloudinary(cloudinary);

  const folderPrefix = cloudinaryFolder.replace(/\/$/, "");
  const candidates = [`${folderPrefix}/${id}`, id];

  for (const publicId of candidates) {
    try {
      const resource = (await cloudinary.api.resource(publicId, {
        image_metadata: true,
        context: true,
        tags: true,
      })) as CloudinaryResource;

      const toUrl = (pid: string, width: number) =>
        cloudinary.url(pid, {
          secure: true,
          transformation: [
            {
              width,
              quality: "auto",
              crop: "limit",
              fetch_format: "auto",
            },
          ],
        });

      return mapResource(resource, toUrl);
    } catch {
      // try next candidate
    }
  }

  // Search by filename suffix as a last resort without loading the full list into the client.
  try {
    const result = await cloudinary.search
      .expression(`folder:${cloudinaryFolder} AND filename:${JSON.stringify(id)}`)
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(5)
      .execute();

    const match = ((result.resources || []) as CloudinaryResource[]).find(
      (resource) => idFromPublicId(resource.public_id) === id,
    );

    if (!match) return null;

    const toUrl = (pid: string, width: number) =>
      cloudinary.url(pid, {
        secure: true,
        transformation: [
          {
            width,
            quality: "auto",
            crop: "limit",
            fetch_format: "auto",
          },
        ],
      });

    return mapResource(match, toUrl);
  } catch {
    return null;
  }
}

export function clearCatalogCache() {
  catalogCache = null;
}
