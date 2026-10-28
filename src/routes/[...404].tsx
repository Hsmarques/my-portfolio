import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-28 text-center text-[#181818]">
      <p class="text-sm text-[#181818]/60">404</p>
      <h1 class="mt-4 text-2xl font-medium text-balance">Page not found</h1>
      <p class="mt-6 text-sm leading-relaxed text-[#181818]/70 text-pretty">
        That page does not exist. Try the index of series, or head home.
      </p>
      <div class="mt-10 flex items-center justify-center gap-6 text-sm">
        <A
          href="/"
          class="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
        >
          Home
        </A>
        <A
          href="/photos"
          class="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
        >
          Index
        </A>
      </div>
    </main>
  );
}
