import staticPhotos, { type Photo } from "~/lib/photos";

export async function fetchManifest() {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/photos-manifest.json", { cache: "no-cache" });
    if (!res.ok) return null;

    const manifest = await res.json();
    return Array.isArray(manifest) ? (manifest as Photo[]) : null;
  } catch {
    return null;
  }
}

export async function fetchPhotos() {
  const manifest = await fetchManifest();
  return manifest ?? staticPhotos;
}

export function sortPhotos(photos: Photo[]) {
  return [...photos].sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;

    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });
}
