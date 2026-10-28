import { createSignal, onCleanup, onMount } from "solid-js";

export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const CROSSFADE_MS = 700;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = createSignal(false);

  onMount(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    onCleanup(() => media.removeEventListener("change", update));
  });

  return reduced;
}

export function fadeDurationMs(reduced: boolean): number {
  return reduced ? 0 : CROSSFADE_MS;
}
