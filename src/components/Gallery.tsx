import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { Photo } from "~/lib/photos";

export default function Gallery(props: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const close = () => setSelectedIndex(null);
  const open = (index: number) => setSelectedIndex(index);

  const handleKeydown = (e: KeyboardEvent) => {
    if (selectedIndex() === null) return;
    if (e.key === "Escape") return close();
    if (e.key === "ArrowRight")
      setSelectedIndex((i) => (i === null ? 0 : Math.min(i + 1, props.photos.length - 1)));
    if (e.key === "ArrowLeft") setSelectedIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)));
  };

  onMount(() => window.addEventListener("keydown", handleKeydown));
  onCleanup(() => window.removeEventListener("keydown", handleKeydown));

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

  return (
    <div class="w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <For each={rows()}>
          {(column, colIndex) => (
            <div class="space-y-3">
              <For each={column}>
                {(photo, i) => {
                  const index = () => {
                    const previousColumns = rows().slice(0, colIndex());
                    const flattenedBefore = previousColumns.reduce((acc, arr) => acc + arr.length, 0);
                    return flattenedBefore + i();
                  };
                  return (
                    <button
                      class="group block w-full overflow-hidden rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => open(index())}
                      aria-label={`Open photo ${photo.alt}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        class="transition-transform duration-300 ease-out group-hover:scale-[1.02] w-full h-auto"
                        width={photo.width}
                        height={photo.height}
                      />
                    </button>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>

      <Show when={selectedIndex() !== null}>
        <Lightbox
          photos={props.photos}
          index={selectedIndex() as number}
          onClose={close}
          onPrev={() => setSelectedIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)))}
          onNext={() => setSelectedIndex((i) => (i === null ? 0 : Math.min(i + 1, props.photos.length - 1)))}
        />
      </Show>
    </div>
  );
}

function Lightbox(props: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = () => props.photos[props.index];
  return (
    <div class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={props.onClose}
        role="button"
        aria-label="Close lightbox"
      />
      <div class="relative h-full w-full flex items-center justify-center px-4">
        <div class="relative max-w-6xl w-full">
          <img
            src={photo().src}
            alt={photo().alt}
            class="w-full h-auto rounded-lg shadow-xl"
            width={photo().width}
            height={photo().height}
          />
          <div class="absolute top-2 right-2 flex gap-2">
            <button
              onClick={props.onClose}
              class="bg-black/60 hover:bg-black/80 text-white rounded px-3 py-1"
            >
              Close
            </button>
          </div>
          <div class="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={props.onPrev}
              class="m-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              aria-label="Previous photo"
            >
              ‹
            </button>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={props.onNext}
              class="m-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
          <div class="absolute bottom-2 left-2 right-2 text-center text-sm text-gray-300">
            {photo().alt}
          </div>
        </div>
      </div>
    </div>
  );
}