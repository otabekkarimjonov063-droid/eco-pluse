import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Globe2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';

// Deterministic star field for organic twinkle & floating animations
const useStars = (n) =>
  useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        x: (i * 137.5) % 100,
        y: (i * 61.8) % 100,
        s: 1.5 + (i % 3),
        o: 0.25 + ((i * 7) % 10) / 14,
        d: 2.5 + (i % 4),
      })),
    [n]
  );

const HeroSection = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const stars = useStars(60);
  const [aqi, setAqi] = useState(93);

  // Real air quality for Tashkent (Open-Meteo)
  useEffect(() => {
    let off = false;
    fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=41.3&longitude=69.2&current=us_aqi')
      .then((r) => r.json())
      .then((d) => {
        if (!off && d?.current?.us_aqi != null) {
          setAqi(Math.round(d.current.us_aqi));
        }
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven parallax animations
  const bigTextY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const bigTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const tickerItems = {
    UZ: ['CO₂ MONITORING', 'DARAXT EKISH', 'UGLEROD IZI', 'YASHIL LOYIHALAR'],
    RU: ['МОНИТОРИНГ CO₂', 'ПОСАДКА ДЕРЕВЬЕВ', 'УГЛЕРОДНЫЙ СЛЕД', 'ЗЕЛЕНЫЕ ПРОЕКТЫ'],
    EN: ['CO₂ MONITORING', 'PLANTING TREES', 'CARBON FOOTPRINT', 'GREEN PROJECTS'],
  }[language] || ['CO₂ MONITORING', 'DARAXT EKISH', 'UGLEROD IZI', 'YASHIL LOYIHALAR'];

  return (
    <>
      {/* ───────── HERO SECTION (Matches Reference Screenshot 1:1) ───────── */}
      <section
        ref={ref}
        className="relative min-h-screen w-full overflow-hidden bg-transparent text-white select-none"
      >
        {/* Dynamic Twinkling Animated Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((s) => (
            <motion.span
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.s,
                height: s.s,
              }}
              animate={{
                opacity: [s.o * 0.35, s.o, s.o * 0.35],
                scale: [0.9, 1.25, 0.9],
              }}
              transition={{
                duration: s.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Giant Background Wordmark 'ECOPULSE' with Parallax */}
        <motion.div
          style={{ y: bigTextY, opacity: bigTextOpacity }}
          className="absolute inset-x-0 top-[18%] flex justify-center pointer-events-none select-none will-change-transform z-0"
        >
          <span
            className="font-serif tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent whitespace-nowrap select-none"
            style={{ fontSize: 'clamp(4rem, 15vw, 13.5rem)', lineHeight: 0.9, fontWeight: 300, transform: 'translateZ(0)' }}
          >
            ECOPULSE
          </span>
        </motion.div>

        {/* Foreground Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 min-h-screen flex flex-col justify-center items-start px-6 lg:pl-16 pt-20 pb-32 max-w-5xl"
        >
          {/* Live Pill Badge with Pulsing Green Dot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 mb-8 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-[11px] font-mono tracking-wider text-white/90"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span className="uppercase tracking-widest">{t('hero', 'live') || 'JONLI'}</span>
          </motion.div>

          {/* Luxury Editorial Headline matching Screenshot */}
          <h1
            className="font-serif font-normal leading-[1.06] tracking-tight text-white pb-1"
            style={{ fontSize: 'clamp(2.5rem, 5.8vw, 5.25rem)' }}
          >
            {language === 'RU' ? (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-white inline-block"
                >
                  Будущее планеты{' '}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  в ваших
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  шагах
                </motion.span>
              </>
            ) : language === 'EN' ? (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-white inline-block"
                >
                  Future of our planet{' '}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  in your
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  footsteps
                </motion.span>
              </>
            ) : (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-white inline-block"
                >
                  Sayyoramiz kelajagi{' '}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  sizning
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#dfcfaf] via-[#ecdcc3] to-[#cbb898] inline-block"
                >
                  qadamlaringizda
                </motion.span>
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed font-sans"
          >
            {language === 'RU'
              ? 'EcoPulse — это не просто панель мониторинга. Это крупная мегаплатформа, превращающая экологическую ответственность в реальные глобальные изменения.'
              : language === 'EN'
              ? 'EcoPulse is more than a dashboard. It is an enterprise environmental megaplaform turning ecological responsibility into verified global impact.'
              : "EcoPulse — bu shunchaki kuzatish paneli emas. Bu sizning ekologik mas'uliyatingizni dunyo bo'ylab haqiqiy o'zgarishlarga aylantiruvchi yirik korporativ megaplatforma."}
          </motion.p>

          {/* Action Buttons matching Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => setActiveTab && setActiveTab('dashboard')}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#eddab5] hover:bg-white text-[#121c16] font-medium text-sm tracking-wide transition-all shadow-[0_4px_24px_rgba(237,218,181,0.22)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer font-sans"
            >
              <span>{language === 'RU' ? 'Войти на платформу' : language === 'EN' ? 'Enter platform' : 'Platformaga kirish'}</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab('projects')}
              className="px-8 py-3.5 rounded-full border border-white/20 bg-black/30 hover:bg-white/10 backdrop-blur-md text-white/90 font-medium text-sm tracking-wide hover:border-white/35 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer font-sans"
            >
              {language === 'RU' ? 'Узнать больше' : language === 'EN' ? 'Learn more' : "Batafsil o'rganish"}
            </button>
          </motion.div>
        </motion.div>

        {/* ───────── Floating Data Cards on the Right (Lively synchronized interaction) ───────── */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="hidden lg:flex absolute right-12 top-24 z-10 w-64 flex-col gap-3 select-none"
        >
          {/* Card 1: Air Quality - Floats down towards Card 2 */}
          <motion.div
            animate={{ 
              y: [0, 8.5, 0, -3.5, 0],
              rotate: [0, 0.6, 0, -0.4, 0]
            }}
            transition={{ 
              duration: 3.6, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            whileHover={{ scale: 1.03 }}
            className="rounded-[22px] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[3px] border border-white/[0.12] bg-black/15 relative overflow-hidden cursor-default transition-all hover:bg-black/25"
          >
            {/* Top row */}
            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.22em] uppercase">
              <span className="font-semibold text-white/80">
                {language === 'RU' ? 'ВОЗДУХ · ТАШКЕНТ' : language === 'EN' ? 'AIR · TASHKENT' : 'HAVO · TOSHKENT'}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 font-semibold tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span>• {t('hero', 'live') || 'JONLI'}</span>
              </div>
            </div>

            {/* Value row */}
            <div className="mt-3 flex items-baseline">
              <span className="font-serif font-light text-5xl text-white tracking-tight">
                {aqi ?? 94}
              </span>
              <span className="ml-3 font-mono text-xs text-white/60 font-medium">US AQI</span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((aqi || 94) / 150) * 100, 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] rounded-full"
              />
            </div>
          </motion.div>

          {/* Card 2: CO2 - Floats up towards Card 1 */}
          <motion.div
            animate={{ 
              y: [0, -8.5, 0, 3.5, 0],
              rotate: [0, -0.6, 0, 0.4, 0]
            }}
            transition={{ 
              duration: 3.6, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            whileHover={{ scale: 1.03 }}
            className="rounded-[22px] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-[3px] border border-white/[0.12] bg-black/15 relative overflow-hidden cursor-default transition-all hover:bg-black/25"
          >
            {/* Top row */}
            <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.22em] uppercase">
              <span className="font-bold text-white/80">CO₂</span>
              <span className="text-white/60 font-mono font-medium tracking-[0.2em]">PPM</span>
            </div>

            {/* Value row */}
            <div className="mt-3 flex items-baseline">
              <span className="font-serif font-light text-5xl text-white tracking-tight">
                420+
              </span>
              <span className="ml-3 font-mono text-xs text-white/60 font-normal">global</span>
            </div>

            {/* Subtext */}
            <p className="mt-2 text-xs text-white/50 font-mono tracking-wide">
              {language === 'RU' ? 'в среднем' : language === 'EN' ? 'average' : "o'rtacha"}
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator with smooth bouncing line */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] tracking-[0.35em] uppercase font-mono">SCROLL</span>
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
          />
        </div>

        {/* Continuous Running Ticker Ribbon - Edge to Edge */}
        <div className="fixed bottom-0 inset-x-0 z-20 overflow-hidden border-t border-white/[0.08] bg-[#03100a]/90 backdrop-blur-md py-2.5">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] whitespace-nowrap text-[10px] tracking-[0.4em] uppercase text-white/60 font-mono">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {tickerItems.map((w) => (
                  <span key={w} className="px-10 flex items-center gap-10">
                    <span>{w}</span>
                    <span className="text-amber-200/80">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── IMPACT STATEMENT SECTION (Transparent Glass) ───────── */}
      <section className="relative w-full bg-transparent text-white px-6 py-32 overflow-hidden border-t border-white/[0.06]">
        <div className="relative max-w-5xl mx-auto">
          <div className="mb-10 flex items-center gap-4 text-[11px] font-medium tracking-[0.35em] uppercase text-emerald-400">
            <span>01</span>
            <span className="h-px w-16 bg-emerald-500/40" />
            <span>{language === 'RU' ? 'Воздействие' : language === 'EN' ? 'Impact' : 'Ta’sir'}</span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light leading-snug text-white/95"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            <Globe2 className="inline-block mr-3 -mt-2 text-emerald-400" size={40} />
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
                className="rounded-2xl p-8 sm:p-10 text-center sm:text-left shadow-2xl border border-white/[0.12] bg-black/15 backdrop-blur-[3px] transition-all hover:bg-black/25"
              >
                <div
                  className="font-serif font-light bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-100 to-emerald-400"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  <CountUp value={s.v} decimals={s.d} duration={2.5} suffix={s.suf} />
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
                  {s.icon && <Leaf size={14} className="text-emerald-400" />}
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