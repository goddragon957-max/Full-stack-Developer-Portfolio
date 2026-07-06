import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const data = readFileSync('src/data/portfolio.ts', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const techScene = readFileSync('src/components/TechScene3D.tsx', 'utf8');
const pkg = readFileSync('package.json', 'utf8');
const design = readFileSync('DESIGN.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');

const joined = `${app}\n${data}\n${css}\n${techScene}\n${pkg}\n${design}\n${readme}`;

const required = [
  'spline-dark-stack-portfolio',
  'data-font="pretendard"',
  'Pretendard',
  '060703-resume',
  'data-hero-3d="spline-inspired"',
  'Spline inspired 3D stack scene',
  'three',
  'WebGLRenderer',
  '주요 스택',
  'Java/Spring Boot와 React/TypeScript로 웹 서비스를 개발합니다',
  'PHP/CodeIgniter',
  'Java',
  'Spring Boot',
  'React',
  'TypeScript',
  'PostgreSQL',
  'MyBatis',
  'AWS EC2',
  'Linux',
  'AWP 업무 시스템 및 3D/BIM 뷰어',
  '문자 발송 서버 및 웹 서비스 운영',
  '앱 API 및 관리자 페이지 운영',
  '쇼핑몰/홈페이지/웹뷰 앱 유지보수',
  'xeokit',
  'XKT',
  'word-break: keep-all',
];

const forbiddenPublic = [
  'gianluca-clean-portfolio',
  'stack-first-portfolio',
  'portfolio-hero-gpt.webp',
  'data-hero-image',
  'gpt-generated',
  'GPT-generated',
  'magic-resume-portfolio',
  'Marketing UI rebuild',
  '귀여운 척을 빼고',
  'Rauno card rhythm',
  '댕댕이는 실행하고',
  '누구에게 따뜻함',
  '따뜻한 개발자',
  '어린왕자',
  '처음부터 예쁘게',
  'AI는 판단을 대신하지 않습니다',
  'mailto:cvb7412@naver.com',
  'hidden phone',
];

const missing = required.filter((item) => !joined.includes(item));
if (missing.length) {
  console.error(`Missing required 3D dark portfolio markers: ${missing.join(', ')}`);
  process.exit(1);
}

const publicJoined = `${app}\n${data}\n${techScene}`;
const forbidden = forbiddenPublic.filter((item) => publicJoined.includes(item));
if (forbidden.length) {
  console.error(`Forbidden public filler/private/rejected markers found: ${forbidden.join(', ')}`);
  process.exit(1);
}

if (existsSync('public/assets/portfolio-hero-gpt.webp')) {
  console.error('Rejected generated hero image still exists at public/assets/portfolio-hero-gpt.webp');
  process.exit(1);
}

const experienceCount = (data.match(/id: '/g) || []).length;
if (experienceCount < 4) {
  console.error(`Expected at least 4 experience/capability records, found ${experienceCount}`);
  process.exit(1);
}

console.log(`content smoke passed: ${experienceCount} records, ${required.length} required 3D dark markers, no rejected image/copy markers`);
