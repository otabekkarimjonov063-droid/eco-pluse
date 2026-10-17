import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Globe2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

const HeroSection = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven parallax
  const bigTextY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const bigTextOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const title = t('hero', 'title') || '';
  const words = title.split(' ');

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section
        ref={ref}
        className="relative min-h-[92vh] w-full overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
      >
        {/* Subtle background wordmark — constrained so it NEVER overflows */}
        <motion.div
          style={{ y: bigTextY, opacity: bigTextOpacity }}
          className="absolute inset-x-0 top-[16%] flex justify-center pointer-events-none select-none overflow-hidden max-w-full px-6"
          aria-hidden="true"
        >
          <span
            className="font-serif tracking-[0.22em] font-normal uppercase text-zinc-900/[0.04] dark:text-white/[0.03] select-none text-[clamp(2.5rem,10vw,8.5rem)] leading-none text-center max-w-full truncate"
          >
            ECOPULSE
          </span>
        </motion.div>

        {/* Foreground content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center lg:items-start lg:text-left px-6 lg:pl-16 pt-20 pb-28 max-w-6xl"
        >
          {/* Live telemetry pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-8 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/70 dark:bg-white/[0.04] backdrop-blur-md shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
              {t('hero', 'live')}
            </span>
          </motion.div>

          {/* Heading with Instrument Serif */}
          <h1
            className="font-serif font-normal leading-[1.02] max-w-4xl text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.25rem)' }}
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.24em]">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    i >= 2
                      ? 'inline-block italic text-emerald-600 dark:text-emerald-400'
                      : 'inline-block text-zinc-950 dark:text-zinc-50'
                  }
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
          >
            {t('hero', 'subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3.5"
          >
            <button
              onClick={() => setActiveTab && setActiveTab('dashboard')}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl primary-button"
            >
              <span>{t('hero', 'cta')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="px-6 py-3.5 rounded-xl glass-button text-sm"
            >
              {t('hero', 'explore')}
            </button>
          </motion.div>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="block w-px h-6 bg-gradient-to-b from-zinc-400 dark:from-zinc-600 to-transparent"
          />
        </div>
      </section>

      {/* ───────── IMPACT STATEMENT ───────── */}
      <section className="relative w-full bg-white/70 dark:bg-[#0c0d12]/60 text-zinc-900 dark:text-zinc-100 px-6 py-28 overflow-hidden border-t border-black/[0.06] dark:border-white/[0.06] transition-colors duration-300">
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-4 mb-16"
          >
            <Globe2 className="shrink-0 text-emerald-500 mt-1" size={32} />
            <p
              className="font-serif font-normal leading-tight text-zinc-900 dark:text-zinc-100"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
            >
              {t('hero', 'subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-200/80 dark:bg-white/[0.08] rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.08]">
            {[
              { v: 1.5, d: 1, suf: 'M+', label: t('hero', 'members') },
              { v: 1.2, d: 1, suf: 'K', label: t('hero', 'projects_count') },
              { v: 15000, d: 0, suf: '', label: `${t('hero', 'tree')} · ${t('hero', 'planted_today')}`, icon: true },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-[#0e0f14] p-8 text-center sm:text-left transition-colors"
              >
                <div
                  className="font-mono font-medium text-zinc-950 dark:text-zinc-50 tracking-tight"
                  style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
                >
                  <CountUp value={s.v} decimals={s.d} duration={2} suffix={s.suf} />
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {s.icon && <Leaf size={13} className="text-emerald-500" />}
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
