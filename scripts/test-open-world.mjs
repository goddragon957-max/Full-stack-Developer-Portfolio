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
assert(typeof world.isFarmVillageTillableTerrain === 'function', 'Farm village needs a semantic tillable-terrain guard');
assert(world.isFarmVillageTillableTerrain(2, 10), 'Open village grass outside the old field must be tillable');
assert(!world.isFarmVillageTillableTerrain(8, 8), 'The main village road must not be tillable');
assert(!world.isFarmVillageTillableTerrain(4, 3), 'Building footprints must not be tillable');
assert(!world.isFarmVillageTillableTerrain(28, 3), 'Large background trees must not be tillable');
assert(!world.isFarmVillageTillableTerrain(0, 10), 'Map edge cells must not be tillable');

for (const x of [20, 21, 22]) {
  assert(world.isRegionBlocked('whisper-forest', x, 9), `Forest stream tile ${x},9 above the bridge must be blocked`);
  assert(!world.isRegionBlocked('whisper-forest', x, 10), `Forest bridge tile ${x},10 must remain walkable`);
  assert(!world.isRegionBlocked('whisper-forest', x, 11), `Forest bridge tile ${x},11 must remain walkable`);
  assert(world.isRegionBlocked('whisper-forest', x, 12), `Forest stream tile ${x},12 below the bridge must be blocked`);
}

const blockedMineTerraces = [
  { x: 5, y: 9, label: 'upper-left cliff pocket' },
  { x: 12, y: 14, label: 'lower-left closed terrace' },
  { x: 21, y: 15, label: 'lower-right closed terrace' },
];
for (const cell of blockedMineTerraces) {
  assert(world.isRegionBlocked('mine-foothill', cell.x, cell.y), `${cell.label} must not be walkable`);
}

const openMineRoutes = [
  { x: 5, y: 5, label: 'west arrival path' },
  { x: 10, y: 9, label: 'western stone node approach' },
  { x: 16, y: 9, label: 'central copper approach' },
  { x: 20, y: 10, label: 'eastern iron approach' },
  { x: 22, y: 8, label: 'eastern stone approach' },
  { x: 27, y: 7, label: 'crystal approach' },
  { x: 15, y: 12, label: 'keeper route' },
  { x: 16, y: 19, label: 'south exit path' },
];
for (const cell of openMineRoutes) {
  assert(!world.isRegionBlocked('mine-foothill', cell.x, cell.y), `${cell.label} must remain walkable`);
}

function canReachMineCell(target) {
  const queue = [{ x: 2, y: 5 }];
  const visited = new Set(['2,5']);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === target.x && current.y === target.y) return true;
    for (const delta of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
      const next = { x: current.x + delta.x, y: current.y + delta.y };
      const key = `${next.x},${next.y}`;
      if (next.x < 0 || next.x >= world.WORLD_WIDTH || next.y < 0 || next.y >= world.WORLD_HEIGHT || visited.has(key)) continue;
      if (world.isRegionBlocked('mine-foothill', next.x, next.y)) continue;
      visited.add(key);
      queue.push(next);
    }
  }
  return false;
}
for (const cell of [...openMineRoutes, { x: 16, y: 20, label: 'south gate approach' }]) {
  assert(canReachMineCell(cell), `${cell.label} must connect to the west arrival through walkable terrain`);
}

const foragingSource = readFileSync('src/game/foragingLoop.ts', 'utf8')
  .replace(/import type \{ DayPhase \} from '\.\/villagePulse';/, '')
  .replace(/import type \{ RegionId \} from '\.\/openWorld';/, '')
  .replace(/import \{ FORAGE_SPRITES, NPC_WALK_SPRITES, ORE_SPRITES \} from '\.\/animationCatalog';/, '');
const compiledForaging = ts.transpileModule(
  `const spriteProxy = new Proxy({}, { get: () => '' });\nconst FORAGE_SPRITES = spriteProxy;\nconst ORE_SPRITES = spriteProxy;\nconst NPC_WALK_SPRITES = new Proxy({}, { get: () => ({ down: ['', ''] }) });\n${foragingSource}`,
  { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 }, fileName: 'foragingLoop.ts' },
).outputText;
const foraging = await import(`data:text/javascript;base64,${Buffer.from(compiledForaging).toString('base64')}`);
for (const node of foraging.FORAGE_NODES.filter((candidate) => candidate.region === 'mine-foothill')) {
  assert(!world.isRegionBlocked('mine-foothill', node.x, node.y), `${node.id} must stay on reachable mining ground`);
}
for (const phase of ['dawn', 'day', 'sunset', 'night']) {
  const position = foraging.getOpenWorldNpcPosition('mine-keeper', phase);
  assert(!world.isRegionBlocked('mine-foothill', position.x, position.y), `Mine keeper ${phase} position must remain walkable`);
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

const trappedMineState = world.createInitialOpenWorldState();
trappedMineState.currentRegion = 'mine-foothill';
trappedMineState.positions['mine-foothill'] = { x: 12, y: 14, facing: 'right' };
const recoveredMineState = world.normalizeOpenWorldState(trappedMineState);
assert(!world.isRegionBlocked('mine-foothill', recoveredMineState.positions['mine-foothill'].x, recoveredMineState.positions['mine-foothill'].y), 'A save inside the closed mine terrace must recover onto the central path');
assert(recoveredMineState.positions['mine-foothill'].x >= 14 && recoveredMineState.positions['mine-foothill'].x <= 17, 'Closed-terrace recovery must land on the central route');

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
