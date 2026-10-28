import { A } from "@solidjs/router";
import { For, Show, createMemo, createResource } from "solid-js";

import PhotoSkeleton from "~/components/PhotoSkeleton";
import PhotoStage from "~/components/PhotoStage";
import { fetchCatalog } from "~/lib/loadPhotos";
import type { Photo } from "~/lib/photos";

export default function Home() {
  const [catalog] = createResource(fetchCatalog);

  const featured = createMemo(() => {
    const data = catalog();
    if (!data) return [] as Photo[];
    const byId = new Map(data.photos.map((photo) => [photo.id, photo]));
    const picked = data.featured
      .map((id) => byId.get(id))
      .filter((photo): photo is Photo => Boolean(photo));
    return picked.length > 0 ? picked : data.photos.slice(0, 7);
  });

  return (
    <main class="bg-[#F7F6F2] text-[#181818]">
      <Show
        when={!catalog.loading}
        fallback={
          <div class="flex min-h-dvh items-center justify-center px-6 pt-20">
            <PhotoSkeleton class="h-[60vh] w-full max-w-3xl" />
          </div>
        }
      >
        <Show
          when={!catalog.error && featured().length > 0}
          fallback={
            <div class="flex min-h-dvh items-center justify-center px-6 pt-20 text-center">
              <p class="max-w-sm text-sm text-[#181818]/70 text-pretty">
                Photographs could not be loaded right now. Please try again soon.
              </p>
            </div>
          }
        >
          <section class="flex min-h-dvh flex-col justify-center px-6 pb-16 pt-28">
            <div class="mx-auto max-w-xl">
              <h1 class="text-2xl font-medium text-balance text-[#181818]">
                Hugo Marques. Photographs of quiet places.
              </h1>
              <p class="mt-6 max-w-md text-sm text-[#181818]/70 text-pretty">
                Coast, street, and small details from the UK and Portugal.
              </p>
              <div class="mt-10">
                <A
                  href="/photos"
                  class="text-sm text-[#181818] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
                >
                  View series
                </A>
              </div>
            </div>
          </section>

          <For each={featured()}>
            {(photo) => (
              <section class="flex min-h-dvh items-center justify-center px-6 py-20">
                <A
                  href={`/photo/${encodeURIComponent(photo.id)}`}
                  class="block w-full max-w-5xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#181818]"
                  aria-label={photo.alt}
                >
                  <PhotoStage photo={photo} />
                </A>
              </section>
            )}
          </For>

          <section class="px-6 pb-24 pt-8 text-center">
            <A
              href="/photos"
              class="text-sm text-[#181818] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
            >
              Index of series
            </A>
          </section>
        </Show>
      </Show>
    </main>
  );
}
