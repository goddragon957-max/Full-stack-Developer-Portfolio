import type { Season } from '../seasonSystem';
import type { TimeMode, DayPhase } from '../villagePulse';
import type { Weather } from '../weatherSystem';
import type { RegionId } from '../openWorld';

export type PhaserDirection = 'up' | 'down' | 'left' | 'right';

export type PhaserToolId = 'hoe' | 'seeds' | 'watering-can' | 'fishing-rod' | 'pickaxe' | 'fence-hammer';

export type PhaserInputIntent =
  | { type: 'move'; direction: PhaserDirection }
  | { type: 'stop-moving' }
  | { type: 'interact' }
  | { type: 'select-tool'; tool: PhaserToolId };

export type PhaserCameraViewState = {
  zoom: number;
  scrollX: number;
  scrollY: number;
};

export type PhaserEnvironmentSnapshot = {
  time: {
    mode: TimeMode;
    phase: DayPhase;
    clock: string;
  };
  season: {
    year: number;
    id: Season;
    day: number;
  };
  weather: Weather;
};

export type PhaserSpriteSnapshot = {
  id: string;
  asset: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  originX?: number;
  originY?: number;
  alpha?: number;
};

export type PhaserPlotSnapshot = {
  id: string;
  ground: PhaserSpriteSnapshot;
  crop?: PhaserSpriteSnapshot;
};

export type PhaserAnimalSnapshot = {
  id: string;
  body: PhaserSpriteSnapshot;
  product?: PhaserSpriteSnapshot;
  mood?: PhaserSpriteSnapshot;
};

export type PhaserHintSnapshot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  tone: 'nearby' | 'place' | 'remove' | 'ready';
  label?: string;
};

export type PhaserRegionTransitionSnapshot = {
  id: number;
  from: RegionId;
  to: RegionId;
  phase: 'out' | 'in';
  durationMs?: number;
};

export type PhaserWorldSnapshot = {
  revision: string;
  region: RegionId;
  worldWidth: number;
  worldHeight: number;
  mapAsset: string;
  environment: PhaserEnvironmentSnapshot;
  inputEnabled: boolean;
  transition: PhaserRegionTransitionSnapshot | null;
  entities: PhaserSpriteSnapshot[];
  fences: PhaserSpriteSnapshot[];
  plots: PhaserPlotSnapshot[];
  animals: PhaserAnimalSnapshot[];
  effects: PhaserSpriteSnapshot[];
  player: PhaserSpriteSnapshot;
  hints: PhaserHintSnapshot[];
};

export type PhaserRuntimeState =
  | { status: 'ready'; renderer: 'webgl' | 'canvas' }
  | { status: 'error'; message: string };

type SnapshotListener = (snapshot: PhaserWorldSnapshot) => void;
type InputListener = (intent: PhaserInputIntent) => void;
type RuntimeListener = (state: PhaserRuntimeState) => void;
type CameraListener = (state: PhaserCameraViewState) => void;

export class PhaserBridge {
  private snapshot: PhaserWorldSnapshot | null = null;
  private readonly snapshotListeners = new Set<SnapshotListener>();
  private readonly inputListeners = new Set<InputListener>();
  private readonly runtimeListeners = new Set<RuntimeListener>();
  private readonly cameraListeners = new Set<CameraListener>();

  getSnapshot() {
    return this.snapshot;
  }

  publishSnapshot(snapshot: PhaserWorldSnapshot) {
    this.snapshot = snapshot;
    this.snapshotListeners.forEach((listener) => listener(snapshot));
  }

  subscribeSnapshot(listener: SnapshotListener) {
    this.snapshotListeners.add(listener);
    return () => this.snapshotListeners.delete(listener);
  }

  emitInputIntent(intent: PhaserInputIntent) {
    this.inputListeners.forEach((listener) => listener(intent));
  }

  subscribeInputIntent(listener: InputListener) {
    this.inputListeners.add(listener);
    return () => this.inputListeners.delete(listener);
  }

  emitRuntimeState(state: PhaserRuntimeState) {
    this.runtimeListeners.forEach((listener) => listener(state));
  }

  subscribeRuntimeState(listener: RuntimeListener) {
    this.runtimeListeners.add(listener);
    return () => this.runtimeListeners.delete(listener);
  }

  emitCameraState(state: PhaserCameraViewState) {
    this.cameraListeners.forEach((listener) => listener(state));
  }

  subscribeCameraState(listener: CameraListener) {
    this.cameraListeners.add(listener);
    return () => this.cameraListeners.delete(listener);
  }

  dispose() {
    this.snapshot = null;
    this.snapshotListeners.clear();
    this.inputListeners.clear();
    this.runtimeListeners.clear();
    this.cameraListeners.clear();
  }
}

export function collectSnapshotAssets(snapshot: PhaserWorldSnapshot) {
  const assets = new Set<string>([snapshot.mapAsset, snapshot.player.asset]);
  const addSprite = (sprite?: PhaserSpriteSnapshot) => {
    if (sprite?.asset) assets.add(sprite.asset);
  };

  snapshot.entities.forEach(addSprite);
  snapshot.fences.forEach(addSprite);
  snapshot.effects.forEach(addSprite);
  snapshot.plots.forEach((plot) => {
    addSprite(plot.ground);
    addSprite(plot.crop);
  });
  snapshot.animals.forEach((animal) => {
    addSprite(animal.body);
    addSprite(animal.product);
    addSprite(animal.mood);
  });

  return [...assets];
}

export function getPhaserTextureKey(asset: string) {
  return `mossbell:${asset}`;
}
