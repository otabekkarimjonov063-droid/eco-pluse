import { useRef } from 'react'

// Three levels of importance - ultra-clear crystal frosted glass (shaffof)
const tones = {
  base: 'rounded-2xl border border-white/15 bg-white/[0.08] dark:bg-white/[0.05] shadow-lg backdrop-blur-2xl text-white',
  raised: 'rounded-2xl border border-emerald-400/40 bg-white/[0.14] dark:bg-white/[0.09] shadow-xl backdrop-blur-2xl text-white',
  feature: 'rounded-[1.75rem] border border-white/20 bg-white/[0.10] dark:bg-white/[0.06] shadow-2xl backdrop-blur-2xl text-white',
}

export default function GlassCard({ tone = 'base', as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)

  // Spotlight follows the cursor: responds to user interaction
  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden backdrop-blur-xl transition-colors duration-200 ${tones[tone]} ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(155,240,184,0.12), transparent 60%)',
        }}
      />
      <div className="relative w-full h-full flex flex-col">{children}</div>
    </Tag>
  )
}
