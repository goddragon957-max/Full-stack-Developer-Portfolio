#!/usr/bin/env node
// Authoring source for the outdoor terrain masks in src/game/worldTerrain.ts.
//
// Large rectangular terrain (map borders, cliff shelves, forest blocks) is far
// easier to declare as rects than to type as 32-char rows, so it lives here and
// this script emits the rows to paste into REGION_TERRAIN_MASKS. Organic detail
// that no rect describes well (scattered trees, pond edges) is kept in the
// HAND_AUTHORED rows below and unioned in.
//
//   node scripts/build-terrain-masks.mjs            # print rows for every region
//   node scripts/build-terrain-masks.mjs whisper-forest
//
// Water is NOT encoded here: WORLD_WATER_ROWS stays the single source for water
// (fishing reads it too) and isRegionBlocked unions it separately. Building
// footprints are likewise excluded — they derive from villageLayout so buildings
// stay movable.
import { pathToFileURL } from 'node:url';

export const COLS = 32;
export const ROWS = 22;

// Rect terrain per region: borders and large blocks.
export const TERRAIN_RECTS = {
  'farm-village': [
    { x: 0, y: 0, w: 11, h: 1 }, { x: 14, y: 0, w: 18, h: 1 },
    { x: 0, y: 21, w: 32, h: 1 },
    { x: 0, y: 0, w: 1, h: 7 }, { x: 0, y: 10, w: 1, h: 12 },
    { x: 31, y: 0, w: 1, h: 22 },
  ],
  'whisper-forest': [
    { x: 0, y: 0, w: 12, h: 7 }, { x: 15, y: 0, w: 17, h: 7 },
    { x: 0, y: 21, w: 32, h: 1 }, { x: 0, y: 7, w: 1, h: 14 },
    { x: 31, y: 0, w: 1, h: 7 }, { x: 31, y: 10, w: 1, h: 11 },
    { x: 6, y: 10, w: 7, h: 5 }, { x: 16, y: 9, w: 8, h: 5 },
    { x: 15, y: 14, w: 17, h: 8 }, { x: 5, y: 17, w: 10, h: 5 },
  ],
  'river-coast': [
    { x: 0, y: 0, w: 32, h: 1 }, { x: 0, y: 21, w: 12, h: 1 }, { x: 15, y: 21, w: 17, h: 1 },
    { x: 0, y: 1, w: 1, h: 20 }, { x: 31, y: 1, w: 1, h: 12 }, { x: 31, y: 16, w: 1, h: 5 },
    { x: 23, y: 0, w: 9, h: 11 },
  ],
  'mine-foothill': [
    { x: 0, y: 0, w: 32, h: 2 }, { x: 0, y: 21, w: 11, h: 1 }, { x: 14, y: 21, w: 18, h: 1 },
    { x: 0, y: 2, w: 1, h: 11 }, { x: 0, y: 16, w: 1, h: 5 }, { x: 31, y: 2, w: 1, h: 19 },
    { x: 1, y: 2, w: 13, h: 10 }, { x: 24, y: 2, w: 7, h: 8 },
    { x: 19, y: 8, w: 12, h: 5 },
    { x: 1, y: 16, w: 10, h: 5 }, { x: 14, y: 16, w: 17, h: 5 },
  ],
};

// Organic cells checked by eye against the map art (see the overlay scripts).
// '#' blocked terrain, '~' pond/water surface, '.' clear.
export const HAND_AUTHORED = {
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
  'river-coast': [
    '................................',
    '................................',
    '................................',
    '...........##...................',
    '...........##...................',
    '................................',
    '...............##...............',
    '...............##...............',
    '........................##......',
    '........................##......',
    '................................',
    '...........................#####',
    '...........................#####',
    '................##.........#####',
    '................##..............',
    '####....................##.#####',
    '####.....##.............##.#####',
    '####.....##................#####',
    '####.......................#####',
    '####.......................#####',
    '############...#################',
    '############...#################',
  ],
};

export function buildMask(region) {
  const grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => '.'));
  const hand = HAND_AUTHORED[region];
  if (hand) {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = hand[y][x];
        if (cell !== '.') grid[y][x] = cell;
      }
    }
  }
  for (const rect of TERRAIN_RECTS[region] ?? []) {
    for (let y = rect.y; y < Math.min(ROWS, rect.y + rect.h); y += 1) {
      for (let x = rect.x; x < Math.min(COLS, rect.x + rect.w); x += 1) {
        if (grid[y][x] === '.') grid[y][x] = '#';
      }
    }
  }
  return grid.map((row) => row.join(''));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const only = process.argv[2];
  for (const region of Object.keys(TERRAIN_RECTS)) {
    if (only && region !== only) continue;
    console.log(`  '${region}': [`);
    for (const row of buildMask(region)) console.log(`    '${row}',`);
    console.log('  ],');
  }
}
