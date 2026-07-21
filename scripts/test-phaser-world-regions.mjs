import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function readRequired(path) {
  assert(existsSync(path), `Missing outdoor Phaser world file: ${path}`);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const component = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const host = readFileSync('src/components/game/PhaserGameHost.tsx', 'utf8');
const bridge = readFileSync('src/game/phaser/bridge.ts', 'utf8');
const config = readFileSync('src/game/phaser/config.ts', 'utf8');
const bootScene = readFileSync('src/game/phaser/scenes/BootScene.ts', 'utf8');
const worldScene = readRequired('src/game/phaser/scenes/WorldScene.ts');
const worldRegions = readRequired('src/game/phaser/worldRegions.ts');

const regionIds = ['farm-village', 'whisper-forest', 'river-coast', 'mine-foothill'];

assert(worldRegions.includes('PHASER_WORLD_REGIONS'), 'Outdoor Phaser regions must have one exported data registry');
for (const region of regionIds) {
  assert(worldRegions.includes(`'${region}'`), `Outdoor Phaser region registry must include ${region}`);
}
for (const marker of ['REGION_COLLISION_RECTS', 'REGION_EXITS', 'getSeasonalMapAsset', 'FORAGE_NODES', 'interactionIds', 'npcIds']) {
  assert(worldRegions.includes(marker), `Outdoor Phaser region data must derive ${marker}`);
}

assert(/region:\s*RegionId/.test(bridge), 'Phaser snapshots must accept every RegionId instead of a farm-village literal');
assert(bridge.includes('PhaserRegionTransitionSnapshot'), 'Phaser snapshots must carry transition phase data to the scene');
assert(config.includes("from './scenes/WorldScene'"), 'Phaser config must boot the generic WorldScene');
assert(config.includes('new WorldScene(bridge)'), 'The single Phaser.Game must own one generic outdoor scene');
assert(!config.includes('new FarmVillageScene'), 'Phaser config must not keep a farm-only runtime scene');
assert(bootScene.includes("this.scene.start('WorldScene')"), 'BootScene must start the generic outdoor scene');

assert(component.includes('phaserOutdoorRequested'), 'The renderer gate must describe every outdoor region');
assert(component.includes('usePhaserOutdoor'), 'All outdoor regions must share the Phaser renderer branch');
assert(!/phaserOutdoorRequested[\s\S]{0,220}currentRegion\s*===\s*'farm-village'/.test(component), 'Outdoor Phaser activation must not be restricted to Farm Village');
assert(component.includes('getPhaserWorldRegion(currentRegion, seasonState.season)'), 'Snapshots must derive their map and dimensions from the current region registry');
assert(component.includes('getVisibleForageNodes(foragingState, currentRegion)'), 'Phaser must render forage and ore nodes for the active region');
assert(/region:\s*currentRegion/.test(component), 'The Phaser snapshot must publish the active region');
assert(component.includes('transition: regionTransition'), 'React transition state must drive the Phaser pixel fade');
assert(component.includes('currentRegion === \'farm-village\' ? villageLifeState.fencePieces : []'), 'Farm-only fences must not leak into other Phaser regions');
assert(component.includes('currentRegion === \'farm-village\' ? farmState.plots : []'), 'Farm-only plots must not leak into other Phaser regions');
assert(component.includes("data-input-owner={usePhaserOutdoor ? 'phaser-bridge' : 'react-dom'}"), 'Keyboard ownership must stay singular across every outdoor region');

assert(host.includes('activePhaserRuntimeCount'), 'The host must track the real number of active Phaser.Game instances');
assert(host.includes('data-phaser-host="outdoor-world"'), 'The host must expose a generic outdoor-world marker');
assert(host.includes('data-phaser-region={snapshot.region}'), 'The host must expose the active Phaser region for browser QA');

for (const marker of [
  'export class WorldScene',
  "super('WorldScene')",
  'activeRegion',
  'resetRegionState',
  'reconcileRegionTransition',
  'camera.fadeOut',
  'camera.fadeIn',
  'phaserActiveRegion',
  'phaserRegionChangeCount',
  'camera.worldView',
  'spriteObjects',
  'spriteTargets',
  'updateSpriteMotion',
  'setFilter(Phaser.Textures.FilterMode.NEAREST)',
]) {
  assert(worldScene.includes(marker), `WorldScene is missing required runtime behavior: ${marker}`);
}
assert(!/localStorage|persist[A-Z]|load[A-Z]/.test(worldScene), 'WorldScene must remain a renderer and input adapter, not a persistence owner');
assert(!worldScene.includes('children.removeAll(true)'), 'WorldScene must reconcile objects rather than rebuild every snapshot');
assert(worldScene.includes("this.scale.off(Phaser.Scale.Events.RESIZE"), 'WorldScene must clean up its resize listener');
assert(worldScene.includes("this.input.keyboard?.off('keydown'"), 'WorldScene must clean up its keyboard listeners');

assert((packageJson.scripts?.test ?? '').includes('test-phaser-world-regions.mjs'), 'npm test must include the four-region Phaser contract');

if (failures.length > 0) {
  console.error('Outdoor Phaser world RED contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('outdoor Phaser world test passed: four regions, one runtime, generic scene, clean transitions');
