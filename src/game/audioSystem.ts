import type { RegionId } from './openWorld';

export type AudioTrackId = 'village-day' | 'forest-day' | 'coast-day' | 'mine-day' | 'night';
export type AudioSettings = { muted: boolean; volume: number };

export const AUDIO_STORAGE_KEY = 'portfolio-audio-v1';
export const AUDIO_CROSSFADE_MS = 1000;

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
  private settings: AudioSettings;

  constructor(settings: AudioSettings) {
    this.settings = settings;
  }

  unlock() {
    this.unlocked = true;
  }

  updateSettings(settings: AudioSettings) {
    this.settings = settings;
    if (this.active) this.active.volume = settings.muted ? 0 : settings.volume;
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
      next.volume = this.settings.muted ? 0 : this.settings.volume * progress;
      if (previous) previous.volume = this.settings.muted ? 0 : this.settings.volume * (1 - progress);
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
  }
}

export const AUDIO_SYSTEM_MARKER = 'region-crossfade';
