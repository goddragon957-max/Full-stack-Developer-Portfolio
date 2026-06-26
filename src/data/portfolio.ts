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
  caseStudy: {
    problem: string;
    loop: string;
    evidence: string;
    nextStep: string;
    workspaceNote: string;
    completionLevel: 'built' | 'verified' | 'validated';
  };
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
    caseStudy: {
      problem: '가족 기록 앱은 “언젠가 정리해야지”에서 멈추기 쉽고, 음성·사진·텍스트가 흩어져 다음 사용자 행동으로 이어지지 않습니다.',
      loop: '모바일 수집 → 음성/텍스트 카드 생성 → 가족별 스토리북 확인 → 다음 질문 추천으로 다시 기록을 받는 루프를 설계합니다.',
      evidence: '앱, 웹 대시보드, lab을 분리해 프로토타입별 빌드와 콘텐츠 흐름을 확인하며 예창패 후보 아이템으로 정리했습니다.',
      nextStep: '가족 1팀을 기준으로 온보딩, 첫 음성 보관, 공유 화면까지 사용자 검증 루프를 닫습니다.',
      workspaceNote: 'repo/workspace: MOM Voice, Nestory, mom-voice-lab 계열을 제품·실험·운영면으로 분리',
      completionLevel: 'validated',
    },
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
    caseStudy: {
      problem: '시장 리서치는 뉴스, 차트, 리스크 메모가 따로 놀아 사람이 매번 같은 판단 프레임을 다시 만들어야 합니다.',
      loop: '종목 후보 → AI 투자 회의 → 반대 의견 → paper trading 메모 → 다음 리서치 질문으로 이어지는 회의형 루프입니다.',
      evidence: '리서치 브리핑, 리스크 체크, paper trading 실험을 하나의 반복 워크플로로 묶는 방향을 검증했습니다.',
      nextStep: '거래 실행보다 먼저 회의록 품질과 리스크 반론 누락 여부를 점검하는 harness를 붙입니다.',
      workspaceNote: 'repo/workspace: Dragon Trader Lab 자동화와 시장 데이터 실험 공간',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '에이전트가 모든 검색을 유료 API로 보내면 비용이 빨리 늘고, 로컬 검색만 쓰면 실패 시 품질 회복 경로가 약합니다.',
      loop: '로컬 SearXNG 우선 → 품질/실패 조건 감지 → Tavily·Exa·Serper fallback → 결과와 비용을 기록하는 라우팅 루프입니다.',
      evidence: 'FastAPI 게이트웨이와 Docker Compose 기반 로컬 검색 스택으로 Hermes/OpenClaw 검색 경로를 분리했습니다.',
      nextStep: '쿼리 유형별 성공률, fallback 비율, 비용 로그를 대시보드 카드로 노출합니다.',
      workspaceNote: 'repo/workspace: search-router infra, agent 검색 하네스와 연결',
      completionLevel: 'verified',
    },
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
    caseStudy: {
      problem: '빠른 프로토타입은 자주 만들어지지만 README, 검증 명령, 배포 기준이 없으면 다음 세션에서 다시 해석해야 합니다.',
      loop: '아이디어 수집 → Vite 스캐폴드 → AGENT/VERIFY 작성 → UI 구현 → test/lint/build로 한 번 닫는 제작 루프입니다.',
      evidence: '여러 개인 웹앱을 같은 작업 규약과 smoke gate로 만들며 재사용 가능한 제작 라인을 정리했습니다.',
      nextStep: '새 프로토타입 생성 시 자동으로 체크리스트와 첫 smoke marker를 심는 템플릿을 고정합니다.',
      workspaceNote: 'repo/workspace: prototype factory, StyleSeed 적용 Vite 작업실',
      completionLevel: 'verified',
    },
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
    caseStudy: {
      problem: '콘텐츠 부업은 조사, 초안, 링크, 검수, 발행이 반복되지만 품질 기준이 없으면 자동화가 곧 저품질이 됩니다.',
      loop: '키워드 → 검색 → 초안 → 링크 삽입 → 검수 → 발행 후보로 이어지는 운영 루프를 만듭니다.',
      evidence: '콘텐츠 운영 단계를 분리하고 commerce link 흐름과 연결할 수 있는 실험 항목을 정리했습니다.',
      nextStep: '사람 검수 전용 체크리스트와 “발행 보류” 상태를 추가해 품질 게이트를 먼저 세웁니다.',
      workspaceNote: 'repo/workspace: side-hustle-factory 운영 실험',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '가족 대상 사기 신호는 전문 용어로 설명되면 행동으로 이어지지 않고, 대화방 안에서 바로 확인하기 어렵습니다.',
      loop: '의심 문구 입력 → 위험 신호 분해 → 쉬운 설명 → 가족에게 보낼 대응 문장으로 이어지는 안전 루프입니다.',
      evidence: '피싱 링크, 리딩방, 계좌 유도 같은 사례를 규칙 기반 체크리스트로 묶는 프로토타입 방향을 잡았습니다.',
      nextStep: '실제 가족 대화 예시로 설명 톤과 경고 강도를 조정합니다.',
      workspaceNote: 'repo/workspace: static safety prototype, mobile export 후보',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '집중 앱은 타이머만 있으면 오래 쓰기 어렵고, 사용자가 돌아올 시각적 이유가 약합니다.',
      loop: '집중 세션 → 행성 성장 → 은하 수집 → 다음 집중 목표로 돌아오는 보상 루프입니다.',
      evidence: 'Three.js 모바일 웹 프로토타입으로 집중 상태와 시각 보상 연결을 실험했습니다.',
      nextStep: '세션 저장과 실패 상태를 추가해 장기 루프의 감정선을 확인합니다.',
      workspaceNote: 'repo/workspace: Orbit Bloom WebGL focus prototype',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '게임 아이디어는 데모 영상보다 실제 조작감과 프레임 안정성이 먼저 검증되어야 합니다.',
      loop: '작은 mechanic → playable canvas → 브라우저 smoke → 모바일/데스크톱 프레임 확인으로 반복합니다.',
      evidence: 'RTS, 보드게임형 전투, 보트 물리, 보이드, 3D HUD를 브라우저 실험으로 쪼개 확인했습니다.',
      nextStep: '재사용 가능한 input, camera, HUD harness를 분리해 다음 게임 실험 시간을 줄입니다.',
      workspaceNote: 'repo/workspace: game-motion-lab, Three.js/canvas 실험 묶음',
      completionLevel: 'verified',
    },
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
    caseStudy: {
      problem: '커머스 링크 운영은 링크 생성보다 검수, 교체, 문맥 적합성 확인이 더 많은 시간을 씁니다.',
      loop: '콘텐츠 문맥 → 후보 링크 → 정책/품질 검수 → 발행 → 전환 메모로 이어지는 링크 운영 루프입니다.',
      evidence: '콘텐츠 파이프라인과 링크 운영을 별도 엔진으로 떼어 반복 작업 단위를 정의했습니다.',
      nextStep: '상품 후보의 교체 사유와 금지어를 기록하는 검수 로그를 추가합니다.',
      workspaceNote: 'repo/workspace: commerce-link-engine 수익형 링크 운영 실험',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '항공권 가격 확인은 짧고 반복적인 검색이라 자동화 이득이 크지만, 알림 기준이 흐리면 소음이 됩니다.',
      loop: '노선 조건 → 가격 체크 → 변화 감지 → 알림 후보 → 사용자가 기준을 조정하는 감시 루프입니다.',
      evidence: '개인 조건 중심의 CLI/scheduler-ready 형태로 반복 검색을 자동화 대상으로 정리했습니다.',
      nextStep: '가격 변화폭, 날짜 유연성, 항공사 제외 조건을 사용자가 조정할 수 있게 만듭니다.',
      workspaceNote: 'repo/workspace: flight-price-watch personal automation',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '개인 이벤트 페이지는 예쁘게 만드는 것만큼 모바일 공유, 로딩, 배포 안정성이 중요합니다.',
      loop: '스토리 구성 → 모바일 화면 → 초대 흐름 → Vercel 배포 → 실제 공유 피드백으로 닫습니다.',
      evidence: '모바일 청첩장 웹앱 형태로 감성 UI와 빠른 배포 흐름을 실험했습니다.',
      nextStep: '사진 로딩, 지도/일정 링크, 공유 메시지를 실제 이벤트 기준으로 다듬습니다.',
      workspaceNote: 'repo/workspace: marry1 mobile event web app',
      completionLevel: 'built',
    },
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
    caseStudy: {
      problem: '여러 AI 작업이 늘어나면 상태, 문서, 검증 결과가 흩어져 다음 액션을 결정하기 어렵습니다.',
      loop: '작업 수집 → 상태판 → 내부 위키 → 다음 command → 검증 기록으로 이어지는 운영 루프입니다.',
      evidence: '대시보드, 위키, 공장장형 운영자 컨셉을 묶어 agent ops 화면의 정보 구조를 실험했습니다.',
      nextStep: '프로젝트별 fresh evidence와 마지막 검증 명령을 자동으로 노출합니다.',
      workspaceNote: 'repo/workspace: factory dashboard, wiki, chief lab 내부 도구 묶음',
      completionLevel: 'verified',
    },
    icon: Building2,
  },
];

export const completionLevels = [
  {
    level: 'built',
    label: 'Built',
    body: '작동하는 프로토타입이나 운영 단위로 만든 단계',
  },
  {
    level: 'verified',
    label: 'Verified',
    body: '테스트, 빌드, 브라우저 smoke 같은 하네스로 확인한 단계',
  },
  {
    level: 'validated',
    label: 'User-validated',
    body: '실제 사용자·사업 맥락에서 다음 의사결정까지 받은 단계',
  },
] as const;

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
