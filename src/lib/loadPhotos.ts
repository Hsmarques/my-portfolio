import type { Photo, PhotosPayload } from "~/lib/photos";

let listCache: PhotosPayload | null = null;
let listCacheAt = 0;
const CLIENT_TTL_MS = 60_000;

async function readPayload(res: Response): Promise<PhotosPayload> {
  if (!res.ok) {
    throw new Error("Photos could not be loaded right now.");
  }
  const data = await res.json();
  if (Array.isArray(data)) {
    return {
      photos: data as Photo[],
      series: [],
      featuredIds: (data as Photo[]).slice(0, 5).map((p) => p.id),
    };
  }
  return data as PhotosPayload;
}

export async function fetchPhotosPayload(): Promise<PhotosPayload> {
  const now = Date.now();
  if (listCache && now - listCacheAt < CLIENT_TTL_MS) {
    return listCache;
  }

  const res = await fetch("/api/photos", { cache: "no-cache" });
  const payload = await readPayload(res);
  listCache = payload;
  listCacheAt = now;
  return payload;
}

export async function fetchPhotos(): Promise<Photo[]> {
  const payload = await fetchPhotosPayload();
  return payload.photos;
}

/** Fetch a single photo without requiring the client to load the full list. */
export async function fetchPhotoById(id: string): Promise<Photo | null> {
  const res = await fetch(`/api/photo?id=${encodeURIComponent(id)}`, {
    cache: "no-cache",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("That photo could not be loaded right now.");
  }
  return (await res.json()) as Photo;
}

export function sortPhotos(photos: Photo[]) {
  return [...photos].sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });
}

export function friendlyErrorMessage(_error?: unknown): string {
  return "Photos could not be loaded right now. Please try again shortly.";
}
