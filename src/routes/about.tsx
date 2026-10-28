import { A } from "@solidjs/router";
import Footer from "~/components/Footer";

export default function About() {
  return (
    <div class="min-h-dvh flex flex-col bg-paper text-ink">
      <main id="main" class="flex-1 mx-auto max-w-3xl px-4 pt-32 md:pt-40 pb-20">
        <h1 class="text-5xl md:text-6xl font-semibold tracking-tight text-wrap-balance leading-none mb-10">
          About
        </h1>

        <div class="space-y-8 text-base leading-relaxed text-ink/80 text-pretty">
          <p>
            I am an amateur photographer learning to see a little more carefully.
            Photography is a way to disconnect and look closer at quiet places.
          </p>
          <p>
            The photographs here are personal favourites, the frames that felt
            finished enough to share. I am still experimenting and trying to
            improve.
          </p>
        </div>

        <section class="mt-16">
          <h2 class="text-2xl font-semibold tracking-tight mb-6">Gear</h2>
          <div class="space-y-6 text-ink/80">
            <div>
              <h3 class="font-medium text-ink mb-2">Camera</h3>
              <p>OM System OM-3</p>
            </div>
            <div>
              <h3 class="font-medium text-ink mb-2">Lenses</h3>
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

        <aside class="mt-16 space-y-3 text-sm text-ink/70">
          <p>
            <span class="text-ink/40">Genres</span> Landscape, street, portrait
          </p>
          <p>
            <span class="text-ink/40">Based in</span> United Kingdom
          </p>
        </aside>

        <div class="mt-12">
          <A
            href="/"
            class="text-sm font-medium underline-offset-4 hover:underline"
          >
            View series
          </A>
        </div>
      </main>
      <Footer />
    </div>
  );
}
