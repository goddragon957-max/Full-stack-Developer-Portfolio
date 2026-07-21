import {
  FORAGE_NODES,
  OPEN_WORLD_NPC_INFO,
  type ForageNodeId,
  type OpenWorldNpcId,
} from '../../game/foragingLoop';
import {
  FAST_TRAVEL_POSTS,
  REGION_COLLISION_RECTS,
  REGION_EXITS,
  REGION_IDS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type RegionExit,
  type RegionId,
  type WorldPosition,
} from '../../game/openWorld';
import { getSeasonalMapAsset, SEASONS, type Season } from '../../game/seasonSystem';

const PHASER_TILE_SIZE = 32;

export type PhaserRegionInteractionId =
  | 'buildings'
  | 'farm-plots'
  | 'ranch'
  | 'fast-travel'
  | 'forage'
  | 'shoreline-fishing'
  | 'mining'
  | 'story-marker'
  | 'boat-route';

export type PhaserWorldRegionDefinition = {
  id: RegionId;
  worldWidth: number;
  worldHeight: number;
  mapAssets: Record<Season, string>;
  collisionRects: typeof REGION_COLLISION_RECTS[RegionId];
  exits: RegionExit[];
  arrivals: Array<{ exitId: string; position: WorldPosition }>;
  npcIds: string[];
  forageNodeIds: ForageNodeId[];
  interactionIds: PhaserRegionInteractionId[];
  fastTravelPost?: { x: number; y: number };
};

export type PhaserWorldRegion = PhaserWorldRegionDefinition & {
  season: Season;
  mapAsset: string;
};

const REGION_NPC_IDS: Record<RegionId, string[]> = {
  'farm-village': ['village-keeper', 'farmer-hana', 'rancher-jun'],
  'whisper-forest': ['forest-guide'],
  'river-coast': [],
  'mine-foothill': ['mine-keeper'],
  'mossbell-sea': [],
};

const REGION_INTERACTION_IDS: Record<RegionId, PhaserRegionInteractionId[]> = {
  'farm-village': ['buildings', 'farm-plots', 'ranch', 'fast-travel', 'shoreline-fishing'],
  'whisper-forest': ['forage', 'fast-travel'],
  'river-coast': ['shoreline-fishing', 'forage', 'fast-travel', 'story-marker', 'boat-route'],
  'mine-foothill': ['mining', 'fast-travel'],
  'mossbell-sea': ['boat-route'],
};

function createRegionDefinition(id: RegionId): PhaserWorldRegionDefinition {
  const openWorldNpcIds = (Object.keys(OPEN_WORLD_NPC_INFO) as OpenWorldNpcId[])
    .filter((npcId) => OPEN_WORLD_NPC_INFO[npcId].region === id);
  const npcIds = [...new Set([...REGION_NPC_IDS[id], ...openWorldNpcIds])];
  const mapAssets = Object.fromEntries(
    SEASONS.map((season) => [season, getSeasonalMapAsset(id, season)]),
  ) as Record<Season, string>;

  return {
    id,
    worldWidth: WORLD_WIDTH * PHASER_TILE_SIZE,
    worldHeight: WORLD_HEIGHT * PHASER_TILE_SIZE,
    mapAssets,
    collisionRects: REGION_COLLISION_RECTS[id],
    exits: REGION_EXITS.filter((exit) => exit.from === id),
    arrivals: REGION_EXITS
      .filter((exit) => exit.to === id)
      .map((exit) => ({ exitId: exit.id, position: exit.arrival })),
    npcIds,
    forageNodeIds: FORAGE_NODES.filter((node) => node.region === id).map((node) => node.id),
    interactionIds: REGION_INTERACTION_IDS[id],
    fastTravelPost: FAST_TRAVEL_POSTS[id],
  };
}

export const PHASER_WORLD_REGIONS = Object.fromEntries(
  REGION_IDS.map((id) => [id, createRegionDefinition(id)]),
) as Record<RegionId, PhaserWorldRegionDefinition>;

export function getPhaserWorldRegion(region: RegionId, season: Season): PhaserWorldRegion {
  const definition = PHASER_WORLD_REGIONS[region];
  return { ...definition, season, mapAsset: definition.mapAssets[season] };
}
