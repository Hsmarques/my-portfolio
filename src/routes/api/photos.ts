import { eventHandler } from "vinxi/http";
import fs from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

async function resolvePhotosDir() {
  const optimized = path.join(process.cwd(), "public", "photos-optimized");
  try {
    const stat = await fs.stat(optimized);
    if (stat.isDirectory()) return optimized;
  } catch {}
  return path.join(process.cwd(), "public", "photos");
}

export const GET = eventHandler(async () => {
  try {
    const photosDir = await resolvePhotosDir();
    const publicPrefix = photosDir.endsWith("photos-optimized") ? "/photos-optimized" : "/photos";

    const entries = await fs.readdir(photosDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp|tiff?)$/i.test(e.name))
      .map((e) => e.name);

    const result = await Promise.all(
      files.map(async (file) => {
        const filepath = path.join(photosDir, file);

        // Dimensions from image metadata (best-effort if sharp is available)
        let width = 0;
        let height = 0;
        try {
          const sharp = await import("sharp").then(m => m.default || m);
          const meta = await sharp(filepath).metadata();
          width = meta.width || 0;
          height = meta.height || 0;
        } catch {}

        // EXIF best-effort (likely absent on optimized webp)
        let exif: any = {};
        try {
          exif = await exifr.parse(filepath, { iptc: true });
        } catch {}

        return {
          id: path.parse(file).name,
          src: `${publicPrefix}/${file}`,
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
      })
    );

    return result;
  } catch (err) {
    return [];
  }
});