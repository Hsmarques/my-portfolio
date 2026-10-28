import {
  getPhotosPayload,
  hasCloudinaryCredentials,
} from "./_lib/photosCache.js";

export async function GET() {
  if (!hasCloudinaryCredentials()) {
    return Response.json(
      { error: "Photos are unavailable right now." },
      { status: 500 },
    );
  }

  try {
    const payload = await getPhotosPayload();
    return Response.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return Response.json(
      { error: "Photos could not be loaded right now." },
      { status: 500 },
    );
  }
}
