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
  /** Full Cloudinary public_id when available */
  publicId?: string;
  src: string;
  srcFull?: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  folder?: string;
  createdAt?: string;
  /** Place from Cloudinary context/metadata only — never invented */
  place?: string;
  /** Year from Cloudinary context/metadata only — never invented */
  year?: string;
  /** Caption from Cloudinary context/metadata only — never invented */
  caption?: string;
  exif?: PhotoExif;
};

export type Series = {
  slug: string;
  title: string;
  intro: string;
  coverId: string;
  photoIds: string[];
  /** Steps series page background to paper-muted (#EDEDEB) */
  monochrome?: boolean;
  source: "folder" | "tag" | "provisional" | "featured";
};

export type CollectionsPayload = {
  series: Series[];
  featured: string[];
};
