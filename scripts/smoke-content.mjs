import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const data = readFileSync('src/data/portfolio.ts', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const contentMap = readFileSync('docs/content-map.md', 'utf8');
const heroCopy = readFileSync('docs/copy/hero.md', 'utf8');
const copyRefs = readFileSync('docs/copy/references.md', 'utf8');

const joined = `${app}\n${data}\n${css}\n${design}\n${contentMap}\n${heroCopy}\n${copyRefs}`;

const required = [
  'gianluca-clean-portfolio',
  'data-font="pretendard"',
  'Pretendard',
  '060703-resume',
  '이미 돌아가는 시스템을 읽고, 필요한 만큼 바꾸는 개발자입니다',
  'AI는 판단을 대신하지 않습니다',
  'PHP/CodeIgniter',
  'Java/Spring Boot',
  'Next.js/React',
  'AWP 업무 시스템 및 3D/BIM 뷰어',
  '문자 발송 서버 및 웹 서비스 운영',
  '앱 API 및 관리자 페이지 운영',
  '쇼핑몰/홈페이지/웹뷰 앱 유지보수',
  'AI-assisted Development Workflow',
  'xeokit',
  'XKT',
  'pgvector',
  'Codex',
  'MCP',
  'PortfolioDoodle',
  'word-break: keep-all',
  'Maggie Appleton',
  'Tom MacWright',
];

const forbiddenPublic = [
  'magic-resume-portfolio',
  'Marketing UI rebuild',
  '귀여운 척을 빼고',
  'Rauno card rhythm',
  '댕댕이는 실행하고',
  'Particles',
  'BorderBeam',
  'TechEngine3D',
  '누구에게 따뜻함',
  '따뜻한 개발자',
  '어린왕자',
  'mailto:cvb7412@naver.com',
  'hidden phone',
];

const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required clean portfolio markers: ${missing.join(', ')}`);
  process.exit(1);
}

const publicJoined = `${app}\n${data}`;
const forbidden = forbiddenPublic.filter((item) => publicJoined.includes(item));
if (forbidden.length) {
  console.error(`Forbidden public filler/private/effect markers found: ${forbidden.join(', ')}`);
  process.exit(1);
}

const experienceCount = (data.match(/id: '/g) || []).length;
if (experienceCount < 5) {
  console.error(`Expected at least 5 experience/capability records, found ${experienceCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${experienceCount} records, ${required.length} required markers, no forbidden public filler`);
