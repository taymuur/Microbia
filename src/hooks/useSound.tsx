import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Procedural sound, synthesised with the Web Audio API, so there are no audio
// files to ship and it works offline. Muted by default (no autoplay); the toggle
// click is the user gesture that unlocks audio. Each habitat gets its own ambient
// bed and each microbe a little "pop".
type Zone = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways' | 'keepers' | 'intro';

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sources: AudioScheduledSourceNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  enabled = false;
  private zone: Zone = 'intro';

  private ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    // one second of white noise, looped for watery/earthy textures
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;
  }

  async setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      this.ensure();
      if (!this.ctx || !this.master) return;
      await this.ctx.resume();
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(0.5, t + 0.3);
      this.startAmbient(this.zone);
    } else if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(0, t + 0.2);
      this.stopAmbient();
    }
  }

  setZone(zone: Zone) {
    if (zone === this.zone) return;
    this.zone = zone;
    if (this.enabled) this.startAmbient(zone);
  }

  private stopAmbient() {
    const t = this.ctx?.currentTime ?? 0;
    if (this.ambientGain) this.ambientGain.gain.linearRampToValueAtTime(0, t + 0.4);
    const dying = this.sources;
    this.sources = [];
    dying.forEach((s) => {
      try {
        s.stop(t + 0.5);
      } catch {
        /* already stopped */
      }
    });
    this.ambientGain = null;
  }

  private osc(type: OscillatorType, freq: number, gain: GainNode) {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.connect(gain);
    o.start();
    this.sources.push(o);
    return o;
  }

  private startAmbient(zone: Zone) {
    if (!this.ctx || !this.master) return;
    this.stopAmbient();
    if (zone === 'intro') return;
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(this.master);
    const vol = zone === 'waterways' ? 0.05 : 0.07;
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.9);
    this.ambientGain = g;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    lp.connect(g);

    if (zone === 'soil') {
      // deep, earthy drone
      this.osc('sine', 58, lp);
      this.osc('sine', 92, lp);
    } else if (zone === 'gut') {
      // low, squishy pulse (two close sines beat slowly against each other)
      this.osc('sine', 98, lp);
      this.osc('sine', 103, lp);
      this.osc('sine', 150, lp);
    } else if (zone === 'waterways') {
      // bubbling water: band-passed noise + a faint high shimmer
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      noise.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 550;
      bp.Q.value = 4;
      noise.connect(bp);
      bp.connect(g);
      noise.start();
      this.sources.push(noise);
      this.osc('sine', 880, g);
    } else if (zone === 'cafe') {
      // warm, cosy fifth
      this.osc('sine', 220, lp);
      this.osc('triangle', 330, lp);
    } else if (zone === 'mouth') {
      this.osc('sine', 174, lp);
      this.osc('sine', 233, lp);
    } else if (zone === 'poo') {
      this.osc('sine', 70, lp);
      this.osc('sine', 78, lp);
    } else if (zone === 'keepers') {
      this.osc('sine', 174, lp);
      this.osc('sine', 261, lp);
    }
  }

  blip(seed: string) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = 320 + (hash(seed) % 11) * 42;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, now);
    o.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.07);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.28, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.24);
  }

  chime() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    [523, 659, 784].forEach((f, i) => {
      const t = ctx.currentTime + i * 0.09;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g);
      g.connect(this.master!);
      o.start(t);
      o.stop(t + 0.32);
    });
  }
}

const engine = new SoundEngine();

interface SoundState {
  enabled: boolean;
  toggle: () => void;
  blip: (seed: string) => void;
  chime: () => void;
  setZone: (z: Zone) => void;
}

const SoundContext = createContext<SoundState | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const value = useMemo<SoundState>(
    () => ({
      enabled,
      toggle: () => {
        setEnabled((prev) => {
          const next = !prev;
          void engine.setEnabled(next);
          return next;
        });
      },
      blip: (s) => engine.blip(s),
      chime: () => engine.chime(),
      setZone: (z) => engine.setZone(z),
    }),
    [enabled],
  );
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundState {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within a SoundProvider');
  return ctx;
}
