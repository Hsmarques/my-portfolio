/** Provisional series when Cloudinary has no tags or series subfolders yet. */
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

export const PROVISIONAL_FEATURED_IDS: string[] = [
  "IMG_1971+SG3",
  "5D77ED75-6E80-461D-ADC9-620A00B41FCE_1_102_o_goqcvu",
  "49308672-78E7-4D03-A8FE-91DC8275421E_1_105_c",
  "A29E5A66-544B-42C7-BB8C-1285C7869C80_1_102_o_szwmie",
  "Oxford_seujq0",
];

export function titleForSeries(slug: string): string {
  if (SERIES_TITLES[slug]) return SERIES_TITLES[slug];
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function looksLikeFilename(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (v.includes("/")) return true;
  if (/\.(jpe?g|png|webp|gif|heic|tiff?)$/i.test(v)) return true;
  if (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(v)) return true;
  if (/^IMG[_-]?\d+/i.test(v)) return true;
  if (/^[A-Za-z0-9_+%-]{20,}$/.test(v) && /[0-9]/.test(v) && /[A-Za-z]/.test(v)) {
    return true;
  }
  return false;
}

export const ALT_FALLBACK = "Photograph by Hugo Marques";
