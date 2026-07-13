export type RegionId = 'farm-village' | 'whisper-forest' | 'river-coast' | 'mine-foothill';
export type WorldDirection = 'up' | 'down' | 'left' | 'right';

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
  tone: 'farm' | 'forest' | 'coast' | 'mine';
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

export const REGION_IDS: RegionId[] = ['farm-village', 'whisper-forest', 'river-coast', 'mine-foothill'];

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
};

export const WORLD_GRAPH: Record<RegionId, RegionId[]> = {
  'farm-village': ['whisper-forest', 'mine-foothill'],
  'whisper-forest': ['farm-village', 'river-coast'],
  'river-coast': ['whisper-forest', 'mine-foothill'],
  'mine-foothill': ['river-coast', 'farm-village'],
};

const cells = (axis: 'x' | 'y', fixed: number, from: number, to: number) => (
  Array.from({ length: to - from + 1 }, (_, index) => axis === 'x'
    ? { x: fixed, y: from + index }
    : { x: from + index, y: fixed })
);

export const REGION_EXITS: RegionExit[] = [
  { id: 'village-east', from: 'farm-village', to: 'whisper-forest', edge: 'right', cells: cells('x', 31, 7, 9), arrival: { x: 2, y: 11, facing: 'right' } },
  { id: 'forest-west', from: 'whisper-forest', to: 'farm-village', edge: 'left', cells: cells('x', 0, 9, 12), arrival: { x: 29, y: 8, facing: 'left' } },
  { id: 'forest-north', from: 'whisper-forest', to: 'river-coast', edge: 'up', cells: cells('y', 0, 16, 18), arrival: { x: 18, y: 19, facing: 'up' } },
  { id: 'coast-south', from: 'river-coast', to: 'whisper-forest', edge: 'down', cells: cells('y', 21, 17, 19), arrival: { x: 17, y: 2, facing: 'down' } },
  { id: 'coast-east', from: 'river-coast', to: 'mine-foothill', edge: 'right', cells: cells('x', 31, 3, 6), arrival: { x: 2, y: 5, facing: 'right' } },
  { id: 'mine-west', from: 'mine-foothill', to: 'river-coast', edge: 'left', cells: cells('x', 0, 4, 7), arrival: { x: 29, y: 5, facing: 'left' } },
  { id: 'mine-south', from: 'mine-foothill', to: 'farm-village', edge: 'down', cells: cells('y', 21, 15, 17), arrival: { x: 8, y: 2, facing: 'down' } },
  { id: 'village-north', from: 'farm-village', to: 'mine-foothill', edge: 'up', cells: cells('y', 0, 7, 9), arrival: { x: 16, y: 19, facing: 'up' } },
];

export const FAST_TRAVEL_POSTS: Record<RegionId, { x: number; y: number }> = {
  'farm-village': { x: 29, y: 13 },
  'whisper-forest': { x: 3, y: 11 },
  'river-coast': { x: 16, y: 18 },
  'mine-foothill': { x: 4, y: 5 },
};

export const FAST_TRAVEL_ARRIVALS: Record<RegionId, WorldPosition> = Object.fromEntries(
  REGION_IDS.map((region) => [region, { x: Math.max(1, FAST_TRAVEL_POSTS[region].x - 1), y: FAST_TRAVEL_POSTS[region].y, facing: 'right' as const }]),
) as Record<RegionId, WorldPosition>;

const FOREST_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 16, h: 1 }, { x: 19, y: 0, w: 13, h: 1 },
  { x: 0, y: 21, w: 32, h: 1 }, { x: 0, y: 1, w: 1, h: 8 }, { x: 0, y: 13, w: 1, h: 8 },
  { x: 31, y: 1, w: 1, h: 20 }, { x: 20, y: 1, w: 3, h: 8 }, { x: 20, y: 13, w: 3, h: 8 },
  { x: 4, y: 3, w: 4, h: 3 }, { x: 25, y: 4, w: 4, h: 4 }, { x: 4, y: 15, w: 5, h: 4 },
];

const COAST_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 32, h: 1 }, { x: 0, y: 21, w: 17, h: 1 }, { x: 20, y: 21, w: 12, h: 1 },
  { x: 0, y: 1, w: 1, h: 20 }, { x: 31, y: 1, w: 1, h: 2 }, { x: 31, y: 7, w: 1, h: 14 },
  { x: 19, y: 1, w: 4, h: 3 }, { x: 19, y: 7, w: 4, h: 3 }, { x: 19, y: 13, w: 4, h: 8 },
  { x: 23, y: 8, w: 9, h: 13 }, { x: 5, y: 4, w: 4, h: 3 },
];

const MINE_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 32, h: 2 }, { x: 0, y: 21, w: 14, h: 1 }, { x: 18, y: 21, w: 14, h: 1 },
  { x: 0, y: 2, w: 1, h: 2 }, { x: 0, y: 8, w: 1, h: 13 }, { x: 31, y: 2, w: 1, h: 19 },
  { x: 11, y: 2, w: 10, h: 5 }, { x: 4, y: 10, w: 5, h: 4 }, { x: 24, y: 10, w: 5, h: 5 },
  { x: 10, y: 17, w: 4, h: 3 }, { x: 20, y: 17, w: 4, h: 3 },
];

const FARM_BLOCKED_RECTS = [
  { x: 3, y: 2, w: 4, h: 4 },
  { x: 12, y: 2, w: 5, h: 4 },
  { x: 20, y: 2, w: 4, h: 4 },
  { x: 24, y: 8, w: 4, h: 4 },
  { x: 4, y: 17, w: 4, h: 4 },
  { x: 27, y: 17, w: 4, h: 4 },
  { x: 23, y: 14, w: 7, h: 6 },
];

export const REGION_COLLISION_RECTS: Record<RegionId, Array<{ x: number; y: number; w: number; h: number }>> = {
  'farm-village': FARM_BLOCKED_RECTS,
  'whisper-forest': FOREST_BLOCKED_RECTS,
  'river-coast': COAST_BLOCKED_RECTS,
  'mine-foothill': MINE_BLOCKED_RECTS,
};

export function createInitialOpenWorldState(): OpenWorldState {
  return {
    version: OPEN_WORLD_SAVE_VERSION,
    currentRegion: 'farm-village',
    discovered: ['farm-village'],
    fastTravelUnlocked: ['farm-village'],
    positions: {
      'farm-village': { x: 9, y: 7, facing: 'left' },
      'whisper-forest': { x: 2, y: 11, facing: 'right' },
      'river-coast': { x: 18, y: 19, facing: 'up' },
      'mine-foothill': { x: 2, y: 5, facing: 'right' },
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
  return { state: nextState, firstVisit, worldExplorer: firstVisit && discovered.length === REGION_IDS.length };
}

export function rememberRegionPosition(state: OpenWorldState, position: WorldPosition): OpenWorldState {
  const previous = state.positions[state.currentRegion];
  if (previous.x === position.x && previous.y === position.y && previous.facing === position.facing) return state;
  return { ...state, positions: { ...state.positions, [state.currentRegion]: position } };
}

export function fastTravelTo(state: OpenWorldState, region: RegionId): OpenWorldState {
  if (!state.fastTravelUnlocked.includes(region)) return state;
  return {
    ...state,
    currentRegion: region,
    positions: { ...state.positions, [region]: getSafeRegionPosition(region, FAST_TRAVEL_ARRIVALS[region]) },
    transitionCount: state.transitionCount + 1,
  };
}

export function isRegionBlocked(region: RegionId, x: number, y: number) {
  return REGION_COLLISION_RECTS[region].some((rect) => (
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
  return Math.hypot(position.x - post.x, position.y - post.y) <= range;
}
