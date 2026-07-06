import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type ZoneId = 'intro' | 'stack' | 'career' | 'bim' | 'contact';

type Zone = {
  id: ZoneId;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number];
  color: number;
  accent: string;
  chips: string[];
};

const zones: Zone[] = [
  {
    id: 'stack',
    title: 'NEON STACK GARAGE',
    subtitle: 'Java · Spring Boot · React · TypeScript',
    description: '주요 스택을 네온 정비고처럼 보여줍니다. 화면, API, DB, 서버 흐름을 하나의 개발 차선으로 묶었습니다.',
    position: [-13, -10],
    color: 0x00e5ff,
    accent: '#00e5ff',
    chips: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'MyBatis'],
  },
  {
    id: 'career',
    title: 'CAREER MAINFRAME',
    subtitle: '6년+ 웹 개발·운영',
    description: 'PHP/CodeIgniter 유지보수에서 문자 발송 서버, 앱 API, AWP 업무 시스템까지 이어진 운영형 경력입니다.',
    position: [13, -9],
    color: 0xff2bd6,
    accent: '#ff2bd6',
    chips: ['PHP', 'CodeIgniter', 'REST API', 'Vue.js', 'AWS', 'Linux'],
  },
  {
    id: 'bim',
    title: 'BIM GRID YARD',
    subtitle: 'AWP · BIM · 3D Viewer',
    description: 'Workpackage, IWP, 도면, 문서, MTO, 리비전 이력과 3D/BIM 뷰어 상태를 사이버 그리드로 연결합니다.',
    position: [13, 10],
    color: 0x8b5cf6,
    accent: '#a855f7',
    chips: ['AWP', 'BIM', 'xeokit', 'XKT', 'Three.js', 'tile/LOD'],
  },
  {
    id: 'contact',
    title: 'SIGNAL GATE',
    subtitle: 'GitHub · Career evidence',
    description: '포트폴리오 목적지는 기술 스택과 경력 근거입니다. 외부 링크는 신호 게이트처럼 정리합니다.',
    position: [-13, 10],
    color: 0x39ff14,
    accent: '#39ff14',
    chips: ['GitHub', 'Portfolio', 'Career', 'Contact'],
  },
];

const defaultZone = {
  id: 'intro' as ZoneId,
  title: 'CYBERPUNK DEV CITY',
  subtitle: 'Drive through full-stack evidence',
  description: '네온 호버 로버로 스택, 경력, AWP/BIM 구역을 탐색하는 사이버펑크 3D 포트폴리오입니다.',
  chips: ['WASD', 'Arrow Keys', 'Hover Rover', 'Neon Grid'],
};

function makeTextSprite(
  lines: string[],
  options: { color?: string; bg?: string; width?: number; height?: number; accent?: string } = {},
) {
  const width = options.width ?? 760;
  const height = options.height ?? 260;
  const accent = options.accent ?? '#00e5ff';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, options.bg ?? 'rgba(4, 8, 22, 0.94)');
  gradient.addColorStop(1, 'rgba(21, 8, 38, 0.9)');
  ctx.fillStyle = gradient;
  angledPanel(ctx, 18, 18, width - 36, height - 36, 34);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let y = 42; y < height - 34; y += 18) {
    ctx.fillRect(34, y, width - 68, 1.2);
  }

  ctx.fillStyle = options.color ?? '#ecfeff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.font = '950 54px Pretendard, Inter, Arial, sans-serif';
  ctx.fillText(lines[0] ?? '', width / 2, height * 0.42);
  ctx.shadowBlur = 8;
  ctx.font = '780 29px Pretendard, Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(236,254,255,0.78)';
  ctx.fillText(lines[1] ?? '', width / 2, height * 0.66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(5.45, 1.86, 1);
  return sprite;
}

function angledPanel(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, cut: number) {
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height - cut);
  ctx.lineTo(x + width - cut, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + cut);
  ctx.closePath();
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material?.dispose();
  });
}

export function PortfolioGame3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const touchKeys = useRef<Record<string, boolean>>({});
  const carState = useRef({ x: 0, z: 0, angle: 0, speed: 0 });
  const [hud, setHud] = useState({ zone: defaultZone, speed: 0, x: 0, z: 0 });

  const jumpToZone = (zone: Zone) => {
    const [x, z] = zone.position;
    carState.current.x = x;
    carState.current.z = z - 1.4;
    carState.current.speed = 0;
    setHud({ zone, speed: 0, x: Number(x.toFixed(1)), z: Number((z - 1.4).toFixed(1)) });
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030612);
    scene.fog = new THREE.FogExp2(0x090418, 0.023);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 150);
    camera.position.set(0, 7.8, -12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x1a1f45, 1.4));

    const moon = new THREE.DirectionalLight(0x9fb7ff, 1.6);
    moon.position.set(-15, 24, -18);
    moon.castShadow = true;
    moon.shadow.camera.left = -38;
    moon.shadow.camera.right = 38;
    moon.shadow.camera.top = 38;
    moon.shadow.camera.bottom = -38;
    moon.shadow.mapSize.set(2048, 2048);
    scene.add(moon);

    const world = new THREE.Group();
    scene.add(world);

    addCyberFloor(world);
    addNeonRoads(world);
    addNeonCity(world);
    addDataRails(world);
    addStations(world);

    const car = createHoverRover();
    car.position.set(0, 0.58, -2);
    world.add(car);

    const startSign = makeTextSprite(['CYBERPUNK DEV CITY', '엄신용 · Full-stack Developer'], { accent: '#00e5ff' });
    startSign.position.set(0, 4.15, -8.2);
    world.add(startSign);

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) {
        event.preventDefault();
        keys.current[event.code] = true;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);

    const clock = new THREE.Clock();
    let frame = 0;
    let hudFrame = 0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.045);
      updateCar(car, delta, clock.elapsedTime);
      updateCamera(camera, car);
      animateWorld(world, clock.elapsedTime);
      renderer.render(scene, camera);

      hudFrame += 1;
      if (hudFrame % 8 === 0) {
        const activeZone = getActiveZone(carState.current.x, carState.current.z);
        setHud({
          zone: activeZone ?? defaultZone,
          speed: Math.round(Math.abs(carState.current.speed) * 320),
          x: Number(carState.current.x.toFixed(1)),
          z: Number(carState.current.z.toFixed(1)),
        });
      }

      frame = requestAnimationFrame(animate);
    };
    animate();

    function pressed(...codes: string[]) {
      return codes.some((code) => keys.current[code] || touchKeys.current[code]);
    }

    function updateCar(carObject: THREE.Group, delta: number, elapsed: number) {
      const state = carState.current;
      const accelerating = pressed('ArrowUp', 'KeyW');
      const reversing = pressed('ArrowDown', 'KeyS');
      const turningLeft = pressed('ArrowLeft', 'KeyA');
      const turningRight = pressed('ArrowRight', 'KeyD');
      const braking = pressed('Space');

      if (accelerating) state.speed += 12.5 * delta;
      if (reversing) state.speed -= 8.5 * delta;
      if (braking) state.speed *= 0.8;
      state.speed *= Math.pow(0.91, delta * 24);
      state.speed = THREE.MathUtils.clamp(state.speed, -2.05, 3.15);

      const steerPower = THREE.MathUtils.clamp(Math.abs(state.speed) / 2.15, 0.2, 1);
      if (turningLeft) state.angle += 2.25 * delta * steerPower * Math.sign(state.speed || 1);
      if (turningRight) state.angle -= 2.25 * delta * steerPower * Math.sign(state.speed || 1);

      state.x += Math.sin(state.angle) * state.speed * delta * 3.1;
      state.z += Math.cos(state.angle) * state.speed * delta * 3.1;
      state.x = THREE.MathUtils.clamp(state.x, -27, 27);
      state.z = THREE.MathUtils.clamp(state.z, -27, 27);

      const hover = 0.55 + Math.sin(elapsed * 3.4) * 0.045 + Math.abs(state.speed) * 0.018;
      carObject.position.set(state.x, hover, state.z);
      carObject.rotation.y = state.angle;
      carObject.rotation.z = THREE.MathUtils.lerp(carObject.rotation.z, (turningLeft ? 0.08 : turningRight ? -0.08 : 0), 0.08);
      carObject.children.forEach((child) => {
        if (child.userData.rotor) child.rotation.y += delta * (6 + Math.abs(state.speed) * 5);
        if (child.userData.pulse) {
          const scale = 1 + Math.sin(elapsed * 7 + child.position.x) * 0.08;
          child.scale.setScalar(scale);
        }
      });
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.dispose();
      renderer.domElement.remove();
      disposeObject(scene);
    };
  }, []);

  const setTouch = (code: string, value: boolean) => {
    touchKeys.current[code] = value;
  };

  return (
    <section
      className="drive-portfolio"
      data-theme="cyberpunk"
      data-game-world="cyberpunk-dev-city"
      data-active-zone={hud.zone.id}
      data-car-x={hud.x}
      data-car-z={hud.z}
      data-speed={hud.speed}
      aria-label="Cyberpunk Dev City drivable portfolio world"
    >
      <div ref={mountRef} className="game-canvas" />

      <div className="game-topbar">
        <div>
          <span>CYBERPUNK DEV CITY</span>
          <strong>엄신용 · Full-stack Developer</strong>
        </div>
        <nav aria-label="portfolio landmarks">
          {zones.map((zone) => (
            <a href={`#${zone.id}`} key={zone.id} onClick={(event) => { event.preventDefault(); jumpToZone(zone); }}>
              {zone.title}
            </a>
          ))}
        </nav>
      </div>

      <aside className="zone-card" id={hud.zone.id} style={{ '--zone-accent': 'accent' in hud.zone ? hud.zone.accent : '#00e5ff' } as React.CSSProperties}>
        <p className="zone-eyebrow">CURRENT SIGNAL</p>
        <h1>{hud.zone.title}</h1>
        <strong>{hud.zone.subtitle}</strong>
        <p>{hud.zone.description}</p>
        <div className="zone-chips">
          {hud.zone.chips.map((chip) => <span key={chip}>{chip}</span>)}
        </div>
      </aside>

      <div className="game-hud">
        <div><span>VELOCITY</span><strong>{hud.speed}</strong></div>
        <div><span>GRID POS</span><strong>{hud.x}, {hud.z}</strong></div>
        <div><span>SIGNAL</span><strong>{hud.zone.id.toUpperCase()}</strong></div>
      </div>

      <div className="mini-map" aria-label="mini map">
        {zones.map((zone) => (
          <span
            className={`map-zone ${hud.zone.id === zone.id ? 'active' : ''}`}
            key={zone.id}
            style={{ left: `${((zone.position[0] + 27) / 54) * 100}%`, top: `${((zone.position[1] + 27) / 54) * 100}%`, background: zone.accent }}
          />
        ))}
        <span className="map-car" style={{ left: `${((hud.x + 27) / 54) * 100}%`, top: `${((hud.z + 27) / 54) * 100}%` }} />
      </div>

      <div className="control-help">
        <span>Drive hover rover</span>
        <strong>WASD / Arrow Keys</strong>
        <span>Space = brake</span>
      </div>

      <div className="touch-controls" aria-label="touch drive controls">
        <button onPointerDown={() => setTouch('KeyW', true)} onPointerUp={() => setTouch('KeyW', false)} onPointerLeave={() => setTouch('KeyW', false)} type="button">▲</button>
        <div>
          <button onPointerDown={() => setTouch('KeyA', true)} onPointerUp={() => setTouch('KeyA', false)} onPointerLeave={() => setTouch('KeyA', false)} type="button">◀</button>
          <button onPointerDown={() => setTouch('Space', true)} onPointerUp={() => setTouch('Space', false)} onPointerLeave={() => setTouch('Space', false)} type="button">●</button>
          <button onPointerDown={() => setTouch('KeyD', true)} onPointerUp={() => setTouch('KeyD', false)} onPointerLeave={() => setTouch('KeyD', false)} type="button">▶</button>
        </div>
        <button onPointerDown={() => setTouch('KeyS', true)} onPointerUp={() => setTouch('KeyS', false)} onPointerLeave={() => setTouch('KeyS', false)} type="button">▼</button>
      </div>
    </section>
  );
}

function addCyberFloor(world: THREE.Group) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(74, 74),
    new THREE.MeshStandardMaterial({ color: 0x050816, roughness: 0.72, metalness: 0.28 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.add(ground);

  const grid = new THREE.GridHelper(72, 72, 0x00e5ff, 0x17244e);
  grid.position.y = 0.025;
  grid.userData.grid = true;
  const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
  materials.forEach((material) => {
    material.transparent = true;
    material.opacity = 0.34;
  });
  world.add(grid);

  const horizon = new THREE.Mesh(
    new THREE.RingGeometry(22, 22.08, 128),
    new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.46, side: THREE.DoubleSide }),
  );
  horizon.rotation.x = -Math.PI / 2;
  horizon.position.y = 0.06;
  world.add(horizon);
}

function addNeonRoads(world: THREE.Group) {
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x080b16, roughness: 0.36, metalness: 0.62 });
  const laneCyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.82 });
  const lanePink = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.72 });
  const roads = [
    { x: 0, z: 0, w: 48, h: 5.1, r: 0 },
    { x: 0, z: 0, w: 5.1, h: 48, r: 0 },
    { x: -13, z: -10, w: 12, h: 4.6, r: Math.PI / 5 },
    { x: 13, z: -9, w: 12, h: 4.6, r: -Math.PI / 5 },
    { x: 13, z: 10, w: 12, h: 4.6, r: Math.PI / 5 },
    { x: -13, z: 10, w: 12, h: 4.6, r: -Math.PI / 5 },
  ];
  roads.forEach((road) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(road.w, road.h), roadMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = road.r;
    mesh.position.set(road.x, 0.035, road.z);
    mesh.receiveShadow = true;
    world.add(mesh);
  });

  for (let i = -22; i <= 22; i += 4) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.08), i % 8 === 0 ? lanePink : laneCyan);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(i, 0.075, 0);
    world.add(dash);
    const dashV = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.6), i % 8 === 0 ? laneCyan : lanePink);
    dashV.rotation.x = -Math.PI / 2;
    dashV.position.set(0, 0.075, i);
    world.add(dashV);
  }
}

function addNeonCity(world: THREE.Group) {
  const buildingMat = new THREE.MeshStandardMaterial({ color: 0x080b18, roughness: 0.38, metalness: 0.72, emissive: 0x030816, emissiveIntensity: 0.5 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x2d375f, transparent: true, opacity: 0.75 });
  const windowCyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.72 });
  const windowPink = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.58 });
  const buildingPositions: Array<[number, number, number, number, number]> = [
    [-30, -26, 3.1, 9, 2.8], [-24, -30, 4.2, 13, 3.2], [-15, -29, 3.4, 7, 2.8], [-5, -31, 5, 15, 3.6], [8, -30, 3.2, 10, 2.8], [20, -29, 5.2, 17, 4], [30, -24, 3.5, 11, 3],
    [31, -12, 4.4, 12, 3.4], [30, 3, 3.6, 9, 3], [31, 17, 5.4, 16, 4], [24, 30, 4.2, 12, 3.4], [11, 31, 3.8, 8, 3], [-2, 30, 5.1, 14, 3.8], [-16, 31, 3.5, 10, 3], [-28, 24, 4.8, 13, 3.7], [-31, 11, 3.6, 9, 2.8], [-30, -2, 5.2, 15, 3.8],
  ];

  buildingPositions.forEach(([x, z, w, h, d], index) => {
    const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), buildingMat.clone());
    building.position.set(x, h / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    world.add(building);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(building.geometry), edgeMat);
    edges.position.copy(building.position);
    world.add(edges);

    for (let y = 1.4; y < h - 0.6; y += 1.55) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.58, 0.08), index % 2 ? windowPink : windowCyan);
      win.position.set(x, y, z + d / 2 + 0.012);
      world.add(win);
    }
  });
}

function addDataRails(world: THREE.Group) {
  const railMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.48 });
  const magentaMat = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.42 });
  for (let i = -24; i <= 24; i += 8) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 58), i % 16 === 0 ? railMat : magentaMat);
    rail.position.set(i, 0.18, 0);
    world.add(rail);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(58, 0.035, 0.035), i % 16 === 0 ? magentaMat : railMat);
    rail2.position.set(0, 0.19, i);
    world.add(rail2);
  }
}

function addStations(world: THREE.Group) {
  zones.forEach((zone) => {
    const [x, z] = zone.position;
    const accentMat = new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.82 });
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.75, 4.45, 0.34, 6),
      new THREE.MeshStandardMaterial({ color: 0x0a1022, roughness: 0.33, metalness: 0.78, emissive: zone.color, emissiveIntensity: 0.18 }),
    );
    platform.position.set(x, 0.2, z);
    platform.rotation.y = Math.PI / 6;
    platform.castShadow = true;
    platform.receiveShadow = true;
    world.add(platform);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.55, 0.035, 8, 96),
      new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.78 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.48, z);
    ring.userData.spin = true;
    world.add(ring);

    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.16), accentMat);
      pillar.position.set(x + Math.cos(angle) * 3.05, 1.65, z + Math.sin(angle) * 3.05);
      pillar.userData.pulse = true;
      world.add(pillar);
    }

    const sign = makeTextSprite([zone.title, zone.subtitle], { accent: zone.accent });
    sign.position.set(x * 0.78, 4.05, z - 3.1);
    world.add(sign);

    const icon = createZoneIcon(zone.id, zone.color);
    icon.position.set(x, 1.35, z + 0.3);
    icon.userData.spin = true;
    world.add(icon);

    const light = new THREE.PointLight(zone.color, 4.2, 15, 1.5);
    light.position.set(x, 3.3, z);
    world.add(light);
  });
}

function createZoneIcon(id: ZoneId, color: number) {
  const group = new THREE.Group();
  const glowMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.24, metalness: 0.55 });
  const lineMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, wireframe: true });

  if (id === 'stack') {
    for (let i = 0; i < 4; i += 1) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.35, 0.45), glowMat);
      rack.position.set((i - 1.5) * 0.55, 0.2 + i * 0.08, 0);
      group.add(rack);
    }
  } else if (id === 'career') {
    for (let i = 0; i < 5; i += 1) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6 + i * 0.28, 0.24), glowMat);
      bar.position.set((i - 2) * 0.42, bar.geometry.parameters.height / 2 - 0.45, 0);
      group.add(bar);
    }
  } else if (id === 'bim') {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.65, 1.65), lineMat);
    cube.rotation.set(0.35, 0.55, 0.1);
    group.add(cube);
  } else if (id === 'contact') {
    const gate = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 8, 64), glowMat);
    gate.rotation.y = Math.PI / 2;
    group.add(gate);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 12), glowMat);
    group.add(core);
  }

  return group;
}

function createHoverRover() {
  const rover = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x101522, roughness: 0.22, metalness: 0.82, emissive: 0x111827, emissiveIntensity: 0.45 });
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x252a3d, roughness: 0.28, metalness: 0.7, emissive: 0x040712, emissiveIntensity: 0.25 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.72, emissive: 0x00e5ff, emissiveIntensity: 0.7 });
  const cyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.92 });
  const pink = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.88 });

  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.92, 2.8, 6), bodyMat);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.rotation.z = Math.PI / 6;
  fuselage.position.y = 0.34;
  fuselage.castShadow = true;
  rover.add(fuselage);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 12), glassMat);
  cockpit.scale.set(1.08, 0.42, 1.35);
  cockpit.position.set(0, 0.77, -0.28);
  cockpit.castShadow = true;
  rover.add(cockpit);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.05, 6), armorMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.34, 1.42);
  nose.castShadow = true;
  rover.add(nose);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 2.65), cyan);
  spine.position.set(0, 0.83, 0.05);
  rover.add(spine);

  const underglow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.05), new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.24, side: THREE.DoubleSide }));
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.04;
  underglow.userData.pulse = true;
  rover.add(underglow);

  const podPositions = [
    [-1.02, 0.18, 0.86], [1.02, 0.18, 0.86], [-1.02, 0.18, -0.86], [1.02, 0.18, -0.86],
  ];
  podPositions.forEach(([x, y, z], index) => {
    const pod = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.07, 8, 32), index % 2 ? pink : cyan);
    pod.rotation.x = Math.PI / 2;
    pod.position.set(x, y, z);
    pod.userData.rotor = true;
    rover.add(pod);
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.12), armorMat);
    strut.position.set(x * 0.52, y + 0.08, z);
    strut.rotation.z = x > 0 ? -0.18 : 0.18;
    strut.castShadow = true;
    rover.add(strut);
  });

  const leftLight = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.06), cyan);
  leftLight.position.set(-0.34, 0.42, 1.78);
  const rightLight = leftLight.clone();
  rightLight.position.x = 0.34;
  rover.add(leftLight, rightLight);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.08, 0.28), pink);
  tail.position.set(0, 0.68, -1.46);
  tail.castShadow = true;
  rover.add(tail);

  const point = new THREE.PointLight(0x00e5ff, 2.2, 8, 1.4);
  point.position.set(0, 0.45, 0.1);
  rover.add(point);

  return rover;
}

function updateCamera(camera: THREE.PerspectiveCamera, car: THREE.Group) {
  const angle = car.rotation.y;
  const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  const targetPosition = car.position.clone().add(forward.clone().multiplyScalar(-8.2)).add(new THREE.Vector3(0, 5.9, 0));
  camera.position.lerp(targetPosition, 0.07);
  const lookAt = car.position.clone().add(new THREE.Vector3(0, 1.1, 0)).add(forward.clone().multiplyScalar(3.4));
  camera.lookAt(lookAt);
}

function animateWorld(world: THREE.Group, elapsed: number) {
  world.traverse((object) => {
    if (object.userData.spin) {
      object.rotation.y += 0.012;
      object.position.y += Math.sin(elapsed * 2.6 + object.position.x) * 0.0015;
    }
    if (object.userData.pulse) {
      const pulse = 1 + Math.sin(elapsed * 4.5 + object.position.x + object.position.z) * 0.06;
      object.scale.setScalar(pulse);
    }
  });
}

function getActiveZone(x: number, z: number) {
  return zones.find((zone) => {
    const [zx, zz] = zone.position;
    return Math.hypot(x - zx, z - zz) < 5.5;
  });
}
