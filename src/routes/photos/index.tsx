import {
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import Gallery from "~/components/Gallery";
import staticPhotos, { allTags } from "~/lib/photos";

async function fetchManifest() {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/photos-manifest.json", { cache: "no-cache" });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function fetchPhotos() {
  if (typeof window === "undefined") return null; // do not return placeholders on SSR
  // Prioritize Cloudinary API over static manifest
  try {
    const res = await fetch("/api/photos");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data; // Use Cloudinary photos if available
      }
    }
  } catch (err) {
    // Silently fall back to manifest
  }
  // Fallback to manifest if API fails or returns empty
  const manifest = await fetchManifest();
  if (manifest !== null) return manifest;
  // Last resort: static photos
  return staticPhotos;
}

export default function PhotosPage() {
  const [activeTags, setActiveTags] = createSignal<Set<string>>(new Set());
  const [query, setQuery] = createSignal("");

  const [isClient, setIsClient] = createSignal(false);
  onMount(() => setIsClient(true));

  const [remotePhotos] = createResource(isClient, async () => fetchPhotos());

  const photos = createMemo<any[]>(() => {
    const data = remotePhotos();
    if (Array.isArray(data)) {
      const list = [...data];
      list.sort((a: any, b: any) => {
        const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
        if (ad !== bd) return bd - ad;
        return String(b.id).localeCompare(String(a.id));
      });
      return list;
    } // manifest or API result
    return [];
  });

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = createMemo(() => {
    const selected = activeTags();
    const q = query().trim().toLowerCase();
    const list = photos();

    return list.filter((p: any) => {
      const matchesTags =
        selected.size === 0 ||
        (p.tags || []).some((t: string) => selected.has(t));
      const matchesQuery =
        q === "" ||
        (p.alt || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t: string) => t.includes(q)) ||
        (p.exif?.lens || "").toLowerCase().includes(q) ||
        (p.exif?.camera || "").toLowerCase().includes(q);
      return matchesTags && matchesQuery;
    });
  });

  return (
    <main class="mx-auto max-w-7xl px-4 py-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-100 mb-3">Photography</h1>
        <p class="text-gray-400">
          A selection of my recent work.
        </p>
      </header>

      {/* Labels and search section - WIP, hidden for now */}
      {/* <section class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <For each={allTags}>
            {(tag) => (
              <button
                class={`px-3 py-1 rounded-full border ${
                  activeTags().has(tag)
                    ? "bg-accent-600 border-accent-500 text-white"
                    : "border-gray-700 text-gray-300 hover:border-gray-600"
                }`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            )}
          </For>
        </div>
        <div class="w-full md:w-64">
          <input
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search captions, tags, or gear"
            class="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </section> */}

      <Show
        when={!remotePhotos.loading}
        fallback={<p class="text-gray-400">Loading photos…</p>}
      >
        <Show
          when={filtered().length > 0}
          fallback={
            <p class="text-gray-400">
              No photos yet. Add images to public/photos and redeploy.
            </p>
          }
        >
          <Gallery photos={filtered()} />
        </Show>
      </Show>
    </main>
  );
}
