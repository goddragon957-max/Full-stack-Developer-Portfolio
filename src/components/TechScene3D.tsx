import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const sceneLabels = [
  { title: 'React', detail: 'TypeScript UI', className: 'label-react' },
  { title: 'Spring Boot', detail: 'Java REST API', className: 'label-spring' },
  { title: 'PostgreSQL', detail: 'MyBatis / Data', className: 'label-db' },
  { title: 'AWP · BIM', detail: 'xeokit / XKT', className: 'label-bim' },
];

export function TechScene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xbfd5ff, 1.2);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);

    const violet = new THREE.PointLight(0x8b5cf6, 32, 18);
    violet.position.set(-3.6, 1.7, 3.8);
    scene.add(violet);

    const cyan = new THREE.PointLight(0x22d3ee, 24, 16);
    cyan.position.set(3.8, -0.2, 3.4);
    scene.add(cyan);

    const group = new THREE.Group();
    scene.add(group);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa78bfa,
      roughness: 0.18,
      metalness: 0.12,
      transmission: 0.35,
      thickness: 0.8,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, 3), coreMaterial);
    core.rotation.set(0.4, 0.1, -0.15);
    group.add(core);

    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 1.35, 1.35, 3, 3, 3),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35, metalness: 0.45, wireframe: true, transparent: true, opacity: 0.42 }),
    );
    inner.rotation.set(0.2, 0.62, 0.18);
    group.add(inner);

    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.28, metalness: 0.42, transparent: true, opacity: 0.72 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.015, 12, 120), ringMaterial);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.28, 0.011, 12, 120), ringMaterial.clone());
    ringA.rotation.set(1.18, 0.12, 0.42);
    ringB.rotation.set(0.28, 1.22, -0.28);
    group.add(ringA, ringB);

    const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.38, metalness: 0.28 });
    const accentMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x61dafb, roughness: 0.25, metalness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.3, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.34, metalness: 0.12 }),
      new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.28, metalness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.34, metalness: 0.16 }),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.26, metalness: 0.2 }),
    ];

    const nodePositions = [
      new THREE.Vector3(-2.55, 0.88, 0.18),
      new THREE.Vector3(-1.25, -1.22, 0.48),
      new THREE.Vector3(1.2, -1.14, -0.15),
      new THREE.Vector3(2.65, 0.62, 0.08),
      new THREE.Vector3(0.18, 1.82, -0.52),
      new THREE.Vector3(0.0, -2.0, -0.5),
    ];

    nodePositions.forEach((position, index) => {
      const geometry = index % 3 === 0
        ? new THREE.BoxGeometry(0.42, 0.42, 0.42)
        : index % 3 === 1
          ? new THREE.CylinderGeometry(0.24, 0.24, 0.52, 28)
          : new THREE.SphereGeometry(0.27, 32, 16);
      const node = new THREE.Mesh(geometry, accentMaterials[index] ?? nodeMaterial);
      node.position.copy(position);
      node.userData.floatPhase = index * 0.9;
      group.add(node);

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), position]);
      const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.2 }),
      );
      group.add(line);
    });

    const grid = new THREE.GridHelper(8, 22, 0x334155, 0x1e293b);
    grid.position.y = -2.38;
    grid.material.transparent = true;
    grid.material.opacity = 0.26;
    group.add(grid);

    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.025, transparent: true, opacity: 0.48 }),
    );
    scene.add(particles);

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

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('pointermove', handlePointerMove);

    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = elapsed * 0.18 + pointer.current.x * 0.18;
      group.rotation.x = -0.08 + pointer.current.y * 0.08;
      core.rotation.y = elapsed * 0.42;
      core.rotation.x = 0.35 + Math.sin(elapsed * 0.65) * 0.12;
      inner.rotation.x = elapsed * 0.25;
      inner.rotation.z = elapsed * 0.2;
      ringA.rotation.z = elapsed * 0.22;
      ringB.rotation.x = 0.24 + elapsed * 0.16;
      particles.rotation.y = elapsed * 0.025;
      particles.rotation.x = Math.sin(elapsed * 0.12) * 0.03;
      camera.position.x += (pointer.current.x * 0.28 - camera.position.x) * 0.045;
      camera.position.y += (0.35 - pointer.current.y * 0.16 - camera.position.y) * 0.045;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      mount.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
    };
  }, []);

  return (
    <section className="tech-scene" data-hero-3d="spline-inspired" aria-label="Spline inspired 3D stack scene">
      <div className="scene-glow scene-glow-a" />
      <div className="scene-glow scene-glow-b" />
      <div className="scene-grid" />
      <div className="scene-canvas" ref={mountRef} />
      <div className="scene-labels" aria-label="main stack labels">
        {sceneLabels.map((item) => (
          <div className={`scene-label ${item.className}`} key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </div>
        ))}
      </div>
      <div className="scene-footer">
        <span>3D Stack Scene</span>
        <strong>Spring · React · DB · BIM</strong>
      </div>
    </section>
  );
}
