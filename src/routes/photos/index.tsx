import { A } from "@solidjs/router";
import {
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";

import PhotoSkeleton from "~/components/PhotoSkeleton";
import ProtectedImage from "~/components/ProtectedImage";
import { fetchCatalog } from "~/lib/loadPhotos";
import type { Photo, Series } from "~/lib/photos";
import { EASE_OUT, fadeDurationMs, usePrefersReducedMotion } from "~/lib/motion";

export default function PhotosIndexPage() {
  const [catalog] = createResource(fetchCatalog);
  const [hovered, setHovered] = createSignal<string | null>(null);
  const reduced = usePrefersReducedMotion();

  const series = createMemo(() => catalog()?.series ?? []);
  const photosById = createMemo(() => {
    const map = new Map<string, Photo>();
    for (const photo of catalog()?.photos ?? []) map.set(photo.id, photo);
    return map;
  });

  const coverFor = (entry: Series) => photosById().get(entry.coverId);
  const activeCover = createMemo(() => {
    const slug = hovered();
    if (!slug) return undefined;
    const entry = series().find((item) => item.slug === slug);
    return entry ? coverFor(entry) : undefined;
  });

  return (
    <main class="min-h-dvh bg-[#F7F6F2] px-6 pb-24 pt-28 text-[#181818]">
      <div class="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h1 class="text-2xl font-medium text-balance">Index</h1>
          <p class="mt-4 max-w-sm text-sm text-[#181818]/70 text-pretty">
            Series from the archive. Hover a name to preview its cover.
          </p>

          <Show
            when={!catalog.loading}
            fallback={
              <div class="mt-12 space-y-4">
                <div class="h-5 w-32 animate-pulse bg-[#181818]/8" />
                <div class="h-5 w-24 animate-pulse bg-[#181818]/8" />
                <div class="h-5 w-28 animate-pulse bg-[#181818]/8" />
              </div>
            }
          >
            <Show
              when={!catalog.error && series().length > 0}
              fallback={
                <p class="mt-12 text-sm text-[#181818]/70">
                  Series could not be loaded right now.
                </p>
              }
            >
              <ul class="mt-12 space-y-4">
                <For each={series()}>
                  {(entry) => (
                    <li>
                      <A
                        href={`/series/${entry.slug}`}
                        class="text-sm text-[#181818] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
                        onMouseEnter={() => setHovered(entry.slug)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(entry.slug)}
                        onBlur={() => setHovered(null)}
                      >
                        {entry.title}
                        <span class="ml-3 text-xs text-[#181818]/50 tabular-nums">
                          {entry.photoIds.length}
                        </span>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </Show>
        </div>

        <div class="relative hidden min-h-[50vh] lg:block">
          <Show when={activeCover()} fallback={<div class="h-full" />}>
            {(cover) => (
              <div
                class="sticky top-28"
                style={{
                  transition: `opacity ${fadeDurationMs(reduced())}ms ${EASE_OUT}`,
                }}
              >
                <ProtectedImage
                  src={cover().srcFull || cover().src}
                  alt={cover().alt}
                  width={cover().width}
                  height={cover().height}
                  class="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
            )}
          </Show>
          <Show when={catalog.loading}>
            <PhotoSkeleton class="sticky top-28 h-[60vh] w-full" />
          </Show>
        </div>
      </div>
    </main>
  );
}
