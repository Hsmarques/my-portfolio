import {
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { A } from "@solidjs/router";
import DarkroomChrome from "~/components/DarkroomChrome";
import Filmstrip from "~/components/Filmstrip";
import ContactSheet from "~/components/ContactSheet";
import SiteFooter from "~/components/SiteFooter";
import PhotoSkeleton from "~/components/PhotoSkeleton";
import {
  fetchPhotosPayload,
  friendlyErrorMessage,
} from "~/lib/loadPhotos";
import type { Photo } from "~/lib/photos";

export default function PhotosPage() {
  const [payload] = createResource(fetchPhotosPayload);
  const [grid, setGrid] = createSignal(false);
  const [activeSeries, setActiveSeries] = createSignal(0);

  const seriesPhotos = createMemo(() => {
    const data = payload();
    if (!data) return [] as { title: string; slug: string; photos: Photo[] }[];
    const byId = new Map(data.photos.map((p) => [p.id, p]));
    return data.series.map((s) => ({
      title: s.title,
      slug: s.slug,
      photos: s.photoIds.map((id) => byId.get(id)).filter(Boolean) as Photo[],
    }));
  });

  const allPhotos = createMemo(() => payload()?.photos ?? []);

  return (
    <main class="bg-[#181818] text-white min-h-[100dvh] pt-16">
      <DarkroomChrome
        showGridToggle
        gridActive={grid()}
        onToggleGrid={() => setGrid((v) => !v)}
      />

      <Show
        when={!payload.loading}
        fallback={
          <div class="px-4 md:px-6 space-y-8">
            <PhotoSkeleton class="h-8 w-40" />
            <PhotoSkeleton class="h-[60dvh] w-full" />
          </div>
        }
      >
        <Show
          when={!payload.error && allPhotos().length > 0}
          fallback={
            <div class="px-6 py-24 text-center">
              <p class="text-sm text-[#9B9B9B]">
                {friendlyErrorMessage(payload.error)}
              </p>
            </div>
          }
        >
          <div class="px-4 md:px-6 mb-8">
            <h1 class="text-sm font-medium text-white">Index</h1>
            <p class="mt-2 text-sm text-[#9B9B9B] max-w-md text-wrap-pretty">
              Series from the archive. Open a strip, or switch to the contact sheet.
            </p>
            <nav class="mt-6 flex flex-wrap gap-4 text-sm" aria-label="Series">
              <For each={seriesPhotos()}>
                {(series, i) => (
                  <A
                    href={`/series/${series.slug}`}
                    class="text-[#9B9B9B] hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
                    onFocus={() => setActiveSeries(i())}
                  >
                    {series.title}
                  </A>
                )}
              </For>
            </nav>
          </div>

          <Show
            when={!grid()}
            fallback={<ContactSheet photos={allPhotos()} />}
          >
            <div class="space-y-16 pb-8">
              <For each={seriesPhotos()}>
                {(series, i) => (
                  <Filmstrip
                    title={series.title}
                    photos={series.photos}
                    active={activeSeries() === i()}
                    onActivate={() => setActiveSeries(i())}
                  />
                )}
              </For>
            </div>
          </Show>

          <SiteFooter />
        </Show>
      </Show>
    </main>
  );
}
