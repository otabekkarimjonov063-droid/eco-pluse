import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] transition-colors group-hover:border-emerald-500/40">
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 text-emerald-500 group-hover:scale-105 transition-transform duration-200"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Subtle leaf / orb curve */}
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10" className="opacity-30" />
          {/* Minimalist pulse wave */}
          <path d="M4 12h3.5l1.5 -3.5 3 7 2 -3.5h6" />
        </svg>
      </div>
      <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center">
        EcoPulse
        <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 ml-1.5" />
      </span>
    </div>
  );
};

export default Logo;
