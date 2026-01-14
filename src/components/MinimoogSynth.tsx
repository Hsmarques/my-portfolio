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

const OSCILLATOR_OCTAVES = [-2, -1, 0, 1, 2];

export default function MinimoogSynth() {
  const [isClient, setIsClient] = createSignal(false);
  const [audioContext, setAudioContext] = createSignal<AudioContext | null>(null);
  const [masterGain, setMasterGain] = createSignal<GainNode | null>(null);
  const [filterNode, setFilterNode] = createSignal<BiquadFilterNode | null>(null);
  const [analyserNode, setAnalyserNode] = createSignal<AnalyserNode | null>(null);

  // Synth parameters
  const [volume, setVolume] = createSignal(50);
  const [isPlaying, setIsPlaying] = createSignal(false);

  // 3 Oscillators
  const [osc1Waveform, setOsc1Waveform] = createSignal<WaveformType>("sawtooth");
  const [osc1Octave, setOsc1Octave] = createSignal(0);
  const [osc1Level, setOsc1Level] = createSignal(100);

  const [osc2Waveform, setOsc2Waveform] = createSignal<WaveformType>("sawtooth");
  const [osc2Octave, setOsc2Octave] = createSignal(0);
  const [osc2Level, setOsc2Level] = createSignal(0);

  const [osc3Waveform, setOsc3Waveform] = createSignal<WaveformType>("sawtooth");
  const [osc3Octave, setOsc3Octave] = createSignal(0);
  const [osc3Level, setOsc3Level] = createSignal(0);

  // Filter parameters (24dB/octave simulated with higher resonance)
  const [filterCutoff, setFilterCutoff] = createSignal(5000);
  const [filterResonance, setFilterResonance] = createSignal(5);

  // ADSR Envelope
  const [attack, setAttack] = createSignal(0.01);
  const [decay, setDecay] = createSignal(0.1);
  const [sustain, setSustain] = createSignal(0.7);
  const [release, setRelease] = createSignal(0.3);

  // Polyphonic voice tracking - Map of frequency to {oscillators, gain}
  const activeVoices = new Map<number, {
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    osc3: OscillatorNode;
    gain: GainNode;
    osc1Gain: GainNode;
    osc2Gain: GainNode;
    osc3Gain: GainNode;
  }>();

  onMount(() => {
    setIsClient(true);
  });

  // Initialize audio context on first user interaction
  const initAudio = () => {
    if (audioContext()) return audioContext()!;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    // 24dB/octave filter simulation (using higher Q/resonance)
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterCutoff();
    filter.Q.value = filterResonance();

    const gain = ctx.createGain();
    gain.gain.value = volume() / 100;

    filter.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    setAudioContext(ctx);
    setMasterGain(gain);
    setFilterNode(filter);
    setAnalyserNode(analyser);

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

  // Update oscillator waveforms for all active voices
  createEffect(() => {
    const wave1 = osc1Waveform();
    const wave2 = osc2Waveform();
    const wave3 = osc3Waveform();
    activeVoices.forEach((voice) => {
      voice.osc1.type = wave1;
      voice.osc2.type = wave2;
      voice.osc3.type = wave3;
    });
  });

  // Update oscillator levels for all active voices
  createEffect(() => {
    const level1 = osc1Level() / 100;
    const level2 = osc2Level() / 100;
    const level3 = osc3Level() / 100;
    activeVoices.forEach((voice) => {
      voice.osc1Gain.gain.setTargetAtTime(level1, voice.osc1Gain.context.currentTime, 0.01);
      voice.osc2Gain.gain.setTargetAtTime(level2, voice.osc2Gain.context.currentTime, 0.01);
      voice.osc3Gain.gain.setTargetAtTime(level3, voice.osc3Gain.context.currentTime, 0.01);
    });
  });

  const getShiftedFrequency = (baseFreq: number, octaveShift: number) =>
    baseFreq * Math.pow(2, octaveShift);

  const handleNoteOn = (freq: number) => {
    const ctx = initAudio();
    const filter = filterNode();
    if (!filter) return;

    // If this note is already playing, don't start another
    if (activeVoices.has(freq)) return;

    // Create 3 oscillators
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();

    // Create gain nodes for each oscillator
    const osc1Gain = ctx.createGain();
    const osc2Gain = ctx.createGain();
    const osc3Gain = ctx.createGain();

    // Create master gain for this voice
    const gain = ctx.createGain();

    // Set oscillator frequencies with octave shifts
    osc1.frequency.value = getShiftedFrequency(freq, osc1Octave());
    osc2.frequency.value = getShiftedFrequency(freq, osc2Octave());
    osc3.frequency.value = getShiftedFrequency(freq, osc3Octave());

    // Set waveforms
    osc1.type = osc1Waveform();
    osc2.type = osc2Waveform();
    osc3.type = osc3Waveform();

    // Set initial gain levels
    osc1Gain.gain.value = 0;
    osc2Gain.gain.value = 0;
    osc3Gain.gain.value = 0;
    gain.gain.value = 0;

    // Connect: Oscillators -> Individual Gains -> Master Gain -> Filter
    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc3.connect(osc3Gain);

    osc1Gain.connect(gain);
    osc2Gain.connect(gain);
    osc3Gain.connect(gain);

    gain.connect(filter);

    // Start oscillators
    osc1.start();
    osc2.start();
    osc3.start();

    // Store the voice
    activeVoices.set(freq, { osc1, osc2, osc3, gain, osc1Gain, osc2Gain, osc3Gain });

    // Apply ADSR envelope to master gain
    const now = ctx.currentTime;
    gain.gain.setTargetAtTime(1, now, attack() / 3);
    gain.gain.setTargetAtTime(sustain(), now + attack(), decay() / 3);

    // Set oscillator levels
    osc1Gain.gain.value = osc1Level() / 100;
    osc2Gain.gain.value = osc2Level() / 100;
    osc3Gain.gain.value = osc3Level() / 100;

    setIsPlaying(true);
  };

  const handleNoteOff = (freq: number) => {
    const voice = activeVoices.get(freq);
    if (!voice) return;

    const ctx = audioContext();
    if (ctx) {
      const { osc1, osc2, osc3, gain } = voice;

      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, release() / 3);

      // Remove from active voices immediately to allow re-triggering
      activeVoices.delete(freq);

      // Stop oscillators after release completes
      setTimeout(() => {
        try {
          osc1.stop(); osc1.disconnect();
          osc2.stop(); osc2.disconnect();
          osc3.stop(); osc3.disconnect();
          gain.disconnect();
        } catch {}
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
      try {
        voice.osc1.stop(); voice.osc1.disconnect();
        voice.osc2.stop(); voice.osc2.disconnect();
        voice.osc3.stop(); voice.osc3.disconnect();
        voice.osc1Gain.disconnect();
        voice.osc2Gain.disconnect();
        voice.osc3Gain.disconnect();
        voice.gain.disconnect();
      } catch {}
    });
    activeVoices.clear();
    audioContext()?.close();
  });

  return (
    <div class="w-full max-w-5xl mx-auto">
      <div
        class="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #f5f0e8 0%, #e8ddd0 100%)",
          "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          border: "2px solid #d4a574",
        }}
      >
        {/* Wood grain side panels */}
        <div
          class="absolute left-0 top-0 bottom-0 w-8"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                #8b6f47 0px,
                #8b6f47 2px,
                #a0825d 2px,
                #a0825d 4px,
                #8b6f47 4px,
                #8b6f47 6px
              )
            `,
            "box-shadow": "inset -2px 0 4px rgba(0,0,0,0.3)",
          }}
        />
        <div
          class="absolute right-0 top-0 bottom-0 w-8"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                #8b6f47 0px,
                #8b6f47 2px,
                #a0825d 2px,
                #a0825d 4px,
                #8b6f47 4px,
                #8b6f47 6px
              )
            `,
            "box-shadow": "inset 2px 0 4px rgba(0,0,0,0.3)",
          }}
        />

        {/* Header */}
        <div class="flex items-center justify-between px-12 py-3 border-b-2" style={{ "border-color": "#c41e3a", background: "rgba(196, 30, 58, 0.1)" }}>
          <div class="w-3 h-3 rounded-full" style={{ background: "#c41e3a", "box-shadow": "0 0 8px rgba(196, 30, 58, 0.6)" }} />
          <div class="flex items-center gap-2">
            <div
              class="w-2.5 h-2.5 rounded-full transition-all duration-200"
              style={{
                background: isPlaying() ? "#c41e3a" : "#999",
                "box-shadow": isPlaying() ? "0 0 8px rgba(196, 30, 58, 0.8)" : "none",
              }}
            />
            <h2 class="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "#c41e3a" }}>
              Minimoog
            </h2>
          </div>
          <div class="w-3 h-3 rounded-full" style={{ background: "#c41e3a", "box-shadow": "0 0 8px rgba(196, 30, 58, 0.6)" }} />
        </div>

        {/* Main Content */}
        <div class="p-6 pl-14 pr-14">
          <div class="space-y-6">
            {/* Top Row: Oscilloscope */}
            <div class="flex justify-center">
              <Oscilloscope analyser={analyserNode()} isPlaying={isPlaying()} />
            </div>

            {/* Oscillators Section */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <For each={[
                {
                  label: "Osc 1",
                  waveform: osc1Waveform,
                  setWaveform: setOsc1Waveform,
                  octave: osc1Octave,
                  setOctave: setOsc1Octave,
                  level: osc1Level,
                  setLevel: setOsc1Level,
                },
                {
                  label: "Osc 2",
                  waveform: osc2Waveform,
                  setWaveform: setOsc2Waveform,
                  octave: osc2Octave,
                  setOctave: setOsc2Octave,
                  level: osc2Level,
                  setLevel: setOsc2Level,
                },
                {
                  label: "Osc 3",
                  waveform: osc3Waveform,
                  setWaveform: setOsc3Waveform,
                  octave: osc3Octave,
                  setOctave: setOsc3Octave,
                  level: osc3Level,
                  setLevel: setOsc3Level,
                },
              ]}>
                {(osc) => (
                  <div
                    class="flex flex-col items-center gap-3 p-4 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.3)",
                      border: "1px solid rgba(196, 30, 58, 0.2)",
                    }}
                  >
                    <span class="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#c41e3a" }}>
                      {osc.label}
                    </span>

                    {/* Waveform selector */}
                    <div class="flex flex-col items-center gap-2">
                      <span class="text-[8px] font-bold tracking-[0.15em] uppercase" style={{ color: "#666" }}>Wave</span>
                      <div class="flex gap-1">
                        <For each={WAVEFORMS}>
                          {(wave) => {
                            const isActive = () => osc.waveform() === wave.type;
                            return (
                              <button
                                type="button"
                                class="w-10 h-8 rounded transition-all duration-150 flex flex-col items-center justify-center"
                                style={{
                                  background: isActive() ? "rgba(196, 30, 58, 0.2)" : "rgba(255,255,255,0.5)",
                                  "box-shadow": isActive() ? "inset 0 2px 4px rgba(0,0,0,0.2), 0 0 6px rgba(196, 30, 58, 0.3)" : "0 1px 2px rgba(0,0,0,0.1)",
                                  border: isActive() ? "1px solid rgba(196, 30, 58, 0.5)" : "1px solid rgba(0,0,0,0.1)",
                                }}
                                onClick={() => osc.setWaveform(wave.type)}
                              >
                                <span style={{ color: isActive() ? "#c41e3a" : "#999", "font-size": "12px" }}>{wave.icon}</span>
                                <span class="text-[6px] uppercase" style={{ color: isActive() ? "#c41e3a" : "#999" }}>{wave.label}</span>
                              </button>
                            );
                          }}
                        </For>
                      </div>
                    </div>

                    {/* Octave selector */}
                    <div class="flex flex-col items-center gap-1">
                      <span class="text-[8px] font-bold tracking-[0.15em] uppercase" style={{ color: "#666" }}>Octave</span>
                      <div class="flex gap-0.5">
                        <For each={OSCILLATOR_OCTAVES}>
                          {(oct) => {
                            const isActive = () => osc.octave() === oct;
                            return (
                              <button
                                type="button"
                                class="w-7 h-5 rounded text-[9px] font-bold transition-all"
                                style={{
                                  background: isActive() ? "rgba(196, 30, 58, 0.2)" : "rgba(255,255,255,0.5)",
                                  border: isActive() ? "1px solid rgba(196, 30, 58, 0.5)" : "1px solid rgba(0,0,0,0.1)",
                                  color: isActive() ? "#c41e3a" : "#666",
                                }}
                                onClick={() => osc.setOctave(oct)}
                              >
                                {oct > 0 ? `+${oct}` : oct}
                              </button>
                            );
                          }}
                        </For>
                      </div>
                    </div>

                    {/* Level knob */}
                    <Knob
                      value={osc.level()}
                      min={0}
                      max={100}
                      onChange={osc.setLevel}
                      label="Level"
                      unit="%"
                      size={45}
                    />
                  </div>
                )}
              </For>
            </div>

            {/* Filter and Envelope Section */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filter */}
              <div
                class="flex flex-col items-center gap-3 p-4 rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(196, 30, 58, 0.2)",
                }}
              >
                <span class="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#c41e3a" }}>Filter</span>
                <div class="flex gap-4">
                  <Knob value={filterCutoff()} min={100} max={10000} onChange={setFilterCutoff} label="Cutoff" unit="Hz" size={50} />
                  <Knob value={filterResonance()} min={0.1} max={20} onChange={setFilterResonance} label="Res" unit="Q" size={50} />
                </div>
              </div>

              {/* Envelope */}
              <div
                class="flex flex-col items-center gap-3 p-4 rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(196, 30, 58, 0.2)",
                }}
              >
                <span class="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#c41e3a" }}>Envelope</span>
                <div class="flex gap-2">
                  <Knob value={attack() * 1000} min={1} max={2000} onChange={(v) => setAttack(v / 1000)} label="A" unit="ms" size={40} />
                  <Knob value={decay() * 1000} min={1} max={2000} onChange={(v) => setDecay(v / 1000)} label="D" unit="ms" size={40} />
                  <Knob value={sustain() * 100} min={0} max={100} onChange={(v) => setSustain(v / 100)} label="S" unit="%" size={40} />
                  <Knob value={release() * 1000} min={1} max={3000} onChange={(v) => setRelease(v / 1000)} label="R" unit="ms" size={40} />
                </div>
              </div>
            </div>

            {/* Master Volume */}
            <div class="flex justify-center">
              <Knob value={volume()} min={0} max={100} onChange={setVolume} label="Volume" unit="%" size={55} />
            </div>
          </div>
        </div>

        {/* Keyboard Section */}
        <div class="px-6 pb-6 pl-14 pr-14">
          <div class="h-px mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196, 30, 58, 0.3), transparent)" }} />
          <PianoKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} octaves={1} />
        </div>

        {/* Footer */}
        <div class="px-12 py-2 border-t-2 flex justify-between items-center" style={{ "border-color": "#c41e3a", background: "rgba(196, 30, 58, 0.1)" }}>
          <span class="text-[8px] tracking-wider" style={{ color: "#c41e3a" }}>WEB AUDIO API</span>
          <span class="text-[8px] tracking-wider" style={{ color: "#c41e3a" }}>MODEL D</span>
        </div>
      </div>
    </div>
  );
}

