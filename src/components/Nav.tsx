import { A, useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "text-accent-400"
      : "text-port/65 hover:text-port transition-colors";

  return (
    <nav class="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <div class="pointer-events-auto bg-cream/70 backdrop-blur-md border border-port/15 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-lg shadow-port/10">
        <A
          href="/"
          class={`font-serif font-bold tracking-tight text-lg ${
            location.pathname === "/" ? "text-port" : "text-port/80 hover:text-port"
          }`}
        >
          Hugo
        </A>
        <div class="h-4 w-px bg-port/15" />
        <ul class="flex items-center gap-6 text-sm font-medium tracking-wide">
          <li>
            <A href="/photos" class={active("/photos")}>
              Photos
            </A>
          </li>
          <li>
            <A href="/synth" class={active("/synth")}>
              Synth
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
