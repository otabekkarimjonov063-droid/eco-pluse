import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-eco-neon to-cyan-500 p-[2px] animate-pulse-fast shadow-[0_0_15px_rgba(0,255,170,0.5)]">
        <div className="absolute inset-0 bg-eco-dark rounded-full m-[2px]"></div>
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 z-10 text-eco-neon group-hover:scale-110 transition-transform duration-300"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Planet / Leaf shape */}
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" className="opacity-50" />
          <path d="M12 2a10 10 0 0 1 10 10H12V2z" className="opacity-50" />
          {/* ECG Pulse Line */}
          <path d="M3 12h4l2 -4 4 8 2 -4h6" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
        </svg>
      </div>
      <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-eco-neon via-emerald-400 to-cyan-500">
        EcoPulse
      </span>
    </div>
  );
};

export default Logo;
