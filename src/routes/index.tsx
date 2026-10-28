import { For, Show, createMemo, createResource } from "solid-js";
import { A } from "@solidjs/router";
import Footer from "~/components/Footer";
import PhotoImage from "~/components/PhotoImage";
import ScrollReveal from "~/components/ScrollReveal";
import { HomeSkeleton } from "~/components/Skeleton";
import { resolveAlt } from "~/lib/collections";
import { fetchCollections, fetchPhotos } from "~/lib/loadPhotos";
import type { Photo } from "~/lib/photos";

export default function Home() {
  const [photos] = createResource(fetchPhotos);
  const [collections] = createResource(fetchCollections);

  const photoMap = createMemo(() => {
    const map = new Map<string, Photo>();
    for (const photo of photos() ?? []) {
      map.set(photo.id, photo);
    }
    return map;
  });

  const series = createMemo(() => collections()?.series ?? []);

  return (
    <div class="min-h-dvh flex flex-col bg-paper text-ink">
      <main id="main" class="flex-1">
        <Show
          when={!photos.loading && !collections.loading}
          fallback={<HomeSkeleton />}
        >
          <Show
            when={!photos.error && series().length > 0}
            fallback={
              <div class="mx-auto max-w-xl px-4 pt-40 pb-24 text-center space-y-3">
                <p class="text-lg font-medium">Photos are taking a rest</p>
                <p class="text-sm text-ink/60 text-pretty">
                  The gallery could not be loaded right now. Please try again
                  in a little while.
                </p>
              </div>
            }
          >
            <section class="mx-auto max-w-6xl px-4 pt-32 md:pt-40 pb-20">
              <div class="max-w-xl space-y-6">
                <h1 class="text-5xl md:text-6xl font-semibold tracking-tight text-wrap-balance leading-none">
                  Small figures, wide water.
                </h1>
                <p class="text-base md:text-lg text-ink/70 text-pretty max-w-[40rem]">
                  Coast and street photographs from the UK and Portugal.
                </p>
              </div>
            </section>

            <section
              aria-label="Series table of contents"
              class="mx-auto max-w-6xl px-4 pb-24"
            >
              <h2 class="text-sm font-medium text-ink/50 mb-10">
                Contents
              </h2>
              <ol class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                <For each={series()}>
                  {(entry, index) => {
                    const cover = () => photoMap().get(entry.coverId);
                    return (
                      <ScrollReveal as="li">
                        <A
                          href={`/series/${entry.slug}`}
                          class="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                        >
                          <Show
                            when={cover()}
                            fallback={
                              <div class="aspect-[4/3] bg-ink/10 mb-4" />
                            }
                          >
                            {(photo) => (
                              <div class="overflow-hidden mb-4 bg-ink/5">
                                <PhotoImage
                                  photo={photo()}
                                  class="w-full aspect-[4/3] object-cover transition-transform duration-500 ease-photo group-hover:scale-[1.02]"
                                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                                />
                              </div>
                            )}
                          </Show>
                          <p class="text-sm text-ink/40 mb-1">
                            {String(index() + 1).padStart(2, "0")}
                          </p>
                          <h3 class="text-2xl font-semibold tracking-tight group-hover:text-ink/80 transition-colors duration-300 ease-photo">
                            {entry.title}
                          </h3>
                          <Show when={entry.intro}>
                            <p class="mt-2 text-sm text-ink/60 text-pretty">
                              {entry.intro}
                            </p>
                          </Show>
                          <p class="mt-2 text-sm text-ink/40">
                            {entry.photoIds.length}{" "}
                            {entry.photoIds.length === 1
                              ? "photograph"
                              : "photographs"}
                          </p>
                          <span class="sr-only">
                            {cover()
                              ? resolveAlt(cover() as Photo)
                              : entry.title}
                          </span>
                        </A>
                      </ScrollReveal>
                    );
                  }}
                </For>
              </ol>
            </section>
          </Show>
        </Show>
      </main>
      <Footer />
    </div>
  );
}
