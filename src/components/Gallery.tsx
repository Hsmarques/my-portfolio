import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import type { Photo } from "~/lib/photos";

export default function Gallery(props: { photos: Photo[] }) {
  const params = useParams();
  const navigate = useNavigate();

  const [expandedId, setExpandedId] = createSignal<string | null>(null);
  let expandedRef: HTMLDivElement | undefined;

  // Keep expandedId in sync with the route param
  createEffect(() => {
    const id = (params as any).id as string | undefined;
    setExpandedId(id ?? null);
  });

  // After expandedId changes and the DOM renders, scroll the expanded panel into view
  createEffect(() => {
    const id = expandedId();
    if (!id) return;
    requestAnimationFrame(() => {
      expandedRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const rows = createMemo(() => {
    // Simple 3-column masonry by distributing by shortest column height
    const columnCount = 3;
    const columns: { height: number; items: Photo[] }[] = Array.from({ length: columnCount }, () => ({ height: 0, items: [] }));

    for (const photo of props.photos) {
      const aspect = photo.height === 0 ? 1 : photo.width / photo.height;
      const target = columns.reduce((min, c) => (c.height < min.height ? c : min), columns[0]);
      target.items.push(photo);
      target.height += 1 / aspect; // approximate height contribution
    }

    return columns.map((c) => c.items);
  });

  // Map photo id to its index in the provided list so clicks open the correct image
  const idToIndex = createMemo(() => {
    const map = new Map<string, number>();
    props.photos.forEach((p, idx) => map.set(p.id, idx));
    return map;
  });

  return (
    <div class="w-full select-none" onContextMenu={(e) => e.preventDefault()}>
      <Show when={expandedId() !== null}>
        <div
          ref={expandedRef}
          class="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-black/30"
        >
          <div
            class="transition-all duration-300 ease-out"
            classList={{
              "opacity-0 max-h-0": expandedId() === null,
              "opacity-100 max-h-[90vh]": expandedId() !== null,
            }}
          >
            <img
              src={(() => {
                const id = expandedId();
                if (!id) return "";
                const idx = idToIndex().get(id);
                if (idx === undefined) return "";
                return props.photos[idx].src;
              })()}
              alt={(() => {
                const id = expandedId();
                if (!id) return "";
                const idx = idToIndex().get(id);
                if (idx === undefined) return "";
                return props.photos[idx].alt;
              })()}
              class="block w-full h-auto max-h-[85vh] object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onClick={() => navigate('/photos')}
            />
          </div>
        </div>
      </Show>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <For each={rows()}>
          {(column) => (
            <div class="space-y-3">
              <For each={column}>
                {(photo) => {
                  const index = () => idToIndex().get(photo.id) ?? 0;
                  return (
                    <button
                      class="group block w-full overflow-hidden rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-400"
                      onClick={() => navigate(`/photos/${photo.id}`)}
                      aria-label={`Open photo ${photo.alt}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        class="transition-transform duration-300 ease-out group-hover:scale-[1.02] w-full h-auto"
                        width={photo.width}
                        height={photo.height}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </button>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
 