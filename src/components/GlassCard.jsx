import { useRef } from 'react'

// Three levels of importance with full light and dark mode styles
const tones = {
  base: 'rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-white/70 dark:bg-white/[0.025] shadow-sm dark:shadow-none',
  raised: 'rounded-2xl border border-black/[0.12] dark:border-white/[0.11] bg-white/90 dark:bg-white/[0.05] shadow-md dark:shadow-none',
  feature: 'rounded-[1.75rem] border border-signal/40 bg-white/80 dark:bg-moss/80 shadow-lg dark:shadow-none',
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
      <div className="relative">{children}</div>
    </Tag>
  )
}
