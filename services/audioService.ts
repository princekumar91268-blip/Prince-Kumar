
import { SoundType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private musicInterval: number | null = null;
  private currentStep: number = 0;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  private startBackgroundMusic() {
    const ctx = this.init();
    if (this.musicInterval) return;

    const tempo = 120; // BPM
    const stepTime = 60 / tempo / 2; // Eighth notes

    // Sequence of frequencies for a "Neon" arpeggio (C minor / Eb Major feel)
    const sequence = [130.81, 155.56, 196.00, 233.08]; // C3, Eb3, G3, Bb3

    this.musicInterval = window.setInterval(() => {
      const now = ctx.currentTime;
      
      // Every 8 steps, play a deep pulse
      if (this.currentStep % 8 === 0) {
        this.playSynthNote(65.41, 'sine', 0.1, now, now + 0.5, 0.4); // C2
      }

      // Melodic arpeggio
      const freq = sequence[this.currentStep % sequence.length];
      this.playSynthNote(freq, 'triangle', 0.03, now, now + 0.2, 0.1);

      this.currentStep++;
    }, stepTime * 1000);
  }

  private playSynthNote(freq: number, type: OscillatorType, volume: number, start: number, stop: number, attack: number = 0.05) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, stop);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(start);
    osc.stop(stop);

    // Track for cleanup if needed, though they stop themselves
    const node = { osc, gain };
    this.musicNodes.push(node);
    setTimeout(() => {
      this.musicNodes = this.musicNodes.filter(n => n !== node);
    }, (stop - start + 1) * 1000);
  }

  private stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    
    const now = this.ctx?.currentTime || 0;
    this.musicNodes.forEach(node => {
      node.gain.gain.cancelScheduledValues(now);
      node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        try { node.osc.stop(); } catch(e) {}
      }, 600);
    });
    this.musicNodes = [];
    this.currentStep = 0;
  }

  private createOscillator(ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, stopTime: number, gainValue: number) {
    if (!this.sfxEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainValue, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(stopTime);
  }

  play(type: SoundType) {
    if (!this.sfxEnabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        this.createOscillator(ctx, 'sine', 600, now, now + 0.1, 0.3);
        this.createOscillator(ctx, 'triangle', 200, now, now + 0.05, 0.2);
        break;
      case 'ui_click':
        this.createOscillator(ctx, 'sine', 1200, now, now + 0.05, 0.1);
        break;
      case 'win':
        [440, 554.37, 659.25].forEach((f, i) => {
          const startTime = now + (i * 0.05);
          this.createOscillator(ctx, 'triangle', f, startTime, startTime + 0.8, 0.2);
        });
        break;
      case 'draw':
        this.createOscillator(ctx, 'triangle', 220, now, now + 0.3, 0.2);
        const secondNoteTime = now + 0.35;
        this.createOscillator(ctx, 'triangle', 196, secondNoteTime, secondNoteTime + 0.5, 0.2);
        break;
      case 'start':
        for (let i = 0; i < 4; i++) {
          this.createOscillator(ctx, 'sawtooth', 200 + (i * 100), now + (i * 0.05), now + (i * 0.05) + 0.15, 0.05);
        }
        break;
      case 'transition':
        this.createOscillator(ctx, 'sine', 400, now, now + 0.3, 0.05);
        break;
    }
  }
}

export const audioService = new AudioService();
