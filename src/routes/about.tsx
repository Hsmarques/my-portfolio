import { A } from "@solidjs/router";
import DarkroomChrome from "~/components/DarkroomChrome";
import SiteFooter from "~/components/SiteFooter";

export default function About() {
  return (
    <main class="bg-[#181818] text-white min-h-[100dvh] pt-20">
      <DarkroomChrome />
      <div class="mx-auto max-w-3xl px-4 pb-16 text-sm text-[#9B9B9B]">
        <h1 class="text-3xl font-medium text-white text-wrap-balance">
          About Hugo
        </h1>
        <p class="mt-4 max-w-[65ch] text-wrap-pretty">
          Amateur photographer based in the United Kingdom. Photography is a way
          to disconnect and observe the world a little closer.
        </p>
        <p class="mt-4 max-w-[65ch] text-wrap-pretty">
          The photographs here are personal favourites from a much larger archive,
          grouped into series as the work grows.
        </p>

        <section class="mt-12">
          <h2 class="text-sm font-medium text-white mb-4">Gear</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-white mb-2">Camera body</h3>
              <ul class="space-y-1">
                <li>OM System OM-3</li>
              </ul>
            </div>
            <div>
              <h3 class="text-white mb-2">Lenses</h3>
              <ul class="space-y-1">
                <li>M.Zuiko 12–45mm f/4 PRO</li>
                <li>OM System 40–150mm f/4 PRO</li>
                <li>Panasonic Leica 9mm f/1.7</li>
                <li>Olympus 25mm f/1.2</li>
                <li>M.Zuiko 45mm f/1.8</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mt-12">
          <h2 class="text-sm font-medium text-white mb-4">Facts</h2>
          <ul class="space-y-3">
            <li class="flex justify-between gap-6 border-b border-white/10 pb-2">
              <span>Genres</span>
              <span class="text-white">Landscape, street, portrait</span>
            </li>
            <li class="flex justify-between gap-6 border-b border-white/10 pb-2">
              <span>Based in</span>
              <span class="text-white">United Kingdom</span>
            </li>
          </ul>
        </section>

        <div class="pt-10">
          <A
            href="/photos"
            class="text-white hover:opacity-70 transition-opacity duration-300 ease-darkroom"
          >
            View index
          </A>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
