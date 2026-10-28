/**
 * Collections endpoint — derives series from Cloudinary folders/tags,
 * falling back to provisional subject groups when none exist.
 *
 * Note: provisional grouping mirrors src/lib/collections.ts so Hugo can
 * later replace it with real folder/tag data without a UI rewrite.
 */

import { mapCloudinaryResource, type MappedPhoto } from "./_lib/mapPhoto";

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";
const CACHE_TTL_MS = 5 * 60 * 1000;
const SERIES_TAG_PREFIX = "series:";
const FEATURED_TAG = "featured";

type Series = {
  slug: string;
  title: string;
  intro: string;
  coverId: string;
  photoIds: string[];
  monochrome?: boolean;
  source: "folder" | "tag" | "provisional" | "featured";
};

const PROVISIONAL_SERIES: Omit<Series, "source">[] = [
  {
    slug: "wide-water",
    title: "Wide water",
    intro: "Coast paths, chalk cliffs, and the quiet edge of the shore.",
    monochrome: true,
    coverId: "Background_c6fncd",
    photoIds: [
      "Background_c6fncd",
      "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
      "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
      "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
      "IMG_1767+IH5",
      "IMG_1971+SG3",
    ],
  },
  {
    slug: "oxford",
    title: "Oxford",
    intro: "Brick, ivy, and the streets between lectures.",
    monochrome: false,
    coverId: "Oxford_seujq0",
    photoIds: [
      "Oxford_seujq0",
      "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o",
      "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828",
      "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o",
      "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o",
    ],
  },
  {
    slug: "portugal",
    title: "Portugal",
    intro: "Painted boats, handwritten signs, and light on stone.",
    monochrome: false,
    coverId: "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
    photoIds: [
      "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
      "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c",
      "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
    ],
  },
];

const FEATURED_IDS = [
  "Background_c6fncd",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
  "Oxford_seujq0",
];

type CacheEntry = {
  payload: { series: Series[]; featured: string[] };
  expiresAt: number;
};

let cache: CacheEntry | null = null;

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

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCollections(photos: MappedPhoto[]) {
  const byFolder = new Map<string, MappedPhoto[]>();
  for (const photo of photos) {
    const folder = photo.folder || "";
    const parts = folder.split("/").filter(Boolean);
    if (parts.length < 2) continue;
    const key = parts[parts.length - 1];
    const list = byFolder.get(key) || [];
    list.push(photo);
    byFolder.set(key, list);
  }

  let series: Series[] = [];

  if (byFolder.size > 0) {
    series = [...byFolder.entries()].map(([key, list]) => {
      const slug = slugify(key);
      return {
        slug,
        title: titleFromSlug(slug),
        intro: "",
        coverId: list[0]?.id || "",
        photoIds: list.map((p) => p.id),
        source: "folder" as const,
      };
    });
  } else {
    const byTag = new Map<string, MappedPhoto[]>();
    for (const photo of photos) {
      for (const tag of photo.tags || []) {
        const lower = tag.toLowerCase();
        if (!lower.startsWith(SERIES_TAG_PREFIX)) continue;
        const key = lower.slice(SERIES_TAG_PREFIX.length).trim();
        if (!key) continue;
        const list = byTag.get(key) || [];
        list.push(photo);
        byTag.set(key, list);
      }
    }

    if (byTag.size > 0) {
      series = [...byTag.entries()].map(([key, list]) => {
        const slug = slugify(key);
        return {
          slug,
          title: titleFromSlug(slug),
          intro: "",
          coverId: list[0]?.id || "",
          photoIds: list.map((p) => p.id),
          source: "tag" as const,
        };
      });
    } else {
      const ids = new Set(photos.map((p) => p.id));
      series = PROVISIONAL_SERIES.map((entry) => {
        const photoIds = entry.photoIds.filter((id) => ids.has(id));
        const coverId = photoIds.includes(entry.coverId)
          ? entry.coverId
          : photoIds[0] || "";
        return {
          ...entry,
          coverId,
          photoIds,
          source: "provisional" as const,
        };
      }).filter((s) => s.photoIds.length > 0);
    }
  }

  const featuredTagged = photos
    .filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase() === FEATURED_TAG),
    )
    .map((p) => p.id);

  const featured =
    featuredTagged.length > 0
      ? featuredTagged
      : FEATURED_IDS.filter((id) => photos.some((p) => p.id === id));

  return { series, featured };
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

async function listAllPhotos(
  cloudinary: Awaited<ReturnType<typeof getCloudinary>>,
): Promise<MappedPhoto[]> {
  const resources: any[] = [];
  let nextCursor: string | undefined;

  do {
    let request = cloudinary.search
      .expression(`folder:${cloudinaryFolder}/* OR folder:${cloudinaryFolder}`)
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(500)
      .sort_by("created_at", "desc");

    if (nextCursor) {
      request = request.next_cursor(nextCursor);
    }

    const result = await request.execute();
    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  const toUrl = (
    publicId: string,
    options: {
      width?: number;
      quality?: string | number;
      format?: "auto" | "webp" | "jpg" | "png";
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

  return resources.map((resource) => mapCloudinaryResource(resource, toUrl));
}

export async function GET() {
  if (!hasCloudinaryCredentials()) {
    return Response.json(
      { error: "Collections are unavailable right now." },
      { status: 500 },
    );
  }

  try {
    if (cache && cache.expiresAt > Date.now()) {
      return Response.json(cache.payload, {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
        },
      });
    }

    const cloudinary = await getCloudinary();
    const photos = await listAllPhotos(cloudinary);
    const payload = buildCollections(photos);

    cache = {
      payload,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return Response.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return Response.json(
      { error: "Collections could not be loaded. Please try again later." },
      { status: 500 },
    );
  }
}
