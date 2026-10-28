import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Photo } from "~/lib/photos";
import { CROSSFADE_MS, EASE, IDLE_MS, prefersReducedMotion } from "~/lib/motion";
import ProtectedImage from "~/components/ProtectedImage";
import PhotoSkeleton from "~/components/PhotoSkeleton";

type Props = {
  photos: Photo[];
  onUiVisibilityChange?: (visible: boolean) => void;
};

export default function FeaturedHero(props: Props) {
  const [index, setIndex] = createSignal(0);
  const [uiVisible, setUiVisible] = createSignal(true);
  const [loaded, setLoaded] = createSignal<Record<string, boolean>>({});
  let idleTimer: number | undefined;
  let cycleTimer: number | undefined;

  const current = createMemo(() => props.photos[index()] ?? props.photos[0]);

  const bumpUi = () => {
    setUiVisible(true);
    props.onUiVisibilityChange?.(true);
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      setUiVisible(false);
      props.onUiVisibilityChange?.(false);
    }, IDLE_MS);
  };

  const go = (next: number) => {
    if (props.photos.length === 0) return;
    const len = props.photos.length;
    setIndex(((next % len) + len) % len);
    bumpUi();
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    bumpUi();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index() - 1);
      }
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, bumpUi, { passive: true }));
    window.addEventListener("keydown", onKey);

    if (!prefersReducedMotion() && props.photos.length > 1) {
      cycleTimer = window.setInterval(() => {
        setIndex((i) => {
          const len = props.photos.length;
          return len ? (i + 1) % len : 0;
        });
        bumpUi();
      }, 5200);
    }

    onCleanup(() => {
      window.clearTimeout(idleTimer);
      window.clearInterval(cycleTimer);
      events.forEach((event) => window.removeEventListener(event, bumpUi));
      window.removeEventListener("keydown", onKey);
    });
  });

  createEffect(() => {
    // Preload neighbours
    const photos = props.photos;
    const i = index();
    [photos[i], photos[i + 1], photos[i - 1]].forEach((photo) => {
      if (!photo || typeof Image === "undefined") return;
      const img = new Image();
      img.src = photo.srcFull || photo.src;
    });
  });

  // Touch swipe
  let touchStartX: number | null = null;
  const onTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const dx = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 48) return;
    if (dx < 0) go(index() + 1);
    else go(index() - 1);
  };

  return (
    <section
      class="relative min-h-[100dvh] w-full bg-[#181818] select-none overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured photographs"
    >
      <For each={props.photos}>
        {(photo, i) => (
          <div
            class="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: i() === index() ? "1" : "0",
              transition: prefersReducedMotion()
                ? "none"
                : `opacity ${CROSSFADE_MS}ms ${EASE}`,
              "pointer-events": i() === index() ? "auto" : "none",
            }}
            aria-hidden={i() !== index()}
          >
            <Show when={!loaded()[photo.id]}>
              <PhotoSkeleton class="absolute inset-8 md:inset-16" />
            </Show>
            <ProtectedImage
              src={photo.srcFull || photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              class="max-h-[100dvh] max-w-full w-auto h-auto object-contain"
              loading={i() === 0 ? "eager" : "lazy"}
              onLoad={() =>
                setLoaded((prev) => ({ ...prev, [photo.id]: true }))
              }
            />
          </div>
        )}
      </For>

      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-10 md:px-8 md:pb-14"
        style={{
          opacity: uiVisible() ? "1" : "0",
          transition: `opacity ${CROSSFADE_MS}ms ${EASE}`,
        }}
      >
        <div class="max-w-[680px]">
          <p class="text-3xl font-medium text-white text-wrap-balance">
            Coast, street, and the quiet in between.
          </p>
          <Show when={current()}>
            {(photo) => (
              <p class="mt-3 font-mono text-sm text-[#9B9B9B] tabular-nums">
                {String(index() + 1).padStart(2, "0")} /{" "}
                {String(props.photos.length).padStart(2, "0")}
                <Show when={photo().place || photo().year}>
                  <span>
                    {" · "}
                    {[photo().place, photo().year].filter(Boolean).join(", ")}
                  </span>
                </Show>
              </p>
            )}
          </Show>
        </div>
      </div>
    </section>
  );
}
