export type StoryChapterId = 'prologue' | 'spring' | 'summer' | 'autumn' | 'winter' | 'finale';
export type StoryChapterStatus = 'locked' | 'available' | 'active' | 'complete';
export type StorySealId = 'sprout' | 'tide' | 'harvest' | 'starlight';
export type StoryRewardId = 'bell-keepsake';
export type StoryNpcId = 'lumi' | 'hana' | 'jun' | 'sera' | 'doyun';
export type StorySeason = 'spring' | 'summer' | 'autumn' | 'winter';
export type StoryRegionId = 'farm-village' | 'whisper-forest' | 'river-coast' | 'mine-foothill';
export type StoryCutsceneId = 'prologue' | 'spring-seal' | 'summer-seal' | 'autumn-seal' | 'winter-seal' | 'finale';

export type StoryProgress = {
  letterRead: boolean;
  lumiBriefed: boolean;
  springHarvests: number;
  springHerbCollected: boolean;
  summerFishCaught: boolean;
  summerForageCollected: boolean;
  summerOreMined: boolean;
  summerMarkerRestored: boolean;
  autumnQualityHarvests: number;
  autumnShipmentSettled: boolean;
  harvestNightCompleted: boolean;
  winterCrystalMined: boolean;
  starlightFestivalCompleted: boolean;
  sealsInstalled: boolean;
};

export type StoryState = {
  version: 1;
  chapters: Record<StoryChapterId, StoryChapterStatus>;
  progress: StoryProgress;
  seals: StorySealId[];
  rewards: StoryRewardId[];
  records: string[];
  journal: string[];
  endingComplete: boolean;
  processedActionIds: string[];
};

type StoryAction = { actionId: string };

export type StoryEvent =
  | (StoryAction & { type: 'mailbox-read' })
  | (StoryAction & { type: 'npc-talk'; npc: StoryNpcId })
  | (StoryAction & { type: 'bell-inspect' })
  | (StoryAction & { type: 'crop-harvest'; crop: string; quality: 'normal' | 'silver' | 'gold'; season: StorySeason })
  | (StoryAction & { type: 'fish-caught'; fish: string; region: StoryRegionId; season: StorySeason })
  | (StoryAction & { type: 'forage-collected'; item: string; region: StoryRegionId; season: StorySeason })
  | (StoryAction & { type: 'ore-mined'; item: string; region: StoryRegionId; season: StorySeason })
  | (StoryAction & { type: 'shipment-settled'; lines: Array<{ itemId: string; quantity: number }>; season: StorySeason })
  | (StoryAction & { type: 'festival-complete'; festival: 'harvest-night' | 'starlight-festival'; season: StorySeason; year: number })
  | (StoryAction & { type: 'water-marker-restored'; season: StorySeason });

export type StoryEventResult = {
  state: StoryState;
  changed: boolean;
  chapterCompleted: StoryChapterId | null;
  sealAwarded: StorySealId | null;
  rewardAwarded: StoryRewardId | null;
  cutscene: StoryCutsceneId | null;
};

export type StoryObjectiveView = {
  id: string;
  label: string;
  current: number;
  target: number;
  complete: boolean;
};

export type StoryChapterView = {
  chapterId: StoryChapterId;
  eyebrow: string;
  title: string;
  status: StoryChapterStatus;
  season: StorySeason | null;
  objectives: StoryObjectiveView[];
};

export type StoryDestination = {
  region: StoryRegionId;
  entityId: string;
  label: string;
};

export type StoryCalendarMarker = {
  season: StorySeason;
  day: number;
  label: string;
};

export const STORY_STORAGE_KEY = 'mossbell-story-v1';
export const STORY_SAVE_VERSION = 1;
export const STORY_CHAPTER_ORDER: StoryChapterId[] = ['prologue', 'spring', 'summer', 'autumn', 'winter', 'finale'];
export const STORY_SEAL_IDS: StorySealId[] = ['sprout', 'tide', 'harvest', 'starlight'];
export const STORY_REWARD_IDS: StoryRewardId[] = ['bell-keepsake'];

export const STORY_ASSETS = {
  oldBell: '/assets/story-v1/runtime/old-bell.png',
  fadedLetter: '/assets/story-v1/runtime/faded-letter.png',
  seals: {
    sprout: '/assets/story-v1/runtime/seal-sprout.png',
    tide: '/assets/story-v1/runtime/seal-tide.png',
    harvest: '/assets/story-v1/runtime/seal-harvest.png',
    starlight: '/assets/story-v1/runtime/seal-starlight.png',
  } satisfies Record<StorySealId, string>,
  bellKeepsake: '/assets/story-v1/runtime/bell-keepsake.png',
} as const;

export const STORY_CHAPTER_INFO: Record<StoryChapterId, {
  eyebrow: string;
  title: string;
  season: StorySeason | null;
}> = {
  prologue: { eyebrow: 'PROLOGUE', title: '멈춘 종', season: null },
  spring: { eyebrow: 'SPRING', title: '새싹의 인장', season: 'spring' },
  summer: { eyebrow: 'SUMMER', title: '물결의 인장', season: 'summer' },
  autumn: { eyebrow: 'AUTUMN', title: '수확의 인장', season: 'autumn' },
  winter: { eyebrow: 'WINTER', title: '별빛의 인장', season: 'winter' },
  finale: { eyebrow: 'FINALE', title: '다시 울리는 모스벨', season: null },
};

export const STORY_CUTSCENES: Record<StoryCutsceneId, {
  eyebrow: string;
  title: string;
  lines: string[];
  asset: string;
  durationMs: number;
}> = {
  prologue: {
    eyebrow: 'PROLOGUE COMPLETE',
    title: '멈춘 종',
    lines: ['낡은 종은 울리지 않았지만, 표면에 네 계절의 빈 홈이 드러났다.', '루미는 흩어진 인장을 되찾으면 종이 다시 울릴 거라고 말했다.'],
    asset: STORY_ASSETS.oldBell,
    durationMs: 5_600,
  },
  'spring-seal': {
    eyebrow: 'SEAL RESTORED',
    title: '새싹의 인장',
    lines: ['갓 수확한 작물과 숲의 약초에서 연둣빛 문양이 피어났다.'],
    asset: STORY_ASSETS.seals.sprout,
    durationMs: 4_600,
  },
  'summer-seal': {
    eyebrow: 'SEAL RESTORED',
    title: '물결의 인장',
    lines: ['강과 바다를 잇는 오래된 표식이 푸른빛을 되찾았다.'],
    asset: STORY_ASSETS.seals.tide,
    durationMs: 4_600,
  },
  'autumn-seal': {
    eyebrow: 'SEAL RESTORED',
    title: '수확의 인장',
    lines: ['Harvest Night의 등불 아래 황금빛 인장이 모습을 드러냈다.'],
    asset: STORY_ASSETS.seals.harvest,
    durationMs: 4_600,
  },
  'winter-seal': {
    eyebrow: 'SEAL RESTORED',
    title: '별빛의 인장',
    lines: ['별빛 등불과 희귀 수정이 공명하며 마지막 인장을 깨웠다.'],
    asset: STORY_ASSETS.seals.starlight,
    durationMs: 4_600,
  },
  finale: {
    eyebrow: 'MOSSBELL KEEPER',
    title: '다시 울리는 모스벨',
    lines: ['네 인장이 종에 맞춰지자 계절의 빛이 광장을 한 바퀴 감쌌다.', '맑은 종소리가 마을과 숲, 강변과 광산까지 오래 울려 퍼졌다.'],
    asset: STORY_ASSETS.oldBell,
    durationMs: 7_200,
  },
};

const emptyProgress = (): StoryProgress => ({
  letterRead: false,
  lumiBriefed: false,
  springHarvests: 0,
  springHerbCollected: false,
  summerFishCaught: false,
  summerForageCollected: false,
  summerOreMined: false,
  summerMarkerRestored: false,
  autumnQualityHarvests: 0,
  autumnShipmentSettled: false,
  harvestNightCompleted: false,
  winterCrystalMined: false,
  starlightFestivalCompleted: false,
  sealsInstalled: false,
});

const initialChapters = (): Record<StoryChapterId, StoryChapterStatus> => ({
  prologue: 'available',
  spring: 'locked',
  summer: 'locked',
  autumn: 'locked',
  winter: 'locked',
  finale: 'locked',
});

const validStatuses: StoryChapterStatus[] = ['locked', 'available', 'active', 'complete'];
const springCrops = new Set(['potato', 'strawberry', 'carrot']);
const summerFish = new Set(['sunscale-bass']);
const mineOres = new Set(['copper-ore', 'iron-ore']);

const asBoolean = (value: unknown) => value === true;
const asCount = (value: unknown, max: number) => Math.min(max, Math.max(0, Math.floor(Number(value) || 0)));
const uniqueStrings = (value: unknown, max = Number.POSITIVE_INFINITY) => (
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string'))].slice(-max)
    : []
);

export function createInitialStoryState(): StoryState {
  return {
    version: STORY_SAVE_VERSION,
    chapters: initialChapters(),
    progress: emptyProgress(),
    seals: [],
    rewards: [],
    records: [],
    journal: ['MAIN STORY · 빛바랜 편지'],
    endingComplete: false,
    processedActionIds: [],
  };
}

export function normalizeStoryState(value: unknown): StoryState {
  const initial = createInitialStoryState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<StoryState> & { progress?: Partial<StoryProgress> };
  const chapters = initialChapters();
  for (const chapter of STORY_CHAPTER_ORDER) {
    const status = candidate.chapters?.[chapter];
    if (typeof status === 'string' && validStatuses.includes(status as StoryChapterStatus)) {
      chapters[chapter] = status as StoryChapterStatus;
    }
  }
  if (chapters.prologue === 'locked') chapters.prologue = 'available';
  for (let index = 1; index < STORY_CHAPTER_ORDER.length; index += 1) {
    const previous = STORY_CHAPTER_ORDER[index - 1];
    const current = STORY_CHAPTER_ORDER[index];
    if (chapters[previous] === 'complete' && chapters[current] === 'locked') chapters[current] = 'available';
  }

  const sourceProgress: Partial<StoryProgress> = candidate.progress && typeof candidate.progress === 'object'
    ? candidate.progress
    : {};
  const progress: StoryProgress = {
    letterRead: asBoolean(sourceProgress.letterRead),
    lumiBriefed: asBoolean(sourceProgress.lumiBriefed),
    springHarvests: asCount(sourceProgress.springHarvests, 3),
    springHerbCollected: asBoolean(sourceProgress.springHerbCollected),
    summerFishCaught: asBoolean(sourceProgress.summerFishCaught),
    summerForageCollected: asBoolean(sourceProgress.summerForageCollected),
    summerOreMined: asBoolean(sourceProgress.summerOreMined),
    summerMarkerRestored: asBoolean(sourceProgress.summerMarkerRestored),
    autumnQualityHarvests: asCount(sourceProgress.autumnQualityHarvests, 3),
    autumnShipmentSettled: asBoolean(sourceProgress.autumnShipmentSettled),
    harvestNightCompleted: asBoolean(sourceProgress.harvestNightCompleted),
    winterCrystalMined: asBoolean(sourceProgress.winterCrystalMined),
    starlightFestivalCompleted: asBoolean(sourceProgress.starlightFestivalCompleted),
    sealsInstalled: asBoolean(sourceProgress.sealsInstalled),
  };
  const seals = STORY_SEAL_IDS.filter((seal) => candidate.seals?.includes(seal));
  const rewards = STORY_REWARD_IDS.filter((reward) => candidate.rewards?.includes(reward));
  const endingComplete = asBoolean(candidate.endingComplete) || chapters.finale === 'complete';
  if (endingComplete && !rewards.includes('bell-keepsake')) rewards.push('bell-keepsake');

  return {
    version: STORY_SAVE_VERSION,
    chapters,
    progress,
    seals,
    rewards,
    records: uniqueStrings(candidate.records),
    journal: uniqueStrings(candidate.journal).length > 0 ? uniqueStrings(candidate.journal) : initial.journal,
    endingComplete,
    processedActionIds: uniqueStrings(candidate.processedActionIds, 128),
  };
}

export function loadStoryState(): StoryState {
  if (typeof window === 'undefined') return createInitialStoryState();
  try {
    const saved = window.localStorage.getItem(STORY_STORAGE_KEY);
    return saved ? normalizeStoryState(JSON.parse(saved)) : createInitialStoryState();
  } catch {
    return createInitialStoryState();
  }
}

export function persistStoryState(state: StoryState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Story persistence must never interrupt the game loop.
  }
}

const appendUnique = <T extends string>(items: T[], item: T) => (items.includes(item) ? items : [...items, item]);

function cloneStoryState(state: StoryState): StoryState {
  return {
    ...state,
    chapters: { ...state.chapters },
    progress: { ...state.progress },
    seals: [...state.seals],
    rewards: [...state.rewards],
    records: [...state.records],
    journal: [...state.journal],
    processedActionIds: [...state.processedActionIds],
  };
}

function unlockNextChapter(state: StoryState, chapter: StoryChapterId) {
  const index = STORY_CHAPTER_ORDER.indexOf(chapter);
  const next = STORY_CHAPTER_ORDER[index + 1];
  if (next && state.chapters[next] === 'locked') state.chapters[next] = 'available';
}

function completeChapter(state: StoryState, chapter: StoryChapterId, journalEntry: string) {
  if (state.chapters[chapter] === 'complete') return false;
  state.chapters[chapter] = 'complete';
  state.journal = appendUnique(state.journal, journalEntry);
  unlockNextChapter(state, chapter);
  return true;
}

function activateChapter(state: StoryState, chapter: StoryChapterId) {
  if (state.chapters[chapter] !== 'available') return false;
  state.chapters[chapter] = 'active';
  return true;
}

export function applyStoryEvent(state: StoryState, event: StoryEvent): StoryEventResult {
  const unchanged = (): StoryEventResult => ({
    state,
    changed: false,
    chapterCompleted: null,
    sealAwarded: null,
    rewardAwarded: null,
    cutscene: null,
  });
  if (!event.actionId || state.processedActionIds.includes(event.actionId)) return unchanged();

  const next = cloneStoryState(state);
  let changed = false;
  let chapterCompleted: StoryChapterId | null = null;
  let sealAwarded: StorySealId | null = null;
  let rewardAwarded: StoryRewardId | null = null;
  let cutscene: StoryCutsceneId | null = null;

  if (event.type === 'mailbox-read' && (next.chapters.prologue === 'available' || next.chapters.prologue === 'active')) {
    changed = activateChapter(next, 'prologue') || changed;
    if (!next.progress.letterRead) {
      next.progress.letterRead = true;
      next.journal = appendUnique(next.journal, 'PROLOGUE · 우편함에서 빛바랜 편지를 발견했다');
      changed = true;
    }
  }

  if (event.type === 'npc-talk') {
    if (event.npc === 'lumi' && next.chapters.prologue === 'active' && next.progress.letterRead && !next.progress.lumiBriefed) {
      next.progress.lumiBriefed = true;
      changed = true;
    }
    const chapterByNpc: Partial<Record<StoryNpcId, StoryChapterId>> = {
      hana: 'spring', sera: 'summer', jun: 'autumn', doyun: 'winter',
    };
    const chapter = chapterByNpc[event.npc];
    if (chapter) changed = activateChapter(next, chapter) || changed;
  }

  if (event.type === 'bell-inspect') {
    if (next.chapters.prologue === 'active' && next.progress.letterRead && next.progress.lumiBriefed) {
      if (completeChapter(next, 'prologue', 'PROLOGUE COMPLETE · 사계절 인장의 흔적')) {
        changed = true;
        chapterCompleted = 'prologue';
        cutscene = 'prologue';
      }
    } else if ((next.chapters.finale === 'available' || next.chapters.finale === 'active') && STORY_SEAL_IDS.every((seal) => next.seals.includes(seal))) {
      next.chapters.finale = 'active';
      next.progress.sealsInstalled = true;
      next.endingComplete = true;
      next.rewards = appendUnique(next.rewards, 'bell-keepsake');
      next.records = appendUnique(next.records, 'MOSSBELL KEEPER');
      if (completeChapter(next, 'finale', 'FINALE COMPLETE · 다시 울리는 모스벨')) {
        changed = true;
        chapterCompleted = 'finale';
        rewardAwarded = 'bell-keepsake';
        cutscene = 'finale';
      }
    }
  }

  if (event.type === 'crop-harvest') {
    if (next.chapters.spring === 'active' && event.season === 'spring' && springCrops.has(event.crop) && next.progress.springHarvests < 3) {
      next.progress.springHarvests += 1;
      changed = true;
    }
    if (next.chapters.autumn === 'active' && event.season === 'autumn' && event.quality !== 'normal' && next.progress.autumnQualityHarvests < 3) {
      next.progress.autumnQualityHarvests += 1;
      changed = true;
    }
  }

  if (event.type === 'fish-caught'
    && next.chapters.summer === 'active'
    && event.season === 'summer'
    && event.region === 'river-coast'
    && summerFish.has(event.fish)
    && !next.progress.summerFishCaught) {
    next.progress.summerFishCaught = true;
    changed = true;
  }

  if (event.type === 'forage-collected') {
    if (next.chapters.spring === 'active'
      && event.season === 'spring'
      && event.region === 'whisper-forest'
      && event.item === 'herb'
      && !next.progress.springHerbCollected) {
      next.progress.springHerbCollected = true;
      changed = true;
    }
    if (next.chapters.summer === 'active'
      && event.season === 'summer'
      && event.region === 'river-coast'
      && !next.progress.summerForageCollected) {
      next.progress.summerForageCollected = true;
      changed = true;
    }
  }

  if (event.type === 'ore-mined') {
    if (next.chapters.summer === 'active'
      && event.season === 'summer'
      && event.region === 'mine-foothill'
      && mineOres.has(event.item)
      && !next.progress.summerOreMined) {
      next.progress.summerOreMined = true;
      changed = true;
    }
    if (next.chapters.winter === 'active'
      && event.season === 'winter'
      && event.region === 'mine-foothill'
      && event.item === 'star-crystal'
      && !next.progress.winterCrystalMined) {
      next.progress.winterCrystalMined = true;
      changed = true;
    }
  }

  if (event.type === 'water-marker-restored'
    && next.chapters.summer === 'active'
    && event.season === 'summer'
    && next.progress.summerFishCaught
    && next.progress.summerForageCollected
    && next.progress.summerOreMined
    && !next.progress.summerMarkerRestored) {
    next.progress.summerMarkerRestored = true;
    changed = true;
  }

  if (event.type === 'shipment-settled'
    && next.chapters.autumn === 'active'
    && event.season === 'autumn'
    && event.lines.some((line) => line.itemId.startsWith('crop:') && line.quantity > 0)
    && !next.progress.autumnShipmentSettled) {
    next.progress.autumnShipmentSettled = true;
    changed = true;
  }

  if (event.type === 'festival-complete') {
    if (next.chapters.autumn === 'active'
      && event.festival === 'harvest-night'
      && event.season === 'autumn'
      && next.progress.autumnQualityHarvests >= 3
      && next.progress.autumnShipmentSettled
      && !next.progress.harvestNightCompleted) {
      next.progress.harvestNightCompleted = true;
      changed = true;
    }
    if (next.chapters.winter === 'active'
      && event.festival === 'starlight-festival'
      && event.season === 'winter'
      && next.progress.winterCrystalMined
      && !next.progress.starlightFestivalCompleted) {
      next.progress.starlightFestivalCompleted = true;
      changed = true;
    }
  }

  if (next.chapters.spring === 'active' && next.progress.springHarvests >= 3 && next.progress.springHerbCollected) {
    if (completeChapter(next, 'spring', 'SPRING COMPLETE · 새싹의 인장')) {
      next.seals = appendUnique(next.seals, 'sprout');
      changed = true;
      chapterCompleted = 'spring';
      sealAwarded = 'sprout';
      cutscene = 'spring-seal';
    }
  }
  if (next.chapters.summer === 'active'
    && next.progress.summerFishCaught
    && next.progress.summerForageCollected
    && next.progress.summerOreMined
    && next.progress.summerMarkerRestored) {
    if (completeChapter(next, 'summer', 'SUMMER COMPLETE · 물결의 인장')) {
      next.seals = appendUnique(next.seals, 'tide');
      changed = true;
      chapterCompleted = 'summer';
      sealAwarded = 'tide';
      cutscene = 'summer-seal';
    }
  }
  if (next.chapters.autumn === 'active'
    && next.progress.autumnQualityHarvests >= 3
    && next.progress.autumnShipmentSettled
    && next.progress.harvestNightCompleted) {
    if (completeChapter(next, 'autumn', 'AUTUMN COMPLETE · 수확의 인장')) {
      next.seals = appendUnique(next.seals, 'harvest');
      changed = true;
      chapterCompleted = 'autumn';
      sealAwarded = 'harvest';
      cutscene = 'autumn-seal';
    }
  }
  if (next.chapters.winter === 'active'
    && next.progress.winterCrystalMined
    && next.progress.starlightFestivalCompleted) {
    if (completeChapter(next, 'winter', 'WINTER COMPLETE · 별빛의 인장')) {
      next.seals = appendUnique(next.seals, 'starlight');
      changed = true;
      chapterCompleted = 'winter';
      sealAwarded = 'starlight';
      cutscene = 'winter-seal';
    }
  }

  if (!changed) return unchanged();
  next.processedActionIds = [...next.processedActionIds, event.actionId].slice(-128);
  return { state: next, changed, chapterCompleted, sealAwarded, rewardAwarded, cutscene };
}

export function getCurrentStoryChapter(state: StoryState): StoryChapterId {
  return STORY_CHAPTER_ORDER.find((chapter) => state.chapters[chapter] === 'active')
    ?? STORY_CHAPTER_ORDER.find((chapter) => state.chapters[chapter] === 'available')
    ?? 'finale';
}

const objective = (id: string, label: string, current: number, target = 1): StoryObjectiveView => ({
  id,
  label,
  current: Math.min(current, target),
  target,
  complete: current >= target,
});

export function getStoryChapterView(state: StoryState): StoryChapterView {
  const chapterId = getCurrentStoryChapter(state);
  const info = STORY_CHAPTER_INFO[chapterId];
  const p = state.progress;
  const objectives: Record<StoryChapterId, StoryObjectiveView[]> = {
    prologue: [
      objective('letter', '우편함에서 빛바랜 편지 찾기', Number(p.letterRead)),
      objective('lumi', '루미에게 편지 보여주기', Number(p.lumiBriefed)),
      objective('bell', '마을 광장의 오래된 종 조사하기', Number(state.chapters.prologue === 'complete')),
    ],
    spring: [
      objective('spring-crops', '봄 선호 작물 직접 수확하기', p.springHarvests, 3),
      objective('spring-herb', 'Whisper Forest에서 약초 채집하기', Number(p.springHerbCollected)),
    ],
    summer: [
      objective('summer-fish', 'River Coast에서 여름 물고기 낚기', Number(p.summerFishCaught)),
      objective('summer-forage', '강변 채집물 모으기', Number(p.summerForageCollected)),
      objective('summer-ore', 'Mine Foothill에서 광석 캐기', Number(p.summerOreMined)),
      objective('summer-marker', '오래된 물길 표식 복원하기', Number(p.summerMarkerRestored)),
    ],
    autumn: [
      objective('autumn-crops', 'SILVER 이상 농작물 수확하기', p.autumnQualityHarvests, 3),
      objective('autumn-shipping', '지정 수확물 배송 정산하기', Number(p.autumnShipmentSettled)),
      objective('harvest-night', 'Harvest Night 참여하기', Number(p.harvestNightCompleted)),
    ],
    winter: [
      objective('winter-crystal', 'Mine Foothill에서 희귀 수정 찾기', Number(p.winterCrystalMined)),
      objective('starlight', 'Starlight Festival 등불 밝히기', Number(p.starlightFestivalCompleted)),
    ],
    finale: [
      objective('four-seals', '네 계절 인장 모으기', state.seals.length, 4),
      objective('install-seals', '광장의 종에 인장 설치하기', Number(p.sealsInstalled)),
    ],
  };
  return { chapterId, eyebrow: info.eyebrow, title: info.title, status: state.chapters[chapterId], season: info.season, objectives: objectives[chapterId] };
}

export function getStoryDestination(state: StoryState): StoryDestination {
  const chapter = getCurrentStoryChapter(state);
  const p = state.progress;
  if (chapter === 'prologue') {
    if (!p.letterRead) return { region: 'farm-village', entityId: 'mailbox', label: '농가 우편함' };
    if (!p.lumiBriefed) return { region: 'farm-village', entityId: 'villageKeeper', label: '루미' };
    return { region: 'farm-village', entityId: 'oldBell', label: '오래된 종' };
  }
  if (chapter === 'spring') {
    if (state.chapters.spring === 'available') return { region: 'farm-village', entityId: 'farmerHana', label: '하나' };
    if (p.springHarvests < 3) return { region: 'farm-village', entityId: 'cropPatch', label: '중앙 밭' };
    return { region: 'whisper-forest', entityId: 'storyHerb', label: '숲의 약초' };
  }
  if (chapter === 'summer') {
    if (state.chapters.summer === 'available') return { region: 'whisper-forest', entityId: 'forestGuide', label: '세라' };
    if (!p.summerFishCaught) return { region: 'river-coast', entityId: 'coastFishing', label: 'River Coast 강변' };
    if (!p.summerForageCollected) return { region: 'river-coast', entityId: 'coastForage', label: '강변 채집물' };
    if (!p.summerOreMined) return { region: 'mine-foothill', entityId: 'mineOre', label: '광산 광석' };
    return { region: 'river-coast', entityId: 'waterMarker', label: '오래된 물길 표식' };
  }
  if (chapter === 'autumn') {
    if (state.chapters.autumn === 'available') return { region: 'farm-village', entityId: 'rancherJun', label: '준' };
    if (p.autumnQualityHarvests < 3) return { region: 'farm-village', entityId: 'cropPatch', label: '중앙 밭' };
    if (!p.autumnShipmentSettled) return { region: 'farm-village', entityId: 'shippingBox', label: '배송 상자' };
    return { region: 'farm-village', entityId: 'festivalDisplay', label: 'Harvest Night' };
  }
  if (chapter === 'winter') {
    if (state.chapters.winter === 'available') return { region: 'mine-foothill', entityId: 'mineKeeper', label: '도윤' };
    if (!p.winterCrystalMined) return { region: 'mine-foothill', entityId: 'rareCrystal', label: '희귀 수정' };
    return { region: 'farm-village', entityId: 'festivalDisplay', label: 'Starlight Festival' };
  }
  return { region: 'farm-village', entityId: 'oldBell', label: '사계절의 종' };
}

export function getStoryNpcDialogue(state: StoryState, npc: StoryNpcId, season: StorySeason): string[] | null {
  if (npc === 'lumi' && state.chapters.prologue === 'active') {
    return state.progress.lumiBriefed
      ? ['종 표면의 네 홈이 보이나요? 계절 인장이 있던 자리예요.', '광장 종을 다시 조사해 봐요.']
      : ['이 편지는 옛 종지기가 남긴 기록이에요.', '광장에 멈춰 선 종부터 함께 살펴봐요.'];
  }
  const chapterByNpc: Partial<Record<StoryNpcId, StoryChapterId>> = { hana: 'spring', sera: 'summer', jun: 'autumn', doyun: 'winter' };
  const chapter = chapterByNpc[npc];
  if (!chapter || state.chapters[chapter] === 'locked' || state.chapters[chapter] === 'complete') return null;
  const info = STORY_CHAPTER_INFO[chapter];
  const waiting = info.season && info.season !== season ? `지금은 ${season.toUpperCase()}이에요. 다음 ${info.season.toUpperCase()}에도 이어서 할 수 있어요.` : null;
  const lines: Record<Exclude<StoryNpcId, 'lumi'>, string[]> = {
    hana: ['봄 작물 세 개를 직접 길러 수확하고, Whisper Forest의 약초를 찾아 주세요.', '새싹의 인장은 돌봄을 기억하고 있을 거예요.'],
    sera: ['River Coast의 여름 물고기와 강변 채집물, 광산의 광석이 필요해요.', '모두 모으면 오래된 물길 표식을 조사해 주세요.'],
    jun: ['SILVER 이상 수확물 세 개와 배송 기록이 Harvest Night의 인장을 깨울 거예요.', '마지막에는 광장 출품대에서 축제를 마무리해요.'],
    doyun: ['Mine Foothill의 희귀 수정이 별빛 등불의 심장이에요.', '수정을 찾은 뒤 Starlight Festival에서 등불을 밝혀 주세요.'],
  };
  return waiting ? [waiting, ...lines[npc as Exclude<StoryNpcId, 'lumi'>]] : lines[npc as Exclude<StoryNpcId, 'lumi'>];
}

export function getStoryCalendarMarkers(): StoryCalendarMarker[] {
  return [
    { season: 'spring', day: 1, label: '새싹의 인장' },
    { season: 'summer', day: 1, label: '물결의 인장' },
    { season: 'autumn', day: 7, label: '수확의 인장' },
    { season: 'winter', day: 7, label: '별빛의 인장' },
  ];
}

export const STORY_SYSTEM_MARKER = 'mossbell-four-season-bell-story';
