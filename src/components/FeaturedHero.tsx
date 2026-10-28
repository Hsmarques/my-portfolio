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
import { CROSSFADE_MS, EASE, prefersReducedMotion } from "~/lib/motion";
import ProtectedImage from "~/components/ProtectedImage";
import PhotoSkeleton from "~/components/PhotoSkeleton";

type Props = {
  photos: Photo[];
};

const CYCLE_MS = 5200;

export default function FeaturedHero(props: Props) {
  const [index, setIndex] = createSignal(0);
  const [userPaused, setUserPaused] = createSignal(false);
  const [hoverPaused, setHoverPaused] = createSignal(false);
  const [focusPaused, setFocusPaused] = createSignal(false);
  const [loaded, setLoaded] = createSignal<Record<string, boolean>>({});
  let cycleTimer: number | undefined;

  const current = createMemo(() => props.photos[index()] ?? props.photos[0]);
  const canAutoplay = () =>
    !prefersReducedMotion() && props.photos.length > 1;
  const isPaused = () =>
    !canAutoplay() || userPaused() || hoverPaused() || focusPaused();

  const clearCycle = () => {
    if (typeof window === "undefined") return;
    window.clearInterval(cycleTimer);
    cycleTimer = undefined;
  };

  const startCycle = () => {
    if (typeof window === "undefined") return;
    clearCycle();
    if (isPaused()) return;
    cycleTimer = window.setInterval(() => {
      setIndex((i) => {
        const len = props.photos.length;
        return len ? (i + 1) % len : 0;
      });
    }, CYCLE_MS);
  };

  const go = (next: number) => {
    if (props.photos.length === 0) return;
    const len = props.photos.length;
    setIndex(((next % len) + len) % len);
    // Restart the autoplay timer after a manual move (WCAG 2.2.2).
    startCycle();
  };

  createEffect(() => {
    // Track pause signals so the interval starts/stops correctly.
    userPaused();
    hoverPaused();
    focusPaused();
    props.photos.length;
    startCycle();
  });

  onMount(() => {
    if (typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index() - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    onCleanup(() => {
      clearCycle();
      window.removeEventListener("keydown", onKey);
    });
  });

  createEffect(() => {
    const photos = props.photos;
    const i = index();
    [photos[i], photos[i + 1], photos[i - 1]].forEach((photo) => {
      if (!photo || typeof Image === "undefined") return;
      const img = new Image();
      img.src = photo.srcFull || photo.src;
    });
  });

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
      class="flex min-h-[100dvh] w-full flex-col bg-black text-white select-none"
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusIn={() => setFocusPaused(true)}
      onFocusOut={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && e.currentTarget.contains(next)) return;
        setFocusPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label="Featured photographs"
    >
      <div class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
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
                class="h-auto max-h-full w-full object-contain md:w-auto md:max-w-full"
                loading={i() === 0 ? "eager" : "lazy"}
                onLoad={() =>
                  setLoaded((prev) => ({ ...prev, [photo.id]: true }))
                }
              />
            </div>
          )}
        </For>
      </div>

      <div class="shrink-0 bg-black px-4 pb-8 pt-6 md:px-8 md:pb-10">
        <div class="max-w-2xl">
          <p class="text-3xl font-medium text-white text-wrap-balance">
            Coast, street, and the quiet in between.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-4">
            <Show when={current()}>
              {(photo) => (
                <p class="font-mono text-sm text-[#9B9B9B] tabular-nums">
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
            <Show when={canAutoplay()}>
              <button
                type="button"
                class="text-sm text-[#9B9B9B] hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
                aria-pressed={isPaused() ? "true" : "false"}
                aria-label={
                  isPaused()
                    ? "Play featured slideshow"
                    : "Pause featured slideshow"
                }
                onClick={() => setUserPaused((v) => !v)}
              >
                {isPaused() ? "Play" : "Pause"}
              </button>
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
