import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Globe3D from './Globe3D'
import { useLanguage } from '../contexts/LanguageContext'
import WeatherWidget from './WeatherWidget'

const reveal = {
  hidden: { y: '110%' },
  show: (i) => ({ y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 * i } }),
}

export default function Hero({ onStart, onMore, setActiveTab, stats: statsProp }) {
  const ref = useRef(null)
  const { t, language } = useLanguage()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const globeOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const handleStart = onStart || (() => setActiveTab && setActiveTab('dashboard'))
  const handleMore = onMore || (() => setActiveTab && setActiveTab('projects'))

  const titleLines = {
    UZ: { line1: 'Sayyoramiz kelajagi', line2: 'sizning qadamlaringizda' },
    RU: { line1: 'Будущее планеты', line2: 'в ваших шагах' },
    EN: { line1: 'Future of our planet', line2: 'in your own steps' },
  }[language] || { line1: 'Sayyoramiz kelajagi', line2: 'sizning qadamlaringizda' }

  const defaultStats = [
    { 
      value: '1.5M+', 
      label: language === 'RU' ? 'Участники платформы' : language === 'EN' ? 'Platform Members' : "Platforma a'zolari" 
    },
    { 
      value: '1.2K', 
      label: language === 'RU' ? 'Активные проекты' : language === 'EN' ? 'Active Projects' : 'Faol loyihalar' 
    },
    { 
      value: '14 983', 
      label: language === 'RU' ? 'Посажено сегодня' : language === 'EN' ? 'Planted Today' : 'Bugun ekilgan daraxtlar' 
    },
  ]

  const stats = statsProp || defaultStats

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-12 pt-28 sm:px-10 lg:pl-12 lg:pr-16">
      {/* 3D globe: lives only in the hero and fades out on scroll */}
      <div className="pointer-events-none absolute inset-y-0 right-[-14vw] flex items-center lg:right-[-6vw]">
        <motion.div
          style={{ y: globeY, scale: globeScale, opacity: globeOpacity }}
          className="aspect-square w-[min(105vh,85vw)] will-change-transform"
        >
          <Globe3D />
        </motion.div>
      </div>

      {/* Soft readability veil behind the text */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--color-ink)/0.92)_10%,rgb(var(--color-ink)/0.72)_45%,transparent_75%)]" />

      <div className="relative z-10 max-w-[46rem]">
        <h1 className="font-display text-[clamp(2.6rem,6.2vw,5.75rem)] font-light leading-[0.98] tracking-[-0.02em] text-bone">
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span 
              key={`line1-${language}`}
              className="block" 
              variants={reveal} 
              custom={0} 
              initial="hidden" 
              animate="show"
            >
              {titleLines.line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span 
              key={`line2-${language}`}
              className="block italic text-bone/60" 
              variants={reveal} 
              custom={1} 
              initial="hidden" 
              animate="show"
            >
              {titleLines.line2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          key={`sub-${language}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 max-w-[34rem] text-lg leading-relaxed text-mist"
        >
          {t('hero', 'subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={handleStart}
            className="rounded-full bg-signal text-ink hover:bg-signal/90 px-7 py-3.5 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal cursor-pointer shadow-lg hover:shadow-xl font-sans"
          >
            {t('hero', 'cta')}
          </button>
          <button
            onClick={handleMore}
            className="rounded-full px-5 py-3.5 text-bone hover:text-signal transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal cursor-pointer border border-black/10 dark:border-white/10 hover:border-signal/40 font-sans"
          >
            {t('hero', 'explore')}
          </button>
        </motion.div>

        {/* Live Weather sensor ticker badge in Hero (Shown on mobile/tablet where sidebar is hidden) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-6 flex lg:hidden flex-wrap items-center gap-3"
        >
          <WeatherWidget variant="compact" />
          <span className="text-xs text-mist font-mono">
            {language === 'RU' ? '10с авто-обновление' : language === 'EN' ? '10s live auto-cycle' : '10s jonli almashinuv'}
          </span>
        </motion.div>
      </div>

      <dl className="relative z-10 mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-black/10 dark:border-white/10 pt-8 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-5xl font-light tabular-nums text-bone">{s.value}</dd>
            <dt className="mt-2 text-sm text-mist">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
