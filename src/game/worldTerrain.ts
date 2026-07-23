import type { WorldRegionId } from './worldComposition';

export type WorldWaterRow = {
  y: number;
  ranges: ReadonlyArray<readonly [number, number]>;
};

export const WORLD_WATER_ROWS: Partial<Record<WorldRegionId, readonly WorldWaterRow[]>> = {
  'farm-village': [
    { y: 13, ranges: [[15, 16]] }, { y: 14, ranges: [[13, 16]] },
    { y: 15, ranges: [[12, 17]] }, { y: 16, ranges: [[12, 17]] },
    { y: 17, ranges: [[12, 16]] }, { y: 18, ranges: [[14, 14]] },
  ],
  'river-coast': [
    { y: 0, ranges: [[0, 10], [19, 20]] }, { y: 1, ranges: [[0, 9], [17, 18]] },
    { y: 2, ranges: [[0, 2], [4, 9], [17, 18]] }, { y: 3, ranges: [[0, 8], [17, 18]] },
    { y: 4, ranges: [[0, 9], [17, 18]] }, { y: 5, ranges: [[0, 9], [18, 19]] },
    { y: 6, ranges: [[0, 8], [19, 20]] }, { y: 7, ranges: [[0, 8], [19, 21]] },
    { y: 8, ranges: [[0, 4], [7, 9], [20, 22]] }, { y: 9, ranges: [[0, 6], [8, 8], [19, 21]] },
    { y: 10, ranges: [[0, 7], [18, 20]] }, { y: 11, ranges: [[0, 5], [15, 19]] },
    { y: 12, ranges: [[0, 1], [14, 17]] }, { y: 13, ranges: [[0, 3], [12, 12], [14, 15]] },
    { y: 14, ranges: [[0, 2], [9, 12]] }, { y: 15, ranges: [[8, 11]] },
    { y: 16, ranges: [[8, 10]] }, { y: 17, ranges: [[7, 9]] },
    { y: 18, ranges: [[6, 8]] }, { y: 19, ranges: [[5, 7]] }, { y: 20, ranges: [[5, 6]] },
  ],
  'whisper-forest': [
    { y: 1, ranges: [[17, 17]] }, { y: 2, ranges: [[17, 17]] }, { y: 3, ranges: [[17, 17]] },
    { y: 4, ranges: [[17, 18]] }, { y: 5, ranges: [[18, 18]] }, { y: 6, ranges: [[17, 18]] },
    { y: 7, ranges: [[15, 17]] }, { y: 9, ranges: [[14, 15]] }, { y: 10, ranges: [[13, 14]] },
    { y: 11, ranges: [[12, 13]] }, { y: 12, ranges: [[10, 12]] },
    { y: 13, ranges: [[7, 8], [10, 10]] }, { y: 14, ranges: [[6, 7]] },
    { y: 15, ranges: [[4, 6]] }, { y: 16, ranges: [[3, 5]] }, { y: 17, ranges: [[3, 4]] },
    { y: 18, ranges: [[3, 4]] }, { y: 19, ranges: [[3, 4]] }, { y: 20, ranges: [[2, 3]] },
    { y: 21, ranges: [[2, 3]] },
  ],
};

// Per-tile terrain masks derived from the baked 32x22 map art (16px tiles).
// '#' = blocked terrain (trees/forest), '~' = water, '.' = walkable ground.
// Buildings, fences and animals are sprites with their own collision, so a mask
// only encodes what is painted into the terrain PNG. Authoring/verification
// workflow: scripts/generate-region-collision-mask.py renders the mask over the
// map image (scripts/_mask-debug.png) so every cell can be checked by eye.
export const REGION_TERRAIN_MASKS: Partial<Record<WorldRegionId, readonly string[]>> = {
  'farm-village': [
    '#..........................#####',
    '#...........................####',
    '.............................###',
    '..............................##',
    '..............................##',
    '...............................#',
    '...............................#',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '...............~~...............',
    '.............~~~~...............',
    '............~~~~~~..............',
    '............~~~~~~..............',
    '............~~~~~...............',
    '##............~.................',
    '###..........................###',
    '################################',
    '################################',
  ],
  // v1: forest borders the coarse rects miss (left/bottom/right pine walls).
  // Gate arrivals kept open: {13,19} from forest, {29,14} from mine, down-gate
  // x12-14. Scattered mid-grass trees deferred to a later polish pass.
  // Source spec: scripts/build-coast-mask.py (declare rects -> emit + overlay).
  'river-coast': [
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '...........................#####',
    '...........................#####',
    '...........................#####',
    '................................',
    '####.......................#####',
    '####.......................#####',
    '####.......................#####',
    '####.......................#####',
    '####.......................#####',
    '############...#################',
    '############...#################',
  ],
};

for (const [region, rows] of Object.entries(REGION_TERRAIN_MASKS)) {
  if (rows.length !== 22 || rows.some((row) => row.length !== 32)) {
    throw new Error(`Terrain mask for ${region} must be exactly 32x22 cells.`);
  }
}

export function isTerrainMaskBlocked(region: WorldRegionId, x: number, y: number) {
  const cell = REGION_TERRAIN_MASKS[region]?.[y]?.[x];
  return cell === '#' || cell === '~';
}

export function isWorldWaterCell(region: WorldRegionId, x: number, y: number) {
  return WORLD_WATER_ROWS[region]?.find((row) => row.y === y)?.ranges
    .some(([from, to]) => x >= from && x <= to) ?? false;
}

export function getWorldWaterCells(region: WorldRegionId) {
  return (WORLD_WATER_ROWS[region] ?? []).flatMap((row) => row.ranges.flatMap(([from, to]) => (
    Array.from({ length: to - from + 1 }, (_, index) => ({ x: from + index, y: row.y }))
  )));
}
