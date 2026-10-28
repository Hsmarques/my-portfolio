import type { CollectionsPayload, Photo, Series } from "~/lib/photos";

/**
 * Provisional series for the current sample when Cloudinary has no
 * subfolders or series tags yet. Hugo can replace this by tagging or
 * moving assets into folder paths; buildCollections prefers those.
 */
export const PROVISIONAL_SERIES: Omit<Series, "source">[] = [
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

/** Hand picked featured set for Hugo to edit later */
export const FEATURED_IDS = [
  "Background_c6fncd",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
  "Oxford_seujq0",
];

/** Descriptive alt when Cloudinary has no real alt — never a filename */
export const ALT_FALLBACKS: Record<string, string> = {
  Background_c6fncd:
    "Lone walker on a dark shoreline under a grainy cloudy sky",
  Oxford_seujq0:
    "Brick townhouse covered in red autumn ivy against a blue sky",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie":
    "Chalk cliffs above a pebble beach with small figures on the shore",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu":
    "Couple sitting on a seafront bench facing the open water",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi":
    "Lone walker on a grassy headland above a sunlit beach",
  "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828":
    "Couple resting on a blanket in a sun dappled park",
  "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o":
    "Sunlight on dark water with floating leaves",
  "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o":
    "Pinecone resting in green grass",
  "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o":
    "White construction crane framed by green leaves against a blue sky",
  "IMG_1767+IH5":
    "Dark sand and sunlit waves under a pale sky",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c":
    "Yellow lemon on a concrete ledge in deep shadow",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c":
    "Painted Portuguese boat prow on blue water",
  "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c":
    "Handwritten cardboard sign on a green lattice gate",
  "IMG_1971+SG3":
    "Duck swimming on dark grainy water",
};

const SERIES_TAG_PREFIX = "series:";
const FEATURED_TAG = "featured";

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

function isFilenameAlt(alt: string, photo: Photo): boolean {
  const normalized = alt.trim();
  if (!normalized) return true;
  if (normalized === photo.id || normalized === photo.publicId) return true;
  if (normalized.endsWith(photo.id)) return true;
  if (normalized.includes("/")) return true;
  // UUID-like or Cloudinary public id patterns
  if (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(normalized)) return true;
  if (/_[a-z0-9]{5,}$/i.test(normalized) && normalized.length > 40) return true;
  return false;
}

export function resolveAlt(photo: Photo): string {
  const raw = (photo.alt || "").trim();
  if (raw && !isFilenameAlt(raw, photo)) return raw;
  return (
    ALT_FALLBACKS[photo.id] ||
    "Coast and street photograph"
  );
}

export function photoCaptionLine(photo: Photo): string | undefined {
  const parts: string[] = [];
  if (photo.place) parts.push(photo.place);
  if (photo.year) parts.push(String(photo.year));
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function seriesFromFolders(photos: Photo[]): Series[] {
  const byFolder = new Map<string, Photo[]>();

  for (const photo of photos) {
    const folder = photo.folder || "";
    const parts = folder.split("/").filter(Boolean);
    // Expect root folder + series subfolder, e.g. my-portfolio/coast
    if (parts.length < 2) continue;
    const seriesKey = parts[parts.length - 1];
    const list = byFolder.get(seriesKey) || [];
    list.push(photo);
    byFolder.set(seriesKey, list);
  }

  if (byFolder.size === 0) return [];

  return [...byFolder.entries()].map(([key, list]) => {
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
}

function seriesFromTags(photos: Photo[]): Series[] {
  const byTag = new Map<string, Photo[]>();

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

  if (byTag.size === 0) return [];

  return [...byTag.entries()].map(([key, list]) => {
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
}

function featuredFromTags(photos: Photo[]): string[] {
  return photos
    .filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase() === FEATURED_TAG),
    )
    .map((p) => p.id);
}

function provisionalSeries(photos: Photo[]): Series[] {
  const ids = new Set(photos.map((p) => p.id));

  return PROVISIONAL_SERIES.map((series) => {
    const photoIds = series.photoIds.filter((id) => ids.has(id));
    const coverId =
      photoIds.includes(series.coverId) ? series.coverId : photoIds[0] || "";
    return {
      ...series,
      coverId,
      photoIds,
      source: "provisional" as const,
    };
  }).filter((s) => s.photoIds.length > 0);
}

export function buildCollections(photos: Photo[]): CollectionsPayload {
  const fromFolders = seriesFromFolders(photos);
  const fromTags = seriesFromTags(photos);
  const series =
    fromFolders.length > 0
      ? fromFolders
      : fromTags.length > 0
        ? fromTags
        : provisionalSeries(photos);

  const featuredTags = featuredFromTags(photos);
  const featured =
    featuredTags.length > 0
      ? featuredTags
      : FEATURED_IDS.filter((id) => photos.some((p) => p.id === id));

  return { series, featured };
}

export function getSeriesBySlug(
  collections: CollectionsPayload,
  slug: string,
): Series | undefined {
  return collections.series.find((s) => s.slug === slug);
}

export function photosForSeries(
  photos: Photo[],
  series: Series,
): Photo[] {
  const map = new Map(photos.map((p) => [p.id, p]));
  return series.photoIds
    .map((id) => map.get(id))
    .filter((p): p is Photo => Boolean(p));
}
