import {
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { A } from "@solidjs/router";
import type { Photo } from "~/lib/photos";
import { EASE } from "~/lib/motion";
import ProtectedImage from "~/components/ProtectedImage";
import PhotoSkeleton from "~/components/PhotoSkeleton";

type Props = {
  photos: Photo[];
  title?: string;
  active?: boolean;
};

export default function Filmstrip(props: Props) {
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [loaded, setLoaded] = createSignal<Record<string, boolean>>({});
  let scroller: HTMLDivElement | undefined;

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    if (!scroller) return;
    const child = scroller.children[index] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  };

  const go = (next: number) => {
    if (props.photos.length === 0) return;
    const len = props.photos.length;
    const clamped = ((next % len) + len) % len;
    setActiveIndex(clamped);
    scrollToIndex(clamped);
  };

  onMount(() => {
    if (typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (props.active === false) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(activeIndex() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(activeIndex() - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  createEffect(() => {
    // keep scroller in sync if photos change
    props.photos;
    queueMicrotask(() => scrollToIndex(activeIndex(), "auto"));
  });

  const onScroll = () => {
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(scroller.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const mid = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  };

  return (
    <section class="w-full select-none" onContextMenu={(e) => e.preventDefault()}>
      <Show when={props.title}>
        <div class="mb-4 flex items-baseline justify-between px-4 md:px-6">
          <h2 class="text-sm font-medium text-white">{props.title}</h2>
          <p class="font-mono text-sm text-[#9B9B9B] tabular-nums">
            {String(activeIndex() + 1).padStart(2, "0")} /{" "}
            {String(props.photos.length).padStart(2, "0")}
          </p>
        </div>
      </Show>

      <div
        ref={scroller}
        class="filmstrip flex gap-4 overflow-x-auto px-4 pb-6 md:gap-6 md:px-6 snap-x snap-mandatory"
        style={{
          "scroll-behavior": "smooth",
          "scroll-snap-type": "x mandatory",
          "scrollbar-width": "none",
          transition: `scroll 800ms ${EASE}`,
        }}
        onScroll={onScroll}
        role="list"
        aria-label={props.title ? `${props.title} filmstrip` : "Photo filmstrip"}
      >
        <For each={props.photos}>
          {(photo, i) => (
            <A
              href={`/photo/${encodeURIComponent(photo.id)}`}
              class="relative snap-center shrink-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
              role="listitem"
              aria-current={i() === activeIndex() ? "true" : undefined}
              style={{
                width: "min(88vw, 920px)",
                height: "min(72dvh, 720px)",
              }}
            >
              <Show when={!loaded()[photo.id]}>
                <PhotoSkeleton class="absolute inset-0" />
              </Show>
              <ProtectedImage
                src={photo.srcFull || photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                class="h-full w-full object-contain"
                loading="lazy"
                onLoad={() =>
                  setLoaded((prev) => ({ ...prev, [photo.id]: true }))
                }
              />
              <Show when={photo.place || photo.year || photo.caption}>
                <p class="mt-3 text-sm text-[#9B9B9B] text-wrap-pretty">
                  {[photo.place, photo.year].filter(Boolean).join(", ")}
                  <Show when={photo.caption}>
                    <span>
                      {(photo.place || photo.year) ? " — " : ""}
                      {photo.caption}
                    </span>
                  </Show>
                </p>
              </Show>
            </A>
          )}
        </For>
      </div>
    </section>
  );
}
