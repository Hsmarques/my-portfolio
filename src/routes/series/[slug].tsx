import { A, useParams } from "@solidjs/router";
import { Show, createMemo, createResource, createSignal } from "solid-js";

import PhotoSkeleton from "~/components/PhotoSkeleton";
import PhotoViewer from "~/components/PhotoViewer";
import { fetchSeries } from "~/lib/loadPhotos";

export default function SeriesPage() {
  const params = useParams();
  const slug = () => params.slug || "";
  const [data] = createResource(slug, (value) => {
    if (!value) return Promise.reject(new Error("That series could not be found."));
    return fetchSeries(value);
  });
  const [index, setIndex] = createSignal(0);

  const photos = createMemo(() => data()?.photos ?? []);
  const title = createMemo(() => data()?.series.title);

  return (
    <main class="min-h-dvh bg-[#F7F6F2] pb-24 pt-28 text-[#181818]">
      <div class="mx-auto mb-8 flex max-w-5xl items-center justify-between px-6 text-sm">
        <A
          href="/photos"
          class="text-[#181818]/70 underline-offset-4 hover:text-[#181818] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
        >
          Index
        </A>
        <Show when={photos()[index()]}>
          {(photo) => (
            <A
              href={`/photo/${encodeURIComponent(photo().id)}`}
              class="text-[#181818]/70 underline-offset-4 hover:text-[#181818] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
            >
              Open photograph
            </A>
          )}
        </Show>
      </div>

      <Show
        when={!data.loading}
        fallback={
          <div class="flex justify-center px-6">
            <PhotoSkeleton class="h-[65vh] w-full max-w-3xl" />
          </div>
        }
      >
        <Show
          when={!data.error && photos().length > 0}
          fallback={
            <p class="px-6 text-center text-sm text-[#181818]/70">
              This series could not be found.
            </p>
          }
        >
          <PhotoViewer
            photos={photos()}
            index={Math.min(index(), Math.max(photos().length - 1, 0))}
            onIndexChange={setIndex}
            seriesTitle={title()}
          />
        </Show>
      </Show>
    </main>
  );
}
