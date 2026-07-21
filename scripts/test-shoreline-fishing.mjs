import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const terrainSource = readFileSync('src/game/worldTerrain.ts', 'utf8')
  .replace(/^import type .*;\r?\n/gm, '');
const compiledTerrain = ts.transpileModule(terrainSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  fileName: 'src/game/worldTerrain.ts',
}).outputText;
const terrain = await import(`data:text/javascript;base64,${Buffer.from(compiledTerrain).toString('base64')}`);

const rawFishing = readFileSync('src/game/fishingLoop.ts', 'utf8')
  .replace(/import type \{ RegionId \} from '\.\/openWorld';/, '')
  .replace(/import type \{ DayPhase \} from '\.\/villagePulse';/, '')
  .replace(/import type \{ Season \} from '\.\/seasonSystem';/, '')
  .replace(/import \{ FISH_SPRITES \} from '\.\/animationCatalog';/, '')
  .replace(
    /import \{ getWorldWaterCells, isWorldWaterCell \} from '\.\/worldTerrain';/,
    `const WORLD_WATER_ROWS = ${JSON.stringify(terrain.WORLD_WATER_ROWS)};
    const isWorldWaterCell = (region, x, y) => WORLD_WATER_ROWS[region]?.find((row) => row.y === y)?.ranges.some(([from, to]) => x >= from && x <= to) ?? false;
    const getWorldWaterCells = (region) => (WORLD_WATER_ROWS[region] ?? []).flatMap((row) => row.ranges.flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, index) => ({ x: from + index, y: row.y }))));`,
  );
const compiledFishing = ts.transpileModule(
  `const FISH_SPRITES = new Proxy({}, { get: (_, key) => String(key) });\n${rawFishing}`,
  {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: 'src/game/fishingLoop.ts',
  },
).outputText;
const fishing = await import(`data:text/javascript;base64,${Buffer.from(compiledFishing).toString('base64')}`);

assert(typeof fishing.getFishingCastTarget === 'function', 'Fishing must resolve a cast target from nearby water instead of fixed zones');

const westRiverBank = fishing.getFishingCastTarget({ x: 7, y: 15, facing: 'right' }, 'river-coast');
assert(westRiverBank?.habitat === 'river', 'The west river bank must allow river fishing');
assert(westRiverBank?.bobberX > 7 && westRiverBank?.bobberY === 15, 'The west bank cast must land in the river ahead');

const eastRiverBank = fishing.getFishingCastTarget({ x: 12, y: 15, facing: 'left' }, 'river-coast');
assert(eastRiverBank?.habitat === 'river', 'The east river bank must allow river fishing');
assert(eastRiverBank?.bobberX < 12 && eastRiverBank?.bobberY === 15, 'The east bank cast must land in the river ahead');

const coastBank = fishing.getFishingCastTarget({ x: 10, y: 4, facing: 'left' }, 'river-coast');
assert(coastBank?.habitat === 'coast', 'The beach must allow coast fishing from any adjacent shoreline cell');

const pondBank = fishing.getFishingCastTarget({ x: 11, y: 15, facing: 'right' }, 'farm-village');
assert(pondBank?.habitat === 'pond', 'The farm pond must keep free shoreline casting');

assert(fishing.getFishingCastTarget({ x: 12, y: 15, facing: 'right' }, 'river-coast') === null, 'Casting away from water must not start fishing');
assert(!fishing.isFishingWaterCell(13, 13, 'river-coast'), 'Bridge deck cells must not become fishing water');

const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
assert(game.includes('data-fishing-mode="shoreline-casting"'), 'Runtime markers must expose shoreline casting mode');
assert(game.includes('getFishingCastTarget(player, currentRegion)'), 'The current player position and facing must drive the cast target');
assert(!game.includes('currentRegionFishingSpots.map'), 'Fixed fishing-zone markers must not render across the water');

console.log('shoreline fishing test passed: rod-facing casts work along pond, river, and coast banks without fixed zones');
