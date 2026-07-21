export type WorldRegionId = 'farm-village' | 'whisper-forest' | 'river-coast' | 'mine-foothill';
export type WorldEdge = 'up' | 'down' | 'left' | 'right';

export type WorldGridPoint = {
  x: number;
  y: number;
};

export type WorldArrival = WorldGridPoint & {
  facing: WorldEdge;
};

export type WorldGate = {
  id: string;
  region: WorldRegionId;
  to: WorldRegionId;
  edge: WorldEdge;
  span: { from: number; to: number };
  arrival: WorldArrival;
};

export type WorldSeam = {
  id: string;
  first: WorldGate;
  second: WorldGate;
};

export const WORLD_REGION_IDS: WorldRegionId[] = [
  'farm-village',
  'whisper-forest',
  'river-coast',
  'mine-foothill',
];

// This order is also the visual order of the 2x2 world-map grid.
export const WORLD_MAP_REGION_ORDER: WorldRegionId[] = [
  'river-coast',
  'mine-foothill',
  'whisper-forest',
  'farm-village',
];

export const WORLD_REGION_COORDINATES: Record<WorldRegionId, WorldGridPoint> = {
  'river-coast': { x: 0, y: 0 },
  'mine-foothill': { x: 1, y: 0 },
  'whisper-forest': { x: 0, y: 1 },
  'farm-village': { x: 1, y: 1 },
};

export const WORLD_SEAMS: WorldSeam[] = [
  {
    id: 'forest-coast',
    first: {
      id: 'forest-north',
      region: 'whisper-forest',
      to: 'river-coast',
      edge: 'up',
      span: { from: 12, to: 14 },
      arrival: { x: 13, y: 19, facing: 'up' },
    },
    second: {
      id: 'coast-south',
      region: 'river-coast',
      to: 'whisper-forest',
      edge: 'down',
      span: { from: 12, to: 14 },
      arrival: { x: 13, y: 2, facing: 'down' },
    },
  },
  {
    id: 'coast-mine',
    first: {
      id: 'coast-east',
      region: 'river-coast',
      to: 'mine-foothill',
      edge: 'right',
      span: { from: 13, to: 15 },
      arrival: { x: 2, y: 14, facing: 'right' },
    },
    second: {
      id: 'mine-west',
      region: 'mine-foothill',
      to: 'river-coast',
      edge: 'left',
      span: { from: 13, to: 15 },
      arrival: { x: 29, y: 14, facing: 'left' },
    },
  },
  {
    id: 'mine-village',
    first: {
      id: 'mine-south',
      region: 'mine-foothill',
      to: 'farm-village',
      edge: 'down',
      span: { from: 11, to: 13 },
      arrival: { x: 12, y: 2, facing: 'down' },
    },
    second: {
      id: 'village-north',
      region: 'farm-village',
      to: 'mine-foothill',
      edge: 'up',
      span: { from: 11, to: 13 },
      arrival: { x: 12, y: 19, facing: 'up' },
    },
  },
  {
    id: 'village-forest',
    first: {
      id: 'village-west',
      region: 'farm-village',
      to: 'whisper-forest',
      edge: 'left',
      span: { from: 7, to: 9 },
      arrival: { x: 29, y: 8, facing: 'left' },
    },
    second: {
      id: 'forest-east',
      region: 'whisper-forest',
      to: 'farm-village',
      edge: 'right',
      span: { from: 7, to: 9 },
      arrival: { x: 2, y: 8, facing: 'right' },
    },
  },
];

export const WORLD_EXIT_BLUEPRINTS: WorldGate[] = WORLD_SEAMS.flatMap((seam) => [seam.first, seam.second]);
