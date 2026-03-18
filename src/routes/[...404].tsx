import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="mx-auto max-w-2xl px-4 py-28 text-center text-gray-100">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400">
        404
      </p>
      <h1 class="mt-4 text-5xl font-serif text-white">Page not found</h1>
      <p class="mt-6 text-base leading-relaxed text-gray-400">
        That route does not exist in the Vite+ app shell.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4 text-sm font-medium">
        <A href="/" class="rounded-full border border-white/15 px-5 py-2 hover:bg-white/5">
          Home
        </A>
        <A
          href="/photos"
          class="rounded-full border border-white/15 px-5 py-2 hover:bg-white/5"
        >
          Photos
        </A>
      </div>
    </main>
  );
}
