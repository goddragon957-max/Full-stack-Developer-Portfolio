export type TimeMode = 'auto' | 'day' | 'night';
export type DayPhase = 'dawn' | 'day' | 'sunset' | 'night';
export type CelebrationKind = 'first-harvest' | 'quest-complete' | 'rare-fish' | 'npc-quest' | 'golden-egg' | 'area-discovered' | 'world-explorer' | 'rare-forage' | 'rare-crystal' | 'open-world-quest' | 'tool-upgraded' | 'economy-milestone' | 'harvest-night' | 'starlight-festival';

export type VillageTime = {
  phase: DayPhase;
  clock: string;
  isNight: boolean;
};

export const VILLAGE_DAY_DURATION_MS = 90_000;
export const VILLAGE_CLOCK_TICK_MS = 1_000;
export const HARVEST_COMBO_WINDOW_MS = 8_000;
export const CELEBRATION_DURATION_MS = 2_800;
export const VILLAGE_PULSE_STORAGE_KEY = 'portfolio-village-pulse-v1';

export const TIME_MODE_LABELS: Record<TimeMode, string> = {
  auto: 'AUTO',
  day: 'DAY',
  night: 'NIGHT',
};

export const DAY_PHASE_LABELS: Record<DayPhase, string> = {
  dawn: 'DAWN',
  day: 'DAY',
  sunset: 'SUNSET',
  night: 'NIGHT',
};

export const CELEBRATION_COPY: Record<CelebrationKind, { eyebrow: string; title: string }> = {
  'first-harvest': { eyebrow: 'FIRST HARVEST', title: '첫 수확을 마을이 축하합니다!' },
  'quest-complete': { eyebrow: 'QUEST COMPLETE', title: '첫 의뢰를 완수했습니다!' },
  'rare-fish': { eyebrow: 'RARE CATCH', title: '희귀한 연못 물고기를 낚았습니다!' },
  'npc-quest': { eyebrow: 'DAILY REQUEST', title: '오늘의 마을 부탁을 완수했습니다!' },
  'golden-egg': { eyebrow: 'GOLDEN FIND', title: '완벽한 돌봄이 황금 달걀로 돌아왔습니다!' },
  'area-discovered': { eyebrow: 'AREA DISCOVERED', title: '새로운 지역이 월드맵에 기록됐습니다!' },
  'world-explorer': { eyebrow: 'WORLD EXPLORER', title: '미니 오픈월드의 모든 지역을 발견했습니다!' },
  'rare-forage': { eyebrow: 'RARE FORAGE', title: '숲에서 희귀한 달빛꽃을 발견했습니다!' },
  'rare-crystal': { eyebrow: 'CRYSTAL FIND', title: '광맥에서 희귀한 별빛 수정을 얻었습니다!' },
  'open-world-quest': { eyebrow: 'EXPEDITION COMPLETE', title: '오늘의 탐험 의뢰를 완수했습니다!' },
  'tool-upgraded': { eyebrow: 'TOOL UPGRADED', title: '농장 도구가 한 단계 더 강해졌습니다!' },
  'economy-milestone': { eyebrow: 'MILESTONE', title: '모스벨 성장 기록이 새로 열렸습니다!' },
  'harvest-night': { eyebrow: 'HARVEST NIGHT', title: '올해의 수확물이 광장을 밝혔습니다!' },
  'starlight-festival': { eyebrow: 'STARLIGHT FESTIVAL', title: '별빛 등불이 겨울밤을 밝혔습니다!' },
};

function normalizeMinutes(value: number) {
  return ((value % 1_440) + 1_440) % 1_440;
}

function getPhaseFromMinutes(minutes: number): DayPhase {
  if (minutes >= 300 && minutes < 420) return 'dawn';
  if (minutes >= 420 && minutes < 1_050) return 'day';
  if (minutes >= 1_050 && minutes < 1_170) return 'sunset';
  return 'night';
}

function formatClock(minutes: number) {
  const normalized = normalizeMinutes(minutes);
  const hour = Math.floor(normalized / 60).toString().padStart(2, '0');
  const minute = Math.floor(normalized % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export function getVillageTime(mode: TimeMode, elapsedMs: number): VillageTime {
  if (mode === 'day') return { phase: 'day', clock: '10:00', isNight: false };
  if (mode === 'night') return { phase: 'night', clock: '21:00', isNight: true };

  const progress = ((elapsedMs % VILLAGE_DAY_DURATION_MS) + VILLAGE_DAY_DURATION_MS) % VILLAGE_DAY_DURATION_MS;
  const minutes = normalizeMinutes(480 + (progress / VILLAGE_DAY_DURATION_MS) * 1_440);
  const phase = getPhaseFromMinutes(minutes);
  return { phase, clock: formatClock(minutes), isNight: phase === 'night' };
}

export function loadTimeMode(): TimeMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = window.localStorage.getItem(VILLAGE_PULSE_STORAGE_KEY);
    return saved === 'day' || saved === 'night' || saved === 'auto' ? saved : 'auto';
  } catch {
    return 'auto';
  }
}

export function persistTimeMode(mode: TimeMode) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(VILLAGE_PULSE_STORAGE_KEY, mode);
  } catch {
    // Lighting remains usable for the current session when storage is unavailable.
  }
}

export function getNextHarvestCombo(previousCount: number, lastHarvestAt: number, now: number) {
  if (previousCount > 0 && now - lastHarvestAt <= HARVEST_COMBO_WINDOW_MS) {
    return Math.min(previousCount + 1, 9);
  }
  return 1;
}

export function getVillageKeeperDialogue(phase: DayPhase) {
  const phaseLines: Record<DayPhase, string> = {
    dawn: '새벽빛이 올라오면 밭과 길의 색이 가장 부드럽게 보여요.',
    day: '낮에는 밭을 돌보기 좋아요. 준비된 작물은 E로 바로 수확할 수 있어요.',
    sunset: '노을이 지고 있어요. 오늘 발견한 기록을 수첩에서 확인해 보세요.',
    night: '밤에는 축하 폭죽이 더 선명해요. 첫 수확과 의뢰 완료를 노려봐요.',
  };
  return [
    phaseLines[phase],
    '저는 루미, 마을 기록가예요. 밭과 숲, 바다에서 만난 이야기를 마을 연대기에 적고 있어요.',
  ];
}
