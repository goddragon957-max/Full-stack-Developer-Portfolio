import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readRequired(path) {
  assert(existsSync(path), `Missing sea-route file: ${path}`);
  return readFileSync(path, 'utf8');
}

function readPngSize(path) {
  const image = readFileSync(path);
  assert(image.subarray(1, 4).toString('ascii') === 'PNG', `${path} must be a PNG`);
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

const moduleSource = readRequired('src/game/seaRoute.ts');
const compiled = ts.transpileModule(moduleSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  fileName: 'seaRoute.ts',
}).outputText;
const sea = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

assert(sea.SEA_ROUTE_REGION_ID === 'mossbell-sea', 'The ocean route needs a stable region id');
assert(sea.SEA_ROUTE_ENTRY.region === 'mossbell-sea', 'River Coast boarding must arrive in Mossbell Sea');
assert(sea.SEA_ROUTE_RETURN.region === 'river-coast', 'The sea return route must arrive at River Coast');
assert(!sea.isSeaRouteBlocked(sea.SEA_ROUTE_ENTRY.position.x, sea.SEA_ROUTE_ENTRY.position.y), 'Sea arrival water must be navigable');
assert(!sea.isSeaRouteBlocked(sea.SEA_ROUTE_RETURN_APPROACH.x, sea.SEA_ROUTE_RETURN_APPROACH.y), 'The return buoy approach must be navigable');
for (const rect of sea.SEA_ROUTE_COLLISION_RECTS) {
  assert(sea.isSeaRouteBlocked(rect.x, rect.y), `Sea obstacle ${rect.x},${rect.y} must block the boat`);
}

const mapPath = 'public/assets/sea-route-v1/maps/mossbell-sea.png';
const mapSize = readPngSize(mapPath);
assert(mapSize.width === 512 && mapSize.height === 352, 'Mossbell Sea map must stay at the 512x352 runtime resolution');

for (const direction of ['up', 'down', 'left', 'right']) {
  const asset = sea.SEA_ROUTE_BOAT_ASSETS[direction];
  assert(typeof asset === 'string' && asset.endsWith(`/boat-${direction}.png`), `Boat ${direction} needs a dedicated sprite`);
  const path = `public${asset}`;
  assert(existsSync(path), `Missing boat sprite: ${path}`);
  const size = readPngSize(path);
  assert(size.width <= 96 && size.height <= 96, `Boat ${direction} sprite must remain compact`);
}

const openWorld = readRequired('src/game/openWorld.ts');
const component = readRequired('src/components/MossbellFarmGame.tsx');
const seasonSystem = readRequired('src/game/seasonSystem.ts');
const worldRegions = readRequired('src/game/phaser/worldRegions.ts');

assert(openWorld.includes("WorldRegionId | typeof SEA_ROUTE_REGION_ID"), 'Open-world state must persist the sea as a special region');
assert(openWorld.includes('LAND_REGION_IDS.every'), 'WORLD EXPLORER must still require the four connected land regions only');
assert(!/WORLD_MAP_REGION_ORDER[^\n]*mossbell-sea/.test(openWorld), 'The sea route must not break the 2x2 land-map composition');
assert(seasonSystem.includes('SEA_ROUTE_MAP_ASSET'), 'Season map selection must use the invariant sea-route map');
assert(worldRegions.includes("'mossbell-sea': []"), 'Phaser region data must register the sea without land NPCs');
assert(component.includes("id: 'coastBoatDock'"), 'River Coast needs an in-world boarding interaction');
assert(component.includes("id: 'seaReturnBuoy'"), 'Mossbell Sea needs an in-world return interaction');
assert(component.includes('SEA_ROUTE_BOAT_ASSETS[player.facing]'), 'The farmer sprite must become a directional boat at sea');
assert(component.includes('enterSpecialRegion'), 'Boarding and returning must use persisted region transitions');
assert(component.includes('region-nameplate phaser-region-nameplate'), 'Phaser region labels must stay in screen space on narrow viewports');
assert(
  !/isFishingWaterCell\(x, y, region\)\s*\|\|\s*isRegionBlocked\(region, x, y\)/.test(component),
  'Movement collision must not re-block dock deck overrides with the fishing-water predicate',
);

console.log('sea route test passed: dock boarding, navigable ocean, reef collision, directional boat, and River Coast return');
