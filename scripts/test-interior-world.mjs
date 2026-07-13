import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const path = 'src/game/interiorWorld.ts';
assert(existsSync(path), 'interiorWorld.ts must define the building interior domain');
const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: 'interiorWorld.ts',
}).outputText;
const interiors = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

assert(interiors.INTERIOR_IDS.length === 5, 'Exactly five major village interiors must be available');
const expectedBuildings = {
  farmhouse: 'farmhouse',
  workshop: 'shop',
  barn: 'barn',
  hanaCottage: 'hana-cottage',
  junCottage: 'jun-cottage',
};

for (const [buildingId, interiorId] of Object.entries(expectedBuildings)) {
  assert(interiors.getInteriorIdForBuilding(buildingId) === interiorId, `${buildingId} must enter ${interiorId}`);
  const info = interiors.INTERIOR_INFO[interiorId];
  assert(existsSync(`public${info.mapAsset}`), `${interiorId} runtime map must exist`);
  assert(info.interactions.length >= 3, `${interiorId} needs meaningful room interactions`);
  assert(info.interactions.some((interaction) => interaction.kind === 'exit'), `${interiorId} needs an exit interaction`);
  assert(!interiors.isInteriorBlocked(interiorId, info.entry.x, info.entry.y), `${interiorId} entry must be walkable`);
  assert(!interiors.isInteriorBlocked(interiorId, 11, 14), `${interiorId} exit mat must be walkable`);
  assert(info.outsideReturn.x >= 0 && info.outsideReturn.x < 32, `${interiorId} outside return x must be safe`);
  assert(info.outsideReturn.y >= 0 && info.outsideReturn.y < 22, `${interiorId} outside return y must be safe`);
}

const forbidden = /portfolio|react|typescript|\bbim\b|backend|frontend|server|skill|project|contact|resume/i;
assert(!forbidden.test(JSON.stringify(interiors.INTERIOR_INFO)), 'Interior copy must contain only in-world game language');

const normalized = interiors.normalizeInteriorSave({ version: 1, currentInterior: 'shop' });
assert(normalized.currentInterior === 'shop', 'Valid interior save must restore');
assert(interiors.normalizeInteriorSave({ version: 1, currentInterior: 'unknown' }).currentInterior === null, 'Invalid interior save must recover outside');

console.log('interior world test passed: five buildings, unique maps, safe doors, collision, save recovery, pure game copy');
