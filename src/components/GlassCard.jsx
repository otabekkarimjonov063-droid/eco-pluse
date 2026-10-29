import React, { useRef } from 'react';

// Three levels of importance - unified single glassmorphic system (bir xil shaffoflik)
const tones = {
  base: 'rounded-2xl eco-glass-card shadow-lg text-slate-800 dark:text-bone',
  raised: 'rounded-2xl eco-glass shadow-xl text-slate-800 dark:text-bone border-emerald-500/30 dark:border-emerald-400/40',
  feature: 'rounded-[1.75rem] eco-glass shadow-2xl text-slate-800 dark:text-bone',
};

export default function GlassCard({ tone = 'base', as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const animFrameRef = useRef(null);
  const rectRef = useRef(null);

  const onMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  // Spotlight follows the cursor with cached bounds to avoid forced layout reflows (60 FPS)
  const onMove = (e) => {
    if (!ref.current || animFrameRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    animFrameRef.current = requestAnimationFrame(() => {
      if (ref.current) {
        if (!rectRef.current) {
          rectRef.current = ref.current.getBoundingClientRect();
        }
        const r = rectRef.current;
        ref.current.style.setProperty('--mx', `${clientX - r.left}px`);
        ref.current.style.setProperty('--my', `${clientY - r.top}px`);
      }
      animFrameRef.current = null;
    });
  };

  const onMouseLeave = () => {
    rectRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  return (
    <Tag
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden transition-colors duration-200 ${tones[tone]} ${className}`}
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
  );
}
