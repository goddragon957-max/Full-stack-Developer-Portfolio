export type InteriorId = 'farmhouse' | 'shop' | 'barn' | 'hana-cottage' | 'jun-cottage';

export type InteriorInteractionId =
  | 'exitDoor'
  | 'farmhouseBed'
  | 'farmhouseChest'
  | 'farmhouseHearth'
  | 'farmhouseKitchen'
  | 'farmhouseTable'
  | 'shopSeedShelf'
  | 'shopCounter'
  | 'shopSackShelf'
  | 'barnStalls'
  | 'barnFeedBin'
  | 'barnProductShelf'
  | 'hanaBed'
  | 'hanaGardenDesk'
  | 'hanaStove'
  | 'junBed'
  | 'junHearth'
  | 'junRanchShelf'
  | 'junTable';

export type InteriorInteraction = {
  id: InteriorInteractionId;
  kind: 'exit' | 'bed' | 'storage' | 'inspect' | 'seeds' | 'feed';
  name: string;
  label: string;
  prompt: string;
  dialogue: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  range: number;
  solid: boolean;
};

export type InteriorInfo = {
  label: string;
  shortLabel: string;
  mapAsset: string;
  entry: { x: number; y: number; facing: 'up' };
  outsideReturn: { x: number; y: number; facing: 'down' | 'up' };
  interactions: InteriorInteraction[];
};

export type InteriorSave = {
  version: 1;
  currentInterior: InteriorId | null;
};

export const INTERIOR_STORAGE_KEY = 'mossbell-interior-v1';
export const INTERIOR_IDS: InteriorId[] = ['farmhouse', 'shop', 'barn', 'hana-cottage', 'jun-cottage'];
export const INTERIOR_WORLD_WIDTH = 24;
export const INTERIOR_WORLD_HEIGHT = 16;

const exitDoor = (): InteriorInteraction => ({
  id: 'exitDoor',
  kind: 'exit',
  name: 'Front Door',
  label: 'LEAVE',
  prompt: '마을로 돌아가는 문이다.',
  dialogue: ['문을 열면 농장 마을의 바람이 들어온다.'],
  x: 11,
  y: 14,
  w: 2,
  h: 2,
  range: 2,
  solid: false,
});

export const BUILDING_INTERIORS: Record<string, InteriorId> = {
  farmhouse: 'farmhouse',
  workshop: 'shop',
  barn: 'barn',
  hanaCottage: 'hana-cottage',
  junCottage: 'jun-cottage',
};

export const INTERIOR_INFO: Record<InteriorId, InteriorInfo> = {
  farmhouse: {
    label: 'Mossbell Farmhouse',
    shortLabel: 'HOME',
    mapAsset: '/assets/art-remaster-v1/maps/farmhouse-interior.png',
    entry: { x: 11, y: 13, facing: 'up' },
    outsideReturn: { x: 5, y: 6, facing: 'down' },
    interactions: [
      exitDoor(),
      { id: 'farmhouseBed', kind: 'bed', name: 'Farmhouse Bed', label: 'REST', prompt: '포근한 침대다. 쉬면 다음 날 아침이 된다.', dialogue: ['이불에서 햇볕과 마른 풀 냄새가 난다.'], x: 3, y: 2, w: 5, h: 6, range: 2.4, solid: true },
      { id: 'farmhouseChest', kind: 'storage', name: 'Storage Chest', label: 'STORAGE', prompt: '수확 도구와 씨앗을 보관하는 튼튼한 상자다.', dialogue: ['상자 안이 종류별 씨앗과 손질한 도구로 가지런하다.'], x: 2, y: 11, w: 4, h: 3, range: 2.4, solid: true },
      { id: 'farmhouseHearth', kind: 'inspect', name: 'Stone Hearth', label: 'HEARTH', prompt: '작은 장작불이 집을 따뜻하게 데운다.', dialogue: ['불꽃이 잔잔하게 흔들리고 주전자에서 김이 오른다.'], x: 13, y: 2, w: 4, h: 5, range: 2.4, solid: true },
      { id: 'farmhouseKitchen', kind: 'inspect', name: 'Farm Kitchen', label: 'KITCHEN', prompt: '오늘 수확한 재료를 손질하는 부엌이다.', dialogue: ['선반에는 빈 병과 잘 말린 허브가 놓여 있다.'], x: 18, y: 2, w: 4, h: 5, range: 2.4, solid: true },
      { id: 'farmhouseTable', kind: 'inspect', name: 'Dining Table', label: 'TABLE', prompt: '마을에서 가져온 꽃이 놓인 식탁이다.', dialogue: ['의자를 당기면 하루 일을 천천히 정리할 수 있을 것 같다.'], x: 18, y: 8, w: 4, h: 5, range: 2.4, solid: true },
    ],
  },
  shop: {
    label: 'Mossbell Seed Shop',
    shortLabel: 'SHOP',
    mapAsset: '/assets/art-remaster-v1/maps/shop-interior.png',
    entry: { x: 11, y: 13, facing: 'up' },
    outsideReturn: { x: 14, y: 6, facing: 'down' },
    interactions: [
      exitDoor(),
      { id: 'shopSeedShelf', kind: 'seeds', name: 'Seed Shelves', label: 'SEEDS', prompt: '계절마다 심기 좋은 씨앗이 정리되어 있다.', dialogue: ['감자, 딸기, 당근, 토마토, 옥수수, 호박 씨앗이 칸마다 놓여 있다.'], x: 2, y: 2, w: 8, h: 5, range: 2.6, solid: true },
      { id: 'shopCounter', kind: 'inspect', name: 'Shop Counter', label: 'COUNTER', prompt: '주문과 포장을 받는 나무 계산대다.', dialogue: ['오늘은 마을 주민을 위한 씨앗 꾸러미가 준비되어 있다.'], x: 12, y: 4, w: 10, h: 4, range: 2.5, solid: true },
      { id: 'shopSackShelf', kind: 'storage', name: 'Produce Shelf', label: 'SHELF', prompt: '말린 허브와 흙 자루가 벽 쪽에 쌓여 있다.', dialogue: ['모든 자루에 향긋한 들풀 냄새가 밴 듯하다.'], x: 2, y: 9, w: 4, h: 4, range: 2.4, solid: true },
    ],
  },
  barn: {
    label: 'Mossbell Barn',
    shortLabel: 'BARN',
    mapAsset: '/assets/art-remaster-v1/maps/barn-interior.png',
    entry: { x: 11, y: 13, facing: 'up' },
    outsideReturn: { x: 6, y: 21, facing: 'up' },
    interactions: [
      exitDoor(),
      { id: 'barnStalls', kind: 'inspect', name: 'Animal Stalls', label: 'STALLS', prompt: '밤이면 닭과 소가 편히 쉬는 깨끗한 우리다.', dialogue: ['짚이 새로 깔려 있고 물통도 가득 차 있다.'], x: 5, y: 2, w: 14, h: 5, range: 2.8, solid: true },
      { id: 'barnFeedBin', kind: 'feed', name: 'Feed Trough', label: 'FEED', prompt: '오늘 사용할 사료가 담긴 긴 여물통이다.', dialogue: ['곡물과 마른 풀이 알맞게 섞여 있다.'], x: 20, y: 5, w: 2, h: 6, range: 2.4, solid: true },
      { id: 'barnProductShelf', kind: 'storage', name: 'Dairy Shelf', label: 'RANCH', prompt: '달걀과 우유를 잠시 보관하는 서늘한 선반이다.', dialogue: ['오늘 모은 생산품은 목장 가방에서 확인할 수 있다.'], x: 2, y: 10, w: 4, h: 4, range: 2.4, solid: true },
    ],
  },
  'hana-cottage': {
    label: "Hana's Cottage",
    shortLabel: 'HANA',
    mapAsset: '/assets/art-remaster-v1/maps/hana-cottage-interior.png',
    entry: { x: 11, y: 13, facing: 'up' },
    outsideReturn: { x: 22, y: 6, facing: 'down' },
    interactions: [
      exitDoor(),
      { id: 'hanaBed', kind: 'bed', name: "Hana's Bed", label: 'BED', prompt: '들꽃 무늬 이불이 단정하게 정리되어 있다.', dialogue: ['창가에 작은 노란 꽃병이 놓여 있다.'], x: 3, y: 2, w: 5, h: 6, range: 2.4, solid: true },
      { id: 'hanaGardenDesk', kind: 'seeds', name: 'Gardening Desk', label: 'GARDEN', prompt: '화분과 씨앗병이 가득한 원예 작업대다.', dialogue: ['하나는 내일 심을 씨앗을 미리 골라 둔 모양이다.'], x: 12, y: 2, w: 8, h: 4, range: 2.4, solid: true },
      { id: 'hanaStove', kind: 'inspect', name: 'Iron Stove', label: 'STOVE', prompt: '초록 주전자가 얹힌 작은 난로다.', dialogue: ['허브차가 천천히 끓으며 방 안에 향을 채운다.'], x: 18, y: 6, w: 4, h: 5, range: 2.4, solid: true },
    ],
  },
  'jun-cottage': {
    label: "Jun's Cottage",
    shortLabel: 'JUN',
    mapAsset: '/assets/art-remaster-v1/maps/jun-cottage-interior.png',
    entry: { x: 11, y: 13, facing: 'up' },
    outsideReturn: { x: 29, y: 21, facing: 'up' },
    interactions: [
      exitDoor(),
      { id: 'junBed', kind: 'bed', name: "Jun's Bed", label: 'BED', prompt: '붉은 누비이불이 포근하게 덮여 있다.', dialogue: ['침대 곁에는 이른 아침에 신을 장화가 놓여 있다.'], x: 3, y: 2, w: 5, h: 6, range: 2.4, solid: true },
      { id: 'junHearth', kind: 'inspect', name: 'Cottage Fireplace', label: 'FIRE', prompt: '두꺼운 돌벽난로에서 장작이 타고 있다.', dialogue: ['밖에서 돌아온 뒤 손을 녹이기 좋은 자리다.'], x: 14, y: 2, w: 5, h: 5, range: 2.4, solid: true },
      { id: 'junRanchShelf', kind: 'storage', name: 'Ranch Shelf', label: 'TOOLS', prompt: '목장 도구와 우유통이 벽에 정리되어 있다.', dialogue: ['모든 도구가 다음 돌봄을 기다리며 반짝인다.'], x: 19, y: 8, w: 3, h: 5, range: 2.4, solid: true },
      { id: 'junTable', kind: 'inspect', name: 'Bluecloth Table', label: 'TABLE', prompt: '들꽃 화병이 놓인 작은 식탁이다.', dialogue: ['준은 하루가 끝나면 이곳에서 목장 수첩을 정리한다.'], x: 14, y: 9, w: 5, h: 4, range: 2.4, solid: true },
    ],
  },
};

const COMMON_BLOCKED_RECTS = [
  { x: 0, y: 0, w: 24, h: 2 },
  { x: 0, y: 2, w: 2, h: 14 },
  { x: 22, y: 2, w: 2, h: 14 },
  { x: 0, y: 15, w: 10, h: 1 },
  { x: 14, y: 15, w: 8, h: 1 },
];

export function getInteriorIdForBuilding(buildingId: string) {
  return BUILDING_INTERIORS[buildingId] ?? null;
}

export function isInteriorBlocked(interiorId: InteriorId, x: number, y: number) {
  if (COMMON_BLOCKED_RECTS.some((rect) => x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h)) return true;
  return INTERIOR_INFO[interiorId].interactions.some((interaction) => interaction.solid
    && x >= interaction.x && x < interaction.x + interaction.w
    && y >= interaction.y && y < interaction.y + interaction.h);
}

export function normalizeInteriorSave(value: unknown): InteriorSave {
  if (!value || typeof value !== 'object') return { version: 1, currentInterior: null };
  const candidate = value as Partial<InteriorSave>;
  const currentInterior = INTERIOR_IDS.includes(candidate.currentInterior as InteriorId)
    ? candidate.currentInterior as InteriorId
    : null;
  return { version: 1, currentInterior };
}

export function loadInteriorSave(): InteriorSave {
  if (typeof window === 'undefined') return { version: 1, currentInterior: null };
  try {
    const saved = window.localStorage.getItem(INTERIOR_STORAGE_KEY);
    return saved ? normalizeInteriorSave(JSON.parse(saved)) : { version: 1, currentInterior: null };
  } catch {
    return { version: 1, currentInterior: null };
  }
}

export function persistInteriorSave(currentInterior: InteriorId | null) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INTERIOR_STORAGE_KEY, JSON.stringify({ version: 1, currentInterior } satisfies InteriorSave));
  } catch {
    // A storage failure should not block entering or leaving a building.
  }
}
