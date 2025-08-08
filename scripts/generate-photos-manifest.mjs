#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import exifr from 'exifr';

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
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries.filter(e => e.isFile() && /\.(jpe?g|png|webp|tiff?)$/i.test(e.name)).map(e => e.name).sort();

    const items = await Promise.all(files.map(async (file) => {
      const filepath = path.join(dir, file);
      let width = 0, height = 0;
      try {
        const meta = await sharp(filepath).metadata();
        width = meta.width || 0;
        height = meta.height || 0;
      } catch {}

      let exif = {};
      try {
        exif = await exifr.parse(filepath, { iptc: true });
      } catch {}

      return {
        id: path.parse(file).name,
        src: `${prefix}/${file}`,
        alt: exif?.ImageDescription || exif?.iptc?.ObjectName || path.parse(file).name,
        width,
        height,
        tags: [],
        exif: {
          camera: exif?.Model || undefined,
          lens: exif?.LensModel || undefined,
          focalLengthMm: exif?.FocalLengthIn35mmFilm || exif?.FocalLength || undefined,
          aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
          shutter: exif?.ExposureTime ? `${exif.ExposureTime}s` : undefined,
          iso: exif?.ISO || undefined
        }
      };
    }));

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