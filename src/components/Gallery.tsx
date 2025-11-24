import {
  For,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Photo } from "~/lib/photos";
import { useGlitch } from "~/lib/GlitchContext";

export default function Gallery(props: { photos: Photo[] }) {
  const { toggleBrutalistMode } = useGlitch();
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const close = () => setSelectedIndex(null);
  const open = (index: number) => setSelectedIndex(index);

  const handleKeydown = (e: KeyboardEvent) => {
    if (selectedIndex() === null) return;
    if (e.key === "Escape") return close();
    if (e.key === "ArrowRight")
      setSelectedIndex((i) =>
        i === null ? 0 : Math.min(i + 1, props.photos.length - 1)
      );
    if (e.key === "ArrowLeft")
      setSelectedIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)));
  };

  const [columnCount, setColumnCount] = createSignal(3);

  // Update column count based on window size
  onMount(() => {
    if (typeof window === "undefined") return;

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColumnCount(3); // lg: 3 columns
      } else if (width >= 640) {
        setColumnCount(2); // sm: 2 columns
      } else {
        setColumnCount(1); // base: 1 column
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    window.addEventListener("keydown", handleKeydown);

    onCleanup(() => {
      window.removeEventListener("resize", updateColumns);
      window.removeEventListener("keydown", handleKeydown);
    });
  });

  const rows = createMemo(() => {
    // Simple masonry by distributing by shortest column height
    const cols = columnCount();
    const columns: { height: number; items: Photo[] }[] = Array.from(
      { length: cols },
      () => ({ height: 0, items: [] })
    );

    for (const photo of props.photos) {
      const aspect = photo.height === 0 ? 1 : photo.width / photo.height;
      const target = columns.reduce(
        (min, c) => (c.height < min.height ? c : min),
        columns[0]
      );
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={rows()}>
          {(column) => (
            <div class="space-y-4">
                <For each={column}>
                {(photo) => {
                  const index = () => idToIndex().get(photo.id) ?? 0;
                  // First photo in the entire list is the glitch trigger
                  const isGlitchTrigger = () => index() === 0;
                  
                  return (
                    <button
                      class={`group relative block w-full overflow-hidden rounded-sm bg-gray-900 focus:outline-none transition-all duration-500 hover:shadow-2xl hover:shadow-accent-900/20 ${
                        isGlitchTrigger() ? "glitch-trigger" : ""
                      }`}
                      onClick={() => {
                        if (isGlitchTrigger()) {
                          toggleBrutalistMode();
                        } else {
                          open(index());
                        }
                      }}
                      aria-label={`Open photo ${photo.alt}`}
                      title={isGlitchTrigger() ? "✨ Est. 1895 - A Window to the Past" : undefined}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        class="transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 w-full h-auto opacity-90 group-hover:opacity-100"
                        width={photo.width}
                        height={photo.height}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
          onPrev={() =>
            setSelectedIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)))
          }
          onNext={() =>
            setSelectedIndex((i) =>
              i === null ? 0 : Math.min(i + 1, props.photos.length - 1)
            )
          }
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
  const [loaded, setLoaded] = createSignal(false);
  
  // Reset loaded state when photo changes
  createMemo(() => {
    photo();
    setLoaded(false);
  });

  // Preload next and prev images
  createMemo(() => {
    const idx = props.index;
    const next = idx < props.photos.length - 1 ? props.photos[idx + 1] : null;
    const prev = idx > 0 ? props.photos[idx - 1] : null;
    
    [next, prev].forEach(p => {
      if (p) {
        const img = new Image();
        img.src = (p as any).srcFull || p.src;
      }
    });
  });

  // Drag-to-dismiss (vertical) using Pointer Events
  const [dragStartX, setDragStartX] = createSignal<number | null>(null);
  const [dragStartY, setDragStartY] = createSignal<number | null>(null);
  const [dragDeltaX, setDragDeltaX] = createSignal(0);
  const [dragDeltaY, setDragDeltaY] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragDirection, setDragDirection] = createSignal<
    "none" | "horizontal" | "vertical"
  >("none");
  const ACTIVATE_AXIS_THRESHOLD_PX = 16;
  const NAV_THRESHOLD_PX = 80;
  const DISMISS_THRESHOLD_PX = 120;

  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-drag]")) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setDragDeltaX(0);
    setDragDeltaY(0);
    setDragDirection("none");
    setIsDragging(true);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging() || dragStartX() === null || dragStartY() === null) return;
    const dx = e.clientX - (dragStartX() as number);
    const dy = e.clientY - (dragStartY() as number);
    setDragDeltaX(dx);
    setDragDeltaY(dy);

    if (dragDirection() === "none") {
      if (
        Math.abs(dx) > ACTIVATE_AXIS_THRESHOLD_PX ||
        Math.abs(dy) > ACTIVATE_AXIS_THRESHOLD_PX
      ) {
        setDragDirection(
          Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical"
        );
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
    setDragDirection("none");

    if (direction === "horizontal" && Math.abs(dx) > NAV_THRESHOLD_PX) {
      if (dx > 0) {
        props.onPrev();
      } else {
        props.onNext();
      }
      return;
    }
    if (direction === "vertical" && Math.abs(dy) > DISMISS_THRESHOLD_PX) {
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
    if (direction === "horizontal") {
      const opacity = Math.max(0.8, 1 - Math.abs(dx) / 600);
      return {
        transform: `translateX(${dx}px)`,
        opacity: String(opacity),
      } as any;
    }
    // vertical (or undecided): use Y transform
    const opacity = Math.max(0.6, 1 - Math.abs(dy) / 400);
    return {
      transform: `translateY(${dy}px)`,
      opacity: String(opacity),
    } as any;
  };

  return (
    <div
      class="fixed inset-0 z-50 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        class="absolute inset-0 bg-black/95 backdrop-blur-2xl transition-opacity duration-300 animate-fade-in"
        onClick={props.onClose}
        role="button"
        aria-label="Close lightbox"
      />
      
      {/* Controls Header - Always visible on mobile, dimmed on desktop until hover */}
      <div class="absolute top-0 inset-x-0 z-50 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent opacity-100 lg:opacity-30 lg:hover:opacity-100 transition-opacity duration-500">
        <div class="text-white/80 text-sm font-medium bg-black/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
          {props.index + 1} / {props.photos.length}
        </div>
        <div class="flex gap-3">
          <CopyUrlButton id={() => photo().id} />
          <ShareButton id={() => photo().id} />
          <button
            onClick={props.onClose}
            class="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none backdrop-blur transition-colors"
            aria-label="Close"
            title="Close (Esc)"
            data-no-drag
          >
            ×
          </button>
        </div>
      </div>

      <div
        class="relative h-full w-full flex items-center justify-center px-4 touch-none cursor-zoom-out"
        onClick={props.onClose}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          class="relative max-w-7xl w-full h-full flex items-center justify-center py-12"
          style={contentStyle()}
        >
          {/* Loading State */}
          <Show when={!loaded()}>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          </Show>
          
          {/* Main Image */}
          <img
            src={(photo() as any).srcFull || photo().src}
            alt={photo().alt}
            class={`
              max-h-full max-w-full object-contain shadow-2xl transition-all duration-500
              ${loaded() ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
            onLoad={() => setLoaded(true)}
            width={photo().width}
            height={photo().height}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              props.onNext();
            }}
          />

          {/* Navigation Arrows - Floating */}
          <Show when={props.index > 0}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onPrev();
              }}
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 hover:opacity-100 sm:opacity-100"
              aria-label="Previous photo"
              data-no-drag
            >
              <span class="text-4xl font-light">‹</span>
            </button>
          </Show>
          
          <Show when={props.index < props.photos.length - 1}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onNext();
              }}
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 hover:opacity-100 sm:opacity-100"
              aria-label="Next photo"
              data-no-drag
            >
              <span class="text-4xl font-light">›</span>
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}

function CopyUrlButton(props: { id: () => string }) {
  const [copied, setCopied] = createSignal(false);

  const buildUrl = () => {
    const photoId = props.id();
    if (typeof window === "undefined") return `/photo/${photoId}`;
    const url = new URL(window.location.href);
    url.pathname = `/photo/${photoId}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  };

  const copyUrl = async () => {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div class="relative" data-no-drag>
      <button
        onClick={(e) => {
          e.stopPropagation();
          copyUrl();
        }}
        class="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl leading-none backdrop-blur transition-colors"
        aria-label="Copy photo URL"
        title="Copy URL"
      >
        <span class={copied() ? "text-green-400" : ""}>⎘</span>
      </button>
    </div>
  );
}

function ShareButton(props: { id: () => string }) {
  const buildUrl = () => {
    const photoId = props.id();
    if (typeof window === "undefined") return `/photo/${photoId}`;
    const url = new URL(window.location.href);
    url.pathname = `/photo/${photoId}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  };

  const share = async () => {
    const url = buildUrl();
    const title = "Photo";
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, url });
      }
    } catch {}
  };

  return (
    <div class="relative" data-no-drag>
      <button
        onClick={(e) => {
          e.stopPropagation();
          share();
        }}
        class="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg leading-none backdrop-blur transition-colors"
        aria-label="Share photo"
        title="Share"
      >
        ⤴
      </button>
    </div>
  );
}
