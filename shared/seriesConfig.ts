/**
 * Data-driven series config. Prefer Cloudinary tags or subfolders when present.
 * `provisionalById` groups the current sample by subject until Hugo fills real series.
 */

export type SeriesDefinition = {
  slug: string;
  title: string;
};

/** Canonical series Hugo can extend. */
export const SERIES_DEFINITIONS: SeriesDefinition[] = [
  { slug: "coast", title: "Coast" },
  { slug: "oxford", title: "Oxford" },
  { slug: "portugal", title: "Portugal" },
  { slug: "finds", title: "Finds" },
];

/**
 * Provisional subject grouping for the current archive sample.
 * Replace by tagging assets in Cloudinary (tag = series slug) or using subfolders.
 */
export const PROVISIONAL_SERIES_BY_ID: Record<string, string> = {
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

/** Featured set for the home one-photo-per-screen sequence. */
export const FEATURED_IDS: string[] = [
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
  "DC5D2A76-348C-4717-B900-640932D35BC4_1_102_o_wmgmqi",
  "Oxford_seujq0",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c",
  "IMG_1971+SG3",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
];

/**
 * Accessible alt fallbacks when Cloudinary context.alt is missing.
 * These describe the image; they are not place/year/caption metadata.
 */
export const ALT_FALLBACK_BY_ID: Record<string, string> = {
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
  "IMG_1767+IH5":
    "Sunlight glittering across waves toward a dark beach",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c":
    "A yellow lemon lit on a dark ledge at night",
  "3840A7C6-02A3-4859-A75E-3025801EA82E_1_105_c":
    "Painted prow of a Portuguese boat on blue water",
  "EF97C194-4218-4127-93C3-8D3E90074ED3_1_105_c":
    "Handwritten cardboard sign on a metal gate reading Nao ha multibanco",
  "IMG_1971+SG3":
    "A duck swimming across dark grainy water",
};

export function isFilenameLikeAlt(value: string | undefined, publicId: string, id: string): boolean {
  if (!value) return true;
  const normalized = value.trim();
  if (!normalized) return true;
  if (normalized === publicId || normalized === id) return true;
  if (normalized.endsWith(id) || normalized.endsWith(publicId)) return true;
  // UUID / camera dump style names
  if (/^[0-9A-F-]{8,}/i.test(normalized) && normalized.includes("_")) return true;
  if (/^IMG_/i.test(normalized)) return true;
  return false;
}
