import { A } from "@solidjs/router";
import DarkroomChrome from "~/components/DarkroomChrome";
import SiteFooter from "~/components/SiteFooter";

export default function NotFound() {
  return (
    <main class="bg-[#181818] text-white min-h-[100dvh] pt-20">
      <DarkroomChrome />
      <div class="mx-auto max-w-xl px-4 py-24 text-center">
        <p class="font-mono text-sm text-[#9B9B9B]">404</p>
        <h1 class="mt-4 text-3xl font-medium text-white text-wrap-balance">
          Page not found
        </h1>
        <p class="mt-4 text-sm text-[#9B9B9B] text-wrap-pretty">
          That page is not part of this site. Head back to the photographs.
        </p>
        <div class="mt-10 flex items-center justify-center gap-6 text-sm">
          <A
            href="/"
            class="text-white hover:opacity-70 transition-opacity duration-300 ease-darkroom"
          >
            Home
          </A>
          <A
            href="/photos"
            class="text-[#9B9B9B] hover:text-white transition-colors duration-300 ease-darkroom"
          >
            Index
          </A>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
