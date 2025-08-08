import { Show, createMemo, createResource } from "solid-js";
import Gallery from "~/components/Gallery";
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
  if (typeof window === 'undefined') return staticPhotos;
  const manifest = await fetchManifest();
  if (manifest) return manifest;
  try {
    const res = await fetch("/api/photos");
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return staticPhotos;
  }
}

export default function Home() {
  const [photos] = createResource(fetchPhotos);
  const safeList = createMemo<any[]>(() => {
    const data = photos();
    if (Array.isArray(data)) return data;
    return Array.isArray(staticPhotos) ? (staticPhotos as any[]) : [];
  });

  return (
    <main class="mx-auto max-w-7xl">
      <Show when={safeList().length > 0}>
        <section class="relative select-none" onContextMenu={(e) => e.preventDefault()}>
          <img
            src={safeList()[0].src}
            alt={safeList()[0].alt}
            class="w-full h-[48vh] sm:h-[60vh] object-cover object-center opacity-90"
            width={safeList()[0].width}
            height={safeList()[0].height}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div class="absolute bottom-6 left-6 right-6">
            <h1 class="text-3xl sm:text-5xl font-bold text-white drop-shadow">Photography & Code</h1>
            <p class="mt-3 max-w-2xl text-gray-200 drop-shadow">
              I’m Hugo — I capture landscapes, streets, and portraits. I also build
              fast web experiences. Enjoy the photos; the code lives in the blog.
            </p>
            <div class="mt-4 flex gap-3">
              <a href="/photos" class="bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 rounded">View photos</a>
              <a href="/blog" class="bg-black/50 hover:bg-black/70 text-white font-semibold px-4 py-2 rounded border border-white/30">Read blog</a>
            </div>
          </div>
        </section>

        <section class="px-4 py-8">
          <h2 class="text-xl text-gray-200 mb-4">Recent work</h2>
          <Gallery photos={safeList().slice(0, 6)} />
          <div class="text-center mt-6">
            <a href="/photos" class="text-accent-400 hover:text-accent-300 font-medium">See full gallery →</a>
          </div>
        </section>
      </Show>
    </main>
  );
}
