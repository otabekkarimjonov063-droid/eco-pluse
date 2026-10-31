import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sprout, LayoutGrid, Calculator, Archive, 
  TreePine, Shield, LogIn, LogOut, Moon, Sun
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
  const currentUser = userProp || authUser || { name: 'Otabek Karimjonov' }
  const handleLogout = onLogout || authLogout

  const navItems = items || [
    { id: 'home', label: t('navbar', 'home') || 'Bosh sahifa', icon: Sprout },
    { id: 'dashboard', label: t('navbar', 'dashboard') || 'Global Statistika', icon: LayoutGrid },
    { id: 'calculator', label: t('navbar', 'calculator') || 'Kalkulyator', icon: Calculator },
    { id: 'projects', label: t('navbar', 'projects') || 'Loyiha Galereyasi', icon: Archive },
    { id: 'plant', label: t('navbar', 'plant') || 'Daraxt Ekish', icon: TreePine },
    { id: 'admin', label: 'Admin Panel', icon: Shield }
  ]

  const langs = ['UZ', 'RU', 'EN']

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-3 py-2 bg-[#06140e]/90 backdrop-blur-xl border-b border-white/[0.08] lg:hidden text-white">
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => handleSelect('home')} 
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_10px_2px_#34d399]" />
            <span className="font-serif text-lg font-normal tracking-tight text-white">EcoPulse</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white/80 font-mono text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1"
          >
            <span>{currentVersion || 'v2.8'}</span>
            {hasNewUpdate && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />}
          </button>
        </div>

        {/* Compact Weather in Mobile Header */}
        <div className="flex items-center">
          <WeatherWidget variant="compact" />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            aria-label="Mavzuni o'zgartirish"
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/80 cursor-pointer"
          >
            {isDark ? <Moon size={14} className="text-[#34d399]" /> : <Sun size={14} className="text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (Identical to Screenshot - Translucent Glass) */}
      <aside className="fixed bottom-14 left-5 top-5 z-40 hidden w-64 flex-col rounded-[1.75rem] bg-black/15 backdrop-blur-[3px] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] lg:flex text-white border border-white/[0.12]">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-3 pt-1 shrink-0 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#34d399] shadow-[0_0_12px_2px_#34d399]" />
            <span className="font-serif text-2xl font-light tracking-tight text-white">EcoPulse</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            title="EcoPulse Yangilanishlar Markazi (Changelog)"
            className="px-2.5 py-0.5 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-white/80 font-mono text-[11px] tracking-wider transition-all cursor-pointer"
          >
            <span>{currentVersion || 'v2.8'}</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pt-1 pb-2 px-0.5 scrollbar-none" aria-label="Asosiy menyu">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === currentActive
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm transition-all outline-none cursor-pointer ${
                  isActive 
                    ? 'text-white font-medium bg-white/[0.10] border border-white/[0.14] shadow-sm backdrop-blur-sm' 
                    : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon size={17} strokeWidth={1.5} className="shrink-0 text-white/80" />
                <span className="truncate">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Dock: Weather + User Info + Theme/Language Switcher */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          
          {/* Weather Widget */}
          <WeatherWidget variant="sidebar" />

          {/* User Profile Card */}
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/25 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-serif text-xs">
                O
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white/95 leading-tight">
                  {currentUser.name || 'Otabek Karimjonov'}
                </p>
                <button 
                  onClick={handleLogout} 
                  className="text-[10px] text-white/50 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <span>↪ Chiqish</span>
                </button>
              </div>
            </div>
            <span className="rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-white/70">
              Admin
            </span>
          </div>

          {/* Dark Toggle & UZ/RU/EN Segmented Control */}
          <div className="flex items-center justify-between gap-1.5">
            {/* Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-black/25 hover:bg-white/10 transition text-xs font-mono text-white/80 cursor-pointer backdrop-blur-md"
            >
              <Moon size={12} className="text-[#34d399]" />
              <span className="text-[11px]">Dark</span>
            </button>

            {/* Language Segmented Control */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl border border-white/[0.08] bg-black/25 text-xs font-mono backdrop-blur-md">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    language === l
                      ? 'bg-white/15 text-white font-bold shadow-xs'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl bg-[#07130e]/90 p-2 shadow-2xl lg:hidden text-white border border-white/15 backdrop-blur-2xl"
        aria-label="Asosiy menyu"
      >
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            aria-label={label}
            aria-current={id === currentActive ? 'page' : undefined}
            className={`grid h-11 w-11 place-items-center rounded-xl transition cursor-pointer ${
              id === currentActive ? 'bg-white/15 text-[#34d399]' : 'text-white/60'
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </>
  )
}
