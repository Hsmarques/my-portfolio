import { A } from "@solidjs/router";

import PageHeader from "~/components/PageHeader";

export default function About() {
  return (
    <main class="mx-auto max-w-4xl px-4 pt-28 md:pt-32 pb-20 text-bacalhau-200">
      <PageHeader
        title="About Hugo"
        subtitle={<>Developer & Amateur Photographer. Based in the United Kingdom.</>}
      />

      <div class="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        <div class="md:col-span-3 space-y-8">
          <section>
            <h2 class="text-xl font-serif text-superbock mb-4">Hello</h2>
            <p class="leading-relaxed text-bacalhau-200 mb-4">
              I'm an amateur photographer just trying to learn how to take good pictures. Photography is a way for me to disconnect and observe the world a little closer.
            </p>
            <p class="leading-relaxed text-bacalhau-200">
              The photos on this website are simply a collection of my personal favorites—the ones that I feel turned out well. I'm constantly experimenting and trying to improve my craft.
            </p>
            <div class="pt-6">
              <A
                href="/photos"
                class="inline-block px-6 py-2 border border-superbock/25 hover:bg-superbock/10 rounded-full text-sm font-medium tracking-wide text-bacalhau transition-colors"
              >
                View Gallery
              </A>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-serif text-superbock mb-6">My Gear</h2>
            <div class="space-y-6">
              <div>
                <h3 class="font-medium text-bacalhau mb-2">Camera Body</h3>
                <ul class="list-disc list-inside text-bacalhau-300 pl-2">
                  <li>OM System OM-3</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-medium text-bacalhau mb-2">Lenses</h3>
                <ul class="list-disc list-inside text-bacalhau-300 pl-2 space-y-1">
                  <li>M.Zuiko 12–45mm f/4 PRO</li>
                  <li>OM System 40–150mm f/4 PRO</li>
                  <li>Panasonic Leica 9mm f/1.7</li>
                  <li>Olympus 25mm f/1.2</li>
                  <li>M.Zuiko 45mm f/1.8</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside class="md:col-span-2 space-y-8">
          <div class="bg-vinho/30 border border-superbock/15 rounded-lg p-6 backdrop-blur-sm">
            <h2 class="text-lg font-serif text-bacalhau mb-4">Quick Facts</h2>
            <ul class="space-y-3 text-sm text-bacalhau-200">
              <li class="flex justify-between border-b border-superbock/10 pb-2">
                <span class="text-vinho-300">Genres</span>
                <span>Landscape, Street, Portrait</span>
              </li>
              <li class="flex justify-between border-b border-superbock/10 pb-2">
                <span class="text-vinho-300">Based in</span>
                <span>United Kingdom</span>
              </li>
              <li class="flex justify-between pb-2">
                <span class="text-vinho-300">Tech Stack</span>
                <span class="text-right">Solid, Vite+, Vercel, TS</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
