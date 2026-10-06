import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, LayoutDashboard, Calculator, GalleryVerticalEnd, 
  User, LogOut, Sun, Moon, Globe, Settings, ChevronRight, ShieldAlert, TreePine
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Sidebar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navLinks = [
    { id: 'home', name: t('navbar', 'home'), icon: <Sprout size={20} /> },
    { id: 'dashboard', name: t('navbar', 'dashboard'), icon: <LayoutDashboard size={20} /> },
    { id: 'calculator', name: t('navbar', 'calculator'), icon: <Calculator size={20} /> },
    { id: 'projects', name: t('navbar', 'projects'), icon: <GalleryVerticalEnd size={20} /> },
    { id: 'plant', name: t('navbar', 'plant'), icon: <TreePine size={20} /> },
  ];

  const langs = ['UZ', 'RU', 'EN'];

  return (
    <>
      {/* Desktop Sidebar (Antigravity Style) */}
      <aside className="fixed left-6 top-6 bottom-6 w-72 rounded-3xl premium-glass-deep border border-white/40 dark:border-white/10 hidden lg:flex flex-col z-[9000] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] transition-colors duration-500 overflow-hidden">
        
        {/* Glow effect in background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1] rounded-3xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full"></div>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-black/5 dark:border-white/10 shrink-0 relative z-10">
          <Logo />
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 ml-2 text-slate-800 dark:text-white">Menyu</div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative ${
                activeTab === link.id 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeTab === link.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className={activeTab === link.id ? 'text-white' : 'text-emerald-500 group-hover:scale-110 transition-transform'}>
                  {link.icon}
                </div>
                <span>{link.name}</span>
                {activeTab === link.id && <ChevronRight size={16} className="ml-auto opacity-70" />}
              </div>
            </button>
          ))}
        </div>

        {/* User & Settings Box */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 shrink-0 bg-white/20 dark:bg-black/20 mx-4 mb-4 rounded-3xl backdrop-blur-md relative z-10 shadow-inner">
          
          {/* User Section */}
          <div className="mb-4">
            {user ? (
              <div className="flex items-center gap-3 p-3 premium-glass rounded-2xl">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                  <button onClick={logout} className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1 mt-0.5">
                    <LogOut size={12} /> {t('navbar', 'logout')}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 primary-button text-white rounded-2xl font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95"
              >
                <User size={18} /> {t('navbar', 'login')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Panel Toggle */}
            <button 
              onClick={() => setActiveTab('admin')} 
              className="flex-1 p-3 flex items-center justify-center premium-glass rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all text-slate-700 dark:text-red-400 group"
              title="Admin Panel"
            >
              <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="flex-1 p-3 flex items-center justify-center premium-glass rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-yellow-400 group"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform" />}
            </button>

            {/* Language Selector */}
            <div className="relative flex-1">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-full p-3 flex items-center justify-center gap-2 premium-glass rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition-all font-bold text-sm text-slate-800 dark:text-white"
              >
                <Globe size={18} className="text-emerald-500" /> {language}
              </button>
              
              {isLangOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-full premium-glass rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-fade-in border-emerald-500/20">
                  {langs.map(l => (
                    <button
                      key={l}
                      onClick={() => { setLanguage(l); setIsLangOpen(false); }}
                      className={`w-full py-2 text-sm font-bold transition-colors ${language === l ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (Floating Premium Glass) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 h-16 premium-glass rounded-3xl z-[9000] flex items-center justify-around px-2 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              activeTab === link.id ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeTab === link.id && (
              <motion.div 
                layoutId="mobileActiveTabIndicator"
                className="absolute inset-0 bg-emerald-500/10 rounded-2xl"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <div className={`relative z-10 p-1 transition-transform duration-300 ${activeTab === link.id ? 'scale-110' : ''}`}>
              {link.icon}
            </div>
            <span className="relative z-10 text-[10px] font-bold">{link.name}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
