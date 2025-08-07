#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = path.resolve('public/photos');
const outDir = path.resolve('public/photos-optimized');

const MAX_WIDTH = parseInt(process.env.MAX_WIDTH || '2000', 10);
const QUALITY = parseInt(process.env.QUALITY || '78', 10);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeOne(file) {
  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file.replace(/\.(jpe?g|png|tiff?)$/i, '.webp'));
  const image = sharp(srcPath);
  const meta = await image.metadata();

  const width = meta.width || MAX_WIDTH;
  const targetWidth = Math.min(width, MAX_WIDTH);

  await image
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  return { src: srcPath, out: outPath, width: targetWidth };
}

async function main() {
  await ensureDir(outDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && /\.(jpe?g|png|tiff?)$/i.test(e.name)).map(e => e.name);
  const results = [];
  for (const f of files) {
    try {
      const r = await optimizeOne(f);
      results.push(r);
      console.log(`Optimized: ${f} -> ${path.basename(r.out)} (${r.width}px)`);
    } catch (e) {
      console.error(`Failed: ${f}`, e.message);
    }
  }
  console.log(`Done. ${results.length} images written to ${outDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});