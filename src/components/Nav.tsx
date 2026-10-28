import { A, useLocation } from "@solidjs/router";
import { createSignal, onCleanup, onMount } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const [open, setOpen] = createSignal(false);

  const linkClass = (path: string) =>
    path === location.pathname
      ? "text-ink font-medium"
      : "text-ink/60 hover:text-ink transition-colors duration-300 ease-photo";

  onMount(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  return (
    <header class="fixed top-0 inset-x-0 z-50">
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:text-ink focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <nav class="mx-auto max-w-6xl px-4 pt-4 flex items-center justify-between">
        <A
          href="/"
          class="text-sm font-semibold tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          Hugo Marques
        </A>

        <ul class="hidden sm:flex items-center gap-8 text-sm">
          <li>
            <A href="/" class={linkClass("/")}>
              Series
            </A>
          </li>
          <li>
            <A href="/about" class={linkClass("/about")}>
              About
            </A>
          </li>
        </ul>

        <button
          type="button"
          class="sm:hidden relative h-10 w-10 text-ink"
          aria-label={open() ? "Close menu" : "Open menu"}
          aria-expanded={open()}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            class={`absolute left-2 right-2 top-[14px] h-px bg-ink transition-transform duration-500 ease-photo ${
              open() ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            class={`absolute left-2 right-2 top-[24px] h-px bg-ink transition-transform duration-500 ease-photo ${
              open() ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        class={`sm:hidden fixed inset-0 z-40 bg-paper/95 backdrop-blur-md transition-[opacity,visibility] duration-500 ease-photo ${
          open() ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul class="pt-24 px-8 space-y-6 text-2xl font-medium">
          <li
            class={`transition-[opacity,transform] duration-500 ease-photo ${
              open() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ "transition-delay": open() ? "0ms" : "0ms" }}
          >
            <A href="/" class="text-ink" onClick={() => setOpen(false)}>
              Series
            </A>
          </li>
          <li
            class={`transition-[opacity,transform] duration-500 ease-photo ${
              open() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ "transition-delay": open() ? "60ms" : "0ms" }}
          >
            <A href="/about" class="text-ink" onClick={() => setOpen(false)}>
              About
            </A>
          </li>
        </ul>
      </div>
    </header>
  );
}
