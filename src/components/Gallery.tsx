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

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handleKeydown);
    }
  });
  onCleanup(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener("keydown", handleKeydown);
    }
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
  const exifParts = createMemo(() => {
    const e = photo().exif;
    if (!e) return [] as string[];
    const parts: string[] = [];
    if (e.camera) parts.push(e.camera);
    if (e.lens) parts.push(e.lens);
    if (e.focalLengthMm) parts.push(`${e.focalLengthMm}mm`);
    if (e.aperture) parts.push(e.aperture);
    if (e.shutter) parts.push(e.shutter);
    if (typeof e.iso === 'number') parts.push(`ISO ${e.iso}`);
    return parts;
  });

  // Drag-to-dismiss (vertical) using Pointer Events
  const [dragStartX, setDragStartX] = createSignal<number | null>(null);
  const [dragStartY, setDragStartY] = createSignal<number | null>(null);
  const [dragDeltaX, setDragDeltaX] = createSignal(0);
  const [dragDeltaY, setDragDeltaY] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragDirection, setDragDirection] = createSignal<'none' | 'horizontal' | 'vertical'>('none');
  const ACTIVATE_AXIS_THRESHOLD_PX = 16;
  const NAV_THRESHOLD_PX = 80;
  const DISMISS_THRESHOLD_PX = 120;

  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag]')) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setDragDeltaX(0);
    setDragDeltaY(0);
    setDragDirection('none');
    setIsDragging(true);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging() || dragStartX() === null || dragStartY() === null) return;
    const dx = e.clientX - (dragStartX() as number);
    const dy = e.clientY - (dragStartY() as number);
    setDragDeltaX(dx);
    setDragDeltaY(dy);

    if (dragDirection() === 'none') {
      if (Math.abs(dx) > ACTIVATE_AXIS_THRESHOLD_PX || Math.abs(dy) > ACTIVATE_AXIS_THRESHOLD_PX) {
        setDragDirection(Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical');
      }
    }
  };

  const endDrag = () => {
    const direction = dragDirection();
    const dx = dragDeltaX();
    const dy = dragDeltaY();
    setIsDragging(false);
    setDragStartX(null);
    setDragStartY(null);
    setDragDeltaX(0);
    setDragDeltaY(0);
    setDragDirection('none');

    if (direction === 'horizontal' && Math.abs(dx) > NAV_THRESHOLD_PX) {
      if (dx > 0) {
        props.onPrev();
      } else {
        props.onNext();
      }
      return;
    }
    if (direction === 'vertical' && Math.abs(dy) > DISMISS_THRESHOLD_PX) {
      props.onClose();
    }
  };

  const onPointerUp = () => endDrag();
  const onPointerCancel = () => endDrag();

  const contentStyle = () => {
    if (!isDragging()) return {} as any;
    const direction = dragDirection();
    const dx = dragDeltaX();
    const dy = dragDeltaY();
    if (direction === 'horizontal') {
      const opacity = Math.max(0.8, 1 - Math.abs(dx) / 600);
      return { transform: `translateX(${dx}px)`, opacity: String(opacity) } as any;
    }
    // vertical (or undecided): use Y transform
    const opacity = Math.max(0.6, 1 - Math.abs(dy) / 400);
    return { transform: `translateY(${dy}px)`, opacity: String(opacity) } as any;
  };

  return (
    <div class="fixed inset-0 z-50 select-none" onContextMenu={(e) => e.preventDefault()}>
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
        onClick={props.onClose}
        role="button"
        aria-label="Close lightbox"
      />
      <div class="absolute top-4 right-4 z-50 flex gap-2">
        <ShareButton id={photo().id} />
        <button
          onClick={props.onClose}
          class="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-accent-400"
          aria-label="Close"
          title="Close (Esc)"
          data-no-drag
        >
          ×
        </button>
      </div>
      <div
         class="relative h-full w-full flex items-center justify-center px-4 touch-none cursor-zoom-out"
         onClick={props.onClose}
         onPointerDown={onPointerDown}
         onPointerMove={onPointerMove}
         onPointerUp={onPointerUp}
         onPointerCancel={onPointerCancel}
       >
        <div class="relative max-w-6xl w-full flex items-center justify-center" style={contentStyle()}>
          <img
            src={photo().src}
            alt={photo().alt}
            class="block mx-auto max-h-dvh sm:max-h-screen max-w-[95vw] w-auto h-auto object-contain rounded-lg shadow-xl cursor-pointer"
            width={photo().width}
            height={photo().height}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); props.onNext(); }}
          />
          <div class="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); props.onPrev(); }}
              class="m-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-6 text-2xl"
              aria-label="Previous photo"
              data-no-drag
            >
              ‹
            </button>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); props.onNext(); }}
              class="m-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-6 text-2xl"
              aria-label="Next photo"
              data-no-drag
            >
              ›
            </button>
          </div>
          <div class="absolute bottom-2 left-2 right-2 text-center text-sm text-gray-300">
            <div class="mb-1">{photo().alt}</div>
            <Show when={exifParts().length > 0}>
              <div class="text-xs text-gray-400">
                {exifParts().join(' • ')}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareButton(props: { id: string }) {
  const [copied, setCopied] = createSignal(false);

  const buildUrl = () => {
    if (typeof window === 'undefined') return `/photo/${props.id}`;
    const url = new URL(window.location.href);
    url.pathname = `/photo/${props.id}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  };

  const share = async () => {
    const url = buildUrl();
    const title = "Photo";
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({ title, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div class="relative" data-no-drag>
      <button
        onClick={(e) => { e.stopPropagation(); share(); }}
        class="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg leading-none focus:outline-none focus:ring-2 focus:ring-accent-400"
        aria-label="Share photo"
        title="Share"
      >
        ⤴
      </button>
      <Show when={copied()}>
        <span class="absolute right-0 mt-2 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap">Link copied</span>
      </Show>
    </div>
  );
}