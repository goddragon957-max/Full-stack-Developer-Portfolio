import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function loadTypeScript(path) {
  assert(existsSync(path), `${path} must exist`);
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: path,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

const economy = await loadTypeScript('src/game/economySystem.ts');
const shipping = await loadTypeScript('src/game/shippingLoop.ts');
const tools = await loadTypeScript('src/game/toolProgression.ts');

const initialEconomy = economy.createInitialEconomyState();
assert(initialEconomy.gold === economy.STARTING_GOLD && initialEconomy.gold > 0, 'New games need balanced starting GOLD');
assert(Object.values(initialEconomy.seedInventory).every((count) => count > 0), 'Starter seed pack must include all six crops');
assert(initialEconomy.feed > 0 && initialEconomy.migrationGrantClaimed, 'Starter feed and one-time migration grant must be recorded');

const boughtSeeds = economy.purchaseSeed(initialEconomy, 'potato', 2);
assert(boughtSeeds.changed && boughtSeeds.state.seedInventory.potato === initialEconomy.seedInventory.potato + 2, 'Seed purchase must add inventory');
assert(boughtSeeds.state.gold === initialEconomy.gold - economy.SEED_PRICES.potato * 2, 'Seed purchase must deduct GOLD exactly once');
const refusedSeeds = economy.purchaseSeed({ ...initialEconomy, gold: 0 }, 'pumpkin', 1);
assert(!refusedSeeds.changed && refusedSeeds.state.gold === 0, 'Unaffordable seed purchase must be rejected');
const boughtFeed = economy.purchaseFeed(initialEconomy, 3);
assert(boughtFeed.changed && boughtFeed.state.feed === initialEconomy.feed + 3, 'Feed purchase must add feed stock');

let earned = economy.applySettlementEarnings(initialEconomy, 120);
assert(earned.state.lifetimeEarnings === 120 && earned.unlocked.includes('first-shipment'), 'First settlement must unlock first shipment once');
earned = economy.applySettlementEarnings(earned.state, 880);
assert(earned.state.lifetimeEarnings === 1000 && earned.unlocked.includes('earn-1000'), '1,000 GOLD lifetime milestone must unlock');
const mastered = economy.syncProgressionMilestones(earned.state, true);
assert(mastered.unlocked.includes('master-tools'), 'All level-two tools must unlock the master milestone');
assert(economy.syncProgressionMilestones(mastered.state, true).unlocked.length === 0, 'Milestones must never duplicate after reload');

let shipment = shipping.createInitialShippingState(4);
const sanitizedShipment = shipping.normalizeShippingState({ version: 1, day: 4, entries: { 'fish:not-real': 9, 'crop:potato:normal': 1 } }, 4);
assert(!('fish:not-real' in sanitizedShipment.entries) && sanitizedShipment.entries['crop:potato:normal'] === 1, 'Unknown shipping IDs must be removed during save recovery');
const sanitizedReceipt = shipping.normalizeShippingState({
  version: 1,
  day: 4,
  entries: {},
  lastSettlement: {
    day: 3,
    total: 999_999,
    settledAt: 1,
    lines: [
      { itemId: 'fish:not-real', quantity: 9, unitPrice: 999_999, subtotal: 9_999_999 },
      { itemId: 'crop:potato:normal', quantity: 2, unitPrice: 35, subtotal: 1 },
    ],
  },
}, 4);
assert(sanitizedReceipt.lastSettlement?.lines.length === 1, 'Unknown receipt IDs must be removed during save recovery');
assert(sanitizedReceipt.lastSettlement?.total === 70 && sanitizedReceipt.lastSettlement.lines[0].subtotal === 70, 'Recovered receipt totals must be derived from sanitized lines');
shipment = shipping.addToShipment(shipment, 'crop:potato:gold', 3, 5).state;
assert(shipment.entries['crop:potato:gold'] === 3, 'Shipping quantity must clamp to available inventory');
shipment = shipping.removeFromShipment(shipment, 'crop:potato:gold', 1).state;
assert(shipment.entries['crop:potato:gold'] === 2, 'Same-day shipment items must be removable');
shipment = shipping.addToShipment(shipment, 'fish:moonfin', 1, 1).state;
shipment = shipping.addToShipment(shipment, 'product:golden-egg', 1, 1).state;
shipment = shipping.addToShipment(shipment, 'forage:star-crystal', 1, 1).state;
assert(shipping.settleShipment(shipment, 4, economy.getShippingUnitPrice).settlement === null, 'Shipment must not settle before the next day');
const settled = shipping.settleShipment(shipment, 5, economy.getShippingUnitPrice);
assert(settled.settlement && settled.settlement.lines.length === 4 && settled.settlement.total > 0, 'Next day must produce itemized earnings');
assert(Object.keys(settled.state.entries).length === 0 && settled.state.lastSettlement?.day === 5, 'Settlement must clear pending items and persist the receipt');
assert(shipping.settleShipment(settled.state, 5, economy.getShippingUnitPrice).settlement === null, 'The same day must never pay twice');
assert(economy.getShippingUnitPrice('product:golden-egg') > economy.getShippingUnitPrice('product:egg'), 'Golden egg must have premium value');
assert(economy.getShippingUnitPrice('forage:star-crystal') > economy.getShippingUnitPrice('forage:stone'), 'Rare crystal must have premium value');

const inventorySources = {
  farm: {
    inventory: { potato: 2 },
    qualityInventory: { potato: { normal: 0, silver: 0, gold: 2 } },
  },
  fishing: { inventory: { moonfin: 1 } },
  villageLife: { products: { egg: 0, milk: 0, 'golden-egg': 1 } },
  foraging: { inventory: { 'star-crystal': 1 } },
};
const availableShipment = shipping.getShippingAvailability(inventorySources);
assert(availableShipment['crop:potato:gold'] === 2 && availableShipment['fish:moonfin'] === 1, 'Shipping availability must preserve crop quality and category counts');
const deducted = shipping.deductSettlementInventory(inventorySources, settled.settlement);
assert(deducted.farm.inventory.potato === 0 && deducted.farm.qualityInventory.potato.gold === 0, 'Crop quality and total crop counts must be deducted together');
assert(deducted.fishing.inventory.moonfin === 0 && deducted.villageLife.products['golden-egg'] === 0 && deducted.foraging.inventory['star-crystal'] === 0, 'Every shipped category must be deducted exactly once');

let toolState = tools.createInitialToolProgressionState();
assert(Object.values(toolState.levels).every((level) => level === 0), 'Tools must start at level zero');
assert(!tools.purchaseToolUpgrade(toolState, 'watering-can', 1).changed, 'Unaffordable upgrades must be rejected');
const wateringOne = tools.purchaseToolUpgrade(toolState, 'watering-can', 1000);
assert(wateringOne.changed && wateringOne.state.levels['watering-can'] === 1, 'First watering-can upgrade must reach level one');
const wateringTwo = tools.purchaseToolUpgrade(wateringOne.state, 'watering-can', 1000);
assert(wateringTwo.changed && wateringTwo.state.levels['watering-can'] === 2, 'Second watering-can upgrade must reach level two');
assert(!tools.purchaseToolUpgrade(wateringTwo.state, 'watering-can', 9999).changed, 'Level-two tools must be capped');
assert(tools.getFishingBiteWindow(900, 2) > tools.getFishingBiteWindow(900, 1), 'Fishing upgrades must widen the bite window by level');
assert(tools.getMiningYieldBonus(0, 0) === 0 && tools.getMiningYieldBonus(2, 0.4) === 1, 'Pickaxe upgrades must provide a bounded deterministic yield bonus');

const plots = [
  { id: 'plot-1', x: 15, y: 13 }, { id: 'plot-2', x: 16, y: 13 }, { id: 'plot-3', x: 17, y: 13 },
  { id: 'plot-4', x: 15, y: 14 }, { id: 'plot-5', x: 16, y: 14 }, { id: 'plot-6', x: 17, y: 14 },
];
assert(tools.getWateringTargetIds(plots, 'plot-1', 0).length === 1, 'Base watering can must affect one plot');
assert(tools.getWateringTargetIds(plots, 'plot-1', 1).length === 2, 'Level-one watering can must affect one adjacent plot');
assert(tools.getWateringTargetIds(plots, 'plot-1', 2).length === 3, 'Level-two watering can must affect all orthogonal adjacent plots');

const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
for (const marker of [
  'data-economy-system="v1"',
  'data-gold=',
  "id: 'shippingBox'",
  'data-commerce-window',
  'DAY EARNINGS',
  'TOOL UPGRADED',
  'purchaseSeed',
  'purchaseFeed',
]) {
  assert(game.includes(marker), `Runtime integration marker missing: ${marker}`);
}

console.log('economy progression test passed: GOLD, shipping, purchases, tool upgrades, and milestones are deterministic');
