import {
  getPhotoById,
  hasCloudinaryCredentials,
} from "./_lib/photosCache.js";

export async function GET(request: Request) {
  if (!hasCloudinaryCredentials()) {
    return Response.json(
      { error: "Photos are unavailable right now." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id || !id.trim()) {
    return Response.json({ error: "Missing photo id." }, { status: 400 });
  }

  try {
    const photo = await getPhotoById(id.trim());
    if (!photo) {
      return Response.json({ error: "Photo not found." }, { status: 404 });
    }

    return Response.json(photo, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return Response.json(
      { error: "That photo could not be loaded right now." },
      { status: 500 },
    );
  }
}
