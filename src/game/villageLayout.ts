import type { NpcPatrolRoute } from './npcMotion';

export type VillageGridRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VillageNpcId = 'villageKeeper' | 'farmer-hana' | 'rancher-jun';
export type VillagePhase = 'dawn' | 'day' | 'sunset' | 'night';

export const VILLAGE_BUILDING_LAYOUT = {
  farmhouse: { x: 2, y: 1, w: 4, h: 4 },
  workshop: { x: 6, y: 1, w: 5, h: 4 },
  hanaCottage: { x: 16, y: 1, w: 4, h: 4 },
  market: { x: 20, y: 1, w: 4, h: 4 },
  barn: { x: 1, y: 16, w: 4, h: 4 },
  junCottage: { x: 1, y: 10, w: 4, h: 4 },
} as const satisfies Record<string, VillageGridRect>;

export const VILLAGE_PROP_LAYOUT = {
  board: { x: 16, y: 12, w: 2, h: 2 },
  mailbox: { x: 5, y: 6, w: 1, h: 1 },
  oldBell: { x: 12, y: 5, w: 2, h: 2 },
  shippingBox: { x: 1, y: 14, w: 2, h: 2 },
  cropPatch: { x: 21, y: 10, w: 5, h: 4 },
} as const satisfies Record<string, VillageGridRect>;

export const FARM_VILLAGE_BUILDING_RECTS: VillageGridRect[] = Object.values(VILLAGE_BUILDING_LAYOUT)
  .map((rect) => ({ ...rect }));

export const FARM_VILLAGE_PATH_RECTS: VillageGridRect[] = [
  { x: 11, y: 0, w: 3, h: 9 },
  { x: 0, y: 7, w: 12, h: 3 },
  { x: 10, y: 7, w: 7, h: 5 },
  { x: 16, y: 8, w: 16, h: 3 },
  { x: 18, y: 10, w: 2, h: 12 },
  { x: 19, y: 13, w: 13, h: 2 },
  { x: 19, y: 18, w: 13, h: 2 },
];

export const VILLAGE_NPC_PATROLS: Record<VillageNpcId, Record<VillagePhase, NpcPatrolRoute>> = {
  villageKeeper: {
    dawn: { start: { x: 14, y: 8 }, end: { x: 15, y: 8 }, idleFacing: 'down', tickOffset: 4 },
    day: { start: { x: 14, y: 11 }, end: { x: 15, y: 11 }, idleFacing: 'down', tickOffset: 4 },
    sunset: { start: { x: 11, y: 11 }, end: { x: 12, y: 11 }, idleFacing: 'left', tickOffset: 4 },
    night: { start: { x: 11, y: 7 }, end: { x: 12, y: 7 }, idleFacing: 'up', tickOffset: 4 },
  },
  'farmer-hana': {
    dawn: { start: { x: 21, y: 12 }, end: { x: 22, y: 12 }, idleFacing: 'down' },
    day: { start: { x: 25, y: 12 }, end: { x: 26, y: 12 }, idleFacing: 'down' },
    sunset: { start: { x: 23, y: 17 }, end: { x: 24, y: 17 }, idleFacing: 'up' },
    night: { start: { x: 17, y: 6 }, end: { x: 18, y: 6 }, idleFacing: 'up' },
  },
  'rancher-jun': {
    dawn: { start: { x: 5, y: 13 }, end: { x: 5, y: 14 }, idleFacing: 'right', tickOffset: 8 },
    day: { start: { x: 10, y: 15 }, end: { x: 10, y: 16 }, idleFacing: 'left', tickOffset: 8 },
    sunset: { start: { x: 5, y: 18 }, end: { x: 5, y: 19 }, idleFacing: 'left', tickOffset: 8 },
    night: { start: { x: 3, y: 14 }, end: { x: 4, y: 14 }, idleFacing: 'up', tickOffset: 8 },
  },
};
