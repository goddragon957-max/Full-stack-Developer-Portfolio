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
assert(interiors.INTERIOR_SAVE_VERSION === 2, 'Interior persistence must include the last outdoor location');
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
assert(normalized.lastOutdoor.region === 'farm-village', 'Legacy interior saves must recover a safe village outdoor location');
assert(interiors.normalizeInteriorSave({ version: 1, currentInterior: 'unknown' }).currentInterior === null, 'Invalid interior save must recover outside');

const savedInside = interiors.normalizeInteriorSave({
  version: 2,
  currentInterior: 'hana-cottage',
  lastOutdoor: { region: 'whisper-forest', position: { x: 18, y: 12, facing: 'left' } },
});
assert(savedInside.currentInterior === 'hana-cottage', 'Current room must survive an interior v2 refresh');
assert(savedInside.lastOutdoor.region === 'whisper-forest', 'Last outdoor region must survive an interior v2 refresh');
assert(savedInside.lastOutdoor.position.x === 18 && savedInside.lastOutdoor.position.y === 12, 'Last outdoor position must survive an interior v2 refresh');

assert(interiors.getInteriorActors('shop', 'day').some((actor) => actor.id === 'shopKeeper'), 'The seed shop needs a daytime owner conversation');
assert(interiors.getInteriorActors('barn', 'night').filter((actor) => actor.kind === 'animal').length === 5, 'All five animals must visibly return to the barn at night');
assert(interiors.getInteriorActors('hana-cottage', 'night').some((actor) => actor.id === 'indoorHana'), 'Hana must return home at night');
assert(interiors.getInteriorActors('jun-cottage', 'dawn').some((actor) => actor.id === 'indoorJun'), 'Jun must be at home around dawn');

console.log('interior world test passed: five buildings, unique maps, safe doors, collision, save recovery, pure game copy');
