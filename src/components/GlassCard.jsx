import { useRef } from 'react'

// Three levels of importance - unified single glassmorphic system (bir xil shaffoflik)
const tones = {
  base: 'rounded-2xl eco-glass-card shadow-lg text-white',
  raised: 'rounded-2xl eco-glass shadow-xl text-white border-emerald-400/40',
  feature: 'rounded-[1.75rem] eco-glass shadow-2xl text-white',
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
