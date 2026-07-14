import type { SeasonDate } from './seasonSystem';

export type FestivalId = 'harvest-night' | 'starlight-festival';
export type FestivalRewardId = 'harvest-ribbon' | 'starlight-charm';

export type FestivalInfo = {
  id: FestivalId;
  label: string;
  season: 'autumn' | 'winter';
  day: 7;
  interactionLabel: string;
  rewardId: FestivalRewardId;
  rewardLabel: string;
  journalTitle: string;
  propAsset: string;
};

export type FestivalState = {
  version: 1;
  completed: string[];
  souvenirs: Record<FestivalRewardId, number>;
  journal: string[];
};

export type FestivalCompletionResult = {
  state: FestivalState;
  changed: boolean;
  rewardId: FestivalRewardId | null;
  journalEntry: string | null;
};

export const FESTIVAL_STORAGE_KEY = 'mossbell-festivals-v1';
export const FESTIVAL_SAVE_VERSION = 1;

export const FESTIVAL_INFO: Record<FestivalId, FestivalInfo> = {
  'harvest-night': {
    id: 'harvest-night',
    label: 'HARVEST NIGHT',
    season: 'autumn',
    day: 7,
    interactionLabel: '수확물 출품',
    rewardId: 'harvest-ribbon',
    rewardLabel: 'Harvest Ribbon',
    journalTitle: 'Harvest Night 출품 완료',
    propAsset: '/assets/seasons-v1/festivals/harvest-display.png',
  },
  'starlight-festival': {
    id: 'starlight-festival',
    label: 'STARLIGHT FESTIVAL',
    season: 'winter',
    day: 7,
    interactionLabel: '별빛 등불 밝히기',
    rewardId: 'starlight-charm',
    rewardLabel: 'Starlight Charm',
    journalTitle: 'Starlight Festival 등불 점등',
    propAsset: '/assets/seasons-v1/festivals/starlight-lantern.png',
  },
};

export const FESTIVAL_INTERACTION_POSITION = { x: 18, y: 10 };
export const FESTIVAL_NPC_POSITIONS = [
  { x: 16, y: 9 }, { x: 17, y: 9 }, { x: 19, y: 9 }, { x: 20, y: 10 }, { x: 16, y: 11 },
] as const;

const completionKey = (festivalId: FestivalId, year: number) => `${festivalId}:y${Math.max(1, Math.floor(year))}`;

export function getActiveFestival(date: SeasonDate): FestivalInfo | null {
  return Object.values(FESTIVAL_INFO).find((festival) => festival.season === date.season && festival.day === date.day) ?? null;
}

export function createInitialFestivalState(): FestivalState {
  return {
    version: FESTIVAL_SAVE_VERSION,
    completed: [],
    souvenirs: { 'harvest-ribbon': 0, 'starlight-charm': 0 },
    journal: [],
  };
}

export function normalizeFestivalState(value: unknown): FestivalState {
  const initial = createInitialFestivalState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<FestivalState>;
  if (candidate.version !== FESTIVAL_SAVE_VERSION) return initial;
  const completed = Array.isArray(candidate.completed)
    ? [...new Set(candidate.completed.filter((item): item is string => typeof item === 'string' && /^(harvest-night|starlight-festival):y\d+$/.test(item)))]
    : [];
  const journal = Array.isArray(candidate.journal)
    ? [...new Set(candidate.journal.filter((item): item is string => typeof item === 'string'))]
    : [];
  return {
    version: FESTIVAL_SAVE_VERSION,
    completed,
    souvenirs: {
      'harvest-ribbon': Math.max(0, Math.floor(Number(candidate.souvenirs?.['harvest-ribbon']) || 0)),
      'starlight-charm': Math.max(0, Math.floor(Number(candidate.souvenirs?.['starlight-charm']) || 0)),
    },
    journal,
  };
}

export function loadFestivalState(): FestivalState {
  if (typeof window === 'undefined') return createInitialFestivalState();
  try {
    const saved = window.localStorage.getItem(FESTIVAL_STORAGE_KEY);
    return saved ? normalizeFestivalState(JSON.parse(saved)) : createInitialFestivalState();
  } catch {
    return createInitialFestivalState();
  }
}

export function persistFestivalState(state: FestivalState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FESTIVAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Festival progress should not interrupt play if storage is unavailable.
  }
}

export function hasCompletedFestival(state: FestivalState, festivalId: FestivalId, year: number) {
  return state.completed.includes(completionKey(festivalId, year));
}

export function completeFestival(state: FestivalState, festivalId: FestivalId, year: number): FestivalCompletionResult {
  if (hasCompletedFestival(state, festivalId, year)) {
    return { state, changed: false, rewardId: null, journalEntry: null };
  }
  const festival = FESTIVAL_INFO[festivalId];
  const journalEntry = `Y${Math.max(1, Math.floor(year))} · ${festival.journalTitle}`;
  return {
    state: {
      ...state,
      completed: [...state.completed, completionKey(festivalId, year)],
      souvenirs: { ...state.souvenirs, [festival.rewardId]: state.souvenirs[festival.rewardId] + 1 },
      journal: [...state.journal, journalEntry],
    },
    changed: true,
    rewardId: festival.rewardId,
    journalEntry,
  };
}

export const FESTIVAL_SYSTEM_MARKER = 'annual-plaza-festivals';
