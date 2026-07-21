export type NpcFacing = 'up' | 'down' | 'left' | 'right';

export type NpcPatrolPoint = {
  x: number;
  y: number;
};

export type NpcPatrolRoute = {
  start: NpcPatrolPoint;
  end: NpcPatrolPoint;
  idleFacing: NpcFacing;
  tickOffset?: number;
};

export type NpcPatrolPose = NpcPatrolPoint & {
  facing: NpcFacing;
  frame: number;
  moving: boolean;
};

export const NPC_IDLE_FRAME = 1;
export const NPC_PATROL_TICK_MS = 280;
export const NPC_PATROL_CYCLE_TICKS = 16;

const HOLD_TICKS = 4;
const TRAVEL_TICKS = 4;
const WALK_FRAMES = [0, 1, 2, 1] as const;

function normalizeTick(tick: number) {
  return ((Math.floor(tick) % NPC_PATROL_CYCLE_TICKS) + NPC_PATROL_CYCLE_TICKS) % NPC_PATROL_CYCLE_TICKS;
}

function getTravelFacing(from: NpcPatrolPoint, to: NpcPatrolPoint): NpcFacing {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  if (Math.abs(deltaX) >= Math.abs(deltaY)) return deltaX >= 0 ? 'right' : 'left';
  return deltaY >= 0 ? 'down' : 'up';
}

function interpolate(from: NpcPatrolPoint, to: NpcPatrolPoint, progress: number) {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

export function getNpcPatrolPose(route: NpcPatrolRoute, tick: number): NpcPatrolPose {
  const phase = normalizeTick(tick + (route.tickOffset ?? 0));
  if (phase < HOLD_TICKS) {
    return { ...route.start, facing: route.idleFacing, frame: NPC_IDLE_FRAME, moving: false };
  }

  if (phase < HOLD_TICKS + TRAVEL_TICKS) {
    const travelTick = phase - HOLD_TICKS;
    const point = interpolate(route.start, route.end, (travelTick + 1) / TRAVEL_TICKS);
    return {
      ...point,
      facing: getTravelFacing(route.start, route.end),
      frame: WALK_FRAMES[travelTick],
      moving: true,
    };
  }

  if (phase < HOLD_TICKS * 2 + TRAVEL_TICKS) {
    return { ...route.end, facing: route.idleFacing, frame: NPC_IDLE_FRAME, moving: false };
  }

  const travelTick = phase - (HOLD_TICKS * 2 + TRAVEL_TICKS);
  const point = interpolate(route.end, route.start, (travelTick + 1) / TRAVEL_TICKS);
  return {
    ...point,
    facing: getTravelFacing(route.end, route.start),
    frame: WALK_FRAMES[travelTick],
    moving: true,
  };
}

export function createNearbyPatrol(
  anchor: NpcPatrolPoint,
  idleFacing: NpcFacing,
  tickOffset = 0,
  axis: 'horizontal' | 'vertical' = 'horizontal',
): NpcPatrolRoute {
  return {
    start: anchor,
    end: axis === 'horizontal'
      ? { x: anchor.x + 1, y: anchor.y }
      : { x: anchor.x, y: anchor.y + 1 },
    idleFacing,
    tickOffset,
  };
}
