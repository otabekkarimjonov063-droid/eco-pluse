import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, X, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const REGIONS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'Central Asia', label: 'Markaziy Osiyo' },
  { id: 'Europe', label: 'Yevropa' },
  { id: 'Asia', label: 'Osiyo' },
  { id: 'Middle East', label: 'Yaqin Sharq' },
  { id: 'Americas', label: 'Amerika' },
];

export default function LanguageModal() {
  const { 
    isLangModalOpen, 
    closeLangModal, 
    language, 
    setLanguage, 
    supportedLanguages 
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Reset filters when modal closes
  useEffect(() => {
    if (!isLangModalOpen) {
      setSearchQuery('');
      setSelectedRegion('all');
    }
  }, [isLangModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLangModalOpen) {
        closeLangModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLangModalOpen, closeLangModal]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (supportedLanguages || []).filter((item) => {
      const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
      if (!matchesRegion) return false;
      if (!q) return true;

      const codeMatch = item.code.toLowerCase().includes(q);
      const nameMatch = item.name.toLowerCase().includes(q);
      const nativeMatch = item.nativeName.toLowerCase().includes(q);
      const regionMatch = item.region.toLowerCase().includes(q);

      return codeMatch || nameMatch || nativeMatch || regionMatch;
    });
  }, [supportedLanguages, searchQuery, selectedRegion]);

  const handleSelect = (code) => {
    setLanguage(code);
    closeLangModal();
  };

  return (
    <AnimatePresence>
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Shaffof / Translucent Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLangModal}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Shaffof Crystal Glass Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lang-modal-title"
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden
                       bg-white/80 dark:bg-[#081512]/85 
                       backdrop-blur-2xl 
                       border border-slate-200/60 dark:border-emerald-500/25 
                       shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_40px_rgba(16,185,129,0.12)]
                       text-slate-800 dark:text-slate-100"
          >
            {/* Ambient decorative crystal glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                  <Globe className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="lang-modal-title" className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-bone">
                      Tilni tanlang
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                      <Sparkles className="w-2.5 h-2.5" />
                      35+ Tillar
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-mist mt-0.5">
                    Platforma interfeysini o'zingizga qulay dunyo tilida boshqaring
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeLangModal}
                aria-label="Yopish"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-black/[0.03] hover:bg-black/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.1] border border-black/5 dark:border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Region Filters */}
            <div className="relative z-10 px-6 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] space-y-3 bg-black/[0.015] dark:bg-white/[0.015]">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Til nomini yoki kodini qidiring (masalan: English, Русский, TR, 日本語)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm 
                             bg-white/60 dark:bg-black/30 
                             border border-black/10 dark:border-white/15 
                             text-slate-900 dark:text-bone 
                             placeholder:text-slate-400 dark:placeholder:text-slate-500
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 
                             backdrop-blur-sm transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Region Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer text-xs ${
                      selectedRegion === r.id
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-slate-600 dark:text-mist border border-black/5 dark:border-white/5'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Grid */}
            <div className="relative z-10 p-6 overflow-y-auto max-h-[50vh] scrollbar-thin">
              {filteredLanguages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-mist space-y-2">
                  <Globe className="w-8 h-8 mx-auto opacity-40 stroke-1" />
                  <p className="text-sm font-medium">Til topilmadi</p>
                  <p className="text-xs opacity-70">Qidiruv so'zini o'zgartirib ko'ring</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredLanguages.map((item) => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item.code)}
                        className={`group relative p-3 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                            : 'bg-white/40 dark:bg-white/[0.03] hover:bg-emerald-500/[0.08] dark:hover:bg-white/[0.07] border border-black/[0.08] dark:border-white/[0.08] hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Flag circle */}
                          <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                            {item.flag}
                          </div>

                          {/* Language titles */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-slate-900 dark:text-bone truncate">
                                {item.nativeName}
                              </span>
                              {item.rtl && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  RTL
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-mist truncate flex items-center gap-1.5 mt-0.5">
                              <span>{item.name}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                                {item.code}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Selected Checkmark or Select Arrow */}
                        <div className="shrink-0 pl-2">
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-black/10 dark:border-white/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-slate-400">
                              <span className="text-[10px]">•</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="relative z-10 px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-black/20 flex items-center justify-between text-xs text-slate-500 dark:text-mist">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(155,240,184,0.6)]" />
                Tanlangan til xotirada saqlanadi
              </span>
              <span className="font-mono text-[11px] opacity-75">
                {filteredLanguages.length} / {supportedLanguages?.length || 35} ta til
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
