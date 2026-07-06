import {
  Blocks,
  Bot,
  Box,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Layers3,
  MonitorCog,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Capability = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  points: string[];
  icon: LucideIcon;
};

export type ExperienceCategory = 'Current' | 'Backend/API' | 'Operations' | 'Legacy Web' | 'AI Workflow';

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
  label: 'FULL-STACK DEVELOPER · AI-ASSISTED WORKFLOW',
  headline: ['이미 돌아가는 시스템을 읽고,', '필요한 만큼 바꾸는', '개발자입니다.'],
  subcopy:
    '처음부터 새로 짜는 일보다 어려운 건, 이미 운영 중인 서비스 안에서 변경 가능한 선을 찾는 일입니다. PHP/CodeIgniter 쇼핑몰 유지보수에서 시작해 문자 발송 서버, 앱 API와 관리자 페이지, AWP 업무 시스템과 3D/BIM 뷰어까지 다뤘습니다. 화면을 고칠 때 API 응답, DB 구조, 권한, 서버와 배포 이후 영향을 같이 봅니다.',
  aiLine:
    'AI는 판단을 대신하지 않습니다. Cursor, Codex, OpenCode는 낯선 코드의 흐름을 따라가고, 구현안을 비교하고, 검증 목록을 반복하는 시간을 줄이는 도구입니다. 최종 책임은 여전히 사람이 져야 합니다.',
};

export const stats = [
  { value: '6년+', label: '웹 개발·운영 경력' },
  { value: '4', label: '경력 기반 프로젝트 축' },
  { value: '3D/BIM', label: 'AWP 뷰어 검증 경험' },
  { value: 'AI', label: 'Agent workflow 실무 적용' },
];

export const capabilities: Capability[] = [
  {
    id: 'fullstack',
    title: 'Full-stack Web Development',
    kicker: '화면부터 API까지',
    body: '화면 하나는 API, DB, 권한, 배포의 끝에 있습니다. Next.js/React/TypeScript 화면과 Java/Spring Boot REST API를 함께 보며 변경이 어디까지 번지는지 확인합니다.',
    points: ['Next.js · React · TypeScript', 'Spring Boot · Java · REST API', 'Vue.js · JSP · PHP/CodeIgniter'],
    icon: Code2,
  },
  {
    id: 'operation',
    title: 'Service Operation & Maintenance',
    kicker: '운영 중인 서비스 기준',
    body: '운영 중인 서비스에서 변경은 늘 비용과 위험을 만듭니다. 로그, 데이터, 사용자 흐름을 먼저 보고 오류 수정, 기능 추가, 리팩터링의 범위를 잡습니다.',
    points: ['장애·운영 이슈 대응', '공통 CRUD·파일 처리 흐름', 'Linux · Apache/Nginx · AWS 운영'],
    icon: ServerCog,
  },
  {
    id: 'bim',
    title: 'AWP / BIM / 3D Viewer Work',
    kicker: '건설·플랜트 도메인',
    body: 'AWP/BIM은 도면, 문서, 모델, 리비전, 작업 패키지가 한 화면에서 맞물리는 도메인입니다. 화면/API와 3D 뷰어 상태를 함께 검증합니다.',
    points: ['xeokit SDK · XKT · Three.js', 'tile/LOD · xray · clipping', 'pgvector 기반 검색 흐름 검토'],
    icon: Layers3,
  },
  {
    id: 'ai-workflow',
    title: 'AI-assisted Development Workflow',
    kicker: 'AI를 작업 하네스로',
    body: 'AI는 작업을 대신 끝내는 버튼이 아닙니다. 코드 탐색, 구현안 비교, 문서화, 검증 목록 반복을 줄여 사람이 판단할 시간을 남기는 방식으로 사용합니다.',
    points: ['GPT · Cursor · Codex · OpenCode', 'AGENTS.md · Skills · MCP', 'role prompt · subagent/workflow'],
    icon: Bot,
  },
];

export const experienceCategories: Array<'All' | ExperienceCategory> = [
  'All',
  'Current',
  'Backend/API',
  'Operations',
  'Legacy Web',
  'AI Workflow',
];

export const experiences: Experience[] = [
  {
    id: 'awp-bim-viewer',
    title: 'AWP 업무 시스템 및 3D/BIM 뷰어 개발',
    company: '도프텍㈜',
    period: '2025.10 ~ 재직중',
    role: '개발1본부 · 책임 · 웹개발',
    category: 'Current',
    summary:
      'Workpackage, IWP, BIM 데이터와 3D/BIM 뷰어 상태가 맞물리는 AWP 웹 시스템을 다뤘습니다.',
    highlights: [
      'Workpackage, IWP, BIM 관리/할당, 도면, 문서, MTO, 리비전 이력 화면과 API 연동',
      'Next.js/React/TypeScript, MUI/AG Grid 기반 목록·입력 UI와 공통 CRUD 흐름 정리',
      'Spring Boot REST API, PostgreSQL/MyBatis, JWT 인증/권한, 공통 응답/예외 처리 활용',
      'xeokit SDK/XKT 기반 manifest, tile/LOD, 선택/숨김/xray/clipping/camera fit 검증',
      'Workpackage 임베딩과 유사도 검색 등 pgvector 기반 AI/Copilot 연동 흐름 검토/구현',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Spring Boot 3', 'Java 21', 'PostgreSQL', 'MyBatis', 'JWT', 'MUI', 'AG Grid', 'xeokit', 'XKT', 'Three.js', 'CopilotKit'],
    proof: '현재 경력의 대표 프로젝트입니다. 업무 도메인, 화면, API, 권한, 데이터, 3D 뷰어가 한 번에 얽힌 시스템을 다뤘다는 점에서 단순 CRUD 경력과 구분됩니다.',
    icon: Building2,
  },
  {
    id: 'message-server',
    title: '문자 발송 서버 및 웹 서비스 운영',
    company: '㈜ 더제이디와이',
    period: '2024.11 ~ 2025.03',
    role: '개발팀 · 대리 · 백엔드/서버개발',
    category: 'Backend/API',
    summary:
      '문자 발송 서버는 실패가 곧 운영 이슈가 되는 시스템입니다. 전송 로직, 외부 모듈, API, 배포 흐름을 함께 다뤘습니다.',
    highlights: [
      'SMS/MMS 발송 서버 개발, 외부 모듈 연동, 메시지 전송 로직과 데이터 처리 흐름 개선',
      'REST API 설계와 성능 최적화, 기존 서비스 기능 추가, 버그 수정, 코드 리팩터링',
      'AWS EC2/S3/CloudFront/RDS 기반 배포·운영, CI/CD 적용, 서버 모니터링 및 보안 설정 경험',
      'Vue.js 기반 SPA 화면 개발과 API 연동, 컴포넌트 단위 UI/UX 개선',
    ],
    stack: ['Java', 'REST API', 'Vue.js', 'AWS EC2', 'S3', 'CloudFront', 'RDS', 'CI/CD'],
    proof: '문자 발송은 실패가 바로 운영 이슈가 되는 영역입니다. API 구현뿐 아니라 전송 로직, 외부 모듈, 배포와 모니터링까지 같이 다룬 경험입니다.',
    icon: Network,
  },
  {
    id: 'app-admin-ops',
    title: '앱 API 및 관리자 페이지 운영',
    company: '㈜ 뷰랩스',
    period: '2024.03 ~ 2024.11',
    role: '어플지원팀 · 대리 · 백엔드/서버개발',
    category: 'Operations',
    summary:
      '앱 API와 관리자 페이지의 운영 이슈를 보며 앱-서버 사이의 상태와 책임 경계를 정리했습니다.',
    highlights: [
      '모바일 애플리케이션 API와 관리자 페이지 유지보수',
      'iOS/Android 담당자와 앱-서버 연동 이슈 조율',
      'DB와 서버 인프라 모니터링, 장애 대응, 기능 개선',
      'Cursor 초기 도입 이후 기존 코드 파악과 반복 유지보수 작업에 AI 보조 코딩 적용',
    ],
    stack: ['API', '관리자 페이지', 'DB/서버 운영', '앱 연동', 'Cursor'],
    proof: '앱과 서버 사이의 문제는 코드 한 줄보다 상태와 책임 경계에서 자주 생깁니다. 운영 중인 앱/웹 서비스를 안정화하고 연동 이슈를 조율한 경험입니다.',
    icon: MonitorCog,
  },
  {
    id: 'legacy-commerce-web',
    title: '쇼핑몰/홈페이지/웹뷰 앱 유지보수',
    company: '㈜파인프라',
    period: '2020.11 ~ 2023.08',
    role: '웹개발 및 디자인 · 대리 · 웹개발',
    category: 'Legacy Web',
    summary:
      '쇼핑몰, 홈페이지, 웹뷰 앱을 유지보수하며 주문, 배송, 결제, 회원 기능이 실제 운영에서 깨지는 지점을 다뤘습니다.',
    highlights: [
      'Linux 기반 서버, Apache/Nginx, MySQL/PostgreSQL 운영 및 성능/보안 유지보수',
      '송장 프로그램, 주문/배송 추적, PG사 결제 API 연동, 회원/쿠폰/상품 관리 기능 개발',
      '모바일 최적화, 웹 디자인, 보안 조치, 운영 이슈 대응',
      'GPT를 시작으로 오류 원인 분석, 코드 작성 보조, 문서 초안 작성 등 AI 보조 개발 방식 적용',
    ],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'PostgreSQL', 'Linux', 'Apache/Nginx', 'PG API'],
    proof: '유지보수는 남이 만든 구조를 읽는 훈련이었습니다. 주문, 배송, 결제, 회원 관리처럼 실제 돈과 운영이 걸린 기능을 고치며 서비스 감각을 익혔습니다.',
    icon: Wrench,
  },
  {
    id: 'ai-assisted-workflow',
    title: 'AI-assisted Development Workflow',
    company: '개발 방식',
    period: '현재 지속 실험',
    role: '코드 탐색 · 구현안 비교 · 리팩터링 후보 정리 · 문서화 · 검증 반복 축소',
    category: 'AI Workflow',
    summary:
      'AI 도구를 코드 탐색, 구현안 비교, 리팩터링 후보 정리, 문서화, 검증 반복을 줄이는 작업 흐름으로 사용합니다.',
    highlights: [
      'GPT를 코드 이해와 오류 분석에 사용하며 AI 보조 개발 시작',
      'Cursor 초기 도입 이후 유지보수와 구현 과정에 AI-assisted coding 적용',
      'Codex, Cursor, OpenCode, AGENTS.md, Skills, MCP, role prompt, subagent/workflow 구성 활용',
      '코드 탐색, 구현안 비교, 리팩터링 후보 정리, 문서화, 검증 반복을 자동화 대상으로 분리',
    ],
    stack: ['GPT', 'Cursor', 'Codex', 'OpenCode', 'AGENTS.md', 'Skills', 'MCP', 'subagent/workflow'],
    proof: 'AI를 포트폴리오 장식이 아니라 작업 방식으로 다룹니다. 낯선 코드 탐색, 구현안 비교, 문서화, 검증 반복을 줄여 개발자가 판단할 시간을 남기는 쪽에 초점을 둡니다.',
    icon: BrainCircuit,
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
    title: 'AI Workflow',
    items: ['GPT', 'Cursor', 'Codex', 'OpenCode', 'AGENTS.md', 'Skills', 'MCP', 'role prompt', 'subagent/workflow'],
    icon: Blocks,
  },
];

export const workflowSteps = [
  { title: '탐색', body: '낯선 코드를 바로 고치지 않습니다. 호출 흐름, DB 읽기/쓰기, 권한, 배포 영향을 먼저 따라갑니다.', icon: GitBranch },
  { title: '초안', body: 'AI에게 정답을 맡기지 않습니다. 구현안을 여러 개 뽑아 비용과 위험이 작은 쪽을 고릅니다.', icon: Sparkles },
  { title: '검증', body: '타입 체크와 빌드만으로 끝내지 않습니다. 브라우저에서 직접 눌러보고, 깨질 수 있는 경로를 체크리스트로 다시 봅니다.', icon: CheckCircle2 },
  { title: '문서화', body: '같은 삽질을 반복하지 않기 위해 남깁니다. AGENTS.md, Skills, MCP, 작업 기록은 다음 변경의 시작점을 낮춥니다.', icon: Workflow },
];
