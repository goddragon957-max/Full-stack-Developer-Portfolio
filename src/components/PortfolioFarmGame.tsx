import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

type Player = {
  x: number;
  y: number;
  facing: Direction;
  walking: boolean;
  step: number;
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
const WORLD_W = 24;
const WORLD_H = 16;
const INTRO_TITLE = 'EOM SINYONG';
const MOVE_INTERVAL_MS = 92;

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

const outsideEntities: Entity[] = [
  {
    id: 'farmhouse',
    scene: 'outside',
    name: 'Old Farmhouse',
    kind: 'building',
    x: 2,
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
    x: 9,
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
    x: 17,
    y: 5,
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
    x: 3,
    y: 11,
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
    x: 14,
    y: 11,
    w: 2,
    h: 2,
    range: 2,
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
    x: 20,
    y: 12,
    w: 1,
    h: 1,
    range: 2,
    sprite: '/assets/generated-sprites/interior/sprite-75.png',
    label: 'MAIL',
    prompt: '빨간 우편함이 흔들린다. 안에 연락 쪽지가 있다.',
    journalTitle: '우편함: 연락과 링크',
    dialogue: ['우편함에는 GitHub, 이력서, 프로젝트 링크를 꽂아둘 칸이 있다.', '필요한 정보만 남기고 과장된 자기소개 문구는 걷어낸다.'],
    tags: ['Journal', 'Contact', 'Portfolio'],
  },
  {
    id: 'cropPatch',
    scene: 'outside',
    name: 'Project Crop Patch',
    kind: 'crop',
    x: 11,
    y: 9,
    w: 4,
    h: 3,
    range: 2,
    sprite: '/assets/game-sprites/sprite-51.png',
    label: 'HARVEST',
    prompt: '작물에 작업 기록 열매가 맺혀 있다.',
    journalTitle: '수확물: 운영 기능과 리팩터링',
    dialogue: ['작업 기록 열매를 수확했다: 운영 기능 추가, 관리자 화면, 목록/입력 UI, 외부 API 연동.', '이 게임에서는 포트폴리오가 카드가 아니라 발견물이다.'],
    tags: ['Project crop', 'REST API', 'Admin UI'],
  },
];

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
    dialogue: ['편지함은 연락, GitHub, 이력서, 프로젝트 링크가 들어갈 자리다.', '지금은 게임 흐름 안에서 필요한 정보만 열리도록 남겨 둔다.'],
    tags: ['Contact', 'GitHub', 'Resume', 'Portfolio'],
  },
];

const treeSprites = [
  { src: '/assets/game-sprites/sprite-56.png', x: 1, y: 8, size: 76 },
  { src: '/assets/game-sprites/sprite-63.png', x: 20, y: 2, size: 82 },
  { src: '/assets/game-sprites/sprite-56.png', x: 21, y: 9, size: 70 },
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

function tileType(x: number, y: number) {
  if ((x === 8 || x === 9) && y > 0 && y < 15) return 'path';
  if (y === 7 && x > 1 && x < 23) return 'path';
  if (x >= 17 && x <= 21 && y >= 1 && y <= 3) return 'grass2';
  if (x >= 10 && x <= 15 && y >= 9 && y <= 12) return 'soil';
  if ((x + y) % 7 === 0) return 'flower';
  if ((x * 3 + y) % 11 === 0) return 'grass2';
  return 'grass';
}

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

export function PortfolioFarmGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [typedNameLength, setTypedNameLength] = useState(0);
  const [scene, setScene] = useState<SceneId>('outside');
  const [player, setPlayer] = useState<Player>({ x: 6, y: 6, facing: 'down', walking: false, step: 0 });
  const [dialogue, setDialogue] = useState<Entity | null>(outsideEntities[0]);
  const [journal, setJournal] = useState<string[]>([outsideEntities[0].journalTitle]);
  const [harvestCount, setHarvestCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<MenuTab>('map');
  const [showLabels, setShowLabels] = useState(true);
  const [showHints, setShowHints] = useState(true);

  const pressedDirectionsRef = useRef<Direction[]>([]);
  const moveFrameRef = useRef<number | null>(null);
  const lastMoveAtRef = useRef(0);
  const gameStartedRef = useRef(gameStarted);
  const movePlayerRef = useRef<(direction: Direction) => void>(() => undefined);
  const interactRef = useRef<() => void>(() => undefined);
  const stopWalkingRef = useRef<() => void>(() => undefined);

  const currentEntities = scene === 'outside' ? outsideEntities : interiorEntities;
  const nearby = useMemo(() => getNearestEntity(player, currentEntities), [player, currentEntities]);
  const typedTitle = INTRO_TITLE.slice(0, typedNameLength);
  const allEntities = useMemo(() => [...outsideEntities, ...interiorEntities], []);
  const journalEntries = journal.map((title) => allEntities.find((entity) => entity.journalTitle === title)).filter(Boolean) as Entity[];
  const playerFrames = normalizedCharacterWalkSprites[player.facing];
  const playerFrameIndex = player.walking ? player.step % playerFrames.length : 0;
  const playerSprite = playerFrames[playerFrameIndex];
  const mapEntities = currentEntities;
  const menuTabs: MenuTab[] = ['map', 'about', 'settings'];
  const miniMap = (
    <div className="mini-map" aria-label="Current game map">
      <i className="map-road map-road-vertical" />
      <i className="map-road map-road-horizontal" />
      {mapEntities.map((entity) => (
        <i
          key={`${scene}-${entity.id}`}
          className={`map-node node-${entity.kind} ${nearby?.id === entity.id ? 'is-nearby' : ''}`}
          title={entity.name}
          style={{ left: `${((entity.x + entity.w / 2) / WORLD_W) * 100}%`, top: `${((entity.y + entity.h / 2) / WORLD_H) * 100}%` }}
        />
      ))}
      <i className="map-player" style={{ left: `${((player.x + 0.5) / WORLD_W) * 100}%`, top: `${((player.y + 0.5) / WORLD_H) * 100}%` }} />
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
      const delta = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0],
      }[direction];
      const nextX = Math.max(0, Math.min(WORLD_W - 1, current.x + delta[0]));
      const nextY = Math.max(0, Math.min(WORLD_H - 1, current.y + delta[1]));
      return {
        x: nextX,
        y: nextY,
        facing: direction,
        walking: true,
        step: current.step + 1,
      };
    });
  }, []);

  const unlock = useCallback((target: Entity) => {
    setDialogue(target);
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
    setPlayer((current) => ({ ...current, x: 4, y: 6, facing: 'down', walking: false, step: current.step + 1 }));
    unlock(outsideEntities[0]);
  }, [unlock]);

  const interact = useCallback(() => {
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

    unlock(target);
    if (target.id === 'cropPatch') {
      setHarvestCount((count) => Math.min(count + 1, 3));
    }
  }, [currentEntities, enterHouse, leaveHouse, nearby, scene, unlock]);

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
      if (!gameStartedRef.current) {
        if (event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyE') {
          event.preventDefault();
          setGameStarted(true);
        }
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

  const prompt = nearby?.prompt ?? (scene === 'outside' ? '집 문이나 마을 오브젝트 옆에서 E를 누르세요.' : '집 안 물건 옆에서 E를 눌러 포트폴리오 기록을 조사하세요.');

  return (
    <section
      className={`farm-game scene-${scene} ${gameStarted ? 'is-playing' : 'is-intro'}`}
      data-ui-pass="portfolio-inside-farming-rpg"
      data-game-world="playable-cozy-farm-rpg"
      data-screen-mode="fullscreen-game-shell"
      data-layout-mode="full-screen-map-with-overlay-ui"
      data-topbar-visible="false"
      data-sidebar-visible="false"
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
      data-mobile-fit-mode="scaled-map-safe-area"
      data-settings-open={menuOpen ? 'true' : 'false'}
      data-settings-tab={activeMenuTab}
      data-labels-visible={showLabels ? 'true' : 'false'}
      data-hints-visible={showHints ? 'true' : 'false'}
      data-nearby-object={nearby?.id ?? ''}
      data-active-dialogue={dialogue?.id ?? ''}
      data-journal-count={journal.length}
      data-harvest-count={harvestCount}
      data-generated-assets="codex-image-sheets-and-game-sprites"
      data-font="Pretendard"
    >
      <div className="game-shell">
        <main className="game-viewport" aria-label="Playable cozy farming RPG map" data-game-surface="full-screen-map">
          {scene === 'outside' ? (
            <div className="tile-world outside-world" style={{ width: WORLD_W * TILE, height: WORLD_H * TILE }}>
              {Array.from({ length: WORLD_W * WORLD_H }).map((_, index) => {
                const x = index % WORLD_W;
                const y = Math.floor(index / WORLD_W);
                return <i key={`${x}-${y}`} className={`tile tile-${tileType(x, y)}`} data-tile-x={x} data-tile-y={y} />;
              })}
              {treeSprites.map((tree, index) => (
                <img key={`${tree.src}-${index}`} className="sprite tree-sprite" src={tree.src} alt="" aria-hidden="true" style={{ left: tree.x * TILE, top: tree.y * TILE, width: tree.size }} />
              ))}
              {outsideEntities.map((entity) => (
                <div key={entity.id} className={`game-entity entity-${entity.id} ${nearby?.id === entity.id ? 'is-nearby' : ''}`} style={{ left: entity.x * TILE, top: entity.y * TILE, width: entity.w * TILE, height: entity.h * TILE }} data-entity-id={entity.id}>
                  {entity.sprite && <img className="sprite generated-sprite" src={entity.sprite} alt="" aria-hidden="true" />}
                  <b>{entity.label}</b>
                </div>
              ))}
              <img className={`player-sprite facing-${player.facing} ${player.walking ? 'is-walking' : 'is-idle'}`} src={playerSprite} style={{ left: player.x * TILE, top: player.y * TILE }} alt="움직일 수 있는 생성형 도트 개발자 농부 캐릭터" data-player-sprite={playerSprite} data-sprite-normalization="bottom-centered-transparent-canvas" />
            </div>
          ) : (
            <div className="tile-world interior-world" style={{ width: WORLD_W * TILE, height: WORLD_H * TILE }}>
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
                  <p>노란 점은 현재 위치, 초록/갈색 점은 조사 가능한 포트폴리오 오브젝트입니다.</p>
                </div>
              )}

              {activeMenuTab === 'about' && (
                <div className="about-panel" data-about-panel="portfolio-about">
                  <p>엄신용 포트폴리오는 웹 섹션이 아니라 농장 RPG 안의 발견물로 배치되어 있습니다.</p>
                  <dl>
                    <div><dt>Scene</dt><dd>{scene === 'outside' ? 'Developer Farm' : 'Farmhouse Interior'}</dd></div>
                    <div><dt>Journal</dt><dd>{journal.length}/{allEntities.length}</dd></div>
                    <div><dt>Harvest</dt><dd>{harvestCount}/3</dd></div>
                  </dl>
                  <ul>
                    {journalEntries.slice(0, 5).map((entry) => (
                      <li key={`menu-${entry.id}`}>{entry.journalTitle}</li>
                    ))}
                  </ul>
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
                  <p>Controls: hold WASD/arrows · E/Space interact · gear opens this menu.</p>
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

          <div
            className="dialogue-box bottom-dialogue-bar"
            data-dialogue-box="game-dialogue"
            data-bottom-dialogue-bar="game-chat"
            data-dialogue-mode="bottom-bar"
          >
            <span>{nearby ? `Near: ${nearby.name}` : scene === 'outside' ? 'Explore farm' : 'Inside farmhouse'}</span>
            <strong>{dialogue ? dialogue.name : prompt}</strong>
            {dialogue ? dialogue.dialogue.map((line) => <p key={line}>{line}</p>) : <p>{prompt}</p>}
            <em>{nearby ? 'Press E to inspect / enter' : 'Move next to generated game objects'}</em>
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
            <small>Press Enter / Space / E · Hold arrows or WASD after start</small>
          </div>
        </div>
      )}
    </section>
  );
}
