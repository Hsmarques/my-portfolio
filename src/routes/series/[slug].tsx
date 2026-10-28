import { A, useParams, useSearchParams } from "@solidjs/router";
import { Show, createEffect, createMemo, createResource } from "solid-js";

import PhotoSkeleton from "~/components/PhotoSkeleton";
import PhotoViewer from "~/components/PhotoViewer";
import { fetchSeries } from "~/lib/loadPhotos";

function parsePhotoIndex(raw: string | string[] | undefined, length: number): number {
  if (length <= 0) return 0;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const zeroBased = Math.floor(n) - 1;
  if (zeroBased < 0) return 0;
  if (zeroBased >= length) return length - 1;
  return zeroBased;
}

export default function SeriesPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams<{ n?: string }>();
  const slug = () => params.slug || "";
  const [data] = createResource(slug, (value) => {
    if (!value) return Promise.reject(new Error("That series could not be found."));
    return fetchSeries(value);
  });

  const photos = createMemo(() => data()?.photos ?? []);
  const title = createMemo(() => data()?.series.title);
  const index = createMemo(() => parsePhotoIndex(searchParams.n, photos().length));

  createEffect(() => {
    const list = photos();
    if (list.length === 0) return;
    const current = index() + 1;
    const raw = Array.isArray(searchParams.n) ? searchParams.n[0] : searchParams.n;
    if (String(raw ?? "") === String(current)) return;
    // Keep shareable place in the URL; clamp invalid values.
    setSearchParams({ n: String(current) }, { replace: true });
  });

  const setIndex = (next: number) => {
    const list = photos();
    if (list.length === 0) return;
    const clamped = Math.min(Math.max(next, 0), list.length - 1);
    setSearchParams({ n: String(clamped + 1) }, { replace: true });
  };

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
            index={index()}
            onIndexChange={setIndex}
            seriesTitle={title()}
          />
        </Show>
      </Show>
    </main>
  );
}
