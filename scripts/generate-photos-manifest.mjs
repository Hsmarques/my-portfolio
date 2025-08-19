#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve('public');
const srcOptimized = path.join(publicDir, 'photos-optimized');
const srcOriginal = path.join(publicDir, 'photos');
const manifestPath = path.join(publicDir, 'photos-manifest.json');

async function pickSourceDir() {
  try {
    const st = await fs.stat(srcOptimized);
    if (st.isDirectory()) return { dir: srcOptimized, prefix: '/photos-optimized' };
  } catch {}
  return { dir: srcOriginal, prefix: '/photos' };
}

async function generate() {
  const { dir, prefix } = await pickSourceDir();
  // Load previous manifest to preserve fields if image metadata libs are absent
  let previous = [];
  try {
    previous = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  } catch {}
  const prevMap = new Map(previous.map((p) => [p.id, p]));

  async function getImageMeta(p) {
    try {
      const sharp = await import('sharp').then(m => m.default || m);
      return await sharp(p).metadata();
    } catch {}
    return {};
  }

  async function getExif(p) {
    try {
      const exifr = await import('exifr').then(m => m.default || m);
      return await exifr.parse(p, { iptc: true });
    } catch {}
    return {};
  }
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries.filter(e => e.isFile() && /\.(jpe?g|png|webp|tiff?)$/i.test(e.name)).map(e => e.name).sort();

    const items = await Promise.all(files.map(async (file) => {
      const filepath = path.join(dir, file);
      const base = path.parse(file).name;
      const originalCandidates = [
        path.join(srcOriginal, `${base}.jpg`),
        path.join(srcOriginal, `${base}.jpeg`),
        path.join(srcOriginal, `${base}.png`),
        path.join(srcOriginal, `${base}.tif`),
        path.join(srcOriginal, `${base}.tiff`)
      ];
      let originalPath = null;
      for (const p of originalCandidates) {
        try {
          const st = await fs.stat(p);
          if (st.isFile()) { originalPath = p; break; }
        } catch {}
      }
      let width = 0, height = 0;
      try {
        const meta = await getImageMeta(filepath);
        width = meta.width || 0;
        height = meta.height || 0;
      } catch {}

      let exif = {};
      // Prefer EXIF from original, fallback to current file
      if (originalPath) {
        exif = await getExif(originalPath);
      }
      if (!exif || Object.keys(exif).length === 0) {
        exif = await getExif(filepath);
      }

      // Created date: prefer EXIF, then file mtime
      let createdAt;
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

      const baseId = path.parse(file).name;
      const prev = prevMap.get(baseId) || {};

      return {
        id: baseId,
        src: `${prefix}/${file}`,
        alt: exif?.ImageDescription || exif?.iptc?.ObjectName || prev.alt || baseId,
        width: width || prev.width || 0,
        height: height || prev.height || 0,
        tags: prev.tags || [],
        createdAt: createdAt || prev.createdAt,
        exif: {
          camera: exif?.Model || prev?.exif?.camera || undefined,
          lens: exif?.LensModel || prev?.exif?.lens || undefined,
          focalLengthMm: exif?.FocalLengthIn35mmFilm || exif?.FocalLength || prev?.exif?.focalLengthMm || undefined,
          aperture: exif?.FNumber ? `f/${exif.FNumber}` : prev?.exif?.aperture || undefined,
          shutter: exif?.ExposureTime ? `${exif?.ExposureTime}s` : prev?.exif?.shutter || undefined,
          iso: exif?.ISO || prev?.exif?.iso || undefined
        }
      };
    }));

    // Sort newest first
    items.sort((a, b) => {
      const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
      if (ad !== bd) return bd - ad;
      return String(b.id).localeCompare(String(a.id));
    });

    await fs.writeFile(manifestPath, JSON.stringify(items, null, 2));
    console.log(`Wrote ${items.length} items to ${manifestPath}`);
  } catch (e) {
    console.error('Failed to generate manifest:', e.message);
    // still write an empty array so client fetch succeeds
    await fs.writeFile(manifestPath, '[]');
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});