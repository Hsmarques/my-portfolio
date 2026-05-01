import {
  Show,
  createMemo,
  createResource,
} from "solid-js";
import Gallery from "~/components/Gallery";
import { fetchPhotos, sortPhotos } from "~/lib/loadPhotos";

export default function Home() {
  const [photos] = createResource(fetchPhotos);
  const safeList = createMemo(() => sortPhotos(photos() ?? []));

  return (
    <main class="bg-surface min-h-screen">
      <Show
        when={!photos.loading}
        fallback={
          <div class="h-screen w-full flex items-center justify-center bg-surface text-bacalhau/50">
            <div class="animate-pulse tracking-widest uppercase text-xs">
              Loading Gallery...
            </div>
          </div>
        }
      >
        <Show
          when={!photos.error && safeList().length > 0}
          fallback={
            <div class="h-screen w-full flex items-center justify-center bg-surface px-6 text-center text-bacalhau/60">
              <div class="space-y-3">
                <p class="tracking-widest uppercase text-xs">Cloudinary unavailable</p>
                <p class="text-sm text-bacalhau/40">
                  The gallery could not load photos from `/api/photos`.
                </p>
              </div>
            </div>
          }
        >
          {/* Hero Section */}
          <section class="relative h-screen w-full flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 z-0 select-none">
              <img
                src={(safeList()[0] as any).srcFull || safeList()[0].src}
                alt={safeList()[0].alt}
                class="w-full h-full object-cover object-center opacity-50 scale-105"
                width={safeList()[0].width}
                height={safeList()[0].height}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div class="absolute inset-0 bg-gradient-to-b from-vinho/70 via-vinho/30 to-surface" />
            </div>

            <div class="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 pt-20">
              <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl text-bacalhau tracking-tight drop-shadow-2xl">
                Capturing <span class="italic text-superbock">Light</span> &{" "}
                <span class="italic text-superbock">Code</span>
              </h1>
              <p class="text-lg md:text-xl text-bacalhau-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md opacity-90">
                I'm Hugo - I take photos and build websites.
              </p>
              <div class="pt-8 animate-fade-in-up">
                <a
                  href="#gallery"
                  class="inline-block px-8 py-3 border border-superbock/30 hover:bg-superbock/10 hover:border-superbock/50 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-bacalhau transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Work
                </a>
              </div>
            </div>
          </section>

          {/* Recent Work */}
          <section
            id="gallery"
            class="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-surface"
          >
            <div class="flex items-end justify-between mb-12 pb-4 border-b border-superbock/15">
              <h2 class="text-3xl font-serif text-bacalhau">Recent Captures</h2>
              <a
                href="/photos"
                class="text-superbock hover:text-superbock-300 text-sm font-medium transition-colors mb-1"
              >
                View all photos →
              </a>
            </div>
            <Gallery photos={safeList().slice(0, 9)} />

            <div class="mt-20 text-center">
              <p class="text-vinho-300 text-sm font-light">
                Designed & Built with SolidJS
              </p>
            </div>
          </section>
        </Show>
      </Show>
    </main>
  );
}
