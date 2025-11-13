import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="mx-auto max-w-4xl px-4 py-10 text-gray-100">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-100">About Hugo</h1>
        <p class="mt-2 text-gray-400">
          Photographer first, developer second. From Portugal, based in United Kingdom.
        </p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div class="md:col-span-3 space-y-4">
          <p>I try to take nice photos.</p>
          <div class="flex gap-3 pt-2">
            <A
              href="/photos"
              class="bg-white/90 hover:bg-white text-black font-semibold px-4 py-2 rounded"
            >
              View photos
            </A>
          </div>
        </div>

        <aside class="md:col-span-2 bg-gray-900/40 border border-gray-800 rounded-lg p-5">
          <h2 class="text-lg font-semibold text-gray-200 mb-3">Quick facts</h2>
          <ul class="space-y-2 text-gray-300">
            <li>
              <span class="text-gray-500">Gear</span>: OM System OM-3
            </li>
            <li>
              <span class="text-gray-500">Genres</span>: landscape, street,
              portrait
            </li>
            <li>
              <span class="text-gray-500">Tech</span>: SolidStart, Tailwind,
              TypeScript
            </li>
            <li>
              <span class="text-gray-500">Base</span>: United Kingdom
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
