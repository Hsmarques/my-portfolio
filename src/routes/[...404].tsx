import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="mx-auto max-w-2xl px-4 py-28 text-center text-port">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
        404
      </p>
      <h1 class="mt-4 text-5xl font-serif text-port">Page not found</h1>
      <p class="mt-6 text-base leading-relaxed text-port/65">
        That route does not exist in the Vite+ app shell.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4 text-sm font-medium">
        <A href="/" class="rounded-full border border-port/25 px-5 py-2 text-port hover:bg-port/5">
          Home
        </A>
        <A
          href="/photos"
          class="rounded-full border border-port/25 px-5 py-2 text-port hover:bg-port/5"
        >
          Photos
        </A>
      </div>
    </main>
  );
}
