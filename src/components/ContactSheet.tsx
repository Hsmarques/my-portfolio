import { For, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import type { Photo } from "~/lib/photos";
import ProtectedImage from "~/components/ProtectedImage";
import PhotoSkeleton from "~/components/PhotoSkeleton";

type Props = {
  photos: Photo[];
};

export default function ContactSheet(props: Props) {
  const [loaded, setLoaded] = createSignal<Record<string, boolean>>({});

  return (
    <div
      class="grid grid-cols-2 gap-2 px-4 pb-10 sm:grid-cols-3 md:grid-cols-4 md:gap-3 md:px-6 lg:grid-cols-5 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <For each={props.photos}>
        {(photo) => (
          <A
            href={`/photo/${encodeURIComponent(photo.id)}`}
            class="group relative aspect-[4/3] overflow-hidden bg-[#1F1F1F] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            aria-label={photo.alt}
          >
            <Show when={!loaded()[photo.id]}>
              <PhotoSkeleton class="absolute inset-0" />
            </Show>
            <ProtectedImage
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              class="h-full w-full object-contain transition-opacity duration-300 ease-darkroom"
              loading="lazy"
              onLoad={() =>
                setLoaded((prev) => ({ ...prev, [photo.id]: true }))
              }
            />
          </A>
        )}
      </For>
    </div>
  );
}
