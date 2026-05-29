"use client";

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08
) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playClickSound() {
  playTone(800, 0.08, "square", 0.04);
}

export function playSuccessSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  setTimeout(() => playTone(523, 0.1, "sine", 0.06), 0);
  setTimeout(() => playTone(659, 0.1, "sine", 0.06), 80);
  setTimeout(() => playTone(784, 0.15, "sine", 0.06), 160);
}

export function playErrorSound() {
  playTone(200, 0.2, "sawtooth", 0.05);
}

export function playNavigateSound() {
  playTone(600, 0.06, "sine", 0.03);
}

export function playToggleSound() {
  playTone(440, 0.05, "triangle", 0.04);
}

export function playDeleteSound() {
  playTone(300, 0.15, "sawtooth", 0.04);
  setTimeout(() => playTone(200, 0.15, "sawtooth", 0.04), 80);
}
