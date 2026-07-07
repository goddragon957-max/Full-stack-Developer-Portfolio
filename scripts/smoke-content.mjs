import { existsSync, readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const village = readFileSync('src/components/PixelPortfolioVillage.tsx', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const pkg = readFileSync('package.json', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const verify = readFileSync('VERIFY.md', 'utf8');
const referenceBoard = readFileSync('docs/design/reference-board.md', 'utf8');

const joined = `${app}\n${village}\n${css}\n${pkg}\n${design}\n${readme}\n${verify}\n${referenceBoard}`;
const publicJoined = `${app}\n${village}\n${css}`;

const required = [
  'data-ui-pass="cozy-pixel-farm-portfolio"',
  'data-game-world="cozy-farming-village"',
  'data-active-zone',
  'data-player-zone',
  'PixelPortfolioVillage',
  'cozy-farming-village-tileset-4x3.png',
  'FARMHOUSE',
  'WORKSHOP',
  'MARKET',
  'BARN',
  'COMMUNITY BOARD',
  'MAILBOX',
  'Developer Farm',
  'Pretendard',
  'word-break: keep-all',
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
];

const forbiddenPublic = [
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
  'spline-dark-stack-portfolio',
  'bruno-inspired-drive-portfolio',
  'TechScene3D',
];

const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required cozy pixel farm markers: ${missing.join(', ')}`);
  process.exit(1);
}

const forbidden = forbiddenPublic.filter((item) => publicJoined.includes(item));
if (forbidden.length) {
  console.error(`Forbidden public/rejected markers found: ${forbidden.join(', ')}`);
  process.exit(1);
}

const removedFiles = [
  'src/components/PortfolioGame3D.tsx',
  'public/assets/portfolio-hero-gpt.webp',
  'src/components/PortfolioDoodle.tsx',
  'src/components/TechScene3D.tsx',
];
const leftovers = removedFiles.filter((path) => existsSync(path));
if (leftovers.length) {
  console.error(`Rejected legacy files still exist: ${leftovers.join(', ')}`);
  process.exit(1);
}

if (!existsSync('public/assets/cozy-farming-village-tileset-4x3.png')) {
  console.error('Missing generated pixel farming reference asset sheet');
  process.exit(1);
}

const landmarkButtonCount = (village.match(/className={`pixel-building/g) || []).length + (village.match(/<button/g) || []).length;
const zoneRecords = (village.match(/label: '/g) || []).length;
if (zoneRecords !== 6 || landmarkButtonCount < 1) {
  console.error(`Expected six portfolio zones and semantic landmark buttons, found ${zoneRecords} zones`);
  process.exit(1);
}

console.log(`content smoke passed: ${zoneRecords} cozy pixel farm zones, ${required.length} required markers, no rejected public markers`);
