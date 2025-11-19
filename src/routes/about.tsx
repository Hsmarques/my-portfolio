import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="mx-auto max-w-4xl px-4 py-20 text-gray-100">
      <header class="mb-12 text-center">
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-white mb-4">About Hugo</h1>
        <p class="text-gray-400 text-lg font-light max-w-2xl mx-auto">
          Developer & Amateur Photographer. Based in the United Kingdom.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        <div class="md:col-span-3 space-y-8">
          <section>
            <h2 class="text-xl font-serif text-accent-300 mb-4">Hello</h2>
            <p class="leading-relaxed text-gray-300 mb-4">
              I'm an amateur photographer just trying to learn how to take good pictures. Photography is a way for me to disconnect and observe the world a little closer.
            </p>
            <p class="leading-relaxed text-gray-300">
              The photos on this website are simply a collection of my personal favorites—the ones that I feel turned out well. I'm constantly experimenting and trying to improve my craft.
            </p>
            <div class="pt-6">
              <A
                href="/photos"
                class="inline-block px-6 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm font-medium tracking-wide transition-colors"
              >
                View Gallery
              </A>
            </div>
          </section>
        </div>

        <aside class="md:col-span-2 space-y-8">
          <div class="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 class="text-lg font-serif text-white mb-4">Quick Facts</h2>
            <ul class="space-y-3 text-sm text-gray-300">
              <li class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-500">Camera</span>
                <span>OM System OM-3</span>
              </li>
              <li class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-500">Genres</span>
                <span>Landscape, Street, Portrait</span>
              </li>
              <li class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-500">Based in</span>
                <span>United Kingdom</span>
              </li>
              <li class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-500">Tech Stack</span>
                <span class="text-right">SolidStart, Tailwind, TS</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
