import { onMount } from "solid-js";

/** Photos index redirects to the series table of contents. */
export default function PhotosPage() {
  onMount(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  });

  return (
    <main id="main" class="min-h-dvh bg-paper text-ink flex items-center justify-center px-4">
      <p class="text-sm text-ink/60">Taking you to the series list…</p>
    </main>
  );
}
