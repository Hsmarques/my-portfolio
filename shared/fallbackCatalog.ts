import type { Photo, PhotoCatalog, Series } from "./photos";
import {
  ALT_FALLBACK_BY_ID,
  FEATURED_IDS,
  PROVISIONAL_SERIES_BY_ID,
  SERIES_DEFINITIONS,
} from "./seriesConfig";

/**
 * Local/dev fallback when Cloudinary credentials are unavailable.
 * Uses the live Cloudinary delivery URLs for the current 14-photo sample.
 */
const FALLBACK_RAW: Array<{
  id: string;
  publicId: string;
  width: number;
  height: number;
  createdAt: string;
}> = [
  {
    id: "Background_c6fncd",
    publicId: "Background_c6fncd",
    width: 5036,
    height: 3690,
    createdAt: "2025-11-13T11:39:05.000Z",
  },
  {
    id: "Oxford_seujq0",
    publicId: "Oxford_seujq0",
    width: 5184,
    height: 3888,
    createdAt: "2025-11-13T11:23:08.000Z",
  },
  {
    id: "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
    publicId: "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
    width: 1536,
    height: 2048,
    createdAt: "2025-11-13T11:11:41.000Z",
  },
  {
    id: "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
    publicId: "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
    width: 2048,
    height: 1536,
    createdAt: "2025-11-13T11:11:41.000Z",
  },
  {
    id: "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
    publicId: "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
    width: 2048,
    height: 1536,
    createdAt: "2025-11-13T11:11:41.000Z",
  },
  {
    id: "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828",
    publicId: "08EDB3DA-B608-4B1A-89F0-D2EF06293A79_1_105_c_cgw828",
    width: 768,
    height: 1024,
    createdAt: "2025-11-13T11:11:40.000Z",
  },
  {
    id: "BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o",
    publicId: "my-portfolio/BC71E8AC-D10D-48FE-B110-0216A872D8F6_1_102_o",
    width: 2048,
    height: 1536,
    createdAt: "2025-09-09T21:44:29.000Z",
  },
  {
    id: "635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o",
    publicId: "my-portfolio/635E2028-C47F-42E2-AF8A-7D4F8D4E3875_1_102_o",
    width: 2048,
    height: 1536,
    createdAt: "2025-09-09T21:44:28.000Z",
  },
  {
    id: "00C0FABD-995A-4598-B281-4D98E813B039_1_102_o",
    publicId: "my-portfolio/00C0FABD-995A-4598-B281-4D98E813B039_1_102_o",
    width: 1536,
    height: 2048,
    createdAt: "2025-09-09T21:44:28.000Z",
  },
  {
    id: "IMG_1767+IH5",
    publicId: "my-portfolio/IMG_1767+IH5",
    width: 1080,
    height: 810,
    createdAt: "2025-09-09T21:44:28.000Z",
  },
  {
    id: "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
    publicId: "my-portfolio/49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
    width: 768,
    height: 1024,
    createdAt: "2025-09-09T21:44:27.000Z",
  },
  {
    id: "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
    publicId: "my-portfolio/3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
    width: 1024,
    height: 768,
    createdAt: "2025-09-09T21:44:27.000Z",
  },
  {
    id: "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c",
    publicId: "my-portfolio/EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c",
    width: 1024,
    height: 768,
    createdAt: "2025-09-09T21:44:27.000Z",
  },
  {
    id: "IMG_1971+SG3",
    publicId: "my-portfolio/IMG_1971+SG3",
    width: 1080,
    height: 810,
    createdAt: "2025-09-09T21:44:27.000Z",
  },
];

const CLOUD = "https://res.cloudinary.com/dbqlz3a3q/image/upload";

function toUrl(publicId: string, width: number): string {
  return `${CLOUD}/c_limit,f_auto,q_auto,w_${width}/${publicId}`;
}

function buildFallbackPhotos(): Photo[] {
  return FALLBACK_RAW.map((raw) => {
    const slug = PROVISIONAL_SERIES_BY_ID[raw.id];
    return {
      id: raw.id,
      publicId: raw.publicId,
      src: toUrl(raw.publicId, 900),
      srcFull: toUrl(raw.publicId, 1600),
      alt: ALT_FALLBACK_BY_ID[raw.id] || "Photograph",
      width: raw.width,
      height: raw.height,
      tags: [],
      folder: raw.publicId.includes("/")
        ? raw.publicId.split("/").slice(0, -1).join("/")
        : undefined,
      seriesSlugs: slug ? [slug] : [],
      createdAt: raw.createdAt,
      exif: {},
    };
  });
}

export function getFallbackCatalog(): PhotoCatalog {
  const photos = buildFallbackPhotos();
  const series: Series[] = SERIES_DEFINITIONS.flatMap((def) => {
    const list = photos.filter((photo) => (photo.seriesSlugs || []).includes(def.slug));
    if (list.length === 0) return [];
    return [
      {
        slug: def.slug,
        title: def.title,
        coverId: list[0].id,
        photoIds: list.map((p) => p.id),
        provisional: true,
      },
    ];
  });

  const ids = new Set(photos.map((p) => p.id));
  const featured = FEATURED_IDS.filter((id) => ids.has(id));

  return { photos, series, featured };
}
