import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Backpack, BookOpen, CheckCircle2, Clock3, Coins, Compass, Hammer, Mail, MapPin, Minus, Moon, Mountain, PartyPopper, Pickaxe, Plus, RotateCcw, ShoppingBasket, Sprout, Sun, TreePine, Volume2, VolumeX, Waves, X, type LucideIcon } from 'lucide-react';
import {
  FARM_CROPS,
  FARM_CROP_INFO,
  FARM_LIFE_CROPS,
  FARM_GARDEN_CROPS,
  FARM_STORAGE_KEY,
  FARM_TOOL_INFO,
  FARM_TOOLS,
  advanceFarmState,
  clearFarmState,
  createInitialFarmState,
  getFarmCropAsset,
  getFarmGroundAsset,
  getNearestFarmPlot,
  interactWithFarmPlot,
  loadFarmState,
  persistFarmState,
  takeOneHarvestForFestival,
  waterAllPlantedPlots,
  type CropType,
  type CropQuality,
  type FarmPlotStage,
  type FarmState,
  type FarmTool,
} from '../game/farmLoop';
import {
  CELEBRATION_COPY,
  CELEBRATION_DURATION_MS,
  DAY_PHASE_LABELS,
  TIME_MODE_LABELS,
  VILLAGE_DAY_DURATION_MS,
  VILLAGE_CLOCK_TICK_MS,
  getVillageTime,
  getVillageKeeperDialogue,
  getNextHarvestCombo,
  loadTimeMode,
  persistTimeMode,
  type CelebrationKind,
  type DayPhase,
  type TimeMode,
} from '../game/villagePulse';
import {
  FISHING_BITE_WINDOW_MS,
  FISHING_CAST_MS,
  FISHING_RESULT_MS,
  FISHING_SPOTS,
  FISHING_STORAGE_KEY,
  FISH_IDS,
  FISH_INFO,
  chooseFish,
  clearFishingState,
  createInitialFishingState,
  getBiteDelay,
  getFishingPool,
  getNearestFishingSpot,
  isFishingWaterCell,
  loadFishingState,
  persistFishingState,
  recordFishCatch,
  type FishId,
  type FishingSpot,
  type FishingState,
  type FishingStatus,
} from '../game/fishingLoop';
import {
  ANIMAL_IDS,
  ANIMAL_INFO,
  LIFE_NPC_IDS,
  LIFE_NPC_INFO,
  PRODUCT_INFO,
  RANCH_PRODUCTS,
  VILLAGE_LIFE_STORAGE_KEY,
  advanceVillageDay,
  clearRanchState,
  createInitialVillageLifeState,
  getAnimalPosition,
  getAnimalSprite,
  getAnimalStatus,
  getLifeNpcPosition,
  getNearestAnimal,
  getNpcQuest,
  getTotalRanchProducts,
  interactWithAnimal,
  interactWithLifeNpc,
  isRanchFenceCell,
  loadVillageLifeState,
  persistVillageLifeState,
  recordCropHarvestForQuest,
  type AnimalId,
  type LifeNpcId,
  type RanchProduct,
  type VillageLifeState,
} from '../game/villageLife';
import {
  FAST_TRAVEL_POSTS,
  OPEN_WORLD_STORAGE_KEY,
  REGION_IDS,
  REGION_INFO,
  REGION_TRANSITION_SWAP_MS,
  WORLD_GRAPH,
  createInitialOpenWorldState,
  enterRegion,
  fastTravelTo,
  getSafeRegionPosition,
  getRegionExit,
  isNearFastTravelPost,
  isRegionBlocked,
  loadOpenWorldState,
  persistOpenWorldState,
  rememberRegionPosition,
  type OpenWorldState,
  type RegionExit,
  type RegionId,
} from '../game/openWorld';
import {
  INTERIOR_IDS,
  INTERIOR_INFO,
  INTERIOR_STORAGE_KEY,
  INTERIOR_WORLD_HEIGHT,
  INTERIOR_WORLD_WIDTH,
  getInteriorIdForBuilding,
  getInteriorActors,
  isInteriorBlocked,
  loadInteriorSave,
  persistInteriorSave,
  type InteriorId,
  type InteriorActorId,
  type InteriorInteractionId,
} from '../game/interiorWorld';
import {
  FORAGE_ITEM_IDS,
  FORAGE_ITEM_INFO,
  FORAGE_NODES,
  FORAGING_STORAGE_KEY,
  OPEN_WORLD_NPC_INFO,
  collectForageNode,
  createInitialForagingState,
  getNearestForageNode,
  getOpenWorldNpcPosition,
  getTotalForageInventory,
  getVisibleForageNodes,
  interactWithOpenWorldNpc,
  loadForagingState,
  persistForagingState,
  syncForagingDay,
  type ForageItemId,
  type ForagingState,
  type OpenWorldNpcId,
} from '../game/foragingLoop';
import {
  GAME_PROGRESS_STORAGE_KEY,
  GAME_STARTED_STORAGE_KEY,
  createInitialGameProgress,
  hasSavedGame,
  loadGameProgress,
  markGameStarted,
  persistGameProgress,
  type GameQuestStage,
} from '../game/gameProgress';
import {
  ANIMAL_SPRITES,
  CROP_ITEM_SPRITES,
  EFFECT_SPRITES,
  NPC_PORTRAITS,
  NPC_PHASE_FACING,
  PLAYER_ACTION_SPRITES,
  PLAYER_WALK_SPRITES,
  TOOL_SPRITES,
  getNpcSprite,
  getAnimalRemasterSprite,
  type NpcPortraitExpression,
  type PlayerAction,
  type SpriteDirection,
} from '../game/animationCatalog';
import {
  AUDIO_TRACKS,
  RegionAudioController,
  getAudioTrack,
  loadAudioSettings,
  persistAudioSettings,
  type AudioTrackId,
  type AudioSettings,
} from '../game/audioSystem';
import {
  ECONOMY_STORAGE_KEY,
  FEED_PRICE,
  SEED_PRICES,
  applySettlementEarnings,
  clearEconomyState,
  consumeFeed,
  consumeSeed,
  getShippingUnitPrice,
  loadEconomyState,
  persistEconomyState,
  purchaseFeed,
  purchaseSeed,
  spendGold,
  syncProgressionMilestones,
  type EconomyMilestone,
  type EconomyState,
} from '../game/economySystem';
import {
  SHIPPING_STORAGE_KEY,
  addToShipment,
  clearShippingState,
  deductSettlementInventory,
  getPendingQuantity,
  getShippingAvailability,
  loadShippingState,
  persistShippingState,
  reconcileShipment,
  removeFromShipment,
  settleShipment,
  type ShippingItemId,
  type ShippingReceipt,
  type ShippingState,
} from '../game/shippingLoop';
import {
  TOOL_PROGRESSION_STORAGE_KEY,
  TOOL_UPGRADE_INFO,
  UPGRADE_TOOL_IDS,
  areAllToolsMaxed,
  clearToolProgressionState,
  getFishingBiteWindow,
  getMiningYieldBonus,
  getUpgradeCost,
  getWateringTargetIds,
  loadToolProgressionState,
  persistToolProgressionState,
  purchaseToolUpgrade,
  type ToolProgressionState,
  type UpgradeToolId,
} from '../game/toolProgression';
import {
  SEASON_INFO,
  SEASON_STORAGE_KEY,
  getCropGrowthMultiplier,
  getCropSeasonQualityBonus,
  getDailyDemandItems,
  getDemandPriceMultiplier,
  getSeasonalMapAsset,
  createInitialSeasonState,
  loadSeasonState,
  persistSeasonState,
  syncSeasonState,
  type SeasonState,
} from '../game/seasonSystem';
import {
  WEATHER_INFO,
  WEATHER_STORAGE_KEY,
  createInitialWeatherState,
  getWeatherAudioMix,
  loadWeatherState,
  markRainApplied,
  persistWeatherState,
  shouldApplyRain,
  syncWeatherState,
  type WeatherState,
} from '../game/weatherSystem';
import {
  FESTIVAL_INFO,
  FESTIVAL_INTERACTION_POSITION,
  FESTIVAL_NPC_POSITIONS,
  FESTIVAL_STORAGE_KEY,
  completeFestival,
  createInitialFestivalState,
  getActiveFestival,
  hasCompletedFestival,
  loadFestivalState,
  persistFestivalState,
  type FestivalState,
} from '../game/festivalSystem';

type SceneId = 'outside' | 'interior';
type EntityId =
  | 'farmhouse'
  | 'workshop'
  | 'market'
  | 'barn'
  | 'hanaCottage'
  | 'junCottage'
  | 'board'
  | 'mailbox'
  | 'shippingBox'
  | 'festivalDisplay'
  | 'villageKeeper'
  | 'farmerHana'
  | 'rancherJun'
  | 'forestGuide'
  | 'mineKeeper'
  | 'farmTravelPost'
  | 'forestTravelPost'
  | 'coastTravelPost'
  | 'mineTravelPost'
  | 'cropPatch'
  | 'emptyLook'
  | InteriorActorId
  | InteriorInteractionId;
type Direction = SpriteDirection;
type MenuTab = 'map' | 'journal' | 'audio' | 'reset';
type InventoryTab = 'bag' | 'farm' | 'ranch' | 'forage';
type SeedGroup = 'garden' | 'field';
type CommerceView = 'shipping' | 'shop' | 'ranch' | null;
type ShippingCategory = 'farm' | 'ranch' | 'bag' | 'forage';
type QuestStage = GameQuestStage;
type InventoryItemId =
  | 'field-journal'
  | 'quest-note'
  | 'tool-kit'
  | 'village-harvest'
  | 'barn-checklist'
  | 'completion-badge'
  | 'potato-harvest'
  | 'strawberry-harvest'
  | 'carrot-harvest'
  | 'tomato-harvest'
  | 'corn-harvest'
  | 'pumpkin-harvest'
  | 'fish-basket'
  | 'farm-catalog'
  | 'ranch-journal'
  | 'forage-journal'
  | 'festival-harvest-ribbon'
  | 'festival-starlight-charm'
  | `forage-${ForageItemId}`
  | `product-${RanchProduct}`
  | `animal-${AnimalId}`;
type InventoryTone = 'journal' | 'quest' | 'tools' | 'harvest' | 'barn' | 'complete' | 'potato' | 'strawberry' | 'carrot' | 'tomato' | 'corn' | 'pumpkin' | 'fish' | 'egg' | 'milk' | 'golden-egg' | 'animal' | 'forage' | 'ore' | 'crystal';

type Player = {
  x: number;
  y: number;
  facing: Direction;
  walking: boolean;
  step: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type Entity = {
  id: EntityId;
  scene: SceneId;
  name: string;
  kind: 'building' | 'prop' | 'crop' | 'npc' | 'interior' | 'door';
  x: number;
  y: number;
  w: number;
  h: number;
  range: number;
  sprite?: string;
  label: string;
  prompt: string;
  journalTitle: string;
  dialogue: string[];
  tags: string[];
};

const TILE = 32;
const OUTSIDE_WORLD_W = 32;
const OUTSIDE_WORLD_H = 22;
const INTRO_TITLE = 'MOSSBELL FARM';
const MOVE_INTERVAL_MS = 92;
const MOBILE_CAMERA_BREAKPOINT = 620;
const MOBILE_DIALOGUE_BAR_HEIGHT = 160;
const DESKTOP_DIALOGUE_BAR_HEIGHT = 144;
const SHORT_DESKTOP_DIALOGUE_BAR_HEIGHT = 140;
const MOBILE_PROMPT_BAR_HEIGHT = 68;
const DESKTOP_PROMPT_BAR_HEIGHT = 72;
const DESKTOP_WORLD_ZOOM = 0.74;
const TABLET_WORLD_ZOOM = 0.78;
const MOBILE_WORLD_ZOOM = 0.78;
const DESKTOP_MAX_WORLD_SCALE = 1.45;
const TABLET_MAX_WORLD_SCALE = 1.24;
const MOBILE_MAX_WORLD_SCALE = 1.08;
const DESKTOP_INVENTORY_RAIL_MIN = 260;
const DESKTOP_INVENTORY_RAIL_MAX = 320;
const MOBILE_INVENTORY_RAIL_WIDTH = 104;
const NARROW_INVENTORY_RAIL_WIDTH = 92;

const keyMap: Record<string, Direction | undefined> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

const farmToolKeyMap: Record<string, FarmTool | undefined> = {
  Digit1: 'hoe',
  Digit2: 'seeds',
  Digit3: 'watering-can',
};

const fireworkBursts = [
  { x: '20%', y: '28%', delay: '0ms', color: '#ffd770' },
  { x: '50%', y: '18%', delay: '180ms', color: '#80d8df' },
  { x: '78%', y: '32%', delay: '360ms', color: '#ef7d68' },
] as const;
const fireworkRays = Array.from({ length: 12 }, (_, index) => index);

type AmbientSprite = {
  id: string;
  kind: 'water' | 'smoke' | 'crystal' | 'window' | 'flora';
  x: number;
  y: number;
};

const REGION_AMBIENT_SPRITES: Record<RegionId, AmbientSprite[]> = {
  'farm-village': [
    { id: 'farm-smoke', kind: 'smoke', x: 5.1, y: 1.5 },
    { id: 'shop-smoke', kind: 'smoke', x: 15.2, y: 1.5 },
    { id: 'pond-glint-a', kind: 'water', x: 25, y: 15 },
    { id: 'pond-glint-b', kind: 'water', x: 27, y: 17 },
    { id: 'farm-window', kind: 'window', x: 4.5, y: 3.2 },
    { id: 'shop-window', kind: 'window', x: 14.4, y: 3.3 },
  ],
  'whisper-forest': [
    { id: 'forest-water-a', kind: 'water', x: 20.5, y: 4 },
    { id: 'forest-water-b', kind: 'water', x: 20.5, y: 16 },
    { id: 'forest-flora-a', kind: 'flora', x: 9, y: 5 },
    { id: 'forest-flora-b', kind: 'flora', x: 26, y: 14 },
  ],
  'river-coast': [
    { id: 'river-water-a', kind: 'water', x: 20, y: 3 },
    { id: 'river-water-b', kind: 'water', x: 20, y: 15 },
    { id: 'coast-water-a', kind: 'water', x: 26, y: 11 },
    { id: 'coast-water-b', kind: 'water', x: 29, y: 17 },
  ],
  'mine-foothill': [
    { id: 'mine-crystal-a', kind: 'crystal', x: 26.1, y: 4.8 },
    { id: 'mine-crystal-b', kind: 'crystal', x: 27.2, y: 7.2 },
    { id: 'mine-smoke', kind: 'smoke', x: 13.4, y: 3.2 },
  ],
};

type InventoryItem = {
  id: InventoryItemId;
  name: string;
  category: string;
  description: string;
  tone: InventoryTone;
  tab: InventoryTab;
  icon?: LucideIcon;
  asset?: string;
  quantity?: number;
  crop?: CropType;
  quality?: Record<CropQuality, number>;
};

type JournalEntry = {
  id: string;
  journalTitle: string;
};

type CelebrationState = {
  id: number;
  kind: CelebrationKind;
};

type HarvestFeedback = {
  id: number;
  crop: CropType;
  quality: CropQuality;
  count: number;
  x: number;
  y: number;
};

type FishingSession = {
  status: FishingStatus;
  spotId: FishingSpot['id'] | null;
  targetFish: FishId | null;
};

type FishingFeedback = {
  id: number;
  tone: 'info' | 'bite' | 'success' | 'escaped';
  title: string;
  detail: string;
  fish: FishId | null;
};

type LifeFeedback = {
  id: number;
  x: number;
  y: number;
  tone: 'feed' | 'pet' | 'collect' | 'perfect';
  title: string;
  detail: string;
  asset?: string;
};

type ForageFeedback = {
  id: number;
  x: number;
  y: number;
  item: ForageItemId;
};

type EarningsFeedback = {
  id: number;
  receipt: ShippingReceipt;
};

const ECONOMY_ASSETS = {
  coin: '/assets/art-remaster-v1/economy/coin.png',
  seeds: '/assets/art-remaster-v1/economy/seed-pouch.png',
  feed: '/assets/art-remaster-v1/economy/feed.png',
  watering: '/assets/art-remaster-v1/economy/watering-upgrade.png',
  fishing: '/assets/art-remaster-v1/economy/fishing-upgrade.png',
  pickaxe: '/assets/art-remaster-v1/economy/pickaxe-upgrade.png',
  ledger: '/assets/art-remaster-v1/economy/shipping-ledger.png',
  coinBurst: '/assets/art-remaster-v1/effects/coin-burst.png',
} as const;

const ECONOMY_MILESTONE_LABELS: Record<EconomyMilestone, string> = {
  'first-shipment': '첫 배송 정산',
  'earn-1000': '누적 1,000 GOLD',
  'master-tools': '도구 3종 LV.2',
};

const TOOL_UPGRADE_ASSETS: Record<UpgradeToolId, string> = {
  'watering-can': ECONOMY_ASSETS.watering,
  'fishing-rod': ECONOMY_ASSETS.fishing,
  pickaxe: ECONOMY_ASSETS.pickaxe,
};

function getShippingItemMeta(itemId: ShippingItemId) {
  const [category, item, quality] = itemId.split(':');
  if (category === 'crop') {
    const crop = item as CropType;
    return { label: `${FARM_CROP_INFO[crop].label} · ${quality.toUpperCase()}`, asset: CROP_ITEM_SPRITES[crop], tab: 'farm' as ShippingCategory };
  }
  if (category === 'fish') {
    const fish = item as FishId;
    return { label: FISH_INFO[fish].label, asset: FISH_INFO[fish].asset, tab: 'bag' as ShippingCategory };
  }
  if (category === 'product') {
    const product = item as RanchProduct;
    return { label: PRODUCT_INFO[product].label, asset: PRODUCT_INFO[product].asset, tab: 'ranch' as ShippingCategory };
  }
  const forageItem = item as ForageItemId;
  return { label: FORAGE_ITEM_INFO[forageItem].label, asset: FORAGE_ITEM_INFO[forageItem].asset, tab: 'forage' as ShippingCategory };
}

type RegionTransitionState = {
  id: number;
  from: RegionId;
  to: RegionId;
  phase: 'out' | 'in';
};

const idleFishingSession: FishingSession = { status: 'idle', spotId: null, targetFish: null };

function InventoryItemGraphic({ item, className = '' }: { item: InventoryItem; className?: string }) {
  if (item.asset) {
    return <img className={`inventory-pixel-icon ${className}`.trim()} src={item.asset} alt="" aria-hidden="true" />;
  }
  const Icon = item.icon;
  return Icon ? <Icon className={className || undefined} aria-hidden="true" strokeWidth={2.5} /> : null;
}

const farmInventoryItemIds: Record<CropType, InventoryItemId> = {
  potato: 'potato-harvest',
  strawberry: 'strawberry-harvest',
  carrot: 'carrot-harvest',
  tomato: 'tomato-harvest',
  corn: 'corn-harvest',
  pumpkin: 'pumpkin-harvest',
};

const lifeNpcEntityIds: Record<LifeNpcId, EntityId> = {
  'farmer-hana': 'farmerHana',
  'rancher-jun': 'rancherJun',
};

const entityLifeNpcIds: Partial<Record<EntityId, LifeNpcId>> = {
  farmerHana: 'farmer-hana',
  rancherJun: 'rancher-jun',
};

const lifeNpcRemasterIds = {
  'farmer-hana': 'hana',
  'rancher-jun': 'jun',
} as const;

const openWorldNpcEntityIds: Record<OpenWorldNpcId, EntityId> = {
  'forest-guide': 'forestGuide',
  'mine-keeper': 'mineKeeper',
};

const entityOpenWorldNpcIds: Partial<Record<EntityId, OpenWorldNpcId>> = {
  forestGuide: 'forest-guide',
  mineKeeper: 'mine-keeper',
};

const entityPortraitNpcIds: Partial<Record<EntityId, 'lumi' | 'hana' | 'jun' | 'sera' | 'doyun'>> = {
  villageKeeper: 'lumi',
  farmerHana: 'hana',
  rancherJun: 'jun',
  forestGuide: 'sera',
  mineKeeper: 'doyun',
};

function getDialoguePortraitExpression(dialogue: Entity): NpcPortraitExpression {
  const copy = `${dialogue.prompt} ${dialogue.dialogue.join(' ')}`;
  if (/완료|고마|축하|좋아|성공|수확/.test(copy)) return 'happy';
  if (/아직|필요|걱정|도와|주의|잃|부족/.test(copy)) return 'concerned';
  return 'neutral';
}

const openWorldNpcRemasterIds = {
  'forest-guide': 'sera',
  'mine-keeper': 'doyun',
} as const;

const travelPostEntityIds: Record<RegionId, EntityId> = {
  'farm-village': 'farmTravelPost',
  'whisper-forest': 'forestTravelPost',
  'river-coast': 'coastTravelPost',
  'mine-foothill': 'mineTravelPost',
};

const farmStageLabels: Record<FarmPlotStage, string> = {
  untilled: '갈지 않은 밭',
  tilled: '심을 준비 완료',
  planted: '씨앗 심음',
  watered: '물주기 완료',
  'growing-1': '새싹 성장 중',
  'growing-2': '성장 중',
  ready: '수확 가능',
};

const questLabels: Record<QuestStage, string> = {
  'not-started': '새 의뢰',
  'visit-seed-shop': '씨앗 가게 방문',
  'harvest-village-crops': '작물 3개 수확',
  'inspect-barn': '헛간 확인',
  'return-to-board': '완료 보고',
  complete: '의뢰 완료',
};

const questStageOrder: QuestStage[] = [
  'not-started',
  'visit-seed-shop',
  'harvest-village-crops',
  'inspect-barn',
  'return-to-board',
  'complete',
];

const outsideEntities: Entity[] = [
  {
    id: 'farmhouse',
    scene: 'outside',
    name: 'Mossbell Farmhouse',
    kind: 'building',
    x: 3,
    y: 2,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/buildings/farmhouse.png',
    label: 'ENTER HOUSE',
    prompt: '따뜻한 불빛이 새어 나오는 농가다.',
    journalTitle: '모스벨 농가',
    dialogue: ['문을 열면 포근한 농가 안으로 들어갈 수 있다.'],
    tags: ['Home', 'Rest', 'Storage'],
  },
  {
    id: 'workshop',
    scene: 'outside',
    name: 'Mossbell Seed Shop',
    kind: 'building',
    x: 12,
    y: 2,
    w: 5,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/buildings/shop.png',
    label: 'SEED SHOP',
    prompt: '보랏빛 차양 아래 씨앗 주머니가 진열되어 있다.',
    journalTitle: '모스벨 씨앗 가게',
    dialogue: ['문을 열면 계절 씨앗과 농사 도구를 살펴볼 수 있다.'],
    tags: ['Seeds', 'Shop', 'Village'],
  },
  {
    id: 'market',
    scene: 'outside',
    name: 'Village Market',
    kind: 'building',
    x: 24,
    y: 8,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/market-stall.png',
    label: 'MARKET',
    prompt: '신선한 채소와 들꽃이 놓인 작은 장터다.',
    journalTitle: '모스벨 장터',
    dialogue: ['아침마다 마을 사람들이 수확물을 가져와 진열한다.', '빈 바구니에서는 사과와 햇볕 냄새가 난다.'],
    tags: ['Produce', 'Flowers', 'Village'],
  },
  {
    id: 'barn',
    scene: 'outside',
    name: 'Mossbell Barn',
    kind: 'building',
    x: 4,
    y: 17,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/buildings/barn.png',
    label: 'ENTER BARN',
    prompt: '동물들이 밤에 쉬는 붉은 헛간이다.',
    journalTitle: '모스벨 헛간',
    dialogue: ['문 너머로 마른 짚과 사료 냄새가 난다.'],
    tags: ['Ranch', 'Animals', 'Feed'],
  },
  {
    id: 'hanaCottage',
    scene: 'outside',
    name: "Hana's Cottage",
    kind: 'building',
    x: 20,
    y: 2,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/buildings/hana-cottage.png',
    label: "HANA'S HOME",
    prompt: '초록 지붕과 꽃상자가 예쁜 하나의 집이다.',
    journalTitle: '하나의 오두막',
    dialogue: ['창가 화분마다 새싹이 고개를 내밀고 있다.'],
    tags: ['Hana', 'Flowers', 'Cottage'],
  },
  {
    id: 'junCottage',
    scene: 'outside',
    name: "Jun's Cottage",
    kind: 'building',
    x: 27,
    y: 17,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/buildings/jun-cottage.png',
    label: "JUN'S HOME",
    prompt: '목장 옆에 자리한 붉은 지붕 오두막이다.',
    journalTitle: '준의 오두막',
    dialogue: ['문 옆 우유통이 햇빛을 받아 반짝인다.'],
    tags: ['Jun', 'Ranch', 'Cottage'],
  },
  {
    id: 'board',
    scene: 'outside',
    name: 'Community Board',
    kind: 'prop',
    x: 21,
    y: 18,
    w: 2,
    h: 2,
    range: 3,
    sprite: '/assets/art-remaster-v1/props/quest-board.png',
    label: 'QUEST BOARD',
    prompt: '오늘의 마을 심부름이 붙어 있다.',
    journalTitle: '마을 게시판',
    dialogue: ['씨앗 가게에 들르고, 밭에서 작물 세 개를 수확한 뒤 헛간을 확인해 달라는 쪽지다.'],
    tags: ['Quest', 'Village', 'Daily work'],
  },
  {
    id: 'mailbox',
    scene: 'outside',
    name: 'Mailbox',
    kind: 'prop',
    x: 8,
    y: 7,
    w: 1,
    h: 1,
    range: 2,
    sprite: '/assets/art-remaster-v1/props/mailbox.png',
    label: 'MAIL',
    prompt: '빨간 우편함 안에서 편지가 바스락거린다.',
    journalTitle: '농가 우편함',
    dialogue: ['편지에는 오늘 날씨와 마을 축제 준비 소식이 적혀 있다.'],
    tags: ['Mail', 'Village news'],
  },
  {
    id: 'shippingBox',
    scene: 'outside',
    name: 'Mossbell Shipping Box',
    kind: 'prop',
    x: 8,
    y: 4,
    w: 2,
    h: 2,
    range: 2.4,
    sprite: '/assets/art-remaster-v1/props/shipping-box.png',
    label: 'SHIP',
    prompt: '오늘 팔 물건을 담아 두면 다음 날 아침 정산된다.',
    journalTitle: '모스벨 배송 상자',
    dialogue: ['배송할 물건은 오늘 안에 다시 꺼낼 수 있다.', '잠들거나 다음 날이 시작되면 품질과 희귀도에 따라 GOLD가 지급된다.'],
    tags: ['Shipping', 'Economy', 'Farm'],
  },
  {
    id: 'villageKeeper',
    scene: 'outside',
    name: 'Lumi · Village Keeper',
    kind: 'npc',
    x: 19,
    y: 8,
    w: 1,
    h: 2,
    range: 2.3,
    sprite: getNpcSprite('lumi', 'down', 0),
    label: 'LUMI',
    prompt: '마을 기록가 루미가 길가에서 손을 흔든다.',
    journalTitle: '루미: 마을 기록가',
    dialogue: ['루미는 시간과 수확 기록을 정리하는 마을 안내자다.'],
    tags: ['Village NPC', 'Guide', 'Day and night'],
  },
  {
    id: 'cropPatch',
    scene: 'outside',
    name: 'Community Field',
    kind: 'crop',
    x: 15,
    y: 13,
    w: 4,
    h: 3,
    range: 2,
    label: 'FARM',
    prompt: '가까운 밭 칸에서 도구를 선택하고 E를 눌러 농사를 시작하세요.',
    journalTitle: '마을 공동 밭',
    dialogue: ['씨앗을 심고 물을 주면 날짜가 흐르며 작물이 자란다.'],
    tags: ['Crops', 'Watering', 'Harvest'],
  },
];

const farmPatchEntity = outsideEntities.find((entity) => entity.id === 'cropPatch') as Entity;

const emptyLookEntity: Entity = {
  id: 'emptyLook',
  scene: 'outside',
  name: 'Empty Field',
  kind: 'prop',
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  range: 0,
  label: 'LOOK',
  prompt: '주변에 조사할 것이 없다.',
  journalTitle: '빈 공간',
  dialogue: ['조금 더 가까이 다가가서 E를 누르면 집, 물건, 게시판, 책상과 상호작용할 수 있다.'],
  tags: ['Move closer', 'Press E'],
};

function getInteriorEntities(interiorId: InteriorId): Entity[] {
  const info = INTERIOR_INFO[interiorId];
  return info.interactions.map((interaction) => ({
    id: interaction.id,
    scene: 'interior',
    name: interaction.name,
    kind: interaction.kind === 'exit' ? 'door' : 'interior',
    x: interaction.x,
    y: interaction.y,
    w: interaction.w,
    h: interaction.h,
    range: interaction.range,
    label: interaction.label,
    prompt: interaction.prompt,
    journalTitle: `${info.label}: ${interaction.name}`,
    dialogue: interaction.dialogue,
    tags: ['Interior', info.shortLabel, interaction.kind],
  }));
}

function getInteriorActorEntities(interiorId: InteriorId, phase: 'dawn' | 'day' | 'sunset' | 'night', frame: number): Entity[] {
  return getInteriorActors(interiorId, phase).map((actor) => ({
    id: actor.id,
    scene: 'interior',
    name: actor.name,
    kind: 'npc',
    x: actor.x,
    y: actor.y,
    w: actor.w,
    h: actor.h,
    range: actor.range,
    sprite: actor.spriteKind === 'chicken' || actor.spriteKind === 'cow'
      ? getAnimalRemasterSprite(actor.spriteKind, 'sleeping', frame)
      : getNpcSprite(actor.spriteKind, actor.facing, frame),
    label: actor.label,
    prompt: actor.prompt,
    journalTitle: `${INTERIOR_INFO[interiorId].label}: ${actor.name}`,
    dialogue: actor.dialogue,
    tags: ['Interior', actor.kind, phase],
  }));
}

const allInteriorEntities = INTERIOR_IDS.flatMap(getInteriorEntities);

function distanceToEntity(player: Player, entity: Entity) {
  const nearestX = clamp(player.x, entity.x, entity.x + entity.w - 1);
  const nearestY = clamp(player.y, entity.y, entity.y + entity.h - 1);
  return Math.hypot(player.x - nearestX, player.y - nearestY);
}

function facingPriority(player: Player, entity: Entity) {
  const centerX = entity.x + (entity.w - 1) / 2;
  const centerY = entity.y + (entity.h - 1) / 2;
  const forwardDistance = player.facing === 'left'
    ? player.x - centerX
    : player.facing === 'right'
      ? centerX - player.x
      : player.facing === 'up'
        ? player.y - centerY
        : centerY - player.y;
  return forwardDistance >= 0 ? 0 : 1;
}

function getNearestEntity(player: Player, entities: Entity[]) {
  return entities
    .map((entity) => ({ entity, distance: distanceToEntity(player, entity) }))
    .filter(({ entity, distance }) => distance <= entity.range)
    .sort((a, b) => a.distance - b.distance || facingPriority(player, a.entity) - facingPriority(player, b.entity))[0]?.entity;
}

function addUnique(list: string[], item: string) {
  return list.includes(item) ? list : [...list, item];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitialViewport(): ViewportSize {
  if (typeof window === 'undefined') return { width: 1280, height: 720 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function getQuestObjective(stage: QuestStage, harvestCount: number) {
  const objectives: Record<QuestStage, string> = {
    'not-started': '옆에 있는 빨간 우편함에서 첫 의뢰를 확인하세요.',
    'visit-seed-shop': '북쪽 씨앗 가게 안으로 들어가세요.',
    'harvest-village-crops': `중앙 밭에서 작물을 수확하세요. (${harvestCount}/3)`,
    'inspect-barn': '남쪽 헛간 안으로 들어가 우리를 확인하세요.',
    'return-to-board': '남쪽 마을 게시판에 완료 보고를 남기세요.',
    complete: '첫 의뢰 완료. 농장과 네 지역을 자유롭게 탐험하세요.',
  };
  return objectives[stage];
}

function getDialogueBarHeight(viewport: ViewportSize, dialogueOpen: boolean) {
  if (!dialogueOpen) {
    return viewport.width <= MOBILE_CAMERA_BREAKPOINT ? MOBILE_PROMPT_BAR_HEIGHT : DESKTOP_PROMPT_BAR_HEIGHT;
  }
  if (viewport.width <= MOBILE_CAMERA_BREAKPOINT) return MOBILE_DIALOGUE_BAR_HEIGHT;
  if (viewport.height <= 620) return SHORT_DESKTOP_DIALOGUE_BAR_HEIGHT;
  return DESKTOP_DIALOGUE_BAR_HEIGHT;
}

function getSceneWorldWidth(scene: SceneId) {
  return scene === 'outside' ? OUTSIDE_WORLD_W : INTERIOR_WORLD_WIDTH;
}

function getSceneWorldHeight(scene: SceneId) {
  return scene === 'outside' ? OUTSIDE_WORLD_H : INTERIOR_WORLD_HEIGHT;
}

function isBlockedByEntity(x: number, y: number, scene: SceneId, region: RegionId, dynamicEntities: Entity[], interiorId: InteriorId | null) {
  if (scene === 'interior') return interiorId ? isInteriorBlocked(interiorId, x, y) : true;
  if (scene === 'outside' && region === 'farm-village' && (isFishingWaterCell(x, y, region) || isRanchFenceCell(x, y))) return true;
  if (scene === 'outside' && region !== 'farm-village' && (isFishingWaterCell(x, y, region) || isRegionBlocked(region, x, y))) return true;
  return dynamicEntities.some((entity) => {
    if (entity.kind === 'crop' || entity.kind === 'door') return false;
    return x >= entity.x && x < entity.x + entity.w && y >= entity.y && y < entity.y + entity.h;
  });
}

function getEntityDepth(entity: Entity) {
  return 10 + (entity.y + entity.h) * 10;
}

function getPlayerDepth(player: Player) {
  return 15 + (player.y + 1) * 10;
}

function getWorldScale(viewport: ViewportSize, availableWidth: number, availableHeight: number, worldPixelW: number, worldPixelH: number) {
  const coverScale = Math.max(availableWidth / worldPixelW, availableHeight / worldPixelH);
  const zoomFactor = viewport.width <= MOBILE_CAMERA_BREAKPOINT
    ? MOBILE_WORLD_ZOOM
    : viewport.width <= 980
      ? TABLET_WORLD_ZOOM
      : DESKTOP_WORLD_ZOOM;
  const maxScale = viewport.width <= MOBILE_CAMERA_BREAKPOINT
    ? MOBILE_MAX_WORLD_SCALE
    : viewport.width <= 980
      ? TABLET_MAX_WORLD_SCALE
      : DESKTOP_MAX_WORLD_SCALE;
  const minScale = viewport.width <= 380 ? 0.92 : 1;

  const preferredScale = clamp(coverScale * zoomFactor, minScale, maxScale);
  return Math.max(coverScale, preferredScale);
}

function getInventoryRailWidth(viewportWidth: number) {
  if (viewportWidth <= 380) return NARROW_INVENTORY_RAIL_WIDTH;
  if (viewportWidth <= MOBILE_CAMERA_BREAKPOINT) return MOBILE_INVENTORY_RAIL_WIDTH;
  return clamp(viewportWidth * .27, DESKTOP_INVENTORY_RAIL_MIN, DESKTOP_INVENTORY_RAIL_MAX);
}

function getWorldCameraStyle(player: Player, viewport: ViewportSize, scene: SceneId, dialogueOpen: boolean, inventoryRailWidth: number): CSSProperties {
  const worldPixelW = getSceneWorldWidth(scene) * TILE;
  const worldPixelH = getSceneWorldHeight(scene) * TILE;
  const style = {
    width: worldPixelW,
    height: worldPixelH,
  } as CSSProperties & Record<string, string | number>;

  const dialogueHeight = getDialogueBarHeight(viewport, dialogueOpen);
  const availableWidth = Math.max(220, viewport.width - inventoryRailWidth);
  const availableHeight = Math.max(260, viewport.height - dialogueHeight);
  const scale = getWorldScale(viewport, availableWidth, availableHeight, worldPixelW, worldPixelH);
  const scaledWorldW = worldPixelW * scale;
  const scaledWorldH = worldPixelH * scale;
  const playerCenterX = (player.x + 0.5) * TILE * scale;
  const playerCenterY = (player.y + 0.5) * TILE * scale;

  const desiredLeft = availableWidth / 2 - playerCenterX;
  const desiredTop = availableHeight / 2 - playerCenterY;
  const left = scaledWorldW <= availableWidth
    ? (availableWidth - scaledWorldW) / 2
    : clamp(desiredLeft, availableWidth - scaledWorldW, 0);
  const top = scaledWorldH <= availableHeight
    ? (availableHeight - scaledWorldH) / 2
    : clamp(desiredTop, viewport.height - dialogueHeight - scaledWorldH, 0);

  style['--world-scale'] = String(scale);
  style['--camera-left'] = `${left.toFixed(2)}px`;
  style['--camera-top'] = `${top.toFixed(2)}px`;
  return style;
}

export function MossbellFarmGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [canContinue, setCanContinue] = useState(() => hasSavedGame([
    GAME_PROGRESS_STORAGE_KEY,
    FARM_STORAGE_KEY,
    FISHING_STORAGE_KEY,
    VILLAGE_LIFE_STORAGE_KEY,
    OPEN_WORLD_STORAGE_KEY,
    FORAGING_STORAGE_KEY,
    INTERIOR_STORAGE_KEY,
    ECONOMY_STORAGE_KEY,
    SHIPPING_STORAGE_KEY,
    TOOL_PROGRESSION_STORAGE_KEY,
    SEASON_STORAGE_KEY,
    WEATHER_STORAGE_KEY,
    FESTIVAL_STORAGE_KEY,
  ]));
  const [typedNameLength, setTypedNameLength] = useState(0);
  const [restoredGameProgress] = useState(() => loadGameProgress());
  const [restoredInteriorSave] = useState(() => loadInteriorSave());
  const [activeInterior, setActiveInterior] = useState<InteriorId | null>(restoredInteriorSave.currentInterior);
  const [scene, setScene] = useState<SceneId>(() => activeInterior ? 'interior' : 'outside');
  const [openWorldState, setOpenWorldState] = useState<OpenWorldState>(() => {
    const restoredWorld = loadOpenWorldState();
    if (!restoredInteriorSave.currentInterior) return restoredWorld;
    const { region, position } = restoredInteriorSave.lastOutdoor;
    return {
      ...restoredWorld,
      currentRegion: region,
      positions: { ...restoredWorld.positions, [region]: getSafeRegionPosition(region, position) },
    };
  });
  const [player, setPlayer] = useState<Player>(() => activeInterior
    ? { ...INTERIOR_INFO[activeInterior].entry, walking: false, step: 0 }
    : { ...openWorldState.positions[openWorldState.currentRegion], walking: false, step: 0 });
  const [dialogue, setDialogue] = useState<Entity | null>(null);
  const [journal, setJournal] = useState<string[]>(restoredGameProgress.journal);
  const [harvestCount, setHarvestCount] = useState(restoredGameProgress.harvestCount);
  const [questStage, setQuestStage] = useState<QuestStage>(restoredGameProgress.questStage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTab>('bag');
  const [seedGroup, setSeedGroup] = useState<SeedGroup>('garden');
  const [selectedInventoryId, setSelectedInventoryId] = useState<InventoryItemId>('field-journal');
  const [acquiredItemId, setAcquiredItemId] = useState<InventoryItemId | null>(null);
  const [activeMenuTab, setActiveMenuTab] = useState<MenuTab>('map');
  const [showLabels, setShowLabels] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [farmState, setFarmState] = useState<FarmState>(() => loadFarmState());
  const [villageLifeState, setVillageLifeState] = useState<VillageLifeState>(() => loadVillageLifeState());
  const [seasonState, setSeasonState] = useState<SeasonState>(() => loadSeasonState(villageLifeState.day));
  const [weatherState, setWeatherState] = useState<WeatherState>(() => loadWeatherState(seasonState));
  const [festivalState, setFestivalState] = useState<FestivalState>(() => loadFestivalState());
  const [economyState, setEconomyState] = useState<EconomyState>(() => loadEconomyState());
  const [shippingState, setShippingState] = useState<ShippingState>(() => loadShippingState(villageLifeState.day));
  const [toolProgressionState, setToolProgressionState] = useState<ToolProgressionState>(() => loadToolProgressionState());
  const [commerceView, setCommerceView] = useState<CommerceView>(null);
  const [shippingCategory, setShippingCategory] = useState<ShippingCategory>('farm');
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [earningsFeedback, setEarningsFeedback] = useState<EarningsFeedback | null>(null);
  const [lifeFrame, setLifeFrame] = useState(0);
  const [lifeFeedback, setLifeFeedback] = useState<LifeFeedback | null>(null);
  const [fishingState, setFishingState] = useState<FishingState>(() => loadFishingState());
  const [fishingRodSelected, setFishingRodSelected] = useState(false);
  const [fishingSession, setFishingSession] = useState<FishingSession>(idleFishingSession);
  const [fishingFeedback, setFishingFeedback] = useState<FishingFeedback | null>(null);
  const [fishingRippleFrame, setFishingRippleFrame] = useState(0);
  const [foragingState, setForagingState] = useState<ForagingState>(() => loadForagingState());
  const [pickaxeSelected, setPickaxeSelected] = useState(false);
  const [forageFeedback, setForageFeedback] = useState<ForageFeedback | null>(null);
  const [regionTransition, setRegionTransition] = useState<RegionTransitionState | null>(null);
  const [fastTravelReady, setFastTravelReady] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>(() => loadTimeMode());
  const [villageElapsedMs, setVillageElapsedMs] = useState(0);
  const [villageKeeperFrame, setVillageKeeperFrame] = useState(0);
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [harvestFeedback, setHarvestFeedback] = useState<HarvestFeedback | null>(null);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => loadAudioSettings());
  const [audioTrack, setAudioTrack] = useState<AudioTrackId | 'silent'>('silent');
  const [playerAction, setPlayerAction] = useState<{ kind: PlayerAction; frame: number } | null>(null);
  const [viewport, setViewport] = useState<ViewportSize>(getInitialViewport);

  const pressedDirectionsRef = useRef<Direction[]>([]);
  const moveFrameRef = useRef<number | null>(null);
  const lastMoveAtRef = useRef(0);
  const gameStartedRef = useRef(gameStarted);
  const knownInventoryIdsRef = useRef<Set<InventoryItemId>>(new Set(['field-journal', 'farm-catalog', 'ranch-journal', 'forage-journal']));
  const itemPickupTimerRef = useRef<number | null>(null);
  const movePlayerRef = useRef<(direction: Direction) => void>(() => undefined);
  const interactRef = useRef<() => void>(() => undefined);
  const stopWalkingRef = useRef<() => void>(() => undefined);
  const villageClockStartedAtRef = useRef(Date.now());
  const celebrationTimerRef = useRef<number | null>(null);
  const harvestFeedbackTimerRef = useRef<number | null>(null);
  const lastHarvestAtRef = useRef(0);
  const harvestComboCountRef = useRef(0);
  const fishingStateRef = useRef(fishingState);
  const farmStateRef = useRef(farmState);
  const fishingSessionRef = useRef<FishingSession>(idleFishingSession);
  const fishingCastTimerRef = useRef<number | null>(null);
  const fishingBiteTimerRef = useRef<number | null>(null);
  const fishingEscapeTimerRef = useRef<number | null>(null);
  const fishingResultTimerRef = useRef<number | null>(null);
  const cancelFishingRef = useRef<(reason: 'move' | 'tool' | 'scene') => void>(() => undefined);
  const selectFarmToolRef = useRef<(tool: FarmTool) => void>(() => undefined);
  const selectFishingRodRef = useRef<() => void>(() => undefined);
  const selectPickaxeRef = useRef<() => void>(() => undefined);
  const villageLifeStateRef = useRef(villageLifeState);
  const seasonStateRef = useRef(seasonState);
  const weatherStateRef = useRef(weatherState);
  const festivalStateRef = useRef(festivalState);
  const economyStateRef = useRef(economyState);
  const shippingStateRef = useRef(shippingState);
  const toolProgressionStateRef = useRef(toolProgressionState);
  const commerceViewRef = useRef<CommerceView>(commerceView);
  const earningsFeedbackTimerRef = useRef<number | null>(null);
  const lifeFeedbackTimerRef = useRef<number | null>(null);
  const lastAutoDayCycleRef = useRef(0);
  const previousTimeModeRef = useRef(timeMode);
  const openWorldStateRef = useRef(openWorldState);
  const foragingStateRef = useRef(foragingState);
  const forageFeedbackTimerRef = useRef<number | null>(null);
  const regionTransitionTimerRef = useRef<number | null>(null);
  const regionTransitionPendingRef = useRef(false);
  const lastOutdoorRef = useRef(restoredInteriorSave.lastOutdoor);
  const audioControllerRef = useRef<RegionAudioController | null>(null);
  const desiredAudioTrackRef = useRef<AudioTrackId>('village-day');
  const playerActionTimerRefs = useRef<number[]>([]);

  const villageTime = getVillageTime(timeMode, villageElapsedMs);
  const currentRegion = openWorldState.currentRegion;
  const currentInteriorInfo = activeInterior ? INTERIOR_INFO[activeInterior] : null;
  const activeFestival = getActiveFestival(seasonState);
  const todayDemandItems = getDailyDemandItems(seasonState);
  const activeFestivalCompleted = activeFestival ? hasCompletedFestival(festivalState, activeFestival.id, seasonState.year) : false;
  const seasonWeatherLine = `${SEASON_INFO[seasonState.season].label} ${seasonState.day} · ${WEATHER_INFO[weatherState.weather].label}`;
  desiredAudioTrackRef.current = activeFestival && currentRegion === 'farm-village' ? 'night' : getAudioTrack(currentRegion, villageTime.isNight);
  const lifeNpcEntities = useMemo<Entity[]>(() => LIFE_NPC_IDS.map((id) => {
    const info = LIFE_NPC_INFO[id];
    const scheduled = getLifeNpcPosition(id, villageTime.phase);
    const festivalIndex = id === 'farmer-hana' ? 1 : 2;
    const festivalPosition = FESTIVAL_NPC_POSITIONS[festivalIndex];
    const weatherNudge = weatherState.weather === 'rain'
      ? (id === 'farmer-hana' ? -0.28 : 0.28)
      : weatherState.weather === 'windy'
        ? (id === 'farmer-hana' ? 0.18 : -0.18)
        : 0;
    const seasonNudge = seasonState.season === 'summer' ? 0.12 : seasonState.season === 'winter' ? -0.12 : 0;
    const position = activeFestival && currentRegion === 'farm-village'
      ? { ...festivalPosition, facing: 'down' as const }
      : { ...scheduled, x: scheduled.x + weatherNudge, y: scheduled.y + seasonNudge };
    return {
      id: lifeNpcEntityIds[id],
      scene: 'outside',
      name: info.name,
      kind: 'npc',
      x: position.x,
      y: position.y,
      w: 1,
      h: 2,
      range: 1.8,
      sprite: getNpcSprite(lifeNpcRemasterIds[id], position.facing, lifeFrame),
      label: info.role,
      prompt: `${info.name}에게 오늘의 생활 이야기를 듣는다.`,
      journalTitle: info.journalTitle,
      dialogue: [],
      tags: ['Village Life', info.role, villageTime.phase],
    };
  }), [activeFestival, currentRegion, lifeFrame, seasonState.season, villageTime.phase, weatherState.weather]);
  const openWorldNpcEntities = useMemo<Entity[]>(() => (Object.keys(OPEN_WORLD_NPC_INFO) as OpenWorldNpcId[])
    .filter((id) => OPEN_WORLD_NPC_INFO[id].region === currentRegion)
    .map((id) => {
      const info = OPEN_WORLD_NPC_INFO[id];
      const position = getOpenWorldNpcPosition(id, villageTime.phase);
      return {
        id: openWorldNpcEntityIds[id],
        scene: 'outside',
        name: `${info.name} · ${info.role}`,
        kind: 'npc',
        x: position.x,
        y: position.y,
        w: 1,
        h: 2,
        range: 1.8,
        sprite: getNpcSprite(openWorldNpcRemasterIds[id], NPC_PHASE_FACING[villageTime.phase], lifeFrame),
        label: info.name,
        prompt: `${info.name}에게 지역 이야기를 듣는다.`,
        journalTitle: `${info.role} ${info.name}`,
        dialogue: [],
        tags: ['Open World NPC', info.role, villageTime.phase],
      };
    }), [currentRegion, lifeFrame, villageTime.phase]);
  const travelPostEntity = useMemo<Entity>(() => {
    const position = FAST_TRAVEL_POSTS[currentRegion];
    return {
      id: travelPostEntityIds[currentRegion],
      scene: 'outside',
      name: `${REGION_INFO[currentRegion].label} Signpost`,
      kind: 'prop',
      x: position.x,
      y: position.y,
      w: 1,
      h: 1,
      range: 1.8,
      sprite: '/assets/art-remaster-v1/props/travel-sign.png',
      label: 'TRAVEL',
      prompt: '발견한 지역으로 빠르게 이동할 수 있는 표지판이다.',
      journalTitle: `${REGION_INFO[currentRegion].label} 여행 표지판`,
      dialogue: [],
      tags: ['Fast travel', currentRegion],
    };
  }, [currentRegion]);
  const festivalEntity = useMemo<Entity | null>(() => activeFestival && currentRegion === 'farm-village' ? {
    id: 'festivalDisplay',
    scene: 'outside',
    name: activeFestival.label,
    kind: 'prop',
    x: FESTIVAL_INTERACTION_POSITION.x,
    y: FESTIVAL_INTERACTION_POSITION.y,
    w: 2,
    h: 2,
    range: 2.1,
    sprite: activeFestival.propAsset,
    label: activeFestivalCompleted ? 'COMPLETE' : activeFestival.interactionLabel,
    prompt: activeFestivalCompleted ? '올해의 축제 기록이 완성됐다.' : `${activeFestival.interactionLabel}에 참여한다.`,
    journalTitle: activeFestival.journalTitle,
    dialogue: [],
    tags: ['Festival', activeFestival.id, `Year ${seasonState.year}`],
  } : null, [activeFestival, activeFestivalCompleted, currentRegion, seasonState.year]);
  const currentInteriorEntities = useMemo(
    () => activeInterior
      ? [...getInteriorEntities(activeInterior), ...getInteriorActorEntities(activeInterior, villageTime.phase, lifeFrame)]
      : [],
    [activeInterior, lifeFrame, villageTime.phase],
  );
  const currentEntities = useMemo(
    () => {
      if (scene === 'interior') return currentInteriorEntities;
      if (currentRegion === 'farm-village') {
        const villageEntities = [...outsideEntities, ...lifeNpcEntities, travelPostEntity]
          .map((entity) => activeFestival && entity.id === 'villageKeeper'
            ? { ...entity, ...FESTIVAL_NPC_POSITIONS[0] }
            : entity);
        return festivalEntity ? [...villageEntities, festivalEntity] : villageEntities;
      }
      return [...openWorldNpcEntities, travelPostEntity];
    },
    [activeFestival, currentInteriorEntities, currentRegion, festivalEntity, lifeNpcEntities, openWorldNpcEntities, scene, travelPostEntity],
  );
  const nearby = useMemo(() => getNearestEntity(player, currentEntities), [player, currentEntities]);
  const nearbyFarmPlot = useMemo(
    () => scene === 'outside' && currentRegion === 'farm-village' ? getNearestFarmPlot(player, farmState.plots) : null,
    [currentRegion, farmState.plots, player, scene],
  );
  const nearbyFishingSpot = useMemo(
    () => scene === 'outside' ? getNearestFishingSpot(player, currentRegion) : null,
    [currentRegion, player, scene],
  );
  const nearbyAnimal = useMemo(
    () => scene === 'outside' && currentRegion === 'farm-village' && !villageTime.isNight ? getNearestAnimal(player, villageTime.phase, lifeFrame) : null,
    [currentRegion, lifeFrame, player, scene, villageTime.isNight, villageTime.phase],
  );
  const nearbyForageNode = useMemo(
    () => scene === 'outside' ? getNearestForageNode(foragingState, currentRegion, player) : null,
    [currentRegion, foragingState, player, scene],
  );
  const typedTitle = INTRO_TITLE.slice(0, typedNameLength);
  const allOpenWorldNpcEntities = useMemo<Entity[]>(() => (Object.keys(OPEN_WORLD_NPC_INFO) as OpenWorldNpcId[]).map((id) => {
    const info = OPEN_WORLD_NPC_INFO[id];
    const position = getOpenWorldNpcPosition(id, villageTime.phase);
    return { id: openWorldNpcEntityIds[id], scene: 'outside', name: `${info.name} · ${info.role}`, kind: 'npc', x: position.x, y: position.y, w: 1, h: 2, range: 1.8, sprite: getNpcSprite(openWorldNpcRemasterIds[id], NPC_PHASE_FACING[villageTime.phase], 0), label: info.name, prompt: '', journalTitle: `${info.role} ${info.name}`, dialogue: [], tags: ['Open World NPC'] };
  }), [villageTime.phase]);
  const allEntities = useMemo(() => [...outsideEntities, ...lifeNpcEntities, ...allOpenWorldNpcEntities, ...allInteriorEntities], [allOpenWorldNpcEntities, lifeNpcEntities]);
  const entityJournalEntries = journal.map<JournalEntry>((title) => ({ id: `entity-${title}`, journalTitle: title }));
  const farmJournalEntries = FARM_CROPS
    .filter((crop) => farmState.inventory[crop] > 0)
    .map<JournalEntry>((crop) => ({ id: `farm-${crop}`, journalTitle: FARM_CROP_INFO[crop].journalTitle }));
  const fishJournalEntries = fishingState.discovered
    .map<JournalEntry>((fish) => ({ id: `fish-${fish}`, journalTitle: `${FISH_INFO[fish].habitat.toUpperCase()} 도감: ${FISH_INFO[fish].label}` }));
  const ranchJournalEntries = [
    ...villageLifeState.discoveredAnimals.map<JournalEntry>((animal) => ({ id: `animal-${animal}`, journalTitle: `목장 기록: ${ANIMAL_INFO[animal].name}` })),
    ...villageLifeState.discoveredProducts.map<JournalEntry>((product) => ({ id: `product-${product}`, journalTitle: `목장 생산품: ${PRODUCT_INFO[product].label}` })),
  ];
  const forageJournalEntries = foragingState.discovered.map<JournalEntry>((item) => ({ id: `forage-${item}`, journalTitle: `탐험 기록: ${FORAGE_ITEM_INFO[item].label}` }));
  const economyJournalEntries = economyState.milestones.map<JournalEntry>((milestone) => ({ id: `economy-${milestone}`, journalTitle: `성장 기록: ${ECONOMY_MILESTONE_LABELS[milestone]}` }));
  const seasonJournalEntries = seasonState.discoveredSeasons.map<JournalEntry>((season) => ({ id: `season-${season}`, journalTitle: `계절 기록: ${SEASON_INFO[season].label}` }));
  const festivalJournalEntries = festivalState.journal.map<JournalEntry>((entry) => ({ id: `festival-${entry}`, journalTitle: entry }));
  const journalEntries: JournalEntry[] = [...entityJournalEntries, ...farmJournalEntries, ...fishJournalEntries, ...ranchJournalEntries, ...forageJournalEntries, ...economyJournalEntries, ...seasonJournalEntries, ...festivalJournalEntries];
  const totalJournalCount = journal.length + farmJournalEntries.length + fishJournalEntries.length + ranchJournalEntries.length + forageJournalEntries.length + economyJournalEntries.length + seasonJournalEntries.length + festivalJournalEntries.length;
  const totalJournalEntries = allEntities.length + FARM_CROPS.length + FISH_IDS.length + ANIMAL_IDS.length + RANCH_PRODUCTS.length + FORAGE_ITEM_IDS.length + 9;
  const readyFarmPlotCount = farmState.plots.filter((plot) => plot.stage === 'ready').length;
  const totalFarmHarvest = FARM_CROPS.reduce((total, crop) => total + farmState.inventory[crop], 0);
  const playerFrames = PLAYER_WALK_SPRITES[player.facing];
  const playerFrameIndex = player.walking ? player.step % playerFrames.length : 0;
  const playerSprite = playerAction ? PLAYER_ACTION_SPRITES[playerAction.kind][playerAction.frame] : playerFrames[playerFrameIndex];
  const dialogueOpen = dialogue !== null;
  const dialoguePortraitNpc = dialogue ? entityPortraitNpcIds[dialogue.id] : undefined;
  const dialoguePortrait = dialogue && dialoguePortraitNpc
    ? NPC_PORTRAITS[dialoguePortraitNpc][getDialoguePortraitExpression(dialogue)]
    : null;
  const dialogueBarHeight = getDialogueBarHeight(viewport, dialogueOpen);
  const questObjective = getQuestObjective(questStage, harvestCount);
  const mapEntities = currentEntities;
  const menuTabs: MenuTab[] = ['map', 'journal', 'audio', 'reset'];
  const questStageIndex = questStageOrder.indexOf(questStage);
  const fishBasketDescription = fishingState.discovered.length > 0
    ? fishingState.discovered.map((fish) => `${FISH_INFO[fish].label} ${fishingState.inventory[fish]}`).join(' · ')
    : '아직 연못에서 잡은 물고기가 없다.';
  const shippingAvailability = useMemo(() => getShippingAvailability({
    farm: farmState,
    fishing: fishingState,
    villageLife: villageLifeState,
    foraging: foragingState,
  }), [farmState, fishingState, foragingState, villageLifeState]);
  const shippingRows = useMemo(() => [...new Set([
    ...Object.keys(shippingAvailability),
    ...Object.keys(shippingState.entries),
  ])]
    .map((itemId) => itemId as ShippingItemId)
    .filter((itemId) => getShippingItemMeta(itemId).tab === shippingCategory)
    .filter((itemId) => (shippingAvailability[itemId] ?? 0) > 0 || getPendingQuantity(shippingState, itemId) > 0),
  [shippingAvailability, shippingCategory, shippingState]);
  const getTodayShippingUnitPrice = useCallback((itemId: string) => (
    Math.round(getShippingUnitPrice(itemId) * getDemandPriceMultiplier(itemId, seasonState))
  ), [seasonState]);
  const pendingShippingTotal = Object.entries(shippingState.entries).reduce((total, [itemId, quantity]) => (
    total + getTodayShippingUnitPrice(itemId) * Number(quantity ?? 0)
  ), 0);
  const inventoryItems = useMemo<InventoryItem[]>(() => {
    const items: Array<InventoryItem & { unlocked: boolean }> = [
      {
        id: 'field-journal',
        name: '농장 수첩',
        category: 'RECORD',
        description: `모스벨에서 발견한 장소와 생물 ${totalJournalCount}개가 정리되어 있다.`,
        tone: 'journal',
        tab: 'bag',
        icon: BookOpen,
        unlocked: true,
      },
      {
        id: 'quest-note',
        name: '의뢰 쪽지',
        category: 'QUEST',
        description: '우편함에서 받은 첫 마을 의뢰. 가게와 밭, 헛간의 하루 일을 돕는다.',
        tone: 'quest',
        tab: 'bag',
        icon: Mail,
        unlocked: questStageIndex >= 1,
      },
      {
        id: 'tool-kit',
        name: '씨앗 꾸러미',
        category: 'FARM',
        description: '씨앗 가게에서 받은 여섯 종류의 씨앗 꾸러미.',
        tone: 'tools',
        tab: 'bag',
        icon: Hammer,
        unlocked: questStageIndex >= 2,
      },
      {
        id: 'village-harvest',
        name: '오늘의 수확물',
        category: 'QUEST',
        description: `마을 의뢰를 위해 수확한 작물. 현재 ${harvestCount}/3개를 모았다.`,
        tone: 'harvest',
        tab: 'bag',
        icon: Sprout,
        quantity: harvestCount,
        unlocked: harvestCount > 0,
      },
      {
        id: 'barn-checklist',
        name: '헛간 점검표',
        category: 'RANCH',
        description: '우리, 사료통, 생산품 선반을 확인한 목장 점검표.',
        tone: 'barn',
        tab: 'bag',
        icon: Hammer,
        unlocked: questStageIndex >= 4,
      },
      {
        id: 'completion-badge',
        name: '첫 의뢰 완료 배지',
        category: 'MILESTONE',
        description: '첫 마을 심부름을 끝낸 농부에게 주는 작은 나무 배지.',
        tone: 'complete',
        tab: 'bag',
        icon: CheckCircle2,
        unlocked: questStage === 'complete',
      },
      {
        id: 'festival-harvest-ribbon',
        name: FESTIVAL_INFO['harvest-night'].rewardLabel,
        category: 'FESTIVAL SOUVENIR',
        description: 'Harvest Night에 수확물을 출품한 해마다 한 번 받는 붉은 리본.',
        tone: 'complete',
        tab: 'bag',
        asset: '/assets/seasons-v1/festivals/harvest-ribbon.png',
        quantity: festivalState.souvenirs['harvest-ribbon'],
        unlocked: festivalState.souvenirs['harvest-ribbon'] > 0,
      },
      {
        id: 'festival-starlight-charm',
        name: FESTIVAL_INFO['starlight-festival'].rewardLabel,
        category: 'FESTIVAL SOUVENIR',
        description: 'Starlight Festival 등불을 밝힌 해마다 한 번 받는 별빛 부적.',
        tone: 'complete',
        tab: 'bag',
        asset: '/assets/seasons-v1/festivals/starlight-charm.png',
        quantity: festivalState.souvenirs['starlight-charm'],
        unlocked: festivalState.souvenirs['starlight-charm'] > 0,
      },
      {
        id: 'farm-catalog',
        name: '씨앗 도감',
        category: 'FARM',
        description: '감자·딸기·당근·토마토·옥수수·호박의 수확 기록.',
        tone: 'harvest',
        tab: 'farm',
        icon: Sprout,
        unlocked: true,
      },
      ...FARM_CROPS.map((crop): InventoryItem & { unlocked: boolean } => ({
        id: farmInventoryItemIds[crop],
        name: FARM_CROP_INFO[crop].label,
        category: 'HARVEST',
        description: `${FARM_CROP_INFO[crop].description} · NORMAL ${farmState.qualityInventory[crop].normal} / SILVER ${farmState.qualityInventory[crop].silver} / GOLD ${farmState.qualityInventory[crop].gold}`,
        tone: FARM_CROP_INFO[crop].tone as InventoryTone,
        tab: 'farm',
        asset: CROP_ITEM_SPRITES[crop],
        quantity: farmState.inventory[crop],
        crop,
        quality: farmState.qualityInventory[crop],
        unlocked: farmState.inventory[crop] > 0,
      })),
      {
        id: 'fish-basket',
        name: '월드 어획함',
        category: 'FISHING',
        description: fishBasketDescription,
        tone: 'fish',
        tab: 'bag',
        asset: FISH_INFO[fishingState.lastCaught ?? fishingState.discovered[0] ?? 'bluegill'].asset,
        quantity: fishingState.totalCaught,
        unlocked: fishingState.totalCaught > 0,
      },
      {
        id: 'ranch-journal',
        name: '목장 일지',
        category: 'RANCH',
        description: `마을 ${villageLifeState.day}일차 · 완벽 돌봄 연속 ${villageLifeState.perfectCareStreak}일 · 동물 ${villageLifeState.discoveredAnimals.length}/${ANIMAL_IDS.length}`,
        tone: 'animal',
        tab: 'ranch',
        icon: BookOpen,
        unlocked: true,
      },
      ...RANCH_PRODUCTS.map((product): InventoryItem & { unlocked: boolean } => ({
        id: `product-${product}`,
        name: PRODUCT_INFO[product].label,
        category: 'RANCH PRODUCT',
        description: PRODUCT_INFO[product].description,
        tone: product,
        tab: 'ranch',
        asset: PRODUCT_INFO[product].asset,
        quantity: villageLifeState.products[product],
        unlocked: villageLifeState.products[product] > 0,
      })),
      ...ANIMAL_IDS.map((animal): InventoryItem & { unlocked: boolean } => ({
        id: `animal-${animal}`,
        name: ANIMAL_INFO[animal].name,
        category: ANIMAL_INFO[animal].species.toUpperCase(),
        description: `친밀도 ${villageLifeState.animals[animal].affection}/5 · ${ANIMAL_INFO[animal].species === 'chicken' ? '달걀을 낳는 닭' : '우유를 주는 소'}`,
        tone: 'animal',
        tab: 'ranch',
        asset: ANIMAL_SPRITES[ANIMAL_INFO[animal].species].idle,
        unlocked: villageLifeState.discoveredAnimals.includes(animal),
      })),
      {
        id: 'forage-journal',
        name: '탐험 채집 일지',
        category: 'FORAGE',
        description: `발견 지역 ${openWorldState.discovered.length}/${REGION_IDS.length} · 채집 도감 ${foragingState.discovered.length}/${FORAGE_ITEM_IDS.length} · 탐험 의뢰 ${foragingState.completedNpcQuests}회 완료`,
        tone: 'forage',
        tab: 'forage',
        icon: Compass,
        unlocked: true,
      },
      ...FORAGE_ITEM_IDS.map((item): InventoryItem & { unlocked: boolean } => ({
        id: `forage-${item}`,
        name: FORAGE_ITEM_INFO[item].label,
        category: FORAGE_ITEM_INFO[item].category === 'forest' ? 'FOREST FIND' : 'MINE FIND',
        description: FORAGE_ITEM_INFO[item].description,
        tone: FORAGE_ITEM_INFO[item].rare ? 'crystal' : FORAGE_ITEM_INFO[item].category === 'mine' ? 'ore' : 'forage',
        tab: 'forage',
        asset: FORAGE_ITEM_INFO[item].asset,
        quantity: foragingState.inventory[item],
        unlocked: foragingState.inventory[item] > 0,
      })),
    ];

    return items.filter((item) => item.unlocked);
  }, [farmState.inventory, farmState.qualityInventory, festivalState.souvenirs, fishBasketDescription, fishingState.discovered, fishingState.lastCaught, fishingState.totalCaught, foragingState, harvestCount, openWorldState.discovered.length, questStage, questStageIndex, totalJournalCount, villageLifeState]);
  const activeInventoryItems = useMemo(
    () => inventoryItems.filter((item) => item.tab === activeInventoryTab),
    [activeInventoryTab, inventoryItems],
  );
  const inventorySlots = useMemo(
    () => Array.from({ length: 12 }, (_, index) => activeInventoryItems[index] ?? null),
    [activeInventoryItems],
  );
  const selectedInventoryItem = activeInventoryItems.find((item) => item.id === selectedInventoryId) ?? activeInventoryItems[0] ?? inventoryItems[0];
  const acquiredItem = acquiredItemId ? inventoryItems.find((item) => item.id === acquiredItemId) ?? null : null;
  const VillageTimeIcon = villageTime.isNight ? Moon : Sun;
  const villageKeeperSprite = getNpcSprite('lumi', NPC_PHASE_FACING[villageTime.phase], villageKeeperFrame);
  const celebrationCopy = celebration ? CELEBRATION_COPY[celebration.kind] : null;
  const activeFishingSpot = FISHING_SPOTS.find((spot) => spot.id === fishingSession.spotId) ?? null;
  const currentRegionFishingSpots = FISHING_SPOTS.filter((spot) => spot.region === currentRegion);
  const currentAmbientSprites = REGION_AMBIENT_SPRITES[currentRegion].filter((sprite) => sprite.kind !== 'window' || villageTime.isNight);
  const selectedGameTool = pickaxeSelected ? 'pickaxe' : fishingRodSelected ? 'fishing-rod' : farmState.selectedTool;
  const inventoryRailWidth = getInventoryRailWidth(viewport.width);
  const sceneWorldWidth = getSceneWorldWidth(scene);
  const sceneWorldHeight = getSceneWorldHeight(scene);
  const worldCameraStyle = useMemo(
    () => getWorldCameraStyle(player, viewport, scene, dialogueOpen, inventoryRailWidth),
    [dialogueOpen, inventoryRailWidth, player, viewport, scene],
  );
  const miniMap = (
    <div className="mini-map" aria-label="Current game map">
      <i className="map-road map-road-vertical" />
      <i className="map-road map-road-horizontal" />
      {mapEntities.map((entity) => (
        <i
          key={`${scene}-${entity.id}`}
          className={`map-node node-${entity.kind} ${nearby?.id === entity.id ? 'is-nearby' : ''}`}
          title={entity.name}
          style={{ left: `${((entity.x + entity.w / 2) / sceneWorldWidth) * 100}%`, top: `${((entity.y + entity.h / 2) / sceneWorldHeight) * 100}%` }}
        />
      ))}
      <i className="map-player" style={{ left: `${((player.x + 0.5) / sceneWorldWidth) * 100}%`, top: `${((player.y + 0.5) / sceneWorldHeight) * 100}%` }} />
    </div>
  );

  const continueGame = useCallback(() => {
    markGameStarted();
    setCanContinue(true);
    setGameStarted(true);
  }, []);

  const newGame = useCallback(() => {
    const nextFarm = createInitialFarmState();
    const nextFishing = createInitialFishingState();
    const nextVillageLife = createInitialVillageLifeState();
    const nextEconomy = clearEconomyState();
    const nextShipping = clearShippingState(nextVillageLife.day);
    const nextToolProgression = clearToolProgressionState();
    const nextWorld = createInitialOpenWorldState();
    const nextForaging = createInitialForagingState(nextVillageLife.day);
    const nextProgress = createInitialGameProgress();
    const nextSeason = createInitialSeasonState(nextVillageLife.day);
    const nextWeather = createInitialWeatherState(nextSeason);
    const nextFestival = createInitialFestivalState();
    [FARM_STORAGE_KEY, FISHING_STORAGE_KEY, VILLAGE_LIFE_STORAGE_KEY, OPEN_WORLD_STORAGE_KEY,
      FORAGING_STORAGE_KEY, INTERIOR_STORAGE_KEY, GAME_PROGRESS_STORAGE_KEY, GAME_STARTED_STORAGE_KEY,
      ECONOMY_STORAGE_KEY, SHIPPING_STORAGE_KEY, TOOL_PROGRESSION_STORAGE_KEY,
      SEASON_STORAGE_KEY, WEATHER_STORAGE_KEY, FESTIVAL_STORAGE_KEY]
      .forEach((key) => window.localStorage.removeItem(key));
    setFarmState(nextFarm);
    farmStateRef.current = nextFarm;
    fishingStateRef.current = nextFishing;
    setFishingState(nextFishing);
    villageLifeStateRef.current = nextVillageLife;
    setVillageLifeState(nextVillageLife);
    seasonStateRef.current = nextSeason;
    setSeasonState(nextSeason);
    weatherStateRef.current = nextWeather;
    setWeatherState(nextWeather);
    festivalStateRef.current = nextFestival;
    setFestivalState(nextFestival);
    economyStateRef.current = nextEconomy;
    setEconomyState(nextEconomy);
    shippingStateRef.current = nextShipping;
    setShippingState(nextShipping);
    toolProgressionStateRef.current = nextToolProgression;
    setToolProgressionState(nextToolProgression);
    commerceViewRef.current = null;
    setCommerceView(null);
    setEarningsFeedback(null);
    openWorldStateRef.current = nextWorld;
    setOpenWorldState(nextWorld);
    foragingStateRef.current = nextForaging;
    setForagingState(nextForaging);
    setActiveInterior(null);
    setScene('outside');
    lastOutdoorRef.current = { region: 'farm-village', position: nextWorld.positions['farm-village'] };
    setPlayer({ ...nextWorld.positions['farm-village'], walking: false, step: 0 });
    setJournal(nextProgress.journal);
    setHarvestCount(nextProgress.harvestCount);
    setQuestStage(nextProgress.questStage);
    setDialogue(null);
    setMenuOpen(false);
    markGameStarted();
    setCanContinue(true);
    setGameStarted(true);
  }, []);

  const triggerCelebration = useCallback((kind: CelebrationKind) => {
    if (celebrationTimerRef.current !== null) window.clearTimeout(celebrationTimerRef.current);
    setCelebration({ id: Date.now(), kind });
    celebrationTimerRef.current = window.setTimeout(() => {
      setCelebration(null);
      celebrationTimerRef.current = null;
    }, CELEBRATION_DURATION_MS);
  }, []);

  const openCommerce = useCallback((view: Exclude<CommerceView, null>) => {
    pressedDirectionsRef.current = [];
    commerceViewRef.current = view;
    setCommerceView(view);
    setPurchaseQuantity(1);
    setMenuOpen(false);
    if (view === 'shipping') setShippingCategory('farm');
  }, []);

  const closeCommerce = useCallback(() => {
    commerceViewRef.current = null;
    setCommerceView(null);
  }, []);

  const showEconomyMessage = useCallback((name: string, message: string, tags: string[]) => {
    setDialogue({
      ...farmPatchEntity,
      name,
      label: 'ECONOMY',
      prompt: message,
      dialogue: [message],
      tags,
    });
  }, []);

  const buySeed = useCallback((crop: CropType) => {
    const result = purchaseSeed(economyStateRef.current, crop, purchaseQuantity);
    if (result.changed) {
      economyStateRef.current = result.state;
      setEconomyState(result.state);
    }
    showEconomyMessage('Seed Shop', result.message, ['Shop', crop, result.changed ? 'Purchased' : 'Insufficient GOLD']);
  }, [purchaseQuantity, showEconomyMessage]);

  const buyFeed = useCallback(() => {
    const result = purchaseFeed(economyStateRef.current, purchaseQuantity);
    if (result.changed) {
      economyStateRef.current = result.state;
      setEconomyState(result.state);
    }
    showEconomyMessage('Ranch Supplies', result.message, ['Shop', 'Feed', result.changed ? 'Purchased' : 'Insufficient GOLD']);
  }, [purchaseQuantity, showEconomyMessage]);

  const upgradeTool = useCallback((tool: UpgradeToolId) => {
    const result = purchaseToolUpgrade(toolProgressionStateRef.current, tool, economyStateRef.current.gold);
    if (!result.changed) {
      showEconomyMessage('Tool Upgrade', result.message, ['Upgrade', tool, 'Unavailable']);
      return;
    }
    const paid = spendGold(economyStateRef.current, result.cost);
    if (!paid) return;
    toolProgressionStateRef.current = result.state;
    setToolProgressionState(result.state);
    const milestoneResult = syncProgressionMilestones(paid, areAllToolsMaxed(result.state));
    economyStateRef.current = milestoneResult.state;
    setEconomyState(milestoneResult.state);
    triggerCelebration('tool-upgraded');
    showEconomyMessage('TOOL UPGRADED', result.message, ['Upgrade', tool, `LV.${result.state.levels[tool]}`]);
  }, [showEconomyMessage, triggerCelebration]);

  const changeShipment = useCallback((itemId: ShippingItemId, direction: 'add' | 'remove') => {
    const result = direction === 'add'
      ? addToShipment(shippingStateRef.current, itemId, shippingAvailability[itemId] ?? 0, 1)
      : removeFromShipment(shippingStateRef.current, itemId, 1);
    if (!result.changed) return;
    shippingStateRef.current = result.state;
    setShippingState(result.state);
  }, [shippingAvailability]);

  const playPlayerAction = useCallback((kind: PlayerAction) => {
    playerActionTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
    playerActionTimerRefs.current = [];
    setPlayer((current) => ({ ...current, walking: false }));
    setPlayerAction({ kind, frame: 0 });
    playerActionTimerRefs.current = [
      window.setTimeout(() => setPlayerAction({ kind, frame: 1 }), 150),
      window.setTimeout(() => setPlayerAction({ kind, frame: 2 }), 300),
      window.setTimeout(() => {
        setPlayerAction(null);
        playerActionTimerRefs.current = [];
      }, 520),
    ];
  }, []);

  const cancelPlayerAction = useCallback(() => {
    playerActionTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
    playerActionTimerRefs.current = [];
    setPlayerAction(null);
  }, []);

  const showHarvestFeedback = useCallback((crop: CropType, quality: CropQuality, x: number, y: number) => {
    const now = Date.now();
    const count = getNextHarvestCombo(harvestComboCountRef.current, lastHarvestAtRef.current, now);
    harvestComboCountRef.current = count;
    lastHarvestAtRef.current = now;
    if (harvestFeedbackTimerRef.current !== null) window.clearTimeout(harvestFeedbackTimerRef.current);
    setHarvestFeedback({ id: now, crop, quality, count, x, y });
    harvestFeedbackTimerRef.current = window.setTimeout(() => {
      setHarvestFeedback(null);
      harvestFeedbackTimerRef.current = null;
    }, 1_450);
  }, []);

  const showLifeFeedback = useCallback((feedback: Omit<LifeFeedback, 'id'>) => {
    if (lifeFeedbackTimerRef.current !== null) window.clearTimeout(lifeFeedbackTimerRef.current);
    setLifeFeedback({ ...feedback, id: Date.now() });
    lifeFeedbackTimerRef.current = window.setTimeout(() => {
      setLifeFeedback(null);
      lifeFeedbackTimerRef.current = null;
    }, 1_450);
  }, []);

  const showForageFeedback = useCallback((feedback: Omit<ForageFeedback, 'id'>) => {
    if (forageFeedbackTimerRef.current !== null) window.clearTimeout(forageFeedbackTimerRef.current);
    setForageFeedback({ ...feedback, id: Date.now() });
    forageFeedbackTimerRef.current = window.setTimeout(() => {
      setForageFeedback(null);
      forageFeedbackTimerRef.current = null;
    }, 1_550);
  }, []);

  const updateFishingSession = useCallback((next: FishingSession) => {
    fishingSessionRef.current = next;
    setFishingSession(next);
  }, []);

  const clearFishingTimers = useCallback(() => {
    [fishingCastTimerRef, fishingBiteTimerRef, fishingEscapeTimerRef, fishingResultTimerRef].forEach((timerRef) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    });
  }, []);

  const showFishingDialogue = useCallback((name: string, lines: string[], tags: string[]) => {
    setDialogue({
      ...farmPatchEntity,
      name,
      label: 'FISH',
      prompt: lines[0],
      dialogue: lines,
      tags,
    });
  }, []);

  const finishFishingFailure = useCallback((reason: 'early' | 'late' | 'move' | 'tool' | 'scene') => {
    const current = fishingSessionRef.current;
    if (current.status !== 'casting' && current.status !== 'waiting' && current.status !== 'bite') return;

    clearFishingTimers();
    const reasonCopy = {
      early: ['TOO EARLY', '입질 전에 줄을 당겼습니다. 잔물결이 커질 때 E를 누르세요.'],
      late: ['ESCAPED', '입질 타이밍을 놓쳐 물고기가 빠져나갔습니다.'],
      move: ['LINE CANCELLED', '이동하면서 낚싯줄을 안전하게 거두었습니다.'],
      tool: ['TOOL CHANGED', '도구를 바꾸며 낚싯줄을 안전하게 거두었습니다.'],
      scene: ['LINE STORED', '장소를 옮기기 전에 낚싯줄을 안전하게 거두었습니다.'],
    }[reason];
    const escapedSession: FishingSession = { ...current, status: 'escaped' };
    updateFishingSession(escapedSession);
    setFishingFeedback({ id: Date.now(), tone: 'escaped', title: reasonCopy[0], detail: reasonCopy[1], fish: null });
    showFishingDialogue('Fishing Pond', [reasonCopy[1], '잠시 후 같은 포인트에서 다시 시도할 수 있습니다.'], ['Fishing', 'Escaped']);
    fishingResultTimerRef.current = window.setTimeout(() => {
      updateFishingSession(idleFishingSession);
      setFishingFeedback(null);
      fishingResultTimerRef.current = null;
    }, FISHING_RESULT_MS);
  }, [clearFishingTimers, showFishingDialogue, updateFishingSession]);

  const startFishing = useCallback((spot: FishingSpot) => {
    clearFishingTimers();
    const targetFish = chooseFish(villageTime.isNight, Math.random(), spot.habitat, seasonStateRef.current.season);
    const castingSession: FishingSession = { status: 'casting', spotId: spot.id, targetFish };
    updateFishingSession(castingSession);
    setPlayer((current) => ({ ...current, facing: spot.facing, walking: false }));
    playPlayerAction('fish-cast');
    setFishingFeedback({ id: Date.now(), tone: 'info', title: 'CAST', detail: `찌를 ${spot.habitat === 'pond' ? '연못' : spot.habitat === 'river' ? '강' : '해안'}에 던졌습니다.`, fish: null });
    showFishingDialogue(`${spot.habitat.toUpperCase()} Fishing`, ['찌를 던졌습니다. 움직이지 말고 잔물결을 지켜보세요.', '입질 표시가 뜨면 E 또는 모바일 E를 누르세요.'], ['Fishing', spot.habitat, villageTime.isNight ? 'Night pool' : 'Day pool']);

    fishingCastTimerRef.current = window.setTimeout(() => {
      const current = fishingSessionRef.current;
      if (current.status !== 'casting' || current.spotId !== spot.id) return;
      updateFishingSession({ ...current, status: 'waiting' });
      setFishingFeedback({ id: Date.now(), tone: 'info', title: 'WAIT', detail: '물결이 잠잠해집니다...', fish: null });
      fishingCastTimerRef.current = null;

      fishingBiteTimerRef.current = window.setTimeout(() => {
        const waiting = fishingSessionRef.current;
        if (waiting.status !== 'waiting' || waiting.spotId !== spot.id) return;
        updateFishingSession({ ...waiting, status: 'bite' });
        setFishingFeedback({ id: Date.now(), tone: 'bite', title: 'HIT!', detail: '지금 E를 누르세요!', fish: null });
        fishingBiteTimerRef.current = null;
        fishingEscapeTimerRef.current = window.setTimeout(() => {
          fishingEscapeTimerRef.current = null;
          finishFishingFailure('late');
        }, getFishingBiteWindow(FISHING_BITE_WINDOW_MS, toolProgressionStateRef.current.levels['fishing-rod']));
      }, getBiteDelay(Math.random()));
    }, FISHING_CAST_MS);
  }, [clearFishingTimers, finishFishingFailure, playPlayerAction, showFishingDialogue, updateFishingSession, villageTime.isNight]);

  const completeFishingCatch = useCallback(() => {
    const current = fishingSessionRef.current;
    if (current.status !== 'bite' || !current.targetFish) return;

    clearFishingTimers();
    const fish = current.targetFish;
    const result = recordFishCatch(fishingStateRef.current, fish);
    fishingStateRef.current = result.state;
    setFishingState(result.state);
    setSelectedInventoryId('fish-basket');
    playPlayerAction('fish-reel');
    updateFishingSession({ ...current, status: 'success' });
    setFishingFeedback({ id: Date.now(), tone: 'success', title: 'CAUGHT!', detail: FISH_INFO[fish].label, fish });
    showFishingDialogue(FISH_INFO[fish].label, [
      `${FISH_INFO[fish].label}을(를) 낚았습니다. 어획함 +1`,
      result.firstOfType ? `도감 첫 발견: ${FISH_INFO[fish].description}` : `누적 ${result.state.inventory[fish]}마리 · ${FISH_INFO[fish].description}`,
    ], ['Fishing', FISH_INFO[fish].rarity, result.firstCatch ? 'First catch' : 'Catch']);
    if (result.rareCatch) triggerCelebration('rare-fish');

    fishingResultTimerRef.current = window.setTimeout(() => {
      updateFishingSession(idleFishingSession);
      setFishingFeedback(null);
      fishingResultTimerRef.current = null;
    }, FISHING_RESULT_MS);
  }, [clearFishingTimers, playPlayerAction, showFishingDialogue, triggerCelebration, updateFishingSession]);

  const interactWithFishing = useCallback(() => {
    const status = fishingSessionRef.current.status;
    if (status === 'casting' || status === 'waiting') {
      finishFishingFailure('early');
      return true;
    }
    if (status === 'bite') {
      completeFishingCatch();
      return true;
    }
    if (status === 'success' || status === 'escaped') return true;

    if (!nearbyFishingSpot) {
      if (!fishingRodSelected) return false;
      showFishingDialogue('Fishing Rod', ['연못, 강 또는 해안의 반짝이는 낚시 포인트 가까이에서 사용할 수 있습니다.'], ['Fishing', 'Move closer']);
      return true;
    }
    if (!fishingRodSelected) {
      showFishingDialogue('Fishing Pond', ['낚시하려면 툴벨트의 낚싯대 또는 숫자 4를 선택하세요.'], ['Fishing', 'Select rod']);
      return true;
    }

    startFishing(nearbyFishingSpot);
    return true;
  }, [completeFishingCatch, finishFishingFailure, fishingRodSelected, nearbyFishingSpot, showFishingDialogue, startFishing]);

  const selectFarmTool = useCallback((tool: FarmTool) => {
    finishFishingFailure('tool');
    setFishingRodSelected(false);
    setPickaxeSelected(false);
    setFarmState((current) => {
      const next = current.selectedTool === tool ? current : { ...current, selectedTool: tool };
      farmStateRef.current = next;
      return next;
    });
  }, [finishFishingFailure]);

  const selectSeed = useCallback((crop: CropType) => {
    finishFishingFailure('tool');
    setFishingRodSelected(false);
    setPickaxeSelected(false);
    setFarmState((current) => {
      const next = { ...current, selectedTool: 'seeds' as const, selectedSeed: crop };
      farmStateRef.current = next;
      return next;
    });
  }, [finishFishingFailure]);

  const selectFishingRod = useCallback(() => {
    setPickaxeSelected(false);
    setFishingRodSelected(true);
  }, []);

  const selectPickaxe = useCallback(() => {
    finishFishingFailure('tool');
    setFishingRodSelected(false);
    setPickaxeSelected(true);
  }, [finishFishingFailure]);

  const advanceLifeToNextDay = useCallback(() => {
    const currentVillageLife = villageLifeStateRef.current;
    const currentSeason = seasonStateRef.current;
    const nextDay = currentVillageLife.day + 1;
    const inventorySources = {
      farm: farmStateRef.current,
      fishing: fishingStateRef.current,
      villageLife: currentVillageLife,
      foraging: foragingStateRef.current,
    };
    const available = getShippingAvailability(inventorySources);
    const reconciled = reconcileShipment(shippingStateRef.current, available);
    const shippingResult = settleShipment(reconciled, nextDay, (itemId) => (
      Math.round(getShippingUnitPrice(itemId) * getDemandPriceMultiplier(itemId, currentSeason))
    ));
    shippingStateRef.current = shippingResult.state;
    setShippingState(shippingResult.state);

    const deducted = shippingResult.settlement
      ? deductSettlementInventory(inventorySources, shippingResult.settlement)
      : inventorySources;
    const nextState = advanceVillageDay(deducted.villageLife);
    villageLifeStateRef.current = nextState;
    setVillageLifeState(nextState);
    const nextSeason = syncSeasonState(currentSeason, nextState.day);
    seasonStateRef.current = nextSeason;
    setSeasonState(nextSeason);
    let nextWeather = syncWeatherState(weatherStateRef.current, nextSeason);
    let nextFarm = deducted.farm;
    let rainLine = `${WEATHER_INFO[nextWeather.weather].label} 날씨입니다.`;
    if (shouldApplyRain(nextWeather, nextSeason)) {
      const rain = waterAllPlantedPlots(nextFarm, Date.now());
      nextFarm = rain.state;
      nextWeather = markRainApplied(nextWeather, nextSeason);
      rainLine = rain.changed
        ? `밤새 비가 내려 밭 ${rain.wateredPlotIds.length}칸에 자동으로 물이 들었습니다.`
        : '비가 내렸지만 새로 물을 줄 밭은 없었습니다.';
    }
    weatherStateRef.current = nextWeather;
    setWeatherState(nextWeather);
    farmStateRef.current = nextFarm;
    fishingStateRef.current = deducted.fishing;
    setFarmState(nextFarm);
    setFishingState(deducted.fishing);
    const nextForagingState = syncForagingDay(deducted.foraging, nextState.day);
    foragingStateRef.current = nextForagingState;
    setForagingState(nextForagingState);

    let earningsLine = '오늘은 정산할 배송품이 없습니다.';
    if (shippingResult.settlement) {
      const earnings = applySettlementEarnings(economyStateRef.current, shippingResult.settlement.total);
      economyStateRef.current = earnings.state;
      setEconomyState(earnings.state);
      earningsLine = `DAY EARNINGS +${shippingResult.settlement.total} GOLD · ${shippingResult.settlement.lines.length}종 정산`;
      if (earningsFeedbackTimerRef.current !== null) window.clearTimeout(earningsFeedbackTimerRef.current);
      setEarningsFeedback({ id: Date.now(), receipt: shippingResult.settlement });
      earningsFeedbackTimerRef.current = window.setTimeout(() => {
        setEarningsFeedback(null);
        earningsFeedbackTimerRef.current = null;
      }, 3_200);
      if (earnings.unlocked.length > 0) triggerCelebration('economy-milestone');
    }
    const nextFestival = getActiveFestival(nextSeason);
    setDialogue({
      ...farmPatchEntity,
      name: `Y${nextSeason.year} · ${SEASON_INFO[nextSeason.season].label} ${nextSeason.day}`,
      label: 'NEW DAY',
      prompt: `${SEASON_INFO[nextSeason.season].label} ${nextSeason.day} 아침이 시작됐습니다.`,
      dialogue: [
        earningsLine,
        rainLine,
        nextFestival ? `${nextFestival.label}이 FARM VILLAGE 광장에서 열립니다.` : `먹이를 먹은 동물의 생산품을 확인하세요.`,
        `완벽 돌봄 연속 기록: ${nextState.perfectCareStreak}일`,
      ],
      tags: ['Village Life', 'New day', nextSeason.season, nextWeather.weather],
    });
  }, [triggerCelebration]);

  const stopWalking = useCallback(() => {
    setPlayer((current) => (current.walking ? { ...current, walking: false } : current));
  }, []);

  const applyRegionChange = useCallback((nextState: OpenWorldState, from: RegionId, to: RegionId, firstVisit = false, worldExplorer = false) => {
    if (regionTransitionPendingRef.current) return;
    regionTransitionPendingRef.current = true;
    cancelFishingRef.current('scene');
    cancelPlayerAction();
    pressedDirectionsRef.current = [];
    setDialogue(null);
    setFastTravelReady(false);
    const transitionId = Date.now();
    setRegionTransition({ id: transitionId, from, to, phase: 'out' });
    if (regionTransitionTimerRef.current !== null) window.clearTimeout(regionTransitionTimerRef.current);
    regionTransitionTimerRef.current = window.setTimeout(() => {
      openWorldStateRef.current = nextState;
      setOpenWorldState(nextState);
      const arrival = nextState.positions[to];
      setPlayer((current) => ({ ...current, ...arrival, walking: false, step: current.step + 1 }));
      setRegionTransition({ id: transitionId, from, to, phase: 'in' });
      if (worldExplorer) triggerCelebration('world-explorer');
      else if (firstVisit) triggerCelebration('area-discovered');
      regionTransitionTimerRef.current = window.setTimeout(() => {
        setRegionTransition(null);
        regionTransitionPendingRef.current = false;
        regionTransitionTimerRef.current = null;
      }, REGION_TRANSITION_SWAP_MS);
    }, REGION_TRANSITION_SWAP_MS);
  }, [cancelPlayerAction, triggerCelebration]);

  const transitionThroughExit = useCallback((exit: RegionExit) => {
    const result = enterRegion(openWorldStateRef.current, exit);
    applyRegionChange(result.state, exit.from, exit.to, result.firstVisit, result.worldExplorer);
  }, [applyRegionChange]);

  const travelToRegion = useCallback((region: RegionId) => {
    const current = openWorldStateRef.current;
    if (!current.fastTravelUnlocked.includes(region) || region === current.currentRegion) return;
    const nextState = fastTravelTo(current, region);
    applyRegionChange(nextState, current.currentRegion, region);
    setMenuOpen(false);
  }, [applyRegionChange]);

  const movePlayer = useCallback((direction: Direction) => {
    if (regionTransitionPendingRef.current || regionTransition) return;
    cancelPlayerAction();
    cancelFishingRef.current('move');
    setFastTravelReady(false);
    setDialogue(null);
    if (scene === 'outside') {
      const exit = getRegionExit(currentRegion, player, direction);
      if (exit) {
        transitionThroughExit(exit);
        return;
      }
    }
    setPlayer((current) => {
      const worldWidth = getSceneWorldWidth(scene);
      const worldHeight = getSceneWorldHeight(scene);
      const delta = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0],
      }[direction];
      const nextX = Math.max(0, Math.min(worldWidth - 1, current.x + delta[0]));
      const nextY = Math.max(0, Math.min(worldHeight - 1, current.y + delta[1]));
      if (isBlockedByEntity(nextX, nextY, scene, currentRegion, currentEntities, activeInterior)) {
        return { ...current, facing: direction, walking: false };
      }
      return {
        x: nextX,
        y: nextY,
        facing: direction,
        walking: true,
        step: current.step + 1,
      };
    });
  }, [activeInterior, cancelPlayerAction, currentEntities, currentRegion, player, regionTransition, scene, transitionThroughExit]);

  const unlock = useCallback((target: Entity, dialogueLines: string[] = target.dialogue) => {
    setDialogue(dialogueLines === target.dialogue ? target : { ...target, dialogue: dialogueLines });
    setJournal((current) => addUnique(current, target.journalTitle));
  }, []);

  const enterBuilding = useCallback((interiorId: InteriorId) => {
    cancelFishingRef.current('scene');
    cancelPlayerAction();
    pressedDirectionsRef.current = [];
    const info = INTERIOR_INFO[interiorId];
    const roomEntry = getInteriorEntities(interiorId)[0];
    lastOutdoorRef.current = {
      region: currentRegion,
      position: getSafeRegionPosition(currentRegion, { x: player.x, y: player.y, facing: player.facing }),
    };
    setActiveInterior(interiorId);
    setScene('interior');
    setPlayer((current) => ({ ...current, ...info.entry, walking: false, step: current.step + 1 }));
    if (interiorId === 'shop' && questStage === 'visit-seed-shop') {
      setQuestStage('harvest-village-crops');
      unlock(roomEntry, ['씨앗 가게에 도착했다.', '다음 단계: 밭에서 잘 익은 작물 3개를 수확하자.']);
      return;
    }
    if (interiorId === 'barn' && questStage === 'inspect-barn') {
      setQuestStage('return-to-board');
      unlock(roomEntry, ['헛간의 우리와 사료통을 확인했다.', '마지막 단계: 마을 게시판에 완료 보고를 남기자.']);
      return;
    }
    unlock(roomEntry, [`${info.label} 안으로 들어왔다.`, ...roomEntry.dialogue]);
  }, [cancelPlayerAction, currentRegion, player.facing, player.x, player.y, questStage, unlock]);

  const leaveBuilding = useCallback(() => {
    if (!activeInterior) return;
    cancelFishingRef.current('scene');
    cancelPlayerAction();
    pressedDirectionsRef.current = [];
    const info = INTERIOR_INFO[activeInterior];
    const returnRegion: RegionId = 'farm-village';
    const outsideReturn = getSafeRegionPosition(returnRegion, info.outsideReturn);
    const current = openWorldStateRef.current;
    const nextWorldState: OpenWorldState = {
      ...current,
      currentRegion: returnRegion,
      positions: {
        ...current.positions,
        [returnRegion]: outsideReturn,
      },
    };
    openWorldStateRef.current = nextWorldState;
    lastOutdoorRef.current = { region: returnRegion, position: outsideReturn };
    setOpenWorldState(nextWorldState);
    setActiveInterior(null);
    setScene('outside');
    setPlayer((playerState) => ({ ...playerState, ...outsideReturn, walking: false, step: playerState.step + 1 }));
    setDialogue({
      ...outsideEntities[0],
      name: info.label,
      prompt: `${info.label}에서 마을로 나왔다.`,
      dialogue: ['다시 농장 마을의 바람과 새소리가 들린다.'],
    });
  }, [activeInterior, cancelPlayerAction]);

  const interactWithNearbyAnimal = useCallback(() => {
    if (!nearbyAnimal) return false;
    const animalId = nearbyAnimal.id;
    const currentVillageLife = villageLifeStateRef.current;
    const animal = currentVillageLife.animals[animalId];
    if (!animal.product && !animal.fed) {
      const fedEconomy = consumeFeed(economyStateRef.current);
      if (!fedEconomy) {
        showEconomyMessage('Animal Feed', '사료가 없습니다. 준이나 씨앗 가게에서 사료를 구입하세요.', ['Ranch', 'Feed', 'Empty']);
        return true;
      }
      economyStateRef.current = fedEconomy;
      setEconomyState(fedEconomy);
    }
    const result = interactWithAnimal(currentVillageLife, animalId, villageTime.phase);
    villageLifeStateRef.current = result.state;
    setVillageLifeState(result.state);
    const info = ANIMAL_INFO[animalId];
    const status = getAnimalStatus(result.state.animals[animalId], villageTime.phase);
    const feedbackCopy = result.perfectCare
      ? { tone: 'perfect' as const, title: 'PERFECT CARE', detail: '모든 동물 돌봄 완료', asset: undefined }
      : result.action === 'collect' && result.product
        ? { tone: 'collect' as const, title: '+1 PRODUCT', detail: PRODUCT_INFO[result.product].label, asset: PRODUCT_INFO[result.product].asset }
        : result.action === 'pet'
          ? { tone: 'pet' as const, title: '♥ HAPPY', detail: info.name, asset: undefined }
          : { tone: 'feed' as const, title: 'FED', detail: info.name, asset: undefined };

    if (result.changed) {
      showLifeFeedback({ ...feedbackCopy, x: nearbyAnimal.position.x, y: nearbyAnimal.position.y });
    }
    if (result.product) {
      setActiveInventoryTab('ranch');
      setSelectedInventoryId(`product-${result.product}`);
      if (result.product === 'golden-egg') triggerCelebration('golden-egg');
    }
    setDialogue({
      ...farmPatchEntity,
      name: `${info.name} · ${status}`,
      label: 'RANCH',
      prompt: result.message,
      dialogue: [result.message, result.perfectCare ? 'PERFECT CARE! 오늘의 다섯 마리 돌봄을 모두 마쳤습니다.' : `현재 상태: ${status}`],
      tags: [animalId, info.species, result.action],
    });
    return true;
  }, [nearbyAnimal, showEconomyMessage, showLifeFeedback, triggerCelebration, villageTime.phase]);

  const interactWithNearbyForage = useCallback(() => {
    if (!nearbyForageNode) return false;
    if (nearbyForageNode.tool === 'pickaxe') playPlayerAction('pickaxe');
    const result = collectForageNode(
      foragingStateRef.current,
      nearbyForageNode.id,
      villageLifeState.day,
      pickaxeSelected ? 'pickaxe' : 'hand',
    );
    const miningBonus = result.changed && result.item && nearbyForageNode.tool === 'pickaxe'
      ? getMiningYieldBonus(toolProgressionStateRef.current.levels.pickaxe, Math.random())
      : 0;
    const nextForagingState = result.item && miningBonus > 0
      ? { ...result.state, inventory: { ...result.state.inventory, [result.item]: result.state.inventory[result.item] + miningBonus } }
      : result.state;
    foragingStateRef.current = nextForagingState;
    setForagingState(nextForagingState);
    if (result.changed && result.item) {
      showForageFeedback({ x: nearbyForageNode.x, y: nearbyForageNode.y, item: result.item });
      setActiveInventoryTab('forage');
      setSelectedInventoryId(`forage-${result.item}`);
      if (result.item === 'star-crystal') triggerCelebration('rare-crystal');
      else if (result.rare) triggerCelebration('rare-forage');
    }
    setDialogue({
      ...farmPatchEntity,
      name: result.item ? FORAGE_ITEM_INFO[result.item].label : nearbyForageNode.tool === 'pickaxe' ? '단단한 광맥' : '빈 채집 자리',
      label: nearbyForageNode.region === 'mine-foothill' ? 'MINE' : 'FORAGE',
      prompt: result.message,
      dialogue: [result.message, miningBonus > 0 ? '강화된 곡괭이가 광석을 하나 더 찾아냈습니다. +1 BONUS' : result.item ? FORAGE_ITEM_INFO[result.item].description : '도구를 확인하거나 다음 날 다시 찾아오세요.'],
      tags: ['Open World', nearbyForageNode.region, nearbyForageNode.item],
    });
    return true;
  }, [nearbyForageNode, pickaxeSelected, playPlayerAction, showForageFeedback, triggerCelebration, villageLifeState.day]);

  const interactWithNearbyFarmPlot = useCallback(() => {
    if (!nearbyFarmPlot) return false;

    const currentFarm = farmStateRef.current;
    if (nearbyFarmPlot.stage === 'tilled' && currentFarm.selectedTool === 'seeds' && economyStateRef.current.seedInventory[currentFarm.selectedSeed] <= 0) {
      showEconomyMessage('Seed Pouch', `${FARM_CROP_INFO[currentFarm.selectedSeed].label} 씨앗이 없습니다. 씨앗 가게에서 구입하세요.`, ['Farm', 'Seeds', 'Empty']);
      return true;
    }

    if (currentFarm.selectedTool === 'hoe') playPlayerAction('hoe');
    if (currentFarm.selectedTool === 'watering-can') playPlayerAction('water');

    const hadFirstHarvest = currentFarm.firstHarvested;
    const now = Date.now();
    const growthMultiplier = (crop: CropType) => getCropGrowthMultiplier(crop, seasonStateRef.current.season);
    const seasonQualityBonus = nearbyFarmPlot.crop
      ? getCropSeasonQualityBonus(nearbyFarmPlot.crop, seasonStateRef.current.season)
      : 0;
    let result = interactWithFarmPlot(
      currentFarm,
      nearbyFarmPlot.id,
      now,
      Math.random(),
      villageLifeStateRef.current.perfectCareStreak,
      growthMultiplier,
      seasonQualityBonus,
    );
    if (result.changed && currentFarm.selectedTool === 'watering-can' && nearbyFarmPlot.stage === 'planted') {
      const targetIds = getWateringTargetIds(currentFarm.plots, nearbyFarmPlot.id, toolProgressionStateRef.current.levels['watering-can']);
      let expandedState = result.state;
      let wateredCount = 1;
      for (const plotId of targetIds.slice(1)) {
        const adjacentPlot = expandedState.plots.find((plot) => plot.id === plotId);
        const adjacent = interactWithFarmPlot(
          expandedState,
          plotId,
          now,
          Math.random(),
          villageLifeStateRef.current.perfectCareStreak,
          growthMultiplier,
          adjacentPlot?.crop ? getCropSeasonQualityBonus(adjacentPlot.crop, seasonStateRef.current.season) : 0,
        );
        expandedState = adjacent.state;
        if (adjacent.changed) wateredCount += 1;
      }
      result = { ...result, state: expandedState, message: wateredCount > 1 ? `강화된 물뿌리개로 밭 ${wateredCount}칸에 물을 주었습니다.` : result.message };
    }
    if (result.changed && nearbyFarmPlot.stage === 'tilled' && currentFarm.selectedTool === 'seeds') {
      const nextEconomy = consumeSeed(economyStateRef.current, currentFarm.selectedSeed);
      if (nextEconomy) {
        economyStateRef.current = nextEconomy;
        setEconomyState(nextEconomy);
      }
    }
    farmStateRef.current = result.state;
    setFarmState(result.state);
    const dialogueLines = [result.message];
    let dialogueName = `Farm Plot ${nearbyFarmPlot.id.replace('plot-', '')}`;

    if (result.harvestedCrop) {
      const cropInfo = FARM_CROP_INFO[result.harvestedCrop];
      const quality = result.harvestedQuality ?? 'normal';
      showHarvestFeedback(result.harvestedCrop, quality, nearbyFarmPlot.x, nearbyFarmPlot.y);
      if (!hadFirstHarvest) triggerCelebration('first-harvest');
      dialogueName = cropInfo.label;
      dialogueLines.push(cropInfo.description);
      dialogueLines.push(`수확 품질: ${quality.toUpperCase()}`);
      if (result.firstOfType) {
        dialogueLines.push(`농장 도감 해금: ${cropInfo.journalTitle}`);
      }

      if (FARM_LIFE_CROPS.includes(result.harvestedCrop)) {
        const nextLifeState = recordCropHarvestForQuest(villageLifeState, result.harvestedCrop);
        villageLifeStateRef.current = nextLifeState;
        setVillageLifeState(nextLifeState);
      }

      if (questStage === 'harvest-village-crops' && FARM_GARDEN_CROPS.includes(result.harvestedCrop)) {
        const nextHarvestCount = Math.min(harvestCount + 1, 3);
        setHarvestCount(nextHarvestCount);
        if (nextHarvestCount === 3) {
          setQuestStage('inspect-barn');
          dialogueLines.push('작물 3개를 모두 수확했습니다. 다음은 남쪽 헛간입니다.');
        } else {
          dialogueLines.push(`퀘스트 수확 진행: ${nextHarvestCount}/3`);
        }
      }
    }

    setDialogue({
      ...farmPatchEntity,
      name: dialogueName,
      prompt: result.message,
      dialogue: dialogueLines,
      tags: result.harvestedCrop ? [result.harvestedCrop, result.harvestedQuality ?? 'normal', 'Harvest'] : [currentFarm.selectedTool, nearbyFarmPlot.stage],
    });
    return true;
  }, [harvestCount, nearbyFarmPlot, playPlayerAction, questStage, showEconomyMessage, showHarvestFeedback, triggerCelebration]);

  const interact = useCallback(() => {
    if (commerceViewRef.current) return;
    if (scene === 'outside' && interactWithFishing()) return;
    if (scene === 'outside' && interactWithNearbyAnimal()) return;
    if (scene === 'outside' && interactWithNearbyFarmPlot()) return;
    if (scene === 'outside' && interactWithNearbyForage()) return;

    const target = nearby;
    if (!target) {
      setDialogue({
        ...emptyLookEntity,
        scene,
        name: scene === 'outside' ? 'Empty Field' : 'Quiet Room',
      });
      return;
    }

    const interiorId = scene === 'outside' ? getInteriorIdForBuilding(target.id) : null;
    if (interiorId) {
      enterBuilding(interiorId);
      return;
    }

    if (target.id === 'shippingBox' && scene === 'outside') {
      unlock(target);
      openCommerce('shipping');
      return;
    }
    if (target.id === 'exitDoor' && scene === 'interior') {
      leaveBuilding();
      return;
    }
    if (target.id === 'farmhouseBed' && scene === 'interior') {
      advanceLifeToNextDay();
      return;
    }
    if (target.id === 'farmhouseChest' && scene === 'interior') {
      setActiveInventoryTab('bag');
      setSelectedInventoryId('field-journal');
      unlock(target, ['튼튼한 수납함을 열었습니다.', '오른쪽 BAG에서 도구와 기록을 확인할 수 있습니다.']);
      return;
    }
    if (target.id === 'shopSeedShelf' && scene === 'interior') {
      setActiveInventoryTab('farm');
      setSeedGroup('garden');
      unlock(target, ['감자, 딸기, 당근, 토마토, 옥수수, 호박 씨앗과 농장 도구가 정리되어 있습니다.', '필요한 수량을 고르고 GOLD로 구입할 수 있습니다.']);
      openCommerce('shop');
      return;
    }
    if (target.id === 'barnProductShelf' && scene === 'interior') {
      setActiveInventoryTab('ranch');
      setSelectedInventoryId('ranch-journal');
      unlock(target, ['생산품 보관함을 열었습니다.', '오른쪽 RANCH에서 달걀과 우유 수량을 확인할 수 있습니다.']);
      return;
    }

    if (target.id === 'festivalDisplay' && activeFestival) {
      if (hasCompletedFestival(festivalStateRef.current, activeFestival.id, seasonStateRef.current.year)) {
        unlock(target, [
          `${activeFestival.label} 참여 기록은 이미 올해 JOURNAL에 남아 있습니다.`,
          `${activeFestival.rewardLabel}은 연도별 한 번만 받을 수 있습니다.`,
        ]);
        return;
      }

      let participationLine = '광장의 별빛 등불을 밝혔습니다.';
      if (activeFestival.id === 'harvest-night') {
        const submission = takeOneHarvestForFestival(farmStateRef.current);
        if (!submission) {
          unlock(target, ['출품할 수확물이 없습니다.', '밭에서 작물을 하나 수확한 뒤 다시 찾아오세요.']);
          return;
        }
        farmStateRef.current = submission.state;
        setFarmState(submission.state);
        const nextShipping = reconcileShipment(shippingStateRef.current, getShippingAvailability({
          farm: submission.state,
          fishing: fishingStateRef.current,
          villageLife: villageLifeStateRef.current,
          foraging: foragingStateRef.current,
        }));
        shippingStateRef.current = nextShipping;
        setShippingState(nextShipping);
        participationLine = `${FARM_CROP_INFO[submission.crop].label} ${submission.quality.toUpperCase()} 한 개를 출품했습니다.`;
      }

      const result = completeFestival(festivalStateRef.current, activeFestival.id, seasonStateRef.current.year);
      festivalStateRef.current = result.state;
      setFestivalState(result.state);
      triggerCelebration(activeFestival.id);
      unlock(target, [
        participationLine,
        `${activeFestival.rewardLabel}을 받았습니다. ITEM ACQUIRED`,
        `${result.journalEntry ?? activeFestival.journalTitle} · JOURNAL 기록 완료`,
      ]);
      return;
    }

    if (target.id === 'villageKeeper') {
      unlock(target, [
        ...(activeFestival
          ? [`${activeFestival.label} 날이에요. 광장 중심의 ${activeFestival.interactionLabel}에 참여해 보세요.`]
          : getVillageKeeperDialogue(villageTime.phase)),
        `${seasonWeatherLine} · ${weatherState.weather === 'rain' ? '비 덕분에 심어진 밭은 오늘 자동으로 물을 머금었어요.' : weatherState.weather === 'snow' ? '눈은 작물을 해치지 않으니 천천히 돌보면 돼요.' : '오늘의 하늘도 마을 연대기에 기록해 둘게요.'}`,
      ]);
      return;
    }

    const lifeNpcId = entityLifeNpcIds[target.id];
    if (lifeNpcId) {
      const result = interactWithLifeNpc(villageLifeState, lifeNpcId, villageTime.phase);
      villageLifeStateRef.current = result.state;
      setVillageLifeState(result.state);
      unlock(target, [
        ...(activeFestival ? [`${activeFestival.label} 준비로 오늘은 광장에 나와 있어요.`] : result.lines),
        `${seasonWeatherLine} · ${lifeNpcId === 'farmer-hana' ? '선호 계절 작물은 조금 더 빠르고 좋은 품질로 자라요.' : '계절이 바뀌어도 동물 돌봄은 매일 이어져요.'}`,
      ]);
      if (result.completed) triggerCelebration('npc-quest');
      if (lifeNpcId === 'rancher-jun') openCommerce('ranch');
      return;
    }

    const openWorldNpcId = entityOpenWorldNpcIds[target.id];
    if (openWorldNpcId) {
      const result = interactWithOpenWorldNpc(foragingStateRef.current, openWorldNpcId, villageTime.phase);
      foragingStateRef.current = result.state;
      setForagingState(result.state);
      unlock(target, [...result.lines, `${seasonWeatherLine}의 채집물과 물고기는 다른 계절과 조금 달라요.`]);
      if (result.completed) triggerCelebration('open-world-quest');
      return;
    }

    if (Object.values(travelPostEntityIds).includes(target.id)) {
      setFastTravelReady(true);
      setActiveMenuTab('map');
      setMenuOpen(true);
      unlock(target, [
        `${REGION_INFO[currentRegion].label} 여행 표지판을 확인했습니다.`,
        '이미 직접 발견한 지역으로만 빠르게 이동할 수 있습니다.',
      ]);
      return;
    }

    if (target.id === 'mailbox' && questStage === 'not-started') {
      setHarvestCount(0);
      setQuestStage('visit-seed-shop');
      unlock(target, [
        '새 의뢰를 받았다: 씨앗 가게에 들르고 작물 세 개를 수확한 뒤 헛간을 확인하자.',
        '첫 목적지는 북쪽의 보랏빛 지붕 씨앗 가게다.',
      ]);
      return;
    }

    if (target.id === 'mailbox' && questStage !== 'complete') {
      unlock(target, [`진행 중인 의뢰: ${questObjective}`]);
      return;
    }

    if (target.id === 'board' && questStage === 'return-to-board') {
      setQuestStage('complete');
      triggerCelebration('quest-complete');
      unlock(target, [
        '첫 마을 의뢰 완료. 씨앗 가게와 밭, 헛간의 하루 일이 모두 끝났다.',
        '이제 다른 지역을 탐험하거나 농장 생활을 자유롭게 이어갈 수 있다.',
      ]);
      return;
    }

    if (target.id === 'board' && questStage !== 'not-started' && questStage !== 'complete') {
      unlock(target, [`아직 보고할 수 없다. ${questObjective}`]);
      return;
    }

    unlock(target);
  }, [activeFestival, advanceLifeToNextDay, currentEntities, currentRegion, enterBuilding, interactWithFishing, interactWithNearbyAnimal, interactWithNearbyFarmPlot, interactWithNearbyForage, leaveBuilding, nearby, openCommerce, questObjective, questStage, scene, seasonWeatherLine, triggerCelebration, unlock, villageLifeState, villageTime.phase, weatherState.weather]);

  useEffect(() => {
    if (typedNameLength >= INTRO_TITLE.length) return undefined;
    const timer = window.setTimeout(() => {
      setTypedNameLength((length) => Math.min(INTRO_TITLE.length, length + 1));
    }, 86);
    return () => window.clearTimeout(timer);
  }, [typedNameLength]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    farmStateRef.current = farmState;
    if (gameStarted || canContinue) persistFarmState(farmState);
  }, [canContinue, farmState, gameStarted]);

  useEffect(() => {
    fishingStateRef.current = fishingState;
    if (gameStarted || canContinue) persistFishingState(fishingState);
  }, [canContinue, fishingState, gameStarted]);

  useEffect(() => {
    villageLifeStateRef.current = villageLifeState;
    if (gameStarted || canContinue) persistVillageLifeState(villageLifeState);
  }, [canContinue, gameStarted, villageLifeState]);

  useEffect(() => {
    seasonStateRef.current = seasonState;
    if (gameStarted || canContinue) persistSeasonState(seasonState);
  }, [canContinue, gameStarted, seasonState]);

  useEffect(() => {
    weatherStateRef.current = weatherState;
    if (gameStarted || canContinue) persistWeatherState(weatherState);
  }, [canContinue, gameStarted, weatherState]);

  useEffect(() => {
    festivalStateRef.current = festivalState;
    if (gameStarted || canContinue) persistFestivalState(festivalState);
  }, [canContinue, festivalState, gameStarted]);

  useEffect(() => {
    economyStateRef.current = economyState;
    if (gameStarted || canContinue) persistEconomyState(economyState);
  }, [canContinue, economyState, gameStarted]);

  useEffect(() => {
    shippingStateRef.current = shippingState;
    if (gameStarted || canContinue) persistShippingState(shippingState);
  }, [canContinue, gameStarted, shippingState]);

  useEffect(() => {
    toolProgressionStateRef.current = toolProgressionState;
    if (gameStarted || canContinue) persistToolProgressionState(toolProgressionState);
  }, [canContinue, gameStarted, toolProgressionState]);

  useEffect(() => {
    commerceViewRef.current = commerceView;
  }, [commerceView]);

  useEffect(() => {
    openWorldStateRef.current = openWorldState;
    if (gameStarted || canContinue) persistOpenWorldState(openWorldState);
  }, [canContinue, gameStarted, openWorldState]);

  useEffect(() => {
    if (gameStarted || canContinue) persistInteriorSave(activeInterior, lastOutdoorRef.current);
  }, [activeInterior, canContinue, gameStarted]);

  useEffect(() => {
    foragingStateRef.current = foragingState;
    if (gameStarted || canContinue) persistForagingState(foragingState);
  }, [canContinue, foragingState, gameStarted]);

  useEffect(() => {
    if (!gameStarted && !canContinue) return;
    persistGameProgress({ version: 1, questStage, harvestCount, journal });
  }, [canContinue, gameStarted, harvestCount, journal, questStage]);

  useEffect(() => {
    if (scene !== 'outside') return;
    lastOutdoorRef.current = {
      region: currentRegion,
      position: getSafeRegionPosition(currentRegion, { x: player.x, y: player.y, facing: player.facing }),
    };
    setOpenWorldState((current) => rememberRegionPosition(current, {
      x: player.x,
      y: player.y,
      facing: player.facing,
    }));
  }, [currentRegion, player.facing, player.x, player.y, scene]);

  useEffect(() => {
    setForagingState((current) => syncForagingDay(current, villageLifeState.day));
  }, [villageLifeState.day]);

  useEffect(() => {
    setSeasonState((current) => syncSeasonState(current, villageLifeState.day));
  }, [villageLifeState.day]);

  useEffect(() => {
    setWeatherState((current) => syncWeatherState(current, seasonState));
  }, [seasonState.dateKey]);

  useEffect(() => {
    if ((!gameStarted && !canContinue) || !shouldApplyRain(weatherState, seasonState)) return;
    const rain = waterAllPlantedPlots(farmStateRef.current, Date.now());
    farmStateRef.current = rain.state;
    setFarmState(rain.state);
    setWeatherState((current) => markRainApplied(current, seasonState));
  }, [canContinue, gameStarted, seasonState, weatherState]);

  useEffect(() => {
    persistTimeMode(timeMode);
  }, [timeMode]);

  useEffect(() => {
    const controller = new RegionAudioController(audioSettings);
    audioControllerRef.current = controller;
    const unlock = () => {
      controller.unlock();
      const desired = desiredAudioTrackRef.current;
      setAudioTrack(gameStartedRef.current && controller.transition(desired) ? desired : 'silent');
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      controller.dispose();
      audioControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    persistAudioSettings(audioSettings);
    const controller = audioControllerRef.current;
    controller?.setInterior(scene === 'interior');
    controller?.setWeatherMix(getWeatherAudioMix(weatherState.weather));
    controller?.updateSettings(audioSettings);
    const desired = desiredAudioTrackRef.current;
    setAudioTrack(gameStarted && controller?.transition(desired) ? desired : 'silent');
  }, [activeFestival?.id, audioSettings, currentRegion, gameStarted, scene, villageTime.isNight, weatherState.weather]);

  useEffect(() => {
    if (!gameStarted) return undefined;
    const updateVillageClock = () => {
      setVillageElapsedMs(Date.now() - villageClockStartedAtRef.current);
    };
    updateVillageClock();
    const timer = window.setInterval(updateVillageClock, VILLAGE_CLOCK_TICK_MS);
    return () => window.clearInterval(timer);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || scene !== 'outside') return undefined;
    const timer = window.setInterval(() => {
      setVillageKeeperFrame((current) => (current + 1) % 3);
    }, 420);
    return () => window.clearInterval(timer);
  }, [gameStarted, scene]);

  useEffect(() => {
    if (!gameStarted || scene !== 'outside') return undefined;
    const timer = window.setInterval(() => {
      setLifeFrame((current) => (current + 1) % 3);
    }, 560);
    return () => window.clearInterval(timer);
  }, [gameStarted, scene]);

  useEffect(() => {
    const cycle = Math.floor(villageElapsedMs / VILLAGE_DAY_DURATION_MS);
    if (previousTimeModeRef.current !== timeMode) {
      previousTimeModeRef.current = timeMode;
      lastAutoDayCycleRef.current = cycle;
      return;
    }
    if (!gameStarted || timeMode !== 'auto' || cycle <= lastAutoDayCycleRef.current) return;
    for (let index = lastAutoDayCycleRef.current; index < cycle; index += 1) {
      advanceLifeToNextDay();
    }
    lastAutoDayCycleRef.current = cycle;
  }, [advanceLifeToNextDay, gameStarted, timeMode, villageElapsedMs]);

  useEffect(() => {
    if (!gameStarted || scene !== 'outside') return undefined;
    const timer = window.setInterval(() => {
      setFishingRippleFrame((current) => (current + 1) % 2);
    }, 520);
    return () => window.clearInterval(timer);
  }, [gameStarted, scene]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFarmState((current) => advanceFarmState(
        current,
        Date.now(),
        (crop) => getCropGrowthMultiplier(crop, seasonStateRef.current.season),
      ));
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const newItem = inventoryItems.find((item) => !knownInventoryIdsRef.current.has(item.id));
    knownInventoryIdsRef.current = new Set(inventoryItems.map((item) => item.id));
    if (!gameStarted || !newItem) return;

    if (itemPickupTimerRef.current !== null) {
      window.clearTimeout(itemPickupTimerRef.current);
    }
    setSelectedInventoryId(newItem.id);
    setActiveInventoryTab(newItem.tab);
    setAcquiredItemId(newItem.id);
    itemPickupTimerRef.current = window.setTimeout(() => {
      setAcquiredItemId(null);
      itemPickupTimerRef.current = null;
    }, 3200);
  }, [gameStarted, inventoryItems]);

  useEffect(() => () => {
    if (itemPickupTimerRef.current !== null) {
      window.clearTimeout(itemPickupTimerRef.current);
    }
    if (celebrationTimerRef.current !== null) {
      window.clearTimeout(celebrationTimerRef.current);
    }
    if (harvestFeedbackTimerRef.current !== null) {
      window.clearTimeout(harvestFeedbackTimerRef.current);
    }
    if (lifeFeedbackTimerRef.current !== null) {
      window.clearTimeout(lifeFeedbackTimerRef.current);
    }
    if (forageFeedbackTimerRef.current !== null) {
      window.clearTimeout(forageFeedbackTimerRef.current);
    }
    if (regionTransitionTimerRef.current !== null) {
      window.clearTimeout(regionTransitionTimerRef.current);
    }
    if (earningsFeedbackTimerRef.current !== null) {
      window.clearTimeout(earningsFeedbackTimerRef.current);
    }
    playerActionTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
    playerActionTimerRefs.current = [];
    clearFishingTimers();
  }, [clearFishingTimers]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    window.visualViewport?.addEventListener('resize', updateViewport, { passive: true });
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    movePlayerRef.current = movePlayer;
  }, [movePlayer]);

  useEffect(() => {
    interactRef.current = interact;
  }, [interact]);

  useEffect(() => {
    stopWalkingRef.current = stopWalking;
  }, [stopWalking]);

  useEffect(() => {
    cancelFishingRef.current = finishFishingFailure;
  }, [finishFishingFailure]);

  useEffect(() => {
    selectFarmToolRef.current = selectFarmTool;
  }, [selectFarmTool]);

  useEffect(() => {
    selectFishingRodRef.current = selectFishingRod;
  }, [selectFishingRod]);

  useEffect(() => {
    selectPickaxeRef.current = selectPickaxe;
  }, [selectPickaxe]);

  useEffect(() => {
    const stopMoveLoop = () => {
      if (moveFrameRef.current !== null) {
        window.cancelAnimationFrame(moveFrameRef.current);
        moveFrameRef.current = null;
      }
      lastMoveAtRef.current = 0;
    };

    const tick = (time: number) => {
      const direction = pressedDirectionsRef.current[pressedDirectionsRef.current.length - 1];
      if (!gameStartedRef.current || !direction) {
        stopMoveLoop();
        stopWalkingRef.current();
        return;
      }

      if (time - lastMoveAtRef.current >= MOVE_INTERVAL_MS) {
        movePlayerRef.current(direction);
        lastMoveAtRef.current = time;
      }
      moveFrameRef.current = window.requestAnimationFrame(tick);
    };

    const ensureMoveLoop = () => {
      if (moveFrameRef.current === null) {
        moveFrameRef.current = window.requestAnimationFrame(tick);
      }
    };

    const clearDirections = () => {
      pressedDirectionsRef.current = [];
      stopMoveLoop();
      stopWalkingRef.current();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!gameStartedRef.current) {
        if (event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyE') {
          event.preventDefault();
          if (canContinue) continueGame();
          else newGame();
        }
        return;
      }

      if (event.code === 'Escape') {
        event.preventDefault();
        clearDirections();
        setMenuOpen(false);
        setDialogue(null);
        commerceViewRef.current = null;
        setCommerceView(null);
        return;
      }

      if (commerceViewRef.current) return;

      const farmTool = farmToolKeyMap[event.code];
      if (farmTool) {
        event.preventDefault();
        selectFarmToolRef.current(farmTool);
        return;
      }

      if (event.code === 'Digit4') {
        event.preventDefault();
        selectFishingRodRef.current();
        return;
      }

      if (event.code === 'Digit5') {
        event.preventDefault();
        selectPickaxeRef.current();
        return;
      }

      const direction = keyMap[event.code];
      if (direction) {
        event.preventDefault();
        pressedDirectionsRef.current = pressedDirectionsRef.current.filter((pressed) => pressed !== direction);
        pressedDirectionsRef.current.push(direction);
        ensureMoveLoop();
        return;
      }

      if (event.code === 'KeyE' || event.code === 'Space') {
        event.preventDefault();
        interactRef.current();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyMap[event.code];
      if (!direction) return;
      pressedDirectionsRef.current = pressedDirectionsRef.current.filter((pressed) => pressed !== direction);
      if (pressedDirectionsRef.current.length === 0) {
        stopWalkingRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    window.addEventListener('blur', clearDirections, { passive: true });
    window.addEventListener('pagehide', clearDirections, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearDirections);
      window.removeEventListener('pagehide', clearDirections);
      stopMoveLoop();
    };
  }, [canContinue, continueGame, newGame]);

  const farmPrompt = nearbyFarmPlot
    ? `밭 ${nearbyFarmPlot.id.replace('plot-', '')} · ${farmStageLabels[nearbyFarmPlot.stage]} · ${FARM_TOOL_INFO[farmState.selectedTool].label}`
    : null;
  const fishingPrompt = nearbyFishingSpot
    ? `${nearbyFishingSpot.habitat.toUpperCase()} 낚시 포인트 · ${fishingRodSelected ? 'E로 캐스팅' : '낚싯대 [4] 필요'}`
    : fishingFeedback?.detail ?? null;
  const animalPrompt = nearbyAnimal
    ? `${ANIMAL_INFO[nearbyAnimal.id].name} · ${getAnimalStatus(villageLifeState.animals[nearbyAnimal.id], villageTime.phase)} · E로 돌보기`
    : null;
  const foragePrompt = nearbyForageNode
    ? `${FORAGE_ITEM_INFO[nearbyForageNode.item].label} · ${nearbyForageNode.tool === 'pickaxe' ? '곡괭이 [5]' : 'E로 채집'}`
    : null;
  const prompt = fishingPrompt ?? animalPrompt ?? farmPrompt ?? foragePrompt ?? nearby?.prompt ?? (scene === 'outside' ? `${REGION_INFO[currentRegion].label} · 길 끝을 따라 다음 지역을 탐험하세요.` : '가구나 문 가까이에서 E를 눌러 살펴보세요.');

  return (
    <section
      className={`farm-game scene-${scene} ${gameStarted ? 'is-playing' : 'is-intro'} ${commerceView ? 'commerce-open' : ''}`}
      style={{
        '--dialogue-bar-height': `${dialogueBarHeight}px`,
        '--inventory-rail-width': `${inventoryRailWidth}px`,
      } as CSSProperties}
      data-ui-pass="mossbell-farm-game"
      data-game-world="playable-cozy-farm-rpg"
      data-economy-system="v1"
      data-season-system="v1"
      data-weather-system="v1"
      data-festival-system="v1"
      data-season-date={`${seasonState.year}-${seasonState.season}-${seasonState.day}`}
      data-season-storage-key={SEASON_STORAGE_KEY}
      data-weather-storage-key={WEATHER_STORAGE_KEY}
      data-festival-storage-key={FESTIVAL_STORAGE_KEY}
      data-season-year={seasonState.year}
      data-season={seasonState.season}
      data-today-weather={weatherState.weather}
      data-season-demand-count="3"
      data-active-festival={activeFestival?.id ?? 'none'}
      data-festival-completed={activeFestivalCompleted ? 'true' : 'false'}
      data-screen-mode="fullscreen-game-shell"
      data-scroll-policy="viewport-contained"
      data-layout-mode="full-screen-map-with-right-inventory-bar"
      data-topbar-visible="false"
      data-sidebar-visible="true"
      data-overlay-layer="dialogue-and-menu"
      data-dialogue-mode="bottom-bar"
      data-game-phase={gameStarted ? 'playing' : 'intro'}
      data-art-remaster="v1"
      data-visual-source="gpt-image"
      data-animation-catalog="directional-gpt-sprites"
      data-audio-system="region-crossfade"
      data-music-muted={audioSettings.muted ? 'true' : 'false'}
      data-music-volume={audioSettings.volume.toFixed(2)}
      data-audio-track={audioTrack}
      data-intro-title={INTRO_TITLE}
      data-typed-title={typedTitle}
      data-current-scene={scene}
      data-current-interior={activeInterior ?? 'outside'}
      data-interior-count={INTERIOR_IDS.length}
      data-interior-storage-key={INTERIOR_STORAGE_KEY}
      data-player-x={player.x}
      data-player-y={player.y}
      data-player-facing={player.facing}
      data-player-walking={player.walking ? 'true' : 'false'}
      data-player-frame={playerFrameIndex}
      data-walk-cycle="coherent-generated-frames"
      data-sprite-normalization="bottom-centered-transparent-canvas"
      data-movement-mode="pressed-key-raf-loop"
      data-world-scale-mode="pixel-locked-cover"
      data-map-grid="32x22"
      data-mobile-fit-mode="camera-fullscreen-safe-area"
      data-camera-mode="player-centered-fullscreen"
      data-collision-mode="entity-and-water-bounds"
      data-depth-sorting="y-axis-feet"
      data-right-inventory-bar="persistent"
      data-settings-open={menuOpen ? 'true' : 'false'}
      data-settings-tab={activeMenuTab}
      data-inventory-open="true"
      data-inventory-count={inventoryItems.length}
      data-inventory-tab={activeInventoryTab}
      data-inventory-tab-control="bag-farm-ranch-forage"
      data-selected-inventory-item={selectedInventoryItem?.id ?? ''}
      data-item-pickup={acquiredItemId ?? ''}
      data-item-pickup-visible={acquiredItem ? 'true' : 'false'}
      data-farm-loop="v1"
      data-farm-storage="localStorage"
      data-farm-storage-key={FARM_STORAGE_KEY}
      data-farm-plot-count={farmState.plots.length}
      data-selected-farm-tool={farmState.selectedTool}
      data-selected-game-tool={selectedGameTool}
      data-selected-seed={farmState.selectedSeed}
      data-farm-ready-count={readyFarmPlotCount}
      data-farm-harvest-total={totalFarmHarvest}
      data-farm-first-harvest={farmState.firstHarvested ? 'true' : 'false'}
      data-farm-growth="v2"
      data-farm-crop-count="6"
      data-crop-quality={harvestFeedback?.quality ?? 'none'}
      data-watering-streak={farmState.wateringStreak}
      data-fishing-loop="v1"
      data-fishing-storage="localStorage"
      data-fishing-storage-key={FISHING_STORAGE_KEY}
      data-fishing-water="pond"
      data-fishing-spot-count={currentRegionFishingSpots.length}
      data-fishing-spot-total="6"
      data-fishing-species={FISH_IDS.join(',')}
      data-fishing-state={fishingSession.status}
      data-fishing-catch-total={fishingState.totalCaught}
      data-fishing-discovered={fishingState.discovered.join(',')}
      data-fishing-pool={getFishingPool(villageTime.isNight, nearbyFishingSpot?.habitat ?? activeFishingSpot?.habitat ?? 'pond', seasonState.season).join(',')}
      data-fishing-feedback={fishingFeedback?.tone ?? 'none'}
      data-village-pulse="v1"
      data-time-mode={timeMode}
      data-day-phase={villageTime.phase}
      data-village-clock={villageTime.clock}
      data-npc-count="5"
      data-village-life="v2"
      data-village-day={villageLifeState.day}
      data-village-life-storage="localStorage"
      data-village-life-storage-key={VILLAGE_LIFE_STORAGE_KEY}
      data-life-npc-count="2"
      data-life-npc-schedule={villageTime.phase}
      data-ranch-animal-count="5"
      data-ranch-product-total={getTotalRanchProducts(villageLifeState)}
      data-perfect-care-streak={villageLifeState.perfectCareStreak}
      data-farmer-quest={villageLifeState.farmerQuest.status}
      data-rancher-quest={villageLifeState.rancherQuest.status}
      data-open-world="v1"
      data-current-region={currentRegion}
      data-world-region-count="4"
      data-world-graph="explicit"
      data-world-neighbors={WORLD_GRAPH[currentRegion].join(',')}
      data-open-world-storage-key={OPEN_WORLD_STORAGE_KEY}
      data-region-transition={regionTransition ? `${regionTransition.from}->${regionTransition.to}` : 'idle'}
      data-region-transition-phase={regionTransition?.phase ?? 'idle'}
      data-region-discovered={openWorldState.discovered.join(',')}
      data-fast-travel={fastTravelReady ? 'ready' : 'locked'}
      data-near-fast-travel={isNearFastTravelPost(currentRegion, player) ? 'true' : 'false'}
      data-open-world-npc-count="2"
      data-foraging-loop="v1"
      data-foraging-storage="localStorage"
      data-foraging-storage-key={FORAGING_STORAGE_KEY}
      data-forage-node-count="10"
      data-forage-visible={getVisibleForageNodes(foragingState, currentRegion).length}
      data-forage-inventory-total={getTotalForageInventory(foragingState)}
      data-forage-quest={foragingState.forageQuest.status}
      data-mine-quest={foragingState.mineQuest.status}
      data-celebration={celebration?.kind ?? 'none'}
      data-harvest-combo={harvestFeedback?.count ?? 0}
      data-labels-visible={showLabels ? 'true' : 'false'}
      data-label-display-mode="nearby-only-default"
      data-hints-visible={showHints ? 'true' : 'false'}
      data-nearby-object={nearbyFishingSpot?.id ?? nearbyAnimal?.id ?? nearbyFarmPlot?.id ?? nearbyForageNode?.id ?? nearby?.id ?? ''}
      data-active-dialogue={dialogue?.id ?? ''}
      data-dialogue-open={dialogueOpen ? 'true' : 'false'}
      data-quest-stage={questStage}
      data-quest-objective={questObjective}
      data-journal-count={totalJournalCount}
      data-harvest-count={harvestCount}
      data-generated-assets="gpt-image-remaster-packs"
      data-font="Pretendard"
    >
      <div className="game-shell">
        <main className="game-viewport" aria-label="Playable cozy farming RPG map" data-game-surface="full-screen-map">
          {scene === 'outside' ? (
            <div className={`tile-world outside-world region-${currentRegion}`} style={worldCameraStyle} data-map-renderer="single-generated-map-image" data-world-region={currentRegion}>
              <img className="world-map-image" src={getSeasonalMapAsset(currentRegion, seasonState.season)} alt={`${REGION_INFO[currentRegion].label} ${SEASON_INFO[seasonState.season].label} pixel map`} aria-hidden="true" data-world-map-image={`${currentRegion}-${seasonState.season}`} />
              <div className="ambient-world-layer" data-ambient-layer="gpt-pixel-effects" aria-hidden="true">
                {currentAmbientSprites.map((sprite) => {
                  const asset = sprite.kind === 'water'
                    ? EFFECT_SPRITES.ripple[fishingRippleFrame]
                    : sprite.kind === 'smoke'
                      ? EFFECT_SPRITES.smoke
                      : sprite.kind === 'crystal'
                        ? EFFECT_SPRITES.crystal
                        : sprite.kind === 'window'
                          ? EFFECT_SPRITES.windowLight
                          : '/assets/art-remaster-v1/props/wildflowers.png';
                  return <img key={sprite.id} className={`ambient-sprite kind-${sprite.kind}`} src={asset} style={{ left: sprite.x * TILE, top: sprite.y * TILE }} alt="" data-ambient-sprite={sprite.kind} />;
                })}
              </div>
              <div className="region-nameplate" data-region-nameplate={currentRegion}>
                <span>{REGION_INFO[currentRegion].shortLabel}</span>
                <strong>{REGION_INFO[currentRegion].label}</strong>
              </div>
              {currentEntities.map((entity) => {
                const entitySprite = entity.id === 'villageKeeper' ? villageKeeperSprite : entity.sprite;
                const lifeNpcId = entityLifeNpcIds[entity.id];
                const openWorldNpcId = entityOpenWorldNpcIds[entity.id];
                return (
                  <div key={entity.id} className={`game-entity entity-${entity.id} ${lifeNpcId || openWorldNpcId ? 'entity-life-npc' : ''} ${nearby?.id === entity.id ? 'is-nearby' : ''}`} style={{ left: entity.x * TILE, top: entity.y * TILE, width: entity.w * TILE, height: entity.h * TILE, zIndex: getEntityDepth(entity) }} data-entity-id={entity.id} data-npc-id={entity.id === 'villageKeeper' ? 'village-keeper' : undefined} data-life-npc-id={lifeNpcId} data-open-world-npc-id={openWorldNpcId} data-life-npc-schedule={lifeNpcId || openWorldNpcId ? villageTime.phase : undefined}>
                    {entitySprite && <img className="sprite generated-sprite" src={entitySprite} alt="" aria-hidden="true" data-npc-frame={entity.id === 'villageKeeper' ? villageKeeperFrame : lifeNpcId ? lifeFrame : undefined} />}
                    <b>{entity.label}</b>
                  </div>
                );
              })}
              {currentRegion === 'farm-village' && farmState.plots.map((plot, index) => {
                const cropAsset = getFarmCropAsset(plot);
                return (
                  <div
                    key={plot.id}
                    className={`farm-plot stage-${plot.stage} crop-${plot.crop ?? 'empty'} ${nearbyFarmPlot?.id === plot.id ? 'is-nearby' : ''}`}
                    style={{ left: plot.x * TILE, top: plot.y * TILE, zIndex: 12 + (plot.y + 1) * 10 }}
                    aria-label={`밭 ${index + 1}: ${farmStageLabels[plot.stage]}`}
                    data-farm-plot-id={plot.id}
                    data-farm-stage={plot.stage}
                    data-farm-crop={plot.crop ?? ''}
                    data-farm-nearby={nearbyFarmPlot?.id === plot.id ? 'true' : 'false'}
                  >
                    <img className="farm-plot-ground" src={getFarmGroundAsset(plot.stage)} alt="" aria-hidden="true" />
                    {cropAsset && <img className="farm-crop-sprite" src={cropAsset} alt="" aria-hidden="true" />}
                    <span>{index + 1}</span>
                  </div>
                );
              })}
              {currentRegionFishingSpots.map((spot) => {
                const isActive = activeFishingSpot?.id === spot.id && fishingSession.status !== 'idle';
                const isNearby = nearbyFishingSpot?.id === spot.id;
                const showBobber = isActive && fishingSession.status !== 'success' && fishingSession.status !== 'escaped';
                return (
                  <div
                    key={spot.id}
                    className={`fishing-spot ${isNearby ? 'is-nearby' : ''} ${isActive ? 'is-active' : ''} status-${isActive ? fishingSession.status : 'idle'}`}
                    style={{ left: spot.bobberX * TILE, top: spot.bobberY * TILE, zIndex: 11 + spot.bobberY * 10 }}
                    data-fishing-spot-id={spot.id}
                    data-fishing-spot-nearby={isNearby ? 'true' : 'false'}
                  >
                    <img className="fishing-ripple" src={EFFECT_SPRITES.ripple[fishingRippleFrame]} alt="" aria-hidden="true" />
                    {showBobber && (
                      <>
                        <i className={`fishing-line facing-${spot.facing}`} aria-hidden="true" />
                        <img className="fishing-bobber" src={EFFECT_SPRITES.bobber} alt="" aria-hidden="true" />
                      </>
                    )}
                    {showHints && isNearby && fishingSession.status === 'idle' && <kbd>E</kbd>}
                  </div>
                );
              })}
              {currentRegion === 'farm-village' && !villageTime.isNight && ANIMAL_IDS.map((animalId) => {
                const animal = villageLifeState.animals[animalId];
                const info = ANIMAL_INFO[animalId];
                const position = getAnimalPosition(animalId, villageTime.phase, lifeFrame);
                const status = getAnimalStatus(animal, villageTime.phase);
                const isNearby = nearbyAnimal?.id === animalId;
                return (
                  <div
                    key={animalId}
                    className={`ranch-animal species-${info.species} status-${status} ${isNearby ? 'is-nearby' : ''}`}
                    style={{ left: position.x * TILE, top: position.y * TILE, zIndex: 14 + Math.round((position.y + 1) * 10) }}
                    aria-label={`${info.name}: ${status}`}
                    data-animal-id={animalId}
                    data-animal-species={info.species}
                    data-animal-status={status}
                  >
                    <img src={getAnimalSprite(animalId, villageTime.phase, lifeFrame, status)} alt="" aria-hidden="true" />
                    {animal.product && <img className="animal-product-ready" src={PRODUCT_INFO[animal.product].asset} alt="" aria-hidden="true" />}
                    {status === 'happy' && <img className="animal-mood-sprite" src={EFFECT_SPRITES.heart} alt="" aria-hidden="true" />}
                    {showHints && isNearby && <kbd>E</kbd>}
                  </div>
                );
              })}
              {getVisibleForageNodes(foragingState, currentRegion).map((node) => (
                <div
                  key={node.id}
                  className={`forage-node category-${FORAGE_ITEM_INFO[node.item].category} ${nearbyForageNode?.id === node.id ? 'is-nearby' : ''}`}
                  style={{ left: node.x * TILE, top: node.y * TILE, zIndex: 12 + (node.y + 1) * 10 }}
                  data-forage-node-id={node.id}
                  data-forage-item={node.item}
                  data-forage-tool={node.tool}
                >
                  <img src={FORAGE_ITEM_INFO[node.item].asset} alt="" aria-hidden="true" />
                  {showHints && nearbyForageNode?.id === node.id && <kbd>E</kbd>}
                </div>
              ))}
              <img className={`player-sprite facing-${player.facing} ${playerAction ? 'is-action' : player.walking ? 'is-walking' : 'is-idle'}`} src={playerSprite} style={{ left: player.x * TILE, top: player.y * TILE, zIndex: getPlayerDepth(player) }} alt="움직일 수 있는 픽셀 농부" data-player-sprite={playerSprite} data-player-action={playerAction?.kind ?? 'idle'} data-player-action-frame={playerAction?.frame ?? 0} data-sprite-normalization="bottom-centered-transparent-canvas" />
              {forageFeedback && (
                <div className="forage-feedback" style={{ left: forageFeedback.x * TILE, top: forageFeedback.y * TILE - 52, zIndex: 916 }} role="status" data-forage-feedback={forageFeedback.item}>
                  <img src={FORAGE_ITEM_INFO[forageFeedback.item].asset} alt="" aria-hidden="true" />
                  <span>+1 FOUND</span>
                  <strong>{FORAGE_ITEM_INFO[forageFeedback.item].label}</strong>
                </div>
              )}
              {lifeFeedback && (
                <div
                  key={lifeFeedback.id}
                  className={`life-feedback tone-${lifeFeedback.tone}`}
                  style={{ left: lifeFeedback.x * TILE, top: lifeFeedback.y * TILE - 66, zIndex: 915 }}
                  role="status"
                  data-life-feedback={lifeFeedback.tone}
                >
                  {lifeFeedback.asset && <img src={lifeFeedback.asset} alt="" aria-hidden="true" />}
                  <span>{lifeFeedback.title}</span>
                  <strong>{lifeFeedback.detail}</strong>
                </div>
              )}
              {fishingFeedback && activeFishingSpot && (
                <div
                  key={fishingFeedback.id}
                  className={`fishing-feedback tone-${fishingFeedback.tone}`}
                  style={{ left: activeFishingSpot.bobberX * TILE, top: activeFishingSpot.bobberY * TILE - 112, zIndex: 910 }}
                  role="status"
                  data-fishing-feedback={fishingFeedback.tone}
                >
                  {fishingFeedback.fish && <img src={FISH_INFO[fishingFeedback.fish].asset} alt="" aria-hidden="true" />}
                  <span>{fishingFeedback.title}</span>
                  <strong>{fishingFeedback.detail}</strong>
                </div>
              )}
              {harvestFeedback && (
                <div
                  key={harvestFeedback.id}
                  className={`harvest-feedback crop-${harvestFeedback.crop}`}
                  style={{ left: harvestFeedback.x * TILE, top: harvestFeedback.y * TILE - 28, zIndex: 900 }}
                  role="status"
                  data-harvest-feedback="combo-pop"
                  data-crop-quality={harvestFeedback.quality}
                >
                  <i /><i /><i /><i /><i /><i />
                  <span>HARVEST COMBO</span>
                  <strong>+1 {FARM_CROP_INFO[harvestFeedback.crop].shortLabel} · {harvestFeedback.quality.toUpperCase()} · x{harvestFeedback.count}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="tile-world interior-world" style={worldCameraStyle}>
              {currentInteriorInfo && <img className="interior-room-bg" src={currentInteriorInfo.mapAsset} alt={`${currentInteriorInfo.label} pixel interior`} />}
              {currentInteriorEntities.map((entity) => (
                <div key={entity.id} className={`game-entity interior-hotspot entity-${entity.id} ${entity.sprite ? 'interior-actor' : ''} ${nearby?.id === entity.id ? 'is-nearby' : ''}`} style={{ left: entity.x * TILE, top: entity.y * TILE, width: entity.w * TILE, height: entity.h * TILE, zIndex: getEntityDepth(entity) }} data-entity-id={entity.id}>
                  {entity.sprite && <img src={entity.sprite} alt="" aria-hidden="true" />}
                  <b>{entity.label}</b>
                </div>
              ))}
              <img className={`player-sprite facing-${player.facing} ${playerAction ? 'is-action' : player.walking ? 'is-walking' : 'is-idle'}`} src={playerSprite} style={{ left: player.x * TILE, top: player.y * TILE }} alt="실내를 걷는 픽셀 농부" data-player-sprite={playerSprite} data-player-action={playerAction?.kind ?? 'idle'} data-player-action-frame={playerAction?.frame ?? 0} data-sprite-normalization="bottom-centered-transparent-canvas" />
            </div>
          )}
        </main>

        <div className="game-overlay-layer" data-layer="game-overlay-ui">
          {regionTransition && (
            <div className={`region-transition-overlay phase-${regionTransition.phase}`} aria-hidden="true" data-region-transition-overlay={`${regionTransition.from}-${regionTransition.to}`}>
              <span>{REGION_INFO[regionTransition.to].shortLabel}</span>
            </div>
          )}
          {scene === 'outside' && (
            <div className={`village-lighting phase-${villageTime.phase}`} aria-hidden="true" data-village-lighting={villageTime.phase}>
              <i /><i /><i /><i /><i /><i />
            </div>
          )}
          {scene === 'outside' && weatherState.weather !== 'sunny' && (
            <div className={`weather-layer weather-${weatherState.weather}`} aria-hidden="true" data-weather-atlas="gpt-image-particles">
              {Array.from({ length: 16 }, (_, index) => {
                const row = weatherState.weather === 'rain' ? 0 : weatherState.weather === 'snow' ? 1 : 2;
                return <i key={`${weatherState.dateKey}-${index}`} style={{ '--particle-column': index % 4, '--particle-row': row, '--particle-index': index } as CSSProperties} />;
              })}
            </div>
          )}
          {scene === 'outside' && activeFestival && currentRegion === 'farm-village' && (
            <div className={`festival-day-banner festival-${activeFestival.id} ${activeFestivalCompleted ? 'is-complete' : ''}`} role="status" data-festival-banner={activeFestival.id}>
              <img src={activeFestival.propAsset} alt="" aria-hidden="true" />
              <p><span>Y{seasonState.year} · {SEASON_INFO[seasonState.season].shortLabel} {seasonState.day}</span><strong>{activeFestival.label}</strong></p>
              <small>{activeFestivalCompleted ? 'JOURNAL COMPLETE' : `E · ${activeFestival.interactionLabel}`}</small>
            </div>
          )}
          {celebration && celebrationCopy && (
            <div className="celebration-layer" role="status" data-fireworks-layer="milestone-celebration" data-celebration={celebration.kind}>
              <div className="firework-stage" aria-hidden="true">
                {fireworkBursts.map((burst, burstIndex) => (
                  <span
                    key={`${celebration.id}-${burstIndex}`}
                    className="firework-burst"
                    style={{ '--burst-x': burst.x, '--burst-y': burst.y, '--burst-delay': burst.delay, '--burst-color': burst.color } as CSSProperties}
                  >
                    {fireworkRays.map((ray) => <i key={ray} style={{ '--ray': ray } as CSSProperties} />)}
                  </span>
                ))}
              </div>
              <div className="celebration-banner">
                <PartyPopper aria-hidden="true" />
                <p><span>{celebrationCopy.eyebrow}</span><strong>{celebrationCopy.title}</strong></p>
              </div>
            </div>
          )}
          {earningsFeedback && (
            <div className="earnings-feedback" role="status" data-day-earnings={earningsFeedback.receipt.total}>
              <img src={ECONOMY_ASSETS.coinBurst} alt="" aria-hidden="true" />
              <p><span>DAY EARNINGS</span><strong>+{earningsFeedback.receipt.total} GOLD</strong></p>
              <small>{earningsFeedback.receipt.lines.map((line) => `${getShippingItemMeta(line.itemId).label} x${line.quantity}`).join(' · ')}</small>
            </div>
          )}

          {commerceView && (
            <section className={`commerce-window view-${commerceView}`} role="dialog" aria-modal="true" aria-label={commerceView === 'shipping' ? 'Shipping box' : commerceView === 'shop' ? 'Seed shop' : 'Ranch supplies'} data-commerce-window={commerceView}>
              <header className="commerce-header">
                <img src={commerceView === 'shipping' ? ECONOMY_ASSETS.ledger : commerceView === 'ranch' ? ECONOMY_ASSETS.feed : ECONOMY_ASSETS.seeds} alt="" aria-hidden="true" />
                <div>
                  <span>{commerceView === 'shipping' ? 'MOSSBELL SHIPPING' : commerceView === 'shop' ? 'SEED SHOP' : "JUN'S SUPPLIES"}</span>
                  <strong>{commerceView === 'shipping' ? '내일 아침 정산' : '농장 준비물'}</strong>
                </div>
                <div className="commerce-gold" data-gold={economyState.gold}>
                  <img src={ECONOMY_ASSETS.coin} alt="" aria-hidden="true" />
                  <b>{economyState.gold}</b>
                </div>
                <button type="button" className="commerce-close" aria-label="Close commerce window" onClick={closeCommerce}><X aria-hidden="true" /></button>
              </header>

              {commerceView === 'shipping' && (
                <>
                  <nav className="commerce-tabs" role="tablist" aria-label="Shipping inventory categories">
                    {(['farm', 'ranch', 'bag', 'forage'] as ShippingCategory[]).map((tab) => (
                      <button key={tab} type="button" role="tab" className={shippingCategory === tab ? 'is-active' : ''} aria-selected={shippingCategory === tab} onClick={() => setShippingCategory(tab)}>{tab.toUpperCase()}</button>
                    ))}
                  </nav>
                  <div className="season-demand-strip" data-season-demand-count="3">
                    <header><span>SEASON DEMAND</span><strong>+20%</strong></header>
                    <div>
                      {todayDemandItems.map((itemId) => {
                        const meta = getShippingItemMeta(itemId as ShippingItemId);
                        return <span key={itemId} data-demand-item={itemId}><img src={meta.asset} alt="" aria-hidden="true" /><b>{meta.label}</b></span>;
                      })}
                    </div>
                  </div>
                  <div className="commerce-list shipping-list">
                    {shippingRows.map((itemId) => {
                      const meta = getShippingItemMeta(itemId);
                      const available = shippingAvailability[itemId] ?? 0;
                      const pending = getPendingQuantity(shippingState, itemId);
                      return (
                        <div className="commerce-row" key={itemId} data-shipping-item={itemId}>
                          <img src={meta.asset} alt="" aria-hidden="true" />
                          <div><strong>{meta.label}{todayDemandItems.includes(itemId) && <em> +20%</em>}</strong><span>{getTodayShippingUnitPrice(itemId)} GOLD · 보유 {available}</span></div>
                          <div className="quantity-stepper">
                            <button type="button" aria-label={`${meta.label} 배송에서 빼기`} disabled={pending <= 0} onClick={() => changeShipment(itemId, 'remove')}><Minus aria-hidden="true" /></button>
                            <b>{pending}</b>
                            <button type="button" aria-label={`${meta.label} 배송에 넣기`} disabled={pending >= available} onClick={() => changeShipment(itemId, 'add')}><Plus aria-hidden="true" /></button>
                          </div>
                        </div>
                      );
                    })}
                    {shippingRows.length === 0 && <p className="commerce-empty">이 카테고리에 배송할 물건이 없습니다.</p>}
                  </div>
                  {shippingState.lastSettlement && (
                    <div className="shipping-receipt" data-shipping-receipt={shippingState.lastSettlement.day}>
                      <header><span>LAST RECEIPT · DAY {shippingState.lastSettlement.day}</span><strong>{shippingState.lastSettlement.total} GOLD</strong></header>
                      {shippingState.lastSettlement.lines.map((line) => (
                        <span key={`${shippingState.lastSettlement?.day}-${line.itemId}`}>
                          <b>{getShippingItemMeta(line.itemId).label} x{line.quantity}</b>
                          <em>{line.unitPrice} × {line.quantity} = {line.subtotal}</em>
                        </span>
                      ))}
                    </div>
                  )}
                  <footer className="shipping-total">
                    <span><ShoppingBasket aria-hidden="true" /> PENDING</span>
                    <strong>{Object.values(shippingState.entries).reduce((total, quantity) => total + Number(quantity ?? 0), 0)} ITEMS · {pendingShippingTotal} GOLD</strong>
                  </footer>
                </>
              )}

              {(commerceView === 'shop' || commerceView === 'ranch') && (
                <>
                  <div className="purchase-stepper" aria-label="Purchase quantity">
                    <span>QUANTITY</span>
                    <button type="button" aria-label="Decrease purchase quantity" disabled={purchaseQuantity <= 1} onClick={() => setPurchaseQuantity((quantity) => Math.max(1, quantity - 1))}><Minus aria-hidden="true" /></button>
                    <b>{purchaseQuantity}</b>
                    <button type="button" aria-label="Increase purchase quantity" disabled={purchaseQuantity >= 9} onClick={() => setPurchaseQuantity((quantity) => Math.min(9, quantity + 1))}><Plus aria-hidden="true" /></button>
                  </div>
                  <div className="commerce-list shop-list">
                    {commerceView === 'shop' && FARM_CROPS.map((crop) => (
                      <div className="commerce-row" key={crop} data-shop-seed={crop}>
                        <img src={CROP_ITEM_SPRITES[crop]} alt="" aria-hidden="true" />
                        <div><strong>{FARM_CROP_INFO[crop].label} 씨앗</strong><span>보유 {economyState.seedInventory[crop]} · {SEED_PRICES[crop]} GOLD</span></div>
                        <button type="button" className="buy-button" disabled={economyState.gold < SEED_PRICES[crop] * purchaseQuantity} onClick={() => buySeed(crop)}>BUY {SEED_PRICES[crop] * purchaseQuantity}</button>
                      </div>
                    ))}
                    <div className="commerce-row" data-shop-feed="animal-feed">
                      <img src={ECONOMY_ASSETS.feed} alt="" aria-hidden="true" />
                      <div><strong>동물 사료</strong><span>보유 {economyState.feed} · {FEED_PRICE} GOLD</span></div>
                      <button type="button" className="buy-button" disabled={economyState.gold < FEED_PRICE * purchaseQuantity} onClick={buyFeed}>BUY {FEED_PRICE * purchaseQuantity}</button>
                    </div>
                  </div>
                  {commerceView === 'shop' && (
                    <div className="tool-upgrade-list" data-tool-upgrades="three-tools-two-levels">
                      <h3>TOOL UPGRADES</h3>
                      {UPGRADE_TOOL_IDS.map((tool) => {
                        const level = toolProgressionState.levels[tool];
                        const cost = getUpgradeCost(toolProgressionState, tool);
                        return (
                          <div className="commerce-row" key={tool} data-upgrade-tool={tool}>
                            <img src={TOOL_UPGRADE_ASSETS[tool]} alt="" aria-hidden="true" />
                            <div><strong>{TOOL_UPGRADE_INFO[tool].label} · LV.{level}</strong><span>{TOOL_UPGRADE_INFO[tool].effects[level]}</span></div>
                            <button type="button" className="buy-button" disabled={level >= 2 || economyState.gold < cost} onClick={() => upgradeTool(tool)}>{level >= 2 ? 'MAX' : `UP ${cost}`}</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          )}
          <button
            type="button"
            className="gear-button"
            aria-label="Open game menu"
            data-settings-toggle="gear"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ⚙
          </button>

          {menuOpen && (
            <section className="settings-window" role="dialog" aria-modal="false" aria-label="Game menu" data-settings-window="game-menu" data-active-menu-tab={activeMenuTab}>
              <header className="settings-header">
                <div>
                  <span>GAME MENU</span>
                  <strong>{activeMenuTab.toUpperCase()}</strong>
                </div>
                <button type="button" className="settings-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
              </header>

              <nav className="settings-tabs" aria-label="Game menu tabs">
                {menuTabs.map((tab) => (
                  <button key={tab} type="button" className={activeMenuTab === tab ? 'is-active' : ''} onClick={() => setActiveMenuTab(tab)}>
                    {tab.toUpperCase()}
                  </button>
                ))}
              </nav>

              {activeMenuTab === 'map' && (
                <div className="map-panel" data-map-panel="mossbell-world-map">
                  <div className="map-title-row">
                    <span>{scene === 'outside' ? REGION_INFO[currentRegion].label : currentInteriorInfo?.label ?? 'Interior'}</span>
                    <b>{player.x}, {player.y}</b>
                  </div>
                  {scene === 'outside' && (
                    <div className="open-world-map" data-world-map="four-connected-regions" data-fast-travel={fastTravelReady ? 'ready' : 'locked'}>
                      {REGION_IDS.map((region) => {
                        const discovered = openWorldState.discovered.includes(region);
                        const RegionIcon = region === 'farm-village' ? MapPin : region === 'whisper-forest' ? TreePine : region === 'river-coast' ? Waves : Mountain;
                        return (
                          <button
                            key={region}
                            type="button"
                            className={`${currentRegion === region ? 'is-current' : ''} ${discovered ? 'is-discovered' : 'is-hidden'}`}
                            disabled={!fastTravelReady || !discovered || currentRegion === region}
                            onClick={() => travelToRegion(region)}
                            data-world-region-node={region}
                            data-region-discovered={discovered ? 'true' : 'false'}
                          >
                            <RegionIcon aria-hidden="true" />
                            <span>{discovered ? REGION_INFO[region].shortLabel : 'UNKNOWN'}</span>
                            <strong>{discovered ? REGION_INFO[region].label : '???'}</strong>
                          </button>
                        );
                      })}
                      <i className="world-link link-farm-forest" aria-hidden="true" />
                      <i className="world-link link-forest-coast" aria-hidden="true" />
                      <i className="world-link link-coast-mine" aria-hidden="true" />
                      <i className="world-link link-mine-farm" aria-hidden="true" />
                    </div>
                  )}
                  {miniMap}
                  <section className="season-calendar" aria-label="Seven day season calendar" data-season-calendar={`${seasonState.season}-${seasonState.day}`}>
                    <header>
                      <img src={SEASON_INFO[seasonState.season].icon} alt="" aria-hidden="true" />
                      <p><span>YEAR {seasonState.year}</span><strong>{SEASON_INFO[seasonState.season].label.toUpperCase()}</strong></p>
                      <img src={WEATHER_INFO[weatherState.weather].icon} alt="" aria-hidden="true" />
                    </header>
                    <div>
                      {Array.from({ length: 7 }, (_, index) => {
                        const day = index + 1;
                        const festivalDay = day === 7 && (seasonState.season === 'autumn' || seasonState.season === 'winter');
                        return <span key={day} className={`${seasonState.day === day ? 'is-today' : ''} ${festivalDay ? 'is-festival' : ''}`}><b>{day}</b>{festivalDay && <i />}</span>;
                      })}
                    </div>
                    <small>{activeFestival ? `${activeFestival.label} · ${activeFestivalCompleted ? 'COMPLETE' : activeFestival.interactionLabel}` : `${WEATHER_INFO[weatherState.weather].label} · 다음 축제는 계절 7일에 열립니다.`}</small>
                  </section>
                  <div className="menu-quest-objective" aria-live="polite">
                    <span>QUEST · {questLabels[questStage]}</span>
                    <strong>{questObjective}</strong>
                  </div>
                  <p>{fastTravelReady ? '표지판이 활성화되었습니다. 발견한 지역을 선택해 빠르게 이동할 수 있습니다.' : '지역 표지판을 조사하면 발견한 장소로 빠르게 이동할 수 있습니다.'}</p>
                </div>
              )}

              {activeMenuTab === 'journal' && (
                <div className="journal-panel" data-journal-panel="mossbell-journal">
                  <h3>CURRENT QUEST</h3>
                  <p><strong>{questLabels[questStage]}</strong><br />{questObjective}</p>
                  <h3>COMPLETED QUESTS</h3>
                  <ul>
                    {questStage === 'complete' && <li>첫 마을 의뢰</li>}
                    {villageLifeState.farmerQuest.status === 'complete' && <li>하나의 작물 의뢰</li>}
                    {villageLifeState.rancherQuest.status === 'complete' && <li>준의 목장 의뢰</li>}
                    {foragingState.forageQuest.status === 'complete' && <li>숲 채집 의뢰</li>}
                    {foragingState.mineQuest.status === 'complete' && <li>광산 채굴 의뢰</li>}
                    {questStage !== 'complete'
                      && villageLifeState.farmerQuest.status !== 'complete'
                      && villageLifeState.rancherQuest.status !== 'complete'
                      && foragingState.forageQuest.status !== 'complete'
                      && foragingState.mineQuest.status !== 'complete'
                      && <li>아직 완료한 의뢰가 없습니다.</li>}
                  </ul>
                  <dl>
                    <div><dt>Scene</dt><dd>{scene === 'outside' ? REGION_INFO[currentRegion].label : currentInteriorInfo?.label ?? 'Interior'}</dd></div>
                    <div><dt>World</dt><dd>{openWorldState.discovered.length}/{REGION_IDS.length} regions</dd></div>
                    <div><dt>Journal</dt><dd>{totalJournalCount}/{totalJournalEntries}</dd></div>
                    <div><dt>Quest harvest</dt><dd>{harvestCount}/3</dd></div>
                    <div><dt>Farm harvest</dt><dd>{totalFarmHarvest}</dd></div>
                    <div><dt>Pond catch</dt><dd>{fishingState.totalCaught} · {fishingState.discovered.length}/{FISH_IDS.length}</dd></div>
                    <div><dt>Village life</dt><dd>Y{seasonState.year} {SEASON_INFO[seasonState.season].shortLabel} {seasonState.day} · {WEATHER_INFO[weatherState.weather].label}</dd></div>
                    <div><dt>Foraging</dt><dd>{getTotalForageInventory(foragingState)} items · {foragingState.discovered.length}/{FORAGE_ITEM_IDS.length}</dd></div>
                  </dl>
                  <h3>DISCOVERED REGIONS</h3>
                  <ul>
                    {openWorldState.discovered.map((region) => <li key={`region-${region}`}>{REGION_INFO[region].label}</li>)}
                  </ul>
                  <h3>ECONOMY MILESTONES</h3>
                  <ul data-economy-milestones={economyState.milestones.length}>
                    {economyState.milestones.map((milestone) => <li key={milestone}>{ECONOMY_MILESTONE_LABELS[milestone]}</li>)}
                    {economyState.milestones.length === 0 && <li>첫 배송을 기다리고 있습니다.</li>}
                  </ul>
                  <h3>SEASONS & FESTIVALS</h3>
                  <ul data-festival-journal={festivalState.journal.length}>
                    {seasonState.discoveredSeasons.map((season) => <li key={`season-record-${season}`}>{SEASON_INFO[season].label} discovered</li>)}
                    {festivalState.journal.map((entry) => <li key={entry}>{entry}</li>)}
                    {festivalState.journal.length === 0 && <li>축제 기념품은 계절 7일에 기록됩니다.</li>}
                  </ul>
                  <h3>RECENT DISCOVERIES</h3>
                  <ul>
                    {journalEntries.slice(-6).reverse().map((entry) => (
                      <li key={`menu-${entry.id}`}>{entry.journalTitle}</li>
                    ))}
                    {journalEntries.length === 0 && <li>아직 발견 기록이 없습니다.</li>}
                  </ul>
                </div>
              )}

              {activeMenuTab === 'audio' && (
                <div className="settings-panel audio-panel" data-audio-panel="game-audio">
                  <div className="music-setting" data-music-setting="persistent-volume">
                    <button
                      type="button"
                      aria-label={audioSettings.muted ? 'Unmute background music' : 'Mute background music'}
                      aria-pressed={audioSettings.muted}
                      onClick={() => setAudioSettings((current) => ({ ...current, muted: !current.muted }))}
                    >
                      {audioSettings.muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
                      <span>MUSIC</span>
                    </button>
                    <label>
                      <span>Volume {Math.round(audioSettings.volume * 100)}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={Math.round(audioSettings.volume * 100)}
                        aria-label="Background music volume"
                        onChange={(event) => setAudioSettings((current) => ({ ...current, volume: Number(event.currentTarget.value) / 100 }))}
                      />
                    </label>
                    <small>{Object.values(AUDIO_TRACKS).some((track) => track.available) ? `NOW PLAYING · ${audioTrack}` : 'BGM FILES MISSING · SILENT MODE'}</small>
                  </div>
                </div>
              )}

              {activeMenuTab === 'reset' && (
                <div className="settings-panel reset-panel" data-reset-panel="isolated-game-resets">
                  <label>
                    <input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.currentTarget.checked)} />
                    <span>Object labels</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={showHints} onChange={(event) => setShowHints(event.currentTarget.checked)} />
                    <span>Press-E hints</span>
                  </label>
                  <div className="time-mode-setting">
                    <span>Village light</span>
                    <div role="group" aria-label="Village lighting mode" data-time-mode-control="auto-day-night">
                      {(['auto', 'day', 'night'] as TimeMode[]).map((mode) => {
                        const ModeIcon = mode === 'auto' ? Clock3 : mode === 'day' ? Sun : Moon;
                        return (
                          <button
                            key={mode}
                            type="button"
                            className={timeMode === mode ? 'is-active' : ''}
                            aria-pressed={timeMode === mode}
                            onClick={() => setTimeMode(mode)}
                          >
                            <ModeIcon aria-hidden="true" />
                            <span>{TIME_MODE_LABELS[mode]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="next-day-button"
                    data-advance-village-day="manual-rest"
                    onClick={advanceLifeToNextDay}
                  >
                    <Moon aria-hidden="true" />
                    <span>REST TO NEXT DAY</span>
                  </button>
                  <button
                    type="button"
                    className="farm-reset-button"
                    data-reset-farm="farm-state-only"
                    onClick={() => {
                      const resetState = clearFarmState();
                      farmStateRef.current = resetState;
                      setFarmState(resetState);
                      const nextShipping = reconcileShipment(shippingStateRef.current, getShippingAvailability({ farm: resetState, fishing: fishingStateRef.current, villageLife: villageLifeStateRef.current, foraging: foragingStateRef.current }));
                      shippingStateRef.current = nextShipping;
                      setShippingState(nextShipping);
                      setDialogue({
                        ...farmPatchEntity,
                        name: 'Farm Reset',
                        prompt: '농장 상태만 초기화했습니다.',
                        dialogue: ['6개 밭, 6종 작물 재고, 품질과 물주기 기록을 초기화했습니다.', '목장, 낚시, 기존 퀘스트와 마을 시간 설정은 유지됩니다.'],
                        tags: ['Farm Loop', 'Reset'],
                      });
                    }}
                  >
                    <RotateCcw aria-hidden="true" />
                    <span>RESET FARM</span>
                  </button>
                  <button
                    type="button"
                    className="ranch-reset-button"
                    data-reset-ranch="ranch-state-only"
                    onClick={() => {
                      const resetState = clearRanchState(villageLifeStateRef.current);
                      villageLifeStateRef.current = resetState;
                      setVillageLifeState(resetState);
                      const nextShipping = reconcileShipment(shippingStateRef.current, getShippingAvailability({ farm: farmStateRef.current, fishing: fishingStateRef.current, villageLife: resetState, foraging: foragingStateRef.current }));
                      shippingStateRef.current = nextShipping;
                      setShippingState(nextShipping);
                      setLifeFeedback(null);
                      if (activeInventoryTab === 'ranch') setSelectedInventoryId('ranch-journal');
                      setDialogue({
                        ...farmPatchEntity,
                        name: 'Ranch Reset',
                        prompt: '목장 상태만 초기화했습니다.',
                        dialogue: ['동물 돌봄, 친밀도, 생산품과 완벽 돌봄 기록을 초기화했습니다.', '밭, 낚시, 퀘스트, 날짜와 조명 설정은 유지됩니다.'],
                        tags: ['Village Life', 'Ranch Reset'],
                      });
                    }}
                  >
                    <RotateCcw aria-hidden="true" />
                    <span>RESET RANCH</span>
                  </button>
                  <button
                    type="button"
                    className="fishing-reset-button"
                    data-reset-fishing="fishing-state-only"
                    onClick={() => {
                      clearFishingTimers();
                      updateFishingSession(idleFishingSession);
                      setFishingFeedback(null);
                      const resetState = clearFishingState();
                      fishingStateRef.current = resetState;
                      setFishingState(resetState);
                      const nextShipping = reconcileShipment(shippingStateRef.current, getShippingAvailability({ farm: farmStateRef.current, fishing: resetState, villageLife: villageLifeStateRef.current, foraging: foragingStateRef.current }));
                      shippingStateRef.current = nextShipping;
                      setShippingState(nextShipping);
                      if (selectedInventoryId === 'fish-basket') setSelectedInventoryId('field-journal');
                      showFishingDialogue('Fishing Reset', ['낚시 도감과 어획 수량만 초기화했습니다.', '농장, 퀘스트, 마을 조명과 탐험 기록은 유지됩니다.'], ['Fishing', 'Reset']);
                    }}
                  >
                    <RotateCcw aria-hidden="true" />
                    <span>RESET FISHING</span>
                  </button>
                </div>
              )}
            </section>
          )}

          {acquiredItem && (
            <div
              className="item-pickup-toast"
              role="status"
              aria-live="polite"
              data-item-pickup-toast="inventory-unlock"
            >
              <div data-item-tone={acquiredItem.tone}>
                <InventoryItemGraphic item={acquiredItem} />
              </div>
              <p>
                <span>ITEM ACQUIRED</span>
                <strong>{acquiredItem.name}</strong>
              </p>
            </div>
          )}

          <aside
            className="inventory-rail"
            aria-label="Persistent inventory bar"
            data-inventory-panel="right-game-bar"
          >
              <header className="inventory-header">
                <Backpack className="inventory-header-icon" aria-hidden="true" strokeWidth={2.5} />
                <div>
                  <span>FARM BAG</span>
                  <strong>INVENTORY</strong>
                </div>
              </header>

              <div className="inventory-player-status" data-player-status="inventory-rail">
                <img src={playerSprite} alt="" aria-hidden="true" />
                <div>
                  <span>PLAYER</span>
                  <strong>MOSSBELL FARMER</strong>
                  <small>{scene === 'outside' ? REGION_INFO[currentRegion].shortLabel : 'FARMHOUSE'}</small>
                </div>
              </div>

              <div className="inventory-gold" data-gold={economyState.gold}>
                <img src={ECONOMY_ASSETS.coin} alt="" aria-hidden="true" />
                <span>GOLD</span>
                <strong>{economyState.gold.toLocaleString()}</strong>
              </div>

              <div className="village-clock" data-village-clock={villageTime.clock} data-day-phase={villageTime.phase}>
                <VillageTimeIcon aria-hidden="true" />
                <span>DAY {villageLifeState.day} · {DAY_PHASE_LABELS[villageTime.phase]}</span>
                <strong>{villageTime.clock}</strong>
              </div>

              <div className="season-weather-status" data-season-date={`${seasonState.year}-${seasonState.season}-${seasonState.day}`} data-today-weather={weatherState.weather}>
                <img src={SEASON_INFO[seasonState.season].icon} alt="" aria-hidden="true" />
                <p><span>YEAR {seasonState.year}</span><strong>{SEASON_INFO[seasonState.season].shortLabel} {seasonState.day}/7</strong></p>
                <img src={WEATHER_INFO[weatherState.weather].icon} alt="" aria-hidden="true" />
                <small>{WEATHER_INFO[weatherState.weather].label.toUpperCase()}</small>
              </div>

              <section className="farm-toolbelt" aria-label="Farm, fishing, and exploration toolbelt" data-farm-toolbelt="five-tools">
                <header>
                  <span>TOOLBELT</span>
                  <strong>{pickaxeSelected ? '곡괭이' : fishingRodSelected ? '낚싯대' : FARM_TOOL_INFO[farmState.selectedTool].label}</strong>
                </header>
                <div className="farm-tool-row" role="toolbar" aria-label="Farm and fishing tools">
                  {FARM_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className={!fishingRodSelected && farmState.selectedTool === tool ? 'is-active' : ''}
                      aria-label={`${FARM_TOOL_INFO[tool].shortcut} · ${FARM_TOOL_INFO[tool].label}`}
                      aria-pressed={!fishingRodSelected && farmState.selectedTool === tool}
                      title={`${FARM_TOOL_INFO[tool].shortcut} · ${FARM_TOOL_INFO[tool].label}`}
                      data-farm-tool={tool}
                      onClick={() => selectFarmTool(tool)}
                    >
                      <img src={FARM_TOOL_INFO[tool].asset} alt="" aria-hidden="true" />
                      <kbd>{FARM_TOOL_INFO[tool].shortcut}</kbd>
                      {tool === 'watering-can' && <small>LV.{toolProgressionState.levels['watering-can']}</small>}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={fishingRodSelected ? 'is-active' : ''}
                    aria-label="4 · 낚싯대"
                    aria-pressed={fishingRodSelected}
                    title="4 · 낚싯대"
                    data-game-tool="fishing-rod"
                    onClick={selectFishingRod}
                  >
                    <img src={TOOL_SPRITES['fishing-rod']} alt="" aria-hidden="true" />
                    <kbd>4</kbd>
                    <small>LV.{toolProgressionState.levels['fishing-rod']}</small>
                  </button>
                  <button
                    type="button"
                    className={pickaxeSelected ? 'is-active' : ''}
                    aria-label="5 · 곡괭이"
                    aria-pressed={pickaxeSelected}
                    title="5 · 곡괭이"
                    data-game-tool="pickaxe"
                    onClick={selectPickaxe}
                  >
                    <img src={TOOL_SPRITES.pickaxe} alt="" aria-hidden="true" />
                    <kbd>5</kbd>
                    <small>LV.{toolProgressionState.levels.pickaxe}</small>
                  </button>
                </div>
                <div className="seed-group-tabs" role="tablist" aria-label="Seed group">
                  {(['garden', 'field'] as SeedGroup[]).map((group) => (
                    <button key={group} type="button" role="tab" className={seedGroup === group ? 'is-active' : ''} aria-selected={seedGroup === group} onClick={() => setSeedGroup(group)}>
                      {group.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="farm-seed-selector" aria-label="Seed type" data-selected-seed={farmState.selectedSeed} data-seed-group={seedGroup}>
                  {(seedGroup === 'garden' ? FARM_GARDEN_CROPS : FARM_LIFE_CROPS).map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      className={farmState.selectedSeed === crop ? 'is-active' : ''}
                      aria-label={`${FARM_CROP_INFO[crop].label} 선택`}
                      aria-pressed={farmState.selectedSeed === crop}
                      data-seed-type={crop}
                      onClick={() => selectSeed(crop)}
                    >
                      {FARM_CROP_INFO[crop].shortLabel}
                      <small>{economyState.seedInventory[crop]}</small>
                    </button>
                  ))}
                </div>
              </section>

              <nav className="inventory-tabs" role="tablist" aria-label="Inventory categories" data-inventory-tab-control="bag-farm-ranch-forage">
                {(['bag', 'farm', 'ranch', 'forage'] as InventoryTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    className={activeInventoryTab === tab ? 'is-active' : ''}
                    aria-selected={activeInventoryTab === tab}
                    data-inventory-tab={tab}
                    onClick={() => {
                      setActiveInventoryTab(tab);
                      const firstItem = inventoryItems.find((item) => item.tab === tab);
                      if (firstItem) setSelectedInventoryId(firstItem.id);
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </nav>

              <div className="inventory-summary">
                <span>{activeInventoryItems.length}/12 SLOTS</span>
                <strong>{activeInventoryTab === 'bag' ? questLabels[questStage] : activeInventoryTab === 'farm' ? 'CROP QUALITY' : activeInventoryTab === 'ranch' ? `CARE x${villageLifeState.perfectCareStreak}` : `${openWorldState.discovered.length}/4 AREAS`}</strong>
              </div>

              <div className="inventory-grid" aria-label="Inventory slots">
                {inventorySlots.map((item, index) => {
                  if (!item) {
                    return <span key={`empty-${index}`} className="inventory-slot is-empty" data-inventory-slot={`empty-${index + 1}`} aria-hidden="true" />;
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`inventory-slot ${selectedInventoryItem.id === item.id ? 'is-selected' : ''} ${acquiredItemId === item.id ? 'is-acquired' : ''}`}
                      aria-label={`${item.name} 선택`}
                      aria-pressed={selectedInventoryItem.id === item.id}
                      data-inventory-slot={item.id}
                      data-item-tone={item.tone}
                      data-crop-quality={item.quality ? `normal:${item.quality.normal},silver:${item.quality.silver},gold:${item.quality.gold}` : undefined}
                      onClick={() => setSelectedInventoryId(item.id)}
                    >
                      <InventoryItemGraphic item={item} />
                      {item.quantity !== undefined && <span className="inventory-quantity">{item.quantity}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="inventory-detail" data-inventory-detail={selectedInventoryItem.id}>
                <InventoryItemGraphic item={selectedInventoryItem} />
                <div>
                  <span>{selectedInventoryItem.category}</span>
                  <strong>{selectedInventoryItem.name}</strong>
                  <p>{selectedInventoryItem.description}</p>
                </div>
              </div>

              {activeInventoryTab === 'bag' && <section className="fish-catalog" aria-label="Fishing collection" data-fishing-catalog={fishingState.discovered.length}>
                <header>
                  <span>FISH CATALOG</span>
                  <b>{fishingState.discovered.length}/{FISH_IDS.length}</b>
                </header>
                <div>
                  {FISH_IDS.map((fish) => {
                    const discovered = fishingState.discovered.includes(fish);
                    return (
                      <span key={fish} className={discovered ? 'is-discovered' : 'is-unknown'} data-fish-id={fish} data-fish-count={fishingState.inventory[fish]}>
                        <img src={FISH_INFO[fish].asset} alt="" aria-hidden="true" />
                        <strong>{discovered ? FISH_INFO[fish].shortLabel : '????'}</strong>
                        <b>{discovered ? fishingState.inventory[fish] : '·'}</b>
                      </span>
                    );
                  })}
                </div>
              </section>}

              {activeInventoryTab === 'farm' && (
                <section className="farm-quality-ledger" aria-label="Crop quality ledger" data-farm-quality-ledger="normal-silver-gold">
                  {FARM_CROPS.map((crop) => (
                    <span key={crop} data-crop-quality={crop}>
                      <strong>{FARM_CROP_INFO[crop].shortLabel}</strong>
                      <b>N{farmState.qualityInventory[crop].normal} · S{farmState.qualityInventory[crop].silver} · G{farmState.qualityInventory[crop].gold}</b>
                    </span>
                  ))}
                </section>
              )}

              {activeInventoryTab === 'ranch' && (
                <section className="ranch-ledger" aria-label="Ranch care ledger" data-ranch-ledger={villageLifeState.discoveredAnimals.length}>
                  <header><span>DAILY CARE</span><b>{villageLifeState.discoveredAnimals.length}/{ANIMAL_IDS.length}</b></header>
                  <p>하나: {getNpcQuest(villageLifeState, 'farmer-hana').status} · 준: {getNpcQuest(villageLifeState, 'rancher-jun').status}</p>
                  <strong>PERFECT CARE x{villageLifeState.perfectCareStreak} · FEED {economyState.feed}</strong>
                </section>
              )}

              {activeInventoryTab === 'forage' && (
                <section className="forage-ledger" aria-label="Open world collection ledger" data-forage-ledger={foragingState.discovered.length}>
                  <header><span>EXPEDITION</span><b>{openWorldState.discovered.length}/{REGION_IDS.length}</b></header>
                  <p>숲: {foragingState.forageQuest.status} · 광산: {foragingState.mineQuest.status}</p>
                  <strong>{foragingState.discovered.length}/{FORAGE_ITEM_IDS.length} FINDS</strong>
                </section>
              )}

              {activeInventoryTab === 'bag' && <section className="inventory-rail-journal" aria-label="Discovered world records" data-inventory-journal={journalEntries.length}>
                <header>
                  <span>DISCOVERED RECORDS</span>
                  <b>{journalEntries.length}</b>
                </header>
                {journalEntries.length > 0 ? (
                  <ul>
                    {journalEntries.slice(-4).reverse().map((entry) => (
                      <li key={`inventory-${entry.id}`}>{entry.journalTitle}</li>
                    ))}
                  </ul>
                ) : (
                  <p>장소와 가구, 생물을 조사하면 발견 기록이 여기에 쌓입니다.</p>
                )}
              </section>}

              <div className="inventory-rail-objective" aria-live="polite">
                <span>CURRENT QUEST</span>
                <strong>{questLabels[questStage]}</strong>
                <p>{questObjective}</p>
                <div>
                  <span>DISCOVERED</span>
                  <b>{totalJournalCount}/{totalJournalEntries}</b>
                </div>
              </div>
          </aside>

          <div
            className={`dialogue-box ${dialogueOpen ? 'is-open' : 'is-collapsed'} ${dialoguePortrait ? 'has-portrait' : ''} bottom-dialogue-bar`}
            role="status"
            aria-live="polite"
            data-dialogue-box="game-dialogue"
            data-bottom-dialogue-bar="game-chat"
            data-dialogue-mode="bottom-bar"
          >
            {dialoguePortrait && <img className="dialogue-portrait" src={dialoguePortrait} alt="" aria-hidden="true" data-dialogue-portrait={dialoguePortraitNpc} />}
            <span>{dialogue
              ? (nearbyFishingSpot ? `Near: ${nearbyFishingSpot.habitat.toUpperCase()} Fishing` : nearbyAnimal ? `Near: ${ANIMAL_INFO[nearbyAnimal.id].name}` : nearbyFarmPlot ? `Near: Farm Plot ${nearbyFarmPlot.id.replace('plot-', '')}` : nearbyForageNode ? `Near: ${FORAGE_ITEM_INFO[nearbyForageNode.item].label}` : nearby ? `Near: ${nearby.name}` : dialogue.name)
              : `QUEST · ${questLabels[questStage]}`}</span>
            <strong>{dialogue ? dialogue.name : prompt}</strong>
            {dialogue && dialogue.dialogue.map((line) => <p key={line}>{line}</p>)}
            <em>{fishingSession.status === 'bite' ? '[E] 지금 당기기!' : nearbyFishingSpot ? '[E] 낚시' : nearbyAnimal ? '[E] 돌보기 / 수집' : nearbyFarmPlot ? '[E] 농사' : nearbyForageNode ? '[E] 채집 / 채굴' : nearby ? '[E] 조사 / 입장' : dialogue ? '이동하면 대화 닫기' : 'WASD / 방향키로 이동'}</em>
          </div>

          <nav className="touch-pad" aria-label="Mobile game controls" aria-hidden={commerceView ? 'true' : undefined}>
            <button type="button" disabled={Boolean(commerceView)} onClick={() => movePlayer('up')}>↑</button>
            <button type="button" disabled={Boolean(commerceView)} onClick={() => movePlayer('left')}>←</button>
            <button type="button" disabled={Boolean(commerceView)} onClick={interact}>E</button>
            <button type="button" disabled={Boolean(commerceView)} onClick={() => movePlayer('right')}>→</button>
            <button type="button" disabled={Boolean(commerceView)} onClick={() => movePlayer('down')}>↓</button>
          </nav>
        </div>
      </div>

      {!gameStarted && (
        <div className="intro-screen" data-intro-screen="pixel-title">
          <div className="intro-card">
            <h1 className="pixel-title" aria-label={INTRO_TITLE}>
              <span>{typedTitle}</span>
              <i aria-hidden="true">▌</i>
            </h1>
            <div className="intro-actions">
              <button type="button" className="intro-start" onClick={newGame}>NEW GAME</button>
              <button type="button" className="intro-start is-continue" onClick={continueGame} disabled={!canContinue}>CONTINUE</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
