export type FarmTool = 'hoe' | 'seeds' | 'watering-can';
export type CropType = 'potato' | 'strawberry' | 'carrot' | 'tomato' | 'corn' | 'pumpkin';
type LegacyCropType = 'frontend' | 'backend' | 'bim';
export type CropQuality = 'normal' | 'silver' | 'gold';
export type FarmPlotStage = 'untilled' | 'tilled' | 'planted' | 'watered' | 'growing-1' | 'growing-2' | 'ready';

export type FarmPlot = {
  id: string;
  x: number;
  y: number;
  stage: FarmPlotStage;
  crop: CropType | null;
  wateredAt: number | null;
};

export type FarmInventory = Record<CropType, number>;
export type FarmQualityInventory = Record<CropType, Record<CropQuality, number>>;

export type FarmState = {
  version: 3;
  plots: FarmPlot[];
  selectedTool: FarmTool;
  selectedSeed: CropType;
  inventory: FarmInventory;
  qualityInventory: FarmQualityInventory;
  wateringStreak: number;
  firstHarvested: boolean;
};

export type FarmInteractionResult = {
  state: FarmState;
  message: string;
  changed: boolean;
  harvestedCrop: CropType | null;
  harvestedQuality: CropQuality | null;
  firstOfType: boolean;
};

export type RainWateringResult = {
  state: FarmState;
  changed: boolean;
  wateredPlotIds: string[];
};

export type HarvestSubmissionResult = {
  state: FarmState;
  crop: CropType;
  quality: CropQuality;
} | null;

export type CropGrowthMultiplierResolver = (crop: CropType) => number;

export const FARM_STORAGE_KEY = 'portfolio-farm-loop-v1';
export const FARM_SAVE_VERSION = 3;
export const FARM_GROWTH_STEP_MS = 1000;

export const FARM_TOOLS: FarmTool[] = ['hoe', 'seeds', 'watering-can'];
export const FARM_CROPS: CropType[] = ['potato', 'strawberry', 'carrot', 'tomato', 'corn', 'pumpkin'];
export const FARM_GARDEN_CROPS: CropType[] = ['potato', 'strawberry', 'carrot'];
export const FARM_LIFE_CROPS: CropType[] = ['tomato', 'corn', 'pumpkin'];
export const CROP_QUALITIES: CropQuality[] = ['normal', 'silver', 'gold'];
export const FARM_PLOT_STAGES: FarmPlotStage[] = [
  'untilled',
  'tilled',
  'planted',
  'watered',
  'growing-1',
  'growing-2',
  'ready',
];

export const FARM_TOOL_INFO: Record<FarmTool, { label: string; shortcut: string; asset: string }> = {
  hoe: { label: '괭이', shortcut: '1', asset: TOOL_SPRITES.hoe },
  seeds: { label: '씨앗', shortcut: '2', asset: TOOL_SPRITES.seeds },
  'watering-can': { label: '물뿌리개', shortcut: '3', asset: TOOL_SPRITES['watering-can'] },
};

export const FARM_CROP_INFO: Record<CropType, {
  label: string;
  shortLabel: string;
  journalTitle: string;
  description: string;
  tone: string;
}> = {
  potato: {
    label: '감자',
    shortLabel: '감자',
    journalTitle: '농장 도감: 감자',
    description: '포슬포슬한 알이 흙 아래에서 단단하게 여문 감자.',
    tone: 'potato',
  },
  strawberry: {
    label: '딸기',
    shortLabel: '딸기',
    journalTitle: '농장 도감: 딸기',
    description: '초록 잎 사이로 향긋하고 붉게 익은 딸기.',
    tone: 'strawberry',
  },
  carrot: {
    label: '당근',
    shortLabel: '당근',
    journalTitle: '농장 도감: 당근',
    description: '싱싱한 잎과 선명한 주황빛 뿌리를 가진 당근.',
    tone: 'carrot',
  },
  tomato: {
    label: '토마토',
    shortLabel: '토마토',
    journalTitle: '농장 도감: 토마토',
    description: '햇빛을 받아 붉게 익은 마을 밭의 토마토.',
    tone: 'tomato',
  },
  corn: {
    label: '옥수수',
    shortLabel: '옥수수',
    journalTitle: '농장 도감: 옥수수',
    description: '키가 곧게 자라 황금빛 알을 맺은 옥수수.',
    tone: 'corn',
  },
  pumpkin: {
    label: '호박',
    shortLabel: '호박',
    journalTitle: '농장 도감: 호박',
    description: '넓은 잎 아래 묵직하게 여문 주황빛 호박.',
    tone: 'pumpkin',
  },
};

const FARM_PLOT_LAYOUT = [
  { id: 'plot-1', x: 15, y: 13 },
  { id: 'plot-2', x: 16, y: 13 },
  { id: 'plot-3', x: 17, y: 13 },
  { id: 'plot-4', x: 15, y: 14 },
  { id: 'plot-5', x: 16, y: 14 },
  { id: 'plot-6', x: 17, y: 14 },
] as const;

const stageSet = new Set<string>(FARM_PLOT_STAGES);
const toolSet = new Set<string>(FARM_TOOLS);
const cropSet = new Set<string>(FARM_CROPS);
const LEGACY_CROP_MAP: Record<LegacyCropType, CropType> = {
  frontend: 'potato',
  backend: 'strawberry',
  bim: 'carrot',
};
const LEGACY_CROP_BY_CANONICAL: Partial<Record<CropType, LegacyCropType>> = {
  potato: 'frontend',
  strawberry: 'backend',
  carrot: 'bim',
};

export function migrateLegacyCropId(value: unknown): CropType | null {
  if (typeof value !== 'string') return null;
  if (cropSet.has(value)) return value as CropType;
  return LEGACY_CROP_MAP[value as LegacyCropType] ?? null;
}

export function createInitialFarmState(): FarmState {
  const inventory = Object.fromEntries(FARM_CROPS.map((crop) => [crop, 0])) as FarmInventory;
  const qualityInventory = Object.fromEntries(FARM_CROPS.map((crop) => [
    crop,
    { normal: 0, silver: 0, gold: 0 },
  ])) as FarmQualityInventory;
  return {
    version: FARM_SAVE_VERSION,
    plots: FARM_PLOT_LAYOUT.map(({ id, x, y }) => ({
      id,
      x,
      y,
      stage: 'untilled',
      crop: null,
      wateredAt: null,
    })),
    selectedTool: 'hoe',
    selectedSeed: 'potato',
    inventory,
    qualityInventory,
    wateringStreak: 0,
    firstHarvested: false,
  };
}

function normalizePlot(value: unknown, fallback: FarmPlot): FarmPlot {
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<FarmPlot>;
  const stage = typeof candidate.stage === 'string' && stageSet.has(candidate.stage)
    ? candidate.stage as FarmPlotStage
    : fallback.stage;
  const crop = migrateLegacyCropId(candidate.crop);
  const cropRequired = !['untilled', 'tilled'].includes(stage);

  return {
    ...fallback,
    stage: cropRequired && !crop ? 'tilled' : stage,
    crop: cropRequired ? crop : null,
    wateredAt: cropRequired && typeof candidate.wateredAt === 'number' ? candidate.wateredAt : null,
  };
}

function normalizeInventory(value: unknown): FarmInventory {
  const candidate = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return Object.fromEntries(FARM_CROPS.map((crop) => [
    crop,
    Math.max(0, Math.floor(Number(
      candidate[crop] ?? candidate[LEGACY_CROP_BY_CANONICAL[crop] ?? ''],
    ) || 0)),
  ])) as FarmInventory;
}

function normalizeQualityInventory(value: unknown, inventory: FarmInventory): FarmQualityInventory {
  const candidate = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return Object.fromEntries(FARM_CROPS.map((crop) => {
    const savedValue = candidate[crop] ?? candidate[LEGACY_CROP_BY_CANONICAL[crop] ?? ''];
    const saved = savedValue && typeof savedValue === 'object'
      ? savedValue as Record<string, unknown>
      : {};
    const quality = Object.fromEntries(CROP_QUALITIES.map((item) => [
      item,
      Math.max(0, Math.floor(Number(saved[item]) || 0)),
    ])) as Record<CropQuality, number>;
    const qualityTotal = CROP_QUALITIES.reduce((total, item) => total + quality[item], 0);
    if (qualityTotal < inventory[crop]) quality.normal += inventory[crop] - qualityTotal;
    return [crop, quality];
  })) as FarmQualityInventory;
}

export function normalizeFarmState(value: unknown): FarmState {
  const initial = createInitialFarmState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<FarmState>;
  const version = Number((value as { version?: unknown }).version);
  if (![1, 2, FARM_SAVE_VERSION].includes(version)) return initial;

  const savedPlots = Array.isArray(candidate.plots) ? candidate.plots : [];
  const plots = initial.plots.map((fallback) => {
    const saved = savedPlots.find((plot) => plot && typeof plot === 'object' && (plot as Partial<FarmPlot>).id === fallback.id);
    return normalizePlot(saved, fallback);
  });

  const inventory = normalizeInventory(candidate.inventory);
  return {
    version: FARM_SAVE_VERSION,
    plots,
    selectedTool: typeof candidate.selectedTool === 'string' && toolSet.has(candidate.selectedTool)
      ? candidate.selectedTool as FarmTool
      : initial.selectedTool,
    selectedSeed: migrateLegacyCropId(candidate.selectedSeed) ?? initial.selectedSeed,
    inventory,
    qualityInventory: normalizeQualityInventory(candidate.qualityInventory, inventory),
    wateringStreak: Math.max(0, Math.min(99, Math.floor(Number(candidate.wateringStreak) || 0))),
    firstHarvested: Boolean(candidate.firstHarvested),
  };
}

export function advancePlotForTime(plot: FarmPlot, now: number, growthMultiplier = 1): FarmPlot {
  if (!plot.crop || plot.wateredAt === null) return plot;
  if (!['watered', 'growing-1', 'growing-2'].includes(plot.stage)) return plot;

  const elapsed = Math.max(0, now - plot.wateredAt);
  const growthStep = FARM_GROWTH_STEP_MS * Math.max(1, Math.min(2, growthMultiplier));
  const stage: FarmPlotStage = elapsed >= growthStep * 3
    ? 'ready'
    : elapsed >= growthStep * 2
      ? 'growing-2'
      : elapsed >= growthStep
        ? 'growing-1'
        : 'watered';
  return stage === plot.stage ? plot : { ...plot, stage };
}

export function advanceFarmState(
  state: FarmState,
  now = Date.now(),
  getGrowthMultiplier: CropGrowthMultiplierResolver = () => 1,
): FarmState {
  let changed = false;
  const plots = state.plots.map((plot) => {
    const advanced = advancePlotForTime(plot, now, plot.crop ? getGrowthMultiplier(plot.crop) : 1);
    if (advanced !== plot) changed = true;
    return advanced;
  });
  return changed ? { ...state, plots } : state;
}

export function waterAllPlantedPlots(state: FarmState, now = Date.now()): RainWateringResult {
  const wateredPlotIds: string[] = [];
  const plots = state.plots.map((plot) => {
    if (plot.stage !== 'planted' || !plot.crop) return plot;
    wateredPlotIds.push(plot.id);
    return { ...plot, stage: 'watered' as const, wateredAt: now };
  });
  return {
    state: wateredPlotIds.length > 0 ? { ...state, plots } : state,
    changed: wateredPlotIds.length > 0,
    wateredPlotIds,
  };
}

export function takeOneHarvestForFestival(state: FarmState): HarvestSubmissionResult {
  const crop = FARM_CROPS.find((candidate) => state.inventory[candidate] > 0);
  if (!crop) return null;
  const quality = CROP_QUALITIES.find((candidate) => state.qualityInventory[crop][candidate] > 0) ?? 'normal';
  return {
    state: {
      ...state,
      inventory: { ...state.inventory, [crop]: Math.max(0, state.inventory[crop] - 1) },
      qualityInventory: {
        ...state.qualityInventory,
        [crop]: {
          ...state.qualityInventory[crop],
          [quality]: Math.max(0, state.qualityInventory[crop][quality] - 1),
        },
      },
    },
    crop,
    quality,
  };
}

export function loadFarmState(): FarmState {
  if (typeof window === 'undefined') return createInitialFarmState();
  try {
    const saved = window.localStorage.getItem(FARM_STORAGE_KEY);
    if (!saved) return createInitialFarmState();
    return advanceFarmState(normalizeFarmState(JSON.parse(saved)));
  } catch {
    return createInitialFarmState();
  }
}

export function persistFarmState(state: FarmState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FARM_STORAGE_KEY, JSON.stringify(state));
}

export function clearFarmState(): FarmState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(FARM_STORAGE_KEY);
  }
  return createInitialFarmState();
}

export function getNearestFarmPlot(
  player: { x: number; y: number },
  plots: FarmPlot[],
  maxDistance = 1.9,
): FarmPlot | null {
  return plots
    .map((plot) => ({ plot, distance: Math.hypot(player.x - (plot.x + 0.5), player.y - (plot.y + 0.5)) }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)[0]?.plot ?? null;
}

export function getFarmGroundAsset(stage: FarmPlotStage): string {
  if (stage === 'untilled') return SOIL_SPRITES.untilled;
  if (stage === 'watered') return SOIL_SPRITES.watered;
  return SOIL_SPRITES.tilled;
}

export function getFarmCropAsset(plot: FarmPlot): string | null {
  if (!plot.crop || ['untilled', 'tilled'].includes(plot.stage)) return null;
  return CROP_SPRITES[plot.crop][plot.stage] ?? null;
}

function replacePlot(state: FarmState, nextPlot: FarmPlot): FarmState {
  return { ...state, plots: state.plots.map((plot) => plot.id === nextPlot.id ? nextPlot : plot) };
}

function unchanged(state: FarmState, message: string): FarmInteractionResult {
  return { state, message, changed: false, harvestedCrop: null, harvestedQuality: null, firstOfType: false };
}

export function chooseCropQuality(roll: number, wateringStreak: number, careBonus = 0, seasonBonus = 0): CropQuality {
  const normalized = Math.max(0, Math.min(0.999_999, roll));
  const boundedSeasonBonus = Math.max(0, Math.min(1, seasonBonus));
  const goldChance = Math.min(0.3, 0.07 + Math.min(wateringStreak, 9) * 0.012 + Math.min(careBonus, 5) * 0.018 + boundedSeasonBonus * 0.025);
  const silverChance = Math.min(0.55, 0.25 + Math.min(wateringStreak, 9) * 0.018 + Math.min(careBonus, 5) * 0.02 + boundedSeasonBonus * 0.03);
  if (normalized < goldChance) return 'gold';
  if (normalized < goldChance + silverChance) return 'silver';
  return 'normal';
}

export function interactWithFarmPlot(
  state: FarmState,
  plotId: string,
  now = Date.now(),
  qualityRoll = 0.5,
  careBonus = 0,
  getGrowthMultiplier: CropGrowthMultiplierResolver = () => 1,
  seasonQualityBonus = 0,
): FarmInteractionResult {
  const advancedState = advanceFarmState(state, now, getGrowthMultiplier);
  const plot = advancedState.plots.find((candidate) => candidate.id === plotId);
  if (!plot) return unchanged(advancedState, '선택한 밭을 찾을 수 없습니다.');

  if (plot.stage === 'ready' && plot.crop) {
    const crop = plot.crop;
    const firstOfType = advancedState.inventory[crop] === 0;
    const harvestedQuality = chooseCropQuality(qualityRoll, advancedState.wateringStreak, careBonus, seasonQualityBonus);
    const nextPlot: FarmPlot = { ...plot, stage: 'tilled', crop: null, wateredAt: null };
    const nextState = replacePlot({
      ...advancedState,
      inventory: { ...advancedState.inventory, [crop]: advancedState.inventory[crop] + 1 },
      qualityInventory: {
        ...advancedState.qualityInventory,
        [crop]: {
          ...advancedState.qualityInventory[crop],
          [harvestedQuality]: advancedState.qualityInventory[crop][harvestedQuality] + 1,
        },
      },
      firstHarvested: true,
    }, nextPlot);
    return {
      state: nextState,
      message: `${FARM_CROP_INFO[crop].label}을 수확했습니다. (${harvestedQuality.toUpperCase()})`,
      changed: true,
      harvestedCrop: crop,
      harvestedQuality,
      firstOfType,
    };
  }

  if (plot.stage === 'untilled') {
    if (advancedState.selectedTool !== 'hoe') return unchanged(advancedState, '먼저 괭이를 선택해 땅을 갈아야 합니다.');
    return {
      state: replacePlot(advancedState, { ...plot, stage: 'tilled' }),
      message: '괭이로 밭을 갈았습니다.',
      changed: true,
      harvestedCrop: null,
      harvestedQuality: null,
      firstOfType: false,
    };
  }

  if (plot.stage === 'tilled') {
    if (advancedState.selectedTool !== 'seeds') return unchanged(advancedState, '씨앗 도구를 선택해야 합니다.');
    const crop = advancedState.selectedSeed;
    return {
      state: replacePlot(advancedState, { ...plot, stage: 'planted', crop, wateredAt: null }),
      message: `${FARM_CROP_INFO[crop].label} 씨앗을 심었습니다.`,
      changed: true,
      harvestedCrop: null,
      harvestedQuality: null,
      firstOfType: false,
    };
  }

  if (plot.stage === 'planted') {
    if (advancedState.selectedTool !== 'watering-can') return unchanged(advancedState, '물뿌리개를 선택해 작물에 물을 주세요.');
    return {
      state: replacePlot({ ...advancedState, wateringStreak: Math.min(99, advancedState.wateringStreak + 1) }, { ...plot, stage: 'watered', wateredAt: now }),
      message: '작물에 물을 주었습니다. 곧 자라기 시작합니다.',
      changed: true,
      harvestedCrop: null,
      harvestedQuality: null,
      firstOfType: false,
    };
  }

  if (['watered', 'growing-1', 'growing-2'].includes(plot.stage)) {
    return unchanged(advancedState, '작물이 자라고 있습니다. 잠시 후 다시 확인하세요.');
  }

  return unchanged(advancedState, '이 밭에서는 지금 사용할 수 없는 도구입니다.');
}
import { CROP_SPRITES, SOIL_SPRITES, TOOL_SPRITES } from './animationCatalog';
