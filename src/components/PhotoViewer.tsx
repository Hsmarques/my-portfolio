import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Photo } from "~/lib/photos";
import { photoCaption } from "~/lib/loadPhotos";
import { EASE_OUT, fadeDurationMs, usePrefersReducedMotion } from "~/lib/motion";
import PhotoSkeleton from "~/components/PhotoSkeleton";
import ProtectedImage from "~/components/ProtectedImage";

export default function PhotoViewer(props: {
  photos: Photo[];
  index: number;
  onIndexChange: (index: number) => void;
  seriesTitle?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = createSignal(false);
  const [touchStartX, setTouchStartX] = createSignal<number | null>(null);

  const photo = createMemo(() => props.photos[props.index]);
  const countLabel = createMemo(
    () => `${props.index + 1} / ${props.photos.length}`,
  );
  const caption = createMemo(() => {
    const current = photo();
    return current ? photoCaption(current) : undefined;
  });

  createEffect(() => {
    photo();
    setLoaded(false);
  });

  createEffect(() => {
    const idx = props.index;
    const list = props.photos;
    [list[idx - 1], list[idx + 1]].forEach((item) => {
      if (!item || typeof window === "undefined") return;
      const img = new Image();
      img.src = item.srcFull || item.src;
    });
  });

  const goPrev = () => {
    if (props.index <= 0) return;
    props.onIndexChange(props.index - 1);
  };

  const goNext = () => {
    if (props.index >= props.photos.length - 1) return;
    props.onIndexChange(props.index + 1);
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  const onTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX();
    const end = e.changedTouches[0]?.clientX;
    setTouchStartX(null);
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  return (
    <div
      class="flex w-full flex-col items-center select-none"
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div class="mb-6 flex w-full max-w-5xl items-center justify-between px-6 text-xs text-[#181818]/70">
        <Show when={props.seriesTitle} fallback={<span />}>
          <span>{props.seriesTitle}</span>
        </Show>
        <span class="tabular-nums">{countLabel()}</span>
      </div>

      <div class="relative flex min-h-[min(70vh,760px)] w-full max-w-5xl items-center justify-center px-6">
        <Show when={!loaded()}>
          <PhotoSkeleton class="absolute h-[min(65vh,680px)] w-full max-w-3xl" />
        </Show>
        <Show when={photo()}>
          {(current) => (
            <ProtectedImage
              src={current().srcFull || current().src}
              alt={current().alt}
              width={current().width}
              height={current().height}
              class="relative z-10 max-h-[min(70vh,760px)] w-auto max-w-full object-contain"
              style={{
                opacity: loaded() ? "1" : "0",
                transition: `opacity ${fadeDurationMs(reduced())}ms ${EASE_OUT}`,
              }}
              onLoad={() => setLoaded(true)}
            />
          )}
        </Show>
      </div>

      <div class="mt-4 min-h-4 px-6 text-center text-xs text-[#181818]/80">
        <Show when={caption() || photo()?.caption}>
          <p class="text-pretty">
            <Show when={caption()}>
              <span>{caption()}</span>
            </Show>
            <Show when={caption() && photo()?.caption}>
              <span aria-hidden="true"> · </span>
            </Show>
            <Show when={photo()?.caption}>
              <span>{photo()?.caption}</span>
            </Show>
          </p>
        </Show>
      </div>

      <div class="mt-8 flex items-center gap-8 text-sm text-[#181818]">
        <button
          type="button"
          class="disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
          disabled={props.index <= 0}
          onClick={goPrev}
          aria-label="Previous photograph"
        >
          Previous
        </button>
        <button
          type="button"
          class="disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
          disabled={props.index >= props.photos.length - 1}
          onClick={goNext}
          aria-label="Next photograph"
        >
          Next
        </button>
      </div>

      <Show when={photo()?.exif && Object.values(photo()!.exif || {}).some(Boolean)}>
        <dl class="mt-10 grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-[#181818]/60 sm:grid-cols-3">
          <Show when={photo()?.exif?.camera}>
            <div>
              <dt class="sr-only">Camera</dt>
              <dd>{photo()?.exif?.camera}</dd>
            </div>
          </Show>
          <Show when={photo()?.exif?.lens}>
            <div>
              <dt class="sr-only">Lens</dt>
              <dd>{photo()?.exif?.lens}</dd>
            </div>
          </Show>
          <Show when={photo()?.exif?.focalLengthMm}>
            <div>
              <dt class="sr-only">Focal length</dt>
              <dd>{photo()?.exif?.focalLengthMm}mm</dd>
            </div>
          </Show>
          <Show when={photo()?.exif?.aperture}>
            <div>
              <dt class="sr-only">Aperture</dt>
              <dd>{photo()?.exif?.aperture}</dd>
            </div>
          </Show>
          <Show when={photo()?.exif?.shutter}>
            <div>
              <dt class="sr-only">Shutter</dt>
              <dd>{photo()?.exif?.shutter}</dd>
            </div>
          </Show>
          <Show when={photo()?.exif?.iso}>
            <div>
              <dt class="sr-only">ISO</dt>
              <dd>ISO {photo()?.exif?.iso}</dd>
            </div>
          </Show>
        </dl>
      </Show>
    </div>
  );
}
