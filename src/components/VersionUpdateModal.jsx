import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, 
  Cpu, Flame, Layers, Clock, Zap, Check 
} from 'lucide-react';
import { useVersion } from '../contexts/VersionContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function VersionUpdateModal() {
  const {
    currentVersion,
    versionsHistory,
    isModalOpen,
    setIsModalOpen,
    isCheckingUpdate,
    isUpdating,
    updateProgress,
    autoUpdateEnabled,
    toggleAutoUpdate,
    checkUpdates,
    applyUpdate,
  } = useVersion();

  const { language } = useLanguage();

  if (!isModalOpen) return null;

  const langKey = language === 'RU' ? 'RU' : language === 'EN' ? 'EN' : 'UZ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl rounded-3xl bg-[#081410]/95 border border-signal/25 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-bone z-10 my-auto"
      >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-signal/15 border border-signal/30 flex items-center justify-center text-signal">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-xl font-display font-light text-bone tracking-tight">
                  {langKey === 'RU' ? 'Центр обновлений EcoPulse' : langKey === 'EN' ? 'EcoPulse Update Center' : 'EcoPulse Yangilanishlar Markazi'}
                </h3>
                <p className="text-xs text-mist font-sans">
                  {langKey === 'RU' ? 'История релизов, оптимизация 60 FPS и новые функции' : langKey === 'EN' ? 'Release history, 60 FPS engine, and feature roadmap' : 'Relizlar tarixi, 60 FPS optimizatsiyasi va yangi imkoniyatlar'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-mist hover:text-bone hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X size={18} />
            </button>
          </div>

          {/* Current Version Hero Card */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-signal/10 via-signal/5 to-transparent border border-signal/20 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="px-3.5 py-1.5 rounded-xl bg-signal/20 border border-signal/40 text-signal font-mono text-base font-bold tracking-wider shadow-[0_0_15px_rgba(155,240,184,0.3)]">
                  {currentVersion}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-bone font-sans">
                      {langKey === 'RU' ? 'Текущая установленная версия' : langKey === 'EN' ? 'Current Active Version' : 'Joriy o\'rnatilgan versiya'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-signal/20 text-signal border border-signal/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                      Faol
                    </span>
                  </div>
                  <p className="text-[11px] text-mist mt-0.5 font-sans">
                    {langKey === 'RU' ? 'Все системы работают с аппаратным ускорением GPU' : langKey === 'EN' ? 'Hardware-accelerated GPU graphics running smoothly' : 'Barcha tizimlar GPU apparat tezlashuvi bilan silliq ishlamoqda'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  disabled={isCheckingUpdate || isUpdating}
                  onClick={checkUpdates}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-bone transition-all cursor-pointer"
                >
                  <RefreshCw size={13} className={isCheckingUpdate ? "animate-spin text-signal" : ""} />
                  <span>
                    {isCheckingUpdate 
                      ? (langKey === 'RU' ? 'Проверка...' : langKey === 'EN' ? 'Checking...' : 'Tekshirilmoqda...') 
                      : (langKey === 'RU' ? 'Проверить' : langKey === 'EN' ? 'Check Now' : 'Tekshirish')}
                  </span>
                </button>

                {currentVersion !== 'v2.8' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => applyUpdate('v2.8')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-signal hover:bg-signal/90 text-ink text-xs font-bold transition-all cursor-pointer shadow-lg shadow-signal/20"
                  >
                    <Zap size={13} className="fill-ink" />
                    <span>
                      {isUpdating 
                        ? (langKey === 'RU' ? 'Обновление...' : langKey === 'EN' ? 'Updating...' : 'Yangilanmoqda...') 
                        : (langKey === 'RU' ? 'Обновить до v2.8' : langKey === 'EN' ? 'Upgrade to v2.8' : 'v2.8 ga o\'tish')}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Updating Progress Bar */}
            {isUpdating && (
              <div className="mt-4 pt-3 border-t border-signal/20">
                <div className="flex justify-between text-[11px] font-mono text-mist mb-1.5">
                  <span>{langKey === 'RU' ? 'Установка пакета обновления...' : langKey === 'EN' ? 'Installing update package...' : 'Yangilanish paketi o\'rnatilmoqda...'}</span>
                  <span className="text-signal">{updateProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-signal rounded-full shadow-[0_0_10px_#9bf0b8]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${updateProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Auto Update Setting */}
          <div className="mt-4 flex items-center justify-between px-2 text-xs">
            <span className="text-mist font-sans">
              {langKey === 'RU' ? 'Автоматическая проверка и уведомление о новых релизах' : langKey === 'EN' ? 'Automatically notify when new releases are available' : 'Yangi relizlar haqida avtomatik xabardor qilish'}
            </span>
            <button
              onClick={toggleAutoUpdate}
              className={`px-3 py-1 rounded-full font-mono text-[11px] transition-colors cursor-pointer border ${
                autoUpdateEnabled
                  ? 'bg-signal/20 text-signal border-signal/40'
                  : 'bg-white/[0.05] text-mist border-white/10'
              }`}
            >
              {autoUpdateEnabled ? 'Auto-Update: ON' : 'Auto-Update: OFF'}
            </button>
          </div>

          {/* Version History List */}
          <div className="mt-6 space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            <h4 className="text-xs font-mono tracking-widest uppercase text-mist mb-2">
              {langKey === 'RU' ? 'Хронология Версий & Changelog' : langKey === 'EN' ? 'Version Timeline & Changelog' : 'Versiyalar Tarixi & O\'zgarishlar'}
            </h4>

            {versionsHistory.map((v) => {
              const isCurrent = v.version === currentVersion;
              return (
                <div
                  key={v.version}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-signal/[0.04] border-signal/30 shadow-[0_4px_20px_rgba(155,240,184,0.06)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-bone">
                        {v.version}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${v.badgeColor}`}>
                        {v.badge[langKey] || v.badge.UZ}
                      </span>
                      <span className="text-[11px] font-mono text-mist">
                        {v.date}
                      </span>
                    </div>

                    <div>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-signal">
                          <Check size={14} />
                          <span>{langKey === 'RU' ? 'Активна' : langKey === 'EN' ? 'Active' : 'O\'rnatilgan'}</span>
                        </span>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => applyUpdate(v.version)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-signal/20 hover:text-signal border border-white/10 text-mist transition-colors cursor-pointer"
                        >
                          {langKey === 'RU' ? 'Переключить' : langKey === 'EN' ? 'Switch to this' : 'Ushbu versiyani tanlash'}
                        </button>
                      )}
                    </div>
                  </div>

                  <h5 className="text-sm font-medium text-bone font-sans mb-1">
                    {v.title[langKey] || v.title.UZ}
                  </h5>

                  <p className="text-xs text-mist leading-relaxed font-sans mb-3">
                    {v.description[langKey] || v.description.UZ}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.05]">
                    {v.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-bone/85">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.06] text-signal shrink-0 mt-0.5">
                          {feat.tag}
                        </span>
                        <span className="leading-tight font-sans text-mist/90">
                          {feat.text[langKey] || feat.text.UZ}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
  );
}
