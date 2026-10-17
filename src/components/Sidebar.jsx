import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sprout, LayoutDashboard, Calculator, GalleryVerticalEnd, 
  TreePine, ShieldAlert, LogIn, LogOut, Sun, Moon, Globe
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
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
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-3 py-2 bg-moss/90 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.08] lg:hidden">
        <button 
          onClick={() => handleSelect('home')} 
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_2px_rgba(155,240,184,0.55)]" />
          <span className="font-display text-lg font-light tracking-tight text-bone">EcoPulse</span>
        </button>

        {/* Compact Weather in Mobile Header (Always visible, 10s auto-switch) */}
        <div className="flex items-center">
          <WeatherWidget variant="compact" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme button */}
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni o'zgartirish"
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-mist hover:text-bone cursor-pointer"
          >
            {isDark ? <Moon size={15} className="text-signal" /> : <Sun size={15} className="text-amber-400" />}
          </button>

          {/* Lang pill */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-[11px] font-mono">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === l ? 'bg-white/15 text-signal font-semibold' : 'text-mist'
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
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-mist hover:text-ember cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-signal cursor-pointer"
            >
              <LogIn size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-64 flex-col rounded-3xl border border-black/[0.08] dark:border-white/[0.07] bg-white/85 dark:bg-moss/70 p-4 backdrop-blur-2xl shadow-xl dark:shadow-none lg:flex">
        {/* Brand */}
        <div className="flex items-center justify-between px-3 pb-5 pt-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_2px_rgba(155,240,184,0.55)]" />
            <span className="font-display text-2xl font-light tracking-tight text-bone">EcoPulse</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-signal/20 bg-signal/5 text-signal">
            v2.6
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1" aria-label="Asosiy menyu">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === currentActive
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal cursor-pointer ${
                  isActive ? 'text-bone font-medium' : 'text-mist hover:text-bone'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-xl bg-black/[0.05] dark:bg-white/[0.06]"
                  >
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-signal" />
                  </motion.span>
                )}
                <Icon size={18} strokeWidth={1.5} className="relative shrink-0" />
                <span className="relative truncate">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Real-time Live Weather Widget (Cycles every 10 seconds) */}
        <div className="mt-3">
          <WeatherWidget variant="sidebar" />
        </div>

        {/* User Card or Login Button with Framer-motion animation */}
        <AnimatePresence mode="wait">
          {currentUser ? (
            <motion.div
              key="user-logged-in"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center gap-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03] p-3"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal/15 text-signal font-display text-lg">
                {currentUser.name?.[0] || 'U'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-bone font-medium">{currentUser.name}</p>
                <button 
                  onClick={handleLogout} 
                  className="text-xs text-mist transition hover:text-ember cursor-pointer flex items-center gap-1 group"
                >
                  <LogOut size={12} className="group-hover:rotate-12 transition-transform" />
                  <span>Chiqish</span>
                </button>
              </div>
              {isAdmin && <span className="rounded-md bg-signal/10 px-2 py-0.5 text-xs font-mono text-signal">Admin</span>}
            </motion.div>
          ) : (
            <motion.button
              key="user-logged-out"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onClick={onOpenLogin}
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3 text-sm font-medium text-bone transition hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:border-signal/40 cursor-pointer"
            >
              <LogIn size={16} className="text-signal" />
              <span>{t('navbar', 'login') || 'Kirish'}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Dark Mode / Light Mode Toggle & UZ / RU / EN Language Switcher directly below */}
        <div className="mt-3 flex flex-col gap-2 pt-2.5 border-t border-black/[0.08] dark:border-white/[0.06]">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition text-xs font-mono text-mist hover:text-bone cursor-pointer group"
            title={isDark ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <Moon size={14} className="text-signal group-hover:rotate-12 transition-transform" />
              ) : (
                <Sun size={14} className="text-amber-500 group-hover:rotate-45 transition-transform" />
              )}
              <span>{isDark ? "Qorong'u rejim" : "Yorug' rejim"}</span>
            </span>
            <span className="w-8 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center p-0.5 transition-colors">
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-3 h-3 rounded-full ${isDark ? 'bg-signal ml-auto' : 'bg-amber-500'}`}
              />
            </span>
          </button>

          {/* UZ / RU / EN Language Switcher */}
          <div className="flex items-center justify-between rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] p-1 text-xs font-mono">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`flex-1 py-1 rounded-lg text-center transition cursor-pointer ${
                  language === l
                    ? 'bg-signal/20 dark:bg-white/10 text-signal font-semibold shadow-sm'
                    : 'text-mist hover:text-bone'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-white/[0.08] bg-moss/90 p-2 backdrop-blur-2xl lg:hidden"
        aria-label="Asosiy menyu"
      >
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            aria-label={label}
            aria-current={id === currentActive ? 'page' : undefined}
            className={`grid h-11 w-11 place-items-center rounded-xl transition cursor-pointer ${
              id === currentActive ? 'bg-white/[0.08] text-signal' : 'text-mist'
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </>
  )
}
