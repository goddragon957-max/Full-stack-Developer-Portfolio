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
  assert(exit.arrival.x > 0 && exit.arrival.x < world.WORLD_WIDTH - 1, `${expectedId} arrival x must be safely inside the map`);
  assert(exit.arrival.y > 0 && exit.arrival.y < world.WORLD_HEIGHT - 1, `${expectedId} arrival y must be safely inside the map`);
}

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
