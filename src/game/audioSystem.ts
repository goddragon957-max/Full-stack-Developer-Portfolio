import type { RegionId } from './openWorld';
import type { WeatherAudioMix } from './weatherSystem';

export type AudioTrackId = 'village-day' | 'forest-day' | 'coast-day' | 'mine-day' | 'night';
export type AudioSettings = { muted: boolean; volume: number };

export const AUDIO_STORAGE_KEY = 'portfolio-audio-v1';
export const AUDIO_CROSSFADE_MS = 1000;
export const AUDIO_INTERIOR_GAIN = 0.55;

const TRACK_BY_REGION: Record<RegionId, AudioTrackId> = {
  'farm-village': 'village-day',
  'whisper-forest': 'forest-day',
  'river-coast': 'coast-day',
  'mine-foothill': 'mine-day',
};

export const AUDIO_TRACKS: Record<AudioTrackId, { path: string; available: boolean }> = {
  'village-day': { path: '/assets/audio/village-day.mp3', available: true },
  'forest-day': { path: '/assets/audio/forest-day.mp3', available: true },
  'coast-day': { path: '/assets/audio/coast-day.mp3', available: true },
  'mine-day': { path: '/assets/audio/mine-day.mp3', available: true },
  night: { path: '/assets/audio/night.mp3', available: true },
};

export function loadAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') return { muted: false, volume: 0.42 };
  try {
    const value = JSON.parse(window.localStorage.getItem(AUDIO_STORAGE_KEY) ?? '{}') as Partial<AudioSettings>;
    return {
      muted: Boolean(value.muted),
      volume: Math.max(0, Math.min(1, Number.isFinite(value.volume) ? Number(value.volume) : 0.42)),
    };
  } catch {
    return { muted: false, volume: 0.42 };
  }
}

export function persistAudioSettings(settings: AudioSettings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Audio preferences are optional and never block play.
  }
}

export function getAudioTrack(region: RegionId, isNight: boolean): AudioTrackId {
  return isNight ? 'night' : TRACK_BY_REGION[region];
}

export class RegionAudioController {
  private active: HTMLAudioElement | null = null;
  private fadeTimer: number | null = null;
  private unlocked = false;
  private interior = false;
  private settings: AudioSettings;
  private weatherMix: WeatherAudioMix = { musicMultiplier: 1, ambience: 'none', ambienceVolume: 0 };
  private ambienceContext: AudioContext | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private ambienceGain: GainNode | null = null;

  constructor(settings: AudioSettings) {
    this.settings = settings;
  }

  unlock() {
    this.unlocked = true;
    this.refreshAmbience();
  }

  updateSettings(settings: AudioSettings) {
    this.settings = settings;
    if (this.active) this.active.volume = this.getOutputVolume();
    this.refreshAmbience();
  }

  setInterior(interior: boolean) {
    this.interior = interior;
    if (this.active) this.active.volume = this.getOutputVolume();
    this.refreshAmbience();
  }

  setWeatherMix(mix: WeatherAudioMix) {
    this.weatherMix = mix;
    if (this.active) this.active.volume = this.getOutputVolume();
    this.refreshAmbience();
  }

  private getOutputVolume() {
    if (this.settings.muted) return 0;
    return this.settings.volume * this.weatherMix.musicMultiplier * (this.interior ? AUDIO_INTERIOR_GAIN : 1);
  }

  private stopAmbience() {
    this.ambienceSource?.stop();
    this.ambienceSource?.disconnect();
    this.ambienceGain?.disconnect();
    this.ambienceSource = null;
    this.ambienceGain = null;
  }

  private refreshAmbience() {
    this.stopAmbience();
    if (!this.unlocked || this.settings.muted || this.interior || this.weatherMix.ambience === 'none' || typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = this.ambienceContext ?? new AudioContextClass();
    this.ambienceContext = context;
    const frames = Math.max(1, Math.round(context.sampleRate * 2));
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < frames; index += 1) data[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = this.weatherMix.ambience === 'rain' ? 'highpass' : 'lowpass';
    filter.frequency.value = this.weatherMix.ambience === 'rain' ? 1_250 : this.weatherMix.ambience === 'wind' ? 520 : 280;
    const gain = context.createGain();
    gain.gain.value = this.settings.volume * this.weatherMix.ambienceVolume;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    this.ambienceSource = source;
    this.ambienceGain = gain;
  }

  transition(trackId: AudioTrackId) {
    const track = AUDIO_TRACKS[trackId];
    if (!this.unlocked || !track.available || this.settings.muted) {
      if (this.active) this.active.volume = 0;
      return false;
    }
    if (this.active?.dataset.trackId === trackId) return true;
    const next = new Audio(track.path);
    next.loop = true;
    next.preload = 'auto';
    next.dataset.trackId = trackId;
    next.volume = 0;
    void next.play().catch(() => undefined);
    const previous = this.active;
    this.active = next;
    const started = performance.now();
    if (this.fadeTimer !== null) window.clearInterval(this.fadeTimer);
    this.fadeTimer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / AUDIO_CROSSFADE_MS);
      const outputVolume = this.getOutputVolume();
      next.volume = outputVolume * progress;
      if (previous) previous.volume = outputVolume * (1 - progress);
      if (progress === 1) {
        if (previous) {
          previous.pause();
          previous.removeAttribute('src');
        }
        if (this.fadeTimer !== null) window.clearInterval(this.fadeTimer);
        this.fadeTimer = null;
      }
    }, 50);
    return true;
  }

  dispose() {
    if (this.fadeTimer !== null) window.clearInterval(this.fadeTimer);
    this.active?.pause();
    this.active = null;
    this.stopAmbience();
    void this.ambienceContext?.close();
    this.ambienceContext = null;
  }
}

export const AUDIO_SYSTEM_MARKER = 'region-crossfade';
