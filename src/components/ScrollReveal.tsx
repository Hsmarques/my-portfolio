import {
  type JSX,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

type ScrollRevealProps = {
  children: JSX.Element;
  class?: string;
  as?: "div" | "section" | "article" | "figure" | "li";
};

/**
 * Rise 32px + fade once on scroll (700ms). Reduced motion: fade only.
 */
export default function ScrollReveal(props: ScrollRevealProps) {
  const Tag = props.as || "div";
  let ref: HTMLElement | undefined;
  const [visible, setVisible] = createSignal(false);
  const [reduceMotion, setReduceMotion] = createSignal(false);

  onMount(() => {
    if (typeof window === "undefined" || !ref) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(media.matches);
    syncMotion();
    media.addEventListener?.("change", syncMotion);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(ref);

    onCleanup(() => {
      observer.disconnect();
      media.removeEventListener?.("change", syncMotion);
    });
  });

  return (
    <Tag
      ref={(el: HTMLElement) => {
        ref = el;
      }}
      class={`${props.class || ""} ${
        visible()
          ? "opacity-100 translate-y-0"
          : reduceMotion()
            ? "opacity-0"
            : "opacity-0 translate-y-8"
      } transition-[opacity,transform] duration-700 ease-photo motion-reduce:translate-y-0`}
    >
      {props.children}
    </Tag>
  );
}
