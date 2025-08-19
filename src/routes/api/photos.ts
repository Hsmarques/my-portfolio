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
        const base = path.parse(file).name;
        // If serving optimized, try to locate original for EXIF/createdAt
        const originalsDir = path.join(process.cwd(), "public", "photos");
        const originalCandidates = [
          path.join(originalsDir, `${base}.jpg`),
          path.join(originalsDir, `${base}.jpeg`),
          path.join(originalsDir, `${base}.png`),
          path.join(originalsDir, `${base}.tif`),
          path.join(originalsDir, `${base}.tiff`)
        ];
        let originalPath: string | null = null;
        for (const p of originalCandidates) {
          try {
            const st = await fs.stat(p);
            if (st.isFile()) { originalPath = p; break; }
          } catch {}
        }

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
        // Prefer EXIF from original if available, fallback to current file
        try {
          if (originalPath) {
            exif = await exifr.parse(originalPath, { iptc: true });
          } else {
            exif = await exifr.parse(filepath, { iptc: true });
          }
        } catch {}

        // Created date: prefer EXIF DateTimeOriginal/Created, then file mtime
        let createdAt: string | undefined = undefined;
        try {
          const exifDate = (exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate);
          if (exifDate instanceof Date) {
            createdAt = exifDate.toISOString();
          } else if (typeof exifDate === 'string') {
            const d = new Date(exifDate);
            if (!isNaN(d.getTime())) createdAt = d.toISOString();
          }
        } catch {}
        if (!createdAt) {
          try {
            const st = await fs.stat(originalPath || filepath);
            createdAt = new Date(st.mtimeMs).toISOString();
          } catch {}
        }

        return {
          id: path.parse(file).name,
          src: `${publicPrefix}/${file}`,
          alt: exif?.ImageDescription || exif?.iptc?.ObjectName || path.parse(file).name,
          width,
          height,
          tags: [] as string[],
          createdAt,
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

    // Sort by createdAt desc when available; fallback to name desc
    result.sort((a: any, b: any) => {
      const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
      if (ad !== bd) return bd - ad;
      return String(b.id).localeCompare(String(a.id));
    });

    return result;
  } catch (err) {
    return [];
  }
});