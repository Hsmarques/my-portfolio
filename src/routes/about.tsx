import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="mx-auto max-w-4xl px-4 py-20 text-gray-100">
      <header class="mb-12 text-center">
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-white mb-4">About Hugo</h1>
        <p class="text-gray-400 text-lg font-light max-w-2xl mx-auto">
          Photographer first, developer second. Based in the United Kingdom.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        <div class="md:col-span-3 space-y-8">
          <section>
            <h2 class="text-xl font-serif text-accent-300 mb-4">The Journey</h2>
            <p class="leading-relaxed text-gray-300 mb-4">
              I capture moments that tell stories. Whether it's the silent grandeur of a landscape, 
              the chaotic rhythm of a street scene, or the intimate honesty of a portrait, 
              my goal is always the same: to freeze time in a way that evokes emotion.
            </p>
            <p class="leading-relaxed text-gray-300">
              When I'm not behind the camera, I'm building digital experiences using modern web technologies.
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

          <section>
            <h2 class="text-xl font-serif text-accent-300 mb-6">My Gear</h2>
            <div class="space-y-6">
              <div>
                <h3 class="font-medium text-white mb-1">Camera Body</h3>
                <ul class="list-disc list-inside text-gray-400 pl-2">
                  <li>OM System OM-3</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-medium text-white mb-2">Lenses</h3>
                <ul class="space-y-3 text-gray-400">
                  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span class="text-gray-200 font-medium min-w-fit">M.Zuiko 12–45mm f/4 PRO</span>
                    <span class="text-sm text-gray-500 italic">My everyday walkaround for travel and landscapes.</span>
                  </li>
                  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span class="text-gray-200 font-medium min-w-fit">OM System 40–150mm f/4 PRO</span>
                    <span class="text-sm text-gray-500 italic">Excellent for portraits, wildlife, and compressed landscapes.</span>
                  </li>
                  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span class="text-gray-200 font-medium min-w-fit">Panasonic Leica 9mm f/1.7</span>
                    <span class="text-sm text-gray-500 italic">Ultra-wide prime for dramatic perspectives.</span>
                  </li>
                  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span class="text-gray-200 font-medium min-w-fit">Olympus 25mm f/1.2</span>
                    <span class="text-sm text-gray-500 italic">Standard prime with beautiful bokeh.</span>
                  </li>
                  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span class="text-gray-200 font-medium min-w-fit">M.Zuiko 45mm f/1.8</span>
                    <span class="text-sm text-gray-500 italic">Lightweight portrait specialist.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside class="md:col-span-2 space-y-8">
          <div class="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 class="text-lg font-serif text-white mb-4">Quick Facts</h2>
            <ul class="space-y-3 text-sm text-gray-300">
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
