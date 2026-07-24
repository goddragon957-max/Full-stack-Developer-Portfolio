import Phaser from 'phaser';
import {
  PhaserBridge,
  collectSnapshotAssets,
  getPhaserTextureKey,
  type PhaserDirection,
  type PhaserHintSnapshot,
  type PhaserSpriteSnapshot,
  type PhaserWorldSnapshot,
} from '../bridge';
import { getFitCameraZoom, updateDeadZoneCamera } from '../cameraController';

// Tile cadence (ms per tile). Must match MOVE_INTERVAL_MS in MossbellFarmGame.tsx
// so the React move loop and the Phaser sprite interpolation stay in lockstep.
// 140ms ≈ 7.1 tiles/s — a cozy farm-game walk instead of the previous 10.9/s dash.
const MOVE_INTERVAL_MS = 140;
const TILE_STEP_PX = 16;
// One tile per move interval: walking reads as one steady speed instead of the
// fast-then-slow rubber band an exponential ease produces on every hop.
const BASE_SPRITE_SPEED_PX_PER_MS = TILE_STEP_PX / MOVE_INTERVAL_MS;
const MAX_INTERPOLATED_DISTANCE = 40;
// Walk-cycle animation: advance one frame per STRIDE_PX travelled, looping
// 0-1-2-1 so the passing pose is hit on both the out and return strides.
const WALK_STRIDE_PX = 5;
const WALK_CYCLE = [0, 1, 2, 1];
const DIRECTION_BY_CODE: Record<string, PhaserDirection | undefined> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

export class WorldScene extends Phaser.Scene {
  private snapshot: PhaserWorldSnapshot | null = null;
  private unsubscribeSnapshot: (() => void) | null = null;
  private readonly pendingTextures = new Map<string, Promise<void>>();
  private readonly spriteObjects = new Map<string, Phaser.GameObjects.Image>();
  private readonly spriteTargets = new Map<string, { x: number; y: number; smooth: boolean; frames?: string[] }>();
  private readonly strideDistance = new Map<string, number>();
  private readonly hintObjects = new Map<string, Phaser.GameObjects.GameObject[]>();
  private readonly hintSignatures = new Map<string, string>();
  private mapImage: Phaser.GameObjects.Image | null = null;
  private pressedDirections: PhaserDirection[] = [];
  private lastMoveAt = 0;
  private renderSequence = 0;
  private isDisposed = false;
  private cameraInitialized = false;
  private cameraMoveCount = 0;
  private cameraScrollX = 0;
  private cameraScrollY = 0;
  private cameraZoom = 0;
  private activeRegion: PhaserWorldSnapshot['region'] | null = null;
  private regionChangeCount = 0;
  private transitionSignature = '';

  constructor(private readonly bridge: PhaserBridge) {
    super('WorldScene');
  }

  create() {
    this.cameras.main.roundPixels = true;
    this.snapshot = this.bridge.getSnapshot();
    this.unsubscribeSnapshot = this.bridge.subscribeSnapshot((snapshot) => {
      void this.applySnapshot(snapshot);
    });

    this.input.keyboard?.addCapture([
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.E,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX,
    ]);
    this.input.keyboard?.on('keydown', this.handleKeyDown, this);
    this.input.keyboard?.on('keyup', this.handleKeyUp, this);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleScaleResize, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.clearMovement, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.disposeScene, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.disposeScene, this);

    if (this.snapshot) void this.applySnapshot(this.snapshot);
    const renderer = this.game.renderer.type === Phaser.WEBGL ? 'webgl' : 'canvas';
    this.bridge.emitRuntimeState({ status: 'ready', renderer });
  }

  update(time: number, delta: number) {
    this.updateSpriteMotion(delta);
    if (!this.snapshot?.inputEnabled) {
      if (this.pressedDirections.length > 0) this.clearMovement();
      return;
    }
    const direction = this.pressedDirections[this.pressedDirections.length - 1];
    if (direction && time - this.lastMoveAt >= MOVE_INTERVAL_MS) {
      this.bridge.emitInputIntent({ type: 'move', direction });
      this.lastMoveAt = time;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.snapshot?.inputEnabled) return;
    const direction = DIRECTION_BY_CODE[event.code];
    if (direction) {
      if (event.repeat) return;
      this.pressedDirections = this.pressedDirections.filter((item) => item !== direction);
      this.pressedDirections.push(direction);
      this.bridge.emitInputIntent({ type: 'move', direction });
      this.lastMoveAt = this.time.now;
      return;
    }

    if (event.repeat) return;
    if (event.code === 'KeyE' || event.code === 'Space') {
      this.bridge.emitInputIntent({ type: 'interact' });
      return;
    }

    const tool = {
      Digit1: 'hoe',
      Digit2: 'seeds',
      Digit3: 'watering-can',
      Digit4: 'fishing-rod',
      Digit5: 'pickaxe',
      Digit6: 'fence-hammer',
    }[event.code] as 'hoe' | 'seeds' | 'watering-can' | 'fishing-rod' | 'pickaxe' | 'fence-hammer' | undefined;
    if (tool) this.bridge.emitInputIntent({ type: 'select-tool', tool });
  }

  private handleKeyUp(event: KeyboardEvent) {
    const direction = DIRECTION_BY_CODE[event.code];
    if (!direction) return;
    this.pressedDirections = this.pressedDirections.filter((item) => item !== direction);
    if (this.pressedDirections.length === 0) this.bridge.emitInputIntent({ type: 'stop-moving' });
  }

  private clearMovement() {
    if (this.pressedDirections.length > 0) this.bridge.emitInputIntent({ type: 'stop-moving' });
    this.pressedDirections = [];
    this.lastMoveAt = 0;
  }

  private async applySnapshot(snapshot: PhaserWorldSnapshot) {
    const sequence = ++this.renderSequence;
    try {
      await Promise.all(collectSnapshotAssets(snapshot).map((asset) => this.ensureTexture(asset)));
      if (this.isDisposed || sequence !== this.renderSequence) return;
      if (this.activeRegion !== snapshot.region) this.resetRegionState(snapshot.region);
      this.snapshot = snapshot;
      this.reconcileRegionTransition(snapshot);
      this.renderWorld(snapshot);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Phaser texture error.';
      this.bridge.emitRuntimeState({ status: 'error', message });
    }
  }

  private resetRegionState(nextRegion: PhaserWorldSnapshot['region']) {
    if (this.activeRegion !== null) this.regionChangeCount += 1;
    this.clearMovement();
    this.spriteObjects.forEach((image) => image.destroy());
    this.spriteObjects.clear();
    this.spriteTargets.clear();
    this.strideDistance.clear();
    this.hintObjects.forEach((_objects, id) => this.destroyHint(id));
    this.cameraInitialized = false;
    this.cameraScrollX = 0;
    this.cameraScrollY = 0;
    this.activeRegion = nextRegion;

    const canvas = this.game.canvas;
    canvas.dataset.phaserActiveRegion = nextRegion;
    canvas.dataset.phaserRegionChangeCount = String(this.regionChangeCount);
    canvas.dataset.phaserScene = 'WorldScene';
  }

  private reconcileRegionTransition(snapshot: PhaserWorldSnapshot) {
    const transition = snapshot.transition;
    const signature = transition ? `${transition.id}:${transition.phase}` : 'idle';
    if (signature === this.transitionSignature) return;
    this.transitionSignature = signature;

    const camera = this.cameras.main;
    const canvas = this.game.canvas;
    canvas.dataset.phaserTransition = transition ? `${transition.from}->${transition.to}` : 'idle';
    canvas.dataset.phaserTransitionPhase = transition?.phase ?? 'idle';
    if (!transition) return;

    const durationMs = transition.durationMs ?? 360;
    camera.fadeEffect.reset();
    if (transition.phase === 'out') camera.fadeOut(durationMs, 18, 13, 9);
    else camera.fadeIn(durationMs, 18, 13, 9);
  }

  private ensureTexture(asset: string) {
    const key = getPhaserTextureKey(asset);
    if (this.textures.exists(key)) {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      return Promise.resolve();
    }

    const existing = this.pendingTextures.get(key);
    if (existing) return existing;

    const pending = new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (!this.textures.exists(key)) {
          const texture = this.textures.addImage(key, image);
          texture?.setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        resolve();
      };
      image.onerror = () => reject(new Error(`Could not load pixel asset: ${asset}`));
      image.src = asset;
    }).finally(() => this.pendingTextures.delete(key));

    this.pendingTextures.set(key, pending);
    return pending;
  }

  private renderWorld(snapshot: PhaserWorldSnapshot) {
    this.syncCameraViewport(snapshot);

    this.reconcileMapLayer(snapshot);
    this.reconcileSprites(this.collectSprites(snapshot));
    this.reconcileHints(snapshot.hints);
  }

  private handleScaleResize() {
    if (this.snapshot) this.syncCameraViewport(this.snapshot);
  }

  private syncCameraViewport(snapshot: PhaserWorldSnapshot) {
    const canvasWidth = Math.max(1, this.game.canvas.width);
    const canvasHeight = Math.max(1, this.game.canvas.height);
    const targetX = snapshot.player.x + snapshot.player.width / 2;
    const targetY = snapshot.player.y + snapshot.player.height - 8;
    const camera = this.cameras.main;
    const previousScrollX = this.cameraScrollX;
    const previousScrollY = this.cameraScrollY;
    const coverZoom = getFitCameraZoom(canvasWidth, canvasHeight, snapshot.worldWidth, snapshot.worldHeight);
    const nextCamera = updateDeadZoneCamera({
      canvasWidth,
      canvasHeight,
      worldWidth: snapshot.worldWidth,
      worldHeight: snapshot.worldHeight,
      targetX,
      targetY,
      previousScrollX,
      previousScrollY,
      initialized: this.cameraInitialized,
    });
    camera.setViewport(0, 0, canvasWidth, canvasHeight);
    camera.setOrigin(0.5, 0.5);
    camera.setBounds(0, 0, snapshot.worldWidth, snapshot.worldHeight);
    camera.setZoom(coverZoom);
    camera.setScroll(nextCamera.scrollX, nextCamera.scrollY);
    camera.roundPixels = true;
    const cameraViewChanged = !this.cameraInitialized
      || Math.abs(this.cameraZoom - nextCamera.zoom) > 0.0001
      || Math.abs(this.cameraScrollX - nextCamera.scrollX) > 0.0001
      || Math.abs(this.cameraScrollY - nextCamera.scrollY) > 0.0001;
    this.cameraZoom = nextCamera.zoom;
    this.cameraScrollX = nextCamera.scrollX;
    this.cameraScrollY = nextCamera.scrollY;
    this.cameraInitialized = true;
    if (nextCamera.moved) this.cameraMoveCount += 1;
    if (cameraViewChanged) {
      this.bridge.emitCameraState({ zoom: nextCamera.zoom, scrollX: nextCamera.scrollX, scrollY: nextCamera.scrollY });
    }

    const canvas = this.game.canvas;
    canvas.dataset.phaserCameraWidth = String(camera.width);
    canvas.dataset.phaserCameraHeight = String(camera.height);
    canvas.dataset.phaserCameraZoom = String(camera.zoom);
    canvas.dataset.phaserCameraScrollX = String(camera.scrollX);
    canvas.dataset.phaserCameraScrollY = String(camera.scrollY);
    canvas.dataset.phaserCameraPreviousScrollX = String(previousScrollX);
    canvas.dataset.phaserCameraPreviousScrollY = String(previousScrollY);
    canvas.dataset.phaserCameraMode = 'fit-center';
    canvas.dataset.phaserCameraTargetX = String(targetX);
    canvas.dataset.phaserCameraTargetY = String(targetY);
    canvas.dataset.phaserCameraDeadZoneWidth = String(nextCamera.deadZoneWidth);
    canvas.dataset.phaserCameraDeadZoneHeight = String(nextCamera.deadZoneHeight);
    canvas.dataset.phaserCameraMoved = nextCamera.moved ? 'true' : 'false';
    canvas.dataset.phaserCameraMoveCount = String(this.cameraMoveCount);
    canvas.dataset.phaserCameraVisibleWidth = String(nextCamera.visibleWidth);
    canvas.dataset.phaserCameraVisibleHeight = String(nextCamera.visibleHeight);
  }

  private reconcileMapLayer(snapshot: PhaserWorldSnapshot) {
    const textureKey = getPhaserTextureKey(snapshot.mapAsset);
    if (!this.mapImage) {
      this.mapImage = this.add.image(0, 0, textureKey)
        .setOrigin(0, 0)
        .setDepth(0)
        .setName('outdoor-world-map');
    } else if (this.mapImage.texture.key !== textureKey) {
      this.mapImage.setTexture(textureKey);
    }
    this.mapImage
      .setPosition(0, 0)
      .setDisplaySize(snapshot.worldWidth, snapshot.worldHeight);
    this.mapImage.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const canvas = this.game.canvas;
    canvas.dataset.phaserMapDisplayWidth = String(this.mapImage.displayWidth);
    canvas.dataset.phaserMapDisplayHeight = String(this.mapImage.displayHeight);
    canvas.dataset.phaserWorldWidth = String(snapshot.worldWidth);
    canvas.dataset.phaserWorldHeight = String(snapshot.worldHeight);
  }

  private collectSprites(snapshot: PhaserWorldSnapshot) {
    const sprites = [...snapshot.effects, ...snapshot.fences, ...snapshot.entities];
    snapshot.plots.forEach((plot) => {
      sprites.push(plot.ground);
      if (plot.crop) sprites.push(plot.crop);
    });
    snapshot.animals.forEach((animal) => {
      sprites.push(animal.body);
      if (animal.product) sprites.push(animal.product);
      if (animal.mood) sprites.push(animal.mood);
    });
    sprites.push(snapshot.player);
    return sprites;
  }

  private reconcileSprites(sprites: PhaserSpriteSnapshot[]) {
    const liveIds = new Set<string>();
    sprites.forEach((sprite) => {
      const textureKey = getPhaserTextureKey(sprite.asset);
      if (!this.textures.exists(textureKey)) return;
      liveIds.add(sprite.id);

      let image = this.spriteObjects.get(sprite.id);
      if (!image) {
        image = this.add.image(sprite.x, sprite.y, textureKey).setName(sprite.id);
        this.spriteObjects.set(sprite.id, image);
      }

      const dimensionsChanged = Math.abs(image.displayWidth - sprite.width) > 0.01
        || Math.abs(image.displayHeight - sprite.height) > 0.01;
      if (image.texture.key !== textureKey) image.setTexture(textureKey);
      image
        .setOrigin(sprite.originX ?? 0, sprite.originY ?? 0)
        .setDisplaySize(sprite.width, sprite.height)
        .setDepth(sprite.depth)
        .setAlpha(sprite.alpha ?? 1)
        .setVisible(true);
      image.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

      const smooth = this.shouldSmoothSprite(sprite.id);
      const distance = Phaser.Math.Distance.Between(image.x, image.y, sprite.x, sprite.y);
      if (!smooth || dimensionsChanged || distance > MAX_INTERPOLATED_DISTANCE) {
        image.setPosition(sprite.x, sprite.y);
      }
      this.spriteTargets.set(sprite.id, { x: sprite.x, y: sprite.y, smooth, frames: sprite.frames });
    });

    this.spriteObjects.forEach((image, id) => {
      if (liveIds.has(id)) return;
      image.destroy();
      this.spriteObjects.delete(id);
      this.spriteTargets.delete(id);
      this.strideDistance.delete(id);
    });
  }

  private shouldSmoothSprite(id: string) {
    return id === 'player' || id.startsWith('entity-') || id.startsWith('animal-');
  }

  private updateSpriteMotion(delta: number) {
    const camera = this.cameras.main;
    this.spriteTargets.forEach((target, id) => {
      if (!target.smooth) return;
      const image = this.spriteObjects.get(id);
      if (!image) return;
      if (!Phaser.Geom.Intersects.RectangleToRectangle(camera.worldView, image.getBounds())) return;
      const dx = target.x - image.x;
      const dy = target.y - image.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.01) {
        this.strideDistance.set(id, 0);
        return;
      }
      // Constant walking speed; scale up smoothly when input jitter queues more
      // than one tile of pending distance so the sprite catches up without snapping.
      const speed = BASE_SPRITE_SPEED_PX_PER_MS * Math.max(1, distance / TILE_STEP_PX);
      const step = Math.min(distance, speed * Math.max(0, delta));
      image.setPosition(image.x + (dx / distance) * step, image.y + (dy / distance) * step);
      this.advanceWalkFrame(id, image, target.frames, step);
    });
  }

  private advanceWalkFrame(id: string, image: Phaser.GameObjects.Image, frames: string[] | undefined, moved: number) {
    if (!frames || frames.length < 2) return;
    const travelled = (this.strideDistance.get(id) ?? 0) + moved;
    this.strideDistance.set(id, travelled);
    const cycleIndex = WALK_CYCLE[Math.floor(travelled / WALK_STRIDE_PX) % WALK_CYCLE.length];
    const frameKey = getPhaserTextureKey(frames[cycleIndex % frames.length]);
    if (image.texture.key !== frameKey && this.textures.exists(frameKey)) {
      image.setTexture(frameKey);
      image.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  }

  private reconcileHints(hints: PhaserHintSnapshot[]) {
    const liveIds = new Set(hints.map((hint) => hint.id));
    hints.forEach((hint) => {
      const signature = [hint.x, hint.y, hint.width, hint.height, hint.depth, hint.tone, hint.label ?? ''].join(':');
      if (this.hintSignatures.get(hint.id) === signature) return;
      this.destroyHint(hint.id);
      this.hintObjects.set(hint.id, this.createHint(hint));
      this.hintSignatures.set(hint.id, signature);
    });
    this.hintObjects.forEach((_objects, id) => {
      if (!liveIds.has(id)) this.destroyHint(id);
    });
  }

  private createHint(hint: PhaserHintSnapshot) {
    const colors = {
      nearby: { fill: 0xfff19c, line: 0x6f441f },
      place: { fill: 0x8fd26e, line: 0xffe477 },
      remove: { fill: 0xb33d2b, line: 0xff8f72 },
      ready: { fill: 0x9fe089, line: 0xfff19c },
    }[hint.tone];
    const graphics = this.add.graphics().setDepth(hint.depth).setName(hint.id);
    const fillAlpha = hint.tone === 'nearby' ? 0 : 0.04;
    const lineAlpha = hint.tone === 'nearby' ? 0.28 : 0.62;
    graphics.fillStyle(colors.fill, fillAlpha);
    graphics.lineStyle(3, colors.line, lineAlpha);
    graphics.fillRect(hint.x, hint.y, hint.width, hint.height);
    graphics.strokeRect(hint.x, hint.y, hint.width, hint.height);
    const objects: Phaser.GameObjects.GameObject[] = [graphics];
    if (hint.label) {
      const label = this.add.text(hint.x + hint.width / 2, hint.y - 10, hint.label, {
        color: '#3a2617',
        backgroundColor: '#fff19c',
        fontFamily: 'monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        padding: { x: 5, y: 4 },
      }).setOrigin(0.5, 1).setDepth(hint.depth + 1).setName(`${hint.id}-label`);
      objects.push(label);
    }
    return objects;
  }

  private destroyHint(id: string) {
    this.hintObjects.get(id)?.forEach((object) => object.destroy());
    this.hintObjects.delete(id);
    this.hintSignatures.delete(id);
  }

  private disposeScene() {
    if (this.isDisposed) return;
    this.isDisposed = true;
    this.unsubscribeSnapshot?.();
    this.unsubscribeSnapshot = null;
    this.clearMovement();
    this.input.keyboard?.off('keydown', this.handleKeyDown, this);
    this.input.keyboard?.off('keyup', this.handleKeyUp, this);
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleScaleResize, this);
    this.game.events.off(Phaser.Core.Events.BLUR, this.clearMovement, this);
    this.spriteObjects.clear();
    this.spriteTargets.clear();
    this.strideDistance.clear();
    this.hintObjects.clear();
    this.hintSignatures.clear();
    this.mapImage = null;
    this.cameraInitialized = false;
    this.cameraMoveCount = 0;
    this.cameraScrollX = 0;
    this.cameraScrollY = 0;
    this.cameraZoom = 0;
    this.activeRegion = null;
    this.regionChangeCount = 0;
    this.transitionSignature = '';
  }
}
