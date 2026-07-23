import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const layoutSource = readFileSync('src/game/villageLayout.ts', 'utf8')
  .replace(/^import type .*;\r?\n/gm, '');
const compiledLayout = ts.transpileModule(layoutSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'villageLayout.ts',
}).outputText;
const villageLayout = await import(`data:text/javascript;base64,${Buffer.from(compiledLayout).toString('base64')}`);

const compositionSource = readFileSync('src/game/worldComposition.ts', 'utf8');
const compiledComposition = ts.transpileModule(compositionSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'worldComposition.ts',
}).outputText;
const worldComposition = await import(`data:text/javascript;base64,${Buffer.from(compiledComposition).toString('base64')}`);

const terrainSource = readFileSync('src/game/worldTerrain.ts', 'utf8')
  .replace(/^import type .*;\r?\n/gm, '');
const compiledTerrain = ts.transpileModule(terrainSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'worldTerrain.ts',
}).outputText;
const worldTerrain = await import(`data:text/javascript;base64,${Buffer.from(compiledTerrain).toString('base64')}`);

const seaRouteSource = readFileSync('src/game/seaRoute.ts', 'utf8');
const compiledSeaRoute = ts.transpileModule(seaRouteSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'seaRoute.ts',
}).outputText;
const seaRoute = await import(`data:text/javascript;base64,${Buffer.from(compiledSeaRoute).toString('base64')}`);

const source = readFileSync('src/game/openWorld.ts', 'utf8')
  .replace(
    /^import \{ FARM_VILLAGE_BUILDING_RECTS, FARM_VILLAGE_PATH_RECTS \} from '\.\/villageLayout';\r?\n/m,
    `const FARM_VILLAGE_BUILDING_RECTS = ${JSON.stringify(villageLayout.FARM_VILLAGE_BUILDING_RECTS)};\nconst FARM_VILLAGE_PATH_RECTS = ${JSON.stringify(villageLayout.FARM_VILLAGE_PATH_RECTS)};\n`,
  )
  .replace(
    /import \{\s*SEA_ROUTE_COLLISION_RECTS,[\s\S]*?from '\.\/seaRoute';\r?\n/m,
    `const SEA_ROUTE_COLLISION_RECTS = ${JSON.stringify(seaRoute.SEA_ROUTE_COLLISION_RECTS)};\nconst SEA_ROUTE_MAP_ASSET = ${JSON.stringify(seaRoute.SEA_ROUTE_MAP_ASSET)};\nconst SEA_ROUTE_REGION_ID = ${JSON.stringify(seaRoute.SEA_ROUTE_REGION_ID)};\nconst RIVER_COAST_DOCK_WALKABLE_CELLS = ${JSON.stringify(seaRoute.RIVER_COAST_DOCK_WALKABLE_CELLS)};\nconst isRiverCoastDockWalkable = ${seaRoute.isRiverCoastDockWalkable.toString()};\nconst isSeaRouteBlocked = ${seaRoute.isSeaRouteBlocked.toString()};\n`,
  )
  .replace(
    /^import \{ isTerrainMaskBlocked, isWorldWaterCell \} from '\.\/worldTerrain';\r?\n/m,
    `const WORLD_WATER_ROWS = ${JSON.stringify(worldTerrain.WORLD_WATER_ROWS)};\nconst isWorldWaterCell = (region, x, y) => WORLD_WATER_ROWS[region]?.find((row) => row.y === y)?.ranges.some(([from, to]) => x >= from && x <= to) ?? false;\nconst REGION_TERRAIN_MASKS = ${JSON.stringify(worldTerrain.REGION_TERRAIN_MASKS)};\nconst isTerrainMaskBlocked = ${worldTerrain.isTerrainMaskBlocked.toString()};\n`,
  )
  .replace(
    /import \{\s*WORLD_EXIT_BLUEPRINTS,[\s\S]*?from '\.\/worldComposition';\r?\n/m,
    `const WORLD_EXIT_BLUEPRINTS = ${JSON.stringify(worldComposition.WORLD_EXIT_BLUEPRINTS)};\nconst WORLD_MAP_REGION_ORDER = ${JSON.stringify(worldComposition.WORLD_MAP_REGION_ORDER)};\nconst WORLD_REGION_COORDINATES = ${JSON.stringify(worldComposition.WORLD_REGION_COORDINATES)};\nconst WORLD_REGION_IDS = ${JSON.stringify(worldComposition.WORLD_REGION_IDS)};\n`,
  );
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'openWorld.ts',
}).outputText;
const world = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const visualGateChecks = [
  ['farm-village', { x: 1, y: 8 }, 'left', 'village-west'],
  ['whisper-forest', { x: 30, y: 8 }, 'right', 'forest-east'],
  ['whisper-forest', { x: 13, y: 1 }, 'up', 'forest-north'],
  ['river-coast', { x: 13, y: 20 }, 'down', 'coast-south'],
  ['river-coast', { x: 30, y: 14 }, 'right', 'coast-east'],
  ['mine-foothill', { x: 1, y: 14 }, 'left', 'mine-west'],
  ['mine-foothill', { x: 12, y: 20 }, 'down', 'mine-south'],
  ['farm-village', { x: 12, y: 1 }, 'up', 'village-north'],
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
assert(world.isFarmVillageTillableTerrain(6, 10), 'Open village grass outside the old field must be tillable');
assert(!world.isFarmVillageTillableTerrain(12, 8), 'The main village road must not be tillable');
assert(!world.isFarmVillageTillableTerrain(3, 3), 'Building footprints must not be tillable');
assert(!world.isFarmVillageTillableTerrain(31, 8), 'The closed east edge must not be tillable');
assert(!world.isFarmVillageTillableTerrain(0, 10), 'Map edge cells must not be tillable');

assert(world.isRegionBlocked('whisper-forest', 17, 4), 'Forest stream above the bridge must be blocked');
assert(!world.isRegionBlocked('whisper-forest', 15, 8), 'Forest bridge approach must remain walkable');
assert(world.isRegionBlocked('whisper-forest', 13, 11), 'Forest stream below the bridge must be blocked');

function canReachRegionCell(region, start, target) {
  const queue = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === target.x && current.y === target.y) return true;
    for (const delta of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
      const next = { x: current.x + delta.x, y: current.y + delta.y };
      const key = `${next.x},${next.y}`;
      if (next.x < 0 || next.x >= world.WORLD_WIDTH || next.y < 0 || next.y >= world.WORLD_HEIGHT || visited.has(key)) continue;
      if (world.isRegionBlocked(region, next.x, next.y)) continue;
      visited.add(key);
      queue.push(next);
    }
  }
  return false;
}

assert(
  canReachRegionCell('river-coast', world.createInitialOpenWorldState().positions['river-coast'], seaRoute.SEA_ROUTE_RETURN.position),
  'River Coast arrival must connect to the ferry dock approach through walkable deck cells',
);

const blockedMineTerraces = [
  { x: 5, y: 9, label: 'upper-left cliff pocket' },
  { x: 5, y: 18, label: 'lower-left closed terrace' },
  { x: 21, y: 18, label: 'lower-right closed terrace' },
];
for (const cell of blockedMineTerraces) {
  assert(world.isRegionBlocked('mine-foothill', cell.x, cell.y), `${cell.label} must not be walkable`);
}

const openMineRoutes = [
  { x: 5, y: 14, label: 'west arrival path' },
  { x: 10, y: 14, label: 'western route' },
  { x: 15, y: 13, label: 'central copper approach' },
  { x: 17, y: 7, label: 'mine entrance approach' },
  { x: 22, y: 14, label: 'eastern stone approach' },
  { x: 26, y: 13, label: 'crystal approach' },
  { x: 12, y: 19, label: 'south exit path' },
];
for (const cell of openMineRoutes) {
  assert(!world.isRegionBlocked('mine-foothill', cell.x, cell.y), `${cell.label} must remain walkable`);
}

function canReachMineCell(target) {
  const queue = [{ x: 2, y: 14 }];
  const visited = new Set(['2,14']);
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
for (const cell of [...openMineRoutes, { x: 12, y: 20, label: 'south gate approach' }]) {
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
  'farm-village': { x: 3, y: 3, facing: 'down' },
  'whisper-forest': { x: 17, y: 4, facing: 'left' },
  'river-coast': { x: 5, y: 5, facing: 'up' },
  'mine-foothill': { x: 5, y: 9, facing: 'right' },
};
const recoveredState = world.normalizeOpenWorldState(unsafeSavedState);
for (const region of world.REGION_IDS) {
  const recovered = recoveredState.positions[region];
  assert(!world.isRegionBlocked(region, recovered.x, recovered.y), `${region} saved position must recover outside collision terrain and buildings`);
}
assert(recoveredState.positions['farm-village'].x !== 3 || recoveredState.positions['farm-village'].y !== 3, 'Farmhouse collision save must move to a safe village tile');
assert(recoveredState.positions['whisper-forest'].x !== 17 || recoveredState.positions['whisper-forest'].y !== 4, 'A save in the forest stream must recover to dry ground');

const trappedMineState = world.createInitialOpenWorldState();
trappedMineState.currentRegion = 'mine-foothill';
trappedMineState.positions['mine-foothill'] = { x: 5, y: 18, facing: 'right' };
const recoveredMineState = world.normalizeOpenWorldState(trappedMineState);
assert(!world.isRegionBlocked('mine-foothill', recoveredMineState.positions['mine-foothill'].x, recoveredMineState.positions['mine-foothill'].y), 'A save inside the closed mine terrace must recover onto the central path');
assert(
  (recoveredMineState.positions['mine-foothill'].x >= 11 && recoveredMineState.positions['mine-foothill'].x <= 13)
    || (recoveredMineState.positions['mine-foothill'].y >= 13 && recoveredMineState.positions['mine-foothill'].y <= 15),
  'Closed-terrace recovery must land on the central route or south corridor',
);

assert(world.getRegionExit('farm-village', { x: 1, y: 8 }, 'right') === null, 'A gate must require outward movement');
assert(world.getRegionExit('farm-village', { x: 20, y: 8 }, 'left') === null, 'A gate must not trigger away from the edge');

let state = world.createInitialOpenWorldState();
for (const exitId of ['village-west', 'forest-north', 'coast-east', 'mine-south']) {
  const exit = world.REGION_EXITS.find((candidate) => candidate.id === exitId);
  assert(exit.from === state.currentRegion, `${exitId} must continue the world loop from ${state.currentRegion}`);
  state = world.enterRegion(state, exit).state;
}
assert(state.currentRegion === 'farm-village', 'Four exits must complete the world loop back to the village');
assert(state.discovered.length === 4, 'World loop must discover all four regions');

console.log('open world test passed: visible gate approaches, safe arrivals, directional exits, full region loop');
