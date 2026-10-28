type CloudinaryResource = {
  public_id: string;
  width?: number;
  height?: number;
  created_at?: string;
  folder?: string;
  tags?: string[];
  exif?: Record<string, unknown>;
  image_metadata?: Record<string, unknown>;
  context?: {
    custom?: Record<string, string | string[] | undefined>;
  };
};

export type MappedPhoto = {
  id: string;
  publicId: string;
  src: string;
  srcFull: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  folder?: string;
  createdAt?: string;
  place?: string;
  year?: string;
  caption?: string;
  exif?: {
    camera?: string;
    lens?: string;
    focalLengthMm?: number;
    aperture?: string;
    shutter?: string;
    iso?: number;
  };
};

const ALT_FALLBACKS: Record<string, string> = {
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

function firstString(
  ...values: Array<string | string[] | number | undefined | null>
): string | undefined {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      const joined = value.map(String).join(", ").trim();
      if (joined) return joined;
      continue;
    }
    const text = String(value).trim();
    if (text) return text;
  }
  return undefined;
}

function yearFromValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (!text) return undefined;
  const match = text.match(/(19|20)\d{2}/);
  return match ? match[0] : text;
}

function isFilenameLike(alt: string, id: string, publicId: string): boolean {
  const normalized = alt.trim();
  if (!normalized) return true;
  if (normalized === id || normalized === publicId) return true;
  if (normalized.endsWith(id)) return true;
  if (normalized.includes("/")) return true;
  if (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(normalized)) return true;
  if (/_c[a-z0-9]{5,}$/i.test(normalized)) return true;
  return false;
}

function formatShutter(exposure: unknown): string | undefined {
  if (exposure === undefined || exposure === null || exposure === "") {
    return undefined;
  }
  const text = String(exposure).trim();
  if (!text) return undefined;
  if (text.endsWith("s")) return text;
  return `${text}s`;
}

function formatAperture(fNumber: unknown): string | undefined {
  if (fNumber === undefined || fNumber === null || fNumber === "") {
    return undefined;
  }
  const text = String(fNumber).trim();
  if (!text) return undefined;
  return text.startsWith("f/") ? text : `f/${text}`;
}

export function mapCloudinaryResource(
  resource: CloudinaryResource,
  toUrl: (
    publicId: string,
    options: {
      width?: number;
      quality?: string | number;
      format?: "auto" | "webp" | "jpg" | "png";
      crop?: string;
    },
  ) => string,
): MappedPhoto {
  const publicId = resource.public_id;
  const id = publicId.split("/").pop() || publicId;
  const context = resource.context?.custom || {};
  const metadata = resource.image_metadata || {};
  const exif = resource.exif || {};

  const contextAlt = firstString(context.alt, context.caption);
  const metaAlt = firstString(
    metadata.ImageDescription as string | undefined,
    metadata.Description as string | undefined,
  );
  const rawAlt = firstString(contextAlt, metaAlt) || "";
  const alt = !isFilenameLike(rawAlt, id, publicId)
    ? rawAlt
    : ALT_FALLBACKS[id] || "Coast and street photograph";

  const tagsFromContext = context.tags
    ? typeof context.tags === "string"
      ? context.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : context.tags.map(String)
    : [];
  const tags = Array.from(
    new Set([...(resource.tags || []), ...tagsFromContext]),
  );

  const folder =
    resource.folder ||
    (publicId.includes("/")
      ? publicId.split("/").slice(0, -1).join("/")
      : undefined);

  const place = firstString(
    context.place,
    context.location,
    context.city,
    context.country,
    metadata.Location as string | undefined,
    metadata.City as string | undefined,
  );

  const year = yearFromValue(
    firstString(
      context.year,
      context.date,
      metadata.DateCreated as string | undefined,
      metadata.CreateDate as string | undefined,
      resource.created_at,
    ),
  );

  const caption = firstString(
    context.caption,
    context.Caption,
    metadata.Caption as string | undefined,
  );

  const createdAt = resource.created_at
    ? new Date(resource.created_at).toISOString()
    : undefined;

  return {
    id,
    publicId,
    src: toUrl(publicId, {
      width: 900,
      quality: "auto",
      format: "auto",
      crop: "limit",
    }),
    srcFull: toUrl(publicId, {
      width: 1800,
      quality: "auto",
      format: "auto",
      crop: "limit",
    }),
    alt,
    width: resource.width || 0,
    height: resource.height || 0,
    tags,
    folder,
    createdAt,
    place,
    year,
    caption,
    exif: {
      camera: firstString(
        context.camera,
        exif.Model as string | undefined,
        exif.CameraModelName as string | undefined,
        metadata.Model as string | undefined,
      ),
      lens: firstString(
        context.lens,
        exif.LensModel as string | undefined,
        exif.Lens as string | undefined,
        metadata.LensModel as string | undefined,
      ),
      focalLengthMm: Number(
        exif.FocalLengthIn35mmFilm ||
          exif.FocalLength ||
          metadata.FocalLengthIn35mmFilm ||
          metadata.FocalLength ||
          0,
      ) || undefined,
      aperture: formatAperture(
        exif.FNumber || metadata.FNumber || metadata.ApertureValue,
      ),
      shutter: formatShutter(
        exif.ExposureTime || metadata.ExposureTime || metadata.ShutterSpeedValue,
      ),
      iso: Number(
        exif.ISO ||
          exif.ISOSpeedRatings ||
          metadata.ISO ||
          metadata.ISOSpeedRatings ||
          0,
      ) || undefined,
    },
  };
}
