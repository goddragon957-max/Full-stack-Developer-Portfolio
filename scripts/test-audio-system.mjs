import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function closeTo(actual, expected, message) {
  assert(Math.abs(actual - expected) < 0.001, `${message}: expected ${expected}, got ${actual}`);
}

const source = readFileSync('src/game/audioSystem.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'audioSystem.ts',
}).outputText;

let now = 0;
let nextTimerId = 1;
const timers = new Map();
const storage = new Map();

class FakeAudio {
  static instances = [];

  constructor(src) {
    this.src = src;
    this.dataset = {};
    this.loop = false;
    this.preload = '';
    this.volume = 1;
    this.played = false;
    this.paused = false;
    this.sourceCleared = false;
    FakeAudio.instances.push(this);
  }

  play() {
    this.played = true;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  removeAttribute(name) {
    if (name === 'src') this.sourceCleared = true;
  }
}

globalThis.Audio = FakeAudio;
globalThis.window = {
  localStorage: {
    getItem(key) {
      return storage.get(key) ?? null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  },
  setInterval(callback) {
    const id = nextTimerId;
    nextTimerId += 1;
    timers.set(id, callback);
    return id;
  },
  clearInterval(id) {
    timers.delete(id);
  },
};
Object.defineProperty(globalThis, 'performance', {
  configurable: true,
  value: { now: () => now },
});

function advance(milliseconds) {
  now += milliseconds;
  for (const callback of [...timers.values()]) callback();
}

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const audio = await import(moduleUrl);

assert(audio.AUDIO_CROSSFADE_MS === 1000, 'Crossfade must remain 1000ms');
assert(audio.AUDIO_INTERIOR_GAIN > 0 && audio.AUDIO_INTERIOR_GAIN < 1, 'Interior music must keep playing at a reduced gain');
assert(Object.values(audio.AUDIO_TRACKS).every((track) => track.available), 'All five tracks must be available');
assert(audio.getAudioTrack('farm-village', false) === 'village-day', 'Village track mapping failed');
assert(audio.getAudioTrack('whisper-forest', false) === 'forest-day', 'Forest track mapping failed');
assert(audio.getAudioTrack('river-coast', false) === 'coast-day', 'Coast track mapping failed');
assert(audio.getAudioTrack('mine-foothill', false) === 'mine-day', 'Mine track mapping failed');
assert(audio.getAudioTrack('farm-village', true) === 'night', 'Night override failed');

const controller = new audio.RegionAudioController({ muted: false, volume: 0.42 });
assert(controller.transition('village-day') === false, 'Audio must stay locked before user input');
assert(FakeAudio.instances.length === 0, 'Locked audio must not create a media element');

controller.unlock();
assert(controller.transition('village-day') === true, 'Unlocked village track must start');
const village = FakeAudio.instances[0];
assert(village.src === '/assets/audio/village-day.mp3' && village.played, 'Village MP3 must play');
closeTo(village.volume, 0, 'Village track must fade in from silence');
advance(500);
closeTo(village.volume, 0.21, 'Village track midpoint volume');
advance(500);
closeTo(village.volume, 0.42, 'Village track final volume');
assert(timers.size === 0, 'Completed fade timer must be cleared');

assert(controller.transition('forest-day') === true, 'Forest transition must start');
const forest = FakeAudio.instances[1];
advance(500);
closeTo(village.volume, 0.21, 'Previous track midpoint volume');
closeTo(forest.volume, 0.21, 'Next track midpoint volume');
advance(500);
assert(village.paused && village.sourceCleared, 'Previous track must be released after crossfade');
closeTo(forest.volume, 0.42, 'Forest track final volume');

controller.setInterior(true);
closeTo(forest.volume, 0.42 * audio.AUDIO_INTERIOR_GAIN, 'The current regional track must continue quietly indoors');

controller.updateSettings({ muted: false, volume: 0.25 });
closeTo(forest.volume, 0.25 * audio.AUDIO_INTERIOR_GAIN, 'Volume setting must respect interior attenuation');
controller.setInterior(false);
closeTo(forest.volume, 0.25, 'Leaving a building must restore outdoor gain');
controller.setWeatherMix({ musicMultiplier: 0.72, ambience: 'rain', ambienceVolume: 0.3 });
closeTo(forest.volume, 0.25 * 0.72, 'Rain must attenuate the current regional track');
controller.setInterior(true);
closeTo(forest.volume, 0.25 * 0.72 * audio.AUDIO_INTERIOR_GAIN, 'Weather and interior gain must compose');
controller.setInterior(false);
controller.setWeatherMix({ musicMultiplier: 1, ambience: 'none', ambienceVolume: 0 });
closeTo(forest.volume, 0.25, 'Clearing weather must restore the outdoor mix');
audio.persistAudioSettings({ muted: false, volume: 0.25 });
const restored = audio.loadAudioSettings();
assert(restored.muted === false && restored.volume === 0.25, 'Audio settings must persist');

controller.updateSettings({ muted: true, volume: 0.25 });
assert(controller.transition('coast-day') === false, 'Muted transition must stay silent');
assert(FakeAudio.instances.length === 2, 'Muted transition must not create another media element');
closeTo(forest.volume, 0, 'Mute must silence the active track');

controller.updateSettings({ muted: false, volume: 0.25 });
assert(controller.transition('coast-day') === true, 'Unmuted coast transition must start');
advance(1000);
const coast = FakeAudio.instances[2];
closeTo(coast.volume, 0.25, 'Coast track final volume');
controller.dispose();
assert(coast.paused && timers.size === 0, 'Dispose must stop playback and clear timers');

console.log('audio system test passed: unlock, five-track mapping, 1000ms crossfade, mute, weather mix, volume, persistence');
