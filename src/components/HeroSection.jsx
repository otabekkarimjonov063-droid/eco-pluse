import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Globe2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountUp from './CountUp';
import Globe3D from './Globe3D';

const HeroSection = ({ setActiveTab, onStart, onMore }) => {
  const { t, language } = useLanguage();
  const heroRef = useRef(null);
  const [aqi, setAqi] = useState(null);

  const handleStart = onStart || (() => setActiveTab && setActiveTab('dashboard'));
  const handleMore = onMore || (() => setActiveTab && setActiveTab('projects'));

  // Real air quality for Tashkent (Open-Meteo API)
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
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms for Hero content and 3D Globe
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const title = t('hero', 'title') || 'Sayyoramiz kelajagi sizning qadamlaringizda';
  const words = title.split(' ');

  const langKey = language === 'RU' ? 'RU' : language === 'EN' ? 'EN' : 'UZ';

  return (
    <div className="relative w-full overflow-hidden bg-ink text-bone">
      {/* ───────── HERO SECTION ───────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-ink"
      >
        {/* 3D Interactive Ambient Globe - Strictly Contained & Fades out on scroll */}
        <motion.div
          style={{ opacity: globeOpacity, scale: globeScale }}
          className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[65%] flex items-center justify-center z-0 will-change-transform"
        >
          <Globe3D className="w-full h-full max-w-[900px] max-h-[900px] opacity-90" />
        </motion.div>

        {/* Readability Veil: Dark gradient protecting left side text from overlapping 3D canvas */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink via-ink/85 to-transparent lg:w-[70%]" />

        {/* Foreground Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:pl-16 pt-24 pb-32 max-w-4xl"
        >
          {/* Live Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full border border-signal/30 bg-signal/[0.07] backdrop-blur-md w-max"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal shadow-[0_0_8px_#9bf0b8]" />
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-signal font-semibold">
              {t('hero', 'live') || 'Jonli Eko-Platforma'}
            </span>
          </motion.div>

          {/* Heading */}
          <h1
            className="font-display font-light leading-[1.12] max-w-4xl tracking-tight py-1 text-left text-bone"
            style={{ fontSize: 'clamp(2.4rem, 5.8vw, 5.0rem)' }}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-block mr-[0.3em] ${
                  i >= 2
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-bone via-signal to-[#d9c08a]'
                    : 'text-bone'
                }`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-mist leading-relaxed font-sans"
          >
            {t('hero', 'subtitle')}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={handleStart}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-signal text-ink font-bold tracking-wide hover:bg-signal/90 transition-all cursor-pointer shadow-lg shadow-signal/25"
            >
              <span>{t('hero', 'cta')}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleMore}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 bg-white/[0.03] text-bone font-medium tracking-wide hover:border-signal/50 hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              {t('hero', 'explore')}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Live Data Cards (Desktop Right) */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="hidden xl:flex absolute right-12 top-28 z-10 w-64 flex-col gap-3.5"
        >
          <div className="rounded-2xl border border-signal/20 bg-[#07120e]/85 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase text-mist font-mono">
              <span>Havo • Toshkent</span>
              <span className="text-signal flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                jonli
              </span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-bone">
              {aqi ?? '42'}
              <span className="ml-2 font-mono text-xs text-mist">US AQI</span>
            </div>
            <div className="mt-4 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-signal to-[#d9c08a] rounded-full"
                style={{ width: `${Math.min(((aqi || 42) / 150) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="ml-6 rounded-2xl border border-white/[0.08] bg-[#07120e]/85 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase text-mist font-mono">
              <span>CO₂ O'rtacha</span>
              <span className="text-[#d9c08a]">ppm</span>
            </div>
            <div className="mt-3 font-display font-light text-4xl text-bone">
              421+
              <span className="ml-2 font-sans text-xs text-mist">global</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Ticker Marquee */}
        <div className="relative z-10 overflow-hidden border-t border-white/[0.07] bg-[#040908]/90 py-3 backdrop-blur-md">
          <div className="flex w-max animate-[marquee_45s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.35em] uppercase text-mist/80 font-mono">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {['Havo sifati', 'CO₂ monitoring', 'Daraxt ekish', 'Uglerod izi', 'Yashil loyihalar', '60 FPS WebGL', 'AI Tahlil'].map((w) => (
                  <span key={w} className="px-8">
                    {w}
                    <span className="ml-16 text-signal">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── IMPACT MANIFESTO SECTION (Completely Opaque & High Contrast) ───────── */}
      <section className="relative z-20 w-full bg-[#040908] text-bone px-6 py-28 border-t border-white/[0.08] overflow-hidden">
        {/* Subtle Ambient Radial Glow (Opaque, does not allow 3D sphere overlap) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Section Indicator */}
          <div className="mb-8 flex items-center gap-3 text-xs font-mono tracking-[0.3em] uppercase text-signal">
            <span className="px-2 py-0.5 rounded-full bg-signal/10 border border-signal/25">01</span>
            <span className="h-px w-12 bg-signal/30" />
            <span>
              {langKey === 'RU' ? 'Наша Миссия & Влияние' : langKey === 'EN' ? 'Mission & Impact' : 'Bizning Missiya & Ta\'sir'}
            </span>
          </div>

          {/* Inspiring Manifesto Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light leading-snug text-bone tracking-tight"
            style={{ fontSize: 'clamp(2.0rem, 4.2vw, 3.4rem)' }}
          >
            <Globe2 className="inline-block mr-3.5 -mt-2 text-signal" size={38} />
            {langKey === 'RU'
              ? 'Сохранение планеты — не просто выбор, а наша общая глобальная ответственность.'
              : langKey === 'EN'
              ? 'Protecting our planet is not just a choice, but our shared global responsibility.'
              : 'Sayyoramizni asrash — shaxsiy tanlov emas, balki barchamizning umumiy mas\'uliyatimizdir.'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-3xl text-mist text-base sm:text-lg leading-relaxed font-sans"
          >
            {langKey === 'RU'
              ? 'EcoPulse объединяет миллионы единомышленников по всему миру, используя датчики в реальном времени и искусственный интеллект для сокращения углеродного следа и посадки новых деревьев.'
              : langKey === 'EN'
              ? 'EcoPulse unites millions of eco-conscious champions worldwide, harnessing real-time sensory data and artificial intelligence to minimize carbon emissions and cultivate vibrant green ecosystems.'
              : 'EcoPulse dunyo bo\'ylab millionlab tabiatsevarlarni birlashtirib, real vaqtli sensorlar va sun\'iy intellekt ko\'magida uglerod izini kamaytirish hamda yangi o\'rmonlar barpo etishga xizmat qiladi.'}
          </motion.p>

          {/* Impact Stats Grid - High Contrast & Crisp GlassCards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.08] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
            {[
              {
                v: 1.5,
                d: 1,
                suf: 'M+',
                label: langKey === 'RU' ? 'Участники платформы' : langKey === 'EN' ? 'Platform Members' : 'Platforma a\'zolari',
                sub: langKey === 'RU' ? 'Активные защитники' : langKey === 'EN' ? 'Global Eco Heroes' : 'Global faollar',
              },
              {
                v: 1.2,
                d: 1,
                suf: 'K',
                label: langKey === 'RU' ? 'Зелёные проекты' : langKey === 'EN' ? 'Green Projects' : 'Yashil loyihalar',
                sub: langKey === 'RU' ? 'Финансировано' : langKey === 'EN' ? 'Funded & Verified' : 'Moliyalashtirilgan',
              },
              {
                v: 15000,
                d: 0,
                suf: '',
                label: langKey === 'RU' ? 'Деревьев посажено' : langKey === 'EN' ? 'Trees Planted' : 'Bugun ekilgan daraxt',
                sub: langKey === 'RU' ? 'За последние 24 часа' : langKey === 'EN' ? 'In last 24 hours' : 'So\'nggi 24 soatda',
                icon: true,
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#071310] p-8 sm:p-10 text-center sm:text-left flex flex-col justify-between group hover:bg-[#0a1814] transition-colors"
              >
                <div
                  className="font-display font-light text-bone tracking-tight"
                  style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}
                >
                  <CountUp value={s.v} decimals={s.d} duration={2.5} suffix={s.suf} />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-signal">
                    {s.icon && <Leaf size={14} className="text-signal" />}
                    <span>{s.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-mist mt-1 block">
                    {s.sub}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
