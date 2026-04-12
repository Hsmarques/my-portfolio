import {
  Show,
  For,
  createMemo,
  createResource,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import { A } from "@solidjs/router";
import type { Photo } from "~/lib/photos";
import { fetchPhotos, sortPhotos } from "~/lib/loadPhotos";

const PLACEHOLDER_PHOTOS: Photo[] = Array.from({ length: 14 }, (_, i) => ({
  id: `placeholder-${i}`,
  src: `https://picsum.photos/seed/pt${i}/800/600`,
  srcFull: `https://picsum.photos/seed/pt${i}/1600/1200`,
  alt: `Photo ${i + 1}`,
  width: 800,
  height: i % 3 === 0 ? 1000 : 600,
  tags: ["placeholder"],
}));

async function safeFetchPhotos(): Promise<Photo[]> {
  try {
    return await fetchPhotos();
  } catch {
    return [];
  }
}

function MarqueeStrip(props: { text: string; reverse?: boolean }) {
  return (
    <div class="overflow-hidden whitespace-nowrap select-none" aria-hidden="true">
      <div
        class="inline-flex"
        style={{
          animation: `marquee ${props.reverse ? "25s" : "20s"} linear infinite ${props.reverse ? "reverse" : ""}`,
        }}
      >
        <For each={Array(6).fill(0)}>
          {() => (
            <span class="mx-8 font-serif text-[clamp(3rem,8vw,8rem)] italic opacity-[0.07] text-superbock">
              {props.text}
            </span>
          )}
        </For>
      </div>
    </div>
  );
}

function PhotoReveal(props: { photo: Photo; index: number }) {
  const [visible, setVisible] = createSignal(false);
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    if (typeof window === "undefined" || !ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(ref);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      ref={ref}
      class="transition-all duration-1000 ease-out"
      style={{
        opacity: visible() ? "1" : "0",
        transform: visible() ? "translateY(0)" : "translateY(40px)",
        "transition-delay": `${(props.index % 3) * 120}ms`,
      }}
    >
      <A href={`/photo/${props.photo.id}`} class="block group">
        <div class="overflow-hidden rounded-sm">
          <img
            src={props.photo.src}
            alt={props.photo.alt}
            loading="lazy"
            class="w-full h-auto block"
            width={props.photo.width}
            height={props.photo.height}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </A>
    </div>
  );
}

export default function Homepage3() {
  const [photos] = createResource(safeFetchPhotos);
  const safeList = createMemo(() => {
    if (photos.loading) return [];
    const raw = photos() ?? [];
    return raw.length > 0 ? sortPhotos(raw) : PLACEHOLDER_PHOTOS;
  });

  const [scrollY, setScrollY] = createSignal(0);

  onMount(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const parallaxOffset = () => scrollY() * 0.3;

  return (
    <main class="min-h-screen overflow-x-hidden">
      {/* Inject keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(1%, 3%); }
          30% { transform: translate(-3%, 1%); }
          40% { transform: translate(3%, -1%); }
          50% { transform: translate(-1%, 2%); }
          60% { transform: translate(2%, -3%); }
          70% { transform: translate(-2%, 1%); }
          80% { transform: translate(1%, -2%); }
          90% { transform: translate(-1%, 3%); }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          SECTION 1: Full-bleed gradient hero
          ═══════════════════════════════════════════════ */}
      <section class="relative min-h-screen flex items-end overflow-hidden">
        {/* The gradient IS the hero — no photo needed */}
        <div
          class="absolute inset-0"
          style={{
            background: `linear-gradient(170deg, #592532 0%, #7a2d3e 20%, #D49E08 55%, #f5c842 75%, #FFF0D1 100%)`,
          }}
        />

        {/* Film grain texture overlay */}
        <div
          class="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
          style={{
            "background-image": `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            "background-size": "128px 128px",
            animation: "grain 0.5s steps(1) infinite",
          }}
        />

        {/* Content at the bottom of the viewport */}
        <div
          class="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-20"
          style={{ transform: `translateY(${-parallaxOffset()}px)` }}
        >
          <div class="max-w-7xl mx-auto">
            <p class="text-vinho-800 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-4 md:mb-6">
              Hugo Marques — Portfolio
            </p>
            <h1 class="font-serif leading-[0.9] tracking-tight mb-6 md:mb-10">
              <span class="block text-[clamp(3.5rem,12vw,11rem)] text-vinho-900">
                Photos
              </span>
              <span class="block text-[clamp(3.5rem,12vw,11rem)] text-vinho-800/60 italic -mt-2 md:-mt-4">
                & Code
              </span>
            </h1>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <A
                href="/photos"
                class="group inline-flex items-center gap-3 px-8 py-4 bg-vinho text-bacalhau rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-vinho-700 hover:shadow-xl hover:shadow-vinho/30"
              >
                Enter Gallery
                <span class="transition-transform duration-300 group-hover:translate-x-1.5 text-superbock">→</span>
              </A>
              <p class="text-vinho-800/70 text-sm max-w-xs">
                Landscape, street & portrait photography from the United Kingdom.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span class="text-vinho-800/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div class="w-px h-8 bg-vinho-800/30 animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Marquee text break
          ═══════════════════════════════════════════════ */}
      <section class="bg-surface py-10 md:py-16 -mt-px">
        <MarqueeStrip text="Photography" />
        <MarqueeStrip text="Code & Pixels" reverse />
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: Featured photo — cinematic widescreen
          ═══════════════════════════════════════════════ */}
      <Show when={safeList().length > 0}>
        <section class="bg-surface">
          <div class="relative w-full" style={{ "aspect-ratio": "21/9" }}>
            <img
              src={(safeList()[0] as any).srcFull || safeList()[0].src}
              alt={safeList()[0].alt}
              class="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div class="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface" />
            <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/50" />

            <div class="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
              <div class="max-w-7xl mx-auto flex items-end justify-between">
                <div>
                  <p class="text-superbock text-xs font-bold tracking-[0.3em] uppercase mb-2">Featured</p>
                  <h2 class="font-serif text-2xl md:text-4xl text-bacalhau">Selected Work</h2>
                </div>
                <A
                  href="/photos"
                  class="text-superbock text-sm hover:text-superbock-300 transition-colors hidden md:block"
                >
                  All photos →
                </A>
              </div>
            </div>
          </div>
        </section>
      </Show>

      {/* ═══════════════════════════════════════════════
          SECTION 4: Staggered masonry gallery
          ═══════════════════════════════════════════════ */}
      <Show when={safeList().length > 1}>
        <section class="bg-surface px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div class="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <For each={safeList().slice(1, 10)}>
              {(photo, i) => <PhotoReveal photo={photo} index={i()} />}
            </For>
          </div>
        </section>
      </Show>

      {/* ═══════════════════════════════════════════════
          SECTION 5: Big statement with gradient text
          ═══════════════════════════════════════════════ */}
      <section class="bg-surface py-28 md:py-40 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #D49E08 0%, transparent 70%)" }}
        />

        <div class="relative z-10 max-w-5xl mx-auto text-center">
          <h2
            class="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8"
            style={{
              background: "linear-gradient(135deg, #FFF0D1 0%, #D49E08 40%, #592532 100%)",
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "transparent",
              "background-clip": "text",
            }}
          >
            The world looks different
            <br />
            through the viewfinder
          </h2>
          <p class="text-bacalhau-200/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            I take photos and build websites. This is where I share both — a collection of my favourite shots and the code that powers it all.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <A
              href="/photos"
              class="group inline-flex items-center gap-3 px-8 py-4 bg-superbock text-vinho-900 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-superbock-300 hover:shadow-lg hover:shadow-superbock/20"
            >
              Explore
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </A>
            <A
              href="/about"
              class="inline-flex items-center gap-2 px-8 py-4 border border-superbock/20 text-bacalhau/80 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-superbock/5 hover:border-superbock/40"
            >
              About the Photographer
            </A>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6: Stats / numbers bar
          ═══════════════════════════════════════════════ */}
      <section class="relative overflow-hidden">
        <div
          class="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #592532 0%, #3b1721 50%, #592532 100%)",
          }}
        />
        <div class="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-20">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p class="font-serif text-4xl md:text-5xl text-superbock mb-2">
                {safeList().length > 0 ? safeList().length : "—"}
              </p>
              <p class="text-bacalhau/50 text-xs tracking-[0.2em] uppercase">Photos</p>
            </div>
            <div>
              <p class="font-serif text-4xl md:text-5xl text-superbock mb-2">5</p>
              <p class="text-bacalhau/50 text-xs tracking-[0.2em] uppercase">Lenses</p>
            </div>
            <div>
              <p class="font-serif text-4xl md:text-5xl text-superbock mb-2">3</p>
              <p class="text-bacalhau/50 text-xs tracking-[0.2em] uppercase">Genres</p>
            </div>
            <div>
              <p class="font-serif text-4xl md:text-5xl text-superbock mb-2">∞</p>
              <p class="text-bacalhau/50 text-xs tracking-[0.2em] uppercase">Curiosity</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7: Two-column about + photo
          ═══════════════════════════════════════════════ */}
      <section class="bg-surface px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-superbock text-xs font-bold tracking-[0.3em] uppercase mb-6">About</p>
            <h2 class="font-serif text-3xl md:text-5xl text-bacalhau leading-tight mb-8">
              Amateur photographer, professional curious person
            </h2>
            <p class="text-bacalhau-200/60 text-base md:text-lg leading-relaxed mb-6">
              Photography is how I slow down. Behind the camera, the world shrinks to just what's in the frame — light, form, moment. Everything else falls away.
            </p>
            <p class="text-bacalhau-200/60 text-base md:text-lg leading-relaxed mb-10">
              When I'm not shooting, I'm building things for the web. This site is my playground for both.
            </p>
            <A
              href="/about"
              class="inline-flex items-center gap-2 text-superbock text-sm font-medium hover:text-superbock-300 transition-colors group"
            >
              Read more
              <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </A>
          </div>

          <Show when={safeList().length > 10}>
            <div class="relative">
              <div class="rounded-lg overflow-hidden">
                <img
                  src={(safeList()[10] as any).srcFull || safeList()[10].src}
                  alt={safeList()[10].alt}
                  class="w-full h-auto"
                  loading="lazy"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              {/* Decorative accent block */}
              <div
                class="absolute -bottom-4 -right-4 w-24 h-24 rounded-lg -z-10"
                style={{ background: "linear-gradient(135deg, #D49E08, #592532)" }}
              />
            </div>
          </Show>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8: Closing gradient band + footer
          ═══════════════════════════════════════════════ */}
      <section class="relative h-64 md:h-80 overflow-hidden">
        <div
          class="absolute inset-0"
          style={{
            background: "linear-gradient(170deg, #1a0f14 0%, #592532 30%, #D49E08 65%, #FFF0D1 100%)",
          }}
        />
        <div
          class="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay"
          style={{
            "background-image": `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            "background-size": "128px 128px",
          }}
        />
        <div class="relative z-10 h-full flex items-end pb-8 px-6 md:px-12 lg:px-20">
          <div class="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <p class="font-serif text-2xl text-vinho-900 mb-1">Hugo Marques</p>
              <p class="text-vinho-800/60 text-xs tracking-wide">Built with SolidJS & Vite</p>
            </div>
            <div class="flex gap-6">
              <A href="/photos" class="text-vinho-800 hover:text-vinho-900 text-sm transition-colors">Photos</A>
              <A href="/about" class="text-vinho-800 hover:text-vinho-900 text-sm transition-colors">About</A>
              <A href="/blog" class="text-vinho-800 hover:text-vinho-900 text-sm transition-colors">Blog</A>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
