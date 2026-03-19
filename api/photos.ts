import {
  getCloudinaryUrl,
  hasCloudinaryCredentials,
  listCloudinaryResources,
  type CloudinaryResource,
} from "../src/lib/cloudinary";

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";

export default async function handler(req: { method?: string }, res: any) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!hasCloudinaryCredentials()) {
    return res.status(500).json({ error: "Cloudinary credentials are not configured" });
  }

  try {
    const resources = await listCloudinaryResources(cloudinaryFolder);

    const photos = resources.map((resource: CloudinaryResource) => {
      const exif = resource.exif || {};
      const context = resource.context?.custom || {};
      const createdAt = resource.created_at
        ? new Date(resource.created_at).toISOString()
        : undefined;

      return {
        id: resource.public_id.split("/").pop() || resource.public_id,
        src: getCloudinaryUrl(resource.public_id, {
          width: 600,
          quality: "auto",
          format: "auto",
          crop: "limit",
        }),
        srcFull: getCloudinaryUrl(resource.public_id, {
          width: 1600,
          quality: "auto",
          format: "auto",
          crop: "limit",
        }),
        alt: context.alt || exif.ImageDescription || resource.public_id,
        width: resource.width || 0,
        height: resource.height || 0,
        tags: context.tags
          ? typeof context.tags === "string"
            ? context.tags.split(",").map((tag) => tag.trim())
            : context.tags
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

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching Cloudinary photos:", error);
    return res.status(500).json({ error: "Failed to fetch Cloudinary photos" });
  }
}
