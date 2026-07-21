import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = readFileSync('src/game/farmLoop.ts', 'utf8')
  .replace(
    /^import \{ CROP_SPRITES, SOIL_SPRITES, TOOL_SPRITES \} from '\.\/animationCatalog';\r?\n/m,
    `const CROP_SPRITES = new Proxy({}, { get: () => new Proxy({}, { get: () => '' }) });
    const SOIL_SPRITES = { untilled: '', tilled: '', watered: '' };
    const TOOL_SPRITES = { hoe: '', seeds: '', 'watering-can': '' };
    `,
  );
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  fileName: 'farmLoop.ts',
}).outputText;
const farm = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const initial = farm.createInitialFarmState();
assert(farm.FARM_SAVE_VERSION >= 4, 'Expandable farms require a new save version');
assert(initial.plots.length === 6, 'Existing saves must still begin with the original six plots');
assert(typeof farm.isFarmCoordinateWithinWorld === 'function', 'Freeform farms need a reusable world-bounds guard');

const allowOpenGround = (x, y) => x === 5 && y === 4;
const target = farm.getFarmBuildTarget({ x: 4, y: 4, facing: 'right' }, initial.plots, allowOpenGround);
assert(target?.x === 5 && target?.y === 4, 'Facing valid open ground outside the old field must expose a build target');
assert(farm.getFarmBuildTarget({ x: 22, y: 10, facing: 'down' }, initial.plots) === null, 'An occupied plot must not be offered as a build target');
assert(
  farm.getFarmBuildTarget({ x: 4, y: 4, facing: 'right' }, initial.plots, () => false) === null,
  'A map terrain policy must be able to protect houses, objects, paths, and water',
);
assert(
  farm.getFarmBuildTarget({ x: 0, y: 1, facing: 'left' }, initial.plots) === null,
  'Ground outside the playable world must never be tillable',
);

const created = farm.createFarmPlotAt(initial, 5, 4, allowOpenGround);
assert(created.changed, 'Hoeing valid open ground must create a plot');
assert(created.state.plots.length === 7, 'Creating one field tile must append exactly one plot');
const newPlot = created.state.plots.find((plot) => plot.x === 5 && plot.y === 4);
assert(newPlot?.id === 'field-5-4' && newPlot.stage === 'tilled', 'A newly hoed tile must use a stable coordinate id and begin tilled');
assert(
  farm.getFarmInteractionTarget({ x: 4, y: 4, facing: 'right' }, created.state.plots)?.id === 'field-5-4',
  'The plot directly in front of the player must win distance ties after creation',
);

const duplicate = farm.createFarmPlotAt(created.state, 5, 4, allowOpenGround);
assert(!duplicate.changed && duplicate.state.plots.length === 7, 'The same ground tile must never create a duplicate plot');
const wrongTool = farm.createFarmPlotAt({ ...initial, selectedTool: 'seeds' }, 5, 4, allowOpenGround);
assert(!wrongTool.changed, 'Only the hoe may create a new farm plot');
const protectedGround = farm.createFarmPlotAt(initial, 5, 4, () => false);
assert(!protectedGround.changed, 'The terrain policy must prevent plot creation on protected ground');

const restored = farm.normalizeFarmState(JSON.parse(JSON.stringify(created.state)));
assert(restored.plots.some((plot) => plot.id === 'field-5-4'), 'A freeform plot must survive save normalization');
const freeformPlots = [];
for (let y = 1; y <= 20 && freeformPlots.length < 21; y += 1) {
  for (let x = 1; x <= 30 && freeformPlots.length < 21; x += 1) {
    if (initial.plots.some((plot) => plot.x === x && plot.y === y)) continue;
    freeformPlots.push({ id: `field-${x}-${y}`, x, y, stage: 'tilled', crop: null, wateredAt: null });
  }
}
const expanded = farm.normalizeFarmState({ ...initial, plots: [...initial.plots, ...freeformPlots] });
assert(expanded.plots.length === initial.plots.length + freeformPlots.length, 'Freeform farms must not retain the old 20-tile capacity');
const sanitized = farm.normalizeFarmState({
  ...created.state,
  plots: [
    ...created.state.plots,
    { id: 'field-0-0', x: 0, y: 0, stage: 'tilled', crop: null, wateredAt: null },
    { id: 'field-5-4-copy', x: 5, y: 4, stage: 'ready', crop: 'pumpkin', wateredAt: 1 },
  ],
});
assert(!sanitized.plots.some((plot) => plot.x === 0 && plot.y === 0), 'Save normalization must discard plots outside the playable world');
assert(sanitized.plots.filter((plot) => plot.x === 5 && plot.y === 4).length === 1, 'Save normalization must deduplicate plot coordinates');

const gameSource = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
assert(gameSource.includes('data-farm-build-mode="freeform"'), 'Runtime diagnostics must identify freeform farming mode');
assert(gameSource.includes('getFarmBuildTarget(player, farmState.plots, canTillFarmCell)'), 'Build previews must use the live terrain policy');
assert(gameSource.includes('createFarmPlotAt(farmStateRef.current, farmBuildTarget.x, farmBuildTarget.y, canTillFarmCell)'), 'Plot creation must recheck the live terrain policy');
assert(!gameSource.includes('data-farm-plot-capacity="20"'), 'Runtime UI must not advertise the removed 20-tile cap');

console.log('expandable farm test passed: freeform world plots, terrain guards, stable ids, and uncapped persistence');
