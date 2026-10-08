import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Leaf } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <Leaf size={16} className="text-eco-primary" />
          <span className="text-sm font-medium tracking-wide">EcoPulse 2026 Hackathon Edition</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-eco-neon to-cyan-400">
            {t('hero', 'title')}
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl opacity-80 max-w-3xl mb-10 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {t('hero', 'subtitle')}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <button className="primary-button text-lg px-8 py-4 flex items-center gap-2 group">
            {t('hero', 'cta')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="glass-button text-lg px-8 py-4">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
