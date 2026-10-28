/**
 * Single source of truth for provisional series, featured frames, and alt fallbacks.
 * Prefer Cloudinary tags/subfolders/context when Hugo fills them in.
 */

export const PROVISIONAL_SERIES_BY_ID: Record<string, string> = {
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

export const SERIES_TITLES: Record<string, string> = {
  coast: "Coast",
  oxford: "Oxford",
  portugal: "Portugal",
  quiet: "Quiet",
};

/** Featured frames for the home cycle when no `featured` tag exists yet. */
export const PROVISIONAL_FEATURED_IDS: string[] = [
  "IMG_1971+SG3",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
  "Oxford_seujq0",
];

/**
 * Written alt fallbacks when Cloudinary context.alt is missing.
 * Neutral wording only; not place/year/caption metadata.
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
    "A couple resting on a blanket beneath trees",
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

export const ALT_FALLBACK = "Photograph by Hugo Marques";

export function titleForSeries(slug: string): string {
  if (SERIES_TITLES[slug]) return SERIES_TITLES[slug];
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isFilenameLikeAlt(
  value: string | undefined,
  publicId: string,
  id: string,
): boolean {
  if (!value) return true;
  const normalized = value.trim();
  if (!normalized) return true;
  if (normalized === publicId || normalized === id) return true;
  if (normalized.endsWith(id) || normalized.endsWith(publicId)) return true;
  if (normalized.includes("/")) return true;
  if (/\.(jpe?g|png|webp|gif|heic|tiff?)$/i.test(normalized)) return true;
  if (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(normalized)) return true;
  if (/^IMG[_-]?\d+/i.test(normalized)) return true;
  if (
    /^[A-Za-z0-9_+%-]{20,}$/.test(normalized) &&
    /[0-9]/.test(normalized) &&
    /[A-Za-z]/.test(normalized)
  ) {
    return true;
  }
  return false;
}

export function resolveAlt(
  raw: string | undefined,
  publicId: string,
  id: string,
): string {
  if (raw && !isFilenameLikeAlt(raw, publicId, id)) return raw.trim();
  return ALT_FALLBACK_BY_ID[id] || ALT_FALLBACK;
}
