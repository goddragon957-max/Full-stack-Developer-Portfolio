export type SpriteDirection = 'up' | 'down' | 'left' | 'right';
export type RemasterNpcId = 'lumi' | 'hana' | 'jun' | 'sera' | 'doyun';
export type RemasterAnimalSpecies = 'chicken' | 'cow';
export type RemasterAnimalState = 'idle' | 'walk-0' | 'walk-1' | 'happy' | 'sleeping' | 'product-ready';
export type PlayerAction = 'hoe' | 'water' | 'pickaxe' | 'fish-cast' | 'fish-reel';
export type NpcPortraitExpression = 'neutral' | 'happy' | 'concerned';

const ROOT = '/assets/art-remaster-v1';
const directions: SpriteDirection[] = ['down', 'left', 'right', 'up'];

function directionalFrames(root: string) {
  return Object.fromEntries(directions.map((direction) => [
    direction,
    [0, 1, 2].map((frame) => `${root}/${direction}-${frame}.png`),
  ])) as Record<SpriteDirection, string[]>;
}

export const PLAYER_WALK_SPRITES = directionalFrames(`${ROOT}/characters/player`);

export const PLAYER_ACTION_SPRITES = Object.fromEntries(
  ['hoe', 'water', 'pickaxe', 'fish-cast', 'fish-reel'].map((action) => [
    action,
    [0, 1, 2].map((frame) => `${ROOT}/characters/player/actions/${action}-${frame}.png`),
  ]),
) as Record<PlayerAction, string[]>;

export const NPC_WALK_SPRITES: Record<RemasterNpcId, Record<SpriteDirection, string[]>> = {
  lumi: directionalFrames(`${ROOT}/npcs/lumi`),
  hana: directionalFrames(`${ROOT}/npcs/hana`),
  jun: directionalFrames(`${ROOT}/npcs/jun`),
  sera: directionalFrames(`${ROOT}/npcs/sera`),
  doyun: directionalFrames(`${ROOT}/npcs/doyun`),
};

export const NPC_PORTRAITS = Object.fromEntries(
  ['lumi', 'hana', 'jun', 'sera', 'doyun'].map((npc) => [
    npc,
    Object.fromEntries(['neutral', 'happy', 'concerned'].map((expression) => [
      expression,
      `${ROOT}/npcs/${npc}/portrait-${expression}.png`,
    ])),
  ]),
) as Record<RemasterNpcId, Record<NpcPortraitExpression, string>>;

export const NPC_PHASE_FACING: Record<'dawn' | 'day' | 'sunset' | 'night', SpriteDirection> = {
  dawn: 'right',
  day: 'down',
  sunset: 'left',
  night: 'up',
};

export const ANIMAL_SPRITES: Record<RemasterAnimalSpecies, Record<RemasterAnimalState, string>> = {
  chicken: Object.fromEntries(['idle', 'walk-0', 'walk-1', 'happy', 'sleeping', 'product-ready'].map((state) => [state, `${ROOT}/animals/chicken/${state}.png`])) as Record<RemasterAnimalState, string>,
  cow: Object.fromEntries(['idle', 'walk-0', 'walk-1', 'happy', 'sleeping', 'product-ready'].map((state) => [state, `${ROOT}/animals/cow/${state}.png`])) as Record<RemasterAnimalState, string>,
};

export const CROP_SPRITES = Object.fromEntries(
  ['frontend', 'backend', 'bim', 'tomato', 'corn', 'pumpkin'].map((crop) => [crop, Object.fromEntries(
    ['planted', 'watered', 'growing-1', 'growing-2', 'ready'].map((stage) => [stage, `${ROOT}/crops/${crop}/${stage}.png`]),
  )]),
) as Record<string, Record<string, string>>;

export const TOOL_SPRITES = {
  hoe: `${ROOT}/items/tools/hoe.png`,
  seeds: `${ROOT}/items/tools/seeds.png`,
  'watering-can': `${ROOT}/items/tools/watering-can.png`,
  'fishing-rod': `${ROOT}/items/tools/fishing-rod.png`,
  pickaxe: `${ROOT}/items/tools/pickaxe.png`,
} as const;

export const SOIL_SPRITES = {
  untilled: `${ROOT}/tiles/soil/untilled.png`,
  tilled: `${ROOT}/tiles/soil/tilled.png`,
  watered: `${ROOT}/tiles/soil/watered.png`,
} as const;

export const PRODUCT_SPRITES = {
  egg: `${ROOT}/items/products/egg.png`,
  milk: `${ROOT}/items/products/milk.png`,
  'golden-egg': `${ROOT}/items/products/golden-egg.png`,
} as const;

export const CROP_ITEM_SPRITES = Object.fromEntries(
  ['frontend', 'backend', 'bim', 'tomato', 'corn', 'pumpkin'].map((crop) => [crop, `${ROOT}/items/crops/${crop}.png`]),
) as Record<string, string>;

export const FISH_SPRITES = Object.fromEntries(
  ['bluegill', 'carp', 'perch', 'koi', 'moonfin', 'river-trout', 'silver-dace', 'night-eel', 'shore-sardine', 'coral-bream', 'tide-ray'].map((fish) => [fish, `${ROOT}/items/fish/${fish}.png`]),
) as Record<string, string>;

export const FORAGE_SPRITES = Object.fromEntries(
  ['mushroom', 'herb', 'wild-berry', 'fern', 'moon-bloom'].map((item) => [item, `${ROOT}/items/forage/${item}.png`]),
) as Record<string, string>;

export const ORE_SPRITES = Object.fromEntries(
  ['stone', 'copper-ore', 'iron-ore', 'star-crystal'].map((item) => [item, `${ROOT}/items/ore/${item}.png`]),
) as Record<string, string>;

export const EFFECT_SPRITES = {
  bobber: `${ROOT}/effects/bobber.png`,
  ripple: [`${ROOT}/effects/ripple-0.png`, `${ROOT}/effects/ripple-1.png`],
  heart: `${ROOT}/effects/heart.png`,
  note: `${ROOT}/effects/note.png`,
  harvest: `${ROOT}/effects/harvest-sparkle.png`,
  crystal: `${ROOT}/effects/crystal-sparkle.png`,
  smoke: `${ROOT}/effects/smoke.png`,
  windowLight: `${ROOT}/effects/window-light.png`,
} as const;

export function getNpcSprite(id: RemasterNpcId, direction: SpriteDirection, frame: number) {
  const frames = NPC_WALK_SPRITES[id][direction];
  return frames[Math.abs(frame) % frames.length];
}

export function getAnimalRemasterSprite(species: RemasterAnimalSpecies, status: RemasterAnimalState, frame: number) {
  const movingStatus: RemasterAnimalState = status === 'idle'
    ? Math.abs(frame) % 2 === 0 ? 'walk-0' : 'walk-1'
    : status;
  return ANIMAL_SPRITES[species][movingStatus];
}

export const ANIMATION_CATALOG_MARKER = 'directional-gpt-sprites';
