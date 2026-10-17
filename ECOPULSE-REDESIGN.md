# EcoPulse premium redesign: ONE FILE

INSTRUCTION FOR THE AI AGENT: Create each file below at the exact path shown in its heading, with the exact code in its code block. Then apply the redesign to the whole app as described in section 'Task'. Keep all existing functionality, routes, API calls, admin logic and Uzbek copy.

## Task
Apply the premium redesign pack (the files below) to the whole EcoPulse app, keeping all existing functionality, routes, API calls, admin panel logic and Uzbek copy.

1. Merge `tailwind.config.js` and `src/index.css` into the project. Remove the old fixed full-page 3D sphere and any global neon gradients and glows.
2. Use `Hero.jsx` for "Bosh sahifa". The 3D globe appears only in the hero and fades on scroll. Other pages have no 3D, only the static background from `index.css`.
3. Replace the current sidebar with `Sidebar.jsx` (pass the existing menu items with lucide icons, the active page, and the user).
4. Replace all card containers on every page (Global Statistika, Kalkulyator, Loyiha Galereyasi, Daraxt Ekish, Fikrlar) with `GlassCard`. Use `feature` for the one most important card on each page (e.g. the selected city's live AQI), `raised` for secondary, `base` for the rest.
5. Restyle all Recharts charts with `src/lib/chartTheme.jsx` (add `<ChartDefs />`, use `chart.gridProps`, `axisProps`, `tooltipProps`, `barProps`). Colour AQI status with `aqiColor()`.
6. Typography: headings `font-display font-light`, body `font-sans`. No bold serif, no all-caps labels, numbers use `tabular-nums`.
7. Fix: clipped "so'nggi yangilanish" time in the API card, chat button covering charts (add bottom padding to page content), calculator step icons overlapped by background.
8. Design the Admin Panel as a separate system: same tokens but denser layout, a top command bar, a data table with sticky header, and a compact stat row. Do not reuse the public site's hero or globe.
9. Keep motion minimal: the hero text reveal, the sidebar indicator, the card hover spotlight. Respect `prefers-reduced-motion`.


## Install
```bash
npm i three framer-motion lucide-react recharts
```

## FILE: tailwind.config.js
```jsx
/** Tailwind v3. If the project uses Tailwind v4, move these tokens into an @theme block in index.css. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#040908',
        moss: '#0b1613',
        bone: '#e8eee4',
        mist: '#8c9a92',
        signal: '#9bf0b8',
        ember: '#f2c14e',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Figtree:wght@400..700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background: #040908;
    color-scheme: dark;
    scroll-behavior: smooth;
  }

  body {
    @apply bg-ink font-sans text-bone antialiased;
    background-image:
      radial-gradient(1200px 700px at 85% -10%, rgba(47, 176, 140, 0.10), transparent 60%),
      radial-gradient(900px 600px at -10% 110%, rgba(47, 176, 140, 0.05), transparent 60%);
    background-attachment: fixed;
  }

  /* Fine film grain: the cheap trick that makes flat dark backgrounds feel expensive */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }

  ::selection {
    background: rgba(155, 240, 184, 0.28);
  }

  /* Thin, quiet scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## FILE: src/components/Globe3D.jsx
```jsx
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
```

## FILE: src/components/Hero.jsx
```jsx
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Globe3D from './Globe3D'

const reveal = {
  hidden: { y: '110%' },
  show: (i) => ({ y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 * i } }),
}

const defaultStats = [
  { value: '1.5M+', label: "Platforma a'zolari" },
  { value: '1.2K', label: 'Faol loyihalar' },
  { value: '14 983', label: 'Bugun ekilgan daraxtlar' },
]

export default function Hero({ onStart, onMore, stats = defaultStats }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const globeOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-12 pt-28 sm:px-10 lg:pl-[22rem] lg:pr-16">
      {/* 3D globe: lives only in the hero and fades out on scroll */}
      <div className="pointer-events-none absolute inset-y-0 right-[-14vw] flex items-center lg:right-[-6vw]">
        <motion.div
          style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
          className="aspect-square w-[min(105vh,85vw)] will-change-transform"
        >
          <Globe3D />
        </motion.div>
      </div>

      {/* Soft readability veil behind the text */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#040908_8%,rgba(4,9,8,0.72)_42%,transparent_70%)]" />

      <div className="relative z-10 max-w-[46rem]">
        <h1 className="font-display text-[clamp(2.6rem,6.2vw,5.75rem)] font-light leading-[0.98] tracking-[-0.02em] text-bone">
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span className="block" variants={reveal} custom={0} initial="hidden" animate="show">
              Sayyoramiz kelajagi
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span className="block italic text-bone/60" variants={reveal} custom={1} initial="hidden" animate="show">
              sizning qadamlaringizda
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-8 max-w-[34rem] text-lg leading-relaxed text-mist"
        >
          EcoPulse shunchaki kuzatish paneli emas. U ekologik mas'uliyatingizni dunyo bo'ylab haqiqiy o'zgarishlarga aylantiradi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={onStart}
            className="rounded-full bg-bone px-7 py-3.5 font-medium text-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
            Platformaga kirish
          </button>
          <button
            onClick={onMore}
            className="rounded-full px-5 py-3.5 text-bone/80 transition hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
            Batafsil o'rganish
          </button>
        </motion.div>
      </div>

      <dl className="relative z-10 mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-5xl font-light tabular-nums text-bone">{s.value}</dd>
            <dt className="mt-2 text-sm text-mist">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

## FILE: src/components/Sidebar.jsx
```jsx
import { motion } from 'framer-motion'

/**
 * items: [{ id, label, icon: LucideIcon }]
 * user:  { name, role }
 */
export default function Sidebar({ items, active, onSelect, user, onLogout }) {
  return (
    <>
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-64 flex-col rounded-3xl border border-white/[0.07] bg-moss/60 p-4 backdrop-blur-2xl lg:flex">
        <div className="flex items-center gap-2.5 px-3 pb-6 pt-3">
          <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(155,240,184,0.55)]" />
          <span className="font-display text-2xl font-light tracking-tight text-bone">EcoPulse</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Asosiy menyu">
          {items.map(({ id, label, icon: Icon }) => {
            const isActive = id === active
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                  isActive ? 'text-bone' : 'text-mist hover:text-bone'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-xl bg-white/[0.06]"
                  >
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-signal" />
                  </motion.span>
                )}
                <Icon size={18} strokeWidth={1.5} className="relative" />
                <span className="relative">{label}</span>
              </button>
            )
          })}
        </nav>

        {user && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 font-display text-lg text-bone">
              {user.name?.[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-bone">{user.name}</p>
              <button onClick={onLogout} className="text-xs text-mist transition hover:text-ember">
                Chiqish
              </button>
            </div>
            {user.role && <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-mist">{user.role}</span>}
          </div>
        )}
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-white/[0.08] bg-moss/80 p-2 backdrop-blur-2xl lg:hidden"
        aria-label="Asosiy menyu"
      >
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            aria-label={label}
            aria-current={id === active ? 'page' : undefined}
            className={`grid h-11 w-11 place-items-center rounded-xl transition ${
              id === active ? 'bg-white/[0.08] text-signal' : 'text-mist'
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </>
  )
}
```

## FILE: src/components/GlassCard.jsx
```jsx
import { useRef } from 'react'

// Three levels of importance, so the page has hierarchy instead of identical boxes.
const tones = {
  base: 'rounded-2xl border-white/[0.07] bg-white/[0.025]',
  raised: 'rounded-2xl border-white/[0.11] bg-white/[0.05]',
  feature: 'rounded-[1.75rem] border-signal/25 bg-moss/80',
}

export default function GlassCard({ tone = 'base', as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)

  // Spotlight follows the cursor: responds to the person's action, not decoration on its own
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden border backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${tones[tone]} ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(155,240,184,0.08), transparent 60%)',
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  )
}
```

## FILE: src/lib/chartTheme.jsx
```jsx
// Usage (Recharts):
//   <BarChart data={data}>
//     <ChartDefs />
//     <CartesianGrid {...chart.gridProps} />
//     <XAxis dataKey="m" {...chart.axisProps} />
//     <YAxis {...chart.axisProps} />
//     <Tooltip {...chart.tooltipProps} />
//     <Bar dataKey="aqi" {...chart.barProps} />
//   </BarChart>
//
//   <AreaChart> ... <Area dataKey="co2" stroke={chart.signal} strokeWidth={2} fill="url(#areaFill)" />

export const chart = {
  signal: '#9bf0b8',
  ember: '#f2c14e',
  axisProps: {
    stroke: 'transparent',
    tick: { fill: '#8c9a92', fontSize: 12 },
    tickLine: false,
    axisLine: false,
  },
  gridProps: { stroke: 'rgba(255,255,255,0.06)', vertical: false },
  tooltipProps: {
    cursor: { fill: 'rgba(255,255,255,0.04)' },
    contentStyle: {
      background: 'rgba(8,16,14,0.92)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      color: '#e8eee4',
      fontSize: 13,
    },
    labelStyle: { color: '#8c9a92' },
  },
  barProps: { radius: [6, 6, 0, 0], fill: 'url(#barFill)', maxBarSize: 36 },
}

// Put <ChartDefs /> as the first child inside the chart
export function ChartDefs() {
  return (
    <defs>
      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9bf0b8" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#9bf0b8" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9bf0b8" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#9bf0b8" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

// AQI status colour: calm green, amber, then a warm red-orange
export function aqiColor(v) {
  if (v <= 50) return '#9bf0b8'
  if (v <= 100) return '#f2c14e'
  return '#ff7a59'
}
```

