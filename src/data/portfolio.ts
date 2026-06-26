import {
  Bot,
  BrainCircuit,
  Building2,
  ChartCandlestick,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileSearch,
  Gamepad2,
  GitBranch,
  HeartHandshake,
  Plane,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ProjectStatus = 'active' | 'lab' | 'infra' | 'prototype';
export type ProjectCategory = 'AI Product' | 'Agent Infra' | 'Automation' | 'Game/Motion' | 'Content/Commerce' | 'Personal Web';

export type Project = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tags: string[];
  impact: string;
  stack: string;
  icon: LucideIcon;
};

export const projects: Project[] = [
  {
    id: 'mom-voice',
    title: 'MOM Voice / Nestory',
    kicker: '가족 음성·스토리 아카이브',
    description:
      '가족의 목소리, 아이 성장 이야기, 부모님의 기억을 음성·텍스트·스토리 카드로 보관하는 AI 가족 앱. 모바일 앱, 웹 대시보드, 실험용 lab을 분리해 운영합니다.',
    status: 'active',
    category: 'AI Product',
    tags: ['AI Voice', 'Family App', 'Storybook', 'MVP'],
    impact: '예창패 후보 아이템 / 가족 음성 타임캡슐',
    stack: 'React Native · Vite · R2 · TTS',
    icon: HeartHandshake,
  },
  {
    id: 'dragon-trader',
    title: 'Dragon Trader Lab',
    kicker: 'AI 투자 회의 실험실',
    description:
      '여러 AI 관점을 투자 회의처럼 구성해 시장 리서치, 종목 아이디어, 리스크 검토, paper trading을 실험하는 저비용 투자 리서치 랩입니다.',
    status: 'active',
    category: 'Automation',
    tags: ['AI Research', 'Paper Trading', 'Briefing', 'Risk'],
    impact: '리서치 기반 의사결정 루프 실험',
    stack: 'Next/Vite · Automation · Market Data',
    icon: ChartCandlestick,
  },
  {
    id: 'search-router',
    title: 'Search Router',
    kicker: '저비용 검색 라우팅 게이트웨이',
    description:
      'Hermes/OpenClaw가 검색할 때 로컬 SearXNG를 기본으로 쓰고, 필요할 때 Tavily·Exa·Serper로 fallback하는 검색 인프라입니다.',
    status: 'infra',
    category: 'Agent Infra',
    tags: ['SearXNG', 'FastAPI', 'Docker', 'Tavily', 'Exa'],
    impact: '검색 비용 절감과 품질 검색 fallback',
    stack: 'FastAPI · Docker Compose · SearXNG',
    icon: FileSearch,
  },
  {
    id: 'prototype-factory',
    title: 'Prototype Factory',
    kicker: 'AI 웹 프로토타입 제작 라인',
    description:
      '아이디어를 Vite/React 기반 프로토타입으로 빠르게 바꾸고, AGENT.md·StyleSeed·검증 명령·배포 흐름을 붙이는 제작 작업실입니다.',
    status: 'active',
    category: 'Agent Infra',
    tags: ['AI Coding', 'Vite', 'React', 'StyleSeed'],
    impact: '아이디어 → 검증 가능한 웹앱 루프',
    stack: 'Vite · React · Codex · StyleSeed',
    icon: Rocket,
  },
  {
    id: 'side-hustle-factory',
    title: 'Side Hustle Factory',
    kicker: '콘텐츠·커머스 운영 실험',
    description:
      '콘텐츠 작성, 검색, 링크 생성, 검수, 발행 흐름을 하나의 부업 실험 시스템으로 묶는 수익화 운영 프로젝트입니다.',
    status: 'lab',
    category: 'Content/Commerce',
    tags: ['Content Ops', 'Commerce', 'Automation', 'SEO'],
    impact: '반복 콘텐츠 업무를 AI 루프로 전환',
    stack: 'Markdown · Search · Commerce Links',
    icon: Store,
  },
  {
    id: 'family-fraud-shield',
    title: 'Family Fraud Shield',
    kicker: '가족 대상 사기 방지 도구',
    description:
      '투자 리딩방, 피싱 링크, 가짜 수익 인증, 계좌 유도 같은 위험 신호를 가족이 이해하기 쉬운 언어로 설명하는 안전 도구입니다.',
    status: 'prototype',
    category: 'AI Product',
    tags: ['Safety', 'Family', 'Scam Detection', 'Consumer'],
    impact: '고령층·가족방 보안 체크리스트',
    stack: 'Static App · Rules · Mobile Export',
    icon: ShieldCheck,
  },
  {
    id: 'orbit-bloom',
    title: 'Orbit Bloom',
    kicker: '우주 집중 앱 프로토타입',
    description:
      '집중 시간을 행성 탄생과 은하 성장으로 표현하는 Three.js 기반 모바일 웹 프로토타입. 집중 루프를 시각적 보상으로 바꿉니다.',
    status: 'prototype',
    category: 'Game/Motion',
    tags: ['Three.js', 'Focus App', 'Gamification', 'Zustand'],
    impact: '집중 행동을 수집형 보상 루프로 변환',
    stack: 'Vite · React · Three.js · Zustand',
    icon: Sparkles,
  },
  {
    id: 'game-motion-lab',
    title: 'Game & Motion Lab',
    kicker: 'WebGL 상호작용 실험실',
    description:
      'RTS, 보드게임형 전투, 물리 기반 보트, 물고기 군집 보이드, 귀여운 3D 게임 HUD 등 웹 인터랙션을 실험하는 공간입니다.',
    status: 'lab',
    category: 'Game/Motion',
    tags: ['Three.js', 'WebGL', 'RTS', 'Boids', 'Motion'],
    impact: '브라우저에서 돌아가는 플레이 가능 실험',
    stack: 'Three.js · Canvas · Browser QA',
    icon: Gamepad2,
  },
  {
    id: 'commerce-link-engine',
    title: 'Commerce Link Engine',
    kicker: '수익형 링크 운영 엔진',
    description:
      '콘텐츠와 커머스 링크를 연결하고, 발행·검수·전환 흐름을 자동화하기 위한 커머스 운영 실험입니다.',
    status: 'lab',
    category: 'Content/Commerce',
    tags: ['Affiliate', 'Commerce', 'Content', 'Automation'],
    impact: '콘텐츠 수익화 작업의 반복 비용 절감',
    stack: 'Vite · Link Ops · Content Pipeline',
    icon: ExternalLink,
  },
  {
    id: 'flight-price-watch',
    title: 'Flight Price Watch',
    kicker: '항공권 가격 추적 자동화',
    description:
      '관심 노선의 항공권 가격 변화를 추적하고 조건에 맞는 변화가 생겼을 때 확인할 수 있도록 만든 개인 자동화 도구입니다.',
    status: 'prototype',
    category: 'Automation',
    tags: ['Travel', 'Price Watch', 'CLI', 'Alert'],
    impact: '반복 검색을 가격 감시 루프로 전환',
    stack: 'Node · CLI · Scheduler-ready',
    icon: Plane,
  },
  {
    id: 'marry1',
    title: 'Marry1',
    kicker: '모바일 청첩장 웹앱',
    description:
      '개인 이벤트를 모바일 웹앱 형태로 제작하는 프로젝트. 감성적인 사용자 경험과 빠른 배포 흐름을 실험합니다.',
    status: 'prototype',
    category: 'Personal Web',
    tags: ['Mobile Web', 'Event', 'Vercel', 'Story'],
    impact: '개인 이벤트를 배포 가능한 웹 경험으로 전환',
    stack: 'React · Mobile Web · Vercel',
    icon: Compass,
  },
  {
    id: 'factory-dashboard',
    title: 'Factory Dashboard / Wiki / Chief Lab',
    kicker: 'AI 작업 공장 운영면',
    description:
      '여러 AI 작업과 프로젝트 상태를 관리하는 대시보드, 내부 위키, 공장장형 운영자 컨셉을 실험하는 내부 도구 묶음입니다.',
    status: 'lab',
    category: 'Agent Infra',
    tags: ['Dashboard', 'Wiki', 'Workroom', 'Ops'],
    impact: '프로젝트 운영과 지식 관리를 중앙화',
    stack: 'React · Docs · Agent Ops',
    icon: Building2,
  },
];

export const categories: Array<'All' | ProjectCategory> = [
  'All',
  'AI Product',
  'Agent Infra',
  'Automation',
  'Game/Motion',
  'Content/Commerce',
  'Personal Web',
];

export const loopSteps = [
  { title: 'Goal', body: '목표와 완료 기준을 한 문장으로 고정합니다.', icon: GitBranch },
  { title: 'Plan', body: '작업을 작은 실행 단위와 검증 게이트로 쪼갭니다.', icon: BrainCircuit },
  { title: 'Agent Work', body: '댕댕이/Codex/worker가 실제 코드를 만들고 수정합니다.', icon: Bot },
  { title: 'Build & Test', body: 'lint, build, test로 거짓 완료를 걸러냅니다.', icon: CheckCircle2 },
  { title: 'Browser QA', body: '실제 화면과 상호작용을 브라우저에서 확인합니다.', icon: Compass },
  { title: 'Deploy & Report', body: 'Vercel/GitHub/Discord로 결과와 근거를 남깁니다.', icon: Workflow },
];

export const stackGroups = [
  {
    title: 'Frontend',
    items: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Lucide', 'Three.js'],
  },
  {
    title: 'Agent Workflow',
    items: ['Hermes Agent', 'OpenClaw', 'Codex CLI', 'AGENT.md', 'CODEX_GOAL.md', 'StyleSeed'],
  },
  {
    title: 'Infra',
    items: ['FastAPI', 'Docker Compose', 'SearXNG', 'Tavily', 'Exa', 'Serper', 'Vercel'],
  },
  {
    title: 'Verification',
    items: ['npm build', 'typecheck', 'browser smoke', 'visual QA', 'deployment check'],
  },
];
