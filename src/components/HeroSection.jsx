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
        className="relative min-h-screen w-full overflow-hidden bg-transparent text-white"
      >
        {/* Giant background wordmark */}
        <motion.div
          style={{ y: bigTextY, opacity: bigTextOpacity }}
          className="absolute inset-x-0 top-[18%] flex justify-center pointer-events-none select-none"
        >
          <span
            className="font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/0 whitespace-nowrap font-display"
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
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#d9c08a]/25 bg-transparent"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9c08a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d9c08a]" />
            </span>
            <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-white/70">
              {t('hero', 'live')}
            </span>
          </motion.div>

          <h1
            className="font-display font-light leading-[1.05] max-w-5xl tracking-tight"
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
                      ? 'inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#f1e3bd] via-[#d9c08a] to-[#a9c7b8]'
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
            className="mt-6 max-w-2xl text-base sm:text-lg text-white/65 leading-relaxed"
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
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#eadfc4] text-[#050a09] font-semibold tracking-wide hover:bg-[#f6ecd2] transition-colors"
            >
              {t('hero', 'cta')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="px-8 py-4 rounded-full border border-[#d9c08a]/30 bg-transparent font-medium tracking-wide hover:border-[#d9c08a]/70 hover:bg-[#d9c08a]/5 transition-colors"
            >
              {t('hero', 'explore')}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating data cards */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="hidden lg:flex absolute right-10 top-28 z-10 w-60 flex-col gap-3"
        >
          <div className="animate-float-slow rounded-2xl border border-[#d9c08a]/20 bg-[#070e0c]/75 p-5">
            <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-white/50">
              <span>Havo · Toshkent</span><span className="text-[#d9c08a]">● jonli</span>
            </div>
            <div className="mt-3 font-display font-light text-4xl">
              {aqi ?? '—'}<span className="ml-2 font-sans text-xs text-white/50">US AQI</span>
            </div>
            <div className="mt-4 h-[2px] rounded bg-[#d9c08a]/15 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#a9c7b8] to-[#d9c08a]" style={{ width: `${Math.min((aqi || 40) / 2, 100)}%` }} />
            </div>
          </div>
          <div className="animate-float ml-7 rounded-2xl border border-[#d9c08a]/20 bg-[#070e0c]/75 p-5" style={{ animationDelay: '-2s' }}>
            <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-white/50">
              <span>CO₂</span><span className="text-[#d9c08a]">ppm</span>
            </div>
            <div className="mt-3 font-display font-light text-4xl">
              420+<span className="ml-2 font-sans text-xs text-white/50">global o’rtacha</span>
            </div>
          </div>
        </motion.div>

        {/* Ticker */}
        <div className="absolute bottom-0 inset-x-0 z-10 overflow-hidden border-t border-[#d9c08a]/15 bg-[#050a09]/60 py-3">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.4em] uppercase text-white/45">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {['Havo sifati', 'CO₂ monitoring', 'Daraxt ekish', 'Uglerod izi', 'Yashil loyihalar', 'Real vaqt'].map((w) => (
                  <span key={w} className="px-8">{w}<span className="ml-16 text-[#d9c08a]">✦</span></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="block w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </section>

      {/* ───────── IMPACT STATEMENT ───────── */}
      <section className="relative w-full bg-[#050a09]/75 text-white px-6 py-32 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#02060d] to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <div className="mb-10 flex items-center gap-4 text-[11px] font-medium tracking-[0.35em] uppercase text-[#d9c08a]">
            <span>01</span><span className="h-px w-16 bg-[#d9c08a]/40" /><span>Ta’sir</span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light leading-snug text-white/90"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            <Globe2 className="inline-block mr-3 -mt-2 text-[#d9c08a]" size={40} />
            {t('hero', 'subtitle')}
          </motion.p>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#d9c08a]/15 rounded-2xl overflow-hidden border border-[#d9c08a]/20">
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
                className="bg-[#070e0c]/90 p-10 text-center sm:text-left"
              >
                <div
                  className="font-display font-light bg-clip-text text-transparent bg-gradient-to-br from-[#fff6dc] to-[#d9c08a]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  <CountUp value={s.v} decimals={s.d} duration={2.5} suffix={s.suf} />
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
                  {s.icon && <Leaf size={14} className="text-[#d9c08a]" />}
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
