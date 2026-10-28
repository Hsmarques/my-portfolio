import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="min-h-dvh bg-[#F7F6F2] px-6 pb-24 pt-28 text-[#181818]">
      <div class="mx-auto max-w-2xl">
        <h1 class="text-2xl font-medium text-balance">About</h1>
        <p class="mt-4 text-sm text-[#181818]/70">Based in the United Kingdom.</p>

        <div class="mt-12 space-y-6 text-sm leading-relaxed text-[#181818]/85 text-pretty">
          <p>
            I am an amateur photographer learning how to take quieter pictures.
            Photography is a way to disconnect and look a little closer.
          </p>
          <p>
            The photographs here are personal favourites from a larger archive,
            grouped into series rather than one long grid.
          </p>
        </div>

        <section class="mt-16">
          <h2 class="text-sm font-medium">Gear</h2>
          <div class="mt-6 grid gap-8 text-sm text-[#181818]/80 sm:grid-cols-2">
            <div>
              <h3 class="font-medium text-[#181818]">Camera</h3>
              <ul class="mt-3 space-y-2">
                <li>OM System OM-3</li>
              </ul>
            </div>
            <div>
              <h3 class="font-medium text-[#181818]">Lenses</h3>
              <ul class="mt-3 space-y-2">
                <li>M.Zuiko 12–45mm f/4 PRO</li>
                <li>OM System 40–150mm f/4 PRO</li>
                <li>Panasonic Leica 9mm f/1.7</li>
                <li>Olympus 25mm f/1.2</li>
                <li>M.Zuiko 45mm f/1.8</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mt-16">
          <h2 class="text-sm font-medium">Notes</h2>
          <ul class="mt-6 space-y-3 text-sm text-[#181818]/80">
            <li class="flex justify-between gap-6 border-b border-[#181818]/10 pb-3">
              <span class="text-[#181818]/55">Genres</span>
              <span>Landscape, street, portrait</span>
            </li>
            <li class="flex justify-between gap-6 border-b border-[#181818]/10 pb-3">
              <span class="text-[#181818]/55">Based in</span>
              <span>United Kingdom</span>
            </li>
          </ul>
        </section>

        <div class="mt-12">
          <A
            href="/photos"
            class="text-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
          >
            View series
          </A>
        </div>
      </div>
    </main>
  );
}
