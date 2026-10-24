import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useVersion } from '../contexts/VersionContext';

export default function VersionToast() {
  const { toast, dismissToast, setIsModalOpen, applyUpdate, isUpdating, latestVersion, hasNewUpdate } = useVersion();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full mx-4 sm:mx-0 p-4 rounded-2xl bg-[#091512]/95 border border-signal/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl text-bone"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-signal/15 text-signal shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <Sparkles size={18} className="animate-spin-slow" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-bone font-sans truncate">
                {toast.title}
              </h4>
              <button
                onClick={dismissToast}
                className="text-mist hover:text-bone p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Yopish"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-mist mt-1 leading-relaxed font-sans">
              {toast.message}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  dismissToast();
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-signal/15 hover:bg-signal/25 text-signal text-xs font-semibold tracking-wide transition-all cursor-pointer border border-signal/20"
              >
                <span>Batafsil ko'rish</span>
                <ArrowRight size={13} />
              </button>

              {hasNewUpdate && toast.type === 'info' && (
                <button
                  disabled={isUpdating}
                  onClick={() => applyUpdate(latestVersion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-signal text-ink text-xs font-bold tracking-wide transition-all hover:bg-signal/90 cursor-pointer shadow-md"
                >
                  <RefreshCw size={12} className={isUpdating ? "animate-spin" : ""} />
                  <span>{isUpdating ? "O'rnatilmoqda..." : "Hozir yangilash"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
