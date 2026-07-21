import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const rawSource = readFileSync('src/game/farmLoop.ts', 'utf8').replace(
  /import \{ CROP_SPRITES, SOIL_SPRITES, TOOL_SPRITES \} from '\.\/animationCatalog';/,
  '',
);
const source = `const CROP_SPRITES = new Proxy({}, { get: () => new Proxy({}, { get: () => '' }) });
const SOIL_SPRITES = { untilled: '', tilled: '', watered: '' };
const TOOL_SPRITES = { hoe: '', seeds: '', 'watering-can': '' };
${rawSource}`;
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  fileName: 'farmLoop.ts',
}).outputText;
const farm = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

assert(farm.FARM_SAVE_VERSION === 4, 'Expandable plots require farm save version 4');
assert(
  JSON.stringify(farm.FARM_CROPS) === JSON.stringify(['potato', 'strawberry', 'carrot', 'tomato', 'corn', 'pumpkin']),
  'Canonical crop IDs must contain six in-world crops only',
);

const legacy = {
  version: 2,
  selectedTool: 'seeds',
  selectedSeed: 'backend',
  wateringStreak: 8,
  firstHarvested: true,
  plots: [
    { id: 'plot-1', x: 999, y: 999, stage: 'ready', crop: 'frontend', wateredAt: 1234 },
    { id: 'plot-2', stage: 'growing-2', crop: 'backend', wateredAt: 5678 },
    { id: 'plot-3', stage: 'planted', crop: 'bim', wateredAt: null },
  ],
  inventory: { frontend: 7, backend: 5, bim: 3, tomato: 2, corn: 1, pumpkin: 4 },
  qualityInventory: {
    frontend: { normal: 2, silver: 3, gold: 2 },
    backend: { normal: 1, silver: 1, gold: 3 },
    bim: { normal: 0, silver: 2, gold: 1 },
  },
};

const migrated = farm.normalizeFarmState(legacy);
assert(migrated.version === 4, 'Migrated farm state must use the latest version');
assert(migrated.selectedSeed === 'strawberry', 'Legacy backend selection must become strawberry');
assert(migrated.plots[0].crop === 'potato' && migrated.plots[0].stage === 'ready', 'Legacy frontend plot must preserve stage as potato');
assert(migrated.plots[1].crop === 'strawberry', 'Legacy backend plot must become strawberry');
assert(migrated.plots[2].crop === 'carrot', 'Legacy BIM plot must become carrot');
assert(migrated.plots[0].x === 22 && migrated.plots[0].y === 11, 'Saved plot coordinates must not override canonical layout');
assert(migrated.inventory.potato === 7 && migrated.inventory.strawberry === 5 && migrated.inventory.carrot === 3, 'Legacy crop quantities must survive migration');
assert(migrated.qualityInventory.potato.gold === 2, 'Potato quality counts must survive migration');
assert(migrated.qualityInventory.strawberry.gold === 3, 'Strawberry quality counts must survive migration');
assert(migrated.qualityInventory.carrot.silver === 2, 'Carrot quality counts must survive migration');
assert(migrated.wateringStreak === 8 && migrated.firstHarvested, 'Unrelated farm progress must survive migration');
assert(!('frontend' in migrated.inventory) && !('backend' in migrated.inventory) && !('bim' in migrated.inventory), 'Legacy crop keys must not leak into the canonical state');

const initial = farm.createInitialFarmState();
assert(initial.selectedSeed === 'potato', 'New games must begin with potato selected');
assert(Object.keys(initial.inventory).length === 6, 'New games must keep exactly six crops');

console.log('farm migration test passed: legacy crops, plots, quantities, quality, and progress convert to pure-game IDs');
