import type { CropType } from './farmLoop';
import type { RegionId } from './openWorld';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type SeasonDate = {
  year: number;
  season: Season;
  day: number;
};

export type SeasonState = SeasonDate & {
  version: 1;
  villageDay: number;
  dateKey: string;
  discoveredSeasons: Season[];
};

export const SEASON_STORAGE_KEY = 'mossbell-seasons-v1';
export const SEASON_SAVE_VERSION = 1;
export const DAYS_PER_SEASON = 7;
export const DAYS_PER_YEAR = 28;
export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const SEASON_INFO: Record<Season, { label: string; shortLabel: string; icon: string; accent: string }> = {
  spring: { label: 'Spring', shortLabel: 'SPR', icon: '/assets/seasons-v1/icons/spring.png', accent: '#7ccf78' },
  summer: { label: 'Summer', shortLabel: 'SUM', icon: '/assets/seasons-v1/icons/summer.png', accent: '#f2c84b' },
  autumn: { label: 'Autumn', shortLabel: 'AUT', icon: '/assets/seasons-v1/icons/autumn.png', accent: '#dd7849' },
  winter: { label: 'Winter', shortLabel: 'WIN', icon: '/assets/seasons-v1/icons/winter.png', accent: '#86bee0' },
};

export const CROP_PREFERRED_SEASONS: Record<CropType, Season[]> = {
  potato: ['spring', 'winter'],
  strawberry: ['spring'],
  carrot: ['spring', 'autumn'],
  tomato: ['summer'],
  corn: ['summer', 'autumn'],
  pumpkin: ['autumn'],
};

const DEMAND_POOLS: Record<Season, string[]> = {
  spring: [
    'crop:potato:normal', 'crop:strawberry:silver', 'crop:carrot:gold',
    'fish:blossom-dace', 'product:egg', 'forage:herb',
  ],
  summer: [
    'crop:tomato:normal', 'crop:corn:silver', 'crop:strawberry:gold',
    'fish:sunscale-bass', 'product:milk', 'forage:wild-berry',
  ],
  autumn: [
    'crop:pumpkin:normal', 'crop:corn:gold', 'crop:carrot:silver',
    'fish:ember-carp', 'product:egg', 'forage:mushroom',
  ],
  winter: [
    'crop:potato:gold', 'crop:pumpkin:silver', 'fish:frostfin',
    'product:milk', 'forage:iron-ore', 'forage:star-crystal',
  ],
};

const isSeason = (value: unknown): value is Season => typeof value === 'string' && SEASONS.includes(value as Season);

export function getSeasonDate(villageDay: number): SeasonDate {
  const normalizedDay = Math.max(1, Math.floor(Number(villageDay) || 1));
  const yearIndex = Math.floor((normalizedDay - 1) / DAYS_PER_YEAR);
  const dayOfYear = (normalizedDay - 1) % DAYS_PER_YEAR;
  const seasonIndex = Math.floor(dayOfYear / DAYS_PER_SEASON);
  return {
    year: yearIndex + 1,
    season: SEASONS[seasonIndex],
    day: (dayOfYear % DAYS_PER_SEASON) + 1,
  };
}

export function getSeasonDateKey(date: SeasonDate) {
  return `y${date.year}-${date.season}-d${date.day}`;
}

export function createInitialSeasonState(villageDay = 1): SeasonState {
  const date = getSeasonDate(villageDay);
  return {
    version: SEASON_SAVE_VERSION,
    villageDay: Math.max(1, Math.floor(Number(villageDay) || 1)),
    ...date,
    dateKey: getSeasonDateKey(date),
    discoveredSeasons: SEASONS.slice(0, SEASONS.indexOf(date.season) + 1),
  };
}

export function normalizeSeasonState(value: unknown, villageDay = 1): SeasonState {
  const fallback = createInitialSeasonState(villageDay);
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<SeasonState>;
  if (candidate.version !== SEASON_SAVE_VERSION) return fallback;
  const savedVillageDay = Math.max(1, Math.floor(Number(candidate.villageDay) || villageDay));
  const date = getSeasonDate(savedVillageDay);
  const discovered = SEASONS.filter((season) => candidate.discoveredSeasons?.includes(season));
  if (isSeason(candidate.season) && !discovered.includes(candidate.season)) discovered.push(candidate.season);
  if (!discovered.includes(date.season)) discovered.push(date.season);
  if (!discovered.includes('spring')) discovered.unshift('spring');
  return {
    version: SEASON_SAVE_VERSION,
    villageDay: savedVillageDay,
    ...date,
    dateKey: getSeasonDateKey(date),
    discoveredSeasons: SEASONS.filter((season) => discovered.includes(season)),
  };
}

export function syncSeasonState(state: SeasonState, villageDay: number): SeasonState {
  const normalizedDay = Math.max(1, Math.floor(Number(villageDay) || 1));
  const date = getSeasonDate(normalizedDay);
  const discoveredSeasons = state.discoveredSeasons.includes(date.season)
    ? state.discoveredSeasons
    : SEASONS.filter((season) => [...state.discoveredSeasons, date.season].includes(season));
  if (state.villageDay === normalizedDay && state.dateKey === getSeasonDateKey(date) && discoveredSeasons === state.discoveredSeasons) return state;
  return {
    ...state,
    villageDay: normalizedDay,
    ...date,
    dateKey: getSeasonDateKey(date),
    discoveredSeasons,
  };
}

export function loadSeasonState(villageDay = 1): SeasonState {
  if (typeof window === 'undefined') return createInitialSeasonState(villageDay);
  try {
    const saved = window.localStorage.getItem(SEASON_STORAGE_KEY);
    return syncSeasonState(saved ? normalizeSeasonState(JSON.parse(saved), villageDay) : createInitialSeasonState(villageDay), villageDay);
  } catch {
    return createInitialSeasonState(villageDay);
  }
}

export function persistSeasonState(state: SeasonState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEASON_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Calendar persistence never blocks the current play session.
  }
}

export function getCropPreferredSeason(crop: CropType, season: Season) {
  return CROP_PREFERRED_SEASONS[crop].includes(season);
}

export function getCropGrowthMultiplier(crop: CropType, season: Season) {
  return getCropPreferredSeason(crop, season) ? 1 : 1.28;
}

export function getCropSeasonQualityBonus(crop: CropType, season: Season) {
  return getCropPreferredSeason(crop, season) ? 0.8 : 0;
}

export function getDailyDemandItems(date: SeasonDate) {
  const pool = DEMAND_POOLS[date.season];
  const offset = ((date.year - 1) * DAYS_PER_SEASON + date.day - 1) % pool.length;
  return Array.from({ length: 3 }, (_, index) => pool[(offset + index * 2) % pool.length]);
}

export function getDemandPriceMultiplier(itemId: string, date: SeasonDate) {
  return getDailyDemandItems(date).includes(itemId) ? 1.2 : 1;
}

export function getSeasonalMapAsset(region: RegionId, season: Season) {
  return `/assets/seasons-v1/maps/${region}-${season}.png`;
}

export const SEASON_SYSTEM_MARKER = 'four-seasons-seven-days';
