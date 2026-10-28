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
  publicId?: string;
  src: string;
  srcFull?: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  folder?: string;
  seriesSlugs?: string[];
  /** Place from Cloudinary context/metadata only. Never invented. */
  place?: string;
  /** Year from Cloudinary context/metadata only. Never invented. */
  year?: string;
  /** Caption from Cloudinary context/metadata only. Never invented. */
  caption?: string;
  createdAt?: string;
  exif?: PhotoExif;
};

export type Series = {
  slug: string;
  title: string;
  coverId: string;
  photoIds: string[];
  /** True when derived from provisional subject rules rather than Cloudinary tags/folders. */
  provisional: boolean;
};

export type PhotoCatalog = {
  photos: Photo[];
  series: Series[];
  featured: string[];
};
