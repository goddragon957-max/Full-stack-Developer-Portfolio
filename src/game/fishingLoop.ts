import type { RegionId } from './openWorld';
import type { DayPhase } from './villagePulse';
import type { Season } from './seasonSystem';
import { FISH_SPRITES } from './animationCatalog';

export type FishingStatus = 'idle' | 'casting' | 'waiting' | 'bite' | 'success' | 'escaped';
export type FishId = 'bluegill' | 'carp' | 'perch' | 'koi' | 'moonfin' | 'river-trout' | 'silver-dace' | 'night-eel' | 'shore-sardine' | 'coral-bream' | 'tide-ray' | 'blossom-dace' | 'sunscale-bass' | 'ember-carp' | 'frostfin';
export type FishRarity = 'common' | 'rare' | 'moon';
export type FishHabitat = 'pond' | 'river' | 'coast';

export type FishingSpot = {
  id: string;
  region: 'farm-village' | 'river-coast';
  habitat: FishHabitat;
  standX: number;
  standY: number;
  bobberX: number;
  bobberY: number;
  facing: 'up' | 'right' | 'down' | 'left';
};

type FishingPlayer = {
  x: number;
  y: number;
  facing: FishingSpot['facing'];
};

export type FishingState = {
  version: 3;
  inventory: Record<FishId, number>;
  discovered: FishId[];
  totalCaught: number;
  firstCaught: boolean;
  lastCaught: FishId | null;
};

export type CatchResult = {
  state: FishingState;
  firstCatch: boolean;
  firstOfType: boolean;
  rareCatch: boolean;
};

export const FISHING_STORAGE_KEY = 'portfolio-fishing-loop-v1';
export const FISHING_SAVE_VERSION = 3;
export const FISHING_CAST_MS = 420;
export const FISHING_BITE_MIN_MS = 650;
export const FISHING_BITE_MAX_MS = 1_100;
export const FISHING_BITE_WINDOW_MS = 850;
export const FISHING_RESULT_MS = 1_200;

export const FISH_IDS: FishId[] = ['bluegill', 'carp', 'perch', 'koi', 'moonfin', 'river-trout', 'silver-dace', 'night-eel', 'shore-sardine', 'coral-bream', 'tide-ray', 'blossom-dace', 'sunscale-bass', 'ember-carp', 'frostfin'];

export const FISH_INFO: Record<FishId, {
  label: string;
  shortLabel: string;
  description: string;
  rarity: FishRarity;
  habitat: FishHabitat;
  nightOnly: boolean;
  season?: Season;
  dayWeight: number;
  nightWeight: number;
  asset: string;
}> = {
  bluegill: { label: '파랑붕어', shortLabel: 'BLUE', description: '맑은 낮의 얕은 연못에서 자주 보이는 작은 물고기.', rarity: 'common', habitat: 'pond', nightOnly: false, dayWeight: 40, nightWeight: 24, asset: FISH_SPRITES.bluegill },
  carp: { label: '황금잉어', shortLabel: 'CARP', description: '연못 바닥을 천천히 돌며 묵직하게 입질하는 물고기.', rarity: 'common', habitat: 'pond', nightOnly: false, dayWeight: 30, nightWeight: 26, asset: FISH_SPRITES.carp },
  perch: { label: '줄무늬농어', shortLabel: 'PERCH', description: '수초 가장자리를 빠르게 오가는 줄무늬 물고기.', rarity: 'common', habitat: 'pond', nightOnly: false, dayWeight: 24, nightWeight: 25, asset: FISH_SPRITES.perch },
  koi: { label: '비단잉어', shortLabel: 'KOI', description: '붉고 흰 무늬가 선명한 희귀 연못 물고기.', rarity: 'rare', habitat: 'pond', nightOnly: false, dayWeight: 6, nightWeight: 15, asset: FISH_SPRITES.koi },
  moonfin: { label: '월광어', shortLabel: 'MOON', description: '밤의 별빛 아래 연못에서만 모습을 드러내는 신비한 물고기.', rarity: 'moon', habitat: 'pond', nightOnly: true, dayWeight: 0, nightWeight: 10, asset: FISH_SPRITES.moonfin },
  'river-trout': { label: '강송어', shortLabel: 'TROUT', description: '차가운 강물의 빠른 흐름을 거슬러 오르는 물고기.', rarity: 'common', habitat: 'river', nightOnly: false, dayWeight: 45, nightWeight: 30, asset: FISH_SPRITES['river-trout'] },
  'silver-dace': { label: '은빛피라미', shortLabel: 'DACE', description: '다리 아래 햇빛을 반사하며 무리 지어 움직이는 작은 물고기.', rarity: 'common', habitat: 'river', nightOnly: false, dayWeight: 38, nightWeight: 30, asset: FISH_SPRITES['silver-dace'] },
  'night-eel': { label: '밤장어', shortLabel: 'EEL', description: '해가 진 뒤 강바닥 돌 사이에서 모습을 드러내는 희귀 어종.', rarity: 'moon', habitat: 'river', nightOnly: true, dayWeight: 0, nightWeight: 18, asset: FISH_SPRITES['night-eel'] },
  'shore-sardine': { label: '해안정어리', shortLabel: 'SARD', description: '얕은 해안에서 은빛으로 반짝이는 작은 바닷물고기.', rarity: 'common', habitat: 'coast', nightOnly: false, dayWeight: 46, nightWeight: 34, asset: FISH_SPRITES['shore-sardine'] },
  'coral-bream': { label: '산호도미', shortLabel: 'BREAM', description: '따뜻한 물길을 따라 들어오는 붉은빛 도미.', rarity: 'rare', habitat: 'coast', nightOnly: false, dayWeight: 16, nightWeight: 22, asset: FISH_SPRITES['coral-bream'] },
  'tide-ray': { label: '밀물가오리', shortLabel: 'RAY', description: '밤의 밀물과 함께 부두 아래로 다가오는 희귀 가오리.', rarity: 'moon', habitat: 'coast', nightOnly: true, dayWeight: 0, nightWeight: 12, asset: FISH_SPRITES['tide-ray'] },
  'blossom-dace': { label: '꽃비피라미', shortLabel: 'BLOSS', description: '봄의 꽃잎이 흐르는 강에서만 나타나는 분홍빛 피라미.', rarity: 'rare', habitat: 'river', nightOnly: false, season: 'spring', dayWeight: 16, nightWeight: 10, asset: '/assets/seasons-v1/fish/blossom-dace.png' },
  'sunscale-bass': { label: '햇살농어', shortLabel: 'SUN', description: '여름 해안에서 금빛 비늘을 번쩍이는 힘센 농어.', rarity: 'rare', habitat: 'coast', nightOnly: false, season: 'summer', dayWeight: 18, nightWeight: 9, asset: '/assets/seasons-v1/fish/sunscale-bass.png' },
  'ember-carp': { label: '단풍잉어', shortLabel: 'EMBER', description: '가을 연못의 낙엽 사이를 헤엄치는 붉은 잉어.', rarity: 'rare', habitat: 'pond', nightOnly: false, season: 'autumn', dayWeight: 14, nightWeight: 18, asset: '/assets/seasons-v1/fish/ember-carp.png' },
  frostfin: { label: '서리비늘', shortLabel: 'FROST', description: '겨울 강의 찬 물살에서 푸르게 빛나는 희귀 물고기.', rarity: 'moon', habitat: 'river', nightOnly: false, season: 'winter', dayWeight: 10, nightWeight: 18, asset: '/assets/seasons-v1/fish/frostfin.png' },
};

export const FISHING_POND_CELLS = [
  { x: 25, y: 14 }, { x: 26, y: 14 }, { x: 27, y: 14 },
  { x: 24, y: 15 }, { x: 25, y: 15 }, { x: 26, y: 15 }, { x: 27, y: 15 }, { x: 28, y: 15 },
  { x: 24, y: 16 }, { x: 25, y: 16 }, { x: 26, y: 16 }, { x: 27, y: 16 }, { x: 28, y: 16 },
  { x: 25, y: 17 }, { x: 26, y: 17 }, { x: 27, y: 17 },
] as const;

export function createInitialFishingState(): FishingState {
  return {
    version: FISHING_SAVE_VERSION,
    inventory: Object.fromEntries(FISH_IDS.map((fish) => [fish, 0])) as Record<FishId, number>,
    discovered: [],
    totalCaught: 0,
    firstCaught: false,
    lastCaught: null,
  };
}

export function normalizeFishingState(value: unknown): FishingState {
  const initial = createInitialFishingState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<Omit<FishingState, 'version'>> & { version?: number };
  if (![1, 2, FISHING_SAVE_VERSION].includes(Number(candidate.version))) return initial;
  const inventoryCandidate = candidate.inventory && typeof candidate.inventory === 'object'
    ? candidate.inventory as Partial<Record<FishId, number>>
    : {};
  const inventory = Object.fromEntries(FISH_IDS.map((fish) => [fish, Math.max(0, Math.floor(Number(inventoryCandidate[fish]) || 0))])) as Record<FishId, number>;
  const discovered = Array.isArray(candidate.discovered)
    ? FISH_IDS.filter((fish) => candidate.discovered?.includes(fish))
    : FISH_IDS.filter((fish) => inventory[fish] > 0);
  const totalCaught = FISH_IDS.reduce((total, fish) => total + inventory[fish], 0);
  const lastCaught = typeof candidate.lastCaught === 'string' && FISH_IDS.includes(candidate.lastCaught as FishId)
    ? candidate.lastCaught as FishId
    : null;
  return { version: FISHING_SAVE_VERSION, inventory, discovered, totalCaught, firstCaught: totalCaught > 0 || Boolean(candidate.firstCaught), lastCaught };
}

export function loadFishingState(): FishingState {
  if (typeof window === 'undefined') return createInitialFishingState();
  try {
    const saved = window.localStorage.getItem(FISHING_STORAGE_KEY);
    return saved ? normalizeFishingState(JSON.parse(saved)) : createInitialFishingState();
  } catch {
    return createInitialFishingState();
  }
}

export function persistFishingState(state: FishingState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FISHING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The current session remains playable if storage is unavailable.
  }
}

export function clearFishingState(): FishingState {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(FISHING_STORAGE_KEY);
    } catch {
      // Reset the in-memory collection even if storage is unavailable.
    }
  }
  return createInitialFishingState();
}

export function isFishingWaterCell(x: number, y: number, region: RegionId = 'farm-village') {
  if (region === 'farm-village') return FISHING_POND_CELLS.some((cell) => cell.x === x && cell.y === y);
  if (region !== 'river-coast') return false;
  const inRiver = x >= 19 && x <= 22 && !((y >= 4 && y <= 6) || (y >= 10 && y <= 12));
  const inSea = x >= 24 && y >= 8;
  return inRiver || inSea;
}

export function getFishingHabitatAtCell(x: number, y: number, region: RegionId): FishHabitat | null {
  if (!isFishingWaterCell(x, y, region)) return null;
  if (region === 'farm-village') return 'pond';
  return x >= 24 && y >= 8 ? 'coast' : 'river';
}

export function getFishingCastTarget(player: FishingPlayer, region: RegionId = 'farm-village', maxDistance = 3): FishingSpot | null {
  if (region !== 'farm-village' && region !== 'river-coast') return null;
  const delta = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
  }[player.facing];
  const standX = Math.round(player.x);
  const standY = Math.round(player.y);
  let target: FishingSpot | null = null;

  for (let distance = 1; distance <= Math.max(1, Math.floor(maxDistance)); distance += 1) {
    const bobberX = standX + delta.x * distance;
    const bobberY = standY + delta.y * distance;
    const habitat = getFishingHabitatAtCell(bobberX, bobberY, region);
    if (!habitat) {
      if (target) break;
      continue;
    }
    target = {
      id: `${region}-${habitat}-${bobberX}-${bobberY}`,
      region,
      habitat,
      standX,
      standY,
      bobberX,
      bobberY,
      facing: player.facing,
    };
  }

  return target;
}

export function isNightFishingPhase(phase: DayPhase) {
  return phase === 'night';
}

export function getFishingPool(isNight: boolean, habitat: FishHabitat = 'pond', season: Season = 'spring') {
  return FISH_IDS.filter((fish) => FISH_INFO[fish].habitat === habitat
    && (!FISH_INFO[fish].nightOnly || isNight)
    && (!FISH_INFO[fish].season || FISH_INFO[fish].season === season));
}

export function chooseFish(isNight: boolean, roll: number, habitat: FishHabitat = 'pond', season: Season = 'spring'): FishId {
  const pool = getFishingPool(isNight, habitat, season);
  const weighted = pool.map((fish) => ({ fish, weight: isNight ? FISH_INFO[fish].nightWeight : FISH_INFO[fish].dayWeight }));
  const totalWeight = weighted.reduce((total, item) => total + item.weight, 0);
  let cursor = Math.max(0, Math.min(0.999_999, roll)) * totalWeight;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor < 0) return item.fish;
  }
  return weighted[weighted.length - 1].fish;
}

export function getBiteDelay(roll: number) {
  const normalized = Math.max(0, Math.min(1, roll));
  return Math.round(FISHING_BITE_MIN_MS + normalized * (FISHING_BITE_MAX_MS - FISHING_BITE_MIN_MS));
}

export function recordFishCatch(state: FishingState, fish: FishId): CatchResult {
  const firstCatch = !state.firstCaught;
  const firstOfType = state.inventory[fish] === 0;
  const nextInventory = { ...state.inventory, [fish]: state.inventory[fish] + 1 };
  const nextState: FishingState = {
    ...state,
    inventory: nextInventory,
    discovered: firstOfType ? [...state.discovered, fish] : state.discovered,
    totalCaught: state.totalCaught + 1,
    firstCaught: true,
    lastCaught: fish,
  };
  return { state: nextState, firstCatch, firstOfType, rareCatch: FISH_INFO[fish].rarity !== 'common' };
}
