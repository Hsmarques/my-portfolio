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
    <main class="min-h-screen">
      <Show
        when={!photos.loading}
        fallback={
          <div class="h-screen w-full flex items-center justify-center text-port/50">
            <div class="animate-pulse tracking-widest uppercase text-xs">
              Loading Gallery...
            </div>
          </div>
        }
      >
        <Show
          when={!photos.error && safeList().length > 0}
          fallback={
            <div class="h-screen w-full flex items-center justify-center px-6 text-center text-port/70">
              <div class="space-y-3">
                <p class="tracking-widest uppercase text-xs">Cloudinary unavailable</p>
                <p class="text-sm text-port/55">
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
                class="w-full h-full object-cover object-center opacity-60 scale-105"
                width={safeList()[0].width}
                height={safeList()[0].height}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div class="absolute inset-0 bg-gradient-to-b from-port/75 via-port/25 to-cream/90" />
            </div>

            <div class="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 pt-20">
              <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl text-cream tracking-tight drop-shadow-[0_2px_24px_rgba(89,37,50,0.45)]">
                Capturing <span class="italic text-accent-400">Light</span> &{" "}
                <span class="italic text-accent-400">Code</span>
              </h1>
              <p class="text-lg md:text-xl text-cream/95 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                I'm Hugo - I take photos and build websites.
              </p>
              <div class="pt-8 animate-fade-in-up">
                <a
                  href="#gallery"
                  class="inline-block px-8 py-3 border border-cream/40 hover:bg-cream/15 hover:border-cream/60 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-cream transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Work
                </a>
              </div>
            </div>
          </section>

          {/* Recent Work */}
          <section
            id="gallery"
            class="py-24 px-4 md:px-8 max-w-7xl mx-auto rounded-t-3xl bg-cream/85 backdrop-blur-sm border-t border-port/10 shadow-[0_-20px_60px_-20px_rgba(89,37,50,0.12)]"
          >
            <div class="flex items-end justify-between mb-12 pb-4 border-b border-port/15">
              <h2 class="text-3xl font-serif text-port">Recent Captures</h2>
              <a
                href="/photos"
                class="text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors mb-1"
              >
                View all photos →
              </a>
            </div>
            <Gallery photos={safeList().slice(0, 9)} />

            <div class="mt-20 text-center">
              <p class="text-port/45 text-sm font-light">
                Designed & Built with SolidJS
              </p>
            </div>
          </section>
        </Show>
      </Show>
    </main>
  );
}
