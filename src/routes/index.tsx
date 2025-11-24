import {
  Show,
  createMemo,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import Gallery from "~/components/Gallery";
import staticPhotos from "~/lib/photos";
import { useGlitch } from "~/lib/GlitchContext";

async function fetchManifest() {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/photos-manifest.json", { cache: "no-cache" });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function fetchPhotos() {
  if (typeof window === "undefined") return null; // Return null during SSR
  // Prioritize Cloudinary API over static manifest
  try {
    const res = await fetch("/api/photos");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data; // Use Cloudinary photos if available
      }
    }
  } catch (err) {
    // Silently fall back to manifest
  }
  // Fallback to manifest if API fails or returns empty
  const manifest = await fetchManifest();
  if (manifest !== null) return manifest;
  // Last resort: static photos
  return staticPhotos;
}

export default function Home() {
  const { isBrutalistMode } = useGlitch();
  const [isClient, setIsClient] = createSignal(false);
  onMount(() => setIsClient(true));

  const [photos] = createResource(isClient, async () => fetchPhotos());
  const safeList = createMemo<any[]>(() => {
    const data = photos();
    if (Array.isArray(data)) {
      const list = [...data];
      list.sort((a: any, b: any) => {
        const ad = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bd = b.createdAt ? Date.parse(b.createdAt) : 0;
        if (ad !== bd) return bd - ad;
        return String(b.id).localeCompare(String(a.id));
      });
      return list;
    }
    return []; // Don't show anything until we have real data
  });

  return (
    <main class="bg-black min-h-screen">
      <Show
        when={safeList().length > 0}
        fallback={
          <div class="h-screen w-full flex items-center justify-center bg-black text-white/50">
            <div class="animate-pulse tracking-widest uppercase text-xs">
              Loading Gallery...
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
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]" />
          </div>

          <div class="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8 pt-20">
            <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight drop-shadow-2xl">
              {isBrutalistMode() ? (
                <>
                  CAPTURING <span class="italic text-accent-300">LIGHT</span> &{" "}
                  <span class="italic text-accent-300">CODE</span>
                </>
              ) : (
                <>
                  Capturing <span class="italic text-accent-300">Light</span> &{" "}
                  <span class="italic text-accent-300">Code</span>
                </>
              )}
            </h1>
            <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md opacity-90">
              {isBrutalistMode() 
                ? "SYSTEM: HUGO.EXE | FUNCTION: PHOTOGRAPHY.DLL + WEBDEV.DLL" 
                : "I'm Hugo - I take photos and build websites."}
            </p>
            <div class="pt-8 animate-fade-in-up">
              <a
                href="#gallery"
                class="inline-block px-8 py-3 border border-white/20 hover:bg-white/10 hover:border-white/40 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-white transition-all duration-300 backdrop-blur-sm"
              >
                {isBrutalistMode() ? "[ EXECUTE: VIEW_WORK ]" : "Explore Work"}
              </a>
            </div>
          </div>
        </section>

        {/* Recent Work */}
        <section
          id="gallery"
          class="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-[#0a0a0a]"
        >
          <div class="flex items-end justify-between mb-12 pb-4 border-b border-white/10">
            <h2 class="text-3xl font-serif text-white">
              {isBrutalistMode() ? "[ RECENT_CAPTURES.DAT ]" : "Recent Captures"}
            </h2>
            <a
              href="/photos"
              class="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors mb-1"
            >
              {isBrutalistMode() ? ">> ALL PHOTOS" : "View all photos →"}
            </a>
          </div>
          <Gallery photos={safeList().slice(0, 9)} />

          <div class="mt-20 text-center">
            <p class="text-gray-500 text-sm font-light">
              {isBrutalistMode() 
                ? "POWERED BY: SOLIDJS.FRAMEWORK | STATUS: OPERATIONAL" 
                : "Designed & Built with SolidJS"}
            </p>
          </div>
        </section>
      </Show>
    </main>
  );
}
