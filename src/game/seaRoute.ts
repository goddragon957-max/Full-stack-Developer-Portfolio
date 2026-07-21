export const SEA_ROUTE_REGION_ID = 'mossbell-sea' as const;
export const SEA_ROUTE_MAP_ASSET = '/assets/sea-route-v1/maps/mossbell-sea.png';

export type SeaRouteDirection = 'up' | 'down' | 'left' | 'right';

export const SEA_ROUTE_BOAT_ASSETS: Record<SeaRouteDirection, string> = {
  up: '/assets/sea-route-v1/sprites/boat-up.png',
  down: '/assets/sea-route-v1/sprites/boat-down.png',
  left: '/assets/sea-route-v1/sprites/boat-left.png',
  right: '/assets/sea-route-v1/sprites/boat-right.png',
};

export const RIVER_COAST_DOCK_TRIGGER = {
  x: 3,
  y: 6,
  w: 2,
  h: 2,
  range: 3.2,
} as const;

export const SEA_ROUTE_RETURN_TRIGGER = {
  x: 3,
  y: 15,
  w: 2,
  h: 2,
  range: 2.8,
} as const;

export const SEA_ROUTE_RETURN_APPROACH = { x: 6, y: 17 } as const;

export const SEA_ROUTE_ENTRY = {
  region: SEA_ROUTE_REGION_ID,
  position: { x: 7, y: 17, facing: 'right' as const },
} as const;

export const SEA_ROUTE_RETURN = {
  region: 'river-coast' as const,
  position: { x: 6, y: 8, facing: 'right' as const },
} as const;

// The painted dock bridge crosses the river diagonally. These two cells join
// its diagonal gaps into a four-direction movement path without opening water.
export const RIVER_COAST_DOCK_WALKABLE_CELLS = [
  { x: 7, y: 8 },
  { x: 8, y: 9 },
] as const;

export function isRiverCoastDockWalkable(x: number, y: number) {
  return RIVER_COAST_DOCK_WALKABLE_CELLS.some((cell) => cell.x === x && cell.y === y);
}

export const SEA_ROUTE_COLLISION_RECTS = [
  { x: 6, y: 1, w: 6, h: 5, id: 'northwest-reef' },
  { x: 20, y: 2, w: 9, h: 8, id: 'lighthouse-island' },
  { x: 12, y: 12, w: 9, h: 5, id: 'coral-sandbar' },
  { x: 0, y: 18, w: 6, h: 4, id: 'harbor-shore' },
  { x: 2, y: 15, w: 4, h: 3, id: 'harbor-pier' },
] as const;

export function isSeaRouteBlocked(x: number, y: number) {
  if (x < 1 || x > 30 || y < 1 || y > 20) return true;
  return SEA_ROUTE_COLLISION_RECTS.some((rect) => (
    x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h
  ));
}

export const SEA_ROUTE_MARKER = 'river-coast-boat-to-mossbell-sea';
