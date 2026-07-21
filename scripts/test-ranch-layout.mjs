import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = readFileSync('src/game/villageLife.ts', 'utf8')
  .replace(/^import type .*;\r?\n/gm, '')
  .replace(
    /^import \{ NPC_WALK_SPRITES, PRODUCT_SPRITES, getAnimalRemasterSprite \} from '\.\/animationCatalog';\r?\n/m,
    `const NPC_WALK_SPRITES = {
      hana: { down: ['hana-0', 'hana-1'] },
      jun: { down: ['jun-0', 'jun-1'] },
    };
    const PRODUCT_SPRITES = { egg: 'egg', milk: 'milk', 'golden-egg': 'golden-egg' };
    const getAnimalRemasterSprite = () => 'animal';
    `,
  );
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'villageLife.ts',
}).outputText;
const villageLife = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

assert(villageLife.VILLAGE_LIFE_SAVE_VERSION >= 2, 'Editable ranch fences require a versioned save migration');

const initial = villageLife.createInitialVillageLifeState();
assert(initial.fencePieces.length === 14, 'The default ranch must contain 13 small rails and one gate');
assert(initial.fencePieces.every((piece) => piece.id === `ranch-fence-${piece.x}-${piece.y}`), 'Fence ids must be stable by world cell');

for (let x = 5; x <= 9; x += 1) {
  assert(villageLife.isRanchFenceCell(initial.fencePieces, x, 14), `Ranch top fence must occupy ${x},14`);
  assert(villageLife.getRanchFenceOrientation(initial.fencePieces, x, 14) === 'horizontal', `Ranch top fence ${x},14 must render horizontally`);
}
for (const y of [15, 16]) {
  assert(villageLife.isSolidRanchFenceCell(initial.fencePieces, 5, y), `Ranch left fence must block 5,${y}`);
  assert(villageLife.isSolidRanchFenceCell(initial.fencePieces, 9, y), `Ranch right fence must block 9,${y}`);
  assert(villageLife.getRanchFenceOrientation(initial.fencePieces, 5, y) === 'vertical', `Ranch left fence 5,${y} must render vertically`);
  assert(villageLife.getRanchFenceOrientation(initial.fencePieces, 9, y) === 'vertical', `Ranch right fence 9,${y} must render vertically`);
}
for (const x of [5, 6, 8, 9]) {
  assert(villageLife.isSolidRanchFenceCell(initial.fencePieces, x, 17), `Ranch lower rail must block ${x},17`);
}
assert(villageLife.isRanchFenceCell(initial.fencePieces, 7, 17), 'The center gate must be an editable fence piece');
assert(!villageLife.isSolidRanchFenceCell(initial.fencePieces, 7, 17), 'The default center gate must remain walkable');
assert(villageLife.getRanchFenceOrientation(initial.fencePieces, 7, 17) === 'gate', 'The center piece must use the gate sprite');
assert(!villageLife.isRanchFenceCell(initial.fencePieces, 7, 20), 'Ranch collision must not remain shifted below the pen');

const placed = villageLife.placeRanchFencePiece(initial, 10, 17, 'fence', () => true);
assert(placed.changed, 'Hammer mode must place a fence on valid empty ground');
assert(villageLife.isSolidRanchFenceCell(placed.state.fencePieces, 10, 17), 'Placed fence must participate in collision');
assert(!villageLife.placeRanchFencePiece(placed.state, 10, 17, 'fence', () => true).changed, 'Fence placement must reject duplicate cells');
assert(!villageLife.placeRanchFencePiece(initial, 20, 20, 'fence', () => false).changed, 'Fence placement must respect world occupancy validation');

const removed = villageLife.removeRanchFencePiece(initial, 5, 14);
assert(removed.changed, 'Hammer mode must remove an existing fence piece');
assert(!villageLife.isRanchFenceCell(removed.state.fencePieces, 5, 14), 'Removed fence must leave the world and collision map');
assert(!villageLife.removeRanchFencePiece(removed.state, 5, 14).changed, 'Removing empty ground must be a no-op');

const migrated = villageLife.normalizeVillageLifeState({
  ...initial,
  version: 1,
  products: { egg: 4, milk: 2, 'golden-egg': 1 },
  fencePieces: undefined,
});
assert(migrated.version === villageLife.VILLAGE_LIFE_SAVE_VERSION, 'Legacy ranch saves must migrate to the current version');
assert(migrated.products.egg === 4 && migrated.products.milk === 2, 'Fence migration must preserve ranch inventory');
assert(migrated.fencePieces.length === initial.fencePieces.length, 'Legacy ranch saves must receive the default editable fence layout');

const legacyV2FencePieces = [
  [10, 15], [11, 15], [12, 15], [13, 15], [14, 15],
  [10, 16], [14, 16], [10, 17], [14, 17],
  [10, 18], [11, 18], [12, 18, 'gate'], [13, 18], [14, 18],
].map(([x, y, kind = 'fence']) => ({ id: `ranch-fence-${x}-${y}`, x, y, kind }));
const migratedV2 = villageLife.normalizeVillageLifeState({
  ...initial,
  version: 2,
  products: { egg: 2, milk: 1, 'golden-egg': 0 },
  fencePieces: legacyV2FencePieces,
});
assert(migratedV2.version === villageLife.VILLAGE_LIFE_SAVE_VERSION, 'Version 2 ranch saves must migrate forward');
assert(migratedV2.products.egg === 2 && migratedV2.products.milk === 1, 'Version 2 migration must preserve ranch progress');
assert(villageLife.isRanchFenceCell(migratedV2.fencePieces, 5, 14), 'The old default pen must move to the composed village ranch zone');
assert(!villageLife.isRanchFenceCell(migratedV2.fencePieces, 10, 15), 'The obsolete default pen coordinates must be removed');

const reset = villageLife.clearRanchState(removed.state);
assert(reset.fencePieces.length === initial.fencePieces.length, 'RESET RANCH must restore the default fence layout');
assert(villageLife.isRanchFenceCell(reset.fencePieces, 5, 14), 'RESET RANCH must restore removed fence pieces');

assert(villageLife.isRanchAreaCell(7, 15), 'Ranch interior must remain protected from freeform tilling');
assert(villageLife.isRanchAreaCell(7, 17), 'The ranch gate tile must remain part of the protected ranch footprint');
assert(!villageLife.isRanchAreaCell(10, 15), 'Ground beside the ranch must remain available to other systems');

for (const phase of ['dawn', 'day', 'sunset']) {
  for (const frame of [0, 1]) {
    const positions = villageLife.ANIMAL_IDS.map((id) => ({ id, ...villageLife.getAnimalPosition(id, phase, frame) }));
    for (const position of positions) {
      assert(position.x >= 5.75 && position.x <= 8.25, `${position.id} must stay inside the ranch horizontally during ${phase}`);
      assert(position.y >= 14.75 && position.y <= 16.75, `${position.id} must stay inside the ranch vertically during ${phase}`);
      assert(!villageLife.isSolidRanchFenceCell(initial.fencePieces, Math.round(position.x), Math.round(position.y)), `${position.id} must not stand on a solid fence cell during ${phase}`);
    }
    for (let index = 0; index < positions.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < positions.length; otherIndex += 1) {
        const first = positions[index];
        const second = positions[otherIndex];
        assert(Math.hypot(first.x - second.x, first.y - second.y) >= 0.6, `${first.id} and ${second.id} must use distinct stable slots`);
      }
    }
  }
}

const dayPositions = Object.fromEntries(villageLife.ANIMAL_IDS.map((id) => [id, villageLife.getAnimalPosition(id, 'day', 0)]));
const lowestChicken = Math.max(dayPositions['chicken-1'].y, dayPositions['chicken-2'].y, dayPositions['chicken-3'].y);
const highestCow = Math.min(dayPositions['cow-1'].y, dayPositions['cow-2'].y);
assert(lowestChicken < highestCow, 'Chickens must occupy the upper row and cows the lower row');

const component = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
for (const marker of [
  'data-ranch-fence-system="editable-v1"',
  'data-ranch-fence-piece',
  'data-ranch-fence-target',
  'data-game-tool="fence-hammer"',
  'Digit6',
]) {
  assert(component.includes(marker), `Ranch fence integration marker missing: ${marker}`);
}
assert(
  component.includes("region === 'farm-village' && isSolidRanchFenceCell"),
  'Ranch fence collision must never leak into forest, coast, or mine regions',
);

console.log('ranch layout test passed: editable small fence pieces, migration, collision, reset, and hammer integration');
