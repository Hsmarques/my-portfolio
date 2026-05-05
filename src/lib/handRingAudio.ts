import type { RingNote } from "~/lib/handRing";

type BrowserWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

class RingVoice {
  private oscillator: OscillatorNode;
  private gain: GainNode;
  private activeNote: RingNote | null = null;

  constructor(
    private context: AudioContext,
    destination: AudioNode,
    detune: number,
  ) {
    this.oscillator = context.createOscillator();
    this.gain = context.createGain();

    this.oscillator.type = "sine";
    this.oscillator.detune.value = detune;
    this.gain.gain.value = 0;
    this.oscillator.connect(this.gain);
    this.gain.connect(destination);
    this.oscillator.start();
  }

  play(note: RingNote) {
    if (this.activeNote?.note === note.note) return;

    const now = this.context.currentTime;
    this.activeNote = note;
    this.oscillator.frequency.cancelScheduledValues(now);
    this.oscillator.frequency.setTargetAtTime(note.frequency, now, 0.015);
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(0.18, now, 0.025);
  }

  stop() {
    if (!this.activeNote) return;

    const now = this.context.currentTime;
    this.activeNote = null;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(0, now, 0.04);
  }

  dispose() {
    this.stop();

    const stopAt = this.context.currentTime + 0.08;
    this.oscillator.stop(stopAt);
    this.oscillator.disconnect();
    this.gain.disconnect();
  }
}

export class HandRingAudio {
  private context: AudioContext;
  private masterGain: GainNode;
  private leftVoice: RingVoice;
  private rightVoice: RingVoice;

  constructor() {
    const AudioContextCtor =
      window.AudioContext ?? (window as BrowserWindow).webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error("Web Audio is not supported in this browser.");
    }

    this.context = new AudioContextCtor();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.75;
    this.masterGain.connect(this.context.destination);
    this.leftVoice = new RingVoice(this.context, this.masterGain, -5);
    this.rightVoice = new RingVoice(this.context, this.masterGain, 5);
  }

  async resume() {
    if (this.context.state !== "running") {
      await this.context.resume();
    }
  }

  play(ringId: "left" | "right", note: RingNote) {
    const voice = ringId === "left" ? this.leftVoice : this.rightVoice;
    voice.play(note);
  }

  stop(ringId: "left" | "right") {
    const voice = ringId === "left" ? this.leftVoice : this.rightVoice;
    voice.stop();
  }

  dispose() {
    this.leftVoice.dispose();
    this.rightVoice.dispose();
    this.masterGain.disconnect();
    void this.context.close();
  }
}
