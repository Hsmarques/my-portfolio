import {
  Show,
  createResource,
  createMemo,
  createSignal,
} from "solid-js";
import Gallery from "~/components/Gallery";
import PageHeader from "~/components/PageHeader";
import { fetchPhotos, sortPhotos } from "~/lib/loadPhotos";

export default function PhotosPage() {
  const [activeTags, setActiveTags] = createSignal<Set<string>>(new Set());
  const [query, setQuery] = createSignal("");

  const [remotePhotos] = createResource(fetchPhotos);
  const photos = createMemo(() => sortPhotos(remotePhotos() ?? []));

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
    <main class="mx-auto max-w-7xl px-4 pt-28 md:pt-32 pb-8">
      <PageHeader
        title="Photography"
        subtitle={<>A selection of my recent work.</>}
      />

      {/* Labels and search section - WIP, hidden for now */}
      {/* <section class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <For each={allTags}>
            {(tag) => (
              <button
                class={`px-3 py-1 rounded-full border ${
                  activeTags().has(tag)
                    ? "bg-vinho border-vinho-400 text-bacalhau"
                    : "border-superbock/20 text-bacalhau-200 hover:border-superbock/40"
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
            class="w-full bg-vinho/20 border border-superbock/20 rounded px-3 py-2 text-bacalhau-200 placeholder-vinho-300 focus:outline-none focus:ring-2 focus:ring-superbock"
          />
        </div>
      </section> */}

      <Show
        when={!remotePhotos.loading}
        fallback={<p class="text-bacalhau-300">Loading photos…</p>}
      >
        <Show
          when={filtered().length > 0}
          fallback={
            <p class="text-bacalhau-300">
              {remotePhotos.error
                ? "Unable to load Cloudinary photos right now."
                : "No Cloudinary photos found."}
            </p>
          }
        >
          <Gallery photos={filtered()} />
        </Show>
      </Show>
    </main>
  );
}
