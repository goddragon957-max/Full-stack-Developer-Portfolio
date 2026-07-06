import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const game = readFileSync('src/components/PortfolioGame3D.tsx', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const pkg = readFileSync('package.json', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const verify = readFileSync('VERIFY.md', 'utf8');
const referenceBoard = readFileSync('docs/design/reference-board.md', 'utf8');

const joined = `${app}\n${game}\n${css}\n${pkg}\n${design}\n${readme}\n${verify}\n${referenceBoard}`;

const required = [
  'cyberpunk-dev-city-portfolio',
  'data-font="pretendard"',
  'Pretendard',
  '060703-resume',
  'data-theme="cyberpunk"',
  'data-game-world="cyberpunk-dev-city"',
  'Cyberpunk Dev City drivable portfolio world',
  'PortfolioGame3D',
  'createHoverRover',
  'addNeonCity',
  'addCyberFloor',
  'addDataRails',
  'jumpToZone',
  'updateCar',
  'WASD / Arrow Keys',
  'Space = brake',
  'NEON STACK GARAGE',
  'CAREER MAINFRAME',
  'BIM GRID YARD',
  'SIGNAL GATE',
  'Hover Rover',
  'Neon Grid',
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
  'cyan/magenta',
];

const forbiddenPublic = [
  'spline-dark-stack-portfolio',
  'stack-first-portfolio',
  'gianluca-clean-portfolio',
  'bruno-inspired-drive-portfolio',
  'portfolio-hero-gpt.webp',
  'data-hero-image',
  'gpt-generated',
  'GPT-generated',
  'data-hero-3d',
  'TechScene3D',
  'magic-resume-portfolio',
  'Marketing UI rebuild',
  '귀여운 척을 빼고',
  'Rauno card rhythm',
  '댕댕이는 실행하고',
  '누구에게 따뜻함',
  '따뜻한 개발자',
  '어린왕자',
  'AI는 판단을 대신하지 않습니다',
  'mailto:cvb7412@naver.com',
  'hidden phone',
];

const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required Cyberpunk Dev City markers: ${missing.join(', ')}`);
  process.exit(1);
}

const publicJoined = `${app}\n${game}`;
const forbidden = forbiddenPublic.filter((item) => publicJoined.includes(item));
if (forbidden.length) {
  console.error(`Forbidden public/rejected markers found: ${forbidden.join(', ')}`);
  process.exit(1);
}

const removedFiles = [
  'public/assets/portfolio-hero-gpt.webp',
  'src/components/PortfolioDoodle.tsx',
  'src/components/TechScene3D.tsx',
];
const leftovers = removedFiles.filter((path) => existsSync(path));
if (leftovers.length) {
  console.error(`Rejected legacy files still exist: ${leftovers.join(', ')}`);
  process.exit(1);
}

const zoneCount = (game.match(/title: '/g) || []).length;
if (zoneCount < 4) {
  console.error(`Expected at least 4 portfolio zones, found ${zoneCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${zoneCount} zone/title records, ${required.length} Cyberpunk Dev City markers, no rejected legacy markers`);
