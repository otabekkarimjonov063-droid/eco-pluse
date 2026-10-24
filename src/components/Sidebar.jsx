import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sprout, LayoutDashboard, Calculator, GalleryVerticalEnd, 
  TreePine, ShieldAlert, LogIn, LogOut, Sun, Moon, Globe
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useVersion } from '../contexts/VersionContext'
import WeatherWidget from './WeatherWidget'

/**
 * items: [{ id, label, icon: LucideIcon }]
 * user:  { name, role }
 */
export default function Sidebar({ 
  items, 
  active, 
  onSelect, 
  user: userProp, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  onOpenLogin 
}) {
  const { t, language, setLanguage } = useLanguage()
  const { user: authUser, isAdmin, logout: authLogout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currentVersion, hasNewUpdate, setIsModalOpen } = useVersion()

  const currentActive = active || activeTab || 'home'
  const handleSelect = onSelect || setActiveTab
  const currentUser = userProp || authUser
  const handleLogout = onLogout || authLogout

  const navItems = items || [
    { id: 'home', label: t('navbar', 'home') || 'Bosh sahifa', icon: Sprout },
    { id: 'dashboard', label: t('navbar', 'dashboard') || 'Global Statistika', icon: LayoutDashboard },
    { id: 'calculator', label: t('navbar', 'calculator') || 'Kalkulyator', icon: Calculator },
    { id: 'projects', label: t('navbar', 'projects') || 'Loyiha Galereyasi', icon: GalleryVerticalEnd },
    { id: 'plant', label: t('navbar', 'plant') || 'Daraxt Ekish', icon: TreePine },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldAlert }] : [])
  ]

  const langs = ['UZ', 'RU', 'EN']

  return (
    <>
      {/* Mobile Top Bar with Brand, Weather, Theme, Language & Login */}
      {/* Mobile Top Bar with Brand, Weather, Theme, Language & Login */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-3 py-2 bg-white/90 dark:bg-moss/90 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.08] lg:hidden text-slate-800 dark:text-white">
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => handleSelect('home')} 
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_2px_rgba(155,240,184,0.55)]" />
            <span className="font-display text-lg font-light tracking-tight text-slate-900 dark:text-bone">EcoPulse</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 rounded-full border border-signal/25 bg-signal/10 hover:bg-signal/20 text-emerald-700 dark:text-signal font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer shadow-[0_0_8px_rgba(155,240,184,0.15)] flex items-center gap-1"
          >
            <span>{currentVersion}</span>
            {hasNewUpdate && <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />}
          </button>
        </div>

        {/* Compact Weather in Mobile Header (Always visible, 10s auto-switch) */}
        <div className="flex items-center">
          <WeatherWidget variant="compact" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme button */}
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni o'zgartirish"
            className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-slate-600 dark:text-mist hover:text-slate-900 dark:hover:text-bone cursor-pointer"
          >
            {isDark ? <Moon size={15} className="text-signal" /> : <Sun size={15} className="text-amber-500" />}
          </button>

          {/* Lang pill */}
          <div className="flex items-center rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-0.5 text-[11px] font-mono">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === l ? 'bg-black/10 dark:bg-white/15 text-emerald-700 dark:text-signal font-semibold' : 'text-slate-600 dark:text-mist'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* User / Login */}
          {currentUser ? (
            <button
              onClick={handleLogout}
              title="Chiqish"
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-slate-600 dark:text-mist hover:text-red-500 cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] text-emerald-700 dark:text-signal cursor-pointer"
            >
              <LogIn size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Sidebar (Unified Eco-Glass) */}
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-64 flex-col rounded-3xl eco-glass p-4 shadow-2xl lg:flex text-slate-800 dark:text-white border border-black/10 dark:border-white/15">
        {/* Brand */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 shrink-0 border-b border-black/[0.06] dark:border-white/[0.06] mb-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(155,240,184,0.55)]" />
            <span className="font-display text-2xl font-light tracking-tight text-slate-900 dark:text-bone">EcoPulse</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            title="EcoPulse Yangilanishlar Markazi (Changelog)"
            className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-signal/30 bg-signal/[0.12] hover:bg-signal/25 text-emerald-700 dark:text-signal transition-all cursor-pointer shadow-[0_0_12px_rgba(155,240,184,0.15)] hover:shadow-[0_0_18px_rgba(155,240,184,0.35)] hover:scale-105 active:scale-95"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
              {currentVersion}
            </span>
            {hasNewUpdate && (
              <span className="h-1.5 w-1.5 rounded-full bg-ember animate-bounce" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto pt-1 pb-2 px-1 scrollbar-none" aria-label="Asosiy menyu">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === currentActive
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] transition-all outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50 cursor-pointer ${
                  isActive 
                    ? 'text-emerald-700 dark:text-bone font-medium' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-mist dark:hover:text-bone hover:bg-black/[0.04] dark:hover:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-xl bg-emerald-500/10 dark:bg-white/[0.06] border border-emerald-500/20 dark:border-white/[0.08]"
                  >
                    <span className="absolute left-1.5 top-2.5 bottom-2.5 w-[3px] rounded-full bg-emerald-500 dark:bg-signal shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:shadow-[0_0_8px_rgba(155,240,184,0.6)]" />
                  </motion.span>
                )}
                <Icon size={18} strokeWidth={1.5} className={`relative shrink-0 ${isActive ? 'text-emerald-600 dark:text-signal' : ''}`} />
                <span className="relative truncate">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Unified Bottom Controls Dock (Weather + Auth + Theme + Language) */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <WeatherWidget variant="sidebar" />

          {/* User Profile or Login Action Button */}
          <AnimatePresence mode="wait">
            {currentUser ? (
              <motion.div
                key="user-logged-in"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.03] dark:bg-white/[0.03] p-2"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/15 dark:bg-signal/15 text-emerald-700 dark:text-signal font-display text-base">
                  {currentUser.name?.[0] || 'U'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-slate-800 dark:text-bone font-medium">{currentUser.name}</p>
                  <button 
                    onClick={handleLogout} 
                    className="text-[11px] text-slate-500 dark:text-mist transition hover:text-red-500 cursor-pointer flex items-center gap-1 group"
                  >
                    <LogOut size={11} className="group-hover:rotate-12 transition-transform" />
                    <span>Chiqish</span>
                  </button>
                </div>
                {isAdmin && <span className="rounded-md bg-emerald-500/10 dark:bg-signal/10 px-1.5 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-signal">Admin</span>}
              </motion.div>
            ) : (
              <motion.button
                key="user-logged-out"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                onClick={onOpenLogin}
                className="flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] py-2 px-3 text-xs font-medium text-slate-700 dark:text-bone transition hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:border-emerald-500/40 cursor-pointer shadow-xs"
              >
                <LogIn size={14} className="text-emerald-600 dark:text-signal" />
                <span>{t('navbar', 'login') || 'Kirish'}</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Unified Utility Bar: Theme Toggle + Language Pills in ONE neat horizontal row */}
          <div className="flex items-center justify-between gap-1 p-1 rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-mist dark:hover:text-bone cursor-pointer group"
              title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}
            >
              {isDark ? (
                <Moon size={13} className="text-signal group-hover:rotate-12 transition-transform" />
              ) : (
                <Sun size={13} className="text-amber-500 group-hover:rotate-45 transition-transform" />
              )}
              <span className="text-[11px] font-medium">{isDark ? 'Dark' : 'Light'}</span>
            </button>

            {/* Language Switcher Pills */}
            <div className="flex items-center gap-0.5">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                    language === l
                      ? 'bg-emerald-500/15 dark:bg-white/10 text-emerald-700 dark:text-signal font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-mist dark:hover:text-bone'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl eco-glass p-2 shadow-xl lg:hidden text-slate-800 dark:text-white border border-black/10 dark:border-white/15"
        aria-label="Asosiy menyu"
      >
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            aria-label={label}
            aria-current={id === currentActive ? 'page' : undefined}
            className={`grid h-11 w-11 place-items-center rounded-xl transition cursor-pointer ${
              id === currentActive ? 'bg-emerald-500/15 dark:bg-white/[0.08] text-emerald-700 dark:text-signal' : 'text-slate-500 dark:text-mist'
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </>
  )
}
