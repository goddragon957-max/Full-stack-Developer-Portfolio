import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const app = readFileSync('src/App.tsx', 'utf8');
const game = readFileSync('src/components/MossbellFarmGame.tsx', 'utf8');
const farmLoop = readFileSync('src/game/farmLoop.ts', 'utf8');
const villagePulse = readFileSync('src/game/villagePulse.ts', 'utf8');
const villageLife = existsSync('src/game/villageLife.ts') ? readFileSync('src/game/villageLife.ts', 'utf8') : '';
const openWorld = existsSync('src/game/openWorld.ts') ? readFileSync('src/game/openWorld.ts', 'utf8') : '';
const foragingLoop = existsSync('src/game/foragingLoop.ts') ? readFileSync('src/game/foragingLoop.ts', 'utf8') : '';
const animationCatalog = existsSync('src/game/animationCatalog.ts') ? readFileSync('src/game/animationCatalog.ts', 'utf8') : '';
const audioSystem = existsSync('src/game/audioSystem.ts') ? readFileSync('src/game/audioSystem.ts', 'utf8') : '';
const css = readFileSync('src/styles.css', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const verify = readFileSync('VERIFY.md', 'utf8');
const referenceBoard = readFileSync('docs/design/reference-board.md', 'utf8');

const joined = `${app}\n${game}\n${farmLoop}\n${villagePulse}\n${villageLife}\n${openWorld}\n${foragingLoop}\n${animationCatalog}\n${audioSystem}\n${css}\n${design}\n${readme}\n${verify}\n${referenceBoard}`;
const publicJoined = `${app}\n${game}\n${css}`;

const required = [
  'data-ui-pass="mossbell-farm-game"',
  'data-game-world="playable-cozy-farm-rpg"',
  'data-screen-mode="fullscreen-game-shell"',
  'data-game-phase',
  'data-intro-title',
  'data-typed-title',
  'data-player-facing',
  'data-player-walking',
  'data-player-frame',
  'data-movement-mode="pressed-key-raf-loop"',
  'MOSSBELL FARM',
  'intro-screen',
  'pixel-title',
  'START GAME',
  'requestAnimationFrame',
  'pressedDirectionsRef',
  'PLAYER_WALK_SPRITES',
  'data-sprite-normalization="bottom-centered-transparent-canvas"',
  'data-walk-cycle="coherent-generated-frames"',
  'data-world-scale-mode="pixel-locked-fit"',
  'data-mobile-fit-mode="camera-fullscreen-safe-area"',
  'data-camera-mode="player-centered-fullscreen"',
  'data-map-grid="32x22"',
  'data-collision-mode="entity-and-water-bounds"',
  'data-depth-sorting="y-axis-feet"',
  'data-right-inventory-bar="persistent"',
  '--inventory-rail-width',
  'data-map-renderer="single-generated-map-image"',
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
  'data-village-pulse="v1"',
  'data-time-mode',
  'data-day-phase',
  'data-village-clock',
  'data-time-mode-control="auto-day-night"',
  'data-celebration',
  'data-fireworks-layer="milestone-celebration"',
  'data-harvest-combo',
  'data-harvest-feedback="combo-pop"',
  'data-npc-count="5"',
  'villageKeeper',
  'FIRST HARVEST',
  'QUEST COMPLETE',
  'data-fishing-loop="v1"',
  'data-fishing-state',
  'data-fishing-spot-count',
  'data-fishing-water="pond"',
  'data-selected-game-tool',
  'data-fishing-catch-total',
  'data-fishing-discovered',
  'data-fishing-pool',
  'data-fishing-spot-id',
  'data-fishing-feedback',
  'data-reset-fishing="fishing-state-only"',
  'fishing-rod',
  'Digit4',
  'Digit5',
  'casting',
  'waiting',
  'bite',
  'success',
  'escaped',
  'bluegill',
  'carp',
  'perch',
  'koi',
  'moonfin',
  'data-village-life="v2"',
  'data-village-day',
  'data-village-life-storage="localStorage"',
  'data-village-life-storage-key',
  'data-life-npc-count="2"',
  'data-life-npc-id',
  'data-life-npc-schedule',
  'data-ranch-animal-count="5"',
  'data-animal-id',
  'data-animal-species',
  'data-animal-status',
  'data-ranch-product-total',
  'data-perfect-care-streak',
  'data-reset-ranch="ranch-state-only"',
  'data-farm-growth="v2"',
  'data-farm-crop-count="6"',
  'data-crop-quality',
  'data-inventory-tab',
  'data-open-world="v1"',
  'data-current-region',
  'data-world-region-count="4"',
  'data-world-graph="explicit"',
  'data-region-transition',
  'data-region-discovered',
  'data-fast-travel',
  'data-foraging-loop="v1"',
  'data-foraging-storage="localStorage"',
  'data-foraging-storage-key',
  'data-forage-node-count="10"',
  'data-forage-inventory-total',
  'data-forage-quest',
  'data-mine-quest',
  'data-inventory-tab-control="bag-farm-ranch-forage"',
  'data-open-world-storage-key',
  'data-fishing-spot-total="6"',
  'data-open-world-npc-count="2"',
  'data-art-remaster="v1"',
  'data-visual-source="gpt-image"',
  'data-animation-catalog="directional-gpt-sprites"',
  'PLAYER_ACTION_SPRITES',
  'NPC_PORTRAITS',
  'data-player-action',
  'data-dialogue-portrait',
  'emptyLookEntity',
  'data-ambient-layer="gpt-pixel-effects"',
  'data-audio-system="region-crossfade"',
  'data-music-muted',
  'data-music-volume',
  'data-audio-track',
  'AREA DISCOVERED',
  'WORLD EXPLORER',
  'whisper-forest',
  'river-coast',
  'mine-foothill',
  'portfolio-village-life-v2',
  'tomato',
  'corn',
  'pumpkin',
  'normal',
  'silver',
  'gold',
  'chicken-1',
  'chicken-2',
  'chicken-3',
  'cow-1',
  'cow-2',
  'egg',
  'milk',
  'golden-egg',
  'PERFECT CARE',
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
  'data-map-panel="mossbell-world-map"',
  'data-journal-panel="mossbell-journal"',
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
  'data-generated-assets="gpt-image-remaster-packs"',
  'MossbellFarmGame',
  'game-sprites',
  'generated-sheets/farmhouse-interior-room.png',
  'generated-sprites/character',
  'generated-sprites/character-walk',
  'developer-farmer-character-sheet.png',
  'Press E',
  'tile-world',
  'interior-world',
  'dialogue-box',
  'is-collapsed',
  'data-current-interior',
  'data-interior-count',
  'data-interior-storage-key',
  'hanaCottage',
  'junCottage',
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
  'PIXEL PORTFOLIO RPG',
  'TEXT RESUME',
  'data-resume-overlay=',
  'data-about-panel="portfolio-about"',
  'cvb7412@naver.com',
  '엄신용',
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
  'src/components/MossbellFarmGame.tsx',
  'src/game/farmLoop.ts',
  'src/game/villagePulse.ts',
  'src/game/fishingLoop.ts',
  'src/game/villageLife.ts',
  'src/game/openWorld.ts',
  'src/game/foragingLoop.ts',
  'src/game/animationCatalog.ts',
  'src/game/audioSystem.ts',
  'src/game/interiorWorld.ts',
  'scripts/process-gpt-interiors.py',
  'scripts/process-gpt-cottages.py',
  'scripts/test-open-world.mjs',
  'scripts/test-interior-world.mjs',
  'scripts/process-gpt-remaster-assets.py',
  'scripts/assemble-gpt-remaster-maps.py',
  'scripts/generate-farm-loop-assets.py',
  'scripts/generate-village-pulse-assets.py',
  'scripts/generate-fishing-assets.py',
  'scripts/generate-village-life-assets.py',
  'scripts/generate-open-world-assets.py',
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
  'public/assets/village-pulse/manifest.json',
  'public/assets/village-pulse/npc/village-keeper/down-0.png',
  'public/assets/village-pulse/npc/village-keeper/down-1.png',
  'public/assets/village-pulse/npc/village-keeper/down-2.png',
  'public/assets/village-pulse/npc/village-keeper/down-3.png',
  'public/assets/village-pulse/npc/village-keeper/left-0.png',
  'public/assets/village-pulse/npc/village-keeper/left-1.png',
  'public/assets/village-pulse/npc/village-keeper/left-2.png',
  'public/assets/village-pulse/npc/village-keeper/left-3.png',
  'public/assets/village-pulse/npc/village-keeper/right-0.png',
  'public/assets/village-pulse/npc/village-keeper/right-1.png',
  'public/assets/village-pulse/npc/village-keeper/right-2.png',
  'public/assets/village-pulse/npc/village-keeper/right-3.png',
  'public/assets/village-pulse/npc/village-keeper/up-0.png',
  'public/assets/village-pulse/npc/village-keeper/up-1.png',
  'public/assets/village-pulse/npc/village-keeper/up-2.png',
  'public/assets/village-pulse/npc/village-keeper/up-3.png',
  'public/assets/fishing/manifest.json',
  'public/assets/fishing/tools/fishing-rod.png',
  'public/assets/fishing/water/ripple-0.png',
  'public/assets/fishing/water/ripple-1.png',
  'public/assets/fishing/water/bobber.png',
  'public/assets/fishing/fish/bluegill.png',
  'public/assets/fishing/fish/carp.png',
  'public/assets/fishing/fish/perch.png',
  'public/assets/fishing/fish/koi.png',
  'public/assets/fishing/fish/moonfin.png',
  'public/assets/village-life-v2/manifest.json',
  'public/assets/village-life-v2/npcs/farmer-0.png',
  'public/assets/village-life-v2/npcs/farmer-1.png',
  'public/assets/village-life-v2/npcs/rancher-0.png',
  'public/assets/village-life-v2/npcs/rancher-1.png',
  'public/assets/village-life-v2/animals/chicken-0.png',
  'public/assets/village-life-v2/animals/chicken-1.png',
  'public/assets/village-life-v2/animals/chicken-sleeping.png',
  'public/assets/village-life-v2/animals/cow-0.png',
  'public/assets/village-life-v2/animals/cow-1.png',
  'public/assets/village-life-v2/animals/cow-sleeping.png',
  'public/assets/village-life-v2/products/egg.png',
  'public/assets/village-life-v2/products/milk.png',
  'public/assets/village-life-v2/products/golden-egg.png',
  'public/assets/village-life-v2/crops/tomato/planted.png',
  'public/assets/village-life-v2/crops/tomato/watered.png',
  'public/assets/village-life-v2/crops/tomato/growing-1.png',
  'public/assets/village-life-v2/crops/tomato/growing-2.png',
  'public/assets/village-life-v2/crops/tomato/ready.png',
  'public/assets/village-life-v2/crops/corn/planted.png',
  'public/assets/village-life-v2/crops/corn/watered.png',
  'public/assets/village-life-v2/crops/corn/growing-1.png',
  'public/assets/village-life-v2/crops/corn/growing-2.png',
  'public/assets/village-life-v2/crops/corn/ready.png',
  'public/assets/village-life-v2/crops/pumpkin/planted.png',
  'public/assets/village-life-v2/crops/pumpkin/watered.png',
  'public/assets/village-life-v2/crops/pumpkin/growing-1.png',
  'public/assets/village-life-v2/crops/pumpkin/growing-2.png',
  'public/assets/village-life-v2/crops/pumpkin/ready.png',
  'public/assets/open-world-v1/manifest.json',
  'public/assets/open-world-v1/maps/whisper-forest.png',
  'public/assets/open-world-v1/maps/river-coast.png',
  'public/assets/open-world-v1/maps/mine-foothill.png',
  'public/assets/open-world-v1/npcs/forest-guide-0.png',
  'public/assets/open-world-v1/npcs/forest-guide-1.png',
  'public/assets/open-world-v1/npcs/mine-keeper-0.png',
  'public/assets/open-world-v1/npcs/mine-keeper-1.png',
  'public/assets/open-world-v1/items/mushroom.png',
  'public/assets/open-world-v1/items/herb.png',
  'public/assets/open-world-v1/items/wild-berry.png',
  'public/assets/open-world-v1/items/fern.png',
  'public/assets/open-world-v1/items/moon-bloom.png',
  'public/assets/open-world-v1/items/stone.png',
  'public/assets/open-world-v1/items/copper-ore.png',
  'public/assets/open-world-v1/items/iron-ore.png',
  'public/assets/open-world-v1/items/star-crystal.png',
  'public/assets/open-world-v1/fish/river-trout.png',
  'public/assets/open-world-v1/fish/silver-dace.png',
  'public/assets/open-world-v1/fish/night-eel.png',
  'public/assets/open-world-v1/fish/shore-sardine.png',
  'public/assets/open-world-v1/fish/coral-bream.png',
  'public/assets/open-world-v1/fish/tide-ray.png',
  'public/assets/open-world-v1/props/travel-post.png',
  'public/assets/open-world-v1/tools/pickaxe.png',
  'public/assets/art-remaster-v1/manifest.json',
  'public/assets/art-remaster-v1/style/style-anchor.png',
  'public/assets/art-remaster-v1/characters/player/down-0.png',
  'public/assets/art-remaster-v1/characters/player/left-0.png',
  'public/assets/art-remaster-v1/characters/player/right-0.png',
  'public/assets/art-remaster-v1/characters/player/up-0.png',
  'public/assets/art-remaster-v1/characters/player/actions/hoe-0.png',
  'public/assets/art-remaster-v1/characters/player/actions/water-1.png',
  'public/assets/art-remaster-v1/characters/player/actions/pickaxe-2.png',
  'public/assets/art-remaster-v1/characters/player/actions/fish-cast-1.png',
  'public/assets/art-remaster-v1/characters/player/actions/fish-reel-1.png',
  'public/assets/art-remaster-v1/npcs/lumi/portrait-neutral.png',
  'public/assets/art-remaster-v1/npcs/hana/portrait-happy.png',
  'public/assets/art-remaster-v1/npcs/jun/portrait-concerned.png',
  'public/assets/art-remaster-v1/npcs/sera/portrait-neutral.png',
  'public/assets/art-remaster-v1/npcs/doyun/portrait-happy.png',
  'public/assets/art-remaster-v1/maps/farm-village.png',
  'public/assets/art-remaster-v1/maps/whisper-forest.png',
  'public/assets/art-remaster-v1/maps/river-coast.png',
  'public/assets/art-remaster-v1/maps/mine-foothill.png',
  'public/assets/art-remaster-v1/maps/farmhouse-interior.png',
  'public/assets/art-remaster-v1/maps/shop-interior.png',
  'public/assets/art-remaster-v1/maps/barn-interior.png',
  'public/assets/art-remaster-v1/maps/hana-cottage-interior.png',
  'public/assets/art-remaster-v1/maps/jun-cottage-interior.png',
  'public/assets/art-remaster-v1/interiors/manifest.json',
  'public/assets/art-remaster-v1/buildings/cottages-manifest.json',
  'public/assets/art-remaster-v1/props/buildings/hana-cottage.png',
  'public/assets/art-remaster-v1/props/buildings/jun-cottage.png',
  'public/assets/audio/manifest.json',
];

if (game.includes('...currentEntities[0]')) {
  console.error('Empty-space dialogue must not reuse the first regional entity ID');
  process.exit(1);
}
const missingFiles = requiredFiles.filter((path) => !existsSync(path));
if (missingFiles.length) {
  console.error(`Missing required generated game sprite files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const rejectedFiles = [
  'src/components/PortfolioFarmGame.tsx',
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

const villageLifeManifestPath = 'public/assets/village-life-v2/manifest.json';
if (existsSync(villageLifeManifestPath)) {
  const villageLifeManifest = JSON.parse(readFileSync(villageLifeManifestPath, 'utf8'));
  const lifePngPaths = requiredFiles.filter((path) => path.startsWith('public/assets/village-life-v2/') && path.endsWith('.png'));
  const wrongLifeAssetSizes = lifePngPaths
    .map((path) => ({ path, actual: readPngSize(path) }))
    .filter(({ path, actual }) => path.includes('/npcs/')
      ? actual.width !== 48 || actual.height !== 64
      : actual.width !== 32 || actual.height !== 32);

  if (wrongLifeAssetSizes.length) {
    console.error(`Village Life assets use incompatible canvases: ${wrongLifeAssetSizes.map(({ path }) => path).join(', ')}`);
    process.exit(1);
  }

  const instances = villageLifeManifest.animal_instances ?? [];
  const chickenCount = instances.filter((animal) => animal.species === 'chicken').length;
  const cowCount = instances.filter((animal) => animal.species === 'cow').length;
  if (
    villageLifeManifest.version !== 1
    || villageLifeManifest.npcs?.length !== 2
    || instances.length !== 5
    || chickenCount !== 3
    || cowCount !== 2
    || villageLifeManifest.crops?.length !== 3
    || villageLifeManifest.crop_stages?.length !== 5
    || villageLifeManifest.products?.length !== 3
  ) {
    console.error('Village & Farm Life v2 asset manifest is incomplete or incompatible');
    process.exit(1);
  }
}

const openWorldManifest = JSON.parse(readFileSync('public/assets/open-world-v1/manifest.json', 'utf8'));
if (
  openWorldManifest.version !== 1
  || openWorldManifest.map_size?.width !== 512
  || openWorldManifest.map_size?.height !== 352
  || openWorldManifest.logical_tile_size !== 16
  || openWorldManifest.regions?.length !== 3
  || openWorldManifest.npcs?.length !== 2
  || openWorldManifest.forage_items?.length !== 5
  || openWorldManifest.mine_items?.length !== 4
  || openWorldManifest.fish?.length !== 6
) {
  console.error('Pixel Farm Mini Open World v1 asset manifest is incomplete or incompatible');
  process.exit(1);
}

const remasterManifest = JSON.parse(readFileSync('public/assets/art-remaster-v1/manifest.json', 'utf8'));
const remasterActionAssets = remasterManifest.assets?.filter((asset) => asset.path.startsWith('characters/player/actions/')) ?? [];
const remasterPortraitAssets = remasterManifest.assets?.filter((asset) => /npcs\/(lumi|hana|jun|sera|doyun)\/portrait-/.test(asset.path)) ?? [];
if (
  remasterManifest.version !== 1
  || remasterManifest.visual_source !== 'gpt-image'
  || remasterManifest.logical_tile_size !== 16
  || remasterManifest.runtime_map_size?.width !== 512
  || remasterManifest.runtime_map_size?.height !== 352
  || remasterManifest.sources?.length !== 19
  || remasterManifest.assets?.length !== 278
  || remasterManifest.maps?.length !== 4
  || remasterManifest.interiors?.length !== 5
  || remasterManifest.audio?.length !== 5
  || remasterManifest.audio.some((track) => !track.present || !track.sha256)
  || remasterActionAssets.length !== 15
  || remasterPortraitAssets.length !== 15
  || !remasterManifest.validation?.all_sprite_alpha
  || !remasterManifest.validation?.all_sprite_transparent_corners
) {
  console.error('GPT Image art remaster manifest is incomplete or incompatible');
  process.exit(1);
}

if (remasterManifest.sources.some((source) => source.generator !== 'OpenAI GPT Image built-in tool')) {
  console.error('Every remaster source pack must record OpenAI GPT Image provenance');
  process.exit(1);
}

const wrongRemasterMaps = remasterManifest.maps
  .map((map) => ({ path: `public/assets/art-remaster-v1/${map.path}`, actual: readPngSize(`public/assets/art-remaster-v1/${map.path}`) }))
  .filter(({ actual }) => actual.width !== 512 || actual.height !== 352);
if (wrongRemasterMaps.length) {
  console.error(`Remaster region maps must stay 512x352: ${wrongRemasterMaps.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

const interiorManifest = JSON.parse(readFileSync('public/assets/art-remaster-v1/interiors/manifest.json', 'utf8'));
const invalidInteriors = interiorManifest.interiors?.filter((interior) => {
  const runtimePath = `public/assets/art-remaster-v1/${interior.runtime}`;
  const sourcePath = `public/assets/art-remaster-v1/${interior.source}`;
  if (!existsSync(runtimePath) || !existsSync(sourcePath)) return true;
  const size = readPngSize(runtimePath);
  const digest = createHash('sha256').update(readFileSync(runtimePath)).digest('hex');
  return interior.generator !== 'OpenAI GPT Image built-in tool'
    || size.width !== 384
    || size.height !== 256
    || digest !== interior.runtime_sha256;
}) ?? [];
if (interiorManifest.visual_source !== 'gpt-image' || interiorManifest.interiors?.length !== 5 || invalidInteriors.length) {
  console.error('Five GPT Image building interiors must exist at 384x256 with current hashes');
  process.exit(1);
}

const cottageManifest = JSON.parse(readFileSync('public/assets/art-remaster-v1/buildings/cottages-manifest.json', 'utf8'));
const invalidCottages = cottageManifest.cottages?.filter((cottage) => {
  const runtimePath = `public/assets/art-remaster-v1/props/buildings/${cottage.runtime}`;
  const size = existsSync(runtimePath) ? readPngSize(runtimePath) : { width: 0, height: 0 };
  const digest = existsSync(runtimePath) ? createHash('sha256').update(readFileSync(runtimePath)).digest('hex') : '';
  return cottage.generator !== 'OpenAI GPT Image built-in tool'
    || !cottage.alpha
    || !cottage.binary_alpha
    || size.width !== 128
    || size.height !== 128
    || digest !== cottage.runtime_sha256;
}) ?? [];
if (cottageManifest.visual_source !== 'gpt-image' || cottageManifest.cottages?.length !== 2 || invalidCottages.length) {
  console.error('Hana and Jun cottages must be current 128x128 transparent GPT Image sprites');
  process.exit(1);
}

const audioManifest = JSON.parse(readFileSync('public/assets/audio/manifest.json', 'utf8'));
const expectedAudioTrackIds = ['village-day', 'forest-day', 'coast-day', 'mine-day', 'night'];
const invalidAudioTracks = audioManifest.tracks?.filter((track) => {
  const path = `public/assets/audio/${track.file}`;
  const sourcePath = `${audioManifest.source_directory}/${track.source}`;
  if (!track.present || !existsSync(path) || !existsSync(sourcePath)) return true;
  const bytes = readFileSync(path);
  const hasMp3Header = bytes.subarray(0, 3).toString('ascii') === 'ID3'
    || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  return !hasMp3Header || bytes.length < 100_000 || sha256 !== track.sha256;
}) ?? [];
if (
  audioManifest.version !== 1
  || audioManifest.crossfade_ms < 800
  || audioManifest.crossfade_ms > 1200
  || audioManifest.tracks?.length !== 5
  || expectedAudioTrackIds.some((id) => !audioManifest.tracks.some((track) => track.id === id))
  || invalidAudioTracks.length > 0
  || (audioSystem.match(/available: true/g) ?? []).length !== 5
) {
  console.error('Audio manifest, source files, MP3 outputs, hashes, and runtime availability must agree for all five tracks');
  process.exit(1);
}

const runtimeVisualCode = `${game}\n${farmLoop}\n${villageLife}\n${openWorld}\n${foragingLoop}\n${animationCatalog}`;
const legacyRuntimeVisualRoots = [
  '/assets/farm-loop/',
  '/assets/village-life-v2/',
  '/assets/open-world-v1/',
  '/assets/fishing/',
  '/assets/village-pulse/',
  '/assets/generated-sprites/',
  '/assets/generated-sheets/',
  '/assets/game-sprites/',
  '/assets/pixellab/',
];
const legacyRuntimeVisuals = legacyRuntimeVisualRoots.filter((root) => runtimeVisualCode.includes(root));
if (legacyRuntimeVisuals.length) {
  console.error(`Legacy or code-generated runtime art references remain: ${legacyRuntimeVisuals.join(', ')}`);
  process.exit(1);
}

const openWorldPngPaths = requiredFiles.filter((path) => path.startsWith('public/assets/open-world-v1/') && path.endsWith('.png'));
const wrongOpenWorldAssetSizes = openWorldPngPaths
  .map((path) => ({ path, actual: readPngSize(path) }))
  .filter(({ path, actual }) => {
    if (path.includes('/maps/')) return actual.width !== 512 || actual.height !== 352;
    if (path.includes('/npcs/')) return actual.width !== 48 || actual.height !== 64;
    return actual.width !== 32 || actual.height !== 32;
  });

if (wrongOpenWorldAssetSizes.length) {
  console.error(`Open World assets use incompatible canvases: ${wrongOpenWorldAssetSizes.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

const villagePulseAssetPaths = requiredFiles.filter((path) => path.startsWith('public/assets/village-pulse/npc/') && path.endsWith('.png'));
const wrongVillagePulseAssetSizes = villagePulseAssetPaths
  .map((path) => ({ path, actual: readPngSize(path) }))
  .filter(({ actual }) => actual.width !== 118 || actual.height !== 181);

if (wrongVillagePulseAssetSizes.length) {
  console.error(`Village NPC frames must stay on the normalized 118x181 canvas: ${wrongVillagePulseAssetSizes.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

const villagePulseManifest = JSON.parse(readFileSync('public/assets/village-pulse/manifest.json', 'utf8'));
if (
  villagePulseManifest.version !== 1
  || villagePulseManifest.npc?.id !== 'village-keeper'
  || villagePulseManifest.npc?.frames?.length !== 16
  || villagePulseManifest.npc?.canvas?.width !== 118
  || villagePulseManifest.npc?.canvas?.height !== 181
) {
  console.error('Village Pulse asset manifest is incomplete or incompatible');
  process.exit(1);
}

const fishingAssetPaths = requiredFiles.filter((path) => path.startsWith('public/assets/fishing/') && path.endsWith('.png'));
const wrongFishingAssetSizes = fishingAssetPaths
  .map((path) => ({ path, actual: readPngSize(path) }))
  .filter(({ actual }) => actual.width !== 32 || actual.height !== 32);

if (wrongFishingAssetSizes.length) {
  console.error(`Fishing assets must stay on a 32x32 logical canvas: ${wrongFishingAssetSizes.map(({ path }) => path).join(', ')}`);
  process.exit(1);
}

const fishingManifest = JSON.parse(readFileSync('public/assets/fishing/manifest.json', 'utf8'));
if (
  fishingManifest.version !== 1
  || fishingManifest.logical_size !== 32
  || fishingManifest.fish?.length !== 5
  || fishingManifest.water_frames?.length !== 2
  || fishingManifest.fishing_spots?.length !== 2
  || fishingManifest.pond_cells?.length < 12
) {
  console.error('Fishing Pond asset manifest is incomplete or incompatible');
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
