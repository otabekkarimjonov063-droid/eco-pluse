import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const R = 2.2

const dotsVert = `
uniform float uTime; uniform float uPx;
attribute float aSeed;
varying float vY; varying float vFacing;
void main(){
  vec3 p = position;
  float wave = sin(uTime*0.8 + p.y*3.0 + aSeed*6.2831)*0.022;
  p += normalize(position)*wave;
  vec4 mv = modelViewMatrix*vec4(p,1.0);
  vec3 n = normalize(normalMatrix*normalize(position));
  vFacing = dot(n, normalize(-mv.xyz));
  vY = position.y/${R.toFixed(1)};
  gl_PointSize = (1.5 + aSeed*1.7) * uPx * (10.5 / -mv.z);
  gl_Position = projectionMatrix*mv;
}`

const dotsFrag = `
uniform vec3 uA; uniform vec3 uB;
varying float vY; varying float vFacing;
void main(){
  float d = length(gl_PointCoord-0.5);
  if(d>0.5) discard;
  float a = smoothstep(0.5,0.1,d);
  float face = smoothstep(-0.1,0.85,vFacing);
  vec3 c = mix(uA,uB,vY*0.5+0.5);
  gl_FragColor = vec4(c, a*(0.1+0.9*face));
}`

const rimVert = `
varying vec3 vN; varying vec3 vV;
void main(){
  vec4 mv = modelViewMatrix*vec4(position,1.0);
  vN = normalize(normalMatrix*normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`

const rimFrag = `
uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(1.0-max(dot(vN,vV),0.0), 3.2);
  gl_FragColor = vec4(uColor, f*0.55);
}`

export default function Globe3D({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const px = Math.min(window.devicePixelRatio || 1, 1.75)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(px)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 10.5)

    const world = new THREE.Group()
    world.rotation.z = THREE.MathUtils.degToRad(-12)
    scene.add(world)
    const globe = new THREE.Group()
    world.add(globe)

    // Dots on a Fibonacci sphere
    const N = mobile ? 5000 : 12000
    const pos = new Float32Array(N * 3)
    const seed = new Float32Array(N)
    const ga = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = ga * i
      pos[i * 3] = Math.cos(th) * r * R
      pos[i * 3 + 1] = y * R
      pos[i * 3 + 2] = Math.sin(th) * r * R
      seed[i] = Math.random()
    }
    const dotsGeo = new THREE.BufferGeometry()
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    dotsGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    const dotsMat = new THREE.ShaderMaterial({
      vertexShader: dotsVert,
      fragmentShader: dotsFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPx: { value: px },
        uA: { value: new THREE.Color('#2fb08c') },
        uB: { value: new THREE.Color('#d6ffe4') },
      },
    })
    globe.add(new THREE.Points(dotsGeo, dotsMat))

    // Invisible core: writes depth only, hides the dots on the far side
    const coreGeo = new THREE.SphereGeometry(R * 0.985, 48, 48)
    const coreMat = new THREE.MeshBasicMaterial({ colorWrite: false })
    scene.add(new THREE.Mesh(coreGeo, coreMat))

    // Fresnel rim light
    const rimGeo = new THREE.SphereGeometry(R * 1.03, 64, 64)
    const rimMat = new THREE.ShaderMaterial({
      vertexShader: rimVert,
      fragmentShader: rimFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#5ff0c0') } },
    })
    scene.add(new THREE.Mesh(rimGeo, rimMat))

    // Orbit ring + one satellite (the single "alive" detail)
    const ringPts = new THREE.EllipseCurve(0, 0, R * 1.45, R * 1.45, 0, Math.PI * 2)
      .getPoints(180)
      .map((p) => new THREE.Vector3(p.x, p.y, 0))
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts)
    const ringMat = new THREE.LineBasicMaterial({ color: 0x9bf0b8, transparent: true, opacity: 0.16 })
    const ring = new THREE.LineLoop(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.35
    ring.rotation.y = 0.35
    world.add(ring)

    const satGeo = new THREE.SphereGeometry(0.055, 16, 16)
    const satMat = new THREE.MeshBasicMaterial({ color: 0xeafff3 })
    const sat = new THREE.Mesh(satGeo, satMat)
    const haloGeo = new THREE.SphereGeometry(0.16, 16, 16)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x9bf0b8, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    sat.add(new THREE.Mesh(haloGeo, haloMat))
    ring.add(sat)

    // Sizing
    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    // Pointer parallax
    const pointer = { x: 0, y: 0 }
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true })

    // Loop (paused when off-screen)
    const clock = new THREE.Clock()
    let raf = 0
    const frame = (t) => {
      dotsMat.uniforms.uTime.value = t
      globe.rotation.y = t * 0.06
      world.rotation.x += (pointer.y * 0.18 - world.rotation.x) * 0.04
      world.rotation.y += (pointer.x * 0.25 - world.rotation.y) * 0.04
      sat.position.set(Math.cos(t * 0.35) * R * 1.45, Math.sin(t * 0.35) * R * 1.45, 0)
      renderer.render(scene, camera)
    }
    const tick = () => {
      frame(clock.getElapsedTime())
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (reduce) { frame(0); return }
      if (!raf) tick()
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(el)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      ;[dotsGeo, coreGeo, rimGeo, ringGeo, satGeo, haloGeo].forEach((g) => g.dispose())
      ;[dotsMat, coreMat, rimMat, ringMat, satMat, haloMat].forEach((m) => m.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={`h-full w-full ${className}`} aria-hidden="true" />
}
