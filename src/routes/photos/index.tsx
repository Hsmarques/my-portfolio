import { A } from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
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

  // Desktop cover layers for a true opacity crossfade.
  const [layerA, setLayerA] = createSignal<Photo | undefined>();
  const [layerB, setLayerB] = createSignal<Photo | undefined>();
  const [showA, setShowA] = createSignal(false);
  const [showB, setShowB] = createSignal(false);
  const [activeLayer, setActiveLayer] = createSignal<"a" | "b">("a");

  createEffect(() => {
    const next = activeCover();
    const duration = fadeDurationMs(reduced());
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!next) {
      setShowA(false);
      setShowB(false);
      if (duration > 0) {
        timeoutId = setTimeout(() => {
          setLayerA(undefined);
          setLayerB(undefined);
        }, duration);
      } else {
        setLayerA(undefined);
        setLayerB(undefined);
      }
      onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId);
      });
      return;
    }

    const current = activeLayer() === "a" ? layerA() : layerB();
    if (current?.id === next.id) {
      if (activeLayer() === "a") setShowA(true);
      else setShowB(true);
      return;
    }

    if (!current) {
      setLayerA(next);
      setActiveLayer("a");
      setShowB(false);
      // Next frame so the browser paints opacity 0 before fading in.
      requestAnimationFrame(() => setShowA(true));
      return;
    }

    if (activeLayer() === "a") {
      setLayerB(next);
      setActiveLayer("b");
      requestAnimationFrame(() => {
        setShowB(true);
        setShowA(false);
      });
    } else {
      setLayerA(next);
      setActiveLayer("a");
      requestAnimationFrame(() => {
        setShowA(true);
        setShowB(false);
      });
    }
  });

  const previewDuration = () => fadeDurationMs(reduced());

  return (
    <main class="min-h-dvh bg-[#F7F6F2] px-6 pb-24 pt-28 text-[#181818]">
      <div class="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h1 class="text-2xl font-medium text-balance">Index</h1>
          <p class="mt-4 max-w-sm text-sm text-[#181818]/70 text-pretty lg:hidden">
            Series from the archive, each with its cover.
          </p>
          <p class="mt-4 hidden max-w-sm text-sm text-[#181818]/70 text-pretty lg:block">
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
                  {(entry) => {
                    const cover = () => coverFor(entry);
                    return (
                      <li>
                        <A
                          href={`/series/${entry.slug}`}
                          class="group flex items-center gap-4 text-sm text-[#181818] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818] lg:inline-flex lg:gap-0"
                          onMouseEnter={() => setHovered(entry.slug)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(entry.slug)}
                          onBlur={() => setHovered(null)}
                        >
                          <Show when={cover()}>
                            {(photo) => (
                              <ProtectedImage
                                src={photo().src}
                                alt=""
                                width={photo().width}
                                height={photo().height}
                                class="h-14 w-14 shrink-0 object-cover lg:hidden"
                                aria-hidden="true"
                              />
                            )}
                          </Show>
                          <span class="min-w-0">
                            {entry.title}
                            <span class="ml-3 text-xs text-[#181818]/50 tabular-nums">
                              {entry.photoIds.length}
                            </span>
                          </span>
                        </A>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </Show>
          </Show>
        </div>

        <div class="relative hidden min-h-[50vh] lg:block">
          <div class="sticky top-28 h-[min(70vh,720px)] w-full">
            <Show when={layerA()}>
              {(cover) => (
                <ProtectedImage
                  src={cover().srcFull || cover().src}
                  alt={cover().alt}
                  width={cover().width}
                  height={cover().height}
                  class="absolute inset-0 m-auto max-h-full w-auto max-w-full object-contain"
                  style={{
                    opacity: showA() ? "1" : "0",
                    transition: `opacity ${previewDuration()}ms ${EASE_OUT}`,
                  }}
                />
              )}
            </Show>
            <Show when={layerB()}>
              {(cover) => (
                <ProtectedImage
                  src={cover().srcFull || cover().src}
                  alt={cover().alt}
                  width={cover().width}
                  height={cover().height}
                  class="absolute inset-0 m-auto max-h-full w-auto max-w-full object-contain"
                  style={{
                    opacity: showB() ? "1" : "0",
                    transition: `opacity ${previewDuration()}ms ${EASE_OUT}`,
                  }}
                />
              )}
            </Show>
          </div>
          <Show when={catalog.loading}>
            <PhotoSkeleton class="sticky top-28 h-[60vh] w-full" />
          </Show>
        </div>
      </div>
    </main>
  );
}
