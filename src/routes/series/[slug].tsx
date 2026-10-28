import { Show, createMemo, createResource } from "solid-js";
import { A, useParams } from "@solidjs/router";
import Footer from "~/components/Footer";
import SeriesSpreads from "~/components/SeriesSpreads";
import { SeriesSkeleton } from "~/components/Skeleton";
import {
  getSeriesBySlug,
  photosForSeries,
} from "~/lib/collections";
import { fetchCollections, fetchPhotos } from "~/lib/loadPhotos";

export default function SeriesPage() {
  const params = useParams();
  const [photos] = createResource(fetchPhotos);
  const [collections] = createResource(fetchCollections);

  const series = createMemo(() => {
    const payload = collections();
    if (!payload) return undefined;
    return getSeriesBySlug(payload, params.slug || "");
  });

  const seriesPhotos = createMemo(() => {
    const entry = series();
    const list = photos() ?? [];
    if (!entry) return [];
    return photosForSeries(list, entry);
  });

  const pageBg = () =>
    series()?.monochrome ? "bg-paper-muted text-ink" : "bg-paper text-ink";

  return (
    <div class={`min-h-dvh flex flex-col ${pageBg()}`}>
      <main id="main" class="flex-1">
        <Show
          when={!photos.loading && !collections.loading}
          fallback={<SeriesSkeleton />}
        >
          <Show
            when={series() && seriesPhotos().length > 0}
            fallback={
              <div class="mx-auto max-w-xl px-4 pt-40 pb-24 text-center space-y-4">
                <p class="text-lg font-medium">Series not found</p>
                <p class="text-sm text-ink/60">
                  That collection is not in the book yet.
                </p>
                <A
                  href="/"
                  class="inline-block text-sm font-medium underline-offset-4 hover:underline"
                >
                  Back to contents
                </A>
              </div>
            }
          >
            <header class="mx-auto max-w-3xl px-4 pt-32 md:pt-40 pb-16 md:pb-24">
              <A
                href="/"
                class="text-sm text-ink/50 hover:text-ink transition-colors duration-300 ease-photo"
              >
                Contents
              </A>
              <h1 class="mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-wrap-balance leading-none">
                {series()!.title}
              </h1>
              <Show when={series()!.intro}>
                <p class="mt-6 text-base md:text-lg text-ink/70 text-pretty max-w-[40rem]">
                  {series()!.intro}
                </p>
              </Show>
              <p class="mt-4 text-sm text-ink/40">
                {seriesPhotos().length}{" "}
                {seriesPhotos().length === 1 ? "photograph" : "photographs"}
              </p>
            </header>

            <SeriesSpreads
              photos={seriesPhotos()}
              seriesSlug={series()!.slug}
            />
          </Show>
        </Show>
      </main>
      <Footer />
    </div>
  );
}
