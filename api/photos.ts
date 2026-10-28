/**
 * Self-contained Vercel serverless entry.
 * Do not import from outside api/ — classic @vercel/node builds can fail cold
 * start with FUNCTION_INVOCATION_FAILED when resolving extensionless shared paths.
 */

type PhotoExif = {
  camera?: string;
  lens?: string;
  focalLengthMm?: number;
  aperture?: string;
  shutter?: string;
  iso?: number;
};

type Photo = {
  id: string;
  publicId?: string;
  src: string;
  srcFull?: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  folder?: string;
  seriesSlugs?: string[];
  place?: string;
  year?: string;
  caption?: string;
  createdAt?: string;
  exif?: PhotoExif;
};

type Series = {
  slug: string;
  title: string;
  coverId: string;
  photoIds: string[];
  provisional: boolean;
};

type PhotoCatalog = {
  photos: Photo[];
  series: Series[];
  featured: string[];
};

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

type SeriesDefinition = {
  slug: string;
  title: string;
};

const SERIES_DEFINITIONS: SeriesDefinition[] = [
  { slug: "coast", title: "Coast" },
  { slug: "oxford", title: "Oxford" },
  { slug: "portugal", title: "Portugal" },
  { slug: "finds", title: "Finds" },
];

const PROVISIONAL_SERIES_BY_ID: Record<string, string> = {
  Background_c6fncd: "coast",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie": "coast",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu": "coast",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi": "coast",
  "IMG_1767+IH5": "coast",
  "IMG_1971+SG3": "coast",
  Oxford_seujq0: "oxford",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c": "portugal",
  "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c": "portugal",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c": "portugal",
  "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828": "finds",
  "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o": "finds",
  "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o": "finds",
  "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o": "finds",
};

const FEATURED_IDS: string[] = [
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
  "Oxford_seujq0",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
  "IMG_1971+SG3",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
];

const ALT_FALLBACK_BY_ID: Record<string, string> = {
  Background_c6fncd:
    "A silhouetted figure walking along a dark shoreline under a grainy overcast sky",
  Oxford_seujq0:
    "Red autumn vines climbing a stone building against a blue sky in Oxford",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie":
    "Tall chalk cliffs above a pebble beach with small figures at the shore",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu":
    "Two people sitting on a seafront bench facing open water",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi":
    "A lone walker on a green headland above a curving beach",
  "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828":
    "An older couple resting on a blanket beneath trees",
  "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o":
    "Soft light reflecting in a dark pool among rocks",
  "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o":
    "A pine cone resting in sunlit grass",
  "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o":
    "A white crane framed by green leaves against blue sky",
  "IMG_1767+IH5": "Sunlight glittering across waves toward a dark beach",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c":
    "A yellow lemon lit on a dark ledge at night",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c":
    "Painted prow of a Portuguese boat on blue water",
  "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c":
    "Handwritten cardboard sign on a metal gate reading Nao ha multibanco",
  "IMG_1971+SG3": "A duck swimming across dark grainy water",
};

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  catalog: PhotoCatalog;
};

let catalogCache: CacheEntry | null = null;

function hasCloudinaryCredentials() {
  return !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
}

function isFilenameLikeAlt(
  value: string | undefined,
  publicId: string,
  id: string,
): boolean {
  if (!value) return true;
  const normalized = value.trim();
  if (!normalized) return true;
  if (normalized === publicId || normalized === id) return true;
  if (normalized.endsWith(id) || normalized.endsWith(publicId)) return true;
  if (/^[0-9A-F-]{8,}/i.test(normalized) && normalized.includes("_")) return true;
  if (/^IMG_/i.test(normalized)) return true;
  return false;
}

function json(data: unknown, status = 200, cacheControl?: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        cacheControl || "s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

function friendlyError(status: number, message: string) {
  return json({ error: message }, status, "no-store");
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

function parseTags(
  resource: CloudinaryResource,
  context: Record<string, string | string[] | undefined>,
): string[] {
  const fromResource = Array.isArray(resource.tags) ? resource.tags : [];
  const rawContext = context.tags;
  const fromContext = rawContext
    ? typeof rawContext === "string"
      ? rawContext
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : rawContext.map((tag) => tag.trim()).filter(Boolean)
    : [];
  return [...new Set([...fromResource, ...fromContext])];
}

function seriesSlugsFor(
  id: string,
  folder: string | undefined,
  tags: string[],
): string[] {
  const known = new Set(SERIES_DEFINITIONS.map((s) => s.slug));
  const fromTags = tags.map((t) => t.toLowerCase()).filter((t) => known.has(t));
  if (fromTags.length > 0) return [...new Set(fromTags)];

  if (folder) {
    const parts = folder.split("/").map((p) => p.toLowerCase());
    const fromFolder = parts.filter(
      (p) => known.has(p) && p !== cloudinaryFolder.toLowerCase(),
    );
    if (fromFolder.length > 0) return [...new Set(fromFolder)];
  }

  const provisional = PROVISIONAL_SERIES_BY_ID[id];
  return provisional ? [provisional] : [];
}

function buildExif(
  resource: CloudinaryResource,
  context: Record<string, string | string[] | undefined>,
): PhotoExif {
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
  const folder =
    resource.folder ||
    publicId.split("/").slice(0, -1).join("/") ||
    undefined;
  const slugs = seriesSlugsFor(id, folder, tags);

  const place =
    asString(context.place) ||
    asString(context.location) ||
    asString(context.city) ||
    undefined;
  const year =
    yearFromValue(context.year) || yearFromValue(context.date) || undefined;
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
      with_field: (field: string) => {
        with_field: (field: string) => {
          with_field: (field: string) => {
            max_results: (n: number) => {
              next_cursor: (cursor: string) => {
                execute: () => Promise<{
                  resources?: CloudinaryResource[];
                  next_cursor?: string;
                }>;
              };
              execute: () => Promise<{
                resources?: CloudinaryResource[];
                next_cursor?: string;
              }>;
            };
          };
        };
      };
    };
  };
}): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    let query: any = cloudinary.search
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

async function loadCatalog(): Promise<PhotoCatalog> {
  if (catalogCache && catalogCache.expiresAt > Date.now()) {
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

async function loadPhotoById(id: string): Promise<Photo | null> {
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id")?.trim();
    const series = url.searchParams.get("series")?.trim();
    const view = url.searchParams.get("view")?.trim() || "catalog";

    if (!hasCloudinaryCredentials()) {
      return friendlyError(503, "Photos are temporarily unavailable.");
    }

    if (id) {
      const photo = await loadPhotoById(id);
      if (!photo) {
        return friendlyError(404, "That photograph could not be found.");
      }
      return json({ photo });
    }

    const catalog = await loadCatalog();

    if (series) {
      const entry = catalog.series.find((item) => item.slug === series);
      if (!entry) {
        return friendlyError(404, "That series could not be found.");
      }
      const photos = entry.photoIds
        .map((photoId) => catalog.photos.find((photo) => photo.id === photoId))
        .filter(Boolean);
      return json({ series: entry, photos });
    }

    if (view === "list") {
      return json(catalog.photos);
    }

    return json(catalog);
  } catch (error) {
    console.error("Error loading photos:", error);
    return friendlyError(500, "Photos are temporarily unavailable.");
  }
}
