import { existsSync, readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const game = readFileSync('src/components/PortfolioFarmGame.tsx', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const verify = readFileSync('VERIFY.md', 'utf8');
const referenceBoard = readFileSync('docs/design/reference-board.md', 'utf8');

const joined = `${app}\n${game}\n${css}\n${design}\n${readme}\n${verify}\n${referenceBoard}`;
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
  'playerWalkSprites',
  'data-current-scene',
  'data-layout-mode="full-screen-map-with-overlay-ui"',
  'data-topbar-visible="false"',
  'data-sidebar-visible="false"',
  'data-overlay-layer="dialogue-and-menu"',
  'data-settings-open',
  'data-settings-tab',
  'data-labels-visible',
  'data-hints-visible',
  'data-game-surface="full-screen-map"',
  'data-layer="game-overlay-ui"',
  'data-settings-toggle="gear"',
  'data-settings-window="game-menu"',
  'data-map-panel="portfolio-world-map"',
  'data-about-panel="portfolio-about"',
  'data-settings-panel="game-options"',
  'speech-bubble-layer',
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
  'data-journal-count',
  'data-harvest-count',
  'data-generated-assets="codex-image-sheets-and-game-sprites"',
  'PortfolioFarmGame',
  'game-sprites',
  'generated-sheets/farmhouse-interior-room.png',
  'generated-sprites/character',
  'developer-farmer-character-sheet.png',
  'Press E',
  'tile-world',
  'interior-world',
  'dialogue-box',
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
  'public/assets/cozy-farming-village-tileset-4x3.png',
  'public/assets/generated-sheets/farmhouse-interior-room.png',
  'public/assets/generated-sheets/developer-farmer-character-sheet.png',
  'public/assets/generated-sheets/developer-farmhouse-interior-sheet.png',
  'public/assets/game-sprites/manifest.json',
  'public/assets/game-sprites/sprite-18.png',
  'public/assets/game-sprites/sprite-19.png',
  'public/assets/game-sprites/sprite-24.png',
  'public/assets/game-sprites/sprite-51.png',
  'public/assets/generated-sprites/character/manifest.json',
  'public/assets/generated-sprites/character/sprite-11.png',
  'public/assets/generated-sprites/character/sprite-12.png',
  'public/assets/generated-sprites/character/sprite-13.png',
  'public/assets/generated-sprites/character/sprite-16.png',
  'public/assets/generated-sprites/character/sprite-31.png',
  'public/assets/generated-sprites/character/sprite-32.png',
  'public/assets/generated-sprites/character/sprite-33.png',
  'public/assets/generated-sprites/character/sprite-34.png',
  'public/assets/generated-sprites/character/sprite-35.png',
  'public/assets/generated-sprites/character/sprite-36.png',
  'public/assets/generated-sprites/character/sprite-37.png',
  'public/assets/generated-sprites/character/sprite-38.png',
  'public/assets/generated-sprites/character/sprite-43.png',
  'public/assets/generated-sprites/character/sprite-44.png',
  'public/assets/generated-sprites/character/sprite-45.png',
  'public/assets/generated-sprites/character/sprite-46.png',
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

const entityCount = (game.match(/id: '/g) || []).length;
if (entityCount < 7) {
  console.error(`Expected at least 7 interactable game entities, found ${entityCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${entityCount} interactable game entities, ${required.length} required markers, generated game sprites present, no rejected public markers`);
