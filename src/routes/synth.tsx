import { onMount, createSignal, Show } from "solid-js";
import Synth from "~/components/Synth";

export default function SynthPage() {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  return (
    <main class="bg-black min-h-screen pt-24 pb-16 px-4">
      <div class="max-w-4xl mx-auto">
        {/* Header */}
        <div class="text-center mb-12">
          <h1 class="font-serif text-4xl md:text-5xl text-white mb-4">
            Web Synth
          </h1>
          <p class="text-gray-400 max-w-xl mx-auto">
            A browser-based synthesizer built with the Web Audio API. Drag the
            knobs, select waveforms, and play notes with your keyboard.
          </p>
        </div>

        {/* Synth component - only render on client */}
        <Show
          when={isClient()}
          fallback={
            <div class="w-full max-w-2xl mx-auto h-96 rounded-2xl bg-zinc-900/50 flex items-center justify-center">
              <span class="text-gray-500 text-sm tracking-widest uppercase animate-pulse">
                Initializing...
              </span>
            </div>
          }
        >
          <Synth />
        </Show>

        {/* Instructions */}
        <div class="mt-12 text-center space-y-4">
          <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
            How to Play
          </h3>
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-mono text-gray-300">
                ↕
              </span>
              <span>Drag knobs to adjust</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-mono text-gray-300">
                A-K
              </span>
              <span>Play notes</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="w-3 h-3 rounded-full"
                style={{ background: "#D4AF37" }}
              />
              <span>Drone mode for continuous sound</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
