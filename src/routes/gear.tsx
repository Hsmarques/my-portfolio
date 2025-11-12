export default function Gear() {
  return (
    <main class="mx-auto max-w-4xl px-4 py-10">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-100">Gear</h1>
        <p class="mt-2 text-gray-400">My current kit for photography.</p>
      </header>

      <section class="space-y-8">
        <div class="bg-gray-900/40 border border-gray-800 rounded-lg p-5">
          <h2 class="text-xl font-semibold text-gray-100">Camera</h2>
          <ul class="mt-3 list-disc list-inside text-gray-300">
            <li>OM System OM-3</li>
          </ul>
        </div>

        <div class="bg-gray-900/40 border border-gray-800 rounded-lg p-5">
          <h2 class="text-xl font-semibold text-gray-100">Lenses</h2>
          <ul class="mt-3 space-y-2 text-gray-300">
            <li>
              <span class="font-medium text-gray-100">
                M.Zuiko 12–45mm f/4 PRO
              </span>
              <div class="text-gray-400 text-sm">
                Compact constant-aperture zoom; my everyday walkaround for
                travel and landscapes.
              </div>
            </li>
            <li>
              <span class="font-medium text-gray-100">
                OM System 40–150mm f/4 PRO
              </span>
              <div class="text-gray-400 text-sm">
                Telephoto zoom with constant f/4 aperture; excellent for
                portraits, wildlife, and compressed landscapes.
              </div>
            </li>
            <li>
              <span class="font-medium text-gray-100">
                Panasonic Leica 9mm f/1.7
              </span>
              <div class="text-gray-400 text-sm">
                Ultra-wide prime; great for dramatic perspectives and night
                scenes.
              </div>
            </li>
            <li>
              <span class="font-medium text-gray-100">Olympus 25mm f/1.2</span>
              <div class="text-gray-400 text-sm">
                Fast standard prime; excellent low-light performance and
                beautiful bokeh.
              </div>
            </li>
            <li>
              <span class="font-medium text-gray-100">M.Zuiko 45mm f/1.8</span>
              <div class="text-gray-400 text-sm">
                Lightweight portrait prime; crisp, fast, and reliable.
              </div>
            </li>
          </ul>
        </div>

        <div class="text-sm text-gray-500">
          Want EXIF on photos? Open any image in the gallery; details show in
          the lightbox footer.
        </div>
      </section>
    </main>
  );
}
