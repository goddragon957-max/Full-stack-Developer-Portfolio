import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = readFileSync('src/game/openWorld.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'openWorld.ts',
}).outputText;
const world = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const visualGateChecks = [
  ['farm-village', { x: 30, y: 8 }, 'right', 'village-east'],
  ['whisper-forest', { x: 1, y: 11 }, 'left', 'forest-west'],
  ['whisper-forest', { x: 17, y: 1 }, 'up', 'forest-north'],
  ['river-coast', { x: 18, y: 20 }, 'down', 'coast-south'],
  ['river-coast', { x: 30, y: 5 }, 'right', 'coast-east'],
  ['mine-foothill', { x: 1, y: 5 }, 'left', 'mine-west'],
  ['mine-foothill', { x: 16, y: 20 }, 'down', 'mine-south'],
  ['farm-village', { x: 8, y: 1 }, 'up', 'village-north'],
];

for (const [region, position, direction, expectedId] of visualGateChecks) {
  const exit = world.getRegionExit(region, position, direction);
  assert(exit?.id === expectedId, `${expectedId} must trigger from the visible road approach`);
  assert(!world.isRegionBlocked(exit.to, exit.arrival.x, exit.arrival.y), `${expectedId} arrival must not be blocked`);
  assert(exit.arrival.x >= 2 && exit.arrival.x <= world.WORLD_WIDTH - 3, `${expectedId} arrival x must be at least two tiles inside the map`);
  assert(exit.arrival.y >= 2 && exit.arrival.y <= world.WORLD_HEIGHT - 3, `${expectedId} arrival y must be at least two tiles inside the map`);
}

assert(world.REGION_TRANSITION_SWAP_MS >= 300 && world.REGION_TRANSITION_SWAP_MS <= 500, 'Region map swap must wait for a 300-500ms pixel fade');

for (const x of [20, 21, 22]) {
  assert(world.isRegionBlocked('whisper-forest', x, 9), `Forest stream tile ${x},9 above the bridge must be blocked`);
  assert(!world.isRegionBlocked('whisper-forest', x, 10), `Forest bridge tile ${x},10 must remain walkable`);
  assert(!world.isRegionBlocked('whisper-forest', x, 11), `Forest bridge tile ${x},11 must remain walkable`);
  assert(world.isRegionBlocked('whisper-forest', x, 12), `Forest stream tile ${x},12 below the bridge must be blocked`);
}

const unsafeSavedState = world.createInitialOpenWorldState();
unsafeSavedState.currentRegion = 'whisper-forest';
unsafeSavedState.positions = {
  'farm-village': { x: 4, y: 3, facing: 'down' },
  'whisper-forest': { x: 21, y: 12, facing: 'left' },
  'river-coast': { x: 25, y: 12, facing: 'up' },
  'mine-foothill': { x: 12, y: 3, facing: 'right' },
};
const recoveredState = world.normalizeOpenWorldState(unsafeSavedState);
for (const region of world.REGION_IDS) {
  const recovered = recoveredState.positions[region];
  assert(!world.isRegionBlocked(region, recovered.x, recovered.y), `${region} saved position must recover outside collision terrain and buildings`);
}
assert(recoveredState.positions['farm-village'].x !== 4 || recoveredState.positions['farm-village'].y !== 3, 'Farmhouse collision save must move to a safe village tile');
assert(recoveredState.positions['whisper-forest'].y === 11, 'A saved position below the forest bridge must recover onto the walkable bridge row');

assert(world.getRegionExit('farm-village', { x: 30, y: 8 }, 'left') === null, 'A gate must require outward movement');
assert(world.getRegionExit('farm-village', { x: 20, y: 8 }, 'right') === null, 'A gate must not trigger away from the edge');

let state = world.createInitialOpenWorldState();
for (const exitId of ['village-east', 'forest-north', 'coast-east', 'mine-south']) {
  const exit = world.REGION_EXITS.find((candidate) => candidate.id === exitId);
  assert(exit.from === state.currentRegion, `${exitId} must continue the world loop from ${state.currentRegion}`);
  state = world.enterRegion(state, exit).state;
}
assert(state.currentRegion === 'farm-village', 'Four exits must complete the world loop back to the village');
assert(state.discovered.length === 4, 'World loop must discover all four regions');

console.log('open world test passed: visible gate approaches, safe arrivals, directional exits, full region loop');
