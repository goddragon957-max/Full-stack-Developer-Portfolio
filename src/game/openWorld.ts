import { FARM_VILLAGE_BUILDING_RECTS, FARM_VILLAGE_PATH_RECTS } from './villageLayout';
import {
  SEA_ROUTE_COLLISION_RECTS,
  SEA_ROUTE_MAP_ASSET,
  SEA_ROUTE_REGION_ID,
  isRiverCoastDockWalkable,
  isSeaRouteBlocked,
} from './seaRoute';
import { isTerrainMaskBlocked, isWorldWaterCell } from './worldTerrain';
import {
  WORLD_EXIT_BLUEPRINTS,
  WORLD_MAP_REGION_ORDER,
  WORLD_REGION_COORDINATES,
  WORLD_REGION_IDS,
  type WorldEdge,
  type WorldRegionId,
} from './worldComposition';

export type RegionId = WorldRegionId | typeof SEA_ROUTE_REGION_ID;
export type WorldDirection = WorldEdge;
export { WORLD_MAP_REGION_ORDER, WORLD_REGION_COORDINATES };

export type WorldPosition = {
  x: number;
  y: number;
  facing: WorldDirection;
};

export type RegionInfo = {
  label: string;
  shortLabel: string;
  description: string;
  mapAsset: string;
  tone: 'farm' | 'forest' | 'coast' | 'mine' | 'sea';
};

export type RegionExit = {
  id: string;
  from: RegionId;
  to: RegionId;
  edge: WorldDirection;
  cells: Array<{ x: number; y: number }>;
  arrival: WorldPosition;
};

export type OpenWorldState = {
  version: 1;
  currentRegion: RegionId;
  discovered: RegionId[];
  fastTravelUnlocked: RegionId[];
  positions: Record<RegionId, WorldPosition>;
  transitionCount: number;
};

export type RegionEntryResult = {
  state: OpenWorldState;
  firstVisit: boolean;
  worldExplorer: boolean;
};

export const OPEN_WORLD_STORAGE_KEY = 'portfolio-open-world-v1';
export const OPEN_WORLD_SAVE_VERSION = 1;
export const WORLD_WIDTH = 32;
export const WORLD_HEIGHT = 22;
export const REGION_TRANSITION_SWAP_MS = 360;

export const LAND_REGION_IDS: WorldRegionId[] = [...WORLD_REGION_IDS];
export const REGION_IDS: RegionId[] = [...LAND_REGION_IDS, SEA_ROUTE_REGION_ID];

export const REGION_INFO: Record<RegionId, RegionInfo> = {
  'farm-village': {
    label: 'Farm Village',
    shortLabel: 'FARM',
    description: '농사, 목장, 주민 의뢰가 이어지는 생활의 중심 마을.',
    mapAsset: '/assets/art-remaster-v1/maps/farm-village.png',
    tone: 'farm',
  },
  'whisper-forest': {
    label: 'Whisper Forest',
    shortLabel: 'FOREST',
    description: '개울과 오래된 다리 사이로 약초와 야생 열매가 자라는 숲.',
    mapAsset: '/assets/art-remaster-v1/maps/whisper-forest.png',
    tone: 'forest',
  },
  'river-coast': {
    label: 'River Coast',
    shortLabel: 'COAST',
    description: '강물이 바다와 만나는 곳. 낮과 밤의 어종이 달라진다.',
    mapAsset: '/assets/art-remaster-v1/maps/river-coast.png',
    tone: 'coast',
  },
  'mine-foothill': {
    label: 'Mine Foothill',
    shortLabel: 'MINE',
    description: '절벽 아래 광석과 희귀 수정이 드러난 조용한 광산 입구.',
    mapAsset: '/assets/art-remaster-v1/maps/mine-foothill.png',
    tone: 'mine',
  },
  'mossbell-sea': {
    label: 'Mossbell Sea',
    shortLabel: 'SEA ROUTE',
    description: '강변 선착장에서 작은 배를 타고 암초와 등대섬 사이를 누비는 항로.',
    mapAsset: SEA_ROUTE_MAP_ASSET,
    tone: 'sea',
  },
};

export const WORLD_GRAPH: Record<RegionId, RegionId[]> = Object.fromEntries(
  REGION_IDS.map((region) => [
    region,
    region === SEA_ROUTE_REGION_ID
      ? ['river-coast']
      : [
        ...WORLD_EXIT_BLUEPRINTS.filter((exit) => exit.region === region).map((exit) => exit.to),
        ...(region === 'river-coast' ? [SEA_ROUTE_REGION_ID] : []),
      ],
  ]),
) as Record<RegionId, RegionId[]>;

const cells = (axis: 'x' | 'y', fixed: number, from: number, to: number) => (
  Array.from({ length: to - from + 1 }, (_, index) => axis === 'x'
    ? { x: fixed, y: from + index }
    : { x: from + index, y: fixed })
);

export const REGION_EXITS: RegionExit[] = WORLD_EXIT_BLUEPRINTS.map((exit) => ({
  id: exit.id,
  from: exit.region,
  to: exit.to,
  edge: exit.edge,
  cells: exit.edge === 'left' || exit.edge === 'right'
    ? cells('x', exit.edge === 'left' ? 0 : WORLD_WIDTH - 1, exit.span.from, exit.span.to)
    : cells('y', exit.edge === 'up' ? 0 : WORLD_HEIGHT - 1, exit.span.from, exit.span.to),
  arrival: { ...exit.arrival },
}));

export const FAST_TRAVEL_POSTS: Partial<Record<RegionId, { x: number; y: number }>> = {
  'farm-village': { x: 16, y: 8 },
  'whisper-forest': { x: 8, y: 8 },
  'river-coast': { x: 15, y: 13 },
  'mine-foothill': { x: 15, y: 14 },
};

export const FAST_TRAVEL_ARRIVALS: Record<WorldRegionId, WorldPosition> = Object.fromEntries(
  LAND_REGION_IDS.map((region) => {
    const post = FAST_TRAVEL_POSTS[region]!;
    return [region, { x: Math.max(1, post.x - 1), y: post.y, facing: 'right' as const }];
  }),
) as Record<WorldRegionId, WorldPosition>;

const FOREST_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 12, h: 7 }, { x: 15, y: 0, w: 17, h: 7 },
  { x: 0, y: 21, w: 32, h: 1 }, { x: 0, y: 7, w: 1, h: 14 },
  { x: 31, y: 0, w: 1, h: 7 }, { x: 31, y: 10, w: 1, h: 11 },
  { x: 6, y: 10, w: 7, h: 5 }, { x: 16, y: 9, w: 8, h: 5 },
  { x: 15, y: 14, w: 17, h: 8 }, { x: 5, y: 17, w: 10, h: 5 },
];

const COAST_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 32, h: 1 }, { x: 0, y: 21, w: 12, h: 1 }, { x: 15, y: 21, w: 17, h: 1 },
  { x: 0, y: 1, w: 1, h: 20 }, { x: 31, y: 1, w: 1, h: 12 }, { x: 31, y: 16, w: 1, h: 5 },
  { x: 23, y: 0, w: 9, h: 11 },
];

const MINE_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 32, h: 2 }, { x: 0, y: 21, w: 11, h: 1 }, { x: 14, y: 21, w: 18, h: 1 },
  { x: 0, y: 2, w: 1, h: 11 }, { x: 0, y: 16, w: 1, h: 5 }, { x: 31, y: 2, w: 1, h: 19 },
  { x: 1, y: 2, w: 13, h: 10 }, { x: 24, y: 2, w: 7, h: 8 },
  { x: 19, y: 8, w: 12, h: 5 },
  { x: 1, y: 16, w: 10, h: 5 }, { x: 14, y: 16, w: 17, h: 5 },
];

const FARM_VILLAGE_SCENERY_RECTS = [
  { x: 0, y: 0, w: 11, h: 1 },
  { x: 14, y: 0, w: 18, h: 1 },
  { x: 0, y: 21, w: 32, h: 1 },
  { x: 0, y: 0, w: 1, h: 7 },
  { x: 0, y: 10, w: 1, h: 12 },
  { x: 31, y: 0, w: 1, h: 22 },
];

const FARM_BLOCKED_RECTS = [
  ...FARM_VILLAGE_SCENERY_RECTS,
  ...FARM_VILLAGE_BUILDING_RECTS,
];

export const REGION_COLLISION_RECTS: Record<RegionId, Array<{ x: number; y: number; w: number; h: number }>> = {
  'farm-village': FARM_BLOCKED_RECTS,
  'whisper-forest': FOREST_BLOCKED_RECTS,
  'river-coast': COAST_BLOCKED_RECTS,
  'mine-foothill': MINE_BLOCKED_RECTS,
  'mossbell-sea': [...SEA_ROUTE_COLLISION_RECTS],
};

export function createInitialOpenWorldState(): OpenWorldState {
  return {
    version: OPEN_WORLD_SAVE_VERSION,
    currentRegion: 'farm-village',
    discovered: ['farm-village'],
    fastTravelUnlocked: ['farm-village'],
    positions: {
      'farm-village': { x: 12, y: 3, facing: 'down' },
      'whisper-forest': { x: 29, y: 8, facing: 'left' },
      'river-coast': { x: 13, y: 19, facing: 'up' },
      'mine-foothill': { x: 2, y: 14, facing: 'right' },
      'mossbell-sea': { x: 7, y: 17, facing: 'right' },
    },
    transitionCount: 0,
  };
}

function isRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && REGION_IDS.includes(value as RegionId);
}

function normalizePosition(region: RegionId, value: unknown, fallback: WorldPosition): WorldPosition {
  if (!value || typeof value !== 'object') return fallback;
  const position = value as Partial<WorldPosition>;
  const candidateX = Number(position.x);
  const candidateY = Number(position.y);
  const facing = ['up', 'down', 'left', 'right'].includes(String(position.facing))
    ? position.facing as WorldDirection
    : fallback.facing;
  return getSafeRegionPosition(region, {
    x: Math.max(2, Math.min(WORLD_WIDTH - 3, Number.isFinite(candidateX) ? Math.floor(candidateX) : fallback.x)),
    y: Math.max(2, Math.min(WORLD_HEIGHT - 3, Number.isFinite(candidateY) ? Math.floor(candidateY) : fallback.y)),
    facing,
  }, fallback);
}

export function normalizeOpenWorldState(value: unknown): OpenWorldState {
  const initial = createInitialOpenWorldState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<OpenWorldState>;
  if (candidate.version !== OPEN_WORLD_SAVE_VERSION) return initial;
  const currentRegion = isRegionId(candidate.currentRegion) ? candidate.currentRegion : initial.currentRegion;
  const discovered = REGION_IDS.filter((region) => candidate.discovered?.includes(region));
  if (!discovered.includes('farm-village')) discovered.unshift('farm-village');
  if (!discovered.includes(currentRegion)) discovered.push(currentRegion);
  const fastTravelUnlocked = REGION_IDS.filter((region) => candidate.fastTravelUnlocked?.includes(region) && discovered.includes(region));
  if (!fastTravelUnlocked.includes('farm-village')) fastTravelUnlocked.unshift('farm-village');
  const positionCandidate = candidate.positions && typeof candidate.positions === 'object' ? candidate.positions : {};
  const positions = Object.fromEntries(REGION_IDS.map((region) => [
    region,
    normalizePosition(region, (positionCandidate as Partial<Record<RegionId, WorldPosition>>)[region], initial.positions[region]),
  ])) as Record<RegionId, WorldPosition>;
  return {
    version: OPEN_WORLD_SAVE_VERSION,
    currentRegion,
    discovered,
    fastTravelUnlocked,
    positions,
    transitionCount: Math.max(0, Math.floor(Number(candidate.transitionCount) || 0)),
  };
}

export function loadOpenWorldState(): OpenWorldState {
  if (typeof window === 'undefined') return createInitialOpenWorldState();
  try {
    const saved = window.localStorage.getItem(OPEN_WORLD_STORAGE_KEY);
    return saved ? normalizeOpenWorldState(JSON.parse(saved)) : createInitialOpenWorldState();
  } catch {
    return createInitialOpenWorldState();
  }
}

export function persistOpenWorldState(state: OpenWorldState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OPEN_WORLD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the current exploration session playable when storage is unavailable.
  }
}

export function getRegionExit(region: RegionId, position: { x: number; y: number }, direction: WorldDirection) {
  const nearEdge = direction === 'left'
    ? position.x <= 1
    : direction === 'right'
      ? position.x >= WORLD_WIDTH - 2
      : direction === 'up'
        ? position.y <= 1
        : position.y >= WORLD_HEIGHT - 2;
  if (!nearEdge) return null;
  return REGION_EXITS.find((exit) => exit.from === region
    && exit.edge === direction
    && exit.cells.some((cell) => direction === 'left' || direction === 'right'
      ? cell.y === position.y
      : cell.x === position.x)) ?? null;
}

export function enterRegion(state: OpenWorldState, exit: RegionExit): RegionEntryResult {
  const firstVisit = !state.discovered.includes(exit.to);
  const discovered = firstVisit ? [...state.discovered, exit.to] : state.discovered;
  const fastTravelUnlocked = state.fastTravelUnlocked.includes(exit.to)
    ? state.fastTravelUnlocked
    : [...state.fastTravelUnlocked, exit.to];
  const nextState: OpenWorldState = {
    ...state,
    currentRegion: exit.to,
    discovered,
    fastTravelUnlocked,
    positions: { ...state.positions, [exit.to]: getSafeRegionPosition(exit.to, exit.arrival) },
    transitionCount: state.transitionCount + 1,
  };
  return { state: nextState, firstVisit, worldExplorer: firstVisit && LAND_REGION_IDS.every((region) => discovered.includes(region)) };
}

export function enterSpecialRegion(state: OpenWorldState, region: RegionId, arrival: WorldPosition): RegionEntryResult {
  const firstVisit = !state.discovered.includes(region);
  const discovered = firstVisit ? [...state.discovered, region] : state.discovered;
  const nextState: OpenWorldState = {
    ...state,
    currentRegion: region,
    discovered,
    positions: { ...state.positions, [region]: getSafeRegionPosition(region, arrival) },
    transitionCount: state.transitionCount + 1,
  };
  return { state: nextState, firstVisit, worldExplorer: false };
}

export function rememberRegionPosition(state: OpenWorldState, position: WorldPosition): OpenWorldState {
  const previous = state.positions[state.currentRegion];
  if (previous.x === position.x && previous.y === position.y && previous.facing === position.facing) return state;
  return { ...state, positions: { ...state.positions, [state.currentRegion]: position } };
}

export function fastTravelTo(state: OpenWorldState, region: RegionId): OpenWorldState {
  if (!state.fastTravelUnlocked.includes(region) || region === SEA_ROUTE_REGION_ID) return state;
  return {
    ...state,
    currentRegion: region,
    positions: { ...state.positions, [region]: getSafeRegionPosition(region, FAST_TRAVEL_ARRIVALS[region]) },
    transitionCount: state.transitionCount + 1,
  };
}

export function isRegionBlocked(region: RegionId, x: number, y: number) {
  if (region === SEA_ROUTE_REGION_ID) return isSeaRouteBlocked(x, y);
  if (region === 'river-coast' && isRiverCoastDockWalkable(x, y)) return false;
  return isWorldWaterCell(region, x, y)
    || isTerrainMaskBlocked(region, x, y)
    || REGION_COLLISION_RECTS[region].some((rect) => (
      x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h
    ));
}

export function isFarmVillageTillableTerrain(x: number, y: number) {
  if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (isRegionBlocked('farm-village', x, y)) return false;
  return ![...FARM_VILLAGE_PATH_RECTS, ...FARM_VILLAGE_SCENERY_RECTS].some((rect) => (
    x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h
  ));
}

export function getSafeRegionPosition(region: RegionId, position: WorldPosition, fallback = createInitialOpenWorldState().positions[region]): WorldPosition {
  const origin = {
    x: Math.max(2, Math.min(WORLD_WIDTH - 3, Math.floor(position.x))),
    y: Math.max(2, Math.min(WORLD_HEIGHT - 3, Math.floor(position.y))),
    facing: position.facing,
  };
  if (!isRegionBlocked(region, origin.x, origin.y)) return origin;

  const maxRadius = WORLD_WIDTH + WORLD_HEIGHT;
  for (let radius = 1; radius <= maxRadius; radius += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const offsetY = radius - Math.abs(offsetX);
      for (const sign of offsetY === 0 ? [1] : [-1, 1]) {
        const x = origin.x + offsetX;
        const y = origin.y + offsetY * sign;
        if (x < 2 || x > WORLD_WIDTH - 3 || y < 2 || y > WORLD_HEIGHT - 3) continue;
        if (!isRegionBlocked(region, x, y)) return { x, y, facing: origin.facing };
      }
    }
  }
  return { ...fallback };
}

export function isNearFastTravelPost(region: RegionId, position: { x: number; y: number }, range = 1.8) {
  const post = FAST_TRAVEL_POSTS[region];
  if (!post) return false;
  return Math.hypot(position.x - post.x, position.y - post.y) <= range;
}
