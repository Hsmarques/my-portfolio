import type { Photo } from "~/lib/photos";

export async function fetchPhotos(): Promise<Photo[]> {
  const res = await fetch("/api/photos", { cache: "no-cache" });

  if (!res.ok) {
    throw new Error(`Failed to load Cloudinary photos: ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? (data as Photo[]) : [];
}

export function sortPhotos(photos: Photo[]) {
  return [...photos].sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;

    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });
}
