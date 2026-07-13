export type GameQuestStage =
  | 'not-started'
  | 'visit-seed-shop'
  | 'harvest-village-crops'
  | 'inspect-barn'
  | 'return-to-board'
  | 'complete';

export type GameProgress = {
  version: 1;
  questStage: GameQuestStage;
  harvestCount: number;
  journal: string[];
};

export const GAME_PROGRESS_STORAGE_KEY = 'mossbell-progress-v1';
export const GAME_STARTED_STORAGE_KEY = 'mossbell-started-v1';

const QUEST_STAGES: GameQuestStage[] = [
  'not-started',
  'visit-seed-shop',
  'harvest-village-crops',
  'inspect-barn',
  'return-to-board',
  'complete',
];

const LEGACY_QUEST_STAGES: Record<string, GameQuestStage> = {
  'visit-workshop': 'visit-seed-shop',
  'harvest-project-crops': 'harvest-village-crops',
  'inspect-server-barn': 'inspect-barn',
};

export function createInitialGameProgress(): GameProgress {
  return { version: 1, questStage: 'not-started', harvestCount: 0, journal: [] };
}

export function normalizeGameProgress(value: unknown): GameProgress {
  const initial = createInitialGameProgress();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<GameProgress>;
  const savedStage = String(candidate.questStage ?? '');
  const questStage = QUEST_STAGES.includes(savedStage as GameQuestStage)
    ? savedStage as GameQuestStage
    : LEGACY_QUEST_STAGES[savedStage] ?? initial.questStage;
  const journal = Array.isArray(candidate.journal)
    ? [...new Set(candidate.journal.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0))]
    : [];
  return {
    version: 1,
    questStage,
    harvestCount: Math.max(0, Math.min(3, Math.floor(Number(candidate.harvestCount) || 0))),
    journal,
  };
}

export function loadGameProgress(): GameProgress {
  if (typeof window === 'undefined') return createInitialGameProgress();
  try {
    const saved = window.localStorage.getItem(GAME_PROGRESS_STORAGE_KEY);
    return saved ? normalizeGameProgress(JSON.parse(saved)) : createInitialGameProgress();
  } catch {
    return createInitialGameProgress();
  }
}

export function persistGameProgress(progress: GameProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Progress persistence never blocks the current play session.
  }
}

export function markGameStarted() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GAME_STARTED_STORAGE_KEY, 'true');
}

export function hasSavedGame(storageKeys: string[]) {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(GAME_STARTED_STORAGE_KEY) === 'true'
    || storageKeys.some((key) => window.localStorage.getItem(key) !== null);
}
