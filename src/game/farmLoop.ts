export type FarmTool = 'hoe' | 'seeds' | 'watering-can';
export type CropType = 'frontend' | 'backend' | 'bim';
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

export type FarmState = {
  version: 1;
  plots: FarmPlot[];
  selectedTool: FarmTool;
  selectedSeed: CropType;
  inventory: FarmInventory;
  firstHarvested: boolean;
};

export type FarmInteractionResult = {
  state: FarmState;
  message: string;
  changed: boolean;
  harvestedCrop: CropType | null;
  firstOfType: boolean;
};

export const FARM_STORAGE_KEY = 'portfolio-farm-loop-v1';
export const FARM_SAVE_VERSION = 1;
export const FARM_GROWTH_STEP_MS = 1000;

export const FARM_TOOLS: FarmTool[] = ['hoe', 'seeds', 'watering-can'];
export const FARM_CROPS: CropType[] = ['frontend', 'backend', 'bim'];
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
  hoe: { label: '괭이', shortcut: '1', asset: '/assets/farm-loop/tools/hoe.png' },
  seeds: { label: '씨앗', shortcut: '2', asset: '/assets/farm-loop/tools/seeds.png' },
  'watering-can': { label: '물뿌리개', shortcut: '3', asset: '/assets/farm-loop/tools/watering-can.png' },
};

export const FARM_CROP_INFO: Record<CropType, {
  label: string;
  shortLabel: string;
  portfolioTitle: string;
  portfolioDescription: string;
  tone: string;
}> = {
  frontend: {
    label: 'Frontend 작물',
    shortLabel: 'FE',
    portfolioTitle: 'Frontend 수확: React/TypeScript',
    portfolioDescription: 'React와 TypeScript로 운영 화면과 입력·목록 UI를 다룬 기록.',
    tone: 'frontend',
  },
  backend: {
    label: 'Backend 작물',
    shortLabel: 'BE',
    portfolioTitle: 'Backend 수확: Java/Spring Boot/PostgreSQL',
    portfolioDescription: 'Java, Spring Boot, PostgreSQL과 MyBatis로 API와 데이터 흐름을 다룬 기록.',
    tone: 'backend',
  },
  bim: {
    label: 'BIM 작물',
    shortLabel: 'BIM',
    portfolioTitle: 'BIM 수확: AWP/BIM/xeokit/XKT',
    portfolioDescription: 'AWP와 BIM 업무 흐름, xeokit·XKT·tile/LOD·clipping 검증 기록.',
    tone: 'bim',
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

export function createInitialFarmState(): FarmState {
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
    selectedSeed: 'frontend',
    inventory: { frontend: 0, backend: 0, bim: 0 },
    firstHarvested: false,
  };
}

function normalizePlot(value: unknown, fallback: FarmPlot): FarmPlot {
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Partial<FarmPlot>;
  const stage = typeof candidate.stage === 'string' && stageSet.has(candidate.stage)
    ? candidate.stage as FarmPlotStage
    : fallback.stage;
  const crop = typeof candidate.crop === 'string' && cropSet.has(candidate.crop)
    ? candidate.crop as CropType
    : null;
  const cropRequired = !['untilled', 'tilled'].includes(stage);

  return {
    ...fallback,
    stage: cropRequired && !crop ? 'tilled' : stage,
    crop: cropRequired ? crop : null,
    wateredAt: cropRequired && typeof candidate.wateredAt === 'number' ? candidate.wateredAt : null,
  };
}

function normalizeInventory(value: unknown): FarmInventory {
  const candidate = value && typeof value === 'object' ? value as Partial<FarmInventory> : {};
  return {
    frontend: Math.max(0, Math.floor(Number(candidate.frontend) || 0)),
    backend: Math.max(0, Math.floor(Number(candidate.backend) || 0)),
    bim: Math.max(0, Math.floor(Number(candidate.bim) || 0)),
  };
}

function normalizeFarmState(value: unknown): FarmState {
  const initial = createInitialFarmState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<FarmState>;
  if (candidate.version !== FARM_SAVE_VERSION) return initial;

  const savedPlots = Array.isArray(candidate.plots) ? candidate.plots : [];
  const plots = initial.plots.map((fallback) => {
    const saved = savedPlots.find((plot) => plot && typeof plot === 'object' && (plot as Partial<FarmPlot>).id === fallback.id);
    return normalizePlot(saved, fallback);
  });

  return {
    version: FARM_SAVE_VERSION,
    plots,
    selectedTool: typeof candidate.selectedTool === 'string' && toolSet.has(candidate.selectedTool)
      ? candidate.selectedTool as FarmTool
      : initial.selectedTool,
    selectedSeed: typeof candidate.selectedSeed === 'string' && cropSet.has(candidate.selectedSeed)
      ? candidate.selectedSeed as CropType
      : initial.selectedSeed,
    inventory: normalizeInventory(candidate.inventory),
    firstHarvested: Boolean(candidate.firstHarvested),
  };
}

export function advancePlotForTime(plot: FarmPlot, now: number): FarmPlot {
  if (!plot.crop || plot.wateredAt === null) return plot;
  if (!['watered', 'growing-1', 'growing-2'].includes(plot.stage)) return plot;

  const elapsed = Math.max(0, now - plot.wateredAt);
  const stage: FarmPlotStage = elapsed >= FARM_GROWTH_STEP_MS * 3
    ? 'ready'
    : elapsed >= FARM_GROWTH_STEP_MS * 2
      ? 'growing-2'
      : elapsed >= FARM_GROWTH_STEP_MS
        ? 'growing-1'
        : 'watered';
  return stage === plot.stage ? plot : { ...plot, stage };
}

export function advanceFarmState(state: FarmState, now = Date.now()): FarmState {
  let changed = false;
  const plots = state.plots.map((plot) => {
    const advanced = advancePlotForTime(plot, now);
    if (advanced !== plot) changed = true;
    return advanced;
  });
  return changed ? { ...state, plots } : state;
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
  if (stage === 'untilled') return '/assets/farm-loop/ground/untilled.png';
  if (stage === 'watered') return '/assets/farm-loop/ground/watered.png';
  return '/assets/farm-loop/ground/tilled.png';
}

export function getFarmCropAsset(plot: FarmPlot): string | null {
  if (!plot.crop || ['untilled', 'tilled'].includes(plot.stage)) return null;
  return `/assets/farm-loop/crops/${plot.crop}/${plot.stage}.png`;
}

function replacePlot(state: FarmState, nextPlot: FarmPlot): FarmState {
  return { ...state, plots: state.plots.map((plot) => plot.id === nextPlot.id ? nextPlot : plot) };
}

function unchanged(state: FarmState, message: string): FarmInteractionResult {
  return { state, message, changed: false, harvestedCrop: null, firstOfType: false };
}

export function interactWithFarmPlot(state: FarmState, plotId: string, now = Date.now()): FarmInteractionResult {
  const advancedState = advanceFarmState(state, now);
  const plot = advancedState.plots.find((candidate) => candidate.id === plotId);
  if (!plot) return unchanged(advancedState, '선택한 밭을 찾을 수 없습니다.');

  if (plot.stage === 'ready' && plot.crop) {
    const crop = plot.crop;
    const firstOfType = advancedState.inventory[crop] === 0;
    const nextPlot: FarmPlot = { ...plot, stage: 'tilled', crop: null, wateredAt: null };
    const nextState = replacePlot({
      ...advancedState,
      inventory: { ...advancedState.inventory, [crop]: advancedState.inventory[crop] + 1 },
      firstHarvested: true,
    }, nextPlot);
    return {
      state: nextState,
      message: `${FARM_CROP_INFO[crop].label}을 수확했습니다.`,
      changed: true,
      harvestedCrop: crop,
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
      firstOfType: false,
    };
  }

  if (plot.stage === 'planted') {
    if (advancedState.selectedTool !== 'watering-can') return unchanged(advancedState, '물뿌리개를 선택해 작물에 물을 주세요.');
    return {
      state: replacePlot(advancedState, { ...plot, stage: 'watered', wateredAt: now }),
      message: '작물에 물을 주었습니다. 곧 자라기 시작합니다.',
      changed: true,
      harvestedCrop: null,
      firstOfType: false,
    };
  }

  if (['watered', 'growing-1', 'growing-2'].includes(plot.stage)) {
    return unchanged(advancedState, '작물이 자라고 있습니다. 잠시 후 다시 확인하세요.');
  }

  return unchanged(advancedState, '이 밭에서는 지금 사용할 수 없는 도구입니다.');
}
