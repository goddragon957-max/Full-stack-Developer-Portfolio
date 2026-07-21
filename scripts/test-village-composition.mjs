import { readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function importTypeScript(file) {
  const source = readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

function intersects(first, second) {
  return first.x < second.x + second.w
    && first.x + first.w > second.x
    && first.y < second.y + second.h
    && first.y + first.h > second.y;
}

const motion = await importTypeScript('src/game/npcMotion.ts');
const layout = await importTypeScript('src/game/villageLayout.ts');

const route = {
  start: { x: 3, y: 5 },
  end: { x: 4, y: 5 },
  idleFacing: 'down',
};
const poses = Array.from({ length: motion.NPC_PATROL_CYCLE_TICKS }, (_, tick) => motion.getNpcPatrolPose(route, tick));
const idlePoses = poses.filter((pose) => !pose.moving);
const movingPoses = poses.filter((pose) => pose.moving);

assert(idlePoses.length >= motion.NPC_PATROL_CYCLE_TICKS / 2, 'NPCs must spend at least half of each patrol cycle visibly resting');
assert(idlePoses.every((pose) => pose.frame === motion.NPC_IDLE_FRAME), 'Resting NPCs must use the centered idle frame');
assert(movingPoses.every((pose) => [0, 1, 2].includes(pose.frame)), 'Walking frames must stay within the authored three-frame set');
assert(movingPoses.some((pose) => pose.frame === 0) && movingPoses.some((pose) => pose.frame === 2), 'Walking must use both stride frames');
assert(poses.some((pose) => pose.moving && pose.facing === 'right'), 'Outbound patrol movement must face the travel direction');
assert(poses.some((pose) => pose.moving && pose.facing === 'left'), 'Return patrol movement must face the travel direction');

for (let index = 0; index < poses.length; index += 1) {
  const current = poses[index];
  const next = poses[(index + 1) % poses.length];
  assert(Math.hypot(current.x - next.x, current.y - next.y) <= 0.26, 'NPC patrol snapshots must move in small smooth increments');
}

const { farmhouse, workshop, hanaCottage, market, barn, junCottage } = layout.VILLAGE_BUILDING_LAYOUT;
const topRow = [farmhouse, workshop, hanaCottage, market];
assert(topRow.every((building) => building.y === topRow[0].y), 'All northern village frontages must share one baseline');
assert(workshop.x + workshop.w <= 11 && hanaCottage.x >= 14, 'The northern buildings must frame the three-tile mine avenue');
assert(barn.x < farmhouse.x + farmhouse.w, 'The barn must stay in the western ranch district near the farmhouse');
assert(market.x === hanaCottage.x + hanaCottage.w, 'The market must continue the northern main-street frontage');
assert(junCottage.x + junCottage.w <= 5 && junCottage.y >= 10, 'Jun cottage must anchor the southwest ranch district');
assert(junCottage.y + junCottage.h <= barn.y, 'Jun cottage must keep a readable yard before the barn');

const centralAvenue = { x: 0, y: 7, w: 32, h: 3 };
assert(topRow.every((building) => !intersects(building, centralAvenue)), 'Northern buildings must front the main avenue instead of sitting on it');

const topCenters = topRow.map((building) => building.x + building.w / 2);
assert(topCenters[0] < topCenters[1] && topCenters[1] < topCenters[2], 'Northern buildings must remain ordered west to east');

const junNightPatrol = layout.VILLAGE_NPC_PATROLS['rancher-jun'].night;
const junDoor = { x: junCottage.x + Math.floor(junCottage.w / 2), y: junCottage.y + junCottage.h };
assert(Math.hypot(junNightPatrol.start.x - junDoor.x, junNightPatrol.start.y - junDoor.y) <= 1, 'Jun must return to the ranch cottage at night');

const buildingRects = Object.entries(layout.VILLAGE_BUILDING_LAYOUT);
assert(layout.FARM_VILLAGE_BUILDING_RECTS.length === buildingRects.length, 'Collision rectangles must be derived from every placed building');
for (const [buildingId, building] of buildingRects) {
  assert(layout.FARM_VILLAGE_BUILDING_RECTS.some((rect) => (
    rect.x === building.x && rect.y === building.y && rect.w === building.w && rect.h === building.h
  )), `Missing collision rectangle for ${buildingId}`);
}

for (const [npcId, phases] of Object.entries(layout.VILLAGE_NPC_PATROLS)) {
  for (const [phase, patrol] of Object.entries(phases)) {
    assert(Math.hypot(patrol.start.x - patrol.end.x, patrol.start.y - patrol.end.y) <= 1, `${npcId} ${phase} patrol must stay local`);
    for (const point of [patrol.start, patrol.end]) {
      const footprint = { ...point, w: 1, h: 2 };
      assert(!buildingRects.some(([, building]) => intersects(footprint, building)), `${npcId} ${phase} patrol must not cross a building`);
    }
  }
}

for (const propId of ['mailbox', 'shippingBox', 'board']) {
  const prop = layout.VILLAGE_PROP_LAYOUT[propId];
  assert(!layout.FARM_VILLAGE_PATH_RECTS.some((road) => intersects(prop, road)), `${propId} must sit beside the road instead of blocking it`);
}

const oldBell = layout.VILLAGE_PROP_LAYOUT.oldBell;
assert(oldBell.x >= 11 && oldBell.x + oldBell.w <= 14, 'The old bell must be centered on the round plaza island');
assert(oldBell.y >= 5 && oldBell.y + oldBell.h <= 8, 'The old bell must stay inside the round plaza island');

console.log('village composition test passed: natural patrol cadence, aligned buildings, synced collision, and clear roads');
