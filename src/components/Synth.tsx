import { createSignal, createEffect, onCleanup, onMount, For } from "solid-js";
import Knob from "./Knob";
import PianoKeyboard from "./PianoKeyboard";
import Oscilloscope from "./Oscilloscope";

type WaveformType = "sine" | "square" | "sawtooth" | "triangle";

const WAVEFORMS: { type: WaveformType; label: string; icon: string }[] = [
  { type: "sine", label: "Sine", icon: "∿" },
  { type: "square", label: "Square", icon: "⊓" },
  { type: "sawtooth", label: "Saw", icon: "⋀" },
  { type: "triangle", label: "Tri", icon: "△" },
];

const OCTAVES = [-2, -1, 0, 1, 2];

export default function Synth() {
  const [isClient, setIsClient] = createSignal(false);
  const [audioContext, setAudioContext] = createSignal<AudioContext | null>(null);
  const [masterGain, setMasterGain] = createSignal<GainNode | null>(null);
  const [filterNode, setFilterNode] = createSignal<BiquadFilterNode | null>(null);
  const [analyserNode, setAnalyserNode] = createSignal<AnalyserNode | null>(null);
  const [delayNode, setDelayNode] = createSignal<DelayNode | null>(null);
  const [delayFeedback, setDelayFeedbackNode] = createSignal<GainNode | null>(null);
  const [delayMix, setDelayMixNode] = createSignal<GainNode | null>(null);
  const [dryGain, setDryGain] = createSignal<GainNode | null>(null);
  const [reverbNode, setReverbNode] = createSignal<ConvolverNode | null>(null);
  const [reverbMix, setReverbMixNode] = createSignal<GainNode | null>(null);
  const [reverbDry, setReverbDry] = createSignal<GainNode | null>(null);

  // Synth parameters
  const [volume, setVolume] = createSignal(50);
  const [frequency, setFrequency] = createSignal(440);
  const [waveform, setWaveform] = createSignal<WaveformType>("sine");
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [octave, setOctave] = createSignal(0);

  // ADSR Envelope
  const [attack, setAttack] = createSignal(0.01);
  const [decay, setDecay] = createSignal(0.1);
  const [sustain, setSustain] = createSignal(0.7);
  const [release, setRelease] = createSignal(0.3);

  // Filter parameters
  const [filterCutoff, setFilterCutoff] = createSignal(5000);
  const [filterResonance, setFilterResonance] = createSignal(1);

  // Delay parameters
  const [delayTime, setDelayTime] = createSignal(300);
  const [delayFeedbackAmount, setDelayFeedbackAmount] = createSignal(30);
  const [delayMixAmount, setDelayMixAmount] = createSignal(20);

  // Reverb parameters
  const [reverbMixAmount, setReverbMixAmount] = createSignal(20);

  // Polyphonic voice tracking - Map of frequency to {oscillator, gain}
  const activeVoices = new Map<number, { osc: OscillatorNode; gain: GainNode }>();

  onMount(() => {
    setIsClient(true);
  });

  // Create impulse response for reverb
  const createReverbImpulse = (ctx: AudioContext, duration: number, decay: number) => {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const leftChannel = impulse.getChannelData(0);
    const rightChannel = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const envelope = Math.exp(-n * decay);
      leftChannel[i] = (Math.random() * 2 - 1) * envelope;
      rightChannel[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  };

  // Initialize audio context on first user interaction
  const initAudio = () => {
    if (audioContext()) return audioContext()!;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterCutoff();
    filter.Q.value = filterResonance();

    const delay = ctx.createDelay(2);
    delay.delayTime.value = delayTime() / 1000;

    const delayFb = ctx.createGain();
    delayFb.gain.value = delayFeedbackAmount() / 100;

    const delayWet = ctx.createGain();
    delayWet.gain.value = delayMixAmount() / 100;

    const dry = ctx.createGain();
    dry.gain.value = 1;

    const reverb = ctx.createConvolver();
    reverb.buffer = createReverbImpulse(ctx, 2, 3);

    const reverbWet = ctx.createGain();
    reverbWet.gain.value = reverbMixAmount() / 100;

    const reverbDryGain = ctx.createGain();
    reverbDryGain.gain.value = 1 - (reverbMixAmount() / 100);

    const gain = ctx.createGain();
    gain.gain.value = volume() / 100;

    filter.connect(dry);
    filter.connect(delay);
    delay.connect(delayFb);
    delayFb.connect(delay);
    delay.connect(delayWet);

    dry.connect(gain);
    delayWet.connect(gain);

    gain.connect(reverbDryGain);
    gain.connect(reverb);
    reverb.connect(reverbWet);

    reverbDryGain.connect(analyser);
    reverbWet.connect(analyser);
    analyser.connect(ctx.destination);

    setAudioContext(ctx);
    setMasterGain(gain);
    setFilterNode(filter);
    setAnalyserNode(analyser);
    setDelayNode(delay);
    setDelayFeedbackNode(delayFb);
    setDelayMixNode(delayWet);
    setDryGain(dry);
    setReverbNode(reverb);
    setReverbMixNode(reverbWet);
    setReverbDry(reverbDryGain);

    return ctx;
  };

  // Update effects
  createEffect(() => {
    const gain = masterGain();
    if (gain) gain.gain.setTargetAtTime(volume() / 100, gain.context.currentTime, 0.01);
  });

  createEffect(() => {
    const filter = filterNode();
    if (filter) filter.frequency.setTargetAtTime(filterCutoff(), filter.context.currentTime, 0.01);
  });

  createEffect(() => {
    const filter = filterNode();
    if (filter) filter.Q.setTargetAtTime(filterResonance(), filter.context.currentTime, 0.01);
  });

  createEffect(() => {
    const delay = delayNode();
    if (delay) delay.delayTime.setTargetAtTime(delayTime() / 1000, delay.context.currentTime, 0.01);
  });

  createEffect(() => {
    const fb = delayFeedback();
    if (fb) fb.gain.setTargetAtTime(delayFeedbackAmount() / 100, fb.context.currentTime, 0.01);
  });

  createEffect(() => {
    const wet = delayMix();
    if (wet) wet.gain.setTargetAtTime(delayMixAmount() / 100, wet.context.currentTime, 0.01);
  });

  createEffect(() => {
    const wet = reverbMix();
    const dry = reverbDry();
    if (wet && dry) {
      const mixValue = reverbMixAmount() / 100;
      wet.gain.setTargetAtTime(mixValue, wet.context.currentTime, 0.01);
      dry.gain.setTargetAtTime(1 - mixValue * 0.5, dry.context.currentTime, 0.01);
    }
  });

  createEffect(() => {
    const wave = waveform();
    // Update all active voices
    activeVoices.forEach((voice) => {
      voice.osc.type = wave;
    });
  });

  const getShiftedFrequency = (baseFreq: number) => baseFreq * Math.pow(2, octave());

  const handleNoteOn = (freq: number) => {
    const ctx = initAudio();
    const filter = filterNode();
    if (!filter) return;

    const shiftedFreq = getShiftedFrequency(freq);

    // If this note is already playing, don't start another
    if (activeVoices.has(freq)) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform();
    osc.frequency.value = shiftedFreq;
    gain.gain.value = 0;

    osc.connect(gain);
    gain.connect(filter);
    osc.start();

    // Store the voice
    activeVoices.set(freq, { osc, gain });

    // Apply ADSR envelope
    const now = ctx.currentTime;
    gain.gain.setTargetAtTime(1, now, attack() / 3);
    gain.gain.setTargetAtTime(sustain(), now + attack(), decay() / 3);

    setIsPlaying(true);
  };

  const handleNoteOff = (freq: number) => {
    const voice = activeVoices.get(freq);
    if (!voice) return;

    const ctx = audioContext();
    if (ctx) {
      const { osc, gain } = voice;

      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, release() / 3);

      // Remove from active voices immediately to allow re-triggering
      activeVoices.delete(freq);

      // Stop oscillator after release completes
      setTimeout(() => {
        try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
      }, release() * 1000 + 100);
    }

      // Only set not playing if no voices
    if (activeVoices.size === 0) {
      setIsPlaying(false);
    }
  };

  onCleanup(() => {
    // Stop all active voices
    activeVoices.forEach((voice) => {
      try { voice.osc.stop(); voice.osc.disconnect(); voice.gain.disconnect(); } catch {}
    });
    activeVoices.clear();
    audioContext()?.close();
  });

  return (
    <div class="w-full max-w-5xl mx-auto">
      <div
        class="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
          "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Header */}
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div class="w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(135deg, #444 0%, #222 100%)" }} />
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                background: isPlaying() ? "#D4AF37" : "#333",
                "box-shadow": isPlaying() ? "0 0 8px rgba(212, 175, 55, 0.8)" : "none",
              }}
            />
            <h2 class="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#D4AF37" }}>
              Hugo Synth
            </h2>
          </div>
          <div class="w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(135deg, #444 0%, #222 100%)" }} />
        </div>

        {/* Main Grid Layout */}
        <div class="p-4">
          {/* Controls */}
          <div class="space-y-4">
            {/* Top Row: Oscilloscope + Waveform + Main Controls */}
            <div class="flex flex-wrap items-start gap-4 justify-center lg:justify-start">
              <Oscilloscope analyser={analyserNode()} isPlaying={isPlaying()} />

              {/* Waveform + Octave */}
              <div class="flex flex-col gap-3">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">Wave</span>
                  <div class="flex gap-1">
                    <For each={WAVEFORMS}>
                      {(wave) => {
                        const isActive = () => waveform() === wave.type;
                        return (
                          <button
                            type="button"
                            class="w-12 h-10 rounded transition-all duration-150 flex flex-col items-center justify-center"
                            style={{
                              background: isActive() ? "linear-gradient(145deg, #2a2a2a, #1a1a1a)" : "linear-gradient(145deg, #1f1f1f, #141414)",
                              "box-shadow": isActive() ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(212, 175, 55, 0.3)" : "0 2px 4px rgba(0,0,0,0.3)",
                              border: isActive() ? "1px solid rgba(212, 175, 55, 0.5)" : "1px solid rgba(255,255,255,0.05)",
                            }}
                            onClick={() => setWaveform(wave.type)}
                          >
                            <span style={{ color: isActive() ? "#D4AF37" : "#666", "font-size": "14px" }}>{wave.icon}</span>
                            <span class="text-[7px] uppercase" style={{ color: isActive() ? "#D4AF37" : "#555" }}>{wave.label}</span>
                          </button>
                        );
                      }}
                    </For>
                  </div>
                </div>

                <div class="flex flex-col items-center gap-1">
                  <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">Octave</span>
                  <div class="flex gap-0.5">
                    <For each={OCTAVES}>
                      {(oct) => {
                        const isActive = () => octave() === oct;
                        return (
                          <button
                            type="button"
                            class="w-8 h-6 rounded text-[10px] font-bold transition-all"
                            style={{
                              background: isActive() ? "linear-gradient(145deg, #2a2a2a, #1a1a1a)" : "linear-gradient(145deg, #1f1f1f, #141414)",
                              border: isActive() ? "1px solid rgba(212, 175, 55, 0.5)" : "1px solid rgba(255,255,255,0.05)",
                              color: isActive() ? "#D4AF37" : "#666",
                            }}
                            onClick={() => setOctave(oct)}
                          >
                            {oct > 0 ? `+${oct}` : oct}
                          </button>
                        );
                      }}
                    </For>
                  </div>
                </div>
              </div>

              {/* Main Knobs */}
              <div class="flex gap-4">
                <Knob value={volume()} min={0} max={100} onChange={setVolume} label="Vol" unit="%" size={55} />
                <Knob value={frequency()} min={20} max={2000} onChange={setFrequency} label="Freq" unit="Hz" size={55} />
              </div>
            </div>

            {/* Middle Row: Filter + Envelope + Effects */}
            <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
              {/* Filter */}
              <div class="flex flex-col items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
                <span class="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-500">Filter</span>
                <div class="flex gap-3">
                  <Knob value={filterCutoff()} min={100} max={10000} onChange={setFilterCutoff} label="Cut" unit="Hz" size={42} tooltip="Cutoff: Frequencies above this are filtered out (low-pass)" />
                  <Knob value={filterResonance()} min={0.1} max={20} onChange={setFilterResonance} label="Res" unit="Q" size={42} tooltip="Resonance: Boosts frequencies near the cutoff for a sharper sound" />
                </div>
              </div>

              {/* Envelope */}
              <div class="flex flex-col items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
                <span class="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-500">Envelope</span>
                <div class="flex gap-2">
                  <Knob value={attack() * 1000} min={1} max={2000} onChange={(v) => setAttack(v / 1000)} label="A" unit="ms" size={38} tooltip="Attack: How fast the sound fades in when you press a key" />
                  <Knob value={decay() * 1000} min={1} max={2000} onChange={(v) => setDecay(v / 1000)} label="D" unit="ms" size={38} tooltip="Decay: Time to fall from peak to sustain level" />
                  <Knob value={sustain() * 100} min={0} max={100} onChange={(v) => setSustain(v / 100)} label="S" unit="%" size={38} tooltip="Sustain: Volume level while key is held down" />
                  <Knob value={release() * 1000} min={1} max={3000} onChange={(v) => setRelease(v / 1000)} label="R" unit="ms" size={38} tooltip="Release: How long the sound fades out after releasing key" />
                </div>
              </div>

              {/* Delay */}
              <div class="flex flex-col items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
                <span class="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-500">Delay</span>
                <div class="flex gap-2">
                  <Knob value={delayTime()} min={50} max={1000} onChange={setDelayTime} label="Time" unit="ms" size={38} />
                  <Knob value={delayFeedbackAmount()} min={0} max={80} onChange={setDelayFeedbackAmount} label="FB" unit="%" size={38} />
                  <Knob value={delayMixAmount()} min={0} max={100} onChange={setDelayMixAmount} label="Mix" unit="%" size={38} />
                </div>
              </div>

              {/* Reverb */}
              <div class="flex flex-col items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
                <span class="text-[8px] font-bold tracking-[0.15em] uppercase text-gray-500">Reverb</span>
                <div class="flex gap-2">
                  <Knob value={reverbMixAmount()} min={0} max={100} onChange={setReverbMixAmount} label="Mix" unit="%" size={38} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Keyboard Section */}
        <div class="px-4 pb-4">
          <div class="h-px mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)" }} />
          <PianoKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} octaves={1} />
        </div>

        {/* Footer */}
        <div class="px-4 py-2 border-t border-white/5 flex justify-between items-center" style={{ background: "rgba(0,0,0,0.3)" }}>
          <span class="text-[8px] text-gray-600 tracking-wider">WEB AUDIO API</span>
          <span class="text-[8px] text-gray-600 tracking-wider">MODEL HS-04</span>
        </div>
      </div>
    </div>
  );
}
