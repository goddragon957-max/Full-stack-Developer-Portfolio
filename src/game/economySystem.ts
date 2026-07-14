import type { CropQuality, CropType } from './farmLoop';
import type { FishId } from './fishingLoop';
import type { ForageItemId } from './foragingLoop';
import type { RanchProduct } from './villageLife';

export type EconomyMilestone = 'first-shipment' | 'earn-1000' | 'master-tools';
export type EconomyShippingItemId =
  | `crop:${CropType}:${CropQuality}`
  | `fish:${FishId}`
  | `product:${RanchProduct}`
  | `forage:${ForageItemId}`;

export type EconomyState = {
  version: 1;
  gold: number;
  lifetimeEarnings: number;
  seedInventory: Record<CropType, number>;
  feed: number;
  milestones: EconomyMilestone[];
  migrationGrantClaimed: boolean;
};

export type EconomyActionResult = {
  state: EconomyState;
  changed: boolean;
  cost: number;
  message: string;
};

export const ECONOMY_STORAGE_KEY = 'mossbell-economy-v1';
export const ECONOMY_SAVE_VERSION = 1;
export const STARTING_GOLD = 360;
export const FEED_PRICE = 12;

export const SEED_PRICES: Record<CropType, number> = {
  potato: 20,
  strawberry: 35,
  carrot: 25,
  tomato: 30,
  corn: 40,
  pumpkin: 55,
};

export const STARTER_SEEDS: Record<CropType, number> = {
  potato: 4,
  strawberry: 3,
  carrot: 4,
  tomato: 3,
  corn: 2,
  pumpkin: 2,
};

const CROP_SHIPPING_PRICES: Record<CropType, number> = {
  potato: 35,
  strawberry: 55,
  carrot: 40,
  tomato: 50,
  corn: 65,
  pumpkin: 90,
};

const QUALITY_MULTIPLIERS: Record<CropQuality, number> = {
  normal: 1,
  silver: 1.35,
  gold: 1.8,
};

const FISH_SHIPPING_PRICES: Record<FishId, number> = {
  bluegill: 35,
  carp: 40,
  perch: 45,
  koi: 95,
  moonfin: 220,
  'river-trout': 70,
  'silver-dace': 85,
  'night-eel': 180,
  'shore-sardine': 55,
  'coral-bream': 130,
  'tide-ray': 260,
  'blossom-dace': 150,
  'sunscale-bass': 165,
  'ember-carp': 180,
  frostfin: 235,
};

const PRODUCT_SHIPPING_PRICES: Record<RanchProduct, number> = {
  egg: 35,
  milk: 60,
  'golden-egg': 600,
};

const FORAGE_SHIPPING_PRICES: Record<ForageItemId, number> = {
  mushroom: 28,
  herb: 24,
  'wild-berry': 32,
  fern: 36,
  'moon-bloom': 150,
  stone: 12,
  'copper-ore': 48,
  'iron-ore': 75,
  'star-crystal': 380,
};

const CROPS = Object.keys(SEED_PRICES) as CropType[];
const MILESTONES: EconomyMilestone[] = ['first-shipment', 'earn-1000', 'master-tools'];

function count(value: unknown, max = 9999) {
  return Math.max(0, Math.min(max, Math.floor(Number(value) || 0)));
}

export function createInitialEconomyState(): EconomyState {
  return {
    version: ECONOMY_SAVE_VERSION,
    gold: STARTING_GOLD,
    lifetimeEarnings: 0,
    seedInventory: { ...STARTER_SEEDS },
    feed: 5,
    milestones: [],
    migrationGrantClaimed: true,
  };
}

export function normalizeEconomyState(value: unknown): EconomyState {
  const initial = createInitialEconomyState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<EconomyState>;
  if (Number(candidate.version) !== ECONOMY_SAVE_VERSION) return initial;
  const seeds = candidate.seedInventory && typeof candidate.seedInventory === 'object'
    ? candidate.seedInventory as Partial<Record<CropType, unknown>>
    : {};
  const milestones = Array.isArray(candidate.milestones)
    ? [...new Set(candidate.milestones.filter((item): item is EconomyMilestone => MILESTONES.includes(item as EconomyMilestone)))]
    : [];
  return {
    version: ECONOMY_SAVE_VERSION,
    gold: count(candidate.gold, 9_999_999),
    lifetimeEarnings: count(candidate.lifetimeEarnings, 99_999_999),
    seedInventory: Object.fromEntries(CROPS.map((crop) => [crop, count(seeds[crop], 999)])) as Record<CropType, number>,
    feed: count(candidate.feed, 999),
    milestones,
    migrationGrantClaimed: Boolean(candidate.migrationGrantClaimed),
  };
}

export function loadEconomyState(): EconomyState {
  if (typeof window === 'undefined') return createInitialEconomyState();
  try {
    const saved = window.localStorage.getItem(ECONOMY_STORAGE_KEY);
    return saved ? normalizeEconomyState(JSON.parse(saved)) : createInitialEconomyState();
  } catch {
    return createInitialEconomyState();
  }
}

export function persistEconomyState(state: EconomyState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ECONOMY_STORAGE_KEY, JSON.stringify(state));
}

export function clearEconomyState() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(ECONOMY_STORAGE_KEY);
  return createInitialEconomyState();
}

function purchase(state: EconomyState, quantity: number, unitPrice: number, apply: (next: EconomyState, amount: number) => EconomyState, label: string): EconomyActionResult {
  const amount = Math.max(1, Math.min(99, Math.floor(quantity) || 1));
  const cost = amount * unitPrice;
  if (state.gold < cost) {
    return { state, changed: false, cost, message: `${label} 구매에 ${cost} GOLD가 필요합니다.` };
  }
  const paid = { ...state, gold: state.gold - cost };
  return { state: apply(paid, amount), changed: true, cost, message: `${label} ${amount}개를 ${cost} GOLD에 구매했습니다.` };
}

export function purchaseSeed(state: EconomyState, crop: CropType, quantity: number): EconomyActionResult {
  return purchase(state, quantity, SEED_PRICES[crop], (next, amount) => ({
    ...next,
    seedInventory: { ...next.seedInventory, [crop]: Math.min(999, next.seedInventory[crop] + amount) },
  }), `${crop.toUpperCase()} SEED`);
}

export function purchaseFeed(state: EconomyState, quantity: number): EconomyActionResult {
  return purchase(state, quantity, FEED_PRICE, (next, amount) => ({ ...next, feed: Math.min(999, next.feed + amount) }), 'ANIMAL FEED');
}

export function spendGold(state: EconomyState, amount: number): EconomyState | null {
  const cost = count(amount, 9_999_999);
  return state.gold >= cost ? { ...state, gold: state.gold - cost } : null;
}

export function consumeSeed(state: EconomyState, crop: CropType): EconomyState | null {
  if (state.seedInventory[crop] <= 0) return null;
  return { ...state, seedInventory: { ...state.seedInventory, [crop]: state.seedInventory[crop] - 1 } };
}

export function consumeFeed(state: EconomyState): EconomyState | null {
  if (state.feed <= 0) return null;
  return { ...state, feed: state.feed - 1 };
}

function unlockMilestones(state: EconomyState, candidates: EconomyMilestone[]) {
  const unlocked = candidates.filter((milestone) => !state.milestones.includes(milestone));
  return {
    state: unlocked.length ? { ...state, milestones: [...state.milestones, ...unlocked] } : state,
    unlocked,
  };
}

export function applySettlementEarnings(state: EconomyState, total: number) {
  const earnings = count(total, 9_999_999);
  if (earnings <= 0) return { state, unlocked: [] as EconomyMilestone[] };
  const next = {
    ...state,
    gold: Math.min(9_999_999, state.gold + earnings),
    lifetimeEarnings: Math.min(99_999_999, state.lifetimeEarnings + earnings),
  };
  const candidates: EconomyMilestone[] = ['first-shipment'];
  if (next.lifetimeEarnings >= 1000) candidates.push('earn-1000');
  return unlockMilestones(next, candidates);
}

export function syncProgressionMilestones(state: EconomyState, allToolsMaxed: boolean) {
  return unlockMilestones(state, allToolsMaxed ? ['master-tools'] : []);
}

export function getShippingUnitPrice(itemId: string): number {
  const [category, item, quality] = itemId.split(':');
  if (category === 'crop' && item in CROP_SHIPPING_PRICES && quality in QUALITY_MULTIPLIERS) {
    return Math.round(CROP_SHIPPING_PRICES[item as CropType] * QUALITY_MULTIPLIERS[quality as CropQuality]);
  }
  if (category === 'fish' && item in FISH_SHIPPING_PRICES) return FISH_SHIPPING_PRICES[item as FishId];
  if (category === 'product' && item in PRODUCT_SHIPPING_PRICES) return PRODUCT_SHIPPING_PRICES[item as RanchProduct];
  if (category === 'forage' && item in FORAGE_SHIPPING_PRICES) return FORAGE_SHIPPING_PRICES[item as ForageItemId];
  return 0;
}
