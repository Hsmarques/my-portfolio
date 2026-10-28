import type { Photo, PhotoCatalog, Series } from "~/lib/photos";

type CacheBucket<T> = {
  expiresAt: number;
  value: T;
};

const CLIENT_TTL_MS = 5 * 60 * 1000;
const catalogCache: { current: CacheBucket<PhotoCatalog> | null } = {
  current: null,
};
const photoCache = new Map<string, CacheBucket<Photo>>();
const seriesCache = new Map<string, CacheBucket<{ series: Series; photos: Photo[] }>>();

async function readJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    let message = "Photos are temporarily unavailable.";
    try {
      const body = await res.json();
      if (body && typeof body.error === "string") message = body.error;
    } catch {
      // keep friendly default
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchCatalog(): Promise<PhotoCatalog> {
  if (catalogCache.current && catalogCache.current.expiresAt > Date.now()) {
    return catalogCache.current.value;
  }

  const data = await readJson<PhotoCatalog>("/api/photos");
  catalogCache.current = {
    expiresAt: Date.now() + CLIENT_TTL_MS,
    value: data,
  };

  for (const photo of data.photos) {
    photoCache.set(photo.id, {
      expiresAt: Date.now() + CLIENT_TTL_MS,
      value: photo,
    });
  }

  return data;
}

/** @deprecated Prefer fetchCatalog. Kept for transitional callers. */
export async function fetchPhotos(): Promise<Photo[]> {
  const catalog = await fetchCatalog();
  return catalog.photos;
}

export async function fetchPhoto(id: string): Promise<Photo> {
  const cached = photoCache.get(id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const data = await readJson<{ photo: Photo }>(
    `/api/photos?id=${encodeURIComponent(id)}`,
  );
  photoCache.set(id, {
    expiresAt: Date.now() + CLIENT_TTL_MS,
    value: data.photo,
  });
  return data.photo;
}

export async function fetchSeries(slug: string): Promise<{ series: Series; photos: Photo[] }> {
  const cached = seriesCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const data = await readJson<{ series: Series; photos: Photo[] }>(
    `/api/photos?series=${encodeURIComponent(slug)}`,
  );
  seriesCache.set(slug, {
    expiresAt: Date.now() + CLIENT_TTL_MS,
    value: data,
  });
  for (const photo of data.photos) {
    photoCache.set(photo.id, {
      expiresAt: Date.now() + CLIENT_TTL_MS,
      value: photo,
    });
  }
  return data;
}

export function sortPhotos(photos: Photo[]) {
  return [...photos].sort((a, b) => {
    const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (ad !== bd) return bd - ad;
    return String(b.id).localeCompare(String(a.id));
  });
}

export function photoCaption(photo: Photo): string | undefined {
  const parts = [photo.place, photo.year].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}
