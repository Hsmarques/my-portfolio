import { Show, createMemo, createResource, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import staticPhotos from "~/lib/photos";

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

  return (
    <main class="mx-auto max-w-7xl px-4 py-6">
      <Show when={remotePhotos.loading === false} fallback={<p class="text-gray-400">Loading…</p>}>
        <Show when={photo()} fallback={<p class="text-gray-400">Photo not found.</p>}>
          {(p: any) => (
            <div class="w-full flex items-center justify-center">
              <img
                src={p().src}
                alt={p().alt}
                class="block w-full h-auto max-h-[calc(100dvh-64px)] object-contain"
                width={p().width}
                height={p().height}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          )}
        </Show>
      </Show>
    </main>
  );
}

