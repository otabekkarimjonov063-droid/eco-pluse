import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Soft round sprite so points look like glowing dots (no external assets)
const makeSprite = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.8)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
};

// Pseudo-continents: smooth function on the sphere, thresholded
const isLand = (lat, lon) =>
  Math.sin(3 * lat + 1) * Math.cos(2 * lon) +
    0.5 * Math.sin(5 * lon + lat) +
    0.3 * Math.cos(7 * lat - 2 * lon) >
  0.25;

const CITIES = [
  [41.3, 69.2], [51.5, -0.1], [40.7, -74], [35.7, 139.7], [28.6, 77.2],
  [-33.9, 151.2], [-23.5, -46.6], [30, 31.2], [55.7, 37.6], [39.9, 116.4],
];

const toVec = (lat, lon, r) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const th = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(th),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(th)
  );
};

const Globe3D = () => {
  const mountRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isMobile = window.innerWidth < 768;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3.6;

    const sprite = makeSprite();
    const globe = new THREE.Group();
    scene.add(globe);

    // Dotted planet
    const N = isMobile ? 4500 : 9000;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const land = new THREE.Color('#e6d3a3');
    const sea = new THREE.Color('#2b5953');
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      const lat = Math.asin(y);
      const lon = Math.atan2(Math.sin(th) * rad, Math.cos(th) * rad);
      pos.set([Math.cos(th) * rad, y, Math.sin(th) * rad], i * 3);
      const c = isLand(lat, lon) ? land : sea;
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const dots = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.028, map: sprite, vertexColors: true, transparent: true,
        depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95,
      })
    );
    globe.add(dots);

    // Dark core so the back of the globe doesn't show through
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.985, 48, 48), new THREE.MeshBasicMaterial({ color: '#040a09' })));

    // Atmosphere glow (fresnel)
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 48, 48),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vN; void main(){ float i = pow(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.62,0.80,0.74,1.0)*i; }',
      })
    );
    scene.add(atmo);

    // Pulsing city markers
    const markers = CITIES.map(([lat, lon], i) => {
      const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: '#fff1cc', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      m.position.copy(toVec(lat, lon, 1.02));
      m.userData.phase = i * 0.7;
      globe.add(m);
      return m;
    });

    // Orbit ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.45, 1.452, 128),
      new THREE.MeshBasicMaterial({ color: '#d9c08a', transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2.3;
    scene.add(ring);

    // Stars
    const SN = isMobile ? 250 : 600;
    const sp = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      const r = 12 + ((i * 53) % 20);
      const a = i * 2.399963, b = Math.acos(1 - 2 * (((i * 0.618) % 1)));
      sp.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.08, map: sprite, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(stars);

    // Interaction
    const mouse = { x: 0, y: 0 };
    const spot = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      spot.tx = e.clientX;
      spot.ty = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const place = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = w >= 1024;
      globe.position.x = atmo.position.x = ring.position.x = wide ? 0.95 : 0;
      globe.position.y = atmo.position.y = ring.position.y = wide ? 0 : 0.5;
    };
    place();
    window.addEventListener('resize', place);

    let raf = 0, t = 0, last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const sy = window.scrollY;
      globe.rotation.y += dt * (reduce ? 0.02 : 0.12);
      globe.rotation.x += ((mouse.y * 0.25 + sy * 0.0003) - globe.rotation.x) * 0.08;
      globe.rotation.z += ((-mouse.x * 0.08) - globe.rotation.z) * 0.08;
      const z = 3.6 - Math.min(sy / 1400, 1) * 0.9;
      camera.position.z += (z - camera.position.z) * 0.06;
      ring.rotation.z += dt * 0.08;
      stars.rotation.y += dt * 0.004;
      markers.forEach((m) => {
        const s = 0.07 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2.2 + m.userData.phase));
        m.scale.set(s, s, 1);
      });
      spot.x += (spot.tx - spot.x) * 0.08;
      spot.y += (spot.ty - spot.y) * 0.08;
      if (spotRef.current) spotRef.current.style.transform = `translate(${spot.x}px, ${spot.y}px)`;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    // Pause when tab hidden (saves CPU/GPU)
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', place);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
      sprite.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
      <div
        ref={spotRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[5] pointer-events-none hidden md:block"
        style={{
          width: 560, height: 560, margin: '-280px 0 0 -280px',
          background: 'radial-gradient(circle, rgba(217,192,138,0.10), transparent 65%)',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default Globe3D;
