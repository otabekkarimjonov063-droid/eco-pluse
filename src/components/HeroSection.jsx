import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Leaf, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

const backgroundImages = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&fm=webp&w=1200', // Nature landscape
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&fm=webp&w=1200', // Wind turbines
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&fm=webp&w=1200', // Green city concept
];

const HeroSection = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden w-full max-w-full">
      
      {/* Background Slider with Smooth Transitions */}
      <AnimatePresence>
        <motion.div 
          key={currentBg}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ willChange: 'opacity, transform' }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImages[currentBg]})` }}></div>
        </motion.div>
      </AnimatePresence>
      
      {/* Premium Dark Overlay */}
      <div className="absolute inset-0 bg-white/30 dark:bg-[#07101a]/80 transition-colors duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-eco-light via-white/40 to-transparent dark:from-[#07101a] dark:via-[#07101a]/60 transition-colors duration-700"></div>

      {/* Floating Animated Particles (GPU-Accelerated) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(16,185,129,0.1)_0%,_transparent_70%)] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(6,182,212,0.1)_0%,_transparent_70%)] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Content - Fixed Overflow and Clamp */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ willChange: 'transform, opacity', maxWidth: '100%' }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ willChange: 'transform, opacity' }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full premium-glass mb-8 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">EcoPulse v2.0 Premium</span>
            </motion.div>
            
            <h1 
              className="font-extrabold mb-6 leading-[1.15] w-full"
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              <span className="text-slate-900 dark:text-white drop-shadow-lg block">
                {t('hero', 'title').split(' ')[0]} {t('hero', 'title').split(' ')[1]}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-eco-neon to-cyan-400 filter drop-shadow-sm block mt-2">
                {t('hero', 'title').split(' ').slice(2).join(' ')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl opacity-80 text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              {t('hero', 'subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto">
              <button onClick={() => setActiveTab && setActiveTab('dashboard')} className="w-full sm:w-auto primary-button text-lg px-8 py-4 flex items-center justify-center gap-3 group shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]">
                {t('hero', 'cta')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setActiveTab && setActiveTab('projects')} className="w-full sm:w-auto premium-glass text-lg px-8 py-4 flex items-center justify-center gap-3 group hover:border-emerald-500/50 hover:bg-emerald-500/5">
                <Play size={20} className="group-hover:scale-110 transition-transform text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-white">{t('hero', 'explore')}</span>
              </button>
            </div>
          </motion.div>

          {/* Interactive 3D Mockup / Stats Cards */}
          <div className="hidden lg:block relative perspective-1000 w-full pl-6">
            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              style={{ willChange: 'transform, opacity' }}
              className="relative preserve-3d"
            >
              
              {/* Main Levitating Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: 'transform' }}
                className="premium-glass-deep p-8 w-full max-w-md ml-auto hover:scale-[1.02] transition-transform duration-500 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl flex items-center gap-3 text-slate-900 dark:text-white">
                    <Activity className="text-emerald-500 animate-pulse-slow" /> Live Impact
                  </h3>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                    Jonli
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-3 font-semibold text-slate-800 dark:text-slate-200">
                      <span className="opacity-80">Global CO2 qisqarishi</span>
                      <span className="text-emerald-500 font-bold">+24.5%</span>
                    </div>
                    <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="p-4 rounded-2xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/5 text-center group cursor-default">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
                        <CountUp value={1.5} decimals={1} duration={2} suffix="M+" />
                      </div>
                      <div className="text-xs opacity-60 font-bold uppercase tracking-widest">A'zolar</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/5 text-center group cursor-default">
                      <div className="text-3xl font-extrabold text-emerald-500 mb-1 group-hover:scale-105 transition-transform">
                        <CountUp value={1.2} decimals={1} duration={2} suffix="K" />
                      </div>
                      <div className="text-xs opacity-60 font-bold uppercase tracking-widest">Loyihalar</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1 - Smaller Orbital Card */}
              <motion.div 
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ willChange: 'transform' }}
                className="absolute -left-10 sm:-left-32 top-8 premium-glass p-4 flex items-center gap-4 shadow-2xl backdrop-blur-md z-20"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] flex-shrink-0">
                  <Leaf size={24} />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    <CountUp value={15000} duration={2.5} /> Daraxt
                  </div>
                  <div className="text-xs opacity-60 font-semibold uppercase tracking-wider">Bugun ekildi</div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ willChange: 'opacity' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-slate-800 dark:text-white"
      >
        <span className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Scroll</span>
        <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1 opacity-70">
          <div className="w-1 h-2 bg-current rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
