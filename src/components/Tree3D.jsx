import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, Sparkles, ZoomIn } from 'lucide-react';

// Color themes and procedural parameters per tree type
const TREE_CONFIGS = {
  oak: {
    trunkColor: '#3a2312',
    leafColors: ['#10b981', '#34d399', '#059669', '#047857', '#6ee7b7'],
    foliageScale: [1.2, 1.1, 1.2],
    glowColor: '#34d399',
    particleColor: '#a7f3d0',
    pedestalColor: '#064e3b',
    canopyType: 'broad',
    leafCount: 38,
  },
  pine: {
    trunkColor: '#2b1d0c',
    leafColors: ['#0d9488', '#06b6d4', '#14b8a6', '#0f766e', '#38bdf8'],
    foliageScale: [0.9, 1.4, 0.9],
    glowColor: '#38bdf8',
    particleColor: '#bae6fd',
    pedestalColor: '#083344',
    canopyType: 'conical',
    leafCount: 42,
  },
  maple: {
    trunkColor: '#3d2516',
    leafColors: ['#f97316', '#ef4444', '#f59e0b', '#dc2626', '#fbbf24'],
    foliageScale: [1.25, 1.05, 1.25],
    glowColor: '#f97316',
    particleColor: '#fed7aa',
    pedestalColor: '#451a03',
    canopyType: 'broad',
    leafCount: 40,
  },
  sakura: {
    trunkColor: '#38231e',
    leafColors: ['#f472b6', '#fb7185', '#fda4af', '#ec4899', '#ffe4e6'],
    foliageScale: [1.15, 1.15, 1.15],
    glowColor: '#f472b6',
    particleColor: '#fbcfe8',
    pedestalColor: '#500724',
    canopyType: 'blossom',
    leafCount: 45,
  },
};

// Generates glowing circular sprite for firefly particles without external assets
const makeGlowSprite = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

const Tree3D = ({ treeType = 'oak', quantity = 1 }) => {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // High-performance WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false; // Prevents massive frame drops during 3D rotation
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.0);
    camera.lookAt(0, -0.45, 0);

    // Tree Group
    const treeGroup = new THREE.Group();
    // Lowered so the entire 3D tree sits below the info text in the open space
    treeGroup.position.y = -0.7;
    scene.add(treeGroup);

    // Config for chosen tree
    const cfg = TREE_CONFIGS[treeType] || TREE_CONFIGS.oak;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    dirLight.position.set(4, 7, 5);
    scene.add(dirLight);

    // Inner canopy bioluminescent glow
    const innerGlow = new THREE.PointLight(cfg.glowColor, 2.4, 4.5);
    innerGlow.position.set(0, 1.5, 0);
    treeGroup.add(innerGlow);

    // Rim light from bottom
    const rimLight = new THREE.PointLight(cfg.glowColor, 1.2, 3);
    rimLight.position.set(0, -0.5, 0);
    treeGroup.add(rimLight);

    // ───────── PEDESTAL / ISLAND BASE ─────────
    const baseGroup = new THREE.Group();
    treeGroup.add(baseGroup);

    // Island disc
    const islandGeo = new THREE.CylinderGeometry(1.65, 1.35, 0.25, 36);
    const islandMat = new THREE.MeshStandardMaterial({
      color: '#081420',
      roughness: 0.8,
      metalness: 0.2,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1.2;
    island.receiveShadow = true;
    baseGroup.add(island);

    // Glowing Neon Ring around island
    const ringGeo = new THREE.TorusGeometry(1.72, 0.025, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: cfg.glowColor,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.18;
    baseGroup.add(ring);

    // Moss top layer
    const mossGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.05, 36);
    const mossMat = new THREE.MeshStandardMaterial({
      color: cfg.pedestalColor,
      roughness: 0.9,
    });
    const moss = new THREE.Mesh(mossGeo, mossMat);
    moss.position.y = -1.06;
    baseGroup.add(moss);

    // ───────── PROCEDURAL TRUNK & BRANCHES ─────────
    const trunkMat = new THREE.MeshStandardMaterial({
      color: cfg.trunkColor,
      roughness: 0.85,
      metalness: 0.1,
    });

    const isPine = cfg.canopyType === 'conical';
    const trunkHeight = isPine ? 2.5 : 1.9;
    const trunkRadiusTop = isPine ? 0.08 : 0.18;
    const trunkRadiusBottom = isPine ? 0.24 : 0.32;

    const mainTrunkGeo = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 14);
    const mainTrunk = new THREE.Mesh(mainTrunkGeo, trunkMat);
    mainTrunk.position.y = -1.05 + trunkHeight / 2;
    mainTrunk.castShadow = true;
    mainTrunk.receiveShadow = true;
    treeGroup.add(mainTrunk);

    // Spreading branches (Oak, Maple, Sakura)
    if (!isPine) {
      const branchesData = [
        { len: 0.85, r: 0.11, rotX: 0.45, rotY: 0.2, rotZ: 0.55, y: -0.1 },
        { len: 0.75, r: 0.1, rotX: -0.35, rotY: 1.8, rotZ: -0.45, y: 0.15 },
        { len: 0.7, r: 0.09, rotX: 0.3, rotY: -1.5, rotZ: -0.5, y: 0.3 },
        { len: 0.65, r: 0.08, rotX: -0.4, rotY: 3.1, rotZ: 0.4, y: 0.45 },
      ];

      branchesData.forEach((b) => {
        const bGeo = new THREE.CylinderGeometry(b.r * 0.6, b.r, b.len, 10);
        const branch = new THREE.Mesh(bGeo, trunkMat);
        branch.position.set(0, b.y, 0);
        branch.rotation.set(b.rotX, b.rotY, b.rotZ);
        branch.translateY(b.len / 2);
        branch.castShadow = true;
        treeGroup.add(branch);
      });
    }

    // ───────── PROCEDURAL FOLIAGE ─────────
    const foliageGroup = new THREE.Group();
    treeGroup.add(foliageGroup);

    const foliageMeshes = [];

    if (isPine) {
      // Conical tiered layers for Pine
      const tiers = 6;
      for (let t = 0; t < tiers; t++) {
        const ratio = t / (tiers - 1);
        const radius = (1 - ratio * 0.75) * 1.05;
        const tierHeight = 0.55;
        const coneGeo = new THREE.ConeGeometry(radius, tierHeight, 14);
        const col = new THREE.Color(cfg.leafColors[t % cfg.leafColors.length]);
        const coneMat = new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.6,
          metalness: 0.1,
          flatShading: true,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = -0.5 + t * 0.42;
        cone.castShadow = true;
        foliageGroup.add(cone);
        foliageMeshes.push({ mesh: cone, baseScale: 1, offset: t });
      }
    } else {
      // Multi-cluster volumetric organic canopy
      const totalBlobs = cfg.leafCount;
      const palette = cfg.leafColors.map((c) => new THREE.Color(c));

      for (let i = 0; i < totalBlobs; i++) {
        // Deterministic organic distribution
        const theta = (i * 2.399963) % (Math.PI * 2);
        const phi = Math.acos(1 - (2 * (i + 0.5)) / totalBlobs);
        const dist = 0.55 + ((i * 13) % 45) / 90;

        const bx = Math.sin(phi) * Math.cos(theta) * dist * cfg.foliageScale[0];
        const by = 0.75 + Math.cos(phi) * dist * cfg.foliageScale[1] * 0.85;
        const bz = Math.sin(phi) * Math.sin(theta) * dist * cfg.foliageScale[2];

        const blobRadius = 0.32 + ((i * 7) % 20) / 75;
        const blobGeo = new THREE.DodecahedronGeometry(blobRadius, 1);
        const blobColor = palette[i % palette.length];

        const blobMat = new THREE.MeshStandardMaterial({
          color: blobColor,
          roughness: 0.45,
          metalness: 0.08,
          flatShading: true,
        });

        const blobMesh = new THREE.Mesh(blobGeo, blobMat);
        blobMesh.position.set(bx, by, bz);
        blobMesh.rotation.set((i * 1.3) % 3, (i * 0.9) % 3, (i * 1.7) % 3);
        blobMesh.castShadow = true;
        foliageGroup.add(blobMesh);
        foliageMeshes.push({ mesh: blobMesh, baseScale: 1, offset: i * 0.35 });
      }
    }

    // ───────── GLOWING FIREFLY PARTICLES ─────────
    const sprite = makeGlowSprite();
    const particleCount = 70;
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const rad = 0.6 + Math.random() * 1.5;
      const th = Math.random() * Math.PI * 2;
      const py = -0.5 + Math.random() * 2.6;
      particlePos[i * 3] = Math.cos(th) * rad;
      particlePos[i * 3 + 1] = py;
      particlePos[i * 3 + 2] = Math.sin(th) * rad;
      particleSpeeds.push({
        angle: th,
        dist: rad,
        speed: 0.3 + Math.random() * 0.7,
        yBase: py,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: sprite,
      transparent: true,
      color: new THREE.Color(cfg.particleColor),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    treeGroup.add(particles);

    // ───────── INTERACTIVE CONTROLS ─────────
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetZoom = 5.2;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      velX = 0;
      velY = 0;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      velX = deltaX * 0.012;
      velY = deltaY * 0.009;
      targetRotY += velX;
      targetRotX = Math.max(-0.4, Math.min(0.5, targetRotX + velY));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      targetZoom = Math.max(3.5, Math.min(7.0, targetZoom + e.deltaY * 0.003));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize handler
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ───────── RENDER LOOP ─────────
    let raf = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (typeof document !== 'undefined' && document.hidden) return;
      const elapsed = clock.getElapsedTime();

      // Inertia and gentle idle auto-rotation
      if (!isDragging) {
        velX *= 0.94;
        velY *= 0.94;
        targetRotY += velX + 0.0035;
        targetRotX = Math.max(-0.4, Math.min(0.5, targetRotX + velY));
      }

      // Snappy responsiveness when dragging (0.25), smooth glide when idle (0.08)
      const lerpFactor = isDragging ? 0.32 : 0.08;
      treeGroup.rotation.y += (targetRotY - treeGroup.rotation.y) * lerpFactor;
      treeGroup.rotation.x += (targetRotX - treeGroup.rotation.x) * lerpFactor;
      camera.position.z += (targetZoom - camera.position.z) * 0.12;

      // Foliage gentle wind wave
      foliageMeshes.forEach((item) => {
        const sway = Math.sin(elapsed * 1.6 + item.offset) * 0.035;
        item.mesh.rotation.z = sway;
      });

      // Fireflies floating animation
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const sp = particleSpeeds[i];
        sp.angle += 0.015 * sp.speed;
        posArr[i * 3] = Math.cos(sp.angle) * sp.dist;
        posArr[i * 3 + 1] = sp.yBase + Math.sin(elapsed * 2 + sp.phase) * 0.15;
        posArr[i * 3 + 2] = Math.sin(sp.angle) * sp.dist;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Glow light subtle pulsation
      innerGlow.intensity = 2.0 + Math.sin(elapsed * 3) * 0.6;
      ringMat.opacity = 0.6 + Math.sin(elapsed * 2.5) * 0.3;

      camera.lookAt(0, -0.45, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      sprite.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [treeType, quantity]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden rounded-[2.35rem]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Interactive Controls Overlay Hint (Floating at bottom of 3D canvas) */}
      <div className="hidden sm:flex absolute bottom-4 inset-x-6 z-20 justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-mist shadow-lg">
          <Sparkles size={13} className="text-signal animate-pulse" />
          <span>Sichqoncha bilan 360° aylantiring</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-moss/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-mist">
          <ZoomIn size={13} />
          <span>Scroll: Zoom</span>
        </div>
      </div>
    </div>
  );
};

export default Tree3D;
