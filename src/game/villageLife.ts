import type { CropType } from './farmLoop';
import type { DayPhase } from './villagePulse';
import { NPC_WALK_SPRITES, PRODUCT_SPRITES, getAnimalRemasterSprite } from './animationCatalog';

export type LifeNpcId = 'farmer-hana' | 'rancher-jun';
export type AnimalId = 'chicken-1' | 'chicken-2' | 'chicken-3' | 'cow-1' | 'cow-2';
export type AnimalSpecies = 'chicken' | 'cow';
export type AnimalStatus = 'idle' | 'hungry' | 'fed' | 'happy' | 'product-ready' | 'sleeping';
export type RanchProduct = 'egg' | 'milk' | 'golden-egg';
export type DailyQuestStatus = 'available' | 'active' | 'ready' | 'complete';
export type RanchFencePieceKind = 'fence' | 'gate';
export type RanchFenceOrientation = 'horizontal' | 'vertical' | 'gate';

export type RanchFencePiece = {
  id: string;
  x: number;
  y: number;
  kind: RanchFencePieceKind;
};

export type AnimalRecord = {
  id: AnimalId;
  species: AnimalSpecies;
  fed: boolean;
  petted: boolean;
  affection: number;
  product: RanchProduct | null;
  discovered: boolean;
};

export type DailyQuest = {
  status: DailyQuestStatus;
  target: CropType | RanchProduct;
  progress: number;
  amount: number;
};

export type VillageLifeState = {
  version: 3;
  day: number;
  animals: Record<AnimalId, AnimalRecord>;
  products: Record<RanchProduct, number>;
  discoveredProducts: RanchProduct[];
  discoveredAnimals: AnimalId[];
  perfectCareStreak: number;
  perfectCareAwardedDay: number | null;
  farmerQuest: DailyQuest;
  rancherQuest: DailyQuest;
  completedNpcQuests: number;
  fencePieces: RanchFencePiece[];
};

export type RanchFenceEditResult = {
  state: VillageLifeState;
  changed: boolean;
  message: string;
};

export type AnimalInteractionResult = {
  state: VillageLifeState;
  changed: boolean;
  action: 'feed' | 'pet' | 'collect' | 'sleeping' | 'happy';
  message: string;
  product: RanchProduct | null;
  firstOfType: boolean;
  perfectCare: boolean;
};

export type NpcInteractionResult = {
  state: VillageLifeState;
  lines: string[];
  completed: boolean;
};

export const VILLAGE_LIFE_STORAGE_KEY = 'portfolio-village-life-v2';
export const VILLAGE_LIFE_SAVE_VERSION = 3;
export const LIFE_NPC_IDS: LifeNpcId[] = ['farmer-hana', 'rancher-jun'];
export const ANIMAL_IDS: AnimalId[] = ['chicken-1', 'chicken-2', 'chicken-3', 'cow-1', 'cow-2'];
export const RANCH_PRODUCTS: RanchProduct[] = ['egg', 'milk', 'golden-egg'];
export const DAILY_CROPS: CropType[] = ['tomato', 'corn', 'pumpkin'];
export const RANCH_FENCE_PIECE_LIMIT = 64;
export const RANCH_AREA_BOUNDS = { minX: 5, maxX: 9, minY: 14, maxY: 17 } as const;

function createRanchFencePiece(x: number, y: number, kind: RanchFencePieceKind = 'fence'): RanchFencePiece {
  return { id: `ranch-fence-${x}-${y}`, x, y, kind };
}

export const DEFAULT_RANCH_FENCE_PIECES: RanchFencePiece[] = [
  createRanchFencePiece(5, 14), createRanchFencePiece(6, 14), createRanchFencePiece(7, 14), createRanchFencePiece(8, 14), createRanchFencePiece(9, 14),
  createRanchFencePiece(5, 15), createRanchFencePiece(9, 15),
  createRanchFencePiece(5, 16), createRanchFencePiece(9, 16),
  createRanchFencePiece(5, 17), createRanchFencePiece(6, 17), createRanchFencePiece(7, 17, 'gate'), createRanchFencePiece(8, 17), createRanchFencePiece(9, 17),
];

const LEGACY_V2_DEFAULT_RANCH_FENCE_SIGNATURE = new Set([
  '10,15,fence', '11,15,fence', '12,15,fence', '13,15,fence', '14,15,fence',
  '10,16,fence', '14,16,fence', '10,17,fence', '14,17,fence',
  '10,18,fence', '11,18,fence', '12,18,gate', '13,18,fence', '14,18,fence',
]);

function cloneDefaultRanchFencePieces() {
  return DEFAULT_RANCH_FENCE_PIECES.map((piece) => ({ ...piece }));
}

export const LIFE_NPC_INFO: Record<LifeNpcId, {
  name: string;
  role: string;
  journalTitle: string;
  assets: [string, string];
}> = {
  'farmer-hana': {
    name: '하나 · 밭지기',
    role: 'FARMER',
    journalTitle: '하나: 계절 없는 밭의 기록',
    assets: [NPC_WALK_SPRITES.hana.down[0], NPC_WALK_SPRITES.hana.down[1]],
  },
  'rancher-jun': {
    name: '준 · 목장지기',
    role: 'RANCHER',
    journalTitle: '준: 작은 목장의 기록',
    assets: [NPC_WALK_SPRITES.jun.down[0], NPC_WALK_SPRITES.jun.down[1]],
  },
};

export const ANIMAL_INFO: Record<AnimalId, {
  name: string;
  species: AnimalSpecies;
  product: Exclude<RanchProduct, 'golden-egg'>;
}> = {
  'chicken-1': { name: '구름이', species: 'chicken', product: 'egg' },
  'chicken-2': { name: '보리', species: 'chicken', product: 'egg' },
  'chicken-3': { name: '콩이', species: 'chicken', product: 'egg' },
  'cow-1': { name: '모카', species: 'cow', product: 'milk' },
  'cow-2': { name: '두유', species: 'cow', product: 'milk' },
};

export const PRODUCT_INFO: Record<RanchProduct, { label: string; description: string; asset: string }> = {
  egg: {
    label: '신선한 달걀',
    description: '먹이를 먹은 닭이 새 아침에 남긴 목장 생산품.',
    asset: PRODUCT_SPRITES.egg,
  },
  milk: {
    label: '신선한 우유',
    description: '잘 돌본 소에게서 얻은 부드러운 목장 생산품.',
    asset: PRODUCT_SPRITES.milk,
  },
  'golden-egg': {
    label: '황금 달걀',
    description: '완벽한 돌봄을 여러 날 이어 갔을 때 발견되는 희귀 생산품.',
    asset: PRODUCT_SPRITES['golden-egg'],
  },
};

const NPC_POSITIONS: Record<LifeNpcId, Record<DayPhase, { x: number; y: number; facing: 'up' | 'down' | 'left' | 'right' }>> = {
  'farmer-hana': {
    dawn: { x: 21, y: 12, facing: 'down' },
    day: { x: 25, y: 12, facing: 'left' },
    sunset: { x: 23, y: 17, facing: 'down' },
    night: { x: 17, y: 6, facing: 'right' },
  },
  'rancher-jun': {
    dawn: { x: 5, y: 13, facing: 'right' },
    day: { x: 10, y: 16, facing: 'left' },
    sunset: { x: 5, y: 19, facing: 'right' },
    night: { x: 3, y: 14, facing: 'up' },
  },
};

const DAY_ANIMAL_POSITIONS: Record<AnimalId, { x: number; y: number }> = {
  'chicken-1': { x: 6, y: 15 },
  'chicken-2': { x: 7, y: 15 },
  'chicken-3': { x: 8, y: 15 },
  'cow-1': { x: 6.3, y: 16.25 },
  'cow-2': { x: 7.8, y: 16.25 },
};

const NIGHT_ANIMAL_POSITIONS: Record<AnimalId, { x: number; y: number }> = {
  'chicken-1': { x: 5.2, y: 16.1 },
  'chicken-2': { x: 5.8, y: 16.1 },
  'chicken-3': { x: 6.4, y: 16.1 },
  'cow-1': { x: 5.3, y: 17.2 },
  'cow-2': { x: 6.4, y: 17.2 },
};

function createQuest(day: number, role: 'farmer' | 'rancher'): DailyQuest {
  if (role === 'farmer') {
    return { status: 'available', target: DAILY_CROPS[(day - 1) % DAILY_CROPS.length], progress: 0, amount: 1 };
  }
  return { status: 'available', target: day % 2 === 0 ? 'milk' : 'egg', progress: 0, amount: 1 };
}

function createAnimal(id: AnimalId): AnimalRecord {
  return {
    id,
    species: ANIMAL_INFO[id].species,
    fed: false,
    petted: false,
    affection: 0,
    product: null,
    discovered: false,
  };
}

export function createInitialVillageLifeState(): VillageLifeState {
  return {
    version: VILLAGE_LIFE_SAVE_VERSION,
    day: 1,
    animals: Object.fromEntries(ANIMAL_IDS.map((id) => [id, createAnimal(id)])) as Record<AnimalId, AnimalRecord>,
    products: { egg: 0, milk: 0, 'golden-egg': 0 },
    discoveredProducts: [],
    discoveredAnimals: [],
    perfectCareStreak: 0,
    perfectCareAwardedDay: null,
    farmerQuest: createQuest(1, 'farmer'),
    rancherQuest: createQuest(1, 'rancher'),
    completedNpcQuests: 0,
    fencePieces: cloneDefaultRanchFencePieces(),
  };
}

function normalizeQuest(value: unknown, fallback: DailyQuest): DailyQuest {
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<DailyQuest>;
  const validStatuses: DailyQuestStatus[] = ['available', 'active', 'ready', 'complete'];
  const target = [...DAILY_CROPS, 'egg', 'milk'].includes(candidate.target as CropType | RanchProduct)
    ? candidate.target as CropType | RanchProduct
    : fallback.target;
  return {
    status: validStatuses.includes(candidate.status as DailyQuestStatus) ? candidate.status as DailyQuestStatus : fallback.status,
    target,
    progress: Math.max(0, Math.min(1, Math.floor(Number(candidate.progress) || 0))),
    amount: 1,
  };
}

function normalizeRanchFencePieces(value: unknown) {
  if (!Array.isArray(value)) return cloneDefaultRanchFencePieces();
  const seen = new Set<string>();
  const pieces: RanchFencePiece[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const candidate = entry as Partial<RanchFencePiece>;
    const x = Number(candidate.x);
    const y = Number(candidate.y);
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x > 31 || y < 0 || y > 21) continue;
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pieces.push(createRanchFencePiece(x, y, candidate.kind === 'gate' ? 'gate' : 'fence'));
    if (pieces.length >= RANCH_FENCE_PIECE_LIMIT) break;
  }
  return pieces;
}

function migrateRanchFencePieces(version: number, value: unknown) {
  if (version === 1) return cloneDefaultRanchFencePieces();
  const pieces = normalizeRanchFencePieces(value);
  const isLegacyDefault = version === 2
    && pieces.length === LEGACY_V2_DEFAULT_RANCH_FENCE_SIGNATURE.size
    && pieces.every((piece) => LEGACY_V2_DEFAULT_RANCH_FENCE_SIGNATURE.has(`${piece.x},${piece.y},${piece.kind}`));
  return isLegacyDefault ? cloneDefaultRanchFencePieces() : pieces;
}

export function normalizeVillageLifeState(value: unknown): VillageLifeState {
  const initial = createInitialVillageLifeState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<Omit<VillageLifeState, 'version'>> & { version?: number };
  if (![1, 2, VILLAGE_LIFE_SAVE_VERSION].includes(Number(candidate.version))) return initial;
  const day = Math.max(1, Math.floor(Number(candidate.day) || 1));
  const candidateAnimals = candidate.animals && typeof candidate.animals === 'object'
    ? candidate.animals as Partial<Record<AnimalId, Partial<AnimalRecord>>>
    : {};
  const animals = Object.fromEntries(ANIMAL_IDS.map((id) => {
    const fallback = createAnimal(id);
    const saved = candidateAnimals[id] ?? {};
    const product = RANCH_PRODUCTS.includes(saved.product as RanchProduct) ? saved.product as RanchProduct : null;
    return [id, {
      ...fallback,
      fed: Boolean(saved.fed),
      petted: Boolean(saved.petted),
      affection: Math.max(0, Math.min(5, Math.floor(Number(saved.affection) || 0))),
      product,
      discovered: Boolean(saved.discovered),
    }];
  })) as Record<AnimalId, AnimalRecord>;
  const productCandidate = candidate.products && typeof candidate.products === 'object'
    ? candidate.products as Partial<Record<RanchProduct, number>>
    : {};
  const products = Object.fromEntries(RANCH_PRODUCTS.map((product) => [
    product,
    Math.max(0, Math.floor(Number(productCandidate[product]) || 0)),
  ])) as Record<RanchProduct, number>;
  const discoveredProducts = RANCH_PRODUCTS.filter((product) => (
    products[product] > 0 || candidate.discoveredProducts?.includes(product)
  ));
  const discoveredAnimals = ANIMAL_IDS.filter((id) => (
    animals[id].discovered || candidate.discoveredAnimals?.includes(id)
  ));

  return {
    version: VILLAGE_LIFE_SAVE_VERSION,
    day,
    animals,
    products,
    discoveredProducts,
    discoveredAnimals,
    perfectCareStreak: Math.max(0, Math.floor(Number(candidate.perfectCareStreak) || 0)),
    perfectCareAwardedDay: typeof candidate.perfectCareAwardedDay === 'number' ? candidate.perfectCareAwardedDay : null,
    farmerQuest: normalizeQuest(candidate.farmerQuest, createQuest(day, 'farmer')),
    rancherQuest: normalizeQuest(candidate.rancherQuest, createQuest(day, 'rancher')),
    completedNpcQuests: Math.max(0, Math.floor(Number(candidate.completedNpcQuests) || 0)),
    fencePieces: migrateRanchFencePieces(Number(candidate.version), candidate.fencePieces),
  };
}

export function loadVillageLifeState(): VillageLifeState {
  if (typeof window === 'undefined') return createInitialVillageLifeState();
  try {
    const saved = window.localStorage.getItem(VILLAGE_LIFE_STORAGE_KEY);
    return saved ? normalizeVillageLifeState(JSON.parse(saved)) : createInitialVillageLifeState();
  } catch {
    return createInitialVillageLifeState();
  }
}

export function persistVillageLifeState(state: VillageLifeState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(VILLAGE_LIFE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The current village session remains playable when storage is unavailable.
  }
}

export function clearRanchState(state: VillageLifeState): VillageLifeState {
  const resetAnimals = Object.fromEntries(ANIMAL_IDS.map((id) => [id, createAnimal(id)])) as Record<AnimalId, AnimalRecord>;
  return {
    ...state,
    animals: resetAnimals,
    products: { egg: 0, milk: 0, 'golden-egg': 0 },
    discoveredProducts: [],
    discoveredAnimals: [],
    perfectCareStreak: 0,
    perfectCareAwardedDay: null,
    rancherQuest: createQuest(state.day, 'rancher'),
    fencePieces: cloneDefaultRanchFencePieces(),
  };
}

export function getLifeNpcPosition(id: LifeNpcId, phase: DayPhase) {
  return NPC_POSITIONS[id][phase];
}

export function getAnimalPosition(id: AnimalId, phase: DayPhase, frame = 0) {
  if (phase === 'night') return NIGHT_ANIMAL_POSITIONS[id];
  const base = DAY_ANIMAL_POSITIONS[id];
  const index = ANIMAL_IDS.indexOf(id);
  const direction = (frame + index) % 2 === 0 ? 1 : -1;
  const phaseOffset = phase === 'dawn' ? -0.16 : phase === 'sunset' ? 0.12 : 0;
  return {
    x: base.x + direction * 0.12,
    y: base.y + phaseOffset,
  };
}

export function getNearestAnimal(player: { x: number; y: number }, phase: DayPhase, frame = 0, maxDistance = 1.5) {
  return ANIMAL_IDS
    .map((id) => ({ id, position: getAnimalPosition(id, phase, frame) }))
    .map((entry) => ({ ...entry, distance: Math.hypot(player.x - entry.position.x, player.y - entry.position.y) }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)[0] ?? null;
}

export function isRanchFenceCell(pieces: RanchFencePiece[], x: number, y: number) {
  return pieces.some((piece) => piece.x === x && piece.y === y);
}

export function isSolidRanchFenceCell(pieces: RanchFencePiece[], x: number, y: number) {
  return pieces.some((piece) => piece.x === x && piece.y === y && piece.kind === 'fence');
}

export function getRanchFenceOrientation(pieces: RanchFencePiece[], x: number, y: number): RanchFenceOrientation {
  const piece = pieces.find((candidate) => candidate.x === x && candidate.y === y);
  if (!piece) return 'horizontal';
  if (piece.kind === 'gate') return 'gate';
  const horizontalNeighbor = isRanchFenceCell(pieces, x - 1, y) || isRanchFenceCell(pieces, x + 1, y);
  const verticalNeighbor = isRanchFenceCell(pieces, x, y - 1) || isRanchFenceCell(pieces, x, y + 1);
  return verticalNeighbor && !horizontalNeighbor ? 'vertical' : 'horizontal';
}

export function placeRanchFencePiece(
  state: VillageLifeState,
  x: number,
  y: number,
  kind: RanchFencePieceKind,
  canPlace: (x: number, y: number) => boolean,
): RanchFenceEditResult {
  if (state.fencePieces.length >= RANCH_FENCE_PIECE_LIMIT) {
    return { state, changed: false, message: `울타리는 최대 ${RANCH_FENCE_PIECE_LIMIT}개까지 설치할 수 있습니다.` };
  }
  if (!Number.isInteger(x) || !Number.isInteger(y) || isRanchFenceCell(state.fencePieces, x, y)) {
    return { state, changed: false, message: '이미 울타리가 있는 자리입니다.' };
  }
  if (!canPlace(x, y)) {
    return { state, changed: false, message: '집, 물, 밭, 동물 또는 다른 물건이 없는 땅에만 설치할 수 있습니다.' };
  }
  const piece = createRanchFencePiece(x, y, kind);
  return {
    state: { ...state, fencePieces: [...state.fencePieces, piece] },
    changed: true,
    message: kind === 'gate' ? '작은 목장 문을 설치했습니다.' : '작은 나무 울타리를 설치했습니다.',
  };
}

export function removeRanchFencePiece(state: VillageLifeState, x: number, y: number): RanchFenceEditResult {
  if (!isRanchFenceCell(state.fencePieces, x, y)) {
    return { state, changed: false, message: '철거할 울타리가 없습니다.' };
  }
  return {
    state: { ...state, fencePieces: state.fencePieces.filter((piece) => piece.x !== x || piece.y !== y) },
    changed: true,
    message: '울타리 조각을 철거했습니다.',
  };
}

export function isRanchAreaCell(x: number, y: number) {
  return x >= RANCH_AREA_BOUNDS.minX
    && x <= RANCH_AREA_BOUNDS.maxX
    && y >= RANCH_AREA_BOUNDS.minY
    && y <= RANCH_AREA_BOUNDS.maxY;
}

export function getAnimalStatus(animal: AnimalRecord, phase: DayPhase): AnimalStatus {
  if (phase === 'night') return 'sleeping';
  if (animal.product) return 'product-ready';
  if (!animal.fed) return 'hungry';
  if (!animal.petted) return 'fed';
  if (animal.fed && animal.petted) return 'happy';
  return 'idle';
}

export function isPerfectCareComplete(state: VillageLifeState) {
  return ANIMAL_IDS.every((id) => state.animals[id].fed && state.animals[id].petted);
}

function replaceAnimal(state: VillageLifeState, animal: AnimalRecord): VillageLifeState {
  const discoveredAnimals = animal.discovered && !state.discoveredAnimals.includes(animal.id)
    ? [...state.discoveredAnimals, animal.id]
    : state.discoveredAnimals;
  return { ...state, animals: { ...state.animals, [animal.id]: animal }, discoveredAnimals };
}

function recordProductQuest(state: VillageLifeState, product: RanchProduct) {
  if (state.rancherQuest.status !== 'active' || state.rancherQuest.target !== product) return state;
  return { ...state, rancherQuest: { ...state.rancherQuest, progress: 1, status: 'ready' } as DailyQuest };
}

export function interactWithAnimal(state: VillageLifeState, id: AnimalId, phase: DayPhase): AnimalInteractionResult {
  const animal = state.animals[id];
  if (phase === 'night') {
    return { state, changed: false, action: 'sleeping', message: `${ANIMAL_INFO[id].name}은(는) 헛간 곁에서 자고 있습니다.`, product: null, firstOfType: false, perfectCare: false };
  }

  if (animal.product) {
    const product = animal.product;
    const firstOfType = state.products[product] === 0;
    const nextAnimal = { ...animal, product: null, discovered: true };
    let nextState = replaceAnimal({
      ...state,
      products: { ...state.products, [product]: state.products[product] + 1 },
      discoveredProducts: firstOfType ? [...state.discoveredProducts, product] : state.discoveredProducts,
    }, nextAnimal);
    nextState = recordProductQuest(nextState, product);
    return {
      state: nextState,
      changed: true,
      action: 'collect',
      message: `${ANIMAL_INFO[id].name}에게서 ${PRODUCT_INFO[product].label}을(를) 얻었습니다.`,
      product,
      firstOfType,
      perfectCare: false,
    };
  }

  if (!animal.fed) {
    const nextState = replaceAnimal(state, { ...animal, fed: true, discovered: true });
    return { state: nextState, changed: true, action: 'feed', message: `${ANIMAL_INFO[id].name}에게 먹이를 주었습니다.`, product: null, firstOfType: false, perfectCare: false };
  }

  if (!animal.petted) {
    const nextState = replaceAnimal(state, { ...animal, petted: true, affection: Math.min(5, animal.affection + 1), discovered: true });
    const perfectCare = isPerfectCareComplete(nextState) && nextState.perfectCareAwardedDay !== nextState.day;
    return {
      state: perfectCare ? { ...nextState, perfectCareAwardedDay: nextState.day } : nextState,
      changed: true,
      action: 'pet',
      message: `${ANIMAL_INFO[id].name}을(를) 쓰다듬었습니다. 친밀도 ${Math.min(5, animal.affection + 1)}/5`,
      product: null,
      firstOfType: false,
      perfectCare,
    };
  }

  return { state, changed: false, action: 'happy', message: `${ANIMAL_INFO[id].name}은(는) 오늘 충분히 돌봄을 받았습니다.`, product: null, firstOfType: false, perfectCare: false };
}

export function advanceVillageDay(state: VillageLifeState): VillageLifeState {
  const perfectCare = isPerfectCareComplete(state);
  const nextStreak = perfectCare ? state.perfectCareStreak + 1 : 0;
  const goldenEggDay = perfectCare && nextStreak > 0 && nextStreak % 3 === 0;
  let goldenAssigned = false;
  const animals = Object.fromEntries(ANIMAL_IDS.map((id) => {
    const animal = state.animals[id];
    let product: RanchProduct | null = null;
    if (animal.fed) {
      if (ANIMAL_INFO[id].species === 'chicken' && goldenEggDay && !goldenAssigned) {
        product = 'golden-egg';
        goldenAssigned = true;
      } else {
        product = ANIMAL_INFO[id].product;
      }
    }
    return [id, { ...animal, fed: false, petted: false, product }];
  })) as Record<AnimalId, AnimalRecord>;
  const day = state.day + 1;

  return {
    ...state,
    day,
    animals,
    perfectCareStreak: nextStreak,
    perfectCareAwardedDay: null,
    farmerQuest: state.farmerQuest.status === 'active' || state.farmerQuest.status === 'ready'
      ? state.farmerQuest
      : createQuest(day, 'farmer'),
    rancherQuest: state.rancherQuest.status === 'active' || state.rancherQuest.status === 'ready'
      ? state.rancherQuest
      : createQuest(day, 'rancher'),
  };
}

export function recordCropHarvestForQuest(state: VillageLifeState, crop: CropType) {
  if (state.farmerQuest.status !== 'active' || state.farmerQuest.target !== crop) return state;
  return { ...state, farmerQuest: { ...state.farmerQuest, progress: 1, status: 'ready' } as DailyQuest };
}

export function getNpcQuest(state: VillageLifeState, id: LifeNpcId) {
  return id === 'farmer-hana' ? state.farmerQuest : state.rancherQuest;
}

function getQuestTargetLabel(quest: DailyQuest) {
  if (quest.target === 'egg' || quest.target === 'milk' || quest.target === 'golden-egg') {
    return PRODUCT_INFO[quest.target].label;
  }
  const cropLabels: Record<'tomato' | 'corn' | 'pumpkin', string> = {
    tomato: '토마토',
    corn: '옥수수',
    pumpkin: '호박',
  };
  return cropLabels[quest.target as 'tomato' | 'corn' | 'pumpkin'] ?? String(quest.target);
}

export function interactWithLifeNpc(state: VillageLifeState, id: LifeNpcId, phase: DayPhase): NpcInteractionResult {
  const questKey = id === 'farmer-hana' ? 'farmerQuest' : 'rancherQuest';
  const quest = state[questKey];
  const target = getQuestTargetLabel(quest);
  const phaseGreeting: Record<DayPhase, string> = {
    dawn: '아침 공기가 좋아요. 오늘 할 일을 천천히 시작해 봐요.',
    day: '햇빛이 충분하니 밭과 목장을 돌보기 좋은 시간이에요.',
    sunset: '해가 지기 전에 오늘의 수확과 돌봄을 확인해 봐요.',
    night: '동물들은 쉬고 있어요. 내일 아침에 다시 만나요.',
  };

  if (quest.status === 'available') {
    const nextQuest = { ...quest, status: 'active' } as DailyQuest;
    return {
      state: { ...state, [questKey]: nextQuest },
      completed: false,
      lines: [phaseGreeting[phase], `오늘의 부탁: ${target} 1개를 준비해 주세요.`],
    };
  }
  if (quest.status === 'ready') {
    const nextQuest = { ...quest, status: 'complete' } as DailyQuest;
    return {
      state: { ...state, [questKey]: nextQuest, completedNpcQuests: state.completedNpcQuests + 1 },
      completed: true,
      lines: [`${target}을(를) 확인했어요. 오늘의 부탁을 완수했습니다!`, '마을 기록에 오늘의 생활 루프가 하나 추가됐습니다.'],
    };
  }
  if (quest.status === 'complete') {
    return { state, completed: false, lines: [phaseGreeting[phase], '오늘의 부탁은 이미 끝났어요. 남은 시간은 자유롭게 보내세요.'] };
  }
  return {
    state,
    completed: false,
    lines: [phaseGreeting[phase], `${target} 준비 현황 ${quest.progress}/${quest.amount}.`],
  };
}

export function getTotalRanchProducts(state: VillageLifeState) {
  return RANCH_PRODUCTS.reduce((total, product) => total + state.products[product], 0);
}

export function getAnimalSprite(id: AnimalId, phase: DayPhase, frame: number, status?: AnimalStatus) {
  const species = ANIMAL_INFO[id].species;
  const state = phase === 'night'
    ? 'sleeping'
    : status === 'happy' || status === 'product-ready'
      ? status
      : 'idle';
  return getAnimalRemasterSprite(species, state, frame);
}
