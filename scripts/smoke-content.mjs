import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const data = readFileSync('src/data/portfolio.ts', 'utf8');
const modeSwitch = readFileSync('src/components/ModeSwitch.tsx', 'utf8');
const mascots = readFileSync('src/components/Mascot.tsx', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');

const required = [
  'Loop Dog Lab',
  'MOM Voice / Nestory',
  'Dragon Trader Lab',
  'Search Router',
  'Prototype Factory',
  'Orbit Bloom',
  '댕댕이',
  '멍멍이',
  '/goal vs /ralph',
];

const joined = `${app}\n${data}\n${modeSwitch}\n${mascots}\n${css}`;
const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required portfolio markers: ${missing.join(', ')}`);
  process.exit(1);
}

const projectCount = (data.match(/id: '/g) || []).length;
if (projectCount < 10) {
  console.error(`Expected at least 10 projects, found ${projectCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${projectCount} projects, ${required.length} required markers`);
