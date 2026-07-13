import type { DayPhase } from './villagePulse';
import type { RegionId } from './openWorld';
import { FORAGE_SPRITES, NPC_WALK_SPRITES, ORE_SPRITES } from './animationCatalog';

export type ForageItemId = 'mushroom' | 'herb' | 'wild-berry' | 'fern' | 'moon-bloom' | 'stone' | 'copper-ore' | 'iron-ore' | 'star-crystal';
export type ForageNodeId = 'forest-mushroom' | 'forest-herb' | 'forest-berry' | 'forest-fern' | 'forest-moon-bloom' | 'mine-stone-a' | 'mine-stone-b' | 'mine-copper' | 'mine-iron' | 'mine-crystal';
export type OpenWorldNpcId = 'forest-guide' | 'mine-keeper';
export type ExplorationQuestStatus = 'available' | 'active' | 'ready' | 'complete';

export type ForageNode = {
  id: ForageNodeId;
  region: 'whisper-forest' | 'mine-foothill';
  x: number;
  y: number;
  item: ForageItemId;
  tool: 'hand' | 'pickaxe';
};

export type ExplorationQuest = {
  status: ExplorationQuestStatus;
  target: ForageItemId;
  progress: number;
  amount: number;
};

export type ForagingState = {
  version: 1;
  spawnedDay: number;
  collectedNodeIds: ForageNodeId[];
  inventory: Record<ForageItemId, number>;
  discovered: ForageItemId[];
  forageQuest: ExplorationQuest;
  mineQuest: ExplorationQuest;
  completedNpcQuests: number;
};

export type ForageInteractionResult = {
  state: ForagingState;
  changed: boolean;
  item: ForageItemId | null;
  firstOfType: boolean;
  rare: boolean;
  message: string;
};

export const FORAGING_STORAGE_KEY = 'portfolio-foraging-loop-v1';
export const FORAGING_SAVE_VERSION = 1;

export const FORAGE_ITEM_IDS: ForageItemId[] = ['mushroom', 'herb', 'wild-berry', 'fern', 'moon-bloom', 'stone', 'copper-ore', 'iron-ore', 'star-crystal'];

export const FORAGE_ITEM_INFO: Record<ForageItemId, {
  label: string;
  shortLabel: string;
  description: string;
  category: 'forest' | 'mine';
  rare: boolean;
  asset: string;
}> = {
  mushroom: { label: '숲 버섯', shortLabel: 'MUSH', description: '그늘진 나무 밑에서 자라는 단단한 버섯.', category: 'forest', rare: false, asset: FORAGE_SPRITES.mushroom },
  herb: { label: '향기 약초', shortLabel: 'HERB', description: '개울가의 맑은 습기를 머금은 초록 약초.', category: 'forest', rare: false, asset: FORAGE_SPRITES.herb },
  'wild-berry': { label: '야생 베리', shortLabel: 'BERRY', description: '숲 가장자리에서 익은 붉은 열매 한 줌.', category: 'forest', rare: false, asset: FORAGE_SPRITES['wild-berry'] },
  fern: { label: '고사리 잎', shortLabel: 'FERN', description: '오래된 돌다리 근처에서 발견한 부드러운 잎.', category: 'forest', rare: false, asset: FORAGE_SPRITES.fern },
  'moon-bloom': { label: '달빛꽃', shortLabel: 'MOON', description: '하루에 한 번 숲 깊은 곳에서 피어나는 희귀 꽃.', category: 'forest', rare: true, asset: FORAGE_SPRITES['moon-bloom'] },
  stone: { label: '단단한 돌', shortLabel: 'STONE', description: '광산 길을 정리하며 얻은 단단한 석재.', category: 'mine', rare: false, asset: ORE_SPRITES.stone },
  'copper-ore': { label: '구리 광석', shortLabel: 'COPPER', description: '따뜻한 주황빛 광맥이 박힌 광석.', category: 'mine', rare: false, asset: ORE_SPRITES['copper-ore'] },
  'iron-ore': { label: '철 광석', shortLabel: 'IRON', description: '푸른 회색 결이 선명한 무거운 광석.', category: 'mine', rare: false, asset: ORE_SPRITES['iron-ore'] },
  'star-crystal': { label: '별빛 수정', shortLabel: 'STAR', description: '광산 입구 깊은 틈에서 빛나는 희귀 수정.', category: 'mine', rare: true, asset: ORE_SPRITES['star-crystal'] },
};

export const FORAGE_NODES: ForageNode[] = [
  { id: 'forest-mushroom', region: 'whisper-forest', x: 11, y: 6, item: 'mushroom', tool: 'hand' },
  { id: 'forest-herb', region: 'whisper-forest', x: 18, y: 15, item: 'herb', tool: 'hand' },
  { id: 'forest-berry', region: 'whisper-forest', x: 27, y: 12, item: 'wild-berry', tool: 'hand' },
  { id: 'forest-fern', region: 'whisper-forest', x: 12, y: 17, item: 'fern', tool: 'hand' },
  { id: 'forest-moon-bloom', region: 'whisper-forest', x: 27, y: 18, item: 'moon-bloom', tool: 'hand' },
  { id: 'mine-stone-a', region: 'mine-foothill', x: 10, y: 9, item: 'stone', tool: 'pickaxe' },
  { id: 'mine-stone-b', region: 'mine-foothill', x: 22, y: 8, item: 'stone', tool: 'pickaxe' },
  { id: 'mine-copper', region: 'mine-foothill', x: 16, y: 9, item: 'copper-ore', tool: 'pickaxe' },
  { id: 'mine-iron', region: 'mine-foothill', x: 18, y: 14, item: 'iron-ore', tool: 'pickaxe' },
  { id: 'mine-crystal', region: 'mine-foothill', x: 27, y: 7, item: 'star-crystal', tool: 'pickaxe' },
];

export const OPEN_WORLD_NPC_INFO: Record<OpenWorldNpcId, {
  name: string;
  role: string;
  region: 'whisper-forest' | 'mine-foothill';
  assets: [string, string];
}> = {
  'forest-guide': { name: '세라', role: '숲지기', region: 'whisper-forest', assets: [NPC_WALK_SPRITES.sera.down[0], NPC_WALK_SPRITES.sera.down[1]] },
  'mine-keeper': { name: '도윤', role: '광산 관리인', region: 'mine-foothill', assets: [NPC_WALK_SPRITES.doyun.down[0], NPC_WALK_SPRITES.doyun.down[1]] },
};

const NPC_SCHEDULES: Record<OpenWorldNpcId, Record<DayPhase, { x: number; y: number }>> = {
  'forest-guide': { dawn: { x: 7, y: 11 }, day: { x: 15, y: 7 }, sunset: { x: 17, y: 16 }, night: { x: 5, y: 12 } },
  'mine-keeper': { dawn: { x: 5, y: 5 }, day: { x: 15, y: 12 }, sunset: { x: 23, y: 8 }, night: { x: 5, y: 5 } },
};

export function getOpenWorldNpcPosition(id: OpenWorldNpcId, phase: DayPhase) {
  return NPC_SCHEDULES[id][phase];
}

function emptyInventory() {
  return Object.fromEntries(FORAGE_ITEM_IDS.map((item) => [item, 0])) as Record<ForageItemId, number>;
}

export function createInitialForagingState(day = 1): ForagingState {
  return {
    version: FORAGING_SAVE_VERSION,
    spawnedDay: Math.max(1, Math.floor(day)),
    collectedNodeIds: [],
    inventory: emptyInventory(),
    discovered: [],
    forageQuest: { status: 'available', target: 'herb', progress: 0, amount: 1 },
    mineQuest: { status: 'available', target: 'copper-ore', progress: 0, amount: 1 },
    completedNpcQuests: 0,
  };
}

export function normalizeForagingState(value: unknown): ForagingState {
  const initial = createInitialForagingState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<ForagingState>;
  if (candidate.version !== FORAGING_SAVE_VERSION) return initial;
  const inventoryCandidate = candidate.inventory && typeof candidate.inventory === 'object'
    ? candidate.inventory as Partial<Record<ForageItemId, number>>
    : {};
  const inventory = Object.fromEntries(FORAGE_ITEM_IDS.map((item) => [item, Math.max(0, Math.floor(Number(inventoryCandidate[item]) || 0))])) as Record<ForageItemId, number>;
  const discovered = FORAGE_ITEM_IDS.filter((item) => candidate.discovered?.includes(item) || inventory[item] > 0);
  const collectedNodeIds = FORAGE_NODES.map((node) => node.id).filter((id) => candidate.collectedNodeIds?.includes(id));
  const normalizeQuest = (quest: unknown, fallback: ExplorationQuest) => {
    if (!quest || typeof quest !== 'object') return fallback;
    const value = quest as Partial<ExplorationQuest>;
    const statuses: ExplorationQuestStatus[] = ['available', 'active', 'ready', 'complete'];
    return {
      status: statuses.includes(value.status as ExplorationQuestStatus) ? value.status as ExplorationQuestStatus : fallback.status,
      target: FORAGE_ITEM_IDS.includes(value.target as ForageItemId) ? value.target as ForageItemId : fallback.target,
      progress: Math.max(0, Math.min(1, Math.floor(Number(value.progress) || 0))),
      amount: 1,
    };
  };
  return {
    version: FORAGING_SAVE_VERSION,
    spawnedDay: Math.max(1, Math.floor(Number(candidate.spawnedDay) || 1)),
    collectedNodeIds,
    inventory,
    discovered,
    forageQuest: normalizeQuest(candidate.forageQuest, initial.forageQuest),
    mineQuest: normalizeQuest(candidate.mineQuest, initial.mineQuest),
    completedNpcQuests: Math.max(0, Math.floor(Number(candidate.completedNpcQuests) || 0)),
  };
}

export function loadForagingState(): ForagingState {
  if (typeof window === 'undefined') return createInitialForagingState();
  try {
    const saved = window.localStorage.getItem(FORAGING_STORAGE_KEY);
    return saved ? normalizeForagingState(JSON.parse(saved)) : createInitialForagingState();
  } catch {
    return createInitialForagingState();
  }
}

export function persistForagingState(state: ForagingState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FORAGING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the current gathering session playable when storage is unavailable.
  }
}

export function syncForagingDay(state: ForagingState, day: number): ForagingState {
  if (state.spawnedDay === day) return state;
  const refreshQuest = (quest: ExplorationQuest, target: ForageItemId): ExplorationQuest => (
    quest.status === 'active' || quest.status === 'ready'
      ? quest
      : { status: 'available', target, progress: 0, amount: 1 }
  );
  return {
    ...state,
    spawnedDay: day,
    collectedNodeIds: [],
    forageQuest: refreshQuest(state.forageQuest, day % 2 === 0 ? 'wild-berry' : 'herb'),
    mineQuest: refreshQuest(state.mineQuest, day % 2 === 0 ? 'iron-ore' : 'copper-ore'),
  };
}

export function getVisibleForageNodes(state: ForagingState, region: RegionId) {
  return FORAGE_NODES.filter((node) => node.region === region && !state.collectedNodeIds.includes(node.id));
}

export function getNearestForageNode(state: ForagingState, region: RegionId, player: { x: number; y: number }, range = 1.55) {
  return getVisibleForageNodes(state, region)
    .map((node) => ({ node, distance: Math.hypot(player.x - node.x, player.y - node.y) }))
    .filter(({ distance }) => distance <= range)
    .sort((a, b) => a.distance - b.distance)[0]?.node ?? null;
}

function progressQuest(quest: ExplorationQuest, item: ForageItemId): ExplorationQuest {
  if (quest.status !== 'active' || quest.target !== item) return quest;
  return { ...quest, progress: 1, status: 'ready' };
}

export function collectForageNode(state: ForagingState, nodeId: ForageNodeId, day: number, tool: 'hand' | 'pickaxe'): ForageInteractionResult {
  const synced = syncForagingDay(state, day);
  const node = FORAGE_NODES.find((candidate) => candidate.id === nodeId);
  if (!node || synced.collectedNodeIds.includes(nodeId)) {
    return { state: synced, changed: false, item: null, firstOfType: false, rare: false, message: '오늘은 이미 비어 있는 채집 자리입니다.' };
  }
  if (node.tool === 'pickaxe' && tool !== 'pickaxe') {
    return { state: synced, changed: false, item: null, firstOfType: false, rare: false, message: '단단한 광맥입니다. 곡괭이 [5]를 선택하세요.' };
  }
  const item = node.item;
  const firstOfType = synced.inventory[item] === 0;
  const nextState: ForagingState = {
    ...synced,
    collectedNodeIds: [...synced.collectedNodeIds, nodeId],
    inventory: { ...synced.inventory, [item]: synced.inventory[item] + 1 },
    discovered: firstOfType ? [...synced.discovered, item] : synced.discovered,
    forageQuest: progressQuest(synced.forageQuest, item),
    mineQuest: progressQuest(synced.mineQuest, item),
  };
  return {
    state: nextState,
    changed: true,
    item,
    firstOfType,
    rare: FORAGE_ITEM_INFO[item].rare,
    message: `${FORAGE_ITEM_INFO[item].label}을(를) 얻었습니다.`,
  };
}

export function interactWithOpenWorldNpc(state: ForagingState, id: OpenWorldNpcId, phase: DayPhase) {
  const key = id === 'forest-guide' ? 'forageQuest' : 'mineQuest';
  const quest = state[key];
  const targetLabel = FORAGE_ITEM_INFO[quest.target].label;
  const greeting: Record<DayPhase, string> = {
    dawn: '이른 시간에는 길 가장자리의 흔적이 가장 또렷해요.',
    day: '햇빛이 길을 비추니 천천히 주변을 살펴보세요.',
    sunset: '어두워지기 전에 오늘 발견한 것을 확인해 볼까요?',
    night: '밤길은 조심하세요. 희귀한 생물과 광맥은 밤에 더 잘 보이기도 해요.',
  };
  if (quest.status === 'available') {
    return {
      state: { ...state, [key]: { ...quest, status: 'active' } },
      completed: false,
      lines: [greeting[phase], `오늘의 부탁: ${targetLabel} 1개를 찾아 주세요.`],
    };
  }
  if (quest.status === 'ready') {
    return {
      state: { ...state, [key]: { ...quest, status: 'complete' }, completedNpcQuests: state.completedNpcQuests + 1 },
      completed: true,
      lines: [`${targetLabel}을(를) 확인했습니다. 오늘의 탐험 의뢰 완료!`, '발견 기록이 월드 일지에 추가됐습니다.'],
    };
  }
  if (quest.status === 'complete') {
    return { state, completed: false, lines: [greeting[phase], '오늘 부탁은 끝났습니다. 남은 지역을 자유롭게 탐험하세요.'] };
  }
  return { state, completed: false, lines: [greeting[phase], `${targetLabel} 발견 현황 ${quest.progress}/${quest.amount}.`] };
}

export function getTotalForageInventory(state: ForagingState) {
  return FORAGE_ITEM_IDS.reduce((total, item) => total + state.inventory[item], 0);
}
