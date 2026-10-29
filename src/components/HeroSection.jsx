import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Globe2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

const HeroSection = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
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

  // Scroll-driven parallax (GPU optimized)
  const bigTextY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const bigTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const title = t('hero', 'title') || '';
  const words = title.split(' ');

  const tickerItems = {
    UZ: ['Havo sifati', 'CO₂ monitoring', 'Daraxt ekish', 'Uglerod izi', 'Yashil loyihalar', 'Real vaqt'],
    RU: ['Качество воздуха', 'Мониторинг CO₂', 'Посадка деревьев', 'Углеродный след', 'Зеленые проекты', 'Реальное время'],
    EN: ['Air Quality', 'CO₂ Monitoring', 'Planting Trees', 'Carbon Footprint', 'Green Projects', 'Real-time']
  }[language] || ['Havo sifati', 'CO₂ monitoring', 'Daraxt ekish', 'Uglerod izi', 'Yashil loyihalar', 'Real vaqt'];

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
          className="absolute inset-x-0 top-[18%] flex justify-center pointer-events-none select-none will-change-transform"
        >
          <span
            className="font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-slate-900/10 dark:from-white/20 to-transparent whitespace-nowrap font-display transform-gpu"
            style={{ fontSize: 'clamp(3.5rem, 15vw, 14rem)', lineHeight: 1, fontWeight: 300, transform: 'translateZ(0)' }}
          >
            ECOPULSE
          </span>
        </motion.div>

        {/* Foreground content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center lg:items-start lg:text-left px-6 lg:pl-16 pt-24 pb-32"
        >
          {/* Live Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-[11px] font-mono tracking-wider text-white/90"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>• {t('hero', 'live') || 'JONLI'}</span>
          </motion.div>

          {/* Luxury Editorial Slogan */}
          <h1
            className="font-serif font-light leading-[1.08] max-w-4xl tracking-tight text-white pb-1"
            style={{ fontSize: 'clamp(2.5rem, 6.2vw, 5.5rem)' }}
          >
            {language === 'RU' ? (
              <>
                <span className="text-[#f2eee3]">Будущее планеты </span>
                <span className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">в ваших</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">шагах</span>
              </>
            ) : language === 'EN' ? (
              <>
                <span className="text-[#f2eee3]">Future of our planet </span>
                <span className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">in your</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">footsteps</span>
              </>
            ) : (
              <>
                <span className="text-[#f2eee3]">Sayyoramiz kelajagi </span>
                <span className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">sizning</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898]">qadamlaringizda</span>
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-sans"
          >
            {language === 'RU' 
              ? "EcoPulse — это не просто панель мониторинга. Это крупная мегаплатформа, превращающая экологическую ответственность в реальные глобальные изменения."
              : language === 'EN'
              ? "EcoPulse is more than a dashboard. It is an enterprise environmental megaplaform turning ecological responsibility into verified global impact."
              : "EcoPulse — bu shunchaki kuzatish paneli emas. Bu sizning ekologik mas'uliyatingizni dunyo bo'ylab haqiqiy o'zgarishlarga aylantiruvchi yirik korporativ megaplatforma."}
          </motion.p>

          {/* Action Buttons Matching Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => setActiveTab && setActiveTab('dashboard')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ede8db] hover:bg-white text-[#0f1712] font-semibold text-sm tracking-wide transition-all shadow-[0_4px_24px_rgba(237,232,219,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{language === 'RU' ? 'Войти на платформу' : language === 'EN' ? 'Enter platform' : 'Platformaga kirish'}</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="px-8 py-3.5 rounded-full border border-white/20 bg-black/20 hover:bg-white/10 backdrop-blur-md text-[#ede8db] font-medium text-sm tracking-wide hover:border-white/35 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {language === 'RU' ? 'Узнать больше' : language === 'EN' ? 'Learn more' : "Batafsil o'rganish"}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating data cards (Unified Eco-Glass) */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="hidden lg:flex absolute right-10 top-28 z-10 w-64 flex-col gap-3.5 pointer-events-none select-none"
        >
          {/* Card 1: Air Quality */}
          <div className="animate-float-slow rounded-2xl p-5 shadow-2xl backdrop-blur-md border border-white/15 bg-black/40 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
              <span className="font-semibold text-white/90">
                {language === 'RU' ? 'ВОЗДУХ · ТАШКЕНТ' : language === 'EN' ? 'AIR · TASHKENT' : 'HAVO · TOSHKENT'}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                • {t('hero', 'live') || 'JONLI'}
              </span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-white drop-shadow flex items-baseline">
              {aqi ?? '67'}
              <span className="ml-2.5 font-mono text-xs text-white/60 font-medium">US AQI</span>
            </div>
            <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" 
                style={{ width: `${Math.min((aqi || 67) / 2, 100)}%` }} 
              />
            </div>
          </div>

          {/* Card 2: CO2 */}
          <div className="animate-float rounded-2xl p-5 shadow-2xl backdrop-blur-md border border-white/15 bg-black/40 relative overflow-hidden group mt-1" style={{ animationDelay: '-2s' }}>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
              <span className="font-semibold text-white/90">CO₂</span>
              <span className="text-white/60 font-mono font-medium">PPM</span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-white drop-shadow flex items-baseline">
              420+
              <span className="ml-2.5 font-mono text-xs text-white/60 font-medium">global</span>
            </div>
            <p className="mt-1 text-xs text-white/50 font-sans tracking-wide">
              {language === 'RU' ? 'в среднем' : language === 'EN' ? 'average' : "o'rtacha"}
            </p>
          </div>
        </motion.div>

        {/* Ticker */}
        <div className="absolute bottom-0 inset-x-0 z-10 overflow-hidden border-t border-black/10 dark:border-white/10 eco-glass py-3">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.4em] uppercase text-slate-600 dark:text-white/60">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {tickerItems.map((w) => (
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
            <span>01</span><span className="h-px w-16 bg-emerald-500/40" /><span>{language === 'RU' ? 'Воздействие' : language === 'EN' ? 'Impact' : 'Ta’sir'}</span>
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
