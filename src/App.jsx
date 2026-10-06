import React, { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';

// Lazy load heavy page components — only load when first visited
const HeroSection     = lazy(() => import('./components/HeroSection'));
const GlobalDashboard = lazy(() => import('./components/GlobalDashboard'));
const CarbonCalculator = lazy(() => import('./components/CarbonCalculator'));
const EcoProjects     = lazy(() => import('./components/EcoProjects'));
const PlantTree       = lazy(() => import('./components/PlantTree'));
const EcoAIChat       = lazy(() => import('./components/EcoAIChat'));
const Footer          = lazy(() => import('./components/Footer'));
const AdminPanel      = lazy(() => import('./components/AdminPanel'));

// Lightweight loading spinner shown while lazy chunks load
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-eco-light dark:bg-[#07101a]">
    <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-emerald-500/5 rounded-full blur-[80px]" />
    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-cyan-500/5 rounded-full blur-[80px]" />
    
    <div className="flex flex-col items-center gap-6 relative z-10">
      <div className="relative w-20 h-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-[3px] border-cyan-500/20 border-b-cyan-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
        </div>
      </div>
      <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase animate-pulse">
        Yuklanmoqda...
      </span>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return; // ignore same-tab clicks
    setActiveTab(tab);
    // Native smooth scroll — no React re-render
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const openLogin  = useCallback(() => setIsLoginModalOpen(true),  []);
  const closeLogin = useCallback(() => setIsLoginModalOpen(false), []);

  return (
    <div className="min-h-screen relative flex bg-eco-light dark:bg-eco-dark overflow-x-hidden text-slate-800 dark:text-white">

      {activeTab === 'admin' ? (
        <Suspense fallback={<PageLoader />}>
          <AdminPanel onExit={() => handleTabChange('home')} />
        </Suspense>
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onOpenLogin={openLogin}
          />

          {/* Main Content */}
          <main className="flex-1 lg:ml-[340px] pb-16 lg:pb-0 relative z-10 w-full min-h-screen flex flex-col">
            {/* Page content — wrapped in AnimatePresence for buttery smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 w-full"
              >
                <Suspense fallback={<PageLoader />}>
                  {activeTab === 'home'       && <HeroSection setActiveTab={handleTabChange} />}
                  {activeTab === 'dashboard'  && <GlobalDashboard />}
                  {activeTab === 'calculator' && <CarbonCalculator />}
                  {activeTab === 'projects'   && <EcoProjects />}
                  {activeTab === 'plant'      && <PlantTree />}
                </Suspense>
              </motion.div>
            </AnimatePresence>

            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </main>

          {/* Floating Chat */}
          <Suspense fallback={null}>
            <EcoAIChat />
          </Suspense>
        </>
      )}

      {/* Login Modal — wrapped in AnimatePresence for exit animations */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLogin}
            setActiveTab={handleTabChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
