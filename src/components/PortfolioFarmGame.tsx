import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Backpack, BookOpen, CheckCircle2, Hammer, Mail, RotateCcw, Server, Sprout, type LucideIcon } from 'lucide-react';
import { experiences, hero, skillGroups } from '../data/portfolio';
import {
  FARM_CROPS,
  FARM_CROP_INFO,
  FARM_STORAGE_KEY,
  FARM_TOOL_INFO,
  FARM_TOOLS,
  advanceFarmState,
  clearFarmState,
  getFarmCropAsset,
  getFarmGroundAsset,
  getNearestFarmPlot,
  interactWithFarmPlot,
  loadFarmState,
  persistFarmState,
  type CropType,
  type FarmPlotStage,
  type FarmState,
  type FarmTool,
} from '../game/farmLoop';

const CONTACT_EMAIL = 'cvb7412@naver.com';
// TODO: GitHub 주소 입력 시 RESUME 뷰에 링크가 노출됩니다.
const GITHUB_URL = '';

type SceneId = 'outside' | 'interior';
type EntityId =
  | 'farmhouse'
  | 'workshop'
  | 'market'
  | 'barn'
  | 'board'
  | 'mailbox'
  | 'cropPatch'
  | 'exitDoor'
  | 'skillDesk'
  | 'projectBoard'
  | 'serverShelf'
  | 'bimTable'
  | 'journalShelf'
  | 'mailTable';
type Direction = 'up' | 'down' | 'left' | 'right';
type MenuTab = 'map' | 'about' | 'settings';
type QuestStage =
  | 'not-started'
  | 'visit-workshop'
  | 'harvest-project-crops'
  | 'inspect-server-barn'
  | 'return-to-board'
  | 'complete';
type InventoryItemId =
  | 'field-journal'
  | 'quest-note'
  | 'tool-kit'
  | 'project-crops'
  | 'server-log'
  | 'completion-badge'
  | 'frontend-harvest'
  | 'backend-harvest'
  | 'bim-harvest';
type InventoryTone = 'journal' | 'quest' | 'tools' | 'harvest' | 'server' | 'complete' | 'frontend' | 'backend' | 'bim';

type Player = {
  x: number;
  y: number;
  facing: Direction;
  walking: boolean;
  step: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type Entity = {
  id: EntityId;
  scene: SceneId;
  name: string;
  kind: 'building' | 'prop' | 'crop' | 'interior' | 'door';
  x: number;
  y: number;
  w: number;
  h: number;
  range: number;
  sprite?: string;
  label: string;
  prompt: string;
  journalTitle: string;
  dialogue: string[];
  tags: string[];
};

const TILE = 32;
const OUTSIDE_WORLD_W = 32;
const OUTSIDE_WORLD_H = 22;
const INTERIOR_WORLD_W = 24;
const INTERIOR_WORLD_H = 16;
const INTRO_TITLE = 'EOM SINYONG';
const MOVE_INTERVAL_MS = 92;
const MOBILE_CAMERA_BREAKPOINT = 620;
const MOBILE_DIALOGUE_BAR_HEIGHT = 136;
const DESKTOP_DIALOGUE_BAR_HEIGHT = 120;
const SHORT_DESKTOP_DIALOGUE_BAR_HEIGHT = 112;
const MOBILE_PROMPT_BAR_HEIGHT = 68;
const DESKTOP_PROMPT_BAR_HEIGHT = 56;
const DESKTOP_WORLD_ZOOM = 0.74;
const TABLET_WORLD_ZOOM = 0.78;
const MOBILE_WORLD_ZOOM = 0.78;
const DESKTOP_MAX_WORLD_SCALE = 1.45;
const TABLET_MAX_WORLD_SCALE = 1.24;
const MOBILE_MAX_WORLD_SCALE = 1.08;
const DESKTOP_INVENTORY_RAIL_MIN = 260;
const DESKTOP_INVENTORY_RAIL_MAX = 320;
const MOBILE_INVENTORY_RAIL_WIDTH = 104;
const NARROW_INVENTORY_RAIL_WIDTH = 92;

const keyMap: Record<string, Direction | undefined> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

const farmToolKeyMap: Record<string, FarmTool | undefined> = {
  Digit1: 'hoe',
  Digit2: 'seeds',
  Digit3: 'watering-can',
};

type InventoryItem = {
  id: InventoryItemId;
  name: string;
  category: string;
  description: string;
  tone: InventoryTone;
  icon: LucideIcon;
  quantity?: number;
};

type JournalEntry = {
  id: string;
  journalTitle: string;
};

const farmInventoryItemIds: Record<CropType, InventoryItemId> = {
  frontend: 'frontend-harvest',
  backend: 'backend-harvest',
  bim: 'bim-harvest',
};

const farmStageLabels: Record<FarmPlotStage, string> = {
  untilled: '갈지 않은 밭',
  tilled: '심을 준비 완료',
  planted: '씨앗 심음',
  watered: '물주기 완료',
  'growing-1': '새싹 성장 중',
  'growing-2': '성장 중',
  ready: '수확 가능',
};

const questLabels: Record<QuestStage, string> = {
  'not-started': '새 의뢰',
  'visit-workshop': '작업장 조사',
  'harvest-project-crops': '프로젝트 수확',
  'inspect-server-barn': '서버 점검',
  'return-to-board': '완료 보고',
  complete: '의뢰 완료',
};

const questStageOrder: QuestStage[] = [
  'not-started',
  'visit-workshop',
  'harvest-project-crops',
  'inspect-server-barn',
  'return-to-board',
  'complete',
];

const outsideEntities: Entity[] = [
  {
    id: 'farmhouse',
    scene: 'outside',
    name: 'Old Farmhouse',
    kind: 'building',
    x: 3,
    y: 2,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/game-sprites/sprite-24.png',
    label: 'ENTER HOUSE',
    prompt: '집 안으로 들어가면 포트폴리오 물건들이 놓여 있다.',
    journalTitle: '농장집 입장',
    dialogue: ['문을 열었다. 포트폴리오 페이지가 아니라, 포트폴리오가 숨겨진 집 내부로 들어간다.'],
    tags: ['Enter', 'House interior', 'Portfolio objects'],
  },
  {
    id: 'workshop',
    scene: 'outside',
    name: 'Tool Workshop',
    kind: 'building',
    x: 12,
    y: 2,
    w: 5,
    h: 4,
    range: 3,
    sprite: '/assets/game-sprites/sprite-18.png',
    label: 'WORKSHOP',
    prompt: '바깥 작업장이다. 진짜 기술 기록은 집 안 책상에도 있다.',
    journalTitle: '바깥 작업장',
    dialogue: ['작업장 문패에는 React, TypeScript, Java, Spring Boot 도구가 걸려 있다.', '집 안 SKILL 책상에서 더 자세한 기록을 확인할 수 있다.'],
    tags: ['React', 'TypeScript', 'Java', 'Spring Boot'],
  },
  {
    id: 'market',
    scene: 'outside',
    name: 'Project Market',
    kind: 'building',
    x: 24,
    y: 8,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/game-sprites/sprite-20.png',
    label: 'PROJECTS',
    prompt: '프로젝트 상자들이 쌓인 시장이다.',
    journalTitle: '시장 상자: 프로젝트 납품 기록',
    dialogue: ['상자 라벨: 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 운영, AWP 업무 시스템.', '실제 업무 흐름 안에서 기능 추가, 버그 수정, 리팩터링, 외부 API 연동을 처리한 기록이다.'],
    tags: ['AWS', 'Linux', 'React', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: 'barn',
    scene: 'outside',
    name: 'Server Barn',
    kind: 'building',
    x: 4,
    y: 17,
    w: 4,
    h: 4,
    range: 3,
    sprite: '/assets/game-sprites/sprite-19.png',
    label: 'SERVER BARN',
    prompt: '서버 헛간이다. 집 안 SERVER 선반에도 운영 기록이 있다.',
    journalTitle: '서버 헛간: 운영과 인프라',
    dialogue: ['Linux, AWS EC2/S3/RDS, Apache/Nginx, DB 운영 메모가 적혀 있다.', '서비스 뒤에서 Java/Spring Boot, PostgreSQL, MyBatis가 안정적으로 움직이도록 보는 쪽의 기록이다.'],
    tags: ['Java', 'Spring Boot', 'AWS', 'Linux', 'PostgreSQL', 'MyBatis'],
  },
  {
    id: 'board',
    scene: 'outside',
    name: 'Community Board',
    kind: 'prop',
    x: 21,
    y: 18,
    w: 2,
    h: 2,
    range: 3,
    sprite: '/assets/game-sprites/sprite-25.png',
    label: 'QUEST BOARD',
    prompt: '게시판에 BIM/AWP 의뢰서가 붙어 있다.',
    journalTitle: '의뢰서: AWP/BIM 뷰어 검증',
    dialogue: ['게시판 의뢰: AWP, BIM, Workpackage 흐름을 화면에서 검증하라.', 'xeokit, XKT, tile/LOD, clipping 같은 3D/BIM 뷰어 키워드가 퀘스트 조건으로 적혀 있다.'],
    tags: ['AWP', 'BIM', 'xeokit', 'XKT'],
  },
  {
    id: 'mailbox',
    scene: 'outside',
    name: 'Mailbox',
    kind: 'prop',
    x: 8,
    y: 7,
    w: 1,
    h: 1,
    range: 2,
    sprite: '/assets/generated-sprites/interior/sprite-75.png',
    label: 'MAIL',
    prompt: '빨간 우편함이 흔들린다. 안에 연락 쪽지가 있다.',
    journalTitle: '우편함: 연락과 링크',
    dialogue: ['우편함에 연락 쪽지가 있다: cvb7412@naver.com', '화면 위 RESUME 버튼을 누르면 텍스트 이력서를 바로 볼 수 있다.'],
    tags: ['Journal', 'Contact', 'Portfolio'],
  },
  {
    id: 'cropPatch',
    scene: 'outside',
    name: 'Project Crop Patch',
    kind: 'crop',
    x: 15,
    y: 13,
    w: 4,
    h: 3,
    range: 2,
    label: 'FARM',
    prompt: '가까운 밭 칸에서 도구를 선택하고 E를 눌러 농사를 시작하세요.',
    journalTitle: '수확물: 운영 기능과 리팩터링',
    dialogue: ['작업 기록 열매를 수확했다: 운영 기능 추가, 관리자 화면, 목록/입력 UI, 외부 API 연동.', '이 게임에서는 포트폴리오가 카드가 아니라 발견물이다.'],
    tags: ['Project crop', 'REST API', 'Admin UI'],
  },
];

const farmPatchEntity = outsideEntities.find((entity) => entity.id === 'cropPatch') as Entity;

const interiorEntities: Entity[] = [
  {
    id: 'exitDoor',
    scene: 'interior',
    name: 'Exit Door',
    kind: 'door',
    x: 11,
    y: 14,
    w: 2,
    h: 2,
    range: 2,
    label: 'EXIT',
    prompt: '문으로 나가면 농장 마을로 돌아간다.',
    journalTitle: '집 내부 탐색',
    dialogue: ['문 앞에 섰다. 다시 바깥 농장으로 나갈 수 있다.'],
    tags: ['Exit', 'Farm'],
  },
  {
    id: 'skillDesk',
    scene: 'interior',
    name: 'SKILL Desk',
    kind: 'interior',
    x: 3,
    y: 3,
    w: 4,
    h: 3,
    range: 3,
    label: 'SKILL',
    prompt: '노트북과 키보드가 놓인 SKILL 책상이다.',
    journalTitle: '집 안 책상: 기술 스택',
    dialogue: ['노트북 화면에 React/TypeScript UI와 Java/Spring Boot API 작업 기록이 켜져 있다.', '옆 노트에는 PostgreSQL/MyBatis 데이터 처리 메모가 정리되어 있다.'],
    tags: ['React', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MyBatis'],
  },
  {
    id: 'projectBoard',
    scene: 'interior',
    name: 'QUEST Board',
    kind: 'interior',
    x: 12,
    y: 3,
    w: 4,
    h: 3,
    range: 3,
    label: 'QUEST',
    prompt: '프로젝트 의뢰가 붙은 QUEST 게시판이다.',
    journalTitle: '집 안 게시판: 프로젝트 의뢰',
    dialogue: ['의뢰서에는 문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 운영, AWP 업무 시스템이 붙어 있다.', '각 종이는 기능 추가, 버그 수정, 외부 API 연동, 리팩터링 같은 실제 작업 기록이다.'],
    tags: ['Projects', 'Admin UI', 'REST API', 'Operations'],
  },
  {
    id: 'serverShelf',
    scene: 'interior',
    name: 'SERVER Shelf',
    kind: 'interior',
    x: 18,
    y: 3,
    w: 4,
    h: 4,
    range: 3,
    label: 'SERVER',
    prompt: '나무 선반처럼 꾸민 SERVER 랙이다.',
    journalTitle: '집 안 서버 선반: Backend & Infra',
    dialogue: ['서버 선반에는 AWS, Linux, Apache/Nginx, RDS 운영 노트가 꽂혀 있다.', '서비스 뒤쪽의 안정성, 배포 환경, DB 흐름을 확인하는 기록이다.'],
    tags: ['AWS', 'Linux', 'Java', 'Spring Boot', 'PostgreSQL'],
  },
  {
    id: 'bimTable',
    scene: 'interior',
    name: 'BIM Blueprint Table',
    kind: 'interior',
    x: 3,
    y: 9,
    w: 5,
    h: 3,
    range: 3,
    label: 'BIM',
    prompt: '설계 도면과 말린 청사진이 놓인 BIM 테이블이다.',
    journalTitle: '청사진 테이블: AWP/BIM',
    dialogue: ['청사진에는 AWP, BIM, Workpackage 흐름과 뷰어 검증 조건이 그려져 있다.', 'xeokit, XKT, tile/LOD, clipping 같은 키워드가 작업 체크리스트로 붙어 있다.'],
    tags: ['AWP', 'BIM', 'xeokit', 'XKT'],
  },
  {
    id: 'journalShelf',
    scene: 'interior',
    name: 'JOURNAL Shelf',
    kind: 'interior',
    x: 18,
    y: 8,
    w: 4,
    h: 4,
    range: 3,
    label: 'JOURNAL',
    prompt: '경험 기록이 꽂힌 JOURNAL 책장이다.',
    journalTitle: '책장: 경험 기록',
    dialogue: ['책장에는 PHP/CodeIgniter 유지보수에서 앱/웹 운영, 문자 서버, AWP/BIM 업무 시스템으로 확장한 기록이 있다.', '경력은 설명문이 아니라 플레이 중 발견하는 일지로 쌓인다.'],
    tags: ['Experience', 'PHP', 'CodeIgniter', 'Operations'],
  },
  {
    id: 'mailTable',
    scene: 'interior',
    name: 'MAIL Table',
    kind: 'interior',
    x: 14,
    y: 12,
    w: 3,
    h: 3,
    range: 3,
    label: 'MAIL',
    prompt: '연락 편지와 링크가 놓인 MAIL 테이블이다.',
    journalTitle: '편지 테이블: Contact',
    dialogue: ['편지에 연락처가 적혀 있다: cvb7412@naver.com', '전체 경력은 화면 위 RESUME 버튼에서 텍스트로 확인할 수 있다.'],
    tags: ['Contact', 'GitHub', 'Resume', 'Portfolio'],
  },
];

const normalizedCharacterWalkSprites: Record<Direction, string[]> = {
  down: [
    '/assets/generated-sprites/character-walk/down-0.png',
    '/assets/generated-sprites/character-walk/down-1.png',
    '/assets/generated-sprites/character-walk/down-2.png',
    '/assets/generated-sprites/character-walk/down-3.png',
  ],
  left: [
    '/assets/generated-sprites/character-walk/left-0.png',
    '/assets/generated-sprites/character-walk/left-1.png',
    '/assets/generated-sprites/character-walk/left-2.png',
    '/assets/generated-sprites/character-walk/left-3.png',
  ],
  right: [
    '/assets/generated-sprites/character-walk/right-0.png',
    '/assets/generated-sprites/character-walk/right-1.png',
    '/assets/generated-sprites/character-walk/right-2.png',
    '/assets/generated-sprites/character-walk/right-3.png',
  ],
  up: [
    '/assets/generated-sprites/character-walk/up-0.png',
    '/assets/generated-sprites/character-walk/up-1.png',
    '/assets/generated-sprites/character-walk/up-2.png',
    '/assets/generated-sprites/character-walk/up-3.png',
  ],
};

function distanceToEntity(player: Player, entity: Entity) {
  const cx = entity.x + entity.w / 2;
  const cy = entity.y + entity.h / 2;
  return Math.hypot(player.x - cx, player.y - cy);
}

function getNearestEntity(player: Player, entities: Entity[]) {
  return entities
    .map((entity) => ({ entity, distance: distanceToEntity(player, entity) }))
    .filter(({ entity, distance }) => distance <= entity.range)
    .sort((a, b) => a.distance - b.distance)[0]?.entity;
}

function addUnique(list: string[], item: string) {
  return list.includes(item) ? list : [...list, item];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitialViewport(): ViewportSize {
  if (typeof window === 'undefined') return { width: 1280, height: 720 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function getQuestObjective(stage: QuestStage, harvestCount: number) {
  const objectives: Record<QuestStage, string> = {
    'not-started': '옆에 있는 빨간 우편함에서 첫 의뢰를 확인하세요.',
    'visit-workshop': '북쪽 작업장에서 기술 기록을 조사하세요.',
    'harvest-project-crops': `중앙 밭에서 프로젝트 작물을 수확하세요. (${harvestCount}/3)`,
    'inspect-server-barn': '남쪽 서버 헛간의 운영 기록을 점검하세요.',
    'return-to-board': '남쪽 마을 게시판에 완료 보고를 남기세요.',
    complete: '첫 의뢰 완료. 농장과 집 안의 기록을 자유롭게 탐색하세요.',
  };
  return objectives[stage];
}

function getDialogueBarHeight(viewport: ViewportSize, dialogueOpen: boolean) {
  if (!dialogueOpen) {
    return viewport.width <= MOBILE_CAMERA_BREAKPOINT ? MOBILE_PROMPT_BAR_HEIGHT : DESKTOP_PROMPT_BAR_HEIGHT;
  }
  if (viewport.width <= MOBILE_CAMERA_BREAKPOINT) return MOBILE_DIALOGUE_BAR_HEIGHT;
  if (viewport.height <= 620) return SHORT_DESKTOP_DIALOGUE_BAR_HEIGHT;
  return DESKTOP_DIALOGUE_BAR_HEIGHT;
}

function getSceneWorldWidth(scene: SceneId) {
  return scene === 'outside' ? OUTSIDE_WORLD_W : INTERIOR_WORLD_W;
}

function getSceneWorldHeight(scene: SceneId) {
  return scene === 'outside' ? OUTSIDE_WORLD_H : INTERIOR_WORLD_H;
}

function isBlockedByEntity(x: number, y: number, scene: SceneId) {
  const entities = scene === 'outside' ? outsideEntities : interiorEntities;
  return entities.some((entity) => {
    if (entity.kind === 'crop' || entity.kind === 'door') return false;
    return x >= entity.x && x < entity.x + entity.w && y >= entity.y && y < entity.y + entity.h;
  });
}

function getEntityDepth(entity: Entity) {
  return 10 + (entity.y + entity.h) * 10;
}

function getPlayerDepth(player: Player) {
  return 15 + (player.y + 1) * 10;
}

function getWorldScale(viewport: ViewportSize, availableWidth: number, availableHeight: number, worldPixelW: number, worldPixelH: number) {
  const fitScale = Math.max(availableWidth / worldPixelW, availableHeight / worldPixelH);
  const zoomFactor = viewport.width <= MOBILE_CAMERA_BREAKPOINT
    ? MOBILE_WORLD_ZOOM
    : viewport.width <= 980
      ? TABLET_WORLD_ZOOM
      : DESKTOP_WORLD_ZOOM;
  const maxScale = viewport.width <= MOBILE_CAMERA_BREAKPOINT
    ? MOBILE_MAX_WORLD_SCALE
    : viewport.width <= 980
      ? TABLET_MAX_WORLD_SCALE
      : DESKTOP_MAX_WORLD_SCALE;
  const minScale = viewport.width <= 380 ? 0.92 : 1;

  return clamp(fitScale * zoomFactor, minScale, maxScale);
}

function getInventoryRailWidth(viewportWidth: number) {
  if (viewportWidth <= 380) return NARROW_INVENTORY_RAIL_WIDTH;
  if (viewportWidth <= MOBILE_CAMERA_BREAKPOINT) return MOBILE_INVENTORY_RAIL_WIDTH;
  return clamp(viewportWidth * .27, DESKTOP_INVENTORY_RAIL_MIN, DESKTOP_INVENTORY_RAIL_MAX);
}

function getWorldCameraStyle(player: Player, viewport: ViewportSize, scene: SceneId, dialogueOpen: boolean, inventoryRailWidth: number): CSSProperties {
  const worldPixelW = getSceneWorldWidth(scene) * TILE;
  const worldPixelH = getSceneWorldHeight(scene) * TILE;
  const style = {
    width: worldPixelW,
    height: worldPixelH,
  } as CSSProperties & Record<string, string | number>;

  const dialogueHeight = getDialogueBarHeight(viewport, dialogueOpen);
  const availableWidth = Math.max(220, viewport.width - inventoryRailWidth);
  const availableHeight = Math.max(260, viewport.height - dialogueHeight);
  const scale = getWorldScale(viewport, availableWidth, availableHeight, worldPixelW, worldPixelH);
  const scaledWorldW = worldPixelW * scale;
  const scaledWorldH = worldPixelH * scale;
  const playerCenterX = (player.x + 0.5) * TILE * scale;
  const playerCenterY = (player.y + 0.5) * TILE * scale;

  const desiredLeft = availableWidth / 2 - playerCenterX;
  const desiredTop = availableHeight / 2 - playerCenterY;
  const left = scaledWorldW <= availableWidth
    ? (availableWidth - scaledWorldW) / 2
    : clamp(desiredLeft, availableWidth - scaledWorldW, 0);
  const top = scaledWorldH <= availableHeight
    ? (availableHeight - scaledWorldH) / 2
    : clamp(desiredTop, viewport.height - dialogueHeight - scaledWorldH, 0);

  style['--world-scale'] = String(scale);
  style['--camera-left'] = `${left.toFixed(2)}px`;
  style['--camera-top'] = `${top.toFixed(2)}px`;
  return style;
}

export function PortfolioFarmGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [typedNameLength, setTypedNameLength] = useState(0);
  const [scene, setScene] = useState<SceneId>('outside');
  const [player, setPlayer] = useState<Player>({ x: 9, y: 7, facing: 'left', walking: false, step: 0 });
  const [dialogue, setDialogue] = useState<Entity | null>(null);
  const [journal, setJournal] = useState<string[]>([]);
  const [harvestCount, setHarvestCount] = useState(0);
  const [questStage, setQuestStage] = useState<QuestStage>('not-started');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<InventoryItemId>('field-journal');
  const [acquiredItemId, setAcquiredItemId] = useState<InventoryItemId | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<MenuTab>('map');
  const [showLabels, setShowLabels] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [farmState, setFarmState] = useState<FarmState>(() => loadFarmState());
  const [viewport, setViewport] = useState<ViewportSize>(getInitialViewport);

  const pressedDirectionsRef = useRef<Direction[]>([]);
  const moveFrameRef = useRef<number | null>(null);
  const lastMoveAtRef = useRef(0);
  const gameStartedRef = useRef(gameStarted);
  const knownInventoryIdsRef = useRef<Set<InventoryItemId>>(new Set(['field-journal']));
  const itemPickupTimerRef = useRef<number | null>(null);
  const resumeOpenRef = useRef(false);
  const movePlayerRef = useRef<(direction: Direction) => void>(() => undefined);
  const interactRef = useRef<() => void>(() => undefined);
  const stopWalkingRef = useRef<() => void>(() => undefined);

  const currentEntities = scene === 'outside' ? outsideEntities : interiorEntities;
  const nearby = useMemo(() => getNearestEntity(player, currentEntities), [player, currentEntities]);
  const nearbyFarmPlot = useMemo(
    () => scene === 'outside' ? getNearestFarmPlot(player, farmState.plots) : null,
    [farmState.plots, player, scene],
  );
  const typedTitle = INTRO_TITLE.slice(0, typedNameLength);
  const allEntities = useMemo(() => [...outsideEntities, ...interiorEntities], []);
  const entityJournalEntries = journal
    .map((title) => allEntities.find((entity) => entity.journalTitle === title))
    .filter(Boolean) as Entity[];
  const farmJournalEntries = FARM_CROPS
    .filter((crop) => farmState.inventory[crop] > 0)
    .map<JournalEntry>((crop) => ({ id: `farm-${crop}`, journalTitle: FARM_CROP_INFO[crop].portfolioTitle }));
  const journalEntries: JournalEntry[] = [...entityJournalEntries, ...farmJournalEntries];
  const totalJournalCount = journal.length + farmJournalEntries.length;
  const totalJournalEntries = allEntities.length + FARM_CROPS.length;
  const readyFarmPlotCount = farmState.plots.filter((plot) => plot.stage === 'ready').length;
  const totalFarmHarvest = FARM_CROPS.reduce((total, crop) => total + farmState.inventory[crop], 0);
  const playerFrames = normalizedCharacterWalkSprites[player.facing];
  const playerFrameIndex = player.walking ? player.step % playerFrames.length : 0;
  const playerSprite = playerFrames[playerFrameIndex];
  const dialogueOpen = dialogue !== null;
  const dialogueBarHeight = getDialogueBarHeight(viewport, dialogueOpen);
  const questObjective = getQuestObjective(questStage, harvestCount);
  const mapEntities = currentEntities;
  const menuTabs: MenuTab[] = ['map', 'about', 'settings'];
  const questStageIndex = questStageOrder.indexOf(questStage);
  const inventoryItems = useMemo<InventoryItem[]>(() => {
    const items: Array<InventoryItem & { unlocked: boolean }> = [
      {
        id: 'field-journal',
        name: '농장 수첩',
        category: 'RECORD',
        description: `조사한 포트폴리오 기록 ${totalJournalCount}개가 정리되어 있다.`,
        tone: 'journal',
        icon: BookOpen,
        unlocked: true,
      },
      {
        id: 'quest-note',
        name: '의뢰 쪽지',
        category: 'QUEST',
        description: '우편함에서 받은 첫 의뢰. 농장의 개발 기록을 확인하고 완료 보고를 남겨야 한다.',
        tone: 'quest',
        icon: Mail,
        unlocked: questStageIndex >= 1,
      },
      {
        id: 'tool-kit',
        name: '개발 도구 기록',
        category: 'SKILL',
        description: '작업장에서 확인한 React, TypeScript, Java, Spring Boot 도구 기록.',
        tone: 'tools',
        icon: Hammer,
        unlocked: questStageIndex >= 2,
      },
      {
        id: 'project-crops',
        name: '프로젝트 작물',
        category: 'PROJECT',
        description: `중앙 밭에서 수확한 프로젝트 기록. 현재 ${harvestCount}/3개를 모았다.`,
        tone: 'harvest',
        icon: Sprout,
        quantity: harvestCount,
        unlocked: harvestCount > 0,
      },
      {
        id: 'server-log',
        name: '서버 운영 로그',
        category: 'BACKEND',
        description: '서버 헛간에서 점검한 AWS, Linux, Spring Boot, PostgreSQL/MyBatis 운영 기록.',
        tone: 'server',
        icon: Server,
        unlocked: questStageIndex >= 4,
      },
      {
        id: 'completion-badge',
        name: '첫 의뢰 완료 배지',
        category: 'MILESTONE',
        description: '기술, 프로젝트, 운영 기록을 하나의 작업 흐름으로 연결한 증표.',
        tone: 'complete',
        icon: CheckCircle2,
        unlocked: questStage === 'complete',
      },
      ...FARM_CROPS.map((crop): InventoryItem & { unlocked: boolean } => ({
        id: farmInventoryItemIds[crop],
        name: FARM_CROP_INFO[crop].label,
        category: 'HARVEST',
        description: FARM_CROP_INFO[crop].portfolioDescription,
        tone: crop,
        icon: Sprout,
        quantity: farmState.inventory[crop],
        unlocked: farmState.inventory[crop] > 0,
      })),
    ];

    return items.filter((item) => item.unlocked);
  }, [farmState.inventory, harvestCount, questStage, questStageIndex, totalJournalCount]);
  const inventorySlots = useMemo(
    () => Array.from({ length: 12 }, (_, index) => inventoryItems[index] ?? null),
    [inventoryItems],
  );
  const selectedInventoryItem = inventoryItems.find((item) => item.id === selectedInventoryId) ?? inventoryItems[0];
  const SelectedInventoryIcon = selectedInventoryItem.icon;
  const acquiredItem = acquiredItemId ? inventoryItems.find((item) => item.id === acquiredItemId) ?? null : null;
  const AcquiredItemIcon = acquiredItem?.icon;
  const inventoryRailWidth = getInventoryRailWidth(viewport.width);
  const sceneWorldWidth = getSceneWorldWidth(scene);
  const sceneWorldHeight = getSceneWorldHeight(scene);
  const worldCameraStyle = useMemo(
    () => getWorldCameraStyle(player, viewport, scene, dialogueOpen, inventoryRailWidth),
    [dialogueOpen, inventoryRailWidth, player, viewport, scene],
  );
  const miniMap = (
    <div className="mini-map" aria-label="Current game map">
      <i className="map-road map-road-vertical" />
      <i className="map-road map-road-horizontal" />
      {mapEntities.map((entity) => (
        <i
          key={`${scene}-${entity.id}`}
          className={`map-node node-${entity.kind} ${nearby?.id === entity.id ? 'is-nearby' : ''}`}
          title={entity.name}
          style={{ left: `${((entity.x + entity.w / 2) / sceneWorldWidth) * 100}%`, top: `${((entity.y + entity.h / 2) / sceneWorldHeight) * 100}%` }}
        />
      ))}
      <i className="map-player" style={{ left: `${((player.x + 0.5) / sceneWorldWidth) * 100}%`, top: `${((player.y + 0.5) / sceneWorldHeight) * 100}%` }} />
    </div>
  );

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const stopWalking = useCallback(() => {
    setPlayer((current) => (current.walking ? { ...current, walking: false } : current));
  }, []);

  const movePlayer = useCallback((direction: Direction) => {
    setDialogue(null);
    setPlayer((current) => {
      const worldWidth = getSceneWorldWidth(scene);
      const worldHeight = getSceneWorldHeight(scene);
      const delta = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0],
      }[direction];
      const nextX = Math.max(0, Math.min(worldWidth - 1, current.x + delta[0]));
      const nextY = Math.max(0, Math.min(worldHeight - 1, current.y + delta[1]));
      if (isBlockedByEntity(nextX, nextY, scene)) {
        return { ...current, facing: direction, walking: false };
      }
      return {
        x: nextX,
        y: nextY,
        facing: direction,
        walking: true,
        step: current.step + 1,
      };
    });
  }, [scene]);

  const unlock = useCallback((target: Entity, dialogueLines: string[] = target.dialogue) => {
    setDialogue(dialogueLines === target.dialogue ? target : { ...target, dialogue: dialogueLines });
    setJournal((current) => addUnique(current, target.journalTitle));
  }, []);

  const enterHouse = useCallback(() => {
    pressedDirectionsRef.current = [];
    setScene('interior');
    setPlayer((current) => ({ ...current, x: 11, y: 13, facing: 'up', walking: false, step: current.step + 1 }));
    unlock(interiorEntities[0]);
  }, [unlock]);

  const leaveHouse = useCallback(() => {
    pressedDirectionsRef.current = [];
    setScene('outside');
    setPlayer((current) => ({ ...current, x: 6, y: 6, facing: 'down', walking: false, step: current.step + 1 }));
    unlock(outsideEntities[0]);
  }, [unlock]);

  const interactWithNearbyFarmPlot = useCallback(() => {
    if (!nearbyFarmPlot) return false;

    const result = interactWithFarmPlot(farmState, nearbyFarmPlot.id);
    setFarmState(result.state);
    const dialogueLines = [result.message];
    let dialogueName = `Farm Plot ${nearbyFarmPlot.id.replace('plot-', '')}`;

    if (result.harvestedCrop) {
      const cropInfo = FARM_CROP_INFO[result.harvestedCrop];
      dialogueName = cropInfo.label;
      dialogueLines.push(cropInfo.portfolioDescription);
      if (result.firstOfType) {
        dialogueLines.push(`포트폴리오 기록 해금: ${cropInfo.portfolioTitle}`);
      }

      if (questStage === 'harvest-project-crops') {
        const nextHarvestCount = Math.min(harvestCount + 1, 3);
        setHarvestCount(nextHarvestCount);
        if (nextHarvestCount === 3) {
          setQuestStage('inspect-server-barn');
          dialogueLines.push('프로젝트 작물 3개를 모두 수확했습니다. 다음은 남쪽 서버 헛간입니다.');
        } else {
          dialogueLines.push(`퀘스트 수확 진행: ${nextHarvestCount}/3`);
        }
      }
    }

    setDialogue({
      ...farmPatchEntity,
      name: dialogueName,
      prompt: result.message,
      dialogue: dialogueLines,
      tags: result.harvestedCrop ? [result.harvestedCrop, 'Harvest', 'Portfolio unlock'] : [farmState.selectedTool, nearbyFarmPlot.stage],
    });
    return true;
  }, [farmState, harvestCount, nearbyFarmPlot, questStage]);

  const interact = useCallback(() => {
    if (scene === 'outside' && interactWithNearbyFarmPlot()) return;

    const target = nearby;
    if (!target) {
      setDialogue({
        ...currentEntities[0],
        name: scene === 'outside' ? 'Empty Field' : 'Quiet Room',
        label: 'LOOK',
        prompt: '주변에 조사할 것이 없다.',
        journalTitle: '빈 공간',
        dialogue: ['조금 더 가까이 다가가서 E를 누르면 집, 물건, 게시판, 책상과 상호작용할 수 있다.'],
        tags: ['Move closer', 'Press E'],
      });
      return;
    }

    if (target.id === 'farmhouse' && scene === 'outside') {
      enterHouse();
      return;
    }
    if (target.id === 'exitDoor' && scene === 'interior') {
      leaveHouse();
      return;
    }

    if (target.id === 'mailbox' && questStage === 'not-started') {
      setHarvestCount(0);
      setQuestStage('visit-workshop');
      unlock(target, [
        '새 의뢰를 받았다: 농장 곳곳의 개발 기록을 확인하고 게시판에 완료 보고를 남겨라.',
        '첫 목적지는 북쪽 작업장이다. 연락 쪽지에는 cvb7412@naver.com도 적혀 있다.',
      ]);
      return;
    }

    if (target.id === 'mailbox' && questStage !== 'complete') {
      unlock(target, [`진행 중인 의뢰: ${questObjective}`]);
      return;
    }

    if (target.id === 'workshop' && questStage === 'visit-workshop') {
      setQuestStage('harvest-project-crops');
      unlock(target, [
        '작업장의 React, TypeScript, Java, Spring Boot 도구를 확인했다.',
        '다음 단계: 중앙 밭에서 프로젝트 작물 3개를 수확하자.',
      ]);
      return;
    }

    if (target.id === 'barn' && questStage === 'inspect-server-barn') {
      setQuestStage('return-to-board');
      unlock(target, [
        'AWS, Linux, Java/Spring Boot, PostgreSQL/MyBatis 운영 기록을 점검했다.',
        '마지막 단계: 남쪽 마을 게시판에 완료 보고를 남기자.',
      ]);
      return;
    }

    if (target.id === 'board' && questStage === 'return-to-board') {
      setQuestStage('complete');
      unlock(target, [
        '첫 의뢰 완료. 기술, 프로젝트, 운영, AWP/BIM 기록이 하나의 작업 흐름으로 연결됐다.',
        '이제 농장과 집 안의 포트폴리오 기록을 자유롭게 탐색할 수 있다.',
      ]);
      return;
    }

    if (target.id === 'board' && questStage !== 'not-started' && questStage !== 'complete') {
      unlock(target, [`아직 보고할 수 없다. ${questObjective}`]);
      return;
    }

    unlock(target);
  }, [currentEntities, enterHouse, interactWithNearbyFarmPlot, leaveHouse, nearby, questObjective, questStage, scene, unlock]);

  useEffect(() => {
    if (typedNameLength >= INTRO_TITLE.length) return undefined;
    const timer = window.setTimeout(() => {
      setTypedNameLength((length) => Math.min(INTRO_TITLE.length, length + 1));
    }, 86);
    return () => window.clearTimeout(timer);
  }, [typedNameLength]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    persistFarmState(farmState);
  }, [farmState]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFarmState((current) => advanceFarmState(current));
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const newItem = inventoryItems.find((item) => !knownInventoryIdsRef.current.has(item.id));
    knownInventoryIdsRef.current = new Set(inventoryItems.map((item) => item.id));
    if (!gameStarted || !newItem) return;

    if (itemPickupTimerRef.current !== null) {
      window.clearTimeout(itemPickupTimerRef.current);
    }
    setSelectedInventoryId(newItem.id);
    setAcquiredItemId(newItem.id);
    itemPickupTimerRef.current = window.setTimeout(() => {
      setAcquiredItemId(null);
      itemPickupTimerRef.current = null;
    }, 3200);
  }, [gameStarted, inventoryItems]);

  useEffect(() => () => {
    if (itemPickupTimerRef.current !== null) {
      window.clearTimeout(itemPickupTimerRef.current);
    }
  }, []);

  useEffect(() => {
    resumeOpenRef.current = resumeOpen;
  }, [resumeOpen]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    window.visualViewport?.addEventListener('resize', updateViewport, { passive: true });
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    movePlayerRef.current = movePlayer;
  }, [movePlayer]);

  useEffect(() => {
    interactRef.current = interact;
  }, [interact]);

  useEffect(() => {
    stopWalkingRef.current = stopWalking;
  }, [stopWalking]);

  useEffect(() => {
    const stopMoveLoop = () => {
      if (moveFrameRef.current !== null) {
        window.cancelAnimationFrame(moveFrameRef.current);
        moveFrameRef.current = null;
      }
      lastMoveAtRef.current = 0;
    };

    const tick = (time: number) => {
      const direction = pressedDirectionsRef.current[pressedDirectionsRef.current.length - 1];
      if (!gameStartedRef.current || !direction) {
        stopMoveLoop();
        stopWalkingRef.current();
        return;
      }

      if (time - lastMoveAtRef.current >= MOVE_INTERVAL_MS) {
        movePlayerRef.current(direction);
        lastMoveAtRef.current = time;
      }
      moveFrameRef.current = window.requestAnimationFrame(tick);
    };

    const ensureMoveLoop = () => {
      if (moveFrameRef.current === null) {
        moveFrameRef.current = window.requestAnimationFrame(tick);
      }
    };

    const clearDirections = () => {
      pressedDirectionsRef.current = [];
      stopMoveLoop();
      stopWalkingRef.current();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (resumeOpenRef.current) {
        if (event.code === 'Escape') {
          event.preventDefault();
          setResumeOpen(false);
        }
        return;
      }

      if (!gameStartedRef.current) {
        if (event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyE') {
          event.preventDefault();
          setGameStarted(true);
        }
        return;
      }

      if (event.code === 'Escape') {
        event.preventDefault();
        clearDirections();
        setMenuOpen(false);
        setDialogue(null);
        return;
      }

      const farmTool = farmToolKeyMap[event.code];
      if (farmTool) {
        event.preventDefault();
        setFarmState((current) => current.selectedTool === farmTool ? current : { ...current, selectedTool: farmTool });
        return;
      }

      const direction = keyMap[event.code];
      if (direction) {
        event.preventDefault();
        pressedDirectionsRef.current = pressedDirectionsRef.current.filter((pressed) => pressed !== direction);
        pressedDirectionsRef.current.push(direction);
        ensureMoveLoop();
        return;
      }

      if (event.code === 'KeyE' || event.code === 'Space') {
        event.preventDefault();
        interactRef.current();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyMap[event.code];
      if (!direction) return;
      pressedDirectionsRef.current = pressedDirectionsRef.current.filter((pressed) => pressed !== direction);
      if (pressedDirectionsRef.current.length === 0) {
        stopWalkingRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    window.addEventListener('blur', clearDirections, { passive: true });
    window.addEventListener('pagehide', clearDirections, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearDirections);
      window.removeEventListener('pagehide', clearDirections);
      stopMoveLoop();
    };
  }, []);

  const farmPrompt = nearbyFarmPlot
    ? `밭 ${nearbyFarmPlot.id.replace('plot-', '')} · ${farmStageLabels[nearbyFarmPlot.stage]} · ${FARM_TOOL_INFO[farmState.selectedTool].label}`
    : null;
  const prompt = farmPrompt ?? nearby?.prompt ?? (scene === 'outside' ? questObjective : '집 안 물건 옆에서 E를 눌러 포트폴리오 기록을 조사하세요.');

  return (
    <section
      className={`farm-game scene-${scene} ${gameStarted ? 'is-playing' : 'is-intro'}`}
      style={{
        '--dialogue-bar-height': `${dialogueBarHeight}px`,
        '--inventory-rail-width': `${inventoryRailWidth}px`,
      } as CSSProperties}
      data-ui-pass="portfolio-inside-farming-rpg"
      data-game-world="playable-cozy-farm-rpg"
      data-screen-mode="fullscreen-game-shell"
      data-layout-mode="full-screen-map-with-right-inventory-bar"
      data-topbar-visible="false"
      data-sidebar-visible="true"
      data-overlay-layer="dialogue-and-menu"
      data-dialogue-mode="bottom-bar"
      data-game-phase={gameStarted ? 'playing' : 'intro'}
      data-intro-title={INTRO_TITLE}
      data-typed-title={typedTitle}
      data-current-scene={scene}
      data-player-x={player.x}
      data-player-y={player.y}
      data-player-facing={player.facing}
      data-player-walking={player.walking ? 'true' : 'false'}
      data-player-frame={playerFrameIndex}
      data-walk-cycle="coherent-generated-frames"
      data-sprite-normalization="bottom-centered-transparent-canvas"
      data-movement-mode="pressed-key-raf-loop"
      data-world-scale-mode="pixel-locked-fit"
      data-map-grid="32x22"
      data-mobile-fit-mode="camera-fullscreen-safe-area"
      data-camera-mode="player-centered-fullscreen"
      data-collision-mode="entity-bounds"
      data-depth-sorting="y-axis-feet"
      data-right-inventory-bar="persistent"
      data-settings-open={menuOpen ? 'true' : 'false'}
      data-settings-tab={activeMenuTab}
      data-inventory-open="true"
      data-inventory-count={inventoryItems.length}
      data-selected-inventory-item={selectedInventoryItem?.id ?? ''}
      data-item-pickup={acquiredItemId ?? ''}
      data-item-pickup-visible={acquiredItem ? 'true' : 'false'}
      data-farm-loop="v1"
      data-farm-storage="localStorage"
      data-farm-storage-key={FARM_STORAGE_KEY}
      data-farm-plot-count={farmState.plots.length}
      data-selected-farm-tool={farmState.selectedTool}
      data-selected-seed={farmState.selectedSeed}
      data-farm-ready-count={readyFarmPlotCount}
      data-farm-harvest-total={totalFarmHarvest}
      data-farm-first-harvest={farmState.firstHarvested ? 'true' : 'false'}
      data-labels-visible={showLabels ? 'true' : 'false'}
      data-label-display-mode="nearby-only-default"
      data-hints-visible={showHints ? 'true' : 'false'}
      data-nearby-object={nearbyFarmPlot?.id ?? nearby?.id ?? ''}
      data-active-dialogue={dialogue?.id ?? ''}
      data-dialogue-open={dialogueOpen ? 'true' : 'false'}
      data-quest-stage={questStage}
      data-quest-objective={questObjective}
      data-journal-count={totalJournalCount}
      data-harvest-count={harvestCount}
      data-resume-open={resumeOpen ? 'true' : 'false'}
      data-generated-assets="codex-image-sheets-and-game-sprites"
      data-font="Pretendard"
    >
      <div className="game-shell">
        <main className="game-viewport" aria-label="Playable cozy farming RPG map" data-game-surface="full-screen-map">
          {scene === 'outside' ? (
            <div className="tile-world outside-world" style={worldCameraStyle} data-map-renderer="single-generated-map-image">
              <img className="world-map-image" src="/assets/generated-sheets/developer-farm-map.png" alt="Generated pixel farm map" aria-hidden="true" data-world-map-image="developer-farm-map" />
              {outsideEntities.map((entity) => (
                <div key={entity.id} className={`game-entity entity-${entity.id} ${nearby?.id === entity.id ? 'is-nearby' : ''}`} style={{ left: entity.x * TILE, top: entity.y * TILE, width: entity.w * TILE, height: entity.h * TILE, zIndex: getEntityDepth(entity) }} data-entity-id={entity.id}>
                  {entity.sprite && <img className="sprite generated-sprite" src={entity.sprite} alt="" aria-hidden="true" />}
                  <b>{entity.label}</b>
                </div>
              ))}
              {farmState.plots.map((plot, index) => {
                const cropAsset = getFarmCropAsset(plot);
                return (
                  <div
                    key={plot.id}
                    className={`farm-plot stage-${plot.stage} crop-${plot.crop ?? 'empty'} ${nearbyFarmPlot?.id === plot.id ? 'is-nearby' : ''}`}
                    style={{ left: plot.x * TILE, top: plot.y * TILE, zIndex: 12 + (plot.y + 1) * 10 }}
                    aria-label={`밭 ${index + 1}: ${farmStageLabels[plot.stage]}`}
                    data-farm-plot-id={plot.id}
                    data-farm-stage={plot.stage}
                    data-farm-crop={plot.crop ?? ''}
                    data-farm-nearby={nearbyFarmPlot?.id === plot.id ? 'true' : 'false'}
                  >
                    <img className="farm-plot-ground" src={getFarmGroundAsset(plot.stage)} alt="" aria-hidden="true" />
                    {cropAsset && <img className="farm-crop-sprite" src={cropAsset} alt="" aria-hidden="true" />}
                    <span>{index + 1}</span>
                  </div>
                );
              })}
              <img className={`player-sprite facing-${player.facing} ${player.walking ? 'is-walking' : 'is-idle'}`} src={playerSprite} style={{ left: player.x * TILE, top: player.y * TILE, zIndex: getPlayerDepth(player) }} alt="움직일 수 있는 생성형 도트 개발자 농부 캐릭터" data-player-sprite={playerSprite} data-sprite-normalization="bottom-centered-transparent-canvas" />
            </div>
          ) : (
            <div className="tile-world interior-world" style={worldCameraStyle}>
              <img className="interior-room-bg" src="/assets/generated-sheets/farmhouse-interior-room.png" alt="Generated cozy developer farmhouse interior room" />
              {interiorEntities.map((entity) => (
                <div key={entity.id} className={`game-entity interior-hotspot entity-${entity.id} ${nearby?.id === entity.id ? 'is-nearby' : ''}`} style={{ left: entity.x * TILE, top: entity.y * TILE, width: entity.w * TILE, height: entity.h * TILE }} data-entity-id={entity.id}>
                  <b>{entity.label}</b>
                </div>
              ))}
              <img className={`player-sprite facing-${player.facing} ${player.walking ? 'is-walking' : 'is-idle'}`} src={playerSprite} style={{ left: player.x * TILE, top: player.y * TILE }} alt="집 내부를 걷는 생성형 도트 개발자 농부 캐릭터" data-player-sprite={playerSprite} data-sprite-normalization="bottom-centered-transparent-canvas" />
            </div>
          )}
        </main>

        <div className="game-overlay-layer" data-layer="game-overlay-ui">
          <button
            type="button"
            className="gear-button"
            aria-label="Open game menu"
            data-settings-toggle="gear"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ⚙
          </button>

          {menuOpen && (
            <section className="settings-window" role="dialog" aria-modal="false" aria-label="Game menu" data-settings-window="game-menu" data-active-menu-tab={activeMenuTab}>
              <header className="settings-header">
                <div>
                  <span>GAME MENU</span>
                  <strong>{activeMenuTab.toUpperCase()}</strong>
                </div>
                <button type="button" className="settings-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
              </header>

              <nav className="settings-tabs" aria-label="Game menu tabs">
                {menuTabs.map((tab) => (
                  <button key={tab} type="button" className={activeMenuTab === tab ? 'is-active' : ''} onClick={() => setActiveMenuTab(tab)}>
                    {tab.toUpperCase()}
                  </button>
                ))}
              </nav>

              {activeMenuTab === 'map' && (
                <div className="map-panel" data-map-panel="portfolio-world-map">
                  <div className="map-title-row">
                    <span>{scene === 'outside' ? 'Developer Farm Map' : 'Farmhouse Interior Map'}</span>
                    <b>{player.x}, {player.y}</b>
                  </div>
                  {miniMap}
                  <div className="menu-quest-objective" aria-live="polite">
                    <span>QUEST · {questLabels[questStage]}</span>
                    <strong>{questObjective}</strong>
                  </div>
                  <p>노란 점은 현재 위치, 초록/갈색 점은 조사 가능한 포트폴리오 오브젝트입니다.</p>
                </div>
              )}

              {activeMenuTab === 'about' && (
                <div className="about-panel" data-about-panel="portfolio-about">
                  <p>엄신용 포트폴리오는 웹 섹션이 아니라 농장 RPG 안의 발견물로 배치되어 있습니다.</p>
                  <dl>
                    <div><dt>Scene</dt><dd>{scene === 'outside' ? 'Developer Farm' : 'Farmhouse Interior'}</dd></div>
                    <div><dt>Journal</dt><dd>{totalJournalCount}/{totalJournalEntries}</dd></div>
                    <div><dt>Quest harvest</dt><dd>{harvestCount}/3</dd></div>
                    <div><dt>Farm harvest</dt><dd>{totalFarmHarvest}</dd></div>
                  </dl>
                  <ul>
                    {journalEntries.slice(0, 5).map((entry) => (
                      <li key={`menu-${entry.id}`}>{entry.journalTitle}</li>
                    ))}
                  </ul>
                  <button type="button" className="about-resume-button" onClick={() => setResumeOpen(true)}>
                    TEXT RESUME
                  </button>
                </div>
              )}

              {activeMenuTab === 'settings' && (
                <div className="settings-panel" data-settings-panel="game-options">
                  <label>
                    <input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.currentTarget.checked)} />
                    <span>Object labels</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={showHints} onChange={(event) => setShowHints(event.currentTarget.checked)} />
                    <span>Press-E hints</span>
                  </label>
                  <button
                    type="button"
                    className="farm-reset-button"
                    data-reset-farm="farm-state-only"
                    onClick={() => {
                      const resetState = clearFarmState();
                      setFarmState(resetState);
                      setDialogue({
                        ...farmPatchEntity,
                        name: 'Farm Reset',
                        prompt: '농장 상태만 초기화했습니다.',
                        dialogue: ['6개 밭, 선택 도구, 수확 재고와 최초 수확 기록을 초기화했습니다.', '기존 퀘스트와 포트폴리오 탐색 기록은 유지됩니다.'],
                        tags: ['Farm Loop', 'Reset'],
                      });
                    }}
                  >
                    <RotateCcw aria-hidden="true" />
                    <span>RESET FARM</span>
                  </button>
                  <p>Controls: hold WASD/arrows · E/Space interact · 1/2/3 farm tools · gear opens this menu.</p>
                  <div className="settings-map-panel" data-settings-map="below-options">
                    <div className="map-title-row">
                      <span>Settings map</span>
                      <b>Map under settings</b>
                    </div>
                    {miniMap}
                  </div>
                </div>
              )}
            </section>
          )}

          {acquiredItem && AcquiredItemIcon && (
            <div
              className="item-pickup-toast"
              role="status"
              aria-live="polite"
              data-item-pickup-toast="inventory-unlock"
            >
              <div data-item-tone={acquiredItem.tone}>
                <AcquiredItemIcon aria-hidden="true" strokeWidth={2.5} />
              </div>
              <p>
                <span>ITEM ACQUIRED</span>
                <strong>{acquiredItem.name}</strong>
              </p>
            </div>
          )}

          <aside
            className="inventory-rail"
            aria-label="Persistent inventory bar"
            data-inventory-panel="right-game-bar"
          >
              <header className="inventory-header">
                <Backpack className="inventory-header-icon" aria-hidden="true" strokeWidth={2.5} />
                <div>
                  <span>FARM BAG</span>
                  <strong>INVENTORY</strong>
                </div>
              </header>

              <div className="inventory-player-status" data-player-status="inventory-rail">
                <img src={playerSprite} alt="" aria-hidden="true" />
                <div>
                  <span>PLAYER</span>
                  <strong>EOM SINYONG</strong>
                  <small>{scene === 'outside' ? 'DEVELOPER FARM' : 'FARMHOUSE'}</small>
                </div>
              </div>

              <section className="farm-toolbelt" aria-label="Farm toolbelt" data-farm-toolbelt="three-tools">
                <header>
                  <span>TOOLBELT</span>
                  <strong>{FARM_TOOL_INFO[farmState.selectedTool].label}</strong>
                </header>
                <div className="farm-tool-row" role="toolbar" aria-label="Farm tools">
                  {FARM_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className={farmState.selectedTool === tool ? 'is-active' : ''}
                      aria-label={`${FARM_TOOL_INFO[tool].shortcut} · ${FARM_TOOL_INFO[tool].label}`}
                      aria-pressed={farmState.selectedTool === tool}
                      title={`${FARM_TOOL_INFO[tool].shortcut} · ${FARM_TOOL_INFO[tool].label}`}
                      data-farm-tool={tool}
                      onClick={() => setFarmState((current) => ({ ...current, selectedTool: tool }))}
                    >
                      <img src={FARM_TOOL_INFO[tool].asset} alt="" aria-hidden="true" />
                      <kbd>{FARM_TOOL_INFO[tool].shortcut}</kbd>
                    </button>
                  ))}
                </div>
                <div className="farm-seed-selector" aria-label="Seed type" data-selected-seed={farmState.selectedSeed}>
                  {FARM_CROPS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      className={farmState.selectedSeed === crop ? 'is-active' : ''}
                      aria-label={`${FARM_CROP_INFO[crop].label} 선택`}
                      aria-pressed={farmState.selectedSeed === crop}
                      data-seed-type={crop}
                      onClick={() => setFarmState((current) => ({ ...current, selectedTool: 'seeds', selectedSeed: crop }))}
                    >
                      {FARM_CROP_INFO[crop].shortLabel}
                    </button>
                  ))}
                </div>
              </section>

              <div className="inventory-summary">
                <span>{inventoryItems.length}/12 SLOTS</span>
                <strong>{questLabels[questStage]}</strong>
              </div>

              <div className="inventory-grid" aria-label="Inventory slots">
                {inventorySlots.map((item, index) => {
                  if (!item) {
                    return <span key={`empty-${index}`} className="inventory-slot is-empty" data-inventory-slot={`empty-${index + 1}`} aria-hidden="true" />;
                  }

                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`inventory-slot ${selectedInventoryItem.id === item.id ? 'is-selected' : ''} ${acquiredItemId === item.id ? 'is-acquired' : ''}`}
                      aria-label={`${item.name} 선택`}
                      aria-pressed={selectedInventoryItem.id === item.id}
                      data-inventory-slot={item.id}
                      data-item-tone={item.tone}
                      onClick={() => setSelectedInventoryId(item.id)}
                    >
                      <ItemIcon aria-hidden="true" strokeWidth={2.5} />
                      {item.quantity !== undefined && <span className="inventory-quantity">{item.quantity}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="inventory-detail" data-inventory-detail={selectedInventoryItem.id}>
                <SelectedInventoryIcon aria-hidden="true" strokeWidth={2.5} />
                <div>
                  <span>{selectedInventoryItem.category}</span>
                  <strong>{selectedInventoryItem.name}</strong>
                  <p>{selectedInventoryItem.description}</p>
                </div>
              </div>

              <section className="inventory-rail-journal" aria-label="Discovered portfolio records" data-inventory-journal={journalEntries.length}>
                <header>
                  <span>DISCOVERED RECORDS</span>
                  <b>{journalEntries.length}</b>
                </header>
                {journalEntries.length > 0 ? (
                  <ul>
                    {journalEntries.slice(-4).reverse().map((entry) => (
                      <li key={`inventory-${entry.id}`}>{entry.journalTitle}</li>
                    ))}
                  </ul>
                ) : (
                  <p>농장 오브젝트를 조사하면 발견한 포트폴리오 기록이 여기에 쌓입니다.</p>
                )}
              </section>

              <div className="inventory-rail-objective" aria-live="polite">
                <span>CURRENT QUEST</span>
                <strong>{questLabels[questStage]}</strong>
                <p>{questObjective}</p>
                <div>
                  <span>DISCOVERED</span>
                  <b>{totalJournalCount}/{totalJournalEntries}</b>
                </div>
              </div>
          </aside>

          <div
            className={`dialogue-box ${dialogueOpen ? 'is-open' : 'is-collapsed'} bottom-dialogue-bar`}
            role="status"
            aria-live="polite"
            data-dialogue-box="game-dialogue"
            data-bottom-dialogue-bar="game-chat"
            data-dialogue-mode="bottom-bar"
          >
            <span>{dialogue
              ? (nearbyFarmPlot ? `Near: Farm Plot ${nearbyFarmPlot.id.replace('plot-', '')}` : nearby ? `Near: ${nearby.name}` : dialogue.name)
              : `QUEST · ${questLabels[questStage]}`}</span>
            <strong>{dialogue ? dialogue.name : prompt}</strong>
            {dialogue && dialogue.dialogue.map((line) => <p key={line}>{line}</p>)}
            <em>{nearbyFarmPlot ? '[E] 농사' : nearby ? '[E] 조사 / 입장' : dialogue ? '이동하면 대화 닫기' : 'WASD / 방향키로 이동'}</em>
          </div>

          <nav className="touch-pad" aria-label="Mobile game controls">
            <button type="button" onClick={() => movePlayer('up')}>↑</button>
            <button type="button" onClick={() => movePlayer('left')}>←</button>
            <button type="button" onClick={interact}>E</button>
            <button type="button" onClick={() => movePlayer('right')}>→</button>
            <button type="button" onClick={() => movePlayer('down')}>↓</button>
          </nav>
        </div>
      </div>

      {resumeOpen && (
        <section className="resume-overlay" role="dialog" aria-modal="true" aria-label="Text resume view" data-resume-overlay="recruiter-view">
          <div className="resume-window">
            <header className="resume-header">
              <div>
                <span>TEXT RESUME</span>
                <strong>엄신용 · Full-stack Web Developer</strong>
              </div>
              <button type="button" className="resume-close" aria-label="Close resume view" onClick={() => setResumeOpen(false)}>×</button>
            </header>

            <div className="resume-body">
              <p className="resume-lead">{hero.headline}</p>
              <p className="resume-sub">{hero.subcopy} {hero.note}</p>

              <h3>경력</h3>
              <ul className="resume-experiences">
                {experiences.map((experience) => (
                  <li key={experience.id}>
                    <div className="resume-exp-head">
                      <strong>{experience.company}</strong>
                      <span>{experience.period}</span>
                    </div>
                    <em>{experience.title} · {experience.role}</em>
                    <p>{experience.summary}</p>
                    <ul>
                      {experience.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <h3>기술 스택</h3>
              <ul className="resume-skills">
                {skillGroups.map((group) => (
                  <li key={group.title}>
                    <strong>{group.title}</strong>
                    <span>{group.items.join(' · ')}</span>
                  </li>
                ))}
              </ul>

              <h3>연락처</h3>
              <p className="resume-contact">
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                {GITHUB_URL && (
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
                )}
              </p>
              <p className="resume-footnote">게임으로 보시려면 이 창을 닫고 농장을 돌아다니며 E 키로 오브젝트를 조사하세요. (Esc로 닫기)</p>
            </div>
          </div>
        </section>
      )}

      {!gameStarted && (
        <div className="intro-screen" data-intro-screen="pixel-title">
          <div className="intro-card">
            <span className="intro-kicker">PIXEL PORTFOLIO RPG</span>
            <h1 className="pixel-title" aria-label={INTRO_TITLE}>
              <span>{typedTitle}</span>
              <i aria-hidden="true">▌</i>
            </h1>
            <p>Walk the farm. Enter the house. Read the portfolio by touching objects.</p>
            <button type="button" className="intro-start" onClick={startGame}>
              START GAME
            </button>
            <button type="button" className="intro-resume-link" data-intro-resume-link="recruiter-shortcut" onClick={() => setResumeOpen(true)}>
              게임 없이 텍스트 이력서 보기 →
            </button>
            <small>Press Enter / Space / E · Hold arrows or WASD after start</small>
          </div>
        </div>
      )}
    </section>
  );
}
