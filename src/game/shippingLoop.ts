import type { CropQuality, CropType, FarmState } from './farmLoop';
import type { FishId, FishingState } from './fishingLoop';
import type { ForageItemId, ForagingState } from './foragingLoop';
import type { RanchProduct, VillageLifeState } from './villageLife';

export type ShippingItemId =
  | `crop:${CropType}:${CropQuality}`
  | `fish:${FishId}`
  | `product:${RanchProduct}`
  | `forage:${ForageItemId}`;

export type ShippingReceiptLine = {
  itemId: ShippingItemId;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type ShippingReceipt = {
  day: number;
  lines: ShippingReceiptLine[];
  total: number;
  settledAt: number;
};

export type ShippingState = {
  version: 1;
  day: number;
  entries: Partial<Record<ShippingItemId, number>>;
  lastSettlement: ShippingReceipt | null;
};

export type ShippingInventorySources = {
  farm: FarmState;
  fishing: FishingState;
  villageLife: VillageLifeState;
  foraging: ForagingState;
};

export const SHIPPING_STORAGE_KEY = 'mossbell-shipping-v1';
export const SHIPPING_SAVE_VERSION = 1;

const CROP_IDS = new Set(['potato', 'strawberry', 'carrot', 'tomato', 'corn', 'pumpkin']);
const QUALITY_IDS = new Set(['normal', 'silver', 'gold']);
const FISH_IDS = new Set(['bluegill', 'carp', 'perch', 'koi', 'moonfin', 'river-trout', 'silver-dace', 'night-eel', 'shore-sardine', 'coral-bream', 'tide-ray', 'blossom-dace', 'sunscale-bass', 'ember-carp', 'frostfin']);
const PRODUCT_IDS = new Set(['egg', 'milk', 'golden-egg']);
const FORAGE_IDS = new Set(['mushroom', 'herb', 'wild-berry', 'fern', 'moon-bloom', 'stone', 'copper-ore', 'iron-ore', 'star-crystal']);

function whole(value: unknown, max = 999) {
  return Math.max(0, Math.min(max, Math.floor(Number(value) || 0)));
}

function isShippingItemId(value: string): value is ShippingItemId {
  const [category, item, quality, extra] = value.split(':');
  if (extra !== undefined) return false;
  if (category === 'crop') return CROP_IDS.has(item) && QUALITY_IDS.has(quality);
  if (quality !== undefined) return false;
  if (category === 'fish') return FISH_IDS.has(item);
  if (category === 'product') return PRODUCT_IDS.has(item);
  if (category === 'forage') return FORAGE_IDS.has(item);
  return false;
}

export function createInitialShippingState(day = 1): ShippingState {
  return { version: SHIPPING_SAVE_VERSION, day: Math.max(1, whole(day, 999_999)), entries: {}, lastSettlement: null };
}

export function normalizeShippingState(value: unknown, fallbackDay = 1): ShippingState {
  const initial = createInitialShippingState(fallbackDay);
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<ShippingState>;
  if (Number(candidate.version) !== SHIPPING_SAVE_VERSION) return initial;
  const sourceEntries = candidate.entries && typeof candidate.entries === 'object'
    ? candidate.entries as Record<string, unknown>
    : {};
  const entries = Object.fromEntries(Object.entries(sourceEntries)
    .filter(([id]) => isShippingItemId(id))
    .map(([id, quantity]) => [id, whole(quantity)])
    .filter(([, quantity]) => Number(quantity) > 0)) as Partial<Record<ShippingItemId, number>>;
  const receiptCandidate = candidate.lastSettlement && typeof candidate.lastSettlement === 'object'
    ? candidate.lastSettlement as Partial<ShippingReceipt>
    : null;
  const receiptLines = receiptCandidate && Array.isArray(receiptCandidate.lines)
    ? receiptCandidate.lines.flatMap((value) => {
      if (!value || typeof value !== 'object') return [];
      const line = value as Partial<ShippingReceiptLine>;
      if (typeof line.itemId !== 'string' || !isShippingItemId(line.itemId)) return [];
      const quantity = whole(line.quantity);
      const unitPrice = whole(line.unitPrice, 999_999);
      if (quantity <= 0 || unitPrice <= 0) return [];
      return [{ itemId: line.itemId, quantity, unitPrice, subtotal: Math.min(9_999_999, quantity * unitPrice) }];
    })
    : [];
  const receiptTotal = Math.min(9_999_999, receiptLines.reduce((total, line) => total + line.subtotal, 0));
  return {
    version: SHIPPING_SAVE_VERSION,
    day: Math.max(1, whole(candidate.day, 999_999) || fallbackDay),
    entries,
    lastSettlement: receiptCandidate && receiptLines.length > 0 && receiptTotal > 0
      ? {
        day: Math.max(1, whole(receiptCandidate.day, 999_999) || fallbackDay),
        lines: receiptLines,
        total: receiptTotal,
        settledAt: Number(receiptCandidate.settledAt) || 0,
      }
      : null,
  };
}

export function loadShippingState(day = 1): ShippingState {
  if (typeof window === 'undefined') return createInitialShippingState(day);
  try {
    const saved = window.localStorage.getItem(SHIPPING_STORAGE_KEY);
    return saved ? normalizeShippingState(JSON.parse(saved), day) : createInitialShippingState(day);
  } catch {
    return createInitialShippingState(day);
  }
}

export function persistShippingState(state: ShippingState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(state));
}

export function clearShippingState(day = 1) {
  if (typeof window !== 'undefined') window.localStorage.removeItem(SHIPPING_STORAGE_KEY);
  return createInitialShippingState(day);
}

export function getPendingQuantity(state: ShippingState, itemId: ShippingItemId) {
  return whole(state.entries[itemId]);
}

export function addToShipment(state: ShippingState, itemId: ShippingItemId, available: number, quantity = 1) {
  const current = getPendingQuantity(state, itemId);
  const maximum = whole(available);
  const amount = Math.min(Math.max(1, whole(quantity) || 1), Math.max(0, maximum - current));
  if (amount <= 0) return { state, changed: false, quantity: current };
  const nextQuantity = current + amount;
  return { state: { ...state, entries: { ...state.entries, [itemId]: nextQuantity } }, changed: true, quantity: nextQuantity };
}

export function removeFromShipment(state: ShippingState, itemId: ShippingItemId, quantity = 1) {
  const current = getPendingQuantity(state, itemId);
  const amount = Math.min(current, Math.max(1, whole(quantity) || 1));
  if (amount <= 0) return { state, changed: false, quantity: current };
  const entries = { ...state.entries };
  const nextQuantity = current - amount;
  if (nextQuantity > 0) entries[itemId] = nextQuantity;
  else delete entries[itemId];
  return { state: { ...state, entries }, changed: true, quantity: nextQuantity };
}

export function reconcileShipment(state: ShippingState, available: Partial<Record<ShippingItemId, number>>) {
  const entries = Object.fromEntries(Object.entries(state.entries)
    .map(([id, quantity]) => [id, Math.min(whole(quantity), whole(available[id as ShippingItemId]))])
    .filter(([, quantity]) => Number(quantity) > 0)) as Partial<Record<ShippingItemId, number>>;
  return { ...state, entries };
}

export function getShippingAvailability(sources: ShippingInventorySources) {
  const available: Partial<Record<ShippingItemId, number>> = {};
  for (const [crop, qualities] of Object.entries(sources.farm.qualityInventory)) {
    for (const [quality, quantity] of Object.entries(qualities)) {
      available[`crop:${crop}:${quality}` as ShippingItemId] = whole(quantity);
    }
  }
  for (const [fish, quantity] of Object.entries(sources.fishing.inventory)) {
    available[`fish:${fish}` as ShippingItemId] = whole(quantity);
  }
  for (const [product, quantity] of Object.entries(sources.villageLife.products)) {
    available[`product:${product}` as ShippingItemId] = whole(quantity);
  }
  for (const [item, quantity] of Object.entries(sources.foraging.inventory)) {
    available[`forage:${item}` as ShippingItemId] = whole(quantity);
  }
  return available;
}

export function deductSettlementInventory(sources: ShippingInventorySources, receipt: ShippingReceipt) {
  const farm = {
    ...sources.farm,
    inventory: { ...sources.farm.inventory },
    qualityInventory: Object.fromEntries(Object.entries(sources.farm.qualityInventory)
      .map(([crop, qualities]) => [crop, { ...qualities }])) as FarmState['qualityInventory'],
  };
  const fishing = { ...sources.fishing, inventory: { ...sources.fishing.inventory } };
  const villageLife = { ...sources.villageLife, products: { ...sources.villageLife.products } };
  const foraging = { ...sources.foraging, inventory: { ...sources.foraging.inventory } };

  for (const line of receipt.lines) {
    const [category, item, quality] = line.itemId.split(':');
    if (category === 'crop') {
      const crop = item as CropType;
      const cropQuality = quality as CropQuality;
      const amount = Math.min(line.quantity, whole(farm.qualityInventory[crop]?.[cropQuality]));
      if (farm.qualityInventory[crop]) farm.qualityInventory[crop][cropQuality] -= amount;
      if (crop in farm.inventory) farm.inventory[crop] = Math.max(0, farm.inventory[crop] - amount);
    } else if (category === 'fish') {
      const fish = item as FishId;
      if (fish in fishing.inventory) fishing.inventory[fish] = Math.max(0, fishing.inventory[fish] - line.quantity);
    } else if (category === 'product') {
      const product = item as RanchProduct;
      if (product in villageLife.products) villageLife.products[product] = Math.max(0, villageLife.products[product] - line.quantity);
    } else if (category === 'forage') {
      const forageItem = item as ForageItemId;
      if (forageItem in foraging.inventory) foraging.inventory[forageItem] = Math.max(0, foraging.inventory[forageItem] - line.quantity);
    }
  }

  return { farm, fishing, villageLife, foraging };
}

export function settleShipment(state: ShippingState, nextDay: number, getUnitPrice: (itemId: string) => number, settledAt = Date.now()) {
  const day = Math.max(1, whole(nextDay, 999_999));
  if (day <= state.day) return { state, settlement: null, changed: false };
  const lines = Object.entries(state.entries).map(([itemId, quantity]) => {
    const amount = whole(quantity);
    const unitPrice = whole(getUnitPrice(itemId), 999_999);
    return { itemId: itemId as ShippingItemId, quantity: amount, unitPrice, subtotal: amount * unitPrice };
  }).filter((line) => line.quantity > 0 && line.unitPrice > 0);
  if (lines.length === 0) return { state: { ...state, day, entries: {} }, settlement: null, changed: true };
  const settlement: ShippingReceipt = {
    day,
    lines,
    total: lines.reduce((total, line) => total + line.subtotal, 0),
    settledAt,
  };
  return { state: { ...state, day, entries: {}, lastSettlement: settlement }, settlement, changed: true };
}
