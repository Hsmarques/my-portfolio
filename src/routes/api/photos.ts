import { eventHandler } from "vinxi/http";
import fs from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

const photosDir = path.join(process.cwd(), "public", "photos");

export const GET = eventHandler(async () => {
  try {
    const entries = await fs.readdir(photosDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp|tiff?)$/i.test(e.name))
      .map((e) => e.name);

    const result = await Promise.all(
      files.map(async (file) => {
        const filepath = path.join(photosDir, file);
        let width = 0;
        let height = 0;
        let exif: any = {};

        try {
          exif = await exifr.parse(filepath, { iptc: true });
          width = exif?.ExifImageWidth || exif?.PixelXDimension || 0;
          height = exif?.ExifImageHeight || exif?.PixelYDimension || 0;
        } catch {}

        const normalized = {
          id: path.parse(file).name,
          src: `/photos/${file}`,
          alt: exif?.ImageDescription || exif?.iptc?.ObjectName || path.parse(file).name,
          width,
          height,
          tags: [] as string[],
          exif: {
            camera: exif?.Model || undefined,
            lens: exif?.LensModel || undefined,
            focalLengthMm: exif?.FocalLengthIn35mmFilm || exif?.FocalLength || undefined,
            aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
            shutter: exif?.ExposureTime ? `${exif.ExposureTime}s` : undefined,
            iso: exif?.ISO || undefined
          }
        };

        return normalized;
      })
    );

    return result;
  } catch (err) {
    return [];
  }
});