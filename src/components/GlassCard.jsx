import { useRef } from 'react'

// Three levels of importance with full light and dark mode styles - transparent glassmorphic
const tones = {
  base: 'rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/40 dark:bg-black/20 shadow-sm backdrop-blur-xl',
  raised: 'rounded-2xl border border-emerald-500/30 dark:border-white/[0.15] bg-white/60 dark:bg-black/30 shadow-md backdrop-blur-xl',
  feature: 'rounded-[1.75rem] border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/25 shadow-2xl backdrop-blur-2xl',
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
