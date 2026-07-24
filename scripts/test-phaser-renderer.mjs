import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readRequired(path) {
  assert(existsSync(path), `Missing required Phaser migration file: ${path}`);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const scripts = packageJson.scripts ?? {};
const dependencies = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
const component = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const config = readRequired('src/game/phaser/config.ts');
const bridge = readRequired('src/game/phaser/bridge.ts');
const bootScene = readRequired('src/game/phaser/scenes/BootScene.ts');
const villageScene = readRequired('src/game/phaser/scenes/WorldScene.ts');
const cameraController = readRequired('src/game/phaser/cameraController.ts');
const host = readRequired('src/components/game/PhaserGameHost.tsx');
const { getFitCameraZoom, updateDeadZoneCamera } = await import('../src/game/phaser/cameraController.ts');

assert(typeof dependencies.phaser === 'string', 'Phaser must be the only new rendering dependency');
for (const dependency of ['three', '@types/three', '@react-three/fiber', '@babylonjs/core', 'babylonjs', 'pixi.js', '@pixi/core']) {
  assert(!(dependency in dependencies), `Disallowed renderer dependency remains installed: ${dependency}`);
}

assert(config.includes('Phaser.AUTO'), 'Phaser config must use AUTO so WebGL is preferred with Canvas fallback');
assert(/pixelArt:\s*true/.test(config), 'Phaser config must enable pixelArt');
assert(/antialias:\s*false/.test(config), 'Phaser config must disable antialiasing');
assert(/roundPixels:\s*true/.test(config), 'Phaser config must round camera pixels');
assert(config.includes('Phaser.Scale.RESIZE'), 'Phaser canvas must resize to the existing game viewport');
assert(!config.includes("backgroundColor: '#365b26'"), 'Phaser must not expose the old flat green canvas around the map');
assert(config.includes("backgroundColor: '#18130f'"), 'Phaser gutters must use the neutral game-frame color');
assert(/transparent:\s*false/.test(config), 'Phaser gutters must render as an intentional opaque game frame');

for (const marker of ['PhaserWorldSnapshot', 'PhaserEnvironmentSnapshot', 'PhaserInputIntent', 'publishSnapshot', 'subscribeSnapshot', 'emitInputIntent', 'subscribeInputIntent']) {
  assert(bridge.includes(marker), `Typed React-Phaser bridge is missing ${marker}`);
}
for (const environmentMarker of ['time:', 'season:', 'weather:']) {
  assert(bridge.includes(environmentMarker), `React-Phaser snapshots must include ${environmentMarker.slice(0, -1)} state`);
}
assert(!/localStorage|persist[A-Z]|load[A-Z]/.test(bridge), 'Bridge must not own persistence or domain state');
assert(!/localStorage|persist[A-Z]|load[A-Z]/.test(bootScene), 'BootScene must not own persistence or domain state');
assert(!/localStorage|persist[A-Z]|load[A-Z]/.test(villageScene), 'FarmVillageScene must remain a rendering/input adapter');
assert(villageScene.includes('setFilter(Phaser.Textures.FilterMode.NEAREST)'), 'Phaser textures must use nearest-neighbor filtering');
assert(villageScene.includes('setDepth'), 'FarmVillageScene must preserve y/depth ordering');
assert(villageScene.includes('emitInputIntent'), 'FarmVillageScene must send gameplay input through the bridge');
assert(!/Arcade|physics\.add|Phaser\.Physics/.test(villageScene), 'Phaser migration must reuse grid collision instead of adding a physics engine');
assert(!villageScene.includes('children.removeAll(true)'), 'FarmVillageScene must reconcile sprites instead of rebuilding the world on every snapshot');
assert(villageScene.includes('spriteObjects'), 'FarmVillageScene must keep stable sprite objects between React snapshots');
assert(villageScene.includes('spriteTargets'), 'FarmVillageScene must retain smooth target positions for moving sprites');
assert(villageScene.includes('updateSpriteMotion'), 'FarmVillageScene must interpolate moving sprites every Phaser frame');
assert(villageScene.includes('advanceWalkFrame') && villageScene.includes('WALK_STRIDE_PX'), 'WorldScene must cycle walk frames by distance travelled, not once per tile');
assert(bridge.includes('frames?: string[]'), 'Sprite snapshots must be able to carry a walk-cycle frame set');
assert(component.includes('frames: player.walking'), 'The player snapshot must hand Phaser its directional walk frames while moving');
assert(villageScene.includes('Phaser.Scale.Events.RESIZE'), 'FarmVillageScene must respond when the RESIZE scale mode changes the canvas');
assert(villageScene.includes('syncCameraViewport'), 'FarmVillageScene must synchronize its camera viewport with the resized canvas');
assert(villageScene.includes('setViewport(0, 0, canvasWidth, canvasHeight)'), 'Phaser camera viewport must fill the complete canvas without dark gutters');
assert(villageScene.includes('camera.setOrigin(0.5, 0.5)'), 'Phaser camera must use its centered projection origin so bounded fit zoom centers the region inside the canvas');
assert(villageScene.includes('getFitCameraZoom'), 'WorldScene must derive fit zoom from the canvas and world dimensions so the whole region stays visible');
assert(villageScene.includes('updateDeadZoneCamera'), 'WorldScene must resolve its camera through the shared controller');
assert(villageScene.includes('camera.setBounds(0, 0, snapshot.worldWidth, snapshot.worldHeight)'), 'Bounds must let Phaser center a region smaller than the canvas into a neutral letterbox');
assert(!villageScene.includes('snapshot.camera.zoom'), 'React snapshots must not dictate Phaser zoom');
assert(!villageScene.includes('snapshot.camera.left'), 'React snapshots must not dictate Phaser horizontal scroll');
assert(!villageScene.includes('snapshot.camera.top'), 'React snapshots must not dictate Phaser vertical scroll');
assert(villageScene.includes('phaserCameraWidth'), 'Phaser canvas must expose camera dimensions for browser regression checks');
assert(villageScene.includes('phaserCameraScrollX'), 'Phaser canvas must expose horizontal camera scroll for letterbox diagnostics');
assert(villageScene.includes('phaserCameraScrollY'), 'Phaser canvas must expose vertical camera scroll for letterbox diagnostics');
assert(villageScene.includes('phaserMapDisplayWidth'), 'Phaser canvas must expose rendered terrain dimensions for browser regression checks');
assert(villageScene.includes('phaserWorldWidth'), 'Phaser canvas must expose requested world dimensions beside the rendered terrain size');
assert(villageScene.includes('phaserCameraDeadZoneWidth'), 'Browser diagnostics must expose the camera dead-zone width');
assert(villageScene.includes('phaserCameraMoved'), 'Browser diagnostics must report whether the latest player step moved the camera');
assert(villageScene.includes('if (cameraViewChanged)'), 'Camera telemetry must emit only when zoom or scroll actually changes');
assert(villageScene.includes('private cameraScrollX = 0'), 'FarmVillageScene must own stable camera scroll instead of reading Phaser frame corrections back into domain state');
assert(/export function getFitCameraZoom/.test(cameraController), 'Camera controller must expose deterministic fit zoom');
assert(/export function updateDeadZoneCamera/.test(cameraController), 'Camera controller must expose deterministic dead-zone updates');
assert(cameraController.includes('Math.round(value * zoom) / zoom'), 'Camera scroll must align to physical pixels');
assert(cameraController.includes('moved: false'), 'Camera controller must preserve a perfectly stable scroll inside the dead zone');
const cameraBase = updateDeadZoneCamera({
  canvasWidth: 1120,
  canvasHeight: 900,
  worldWidth: 1024,
  worldHeight: 704,
  targetX: 512,
  targetY: 352,
  previousScrollX: 0,
  previousScrollY: 0,
  initialized: false,
});
const cameraInsideDeadZone = updateDeadZoneCamera({
  canvasWidth: 1120,
  canvasHeight: 900,
  worldWidth: 1024,
  worldHeight: 704,
  targetX: 528,
  targetY: 352,
  previousScrollX: cameraBase.scrollX,
  previousScrollY: cameraBase.scrollY,
  initialized: true,
});
const cameraOutsideDeadZone = updateDeadZoneCamera({
  canvasWidth: 1120,
  canvasHeight: 900,
  worldWidth: 1024,
  worldHeight: 704,
  targetX: 900,
  targetY: 352,
  previousScrollX: cameraBase.scrollX,
  previousScrollY: cameraBase.scrollY,
  initialized: true,
});
assert(Math.abs(cameraBase.zoom - getFitCameraZoom(1120, 900, 1024, 704)) < 1e-9, 'Camera controller must use fit zoom');
assert(cameraBase.visibleWidth === 1024 && cameraBase.visibleHeight === 704, 'Fit zoom must keep the entire region inside the canvas');
assert(!cameraInsideDeadZone.moved, 'Player movement must keep the fit-centered camera perfectly still');
assert(cameraInsideDeadZone.scrollX === cameraBase.scrollX && cameraInsideDeadZone.scrollY === cameraBase.scrollY, 'Fit-center stability must preserve exact camera coordinates');
assert(!cameraOutsideDeadZone.moved && cameraOutsideDeadZone.scrollX === cameraBase.scrollX, 'A region that fits the canvas must never scroll as the player crosses it');
assert(cameraOutsideDeadZone.visibleWidth === 1024, 'The whole region width must stay visible so edge buildings are never cropped');
assert(Math.abs(cameraOutsideDeadZone.scrollX * cameraOutsideDeadZone.zoom - Math.round(cameraOutsideDeadZone.scrollX * cameraOutsideDeadZone.zoom)) < 1e-9, 'Camera scroll must align to a physical pixel');
assert(!bridge.includes('PhaserCameraSnapshot'), 'Camera ownership must stay inside Phaser instead of the React bridge');
assert(villageScene.includes("this.scale.off(Phaser.Scale.Events.RESIZE"), 'FarmVillageScene must remove its scale resize listener during disposal');
assert(!villageScene.includes('mapBackdrop'), 'The seasonal gutter backdrop must stay outside WebGL to avoid duplicate texture sampling');
assert(!villageScene.includes('add.tileSprite'), 'The backdrop must avoid non-power-of-two WebGL texture wrapping');
assert(!villageScene.includes('createCanvas'), 'The backdrop must avoid runtime canvas texture uploads');

assert(host.includes('gameRef'), 'React host must guard a single Phaser.Game instance');
assert(host.includes('game.destroy(true)'), 'React host must destroy Phaser cleanly during unmount/StrictMode replay');
assert(host.includes('createPhaserGame'), 'React host must create Phaser through the shared config factory');
assert(host.includes('ResizeObserver'), 'React host must observe CSS-driven viewport size changes');
assert(host.includes('.scale.resize(width, height)'), 'React host must resize the Phaser renderer when adaptive HUD dimensions change');
assert(host.includes('.renderer.resize(width, height)'), 'React host must repair a stale WebGL drawing buffer after CSS-driven layout changes');
assert(/activeGame\.scale\.resize\(width, height\);\s*activeGame\.renderer\.resize\(width, height\);/.test(host), 'React host must refresh the GPU viewport even when Phaser already reports the target dimensions');
assert(host.includes('phaserRendererWidth'), 'React host must expose renderer dimensions for browser regression checks');
assert(host.includes('resizeObserver?.disconnect()'), 'React host must disconnect its resize observer during cleanup');
assert(host.includes('data-phaser-host="outdoor-world"'), 'React host must expose a browser-testable outdoor-world marker');
assert(host.includes('webglcontextlost'), 'React host must leave Phaser when the WebGL context is lost');
assert(host.includes('errorRef.current'), 'React host must report initialization and runtime failures to the game shell');
assert(!host.includes('backgroundImage'), 'React host must not paste a duplicate seasonal map behind the canvas');

assert(component.includes("from './game/PhaserGameHost'"), 'The game shell must integrate PhaserGameHost');
assert(component.includes('parseGameRenderer'), 'The renderer query parameter must have an explicit parser');
assert(component.includes("searchParams.get('renderer')"), 'Renderer selection must support ?renderer=dom and ?renderer=phaser');
assert(component.includes('data-game-renderer={effectiveRenderer}'), 'Root diagnostics must expose the effective renderer');
assert(component.includes('data-phaser-fallback='), 'Root diagnostics must expose safe Phaser fallback state');
assert(component.includes('setPhaserFallback'), 'Phaser failures must switch the game shell back to its DOM renderer');
assert(component.includes('<PhaserGameHost'), 'Farm Village must mount the Phaser canvas host');
assert(component.includes('data-map-renderer="single-generated-map-image"'), 'The original DOM renderer must remain available for regression comparison');
assert(component.includes('handleGameInputIntent'), 'Keyboard and touch controls must converge on one typed input handler');
assert(component.includes("if (intent.type === 'move') movePlayerRef.current(intent.direction)"), 'Phaser movement must reuse the existing React movement and collision path');
assert(component.includes('const handleTouchMove = useCallback'), 'One-shot mobile movement must have an explicit lifecycle');
assert(component.includes("handleGameInputIntent({ type: 'stop-moving' })"), 'Mobile movement must return the player to an idle frame after each step');
assert(component.includes("onClick={() => handleTouchMove('right')}"), 'Mobile direction buttons must use the one-shot movement lifecycle');
assert(component.includes('isBlockedByEntity(nextX, nextY'), 'The existing entity and terrain collision guard must remain authoritative');
assert(component.includes('getPhaserWorldRegion(currentRegion, seasonState.season)'), 'Outdoor Phaser snapshots must select the active region and seasonal map');
assert(!component.includes('camera: {'), 'MossbellFarmGame must not calculate Phaser camera state');
for (const storageMarker of [
  'data-farm-storage-key',
  'data-fishing-storage-key',
  'data-village-life-storage-key',
  'data-open-world-storage-key',
  'data-foraging-storage-key',
  'data-season-storage-key',
  'data-weather-storage-key',
  'data-story-storage-key',
]) {
  assert(component.includes(storageMarker), `Existing persistence marker must remain available: ${storageMarker}`);
}

assert(styles.includes('.phaser-game-host'), 'Phaser host layout styles are required');
assert(styles.includes('.phaser-game-host canvas'), 'Phaser canvas must explicitly fill the game viewport');
assert(styles.includes('image-rendering: pixelated'), 'Pixel-art rendering must remain enabled in CSS');
assert((scripts.test ?? '').includes('test-phaser-renderer.mjs'), 'npm test must include the Phaser renderer regression test');

if (failures.length > 0) {
  console.error('Phaser renderer migration test failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('phaser renderer test passed: typed bridge, one runtime, pixel config, renderer switch, safe fallback, and DOM parity path');
