export type UpgradeToolId = 'watering-can' | 'fishing-rod' | 'pickaxe';
export type ToolLevel = 0 | 1 | 2;

export type ToolProgressionState = {
  version: 1;
  levels: Record<UpgradeToolId, ToolLevel>;
};

export type ToolUpgradeResult = {
  state: ToolProgressionState;
  changed: boolean;
  cost: number;
  message: string;
};

export const TOOL_PROGRESSION_STORAGE_KEY = 'mossbell-tool-progression-v1';
export const TOOL_PROGRESSION_SAVE_VERSION = 1;
export const UPGRADE_TOOL_IDS: UpgradeToolId[] = ['watering-can', 'fishing-rod', 'pickaxe'];
export const FISHING_WINDOW_BONUS_MS: Record<ToolLevel, number> = { 0: 0, 1: 350, 2: 700 };

export const TOOL_UPGRADE_INFO: Record<UpgradeToolId, {
  label: string;
  prices: Record<1 | 2, number>;
  effects: Record<ToolLevel, string>;
}> = {
  'watering-can': {
    label: '물뿌리개',
    prices: { 1: 240, 2: 640 },
    effects: { 0: '밭 1칸', 1: '인접 밭 1칸 추가', 2: '모든 인접 밭 추가' },
  },
  'fishing-rod': {
    label: '낚싯대',
    prices: { 1: 280, 2: 720 },
    effects: { 0: '기본 입질 시간', 1: '입질 시간 +0.35초', 2: '입질 시간 +0.70초' },
  },
  pickaxe: {
    label: '곡괭이',
    prices: { 1: 320, 2: 780 },
    effects: { 0: '기본 광석 수량', 1: '추가 광석 확률 30%', 2: '추가 광석 확률 65%' },
  },
};

function level(value: unknown): ToolLevel {
  const normalized = Math.max(0, Math.min(2, Math.floor(Number(value) || 0)));
  return normalized as ToolLevel;
}

export function createInitialToolProgressionState(): ToolProgressionState {
  return { version: TOOL_PROGRESSION_SAVE_VERSION, levels: { 'watering-can': 0, 'fishing-rod': 0, pickaxe: 0 } };
}

export function normalizeToolProgressionState(value: unknown): ToolProgressionState {
  const initial = createInitialToolProgressionState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<ToolProgressionState>;
  if (Number(candidate.version) !== TOOL_PROGRESSION_SAVE_VERSION || !candidate.levels || typeof candidate.levels !== 'object') return initial;
  const saved = candidate.levels as Partial<Record<UpgradeToolId, unknown>>;
  return {
    version: TOOL_PROGRESSION_SAVE_VERSION,
    levels: Object.fromEntries(UPGRADE_TOOL_IDS.map((id) => [id, level(saved[id])])) as Record<UpgradeToolId, ToolLevel>,
  };
}

export function loadToolProgressionState(): ToolProgressionState {
  if (typeof window === 'undefined') return createInitialToolProgressionState();
  try {
    const saved = window.localStorage.getItem(TOOL_PROGRESSION_STORAGE_KEY);
    return saved ? normalizeToolProgressionState(JSON.parse(saved)) : createInitialToolProgressionState();
  } catch {
    return createInitialToolProgressionState();
  }
}

export function persistToolProgressionState(state: ToolProgressionState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOOL_PROGRESSION_STORAGE_KEY, JSON.stringify(state));
}

export function clearToolProgressionState() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(TOOL_PROGRESSION_STORAGE_KEY);
  return createInitialToolProgressionState();
}

export function getUpgradeCost(state: ToolProgressionState, tool: UpgradeToolId) {
  const nextLevel = state.levels[tool] + 1;
  return nextLevel > 2 ? 0 : TOOL_UPGRADE_INFO[tool].prices[nextLevel as 1 | 2];
}

export function purchaseToolUpgrade(state: ToolProgressionState, tool: UpgradeToolId, availableGold: number): ToolUpgradeResult {
  const currentLevel = state.levels[tool];
  if (currentLevel >= 2) return { state, changed: false, cost: 0, message: `${TOOL_UPGRADE_INFO[tool].label}은(는) 이미 최고 단계입니다.` };
  const cost = TOOL_UPGRADE_INFO[tool].prices[(currentLevel + 1) as 1 | 2];
  if (availableGold < cost) return { state, changed: false, cost, message: `업그레이드에 ${cost} GOLD가 필요합니다.` };
  const nextLevel = (currentLevel + 1) as ToolLevel;
  return {
    state: { ...state, levels: { ...state.levels, [tool]: nextLevel } },
    changed: true,
    cost,
    message: `${TOOL_UPGRADE_INFO[tool].label}이(가) LV.${nextLevel}이 되었습니다.`,
  };
}

export function areAllToolsMaxed(state: ToolProgressionState) {
  return UPGRADE_TOOL_IDS.every((tool) => state.levels[tool] === 2);
}

export function getFishingBiteWindow(baseWindowMs: number, levelValue: ToolLevel) {
  return Math.max(250, baseWindowMs) + FISHING_WINDOW_BONUS_MS[levelValue];
}

export function getMiningYieldBonus(levelValue: ToolLevel, roll: number) {
  const chance = levelValue === 2 ? 0.65 : levelValue === 1 ? 0.3 : 0;
  return Math.max(0, Math.min(0.999_999, roll)) < chance ? 1 : 0;
}

export function getWateringTargetIds<T extends { id: string; x: number; y: number }>(plots: T[], targetId: string, levelValue: ToolLevel) {
  const target = plots.find((plot) => plot.id === targetId);
  if (!target) return [];
  if (levelValue === 0) return [target.id];
  const adjacent = plots.filter((plot) => plot.id !== target.id && Math.abs(plot.x - target.x) + Math.abs(plot.y - target.y) === 1);
  return [target.id, ...adjacent.slice(0, levelValue === 1 ? 1 : adjacent.length)].map((plot) => typeof plot === 'string' ? plot : plot.id);
}
