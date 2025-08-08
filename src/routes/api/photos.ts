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

async function readExifBestEffort(filepath: string) {
  // Try current file first
  try {
    const exif = await exifr.parse(filepath, { iptc: true });
    if (exif && Object.keys(exif).length > 0) return exif as any;
  } catch {}

  // If it's an optimized webp, look for an original counterpart
  const basename = path.parse(filepath).name;
  const candidates = [
    path.join(process.cwd(), "public", "photos", basename + ".jpg"),
    path.join(process.cwd(), "public", "photos", basename + ".jpeg"),
    path.join(process.cwd(), "public", "photos", basename + ".png"),
    path.join(process.cwd(), "public", "photos", basename + ".tif"),
    path.join(process.cwd(), "public", "photos", basename + ".tiff"),
  ];
  for (const p of candidates) {
    try {
      const st = await fs.stat(p);
      if (st.isFile()) {
        const exif = await exifr.parse(p, { iptc: true });
        if (exif && Object.keys(exif).length > 0) return exif as any;
      }
    } catch {}
  }
  return {} as any;
}

function pickRelevantExif(exif: any) {
  return {
    camera: exif?.Model || undefined,
    lens: exif?.LensModel || undefined,
    focalLengthMm: exif?.FocalLengthIn35mmFilm || exif?.FocalLength || undefined,
    aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
    shutter: exif?.ExposureTime ? `${exif.ExposureTime}s` : undefined,
    iso: exif?.ISO || undefined
  };
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

        // EXIF best-effort: try current file, else original
        const exifRaw: any = await readExifBestEffort(filepath);
        const exif = pickRelevantExif(exifRaw);

        return {
          id: path.parse(file).name,
          src: `${publicPrefix}/${file}`,
          alt: exifRaw?.ImageDescription || exifRaw?.iptc?.ObjectName || path.parse(file).name,
          width,
          height,
          tags: [] as string[],
          exif
        };
      })
    );

    return result;
  } catch (err) {
    return [];
  }
});