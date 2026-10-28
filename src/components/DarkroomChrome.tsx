import { A } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from "solid-js";
import { EASE, IDLE_MS, prefersReducedMotion } from "~/lib/motion";

type Props = {
  visible?: boolean;
  showGridToggle?: boolean;
  gridActive?: boolean;
  onToggleGrid?: () => void;
  center?: JSX.Element;
};

export default function DarkroomChrome(props: Props) {
  const [idleHidden, setIdleHidden] = createSignal(false);
  let timer: number | undefined;
  let chromeEl: HTMLElement | undefined;

  const bump = () => {
    setIdleHidden(false);
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => setIdleHidden(true), IDLE_MS);
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    bump();
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) =>
      window.addEventListener(event, bump, { passive: true }),
    );
    onCleanup(() => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, bump));
    });
  });

  const chromeVisible = () =>
    props.visible === false ? false : !idleHidden();

  createEffect(() => {
    const el = chromeEl;
    if (!el) return;
    // Fully inert while faded so it is neither clickable nor tabbable.
    if (chromeVisible()) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  });

  return (
    <header
      ref={(el) => {
        chromeEl = el;
      }}
      class="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-6"
      classList={{
        "pointer-events-none": !chromeVisible(),
      }}
      style={{
        opacity: chromeVisible() ? "1" : "0",
        transition: `opacity 800ms ${EASE}`,
      }}
      aria-hidden={chromeVisible() ? undefined : true}
    >
      <div class="pointer-events-auto flex items-start justify-between gap-4 text-sm text-white">
        <A
          href="/"
          class="font-medium hover:opacity-70 transition-opacity duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
        >
          Hugo Marques
        </A>

        <div class="flex items-center gap-4">
          <Show when={props.center}>{props.center}</Show>
          <Show when={props.showGridToggle}>
            <button
              type="button"
              onClick={() => props.onToggleGrid?.()}
              class="text-[#9B9B9B] hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
              aria-pressed={props.gridActive ? "true" : "false"}
              aria-label={
                props.gridActive ? "Show filmstrip" : "Show contact sheet"
              }
            >
              {props.gridActive ? "filmstrip" : "grid"}
            </button>
          </Show>
          <A
            href="/photos"
            class="text-[#9B9B9B] hover:text-white transition-colors duration-300 ease-darkroom focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            index
          </A>
        </div>
      </div>
    </header>
  );
}
