import { Show, createSignal } from "solid-js";
import type { Photo } from "~/lib/photos";
import { photoCaption } from "~/lib/loadPhotos";
import { EASE_OUT, fadeDurationMs, usePrefersReducedMotion } from "~/lib/motion";
import PhotoSkeleton from "~/components/PhotoSkeleton";
import ProtectedImage from "~/components/ProtectedImage";

export default function PhotoStage(props: {
  photo: Photo;
  showMeta?: boolean;
  class?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = createSignal(false);
  const caption = () => photoCaption(props.photo);

  return (
    <figure class={`flex w-full flex-col items-center ${props.class ?? ""}`}>
      <div class="relative flex w-full max-w-5xl items-center justify-center">
        <Show when={!loaded()}>
          <PhotoSkeleton class="absolute inset-x-0 mx-auto h-[min(72vh,720px)] max-w-4xl" />
        </Show>
        <ProtectedImage
          src={props.photo.srcFull || props.photo.src}
          alt={props.photo.alt}
          width={props.photo.width}
          height={props.photo.height}
          class="relative z-10 max-h-[min(78vh,820px)] w-auto max-w-full object-contain"
          style={{
            opacity: loaded() ? "1" : "0",
            transition: `opacity ${fadeDurationMs(reduced())}ms ${EASE_OUT}`,
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <Show when={props.showMeta !== false && (caption() || props.photo.caption)}>
        <figcaption class="mt-4 max-w-xl px-6 text-center text-xs text-[#181818]/80 text-pretty">
          <Show when={caption()}>
            <span>{caption()}</span>
          </Show>
          <Show when={caption() && props.photo.caption}>
            <span aria-hidden="true"> · </span>
          </Show>
          <Show when={props.photo.caption}>
            <span>{props.photo.caption}</span>
          </Show>
        </figcaption>
      </Show>
    </figure>
  );
}
