import {
  Show,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
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

export default function SeriesPage() {
  const params = useParams();
  const [payload] = createResource(fetchPhotosPayload);
  const [grid, setGrid] = createSignal(false);

  const series = createMemo(() => {
    const data = payload();
    if (!data) return null;
    return data.series.find((s) => s.slug === params.slug) ?? null;
  });

  const photos = createMemo(() => {
    const data = payload();
    const s = series();
    if (!data || !s) return [] as Photo[];
    const byId = new Map(data.photos.map((p) => [p.id, p]));
    return s.photoIds.map((id) => byId.get(id)).filter(Boolean) as Photo[];
  });

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
          <div class="px-4 md:px-6">
            <PhotoSkeleton class="h-[70dvh] w-full" />
          </div>
        }
      >
        <Show
          when={!payload.error && series()}
          fallback={
            <div class="px-6 py-24 text-center space-y-4">
              <p class="text-sm text-[#9B9B9B]">
                {payload.error
                  ? friendlyErrorMessage(payload.error)
                  : "That series could not be found."}
              </p>
              <A href="/photos" class="text-sm text-white hover:opacity-70">
                Back to index
              </A>
            </div>
          }
        >
          <div class="px-4 md:px-6 mb-6">
            <h1 class="text-sm font-medium text-white">{series()!.title}</h1>
          </div>

          <Show
            when={!grid()}
            fallback={<ContactSheet photos={photos()} />}
          >
            <Filmstrip photos={photos()} active />
          </Show>

          <SiteFooter />
        </Show>
      </Show>
    </main>
  );
}
