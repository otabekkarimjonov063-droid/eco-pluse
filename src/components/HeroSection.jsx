import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Globe2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

// Deterministic star field (no Math.random on every render)
const useStars = (n) =>
  useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        x: (i * 137.5) % 100,
        y: (i * 61.8) % 100,
        s: 1 + (i % 3),
        o: 0.25 + ((i * 7) % 10) / 14,
        d: 2 + (i % 5),
      })),
    [n]
  );

const HeroSection = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [aqi, setAqi] = useState(null);

  // Real air quality for Tashkent (Open-Meteo, no key needed)
  useEffect(() => {
    let off = false;
    fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=41.3&longitude=69.2&current=us_aqi')
      .then((r) => r.json())
      .then((d) => { if (!off && d?.current?.us_aqi != null) setAqi(Math.round(d.current.us_aqi)); })
      .catch(() => {});
    return () => { off = true; };
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven parallax
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 2.4]);
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const bigTextY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const bigTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const title = t('hero', 'title') || '';
  const words = title.split(' ');

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section
        ref={ref}
        className="relative min-h-screen w-full overflow-hidden bg-transparent text-slate-800 dark:text-white"
      >
        {/* Giant background wordmark */}
        <motion.div
          style={{ y: bigTextY, opacity: bigTextOpacity }}
          className="absolute inset-x-0 top-[18%] flex justify-center pointer-events-none select-none"
        >
          <span
            className="font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-slate-900/10 dark:from-white/20 to-transparent whitespace-nowrap font-display"
            style={{ fontSize: 'clamp(3.5rem, 15vw, 14rem)', lineHeight: 1, fontWeight: 300 }}
          >
            ECOPULSE
          </span>
        </motion.div>

        {/* Foreground content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center lg:items-start lg:text-left px-6 lg:pl-16 pt-24 pb-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-emerald-500/30 eco-glass"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-emerald-700 dark:text-emerald-300">
              {t('hero', 'live')}
            </span>
          </motion.div>

          <h1
            className="font-display font-light leading-[1.05] max-w-5xl tracking-tight text-slate-900 dark:text-white"
            style={{ fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)' }}
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    i >= 2
                      ? 'inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-200 dark:via-teal-300 dark:to-emerald-400'
                      : 'inline-block'
                  }
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-white/75 leading-relaxed"
          >
            {t('hero', 'subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => setActiveTab && setActiveTab('dashboard')}
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              {t('hero', 'cta')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="px-8 py-4 rounded-full border border-black/10 dark:border-white/20 eco-glass font-medium tracking-wide hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-slate-800 dark:text-white cursor-pointer"
            >
              {t('hero', 'explore')}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating data cards (Unified Eco-Glass) */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="hidden lg:flex absolute right-10 top-28 z-10 w-64 flex-col gap-3.5 pointer-events-none select-none"
        >
          {/* Card 1: Air Quality */}
          <div className="animate-float-slow rounded-2xl eco-glass p-5 shadow-2xl backdrop-blur-2xl border border-black/10 dark:border-white/15 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] uppercase text-slate-600 dark:text-white/80">
              <span className="font-semibold text-slate-800 dark:text-white/90">Havo · Toshkent</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                JONLI
              </span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-slate-900 dark:text-white drop-shadow flex items-baseline">
              {aqi ?? '—'}
              <span className="ml-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-300 font-medium">US AQI</span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-black/[0.08] dark:bg-white/15 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_12px_rgba(52,211,153,0.7)]" 
                style={{ width: `${Math.min((aqi || 40) / 2, 100)}%` }} 
              />
            </div>
          </div>

          {/* Card 2: CO2 */}
          <div className="animate-float ml-8 rounded-2xl eco-glass p-5 shadow-2xl backdrop-blur-2xl border border-black/10 dark:border-white/15 relative overflow-hidden group" style={{ animationDelay: '-2s' }}>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] uppercase text-slate-600 dark:text-white/80">
              <span className="font-semibold text-slate-800 dark:text-white/90">CO₂</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">PPM</span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-slate-900 dark:text-white drop-shadow flex items-baseline">
              420+
              <span className="ml-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-300 font-medium">global</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-white/80 font-sans tracking-wide">o’rtacha ko’rsatkich</p>
          </div>
        </motion.div>

        {/* Ticker */}
        <div className="absolute bottom-0 inset-x-0 z-10 overflow-hidden border-t border-black/10 dark:border-white/10 eco-glass py-3">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.4em] uppercase text-slate-600 dark:text-white/60">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {['Havo sifati', 'CO₂ monitoring', 'Daraxt ekish', 'Uglerod izi', 'Yashil loyihalar', 'Real vaqt'].map((w) => (
                  <span key={w} className="px-8">{w}<span className="ml-16 text-emerald-600 dark:text-emerald-400">✦</span></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-500 dark:text-white/50">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="block w-px h-8 bg-gradient-to-b from-slate-400 dark:from-white/60 to-transparent"
          />
        </div>
      </section>

      {/* ───────── IMPACT STATEMENT ───────── */}
      <section className="relative w-full bg-transparent text-slate-800 dark:text-white px-6 py-32 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 dark:bg-gradient-to-b dark:from-black/60 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="mb-10 flex items-center gap-4 text-[11px] font-medium tracking-[0.35em] uppercase text-emerald-600 dark:text-emerald-400">
            <span>01</span><span className="h-px w-16 bg-emerald-500/40" /><span>Ta’sir</span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light leading-snug text-slate-900 dark:text-white/90"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            <Globe2 className="inline-block mr-3 -mt-2 text-emerald-600 dark:text-emerald-400" size={40} />
            {t('hero', 'subtitle')}
          </motion.p>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-3xl overflow-hidden">
            {[
              { v: 1.5, d: 1, suf: 'M+', label: t('hero', 'members') },
              { v: 1.2, d: 1, suf: 'K', label: t('hero', 'projects_count') },
              { v: 15000, d: 0, suf: '', label: `${t('hero', 'tree')} · ${t('hero', 'planted_today')}`, icon: true },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="eco-glass rounded-2xl p-8 sm:p-10 text-center sm:text-left shadow-xl border border-black/[0.06] dark:border-white/10"
              >
                <div
                  className="font-display font-light bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-emerald-800 to-emerald-600 dark:from-white dark:via-emerald-100 dark:to-emerald-400"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  <CountUp value={s.v} decimals={s.d} duration={2.5} suffix={s.suf} />
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-slate-600 dark:text-white/70">
                  {s.icon && <Leaf size={14} className="text-emerald-600 dark:text-emerald-400" />}
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
