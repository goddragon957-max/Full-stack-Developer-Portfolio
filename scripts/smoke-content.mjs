import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const app = readFileSync('src/App.tsx', 'utf8');
const game = readFileSync('src/components/PortfolioFarmGame.tsx', 'utf8');
const farmLoop = readFileSync('src/game/farmLoop.ts', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const verify = readFileSync('VERIFY.md', 'utf8');
const referenceBoard = readFileSync('docs/design/reference-board.md', 'utf8');

const joined = `${app}\n${game}\n${farmLoop}\n${css}\n${design}\n${readme}\n${verify}\n${referenceBoard}`;
const publicJoined = `${app}\n${game}\n${css}`;

const required = [
  'data-ui-pass="portfolio-inside-farming-rpg"',
  'data-game-world="playable-cozy-farm-rpg"',
  'data-screen-mode="fullscreen-game-shell"',
  'data-game-phase',
  'data-intro-title',
  'data-typed-title',
  'data-player-facing',
  'data-player-walking',
  'data-player-frame',
  'data-movement-mode="pressed-key-raf-loop"',
  'EOM SINYONG',
  'intro-screen',
  'pixel-title',
  'START GAME',
  'requestAnimationFrame',
  'pressedDirectionsRef',
  'normalizedCharacterWalkSprites',
  'data-sprite-normalization="bottom-centered-transparent-canvas"',
  'data-walk-cycle="coherent-generated-frames"',
  'data-world-scale-mode="pixel-locked-fit"',
  'data-mobile-fit-mode="camera-fullscreen-safe-area"',
  'data-camera-mode="player-centered-fullscreen"',
  'data-map-grid="32x22"',
  'data-collision-mode="entity-bounds"',
  'data-depth-sorting="y-axis-feet"',
  'data-right-inventory-bar="persistent"',
  '--inventory-rail-width',
  'data-map-renderer="single-generated-map-image"',
  'data-world-map-image="developer-farm-map"',
  'world-map-image',
  '--camera-left',
  '--camera-top',
  'data-current-scene',
  'data-layout-mode="full-screen-map-with-right-inventory-bar"',
  'data-topbar-visible="false"',
  'data-sidebar-visible="true"',
  'data-overlay-layer="dialogue-and-menu"',
  'data-dialogue-mode="bottom-bar"',
  'data-bottom-dialogue-bar="game-chat"',
  'bottom-dialogue-bar',
  'data-settings-open',
  'data-settings-tab',
  'data-inventory-open',
  'data-inventory-panel="right-game-bar"',
  'data-inventory-slot',
  'data-player-status="inventory-rail"',
  'data-item-pickup',
  'data-item-pickup-visible',
  'data-item-pickup-toast="inventory-unlock"',
  'ITEM ACQUIRED',
  'inventory-player-status',
  'is-acquired',
  'knownInventoryIdsRef',
  'data-farm-loop="v1"',
  'data-farm-plot-count',
  'data-farm-stage',
  'data-farm-crop',
  'data-selected-farm-tool',
  'data-selected-seed',
  'data-farm-storage="localStorage"',
  'data-farm-first-harvest',
  'data-farm-tool',
  'data-seed-type',
  'data-reset-farm="farm-state-only"',
  'portfolio-farm-loop-v1',
  'farm-toolbelt',
  'farm-plot',
  'RESET FARM',
  'Digit1',
  'Digit2',
  'Digit3',
  'untilled',
  'tilled',
  'planted',
  'watered',
  'growing-1',
  'growing-2',
  'ready',
  'frontend-harvest',
  'backend-harvest',
  'bim-harvest',
  'data-selected-inventory-item',
  'data-inventory-count',
  'INVENTORY',
  'inventory-rail',
  'inventory-rail-journal',
  'inventory-rail-objective',
  'inventory-grid',
  'data-labels-visible',
  'data-hints-visible',
  'data-game-surface="full-screen-map"',
  'data-layer="game-overlay-ui"',
  'data-settings-toggle="gear"',
  'data-settings-window="game-menu"',
  'data-map-panel="portfolio-world-map"',
  'data-about-panel="portfolio-about"',
  'data-settings-panel="game-options"',
  'data-settings-map="below-options"',
  'Settings map',
  'Map under settings',
  'gear-button',
  'settings-window',
  'mini-map',
  'map-player',
  'Object labels',
  'Press-E hints',
  'data-player-x',
  'data-player-y',
  'data-nearby-object',
  'data-active-dialogue',
  'data-dialogue-open',
  'data-label-display-mode="nearby-only-default"',
  'data-quest-stage',
  'data-quest-objective',
  'visit-workshop',
  'harvest-project-crops',
  'inspect-server-barn',
  'return-to-board',
  'complete',
  'data-journal-count',
  'data-harvest-count',
  'data-generated-assets="codex-image-sheets-and-game-sprites"',
  'PortfolioFarmGame',
  'game-sprites',
  'generated-sheets/farmhouse-interior-room.png',
  'generated-sheets/developer-farm-map.png',
  'generated-sprites/character',
  'generated-sprites/character-walk',
  'developer-farmer-character-sheet.png',
  'Press E',
  'tile-world',
  'interior-world',
  'dialogue-box',
  'is-collapsed',
  'Java',
  'Spring Boot',
  'React',
  'TypeScript',
  'PostgreSQL',
  'MyBatis',
  'AWS',
  'Linux',
  'AWP',
  'BIM',
  'xeokit',
  'XKT',
  'word-break: keep-all',
];

const forbiddenPublic = [
  'data-ui-pass="cozy-pixel-farm-portfolio"',
  'Cozy Pixel Farming Portfolio',
  'PixelPortfolioVillage',
  'farm-layout',
  'farm-panel',
  'landmark button',
  'cyberpunk-dev-city-portfolio',
  'Cyberpunk Dev City',
  'data-theme="cyberpunk"',
  'data-game-world="cyberpunk-dev-city"',
  'PortfolioGame3D',
  'createHoverRover',
  'addNeonCity',
  'NEON STACK GARAGE',
  'CAREER MAINFRAME',
  'BIM GRID YARD',
  'SIGNAL GATE',
  'cyan/magenta',
  'portfolio-hero-gpt.webp',
  'Stardew Valley Wiki',
  'className="game-hud"',
  'className="game-layout"',
  'className="quest-journal"',
  'hud-controls',
  'speech-bubble-layer',
];

const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required portfolio-inside-game markers: ${missing.join(', ')}`);
  process.exit(1);
}

const forbidden = forbiddenPublic.filter((item) => publicJoined.includes(item));
if (forbidden.length) {
  console.error(`Forbidden public/rejected markers found: ${forbidden.join(', ')}`);
  process.exit(1);
}

const requiredFiles = [
  'src/components/PortfolioFarmGame.tsx',
  'src/game/farmLoop.ts',
  'scripts/generate-farm-loop-assets.py',
  'public/assets/cozy-farming-village-tileset-4x3.png',
  'public/assets/generated-sheets/farmhouse-interior-room.png',
  'public/assets/generated-sheets/developer-farm-map.png',
  'public/assets/generated-sheets/developer-farmer-character-sheet.png',
  'public/assets/generated-sheets/developer-farmhouse-interior-sheet.png',
  'public/assets/pixellab/terrain/manifest.json',
  'public/assets/pixellab/terrain/grass-path-flat/tileset.png',
  'public/assets/pixellab/terrain/grass-path-flat/metadata.json',
  'public/assets/pixellab/terrain/grass-soil-flat-v2/tileset.png',
  'public/assets/pixellab/terrain/grass-soil-flat-v2/metadata.json',
  'public/assets/sprite-matte-cleanup.json',
  'public/assets/game-sprites/manifest.json',
  'public/assets/game-sprites/sprite-18.png',
  'public/assets/game-sprites/sprite-19.png',
  'public/assets/game-sprites/sprite-24.png',
  'public/assets/game-sprites/sprite-51.png',
  'public/assets/generated-sprites/character/manifest.json',
  'public/assets/generated-sprites/character/sprite-10.png',
  'public/assets/generated-sprites/character/sprite-11.png',
  'public/assets/generated-sprites/character/sprite-12.png',
  'public/assets/generated-sprites/character/sprite-13.png',
  'public/assets/generated-sprites/character/sprite-30.png',
  'public/assets/generated-sprites/character/sprite-31.png',
  'public/assets/generated-sprites/character/sprite-32.png',
  'public/assets/generated-sprites/character/sprite-33.png',
  'public/assets/generated-sprites/character/sprite-34.png',
  'public/assets/generated-sprites/character/sprite-35.png',
  'public/assets/generated-sprites/character/sprite-36.png',
  'public/assets/generated-sprites/character/sprite-37.png',
  'public/assets/generated-sprites/character/sprite-43.png',
  'public/assets/generated-sprites/character/sprite-44.png',
  'public/assets/generated-sprites/character/sprite-45.png',
  'public/assets/generated-sprites/character/sprite-46.png',
  'public/assets/generated-sprites/character-walk/manifest.json',
  'public/assets/generated-sprites/character-walk/down-0.png',
  'public/assets/generated-sprites/character-walk/down-1.png',
  'public/assets/generated-sprites/character-walk/down-2.png',
  'public/assets/generated-sprites/character-walk/down-3.png',
  'public/assets/generated-sprites/character-walk/left-0.png',
  'public/assets/generated-sprites/character-walk/left-1.png',
  'public/assets/generated-sprites/character-walk/left-2.png',
  'public/assets/generated-sprites/character-walk/left-3.png',
  'public/assets/generated-sprites/character-walk/right-0.png',
  'public/assets/generated-sprites/character-walk/right-1.png',
  'public/assets/generated-sprites/character-walk/right-2.png',
  'public/assets/generated-sprites/character-walk/right-3.png',
  'public/assets/generated-sprites/character-walk/up-0.png',
  'public/assets/generated-sprites/character-walk/up-1.png',
  'public/assets/generated-sprites/character-walk/up-2.png',
  'public/assets/generated-sprites/character-walk/up-3.png',
  'public/assets/farm-loop/manifest.json',
  'public/assets/farm-loop/ground/untilled.png',
  'public/assets/farm-loop/ground/tilled.png',
  'public/assets/farm-loop/ground/watered.png',
  'public/assets/farm-loop/tools/hoe.png',
  'public/assets/farm-loop/tools/seeds.png',
  'public/assets/farm-loop/tools/watering-can.png',
  'public/assets/farm-loop/crops/frontend/planted.png',
  'public/assets/farm-loop/crops/frontend/watered.png',
  'public/assets/farm-loop/crops/frontend/growing-1.png',
  'public/assets/farm-loop/crops/frontend/growing-2.png',
  'public/assets/farm-loop/crops/frontend/ready.png',
  'public/assets/farm-loop/crops/backend/planted.png',
  'public/assets/farm-loop/crops/backend/watered.png',
  'public/assets/farm-loop/crops/backend/growing-1.png',
  'public/assets/farm-loop/crops/backend/growing-2.png',
  'public/assets/farm-loop/crops/backend/ready.png',
  'public/assets/farm-loop/crops/bim/planted.png',
  'public/assets/farm-loop/crops/bim/watered.png',
  'public/assets/farm-loop/crops/bim/growing-1.png',
  'public/assets/farm-loop/crops/bim/growing-2.png',
  'public/assets/farm-loop/crops/bim/ready.png',
];
const missingFiles = requiredFiles.filter((path) => !existsSync(path));
if (missingFiles.length) {
  console.error(`Missing required generated game sprite files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const rejectedFiles = [
  'src/components/PortfolioGame3D.tsx',
  'src/components/PixelPortfolioVillage.tsx',
  'public/assets/portfolio-hero-gpt.webp',
  'src/components/PortfolioDoodle.tsx',
  'src/components/TechScene3D.tsx',
];
const leftovers = rejectedFiles.filter((path) => existsSync(path));
if (leftovers.length) {
  console.error(`Rejected legacy files still exist: ${leftovers.join(', ')}`);
  process.exit(1);
}

const matteManifest = JSON.parse(readFileSync('public/assets/sprite-matte-cleanup.json', 'utf8'));
const matteEntries = Object.entries(matteManifest.targets ?? {});
if (matteEntries.length !== 25) {
  console.error(`Expected 25 cleaned runtime sprite entries, found ${matteEntries.length}`);
  process.exit(1);
}

const staleMatteEntries = matteEntries.filter(([relativePath, entry]) => {
  const assetPath = `public/assets/${relativePath}`;
  if (!existsSync(assetPath)) return true;
  const digest = createHash('sha256').update(readFileSync(assetPath)).digest('hex');
  return digest !== entry.sha256;
});

if (staleMatteEntries.length) {
  console.error(`Runtime sprite matte cleanup is stale: ${staleMatteEntries.map(([path]) => path).join(', ')}`);
  process.exit(1);
}

function readPngSize(path) {
  const png = readFileSync(path);
  const signature = png.subarray(1, 4).toString('ascii');
  if (signature !== 'PNG') {
    throw new Error(`${path} is not a PNG image`);
  }
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

const displayImageSizes = [
  ['public/assets/generated-sheets/developer-farm-map.png', 512, 352],
  ['public/assets/generated-sheets/farmhouse-interior-room.png', 384, 256],
];

const wrongDisplayImageSizes = displayImageSizes
  .map(([path, width, height]) => ({ path, width, height, actual: readPngSize(path) }))
  .filter(({ width, height, actual }) => actual.width !== width || actual.height !== height);

if (wrongDisplayImageSizes.length) {
  const details = wrongDisplayImageSizes
    .map(({ path, width, height, actual }) => `${path} expected ${width}x${height}, got ${actual.width}x${actual.height}`)
    .join('; ');
  console.error(`Display game image resolution is too large: ${details}`);
  process.exit(1);
}

const terrainTilesetSizes = [
  ['public/assets/pixellab/terrain/grass-path-flat/tileset.png', 64, 64],
  ['public/assets/pixellab/terrain/grass-soil-flat-v2/tileset.png', 64, 64],
];

const wrongTerrainTilesetSizes = terrainTilesetSizes
  .map(([path, width, height]) => ({ path, width, height, actual: readPngSize(path) }))
  .filter(({ width, height, actual }) => actual.width !== width || actual.height !== height);

if (wrongTerrainTilesetSizes.length) {
  const details = wrongTerrainTilesetSizes
    .map(({ path, width, height, actual }) => `${path} expected ${width}x${height}, got ${actual.width}x${actual.height}`)
    .join('; ');
  console.error(`PixelLab terrain tileset dimensions changed: ${details}`);
  process.exit(1);
}

const farmLoopAssetPaths = requiredFiles.filter((path) => path.startsWith('public/assets/farm-loop/') && path.endsWith('.png'));
const wrongFarmLoopAssetSizes = farmLoopAssetPaths
  .map((path) => ({ path, actual: readPngSize(path) }))
  .filter(({ actual }) => actual.width !== 32 || actual.height !== 32);

if (wrongFarmLoopAssetSizes.length) {
  console.error(`Farm Loop assets must stay on a 32x32 logical canvas: ${wrongFarmLoopAssetSizes.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

const farmLoopManifest = JSON.parse(readFileSync('public/assets/farm-loop/manifest.json', 'utf8'));
if (
  farmLoopManifest.version !== 1
  || farmLoopManifest.logical_size !== 32
  || farmLoopManifest.crops?.length !== 3
  || farmLoopManifest.crop_stages?.length !== 5
  || farmLoopManifest.tools?.length !== 3
) {
  console.error('Farm Loop asset manifest is incomplete or incompatible');
  process.exit(1);
}

const terrainMetadataPaths = [
  'public/assets/pixellab/terrain/grass-path-flat/metadata.json',
  'public/assets/pixellab/terrain/grass-soil-flat-v2/metadata.json',
];
const terrainMetadata = terrainMetadataPaths.map((path) => ({
  path,
  data: JSON.parse(readFileSync(path, 'utf8')),
}));
const invalidTerrainMetadata = terrainMetadata.filter(({ data }) => (
  data.transition_size !== 0
  || data.tile_size?.width !== 16
  || data.tile_size?.height !== 16
  || data.tileset_data?.total_tiles !== 16
));

if (invalidTerrainMetadata.length) {
  console.error(`Invalid flat PixelLab Wang metadata: ${invalidTerrainMetadata.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

if (terrainMetadata[0].data.base_tile_ids?.lower !== terrainMetadata[1].data.base_tile_ids?.lower) {
  console.error('PixelLab terrain families must share the same grass base tile ID');
  process.exit(1);
}

const forbiddenWalkSources = [
  '/assets/generated-sprites/character/sprite-16.png',
  '/assets/generated-sprites/character/sprite-38.png',
];
const badWalkSources = forbiddenWalkSources.filter((item) => game.includes(item));
if (badWalkSources.length) {
  console.error(`Forbidden mixed-crop walking sprite sources found in game component: ${badWalkSources.join(', ')}`);
  process.exit(1);
}

const entityCount = (game.match(/id: '/g) || []).length;
if (entityCount < 7) {
  console.error(`Expected at least 7 interactable game entities, found ${entityCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${entityCount} interactable game entities, ${required.length} required markers, generated game sprites present, no rejected public markers`);
