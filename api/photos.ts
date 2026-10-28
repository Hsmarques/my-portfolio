import { mapCloudinaryResource, type MappedPhoto } from "./_lib/mapPhoto";

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "my-portfolio";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  photos: MappedPhoto[];
  expiresAt: number;
};

let listCache: CacheEntry | null = null;

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

async function getCloudinary() {
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

  return cloudinary;
}

function makeToUrl(cloudinary: Awaited<ReturnType<typeof getCloudinary>>) {
  return (
    publicId: string,
    options: {
      width?: number;
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
}

async function listAllResources(
  cloudinary: Awaited<ReturnType<typeof getCloudinary>>,
) {
  const resources: any[] = [];
  let nextCursor: string | undefined;

  do {
    let request = cloudinary.search
      .expression(`folder:${cloudinaryFolder}/* OR folder:${cloudinaryFolder}`)
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(500)
      .sort_by("created_at", "desc");

    if (nextCursor) {
      request = request.next_cursor(nextCursor);
    }

    const result = await request.execute();
    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return resources;
}

async function getCachedPhotos(
  cloudinary: Awaited<ReturnType<typeof getCloudinary>>,
): Promise<MappedPhoto[]> {
  if (listCache && listCache.expiresAt > Date.now()) {
    return listCache.photos;
  }

  const toUrl = makeToUrl(cloudinary);
  const resources = await listAllResources(cloudinary);
  const photos = resources.map((resource) =>
    mapCloudinaryResource(resource, toUrl),
  );

  listCache = {
    photos,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return photos;
}

async function fetchSinglePhoto(
  cloudinary: Awaited<ReturnType<typeof getCloudinary>>,
  id: string,
): Promise<MappedPhoto | null> {
  const toUrl = makeToUrl(cloudinary);
  const candidates = id.includes("/")
    ? [id]
    : [`${cloudinaryFolder}/${id}`, id];

  for (const publicId of candidates) {
    try {
      const resource = await cloudinary.api.resource(publicId, {
        resource_type: "image",
        image_metadata: true,
        context: true,
        tags: true,
      });
      return mapCloudinaryResource(resource, toUrl);
    } catch {
      // try next candidate
    }
  }

  // Search by filename suffix without loading the full cached list first
  try {
    const result = await cloudinary.search
      .expression(
        `(folder:${cloudinaryFolder}/* OR folder:${cloudinaryFolder}) AND public_id:${id}`,
      )
      .with_field("context")
      .with_field("tags")
      .with_field("image_metadata")
      .max_results(1)
      .execute();

    const resource = result.resources?.[0];
    if (resource) return mapCloudinaryResource(resource, toUrl);
  } catch {
    // fall through
  }

  return null;
}

export async function GET(request: Request) {
  if (!hasCloudinaryCredentials()) {
    return Response.json(
      { error: "Photos are unavailable right now." },
      { status: 500 },
    );
  }

  try {
    const cloudinary = await getCloudinary();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const photo = await fetchSinglePhoto(cloudinary, id);
      if (!photo) {
        return Response.json(
          { error: "Photo not found." },
          { status: 404 },
        );
      }

      return Response.json(photo, {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
        },
      });
    }

    const photos = await getCachedPhotos(cloudinary);

    return Response.json(photos, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching photos:", error);

    return Response.json(
      { error: "Photos could not be loaded. Please try again later." },
      { status: 500 },
    );
  }
}
