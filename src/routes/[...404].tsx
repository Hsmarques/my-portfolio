import { A } from "@solidjs/router";
import Footer from "~/components/Footer";

export default function NotFound() {
  return (
    <div class="min-h-dvh flex flex-col bg-paper text-ink">
      <main id="main" class="flex-1 mx-auto max-w-xl px-4 pt-40 pb-24 text-center">
        <p class="text-sm text-ink/40 mb-4">404</p>
        <h1 class="text-5xl font-semibold tracking-tight leading-none">
          Page not found
        </h1>
        <p class="mt-6 text-base text-ink/60 text-pretty">
          That page is not in this book. Try the series list instead.
        </p>
        <div class="mt-10 flex items-center justify-center gap-6 text-sm font-medium">
          <A
            href="/"
            class="underline-offset-4 hover:underline"
          >
            Series
          </A>
          <A
            href="/about"
            class="underline-offset-4 hover:underline"
          >
            About
          </A>
        </div>
      </main>
      <Footer />
    </div>
  );
}
