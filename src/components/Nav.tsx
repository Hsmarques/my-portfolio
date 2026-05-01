import { A, useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "text-superbock-400"
      : "text-bacalhau-200 hover:text-bacalhau transition-colors";

  return (
    <nav class="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <div class="pointer-events-auto bg-vinho-800/70 backdrop-blur-md border border-superbock-400/15 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-2xl">
        <A
          href="/"
          class={`font-serif font-bold tracking-tight text-lg ${
            location.pathname === "/" ? "text-bacalhau" : "text-bacalhau-200 hover:text-bacalhau"
          }`}
        >
          Hugo
        </A>
        <div class="h-4 w-px bg-superbock-400/20" />
        <ul class="flex items-center gap-6 text-sm font-medium tracking-wide">
          <li>
            <A href="/photos" class={active("/photos")}>
              Photos
            </A>
          </li>
          <li>
            <A href="/about" class={active("/about")}>
              About
            </A>
          </li>
        </ul>
      </div>
    </nav>
  );
}
