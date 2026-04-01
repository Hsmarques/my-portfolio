export type Photo = {
  id: string;
  src: string;
  srcFull?: string; // Optional full-size URL for lightbox
  alt: string;
  width: number;
  height: number;
  tags: string[];
  createdAt?: string;
  exif?: {
    camera?: string;
    lens?: string;
    focalLengthMm?: number;
    aperture?: string; // e.g. f/4
    shutter?: string;  // e.g. 1/250s
    iso?: number;
  };
};