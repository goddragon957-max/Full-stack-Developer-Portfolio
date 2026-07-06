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
  chips: string[];
};

const zones: Zone[] = [
  {
    id: 'stack',
    title: 'STACK GARAGE',
    subtitle: 'Java · Spring Boot · React · TypeScript',
    description: '주요 스택을 먼저 보여주는 차고입니다. 화면, API, DB, 서버 흐름을 같이 다룹니다.',
    position: [-13, -10],
    color: 0x38bdf8,
    chips: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'MyBatis'],
  },
  {
    id: 'career',
    title: 'CAREER ROAD',
    subtitle: '6년+ 웹 개발·운영',
    description: 'PHP/CodeIgniter 유지보수에서 문자 발송 서버, 앱 API, AWP 업무 시스템까지 이어진 경력입니다.',
    position: [13, -9],
    color: 0xf97316,
    chips: ['PHP', 'CodeIgniter', 'REST API', 'Vue.js', 'AWS', 'Linux'],
  },
  {
    id: 'bim',
    title: 'BIM YARD',
    subtitle: 'AWP · BIM · 3D Viewer',
    description: 'Workpackage, IWP, 도면, 문서, MTO, 리비전 이력과 3D/BIM 뷰어 상태를 함께 다룹니다.',
    position: [13, 10],
    color: 0xa78bfa,
    chips: ['AWP', 'BIM', 'xeokit', 'XKT', 'Three.js', 'tile/LOD'],
  },
  {
    id: 'contact',
    title: 'CONTACT GATE',
    subtitle: 'GitHub · Career evidence',
    description: '포트폴리오 목적지는 기술 스택과 경력 근거입니다. 필요하면 GitHub와 경력 섹션으로 연결합니다.',
    position: [-13, 10],
    color: 0x22c55e,
    chips: ['GitHub', 'Portfolio', 'Career', 'Contact'],
  },
];

const defaultZone = {
  id: 'intro' as ZoneId,
  title: 'USY DEV CIRCUIT',
  subtitle: 'Bruno-inspired interactive portfolio',
  description: '차를 직접 몰고 주요 스택, 경력, AWP/BIM 구역을 둘러보는 3D 포트폴리오입니다.',
  chips: ['WASD', 'Arrow Keys', 'Drive', 'Explore'],
};

function makeTextSprite(lines: string[], options: { color?: string; bg?: string; width?: number; height?: number } = {}) {
  const width = options.width ?? 640;
  const height = options.height ?? 240;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = options.bg ?? 'rgba(8, 13, 31, 0.88)';
  roundRect(ctx, 12, 12, width - 24, height - 24, 34);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = options.color ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 58px Pretendard, Inter, Arial, sans-serif';
  ctx.fillText(lines[0] ?? '', width / 2, height * 0.42);
  ctx.font = '760 31px Pretendard, Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.76)';
  ctx.fillText(lines[1] ?? '', width / 2, height * 0.66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(4.7, 1.78, 1);
  return sprite;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
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
    scene.background = new THREE.Color(0xbcecff);
    scene.fog = new THREE.Fog(0xbcecff, 28, 78);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    camera.position.set(0, 8, -12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x78a56d, 2.2);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 3.4);
    sun.position.set(-12, 20, -10);
    sun.castShadow = true;
    sun.shadow.camera.left = -35;
    sun.shadow.camera.right = 35;
    sun.shadow.camera.top = 35;
    sun.shadow.camera.bottom = -35;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);

    const world = new THREE.Group();
    scene.add(world);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshStandardMaterial({ color: 0x8fd6b2, roughness: 0.78 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.add(ground);

    addRoads(world);
    addTrackMarks(world);
    addProps(world);
    addStations(world);

    const car = createCar();
    car.position.set(0, 0.38, -2);
    world.add(car);

    const startSign = makeTextSprite(['엄신용', 'Full-stack Developer']);
    startSign.position.set(0, 3.2, -7.2);
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
      updateCar(car, delta);
      updateCamera(camera, car);
      animateWorld(world, clock.elapsedTime);
      renderer.render(scene, camera);

      hudFrame += 1;
      if (hudFrame % 8 === 0) {
        const activeZone = getActiveZone(carState.current.x, carState.current.z);
        setHud({
          zone: activeZone ?? defaultZone,
          speed: Math.round(Math.abs(carState.current.speed) * 280),
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

    function updateCar(carObject: THREE.Group, delta: number) {
      const state = carState.current;
      const accelerating = pressed('ArrowUp', 'KeyW');
      const reversing = pressed('ArrowDown', 'KeyS');
      const turningLeft = pressed('ArrowLeft', 'KeyA');
      const turningRight = pressed('ArrowRight', 'KeyD');
      const braking = pressed('Space');

      if (accelerating) state.speed += 13 * delta;
      if (reversing) state.speed -= 9 * delta;
      if (braking) state.speed *= 0.82;
      state.speed *= Math.pow(0.9, delta * 24);
      state.speed = THREE.MathUtils.clamp(state.speed, -2.25, 3.25);

      const steerPower = THREE.MathUtils.clamp(Math.abs(state.speed) / 2.2, 0.18, 1);
      if (turningLeft) state.angle += 2.35 * delta * steerPower * Math.sign(state.speed || 1);
      if (turningRight) state.angle -= 2.35 * delta * steerPower * Math.sign(state.speed || 1);

      state.x += Math.sin(state.angle) * state.speed * delta * 3.15;
      state.z += Math.cos(state.angle) * state.speed * delta * 3.15;
      state.x = THREE.MathUtils.clamp(state.x, -26, 26);
      state.z = THREE.MathUtils.clamp(state.z, -26, 26);

      carObject.position.set(state.x, 0.38 + Math.sin(clock.elapsedTime * 11) * Math.abs(state.speed) * 0.015, state.z);
      carObject.rotation.y = state.angle;
      carObject.children.forEach((child) => {
        if (child.userData.wheel) child.rotation.x -= state.speed * delta * 8;
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
      data-game-world="bruno-inspired"
      data-active-zone={hud.zone.id}
      data-car-x={hud.x}
      data-car-z={hud.z}
      data-speed={hud.speed}
      aria-label="Bruno Simon inspired drivable portfolio world"
    >
      <div ref={mountRef} className="game-canvas" />

      <div className="game-topbar">
        <div>
          <span>USY DEV CIRCUIT</span>
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

      <aside className="zone-card" id={hud.zone.id}>
        <p className="zone-eyebrow">현재 구역</p>
        <h1>{hud.zone.title}</h1>
        <strong>{hud.zone.subtitle}</strong>
        <p>{hud.zone.description}</p>
        <div className="zone-chips">
          {hud.zone.chips.map((chip) => <span key={chip}>{chip}</span>)}
        </div>
      </aside>

      <div className="game-hud">
        <div><span>SPEED</span><strong>{hud.speed}</strong></div>
        <div><span>POS</span><strong>{hud.x}, {hud.z}</strong></div>
        <div><span>ZONE</span><strong>{hud.zone.id.toUpperCase()}</strong></div>
      </div>

      <div className="mini-map" aria-label="mini map">
        {zones.map((zone) => (
          <span
            className={`map-zone ${hud.zone.id === zone.id ? 'active' : ''}`}
            key={zone.id}
            style={{ left: `${((zone.position[0] + 26) / 52) * 100}%`, top: `${((zone.position[1] + 26) / 52) * 100}%` }}
          />
        ))}
        <span className="map-car" style={{ left: `${((hud.x + 26) / 52) * 100}%`, top: `${((hud.z + 26) / 52) * 100}%` }} />
      </div>

      <div className="control-help">
        <span>Drive with</span>
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

function addRoads(world: THREE.Group) {
  const material = new THREE.MeshStandardMaterial({ color: 0x2f3a45, roughness: 0.74 });
  const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const roads = [
    { x: 0, z: 0, w: 44, h: 5.2, r: 0 },
    { x: 0, z: 0, w: 5.2, h: 44, r: 0 },
    { x: -13, z: -10, w: 11, h: 4.8, r: Math.PI / 5 },
    { x: 13, z: -9, w: 11, h: 4.8, r: -Math.PI / 5 },
    { x: 13, z: 10, w: 11, h: 4.8, r: Math.PI / 5 },
    { x: -13, z: 10, w: 11, h: 4.8, r: -Math.PI / 5 },
  ];
  roads.forEach((road) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(road.w, road.h), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = road.r;
    mesh.position.set(road.x, 0.018, road.z);
    mesh.receiveShadow = true;
    world.add(mesh);
  });

  for (let i = -18; i <= 18; i += 4) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.12), stripeMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(i, 0.04, 0);
    world.add(dash);
    const dashV = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.35), stripeMaterial);
    dashV.rotation.x = -Math.PI / 2;
    dashV.position.set(0, 0.04, i);
    world.add(dashV);
  }
}

function addTrackMarks(world: THREE.Group) {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.4, 0.04, 8, 96), material);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.06;
  world.add(ring);
}

function addProps(world: THREE.Group) {
  const treeTrunk = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
  const treeTop = new THREE.MeshStandardMaterial({ color: 0x1f9d55, roughness: 0.68 });
  const positions = [
    [-22, -17], [-18, 16], [19, -18], [22, 18], [-7, -20], [7, 20], [-21, 2], [21, -2],
  ];
  positions.forEach(([x, z], index) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.2, 8), treeTrunk);
    trunk.position.set(x, 0.6, z);
    trunk.castShadow = true;
    world.add(trunk);
    const top = new THREE.Mesh(index % 2 ? new THREE.DodecahedronGeometry(1.05) : new THREE.ConeGeometry(1.05, 2, 8), treeTop);
    top.position.set(x, 1.65, z);
    top.castShadow = true;
    world.add(top);
  });

  const blockMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.58 });
  for (let i = 0; i < 12; i += 1) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25 + (i % 3) * 0.35, 1.4), blockMat.clone());
    block.position.set(-22 + i * 4, 0.15 + (i % 3) * 0.18, i % 2 ? 22 : -22);
    block.castShadow = true;
    block.receiveShadow = true;
    world.add(block);
  }
}

function addStations(world: THREE.Group) {
  zones.forEach((zone) => {
    const [x, z] = zone.position;
    const baseMat = new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.52, metalness: 0.08 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.45, 4.7), baseMat);
    base.position.set(x, 0.22, z);
    base.castShadow = true;
    base.receiveShadow = true;
    world.add(base);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.62 });
    for (let i = 0; i < 4; i += 1) {
      const sx = i < 2 ? -2.35 : 2.35;
      const sz = i % 2 ? -1.55 : 1.55;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.4, 0.38), pillarMat);
      pillar.position.set(x + sx, 1.42, z + sz);
      pillar.castShadow = true;
      world.add(pillar);
    }

    const sign = makeTextSprite([zone.title, zone.subtitle], { color: '#ffffff' });
    sign.position.set(x * 0.82, 3.12, z - 2.85);
    world.add(sign);

    const trophy = new THREE.Mesh(
      zone.id === 'bim' ? new THREE.IcosahedronGeometry(1.2, 0) : new THREE.BoxGeometry(1.8, 1.8, 1.8),
      new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.28, metalness: 0.22 }),
    );
    trophy.position.set(x, 1.55, z + 0.45);
    trophy.rotation.set(0.2, 0.4, 0.1);
    trophy.castShadow = true;
    trophy.userData.spin = true;
    world.add(trophy);
  });
}

function createCar() {
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff4d2e, roughness: 0.42, metalness: 0.12 });
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.24, metalness: 0.18 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.58 });
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.42, 2.38), bodyMat);
  body.position.y = 0.22;
  body.castShadow = true;
  car.add(body);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.28, 0.9), bodyMat);
  hood.position.set(0, 0.47, 0.48);
  hood.castShadow = true;
  car.add(hood);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.62, 0.86), cabinMat);
  cabin.position.set(0, 0.78, -0.32);
  cabin.castShadow = true;
  car.add(cabin);

  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.12, 0.24), blackMat);
  spoiler.position.set(0, 0.82, -1.22);
  spoiler.castShadow = true;
  car.add(spoiler);

  const lightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.08), lightMat);
  lightLeft.position.set(-0.42, 0.36, 1.23);
  const lightRight = lightLeft.clone();
  lightRight.position.x = 0.42;
  car.add(lightLeft, lightRight);

  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.28, 24);
  const wheelPositions = [
    [-0.9, 0.08, 0.78], [0.9, 0.08, 0.78], [-0.9, 0.08, -0.78], [0.9, 0.08, -0.78],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, blackMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    wheel.userData.wheel = true;
    car.add(wheel);
  });

  return car;
}

function updateCamera(camera: THREE.PerspectiveCamera, car: THREE.Group) {
  const angle = car.rotation.y;
  const forward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  const targetPosition = car.position.clone().add(forward.clone().multiplyScalar(-8.4)).add(new THREE.Vector3(0, 5.6, 0));
  camera.position.lerp(targetPosition, 0.075);
  const lookAt = car.position.clone().add(new THREE.Vector3(0, 1.2, 0)).add(forward.clone().multiplyScalar(3.2));
  camera.lookAt(lookAt);
}

function animateWorld(world: THREE.Group, elapsed: number) {
  world.traverse((object) => {
    if (object.userData.spin) {
      object.rotation.y += 0.018;
      object.position.y += Math.sin(elapsed * 2.4 + object.position.x) * 0.002;
    }
  });
}

function getActiveZone(x: number, z: number) {
  return zones.find((zone) => {
    const [zx, zz] = zone.position;
    return Math.hypot(x - zx, z - zz) < 5.4;
  });
}
