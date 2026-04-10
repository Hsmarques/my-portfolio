import {
  Show,
  For,
  createMemo,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { A } from "@solidjs/router";
import type { Photo } from "~/lib/photos";
import { fetchPhotos, sortPhotos } from "~/lib/loadPhotos";

function FeaturedPhoto(props: { photo: Photo; priority?: boolean }) {
  return (
    <div class="group relative overflow-hidden rounded-lg">
      <img
        src={(props.photo as any).srcFull || props.photo.src}
        alt={props.photo.alt}
        class="w-full h-full object-cover"
        width={props.photo.width}
        height={props.photo.height}
        loading={props.priority ? "eager" : "lazy"}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <div class="absolute inset-0 bg-gradient-to-t from-vinho-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

function PhotoStrip(props: { photos: Photo[] }) {
  let scrollRef: HTMLDivElement | undefined;
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(true);

  const updateScroll = () => {
    if (!scrollRef) return;
    setCanScrollLeft(scrollRef.scrollLeft > 10);
    setCanScrollRight(
      scrollRef.scrollLeft < scrollRef.scrollWidth - scrollRef.clientWidth - 10
    );
  };

  onMount(() => {
    if (scrollRef) {
      scrollRef.addEventListener("scroll", updateScroll, { passive: true });
      updateScroll();
    }
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef) return;
    const amount = scrollRef.clientWidth * 0.6;
    scrollRef.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div class="relative group/strip">
      <div
        ref={scrollRef}
        class="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ "scrollbar-width": "none", "-ms-overflow-style": "none" }}
      >
        <For each={props.photos}>
          {(photo) => (
            <A
              href={`/photo/${photo.id}`}
              class="flex-none snap-start w-[280px] h-[200px] sm:w-[340px] sm:h-[240px] rounded-lg overflow-hidden"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                class="w-full h-full object-cover"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </A>
          )}
        </For>
      </div>

      <Show when={canScrollLeft()}>
        <button
          onClick={() => scroll("left")}
          class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-vinho-800/80 backdrop-blur text-bacalhau flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          ‹
        </button>
      </Show>
      <Show when={canScrollRight()}>
        <button
          onClick={() => scroll("right")}
          class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-vinho-800/80 backdrop-blur text-bacalhau flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          ›
        </button>
      </Show>
    </div>
  );
}

export default function Homepage2() {
  const [photos] = createResource(fetchPhotos);
  const safeList = createMemo(() => sortPhotos(photos() ?? []));

  return (
    <main class="bg-surface min-h-screen">
      <Show
        when={!photos.loading}
        fallback={
          <div class="h-screen w-full flex items-center justify-center bg-surface">
            <div class="flex flex-col items-center gap-4">
              <div class="w-8 h-8 border-2 border-superbock/30 border-t-superbock rounded-full animate-spin" />
              <span class="text-bacalhau/40 tracking-widest uppercase text-xs">
                Loading...
              </span>
            </div>
          </div>
        }
      >
        <Show
          when={!photos.error && safeList().length > 0}
          fallback={
            <div class="h-screen w-full flex items-center justify-center bg-surface px-6 text-center">
              <div class="space-y-4 max-w-md">
                <div class="w-16 h-16 mx-auto rounded-full border-2 border-superbock/20 flex items-center justify-center">
                  <span class="text-superbock text-2xl">◐</span>
                </div>
                <p class="text-bacalhau/60 tracking-widest uppercase text-xs">
                  Gallery unavailable
                </p>
                <p class="text-sm text-bacalhau/30">
                  Photos could not be loaded from the API.
                </p>
              </div>
            </div>
          }
        >
          {/* === Section 1: Split Hero === */}
          <section class="min-h-screen flex flex-col lg:flex-row">
            {/* Left: Text */}
            <div class="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 lg:py-0 relative">
              <div class="absolute inset-0 opacity-[0.03]" style={{
                "background-image": `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                "background-size": "24px 24px",
              }} />

              <div class="relative z-10 max-w-lg">
                <p class="text-superbock text-xs font-bold tracking-[0.3em] uppercase mb-6">
                  Hugo Marques
                </p>

                <h1 class="font-serif text-5xl md:text-6xl xl:text-7xl text-bacalhau tracking-tight leading-[1.1] mb-8">
                  Photography
                  <br />
                  <span class="text-superbock">&</span>
                  <br />
                  Code
                </h1>

                <p class="text-bacalhau-200/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-md">
                  Capturing light through a lens, crafting experiences through code. Based in the United Kingdom.
                </p>

                <div class="flex flex-wrap gap-4">
                  <A
                    href="/photos"
                    class="group inline-flex items-center gap-3 px-7 py-3.5 bg-superbock text-vinho-900 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-superbock-300 hover:shadow-lg hover:shadow-superbock/20"
                  >
                    Browse Gallery
                    <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </A>
                  <A
                    href="/about"
                    class="inline-flex items-center gap-2 px-7 py-3.5 border border-superbock/25 text-bacalhau rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-superbock/10 hover:border-superbock/40"
                  >
                    About Me
                  </A>
                </div>
              </div>
            </div>

            {/* Right: Featured photo mosaic */}
            <div class="flex-1 relative min-h-[50vh] lg:min-h-0">
              <div class="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1.5 p-1.5 lg:p-3">
                <Show when={safeList().length >= 5}>
                  <div class="col-span-2 row-span-2 overflow-hidden rounded-lg">
                    <FeaturedPhoto photo={safeList()[0]} priority />
                  </div>
                  <div class="overflow-hidden rounded-lg">
                    <FeaturedPhoto photo={safeList()[1]} />
                  </div>
                  <div class="overflow-hidden rounded-lg">
                    <FeaturedPhoto photo={safeList()[2]} />
                  </div>
                </Show>
              </div>
              {/* Gradient fade into page */}
              <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent lg:hidden" />
            </div>
          </section>

          {/* === Section 2: Horizontal scrolling strip === */}
          <section class="py-20 md:py-28">
            <div class="px-8 md:px-16 lg:px-20 mb-8 flex items-end justify-between">
              <div>
                <p class="text-superbock text-xs font-bold tracking-[0.3em] uppercase mb-2">
                  Recent Work
                </p>
                <h2 class="font-serif text-3xl md:text-4xl text-bacalhau">
                  Latest Captures
                </h2>
              </div>
              <A
                href="/photos"
                class="text-superbock hover:text-superbock-300 text-sm font-medium transition-colors hidden sm:block"
              >
                View all →
              </A>
            </div>

            <div class="px-8 md:px-16 lg:px-20">
              <PhotoStrip photos={safeList().slice(0, 12)} />
            </div>
          </section>

          {/* === Section 3: Bento grid highlight === */}
          <section class="px-8 md:px-16 lg:px-20 py-20 md:py-28">
            <div class="max-w-7xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
                <Show when={safeList().length >= 8}>
                  <div class="md:col-span-8 md:row-span-2 rounded-xl overflow-hidden">
                    <FeaturedPhoto photo={safeList()[3]} />
                  </div>
                  <div class="md:col-span-4 rounded-xl overflow-hidden">
                    <FeaturedPhoto photo={safeList()[4]} />
                  </div>
                  <div class="md:col-span-4 rounded-xl overflow-hidden">
                    <FeaturedPhoto photo={safeList()[5]} />
                  </div>
                  <div class="md:col-span-4 rounded-xl overflow-hidden">
                    <FeaturedPhoto photo={safeList()[6]} />
                  </div>
                  <div class="md:col-span-4 rounded-xl overflow-hidden">
                    <FeaturedPhoto photo={safeList()[7]} />
                  </div>
                  <div class="md:col-span-4 rounded-xl overflow-hidden">
                    <Show
                      when={safeList().length >= 9}
                      fallback={
                        <div class="w-full h-full bg-vinho/30 rounded-xl flex items-center justify-center">
                          <A
                            href="/photos"
                            class="text-superbock text-sm font-medium hover:text-superbock-300 transition-colors"
                          >
                            View all photos →
                          </A>
                        </div>
                      }
                    >
                      <FeaturedPhoto photo={safeList()[8]} />
                    </Show>
                  </div>
                </Show>
              </div>
            </div>
          </section>

          {/* === Section 4: About teaser with gradient === */}
          <section class="relative py-28 md:py-36 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-surface via-vinho/20 to-surface" />
            <div class="absolute inset-0 opacity-[0.02]" style={{
              "background-image": `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              "background-size": "32px 32px",
            }} />

            <div class="relative z-10 max-w-4xl mx-auto px-8 md:px-16 text-center">
              <p class="text-superbock text-xs font-bold tracking-[0.3em] uppercase mb-6">
                About
              </p>
              <h2 class="font-serif text-3xl md:text-5xl text-bacalhau mb-8 leading-tight">
                Amateur photographer just trying
                <br class="hidden md:block" />
                {" "}to capture the world a little closer
              </h2>
              <p class="text-bacalhau-200/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                When I'm not writing code, I'm out with my OM System OM-3 shooting landscapes, streets, and portraits. This site is both my portfolio and my playground.
              </p>
              <A
                href="/about"
                class="inline-flex items-center gap-2 px-7 py-3.5 border border-superbock/25 text-bacalhau rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:bg-superbock/10 hover:border-superbock/40"
              >
                More about me
              </A>
            </div>
          </section>

          {/* === Footer === */}
          <footer class="py-12 px-8 md:px-16 border-t border-superbock/10">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-vinho-300 text-sm">
                Built with SolidJS
              </p>
              <div class="flex items-center gap-6">
                <A href="/photos" class="text-bacalhau-300 hover:text-superbock text-sm transition-colors">
                  Photos
                </A>
                <A href="/about" class="text-bacalhau-300 hover:text-superbock text-sm transition-colors">
                  About
                </A>
                <A href="/blog" class="text-bacalhau-300 hover:text-superbock text-sm transition-colors">
                  Blog
                </A>
              </div>
            </div>
          </footer>
        </Show>
      </Show>
    </main>
  );
}
