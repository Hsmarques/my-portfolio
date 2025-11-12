import { eventHandler } from "vinxi/http";
import { listCloudinaryResources, getCloudinaryUrl, type CloudinaryResource } from "~/lib/cloudinary";

export const GET = eventHandler(async () => {
  try {
    // Check if Cloudinary credentials are available
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary credentials missing');
      return [];
    }

    // Fetch resources from the 'my-portfolio' folder in Cloudinary
    const resources = await listCloudinaryResources('my-portfolio');

    const result = await Promise.all(
      resources.map(async (resource: CloudinaryResource) => {
        // Extract metadata from Cloudinary resource
        const exif = resource.exif || {};
        const context = resource.context?.custom || {};

        // Parse created date
        let createdAt: string | undefined = undefined;
        try {
          if (resource.created_at) {
            createdAt = new Date(resource.created_at).toISOString();
          }
        } catch { }

        // Get optimized image URL (1600px width, auto quality, auto format)
        const optimizedUrl = getCloudinaryUrl(resource.public_id, {
          width: 1600,
          quality: 'auto',
          format: 'auto',
          crop: 'limit',
        });

        // Get thumbnail URL for gallery (600px width)
        const thumbnailUrl = getCloudinaryUrl(resource.public_id, {
          width: 600,
          quality: 'auto',
          format: 'auto',
          crop: 'limit',
        });

        return {
          id: resource.public_id.split('/').pop() || resource.public_id,
          src: thumbnailUrl, // Use thumbnail for gallery grid
          srcFull: optimizedUrl, // Full size for lightbox
          alt: context.alt || exif?.ImageDescription || resource.public_id,
          width: resource.width || 0,
          height: resource.height || 0,
          tags: context.tags ? (typeof context.tags === 'string' ? context.tags.split(',').map(t => t.trim()) : context.tags) : [],
          createdAt,
          exif: {
            camera: context.camera || exif?.Model || exif?.CameraModelName || undefined,
            lens: context.lens || exif?.LensModel || exif?.Lens || undefined,
            focalLengthMm: exif?.FocalLengthIn35mmFilm || exif?.FocalLength || undefined,
            aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
            shutter: exif?.ExposureTime ? `${exif.ExposureTime}s` : undefined,
            iso: exif?.ISO || exif?.ISOSpeedRatings || undefined,
          },
        };
      })
    );

    // Sort by createdAt desc when available; fallback to public_id desc
    result.sort((a: any, b: any) => {
      const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
      if (ad !== bd) return bd - ad;
      return String(b.id).localeCompare(String(a.id));
    });

    return result;
  } catch (err) {
    console.error('Error fetching photos from Cloudinary:', err);
    return [];
  }
});
