import { useLocation } from "@solidjs/router";
import { useGlitch } from "~/lib/GlitchContext";

export default function Nav() {
  const location = useLocation();
  const { isBrutalistMode } = useGlitch();
  
  const active = (path: string) =>
    path == location.pathname
      ? "text-accent-400"
      : "text-gray-400 hover:text-white transition-colors";

  return (
    <nav class="fixed top-0 inset-x-0 z-50 flex justify-center p-6 pointer-events-none">
      <div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-2xl">
        <a
          href="/"
          class={`font-serif font-bold tracking-tight text-lg ${
            location.pathname === "/" ? "text-white" : "text-gray-300 hover:text-white"
          }`}
        >
          {isBrutalistMode() ? "Hugo Marques, Esq." : "Hugo"}
        </a>
        <div class="h-4 w-px bg-white/10" />
        <ul class="flex items-center gap-6 text-sm font-medium tracking-wide">
          <li>
            <a href="/photos" class={active("/photos")}>
              {isBrutalistMode() ? "Photographs" : "Photos"}
            </a>
          </li>
          <li>
            <a href="/about" class={active("/about")}>
              {isBrutalistMode() ? "Biography" : "About"}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
