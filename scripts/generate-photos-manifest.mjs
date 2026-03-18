#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve('public');
const srcOptimized = path.join(publicDir, 'photos-optimized');
const srcOriginal = path.join(publicDir, 'photos');
const manifestPath = path.join(publicDir, 'photos-manifest.json');
const cloudinaryFolder = 'my-portfolio';

function hasCloudinaryCredentials() {
  return Boolean(
    process.env.CLOUDINARY_URL || (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
}

async function loadCloudinaryManifest() {
  if (!hasCloudinaryCredentials()) return null;

  const { v2: cloudinary } = await import('cloudinary');

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  const toUrl = (publicId, options = {}) =>
    cloudinary.url(publicId, {
      secure: true,
      transformation: [options],
    });

  const result = await cloudinary.search
    .expression(`folder:${cloudinaryFolder}`)
    .max_results(500)
    .execute();

  const resources = result.resources || [];

  const items = resources.map((resource) => {
    const exif = resource.exif || {};
    const context = resource.context?.custom || {};
    const createdAt = resource.created_at
      ? new Date(resource.created_at).toISOString()
      : undefined;

    return {
      id: resource.public_id.split('/').pop() || resource.public_id,
      src: toUrl(resource.public_id, {
        width: 600,
        quality: 'auto',
        format: 'auto',
        crop: 'limit',
        fetch_format: 'auto',
      }),
      srcFull: toUrl(resource.public_id, {
        width: 1600,
        quality: 'auto',
        format: 'auto',
        crop: 'limit',
        fetch_format: 'auto',
      }),
      alt: context.alt || exif.ImageDescription || resource.public_id,
      width: resource.width || 0,
      height: resource.height || 0,
      tags: context.tags
        ? (typeof context.tags === 'string'
            ? context.tags.split(',').map((tag) => tag.trim())
            : context.tags)
        : [],
      createdAt,
      exif: {
        camera: context.camera || exif.Model || exif.CameraModelName || undefined,
        lens: context.lens || exif.LensModel || exif.Lens || undefined,
        focalLengthMm: exif.FocalLengthIn35mmFilm || exif.FocalLength || undefined,
        aperture: exif.FNumber ? `f/${exif.FNumber}` : undefined,
        shutter: exif.ExposureTime ? `${exif.ExposureTime}s` : undefined,
        iso: exif.ISO || exif.ISOSpeedRatings || undefined,
      },
    };
  });

  items.sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });

  return items;
}

async function pickSourceDir() {
  try {
    const st = await fs.stat(srcOptimized);
    if (st.isDirectory()) return { dir: srcOptimized, prefix: '/photos-optimized' };
  } catch {}
  return { dir: srcOriginal, prefix: '/photos' };
}

async function generate() {
  try {
    const cloudinaryItems = await loadCloudinaryManifest();
    if (cloudinaryItems) {
      await fs.writeFile(manifestPath, JSON.stringify(cloudinaryItems, null, 2));
      console.log(`Wrote ${cloudinaryItems.length} Cloudinary items to ${manifestPath}`);
      return;
    }
  } catch (e) {
    console.warn(`Cloudinary manifest generation failed, falling back to local files: ${e.message}`);
  }

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