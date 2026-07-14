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

for (let x = 10; x <= 14; x += 1) {
  assert(villageLife.isRanchFenceCell(x, 15), `Ranch top fence must block ${x},15`);
}
for (const y of [16, 17]) {
  assert(villageLife.isRanchFenceCell(10, y), `Ranch left fence must block 10,${y}`);
  assert(villageLife.isRanchFenceCell(14, y), `Ranch right fence must block 14,${y}`);
}
for (const x of [10, 11, 13, 14]) {
  assert(villageLife.isRanchFenceCell(x, 18), `Ranch lower rail must block ${x},18`);
}
assert(!villageLife.isRanchFenceCell(12, 18), 'Ranch center gate cell 12,18 must remain walkable');
assert(!villageLife.isRanchFenceCell(12, 21), 'Ranch collision must not remain shifted below the painted pen');

for (const phase of ['dawn', 'day', 'sunset']) {
  for (const frame of [0, 1]) {
    const positions = villageLife.ANIMAL_IDS.map((id) => ({ id, ...villageLife.getAnimalPosition(id, phase, frame) }));
    for (const position of positions) {
      assert(position.x >= 10.75 && position.x <= 13.25, `${position.id} must stay inside the ranch horizontally during ${phase}`);
      assert(position.y >= 15.75 && position.y <= 17.25, `${position.id} must stay inside the ranch vertically during ${phase}`);
      assert(!villageLife.isRanchFenceCell(Math.round(position.x), Math.round(position.y)), `${position.id} must not stand on a fence cell during ${phase}`);
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

console.log('ranch layout test passed: painted fence alignment, open gate, interior animal slots, stable spacing');
