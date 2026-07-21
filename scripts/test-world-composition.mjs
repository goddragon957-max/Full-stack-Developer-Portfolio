import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function loadOpenWorldModule() {
  const layoutSource = readFileSync('src/game/villageLayout.ts', 'utf8')
    .replace(/^import type .*;\r?\n/gm, '');
  const compiledLayout = ts.transpileModule(layoutSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'villageLayout.ts',
  }).outputText;

  const compositionSource = readFileSync('src/game/worldComposition.ts', 'utf8');
  const compiledComposition = ts.transpileModule(compositionSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'worldComposition.ts',
  }).outputText;

  const terrainSource = readFileSync('src/game/worldTerrain.ts', 'utf8')
    .replace(/^import type .*;\r?\n/gm, '');
  const compiledTerrain = ts.transpileModule(terrainSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'worldTerrain.ts',
  }).outputText;

  const seaRouteSource = readFileSync('src/game/seaRoute.ts', 'utf8');
  const compiledSeaRoute = ts.transpileModule(seaRouteSource, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: 'seaRoute.ts',
  }).outputText;

  return Promise.all([
    import(`data:text/javascript;base64,${Buffer.from(compiledLayout).toString('base64')}`),
    import(`data:text/javascript;base64,${Buffer.from(compiledComposition).toString('base64')}`),
    import(`data:text/javascript;base64,${Buffer.from(compiledTerrain).toString('base64')}`),
    import(`data:text/javascript;base64,${Buffer.from(compiledSeaRoute).toString('base64')}`),
  ]).then(async ([villageLayout, worldComposition, worldTerrain, seaRoute]) => {
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
          /^import \{ isWorldWaterCell \} from '\.\/worldTerrain';\r?\n/m,
          `const WORLD_WATER_ROWS = ${JSON.stringify(worldTerrain.WORLD_WATER_ROWS)};\nconst isWorldWaterCell = (region, x, y) => WORLD_WATER_ROWS[region]?.find((row) => row.y === y)?.ranges.some(([from, to]) => x >= from && x <= to) ?? false;\n`,
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
      return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
    });
}

const world = await loadOpenWorldModule();

const OPPOSITE_EDGE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const EDGE_DELTA = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const CANONICAL_SEAMS = [
  {
    first: 'whisper-forest',
    second: 'river-coast',
    firstEdge: 'up',
    secondEdge: 'down',
    span: [12, 13, 14],
    axis: 'x',
  },
  {
    first: 'river-coast',
    second: 'mine-foothill',
    firstEdge: 'right',
    secondEdge: 'left',
    span: [13, 14, 15],
    axis: 'y',
  },
  {
    first: 'mine-foothill',
    second: 'farm-village',
    firstEdge: 'down',
    secondEdge: 'up',
    span: [11, 12, 13],
    axis: 'x',
  },
  {
    first: 'farm-village',
    second: 'whisper-forest',
    firstEdge: 'left',
    secondEdge: 'right',
    span: [7, 8, 9],
    axis: 'y',
  },
];

function getExit(from, to) {
  return world.REGION_EXITS.find((exit) => exit.from === from && exit.to === to) ?? null;
}

function getSpan(exit) {
  return exit.edge === 'up' || exit.edge === 'down'
    ? exit.cells.map((cell) => cell.x).sort((a, b) => a - b)
    : exit.cells.map((cell) => cell.y).sort((a, b) => a - b);
}

function getCenter(exit) {
  const span = getSpan(exit);
  return (span[0] + span[span.length - 1]) / 2;
}

function deriveRegionCoordinates(startRegion) {
  const coordinates = new Map([[startRegion, { x: 1, y: 1 }]]);
  const queue = [startRegion];

  while (queue.length > 0) {
    const region = queue.shift();
    const origin = coordinates.get(region);
    for (const exit of world.REGION_EXITS.filter((candidate) => candidate.from === region)) {
      const delta = EDGE_DELTA[exit.edge];
      const next = { x: origin.x + delta.x, y: origin.y + delta.y };
      const known = coordinates.get(exit.to);
      if (!known) {
        coordinates.set(exit.to, next);
        queue.push(exit.to);
        continue;
      }
      assert(
        known.x === next.x && known.y === next.y,
        `World seams must embed in one plane without overlap; ${region} -> ${exit.to} places ${exit.to} at (${next.x},${next.y}) but it was already fixed at (${known.x},${known.y})`,
      );
    }
  }

  return Object.fromEntries(coordinates);
}

test('derives a canonical non-overlapping 2x2 world coordinate layout', () => {
  const coordinates = deriveRegionCoordinates('farm-village');
  const expected = {
    'farm-village': { x: 1, y: 1 },
    'whisper-forest': { x: 0, y: 1 },
    'river-coast': { x: 0, y: 0 },
    'mine-foothill': { x: 1, y: 0 },
  };

  assert(Object.keys(coordinates).length === 4, 'All four regions must be placed in the world plane');
  for (const [region, expectedPoint] of Object.entries(expected)) {
    const actual = coordinates[region];
    assert(actual, `${region} must receive world coordinates`);
    assert(
      actual.x === expectedPoint.x && actual.y === expectedPoint.y,
      `${region} must occupy canonical world coordinates (${expectedPoint.x},${expectedPoint.y}), got (${actual.x},${actual.y})`,
    );
  }

  const uniquePoints = new Set(Object.values(coordinates).map((point) => `${point.x},${point.y}`));
  assert(uniquePoints.size === 4, 'Canonical 2x2 world layout must not overlap regions');
});

test('uses reciprocal opposite-edge seams for each canonical region pair', () => {
  for (const seam of CANONICAL_SEAMS) {
    const forward = getExit(seam.first, seam.second);
    const backward = getExit(seam.second, seam.first);
    assert(forward, `${seam.first} must connect to ${seam.second}`);
    assert(backward, `${seam.second} must connect back to ${seam.first}`);
    assert(forward.edge === seam.firstEdge, `${seam.first} -> ${seam.second} must use the ${seam.firstEdge} edge`);
    assert(backward.edge === seam.secondEdge, `${seam.second} -> ${seam.first} must use the ${seam.secondEdge} edge`);
    assert(backward.edge === OPPOSITE_EDGE[forward.edge], `${seam.first} / ${seam.second} seams must use opposite edges`);
  }
});

test('spans each canonical seam with exactly three tiles', () => {
  for (const seam of CANONICAL_SEAMS) {
    const forward = getExit(seam.first, seam.second);
    const backward = getExit(seam.second, seam.first);
    assert(forward.cells.length === 3, `${forward.id} must span exactly three edge tiles`);
    assert(backward.cells.length === 3, `${backward.id} must span exactly three edge tiles`);
    assert(
      JSON.stringify(getSpan(forward)) === JSON.stringify(seam.span),
      `${forward.id} must cover ${seam.axis}=${seam.span.join('..').replace('..18..', '..')}`,
    );
    assert(
      JSON.stringify(getSpan(backward)) === JSON.stringify(seam.span),
      `${backward.id} must mirror ${seam.axis}=${seam.span.join('..').replace('..18..', '..')}`,
    );
  }
});

test('aligns reciprocal seam centers on the same world axis', () => {
  for (const seam of CANONICAL_SEAMS) {
    const forward = getExit(seam.first, seam.second);
    const backward = getExit(seam.second, seam.first);
    assert(
      getCenter(forward) === getCenter(backward),
      `${forward.id} and ${backward.id} must share the same seam center`,
    );
  }
});

test('defines exactly two edge exits per land region', () => {
  for (const region of world.LAND_REGION_IDS) {
    const exits = world.REGION_EXITS.filter((exit) => exit.from === region);
    assert(exits.length === 2, `${region} must expose exactly two region exits`);
    for (const exit of exits) {
      for (const cell of exit.cells) {
        if (exit.edge === 'left') assert(cell.x === 0, `${exit.id} must stay on the left boundary`);
        if (exit.edge === 'right') assert(cell.x === world.WORLD_WIDTH - 1, `${exit.id} must stay on the right boundary`);
        if (exit.edge === 'up') assert(cell.y === 0, `${exit.id} must stay on the top boundary`);
        if (exit.edge === 'down') assert(cell.y === world.WORLD_HEIGHT - 1, `${exit.id} must stay on the bottom boundary`);
      }
    }
  }
  assert(world.REGION_EXITS.every((exit) => exit.from !== 'mossbell-sea'), 'The sea route must use its dock interaction instead of a map-edge exit');
});

test('lands every canonical seam arrival safely inside the destination region', () => {
  for (const seam of CANONICAL_SEAMS) {
    for (const exit of [getExit(seam.first, seam.second), getExit(seam.second, seam.first)]) {
      assert(exit.arrival.x >= 2 && exit.arrival.x <= world.WORLD_WIDTH - 3, `${exit.id} arrival x must be at least two tiles inside the map`);
      assert(exit.arrival.y >= 2 && exit.arrival.y <= world.WORLD_HEIGHT - 3, `${exit.id} arrival y must be at least two tiles inside the map`);
      assert(!world.isRegionBlocked(exit.to, exit.arrival.x, exit.arrival.y), `${exit.id} arrival must be on walkable ground`);
    }
  }
});

test('supports a four-region clockwise loop on the canonical seam order', () => {
  const clockwise = [
    ['farm-village', 'whisper-forest', 'left'],
    ['whisper-forest', 'river-coast', 'up'],
    ['river-coast', 'mine-foothill', 'right'],
    ['mine-foothill', 'farm-village', 'down'],
  ];

  let state = world.createInitialOpenWorldState();
  for (const [from, to, edge] of clockwise) {
    assert(state.currentRegion === from, `Clockwise loop must currently be in ${from}`);
    const exit = getExit(from, to);
    assert(exit, `Clockwise loop must include ${from} -> ${to}`);
    assert(exit.edge === edge, `${from} -> ${to} must leave through the ${edge} edge`);
    state = world.enterRegion(state, exit).state;
  }

  assert(state.currentRegion === 'farm-village', 'Clockwise loop must return to the starting region');
});

test('supports a four-region reverse loop on the canonical seam order', () => {
  const reverse = [
    ['farm-village', 'mine-foothill', 'up'],
    ['mine-foothill', 'river-coast', 'left'],
    ['river-coast', 'whisper-forest', 'down'],
    ['whisper-forest', 'farm-village', 'right'],
  ];

  let state = world.createInitialOpenWorldState();
  for (const [from, to, edge] of reverse) {
    assert(state.currentRegion === from, `Reverse loop must currently be in ${from}`);
    const exit = getExit(from, to);
    assert(exit, `Reverse loop must include ${from} -> ${to}`);
    assert(exit.edge === edge, `${from} -> ${to} must leave through the ${edge} edge`);
    state = world.enterRegion(state, exit).state;
  }

  assert(state.currentRegion === 'farm-village', 'Reverse loop must return to the starting region');
});

const failures = [];

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, message: error instanceof Error ? error.message : String(error) });
    console.error(`FAIL ${name}`);
    console.error(`  ${failures[failures.length - 1].message}`);
  }
}

if (failures.length > 0) {
  console.error(`world composition test failed: ${failures.length} failing assertion group(s)`);
  process.exit(1);
}

console.log('world composition test passed: canonical 2x2 seams and loops');
