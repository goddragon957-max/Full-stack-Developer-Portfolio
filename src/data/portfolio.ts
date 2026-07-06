import {
  Box,
  Building2,
  Code2,
  Database,
  FileCode2,
  Layers3,
  MonitorCog,
  Network,
  ServerCog,
  TerminalSquare,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MainStackGroup = {
  title: string;
  primary: string[];
  secondary: string[];
  note: string;
};

export type Capability = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  points: string[];
  icon: LucideIcon;
};

export type ExperienceCategory = 'Current' | 'Backend/API' | 'Operations' | 'Legacy Web';

export type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  role: string;
  category: ExperienceCategory;
  summary: string;
  highlights: string[];
  stack: string[];
  proof: string;
  icon: LucideIcon;
};

export type SkillGroup = {
  title: string;
  items: string[];
  icon: LucideIcon;
};

export const hero = {
  label: 'FULL-STACK WEB DEVELOPER',
  headline: 'Java/Spring Boot와 React/TypeScript로 웹 서비스를 개발합니다.',
  subcopy:
    'PHP/CodeIgniter 유지보수에서 시작해 문자 발송 서버, 앱 API·관리자 페이지, AWP 업무 시스템과 3D/BIM 뷰어를 다뤘습니다.',
  note: '화면, API, DB, 서버, 배포 흐름을 같이 봅니다.',
};

export const stats = [
  { value: '6년+', label: '웹 개발·운영' },
  { value: 'Java', label: 'Spring Boot / REST API' },
  { value: 'React', label: 'Next.js / TypeScript' },
  { value: 'BIM', label: 'AWP / 3D Viewer' },
];

export const mainStacks: MainStackGroup[] = [
  {
    title: 'Frontend',
    primary: ['Next.js', 'React', 'TypeScript'],
    secondary: ['Vue.js', 'JavaScript', 'MUI', 'AG Grid'],
    note: '업무 화면, 목록/입력 UI, API 연동',
  },
  {
    title: 'Backend',
    primary: ['Java', 'Spring Boot', 'REST API'],
    secondary: ['Spring Framework', 'JSP', 'PHP', 'CodeIgniter'],
    note: '업무 API, 문자 발송 서버, 관리자 기능',
  },
  {
    title: 'Database / Infra',
    primary: ['PostgreSQL', 'MyBatis', 'Linux'],
    secondary: ['MySQL', 'MariaDB', 'AWS EC2/S3/RDS', 'Apache/Nginx'],
    note: 'DB 연동, 서버 운영, 배포 흐름',
  },
  {
    title: 'Domain / Viewer',
    primary: ['AWP', 'BIM', 'xeokit'],
    secondary: ['XKT', 'Three.js', 'tile/LOD', 'clipping'],
    note: 'Workpackage, 도면/문서/MTO, 3D/BIM 뷰어 검증',
  },
];

export const capabilities: Capability[] = [
  {
    id: 'fullstack',
    title: 'Full-stack Web Development',
    kicker: '화면과 API',
    body: 'React/TypeScript 화면과 Spring Boot API를 연결해 업무 기능을 구현합니다. 화면만 보지 않고 DB, 권한, 배포 영향을 같이 확인합니다.',
    points: ['Next.js · React · TypeScript', 'Spring Boot · Java · REST API', 'PostgreSQL · MyBatis'],
    icon: Code2,
  },
  {
    id: 'operation',
    title: 'Service Operation & Maintenance',
    kicker: '운영/유지보수',
    body: '이미 운영 중인 서비스의 오류 수정, 기능 추가, 리팩터링을 해왔습니다. 변경 범위와 장애 가능성을 먼저 확인하는 편입니다.',
    points: ['장애·운영 이슈 대응', 'DB/서버 모니터링', 'Linux · Apache/Nginx · AWS'],
    icon: ServerCog,
  },
  {
    id: 'bim',
    title: 'AWP / BIM / 3D Viewer',
    kicker: '현재 업무 도메인',
    body: 'Workpackage, IWP, BIM, 도면, 문서, MTO, 리비전 이력과 3D/BIM 뷰어 상태를 함께 다룹니다.',
    points: ['xeokit SDK · XKT · Three.js', 'tile/LOD · xray · clipping', 'pgvector 기반 검색 흐름 검토'],
    icon: Layers3,
  },
];

export const experienceCategories: Array<'All' | ExperienceCategory> = [
  'All',
  'Current',
  'Backend/API',
  'Operations',
  'Legacy Web',
];

export const experiences: Experience[] = [
  {
    id: 'awp-bim-viewer',
    title: 'AWP 업무 시스템 및 3D/BIM 뷰어 개발',
    company: '도프텍㈜',
    period: '2025.10 ~ 재직중',
    role: '개발1본부 · 책임 · 웹개발',
    category: 'Current',
    summary: 'Workpackage, IWP, BIM 데이터와 3D/BIM 뷰어가 연결되는 AWP 웹 시스템을 개발합니다.',
    highlights: [
      'Next.js/React/TypeScript, MUI/AG Grid 기반 화면 개발',
      'Spring Boot REST API, PostgreSQL/MyBatis, JWT 인증/권한 흐름 활용',
      'Workpackage, BIM, 도면, 문서, MTO, 리비전 이력 화면/API 연동',
      'xeokit SDK/XKT 기반 3D 뷰어 상태, tile/LOD, xray, clipping 검증',
      'pgvector 기반 Workpackage 검색/AI 연동 흐름 검토',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Spring Boot 3', 'Java 21', 'PostgreSQL', 'MyBatis', 'JWT', 'MUI', 'AG Grid', 'xeokit', 'XKT', 'Three.js'],
    proof: '현재 주력 경력입니다. 프론트엔드, 백엔드, DB, 권한, 도메인 데이터, 3D 뷰어가 함께 얽힌 업무입니다.',
    icon: Building2,
  },
  {
    id: 'message-server',
    title: '문자 발송 서버 및 웹 서비스 운영',
    company: '㈜ 더제이디와이',
    period: '2024.11 ~ 2025.03',
    role: '개발팀 · 대리 · 백엔드/서버개발',
    category: 'Backend/API',
    summary: 'Java 기반 문자 서비스와 웹 애플리케이션의 API, 전송 로직, 배포 운영을 담당했습니다.',
    highlights: [
      'SMS/MMS 발송 서버 개발과 외부 모듈 연동',
      'REST API 설계, 기존 기능 추가, 버그 수정, 코드 리팩터링',
      'AWS EC2/S3/CloudFront/RDS 기반 배포·운영 경험',
      'Vue.js 화면 개발과 API 연동',
    ],
    stack: ['Java', 'REST API', 'Vue.js', 'AWS EC2', 'S3', 'CloudFront', 'RDS', 'CI/CD'],
    proof: '백엔드/API와 운영 경험을 함께 보여주는 경력입니다.',
    icon: Network,
  },
  {
    id: 'app-admin-ops',
    title: '앱 API 및 관리자 페이지 운영',
    company: '㈜ 뷰랩스',
    period: '2024.03 ~ 2024.11',
    role: '어플지원팀 · 대리 · 백엔드/서버개발',
    category: 'Operations',
    summary: '앱 API, 관리자 페이지, 호스팅 서버를 운영하며 앱-서버 연동 이슈를 처리했습니다.',
    highlights: [
      '모바일 애플리케이션 API와 관리자 페이지 유지보수',
      'iOS/Android 담당자와 앱-서버 연동 이슈 조율',
      'DB와 서버 인프라 모니터링, 장애 대응, 기능 개선',
      '기존 코드 파악과 반복 유지보수 작업에 AI 보조 코딩 일부 활용',
    ],
    stack: ['API', '관리자 페이지', 'DB/서버 운영', '앱 연동', 'Cursor'],
    proof: '운영 중인 앱/웹 서비스에서 상태와 책임 경계를 맞춘 경험입니다.',
    icon: MonitorCog,
  },
  {
    id: 'legacy-commerce-web',
    title: '쇼핑몰/홈페이지/웹뷰 앱 유지보수',
    company: '㈜파인프라',
    period: '2020.11 ~ 2023.08',
    role: '웹개발 및 디자인 · 대리 · 웹개발',
    category: 'Legacy Web',
    summary: 'PHP/CodeIgniter 기반 쇼핑몰, 홈페이지, 웹뷰 앱을 유지보수했습니다.',
    highlights: [
      'Linux, Apache/Nginx, MySQL/PostgreSQL 운영 및 유지보수',
      '주문/배송 추적, 송장 프로그램, PG사 결제 API 연동',
      '회원, 쿠폰, 상품 관리 기능 개발',
      '모바일 최적화, 웹 디자인, 보안 조치, 운영 이슈 대응',
    ],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'PostgreSQL', 'Linux', 'Apache/Nginx', 'PG API'],
    proof: '남이 만든 구조를 읽고 고치는 유지보수 기반 경력의 출발점입니다.',
    icon: Wrench,
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Vue.js', 'JavaScript', 'HTML/CSS', 'MUI', 'AG Grid'],
    icon: FileCode2,
  },
  {
    title: 'Backend',
    items: ['Java', 'Spring Boot', 'Spring Framework', 'JSP', 'PHP', 'CodeIgniter', 'REST API'],
    icon: TerminalSquare,
  },
  {
    title: 'Database / Infra',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MyBatis', 'Linux', 'AWS EC2/S3/CloudFront/RDS', 'Apache/Nginx'],
    icon: Database,
  },
  {
    title: '3D / BIM',
    items: ['xeokit', 'XKT', 'Three.js', 'BIM viewer validation', 'tile/LOD', 'clipping', 'camera fit'],
    icon: Box,
  },
  {
    title: 'Tools',
    items: ['Git', 'Cursor', 'Codex', 'OpenCode', 'GPT', 'AGENTS.md', 'Skills', 'MCP'],
    icon: TerminalSquare,
  },
];
