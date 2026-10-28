import { hasCloudinaryCredentials, loadCatalog, loadPhotoById } from "./_lib/catalog";

function json(data: unknown, status = 200, cacheControl?: string) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control":
        cacheControl || "s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

function friendlyError(status: number, message: string) {
  return json({ error: message }, status, "no-store");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim();
  const series = url.searchParams.get("series")?.trim();
  const view = url.searchParams.get("view")?.trim() || "catalog";

  if (!hasCloudinaryCredentials()) {
    return friendlyError(503, "Photos are temporarily unavailable.");
  }

  try {
    if (id) {
      const photo = await loadPhotoById(id);
      if (!photo) {
        return friendlyError(404, "That photograph could not be found.");
      }
      return json({ photo });
    }

    const catalog = await loadCatalog();

    if (series) {
      const entry = catalog.series.find((item) => item.slug === series);
      if (!entry) {
        return friendlyError(404, "That series could not be found.");
      }
      const photos = entry.photoIds
        .map((photoId) => catalog.photos.find((photo) => photo.id === photoId))
        .filter(Boolean);
      return json({ series: entry, photos });
    }

    if (view === "list") {
      // Backward-compatible flat list for older callers.
      return json(catalog.photos);
    }

    return json(catalog);
  } catch (error) {
    console.error("Error loading photos:", error);
    return friendlyError(500, "Photos are temporarily unavailable.");
  }
}
