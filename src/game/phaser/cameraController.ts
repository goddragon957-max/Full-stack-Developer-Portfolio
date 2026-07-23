export type DeadZoneCameraInput = {
  canvasWidth: number;
  canvasHeight: number;
  worldWidth: number;
  worldHeight: number;
  targetX: number;
  targetY: number;
  previousScrollX: number;
  previousScrollY: number;
  initialized: boolean;
  deadZoneWidthRatio?: number;
  deadZoneHeightRatio?: number;
};

export type DeadZoneCameraResult = {
  zoom: number;
  scrollX: number;
  scrollY: number;
  visibleWidth: number;
  visibleHeight: number;
  deadZoneWidth: number;
  deadZoneHeight: number;
  moved: boolean;
};

const DEFAULT_DEAD_ZONE_WIDTH_RATIO = 0.58;
const DEFAULT_DEAD_ZONE_HEIGHT_RATIO = 0.52;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function alignToPhysicalPixel(value: number, zoom: number) {
  return Math.round(value * zoom) / zoom;
}

export function getFitCameraZoom(canvasWidth: number, canvasHeight: number, worldWidth: number, worldHeight: number) {
  // Fit (contain) the whole region inside the canvas so nothing is cropped.
  // The looser dimension is centered by Phaser's bounds clamp, producing a
  // neutral letterbox instead of cutting off edge buildings.
  return Math.max(
    Math.min(
      Math.max(1, canvasWidth) / Math.max(1, worldWidth),
      Math.max(1, canvasHeight) / Math.max(1, worldHeight),
    ),
    0.01,
  );
}

export function updateDeadZoneCamera(input: DeadZoneCameraInput): DeadZoneCameraResult {
  const zoom = getFitCameraZoom(input.canvasWidth, input.canvasHeight, input.worldWidth, input.worldHeight);
  const visibleWidth = Math.min(input.worldWidth, input.canvasWidth / zoom);
  const visibleHeight = Math.min(input.worldHeight, input.canvasHeight / zoom);
  const maxScrollX = Math.max(0, input.worldWidth - visibleWidth);
  const maxScrollY = Math.max(0, input.worldHeight - visibleHeight);
  const deadZoneWidth = visibleWidth * clamp(input.deadZoneWidthRatio ?? DEFAULT_DEAD_ZONE_WIDTH_RATIO, 0.2, 0.9);
  const deadZoneHeight = visibleHeight * clamp(input.deadZoneHeightRatio ?? DEFAULT_DEAD_ZONE_HEIGHT_RATIO, 0.2, 0.9);

  if (!input.initialized) {
    const scrollX = alignToPhysicalPixel(clamp(input.targetX - visibleWidth / 2, 0, maxScrollX), zoom);
    const scrollY = alignToPhysicalPixel(clamp(input.targetY - visibleHeight / 2, 0, maxScrollY), zoom);
    return { zoom, scrollX, scrollY, visibleWidth, visibleHeight, deadZoneWidth, deadZoneHeight, moved: false };
  }

  let scrollX = clamp(input.previousScrollX, 0, maxScrollX);
  let scrollY = clamp(input.previousScrollY, 0, maxScrollY);
  const deadZoneLeft = scrollX + (visibleWidth - deadZoneWidth) / 2;
  const deadZoneRight = deadZoneLeft + deadZoneWidth;
  const deadZoneTop = scrollY + (visibleHeight - deadZoneHeight) / 2;
  const deadZoneBottom = deadZoneTop + deadZoneHeight;

  if (input.targetX < deadZoneLeft) scrollX -= deadZoneLeft - input.targetX;
  else if (input.targetX > deadZoneRight) scrollX += input.targetX - deadZoneRight;
  if (input.targetY < deadZoneTop) scrollY -= deadZoneTop - input.targetY;
  else if (input.targetY > deadZoneBottom) scrollY += input.targetY - deadZoneBottom;

  scrollX = alignToPhysicalPixel(clamp(scrollX, 0, maxScrollX), zoom);
  scrollY = alignToPhysicalPixel(clamp(scrollY, 0, maxScrollY), zoom);
  const moved = Math.abs(scrollX - input.previousScrollX) > 0.001 || Math.abs(scrollY - input.previousScrollY) > 0.001;
  return { zoom, scrollX, scrollY, visibleWidth, visibleHeight, deadZoneWidth, deadZoneHeight, moved };
}
