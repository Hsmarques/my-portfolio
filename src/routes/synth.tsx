import { onMount, createSignal, Show } from "solid-js";
import Synth from "~/components/Synth";
import MinimoogSynth from "~/components/MinimoogSynth";

type SynthType = "hugo" | "minimoog";

export default function SynthPage() {
  const [isClient, setIsClient] = createSignal(false);
  const [synthType, setSynthType] = createSignal<SynthType>("hugo");

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

        {/* Synth Type Selector */}
        <div class="flex justify-center mb-8">
          <div
            class="inline-flex rounded-lg p-1"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              type="button"
              onClick={() => setSynthType("hugo")}
              class="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: synthType() === "hugo"
                  ? "linear-gradient(145deg, #2a2a2a, #1a1a1a)"
                  : "transparent",
                color: synthType() === "hugo" ? "#D4AF37" : "#666",
                "box-shadow": synthType() === "hugo"
                  ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(212, 175, 55, 0.2)"
                  : "none",
                border: synthType() === "hugo"
                  ? "1px solid rgba(212, 175, 55, 0.3)"
                  : "1px solid transparent",
              }}
            >
              Hugo Synth
            </button>
            <button
              type="button"
              onClick={() => setSynthType("minimoog")}
              class="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: synthType() === "minimoog"
                  ? "linear-gradient(145deg, #2a2a2a, #1a1a1a)"
                  : "transparent",
                color: synthType() === "minimoog" ? "#c41e3a" : "#666",
                "box-shadow": synthType() === "minimoog"
                  ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(196, 30, 58, 0.2)"
                  : "none",
                border: synthType() === "minimoog"
                  ? "1px solid rgba(196, 30, 58, 0.3)"
                  : "1px solid transparent",
              }}
            >
              Minimoog
            </button>
          </div>
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
          <Show when={synthType() === "hugo"} fallback={<MinimoogSynth />}>
            <Synth />
          </Show>
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
                {synthType() === "hugo" ? "A-K" : "A-K"}
              </span>
              <span>Play notes with keyboard</span>
            </div>
            {synthType() === "minimoog" && (
              <div class="flex items-center gap-2">
                <span class="text-xs">🎹</span>
                <span>3 oscillators for rich, layered sounds</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
