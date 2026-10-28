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
  seriesSlug?: string;
  place?: string;
  year?: number;
  caption?: string;
  createdAt?: string;
  featured?: boolean;
  exif?: PhotoExif;
};

export type Series = {
  id: string;
  slug: string;
  title: string;
  coverId: string;
  photoIds: string[];
};

export type PhotosPayload = {
  photos: Photo[];
  series: Series[];
  featuredIds: string[];
};
