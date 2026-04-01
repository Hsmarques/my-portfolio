type CloudinaryResource = {
  public_id: string;
  width: number;
  height: number;
  created_at?: string;
  exif?: Record<string, any>;
  context?: {
    custom?: {
      alt?: string;
      tags?: string | string[];
      camera?: string;
      lens?: string;
    };
  };
};

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";

function hasCloudinaryCredentials() {
  return !!(
    process.env.CLOUDINARY_URL ||
    (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
}

export async function GET() {
  if (!hasCloudinaryCredentials()) {
    return Response.json(
      { error: "Cloudinary credentials are not configured" },
      { status: 500 },
    );
  }

  try {
    const { v2: cloudinary } = await import("cloudinary");

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

    const result = await cloudinary.search
      .expression(`folder:${cloudinaryFolder}`)
      .max_results(500)
      .execute();

    const resources = ((result.resources || []) as CloudinaryResource[]).sort((a, b) => {
      const dateA = a.created_at ? Date.parse(a.created_at) : 0;
      const dateB = b.created_at ? Date.parse(b.created_at) : 0;
      return dateB - dateA;
    });

    const toUrl = (
      publicId: string,
      options: {
        width?: number;
        height?: number;
        quality?: string | number;
        format?: "auto" | "webp" | "jpg" | "png";
        crop?: string;
      },
    ) =>
      cloudinary.url(publicId, {
        secure: true,
        transformation: [
          {
            ...options,
            fetch_format: options.format === "auto" ? "auto" : undefined,
          },
        ],
      });

    const photos = resources.map((resource) => {
      const exif = resource.exif || {};
      const context = resource.context?.custom || {};
      const createdAt = resource.created_at
        ? new Date(resource.created_at).toISOString()
        : undefined;

      return {
        id: resource.public_id.split("/").pop() || resource.public_id,
        src: toUrl(resource.public_id, {
          width: 600,
          quality: "auto",
          format: "auto",
          crop: "limit",
        }),
        srcFull: toUrl(resource.public_id, {
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

    return Response.json(photos, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching Cloudinary photos:", error);
    const details = error instanceof Error ? error.message : String(error);

    return Response.json(
      {
        error: "Failed to fetch Cloudinary photos",
        details,
      },
      { status: 500 },
    );
  }
}
