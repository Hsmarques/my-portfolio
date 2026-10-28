import { buildCollections } from "~/lib/collections";
import type { CollectionsPayload, Photo } from "~/lib/photos";

export async function fetchPhotos(): Promise<Photo[]> {
  const res = await fetch("/api/photos", { cache: "no-cache" });

  if (!res.ok) {
    throw new Error("Photos could not be loaded.");
  }

  const data = await res.json();
  return Array.isArray(data) ? (data as Photo[]) : [];
}

export async function fetchPhoto(id: string): Promise<Photo> {
  const res = await fetch(`/api/photos?id=${encodeURIComponent(id)}`, {
    cache: "no-cache",
  });

  if (res.status === 404) {
    throw new Error("Photo not found.");
  }

  if (!res.ok) {
    throw new Error("Photo could not be loaded.");
  }

  return (await res.json()) as Photo;
}

export async function fetchCollections(): Promise<CollectionsPayload> {
  const res = await fetch("/api/collections", { cache: "no-cache" });

  if (!res.ok) {
    // Fall back to building collections from the photo list
    const photos = await fetchPhotos();
    return buildCollections(photos);
  }

  return (await res.json()) as CollectionsPayload;
}

export function sortPhotos(photos: Photo[]) {
  return [...photos].sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;

    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });
}
