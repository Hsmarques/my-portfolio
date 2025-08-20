import { Show, For, createMemo, createResource, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import staticPhotos from "~/lib/photos";
import type { Photo } from "~/lib/photos";

async function fetchManifest() {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch("/photos-manifest.json", { cache: "no-cache" });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function fetchPhotos() {
  if (typeof window === 'undefined') return null; // do not return placeholders on SSR
  const manifest = await fetchManifest();
  if (manifest !== null) return manifest;
  try {
    const res = await fetch("/api/photos");
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return staticPhotos;
  }
}

export default function SinglePhotoPage() {
  const params = useParams();
  const [isClient, setIsClient] = createSignal(false);
  onMount(() => setIsClient(true));

  const [remotePhotos] = createResource(isClient, async () => fetchPhotos());

  const photos = createMemo<any[]>(() => {
    const data = remotePhotos();
    if (Array.isArray(data)) return data;
    return [];
  });

  const photo = createMemo(() => photos().find((p: any) => p.id === params.id));

  const exifParts = createMemo(() => {
    const p = photo();
    if (!p?.exif) return [] as string[];
    const e = p.exif;
    const parts: string[] = [];
    if (e.camera) parts.push(e.camera);
    if (e.lens) parts.push(e.lens);
    if (e.focalLengthMm) parts.push(`${e.focalLengthMm}mm`);
    if (e.aperture) parts.push(e.aperture);
    if (e.shutter) parts.push(e.shutter);
    if (typeof e.iso === 'number') parts.push(`ISO ${e.iso}`);
    return parts;
  });

  // Get random related photos (excluding current photo)
  const relatedPhotos = createMemo(() => {
    const allPhotos = photos();
    const currentId = params.id;
    const filtered = allPhotos.filter((p: Photo) => p.id !== currentId);
    // Shuffle and take first 6
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  return (
    <main class="mx-auto max-w-7xl px-4 py-6">
      <Show when={remotePhotos.loading === false} fallback={<p class="text-gray-400">Loading…</p>}>
        <Show when={photo()} fallback={<p class="text-gray-400">Photo not found.</p>}>
          {(p: any) => (
            <div class="space-y-6">
              <div class="w-full flex items-center justify-center relative">
                <img
                  src={p().src}
                  alt={p().alt}
                  class="block w-full h-auto max-h-[calc(100dvh-200px)] object-contain rounded-lg"
                  width={p().width}
                  height={p().height}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
                
                {/* Metadata overlay */}
                <Show when={exifParts().length > 0}>
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-white bg-black/60 rounded-full px-4 py-2">
                    {exifParts().join(' • ')}
                  </div>
                </Show>
              </div>

              {/* Related Photos */}
              <Show when={relatedPhotos().length > 0}>
                <section class="mt-12">
                  <h2 class="text-xl text-gray-200 mb-6">More photos</h2>
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <For each={relatedPhotos()}>
                      {(relatedPhoto: Photo) => (
                        <a
                          href={`/photo/${relatedPhoto.id}`}
                          class="group block overflow-hidden rounded-lg border border-gray-800 hover:border-accent-400 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400"
                        >
                          <img
                            src={relatedPhoto.src}
                            alt={relatedPhoto.alt}
                            loading="lazy"
                            class="w-full h-32 sm:h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />
                        </a>
                      )}
                    </For>
                  </div>
                </section>
              </Show>
            </div>
          )}
        </Show>
      </Show>
    </main>
  );
}

