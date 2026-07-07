import { useEffect, useMemo, useState } from 'react';

type ZoneId = 'farmhouse' | 'workshop' | 'market' | 'barn' | 'board' | 'mailbox';

type Zone = {
  id: ZoneId;
  label: string;
  name: string;
  kicker: string;
  summary: string;
  details: string[];
  tech: string[];
  mapClass: string;
  icon: string;
  x: number;
  y: number;
};

const zones: Zone[] = [
  {
    id: 'farmhouse',
    label: 'FARMHOUSE',
    name: 'Home',
    kicker: 'Developer Farm',
    summary: 'Java/Spring Boot와 React/TypeScript를 함께 다루는 풀스택 개발자 엄신용의 포트폴리오입니다.',
    details: ['화면, API, DB, 서버 흐름을 같이 봅니다.', '운영 중인 서비스의 변경 범위와 장애 가능성을 먼저 확인합니다.'],
    tech: ['Java', 'Spring Boot', 'React', 'TypeScript'],
    mapClass: 'farmhouse',
    icon: '⌂',
    x: 18,
    y: 21,
  },
  {
    id: 'workshop',
    label: 'WORKSHOP',
    name: 'Skills',
    kicker: 'Tool shed',
    summary: '프론트엔드 화면과 백엔드 API를 연결하고, 데이터와 배포 환경까지 이어지는 작업을 해왔습니다.',
    details: ['React/TypeScript UI와 Spring Boot REST API 구현', 'PostgreSQL/MyBatis 기반 업무 데이터 처리'],
    tech: ['React', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MyBatis'],
    mapClass: 'workshop',
    icon: '⚒',
    x: 55,
    y: 18,
  },
  {
    id: 'market',
    label: 'MARKET',
    name: 'Projects',
    kicker: 'Harvest stand',
    summary: '문자 발송 서버, 앱 API/관리자 페이지, 쇼핑몰 운영, AWP 업무 시스템처럼 실제 업무 흐름이 있는 프로젝트를 다뤘습니다.',
    details: ['운영 기능 추가, 버그 수정, 리팩터링', '관리자 화면, 목록/입력 UI, 외부 API 연동'],
    tech: ['AWS', 'Linux', 'PostgreSQL', 'React', 'TypeScript'],
    mapClass: 'market',
    icon: '▤',
    x: 78,
    y: 37,
  },
  {
    id: 'barn',
    label: 'BARN',
    name: 'Backend & Infra',
    kicker: 'Server barn',
    summary: '서버와 데이터베이스가 서비스 뒤에서 안정적으로 움직이도록 Java, Linux, AWS 운영 맥락을 함께 봅니다.',
    details: ['문자 발송 서버와 REST API 운영 경험', 'Linux, Apache/Nginx, AWS EC2/S3/RDS 환경 경험'],
    tech: ['Java', 'Spring Boot', 'AWS', 'Linux', 'PostgreSQL', 'MyBatis'],
    mapClass: 'barn',
    icon: '▣',
    x: 31,
    y: 66,
  },
  {
    id: 'board',
    label: 'COMMUNITY BOARD',
    name: 'Experience',
    kicker: 'Village notice',
    summary: 'PHP/CodeIgniter 유지보수에서 시작해 앱/웹 운영, 문자 서버, AWP/BIM 업무 시스템으로 확장해 왔습니다.',
    details: ['현재는 AWP, BIM, Workpackage와 3D/BIM 뷰어 흐름을 다룹니다.', 'xeokit, XKT, tile/LOD, clipping 같은 뷰어 검증 경험이 있습니다.'],
    tech: ['AWP', 'BIM', 'xeokit', 'XKT', 'React', 'TypeScript'],
    mapClass: 'board',
    icon: '※',
    x: 64,
    y: 70,
  },
  {
    id: 'mailbox',
    label: 'MAILBOX',
    name: 'Contact',
    kicker: 'Letters',
    summary: '포트폴리오 목적지는 경력 근거와 기술 스택입니다. 연락과 링크는 필요한 정보만 단정하게 정리합니다.',
    details: ['GitHub, 이력서, 프로젝트 링크를 연결할 수 있는 자리입니다.', '읽기 쉬운 포트폴리오를 우선하고 과장된 문구는 덜어냅니다.'],
    tech: ['Developer Farm', 'Portfolio', 'AWS', 'Linux'],
    mapClass: 'mailbox',
    icon: '✉',
    x: 85,
    y: 72,
  },
];

const zoneOrder = zones.map((zone) => zone.id);

function nextZone(current: ZoneId, direction: 1 | -1) {
  const index = zoneOrder.indexOf(current);
  const nextIndex = (index + direction + zoneOrder.length) % zoneOrder.length;
  return zoneOrder[nextIndex];
}

export function PixelPortfolioVillage() {
  const [activeZone, setActiveZone] = useState<ZoneId>('farmhouse');
  const active = useMemo(() => zones.find((zone) => zone.id === activeZone) ?? zones[0], [activeZone]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowDown', 'KeyD', 'KeyS', 'ArrowLeft', 'ArrowUp', 'KeyA', 'KeyW'].includes(event.code)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown', 'KeyD', 'KeyS'].includes(event.code) ? 1 : -1;
      setActiveZone((current) => nextZone(current, direction));
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section
      className="pixel-portfolio"
      data-ui-pass="cozy-pixel-farm-portfolio"
      data-game-world="cozy-farming-village"
      data-active-zone={activeZone}
      data-player-zone={activeZone}
      data-font="Pretendard"
    >
      <header className="farm-header">
        <p>Developer Farm</p>
        <h1>Cozy Pixel Farming Portfolio</h1>
        <span>Java · Spring Boot · React · TypeScript · PostgreSQL · MyBatis · AWS · Linux · AWP · BIM · xeokit · XKT</span>
      </header>

      <div className="farm-layout">
        <div className="map-shell" aria-label="Cozy farming village portfolio map">
          <div className="pixel-map">
            <div className="sky-strip" aria-hidden="true" />
            <div className="field field-a" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <i key={index} />
              ))}
            </div>
            <div className="field field-b" aria-hidden="true">
              {Array.from({ length: 15 }).map((_, index) => (
                <i key={index} />
              ))}
            </div>
            <div className="pond" aria-hidden="true" />
            <div className="path path-main" aria-hidden="true" />
            <div className="path path-cross" aria-hidden="true" />

            {zones.map((zone) => (
              <button
                className={`pixel-building ${zone.mapClass}`}
                type="button"
                key={zone.id}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                aria-pressed={activeZone === zone.id}
                onClick={() => setActiveZone(zone.id)}
              >
                <span className="building-roof" aria-hidden="true" />
                <span className="building-body" aria-hidden="true">
                  <b>{zone.icon}</b>
                </span>
                <span className="building-label">{zone.label}</span>
              </button>
            ))}

            <div className="pixel-character" style={{ left: `${active.x}%`, top: `${active.y}%` }} aria-label={`${active.label}에 서 있는 개발자 농부 캐릭터`}>
              <span className="hat" />
              <span className="head" />
              <span className="body" />
              <span className="boots" />
            </div>
          </div>
        </div>

        <aside className="farm-panel" aria-live="polite">
          <p className="panel-kicker">🌱 {active.kicker}</p>
          <h2>{active.label}</h2>
          <strong>{active.name}</strong>
          <p>{active.summary}</p>
          <ul>
            {active.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="tech-patches" aria-label="Technology tags">
            {active.tech.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="control-note">
            <span>Move</span>
            <kbd>←</kbd>
            <kbd>→</kbd>
            <kbd>WASD</kbd>
          </div>
          <figure className="asset-reference">
            <img className="tileset-reference" src="/assets/cozy-farming-village-tileset-4x3.png" alt="Original cozy farming village pixel reference sheet" />
            <figcaption>Generated village asset sheet reference</figcaption>
          </figure>
        </aside>
      </div>
    </section>
  );
}
