import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';

// Lazy load heavy page components & modals — only load when first visited
const LoginModal       = lazy(() => import('./components/LoginModal'));
const Hero             = lazy(() => import('./components/HeroSection'));
const GlobalDashboard = lazy(() => import('./components/GlobalDashboard'));
const CarbonCalculator = lazy(() => import('./components/CarbonCalculator'));
const EcoProjects     = lazy(() => import('./components/EcoProjects'));
const PlantTree       = lazy(() => import('./components/PlantTree'));
const EcoAIChat       = lazy(() => import('./components/EcoAIChat'));
const Footer          = lazy(() => import('./components/Footer'));
const AdminPanel      = lazy(() => import('./components/AdminPanel'));
const EcoComments     = lazy(() => import('./components/EcoComments'));
const VersionUpdateModal = lazy(() => import('./components/VersionUpdateModal'));
import VersionToast   from './components/VersionToast';

// Minimal restrained loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ink">
    <div className="flex flex-col items-center gap-5 relative z-10">
      <div className="relative w-10 h-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-white/10 border-t-signal"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse" />
        </div>
      </div>
      <span className="text-xs font-mono tracking-widest uppercase text-mist">
        Yuklanmoqda...
      </span>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return; // ignore same-tab clicks
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const openLogin  = useCallback(() => setIsLoginModalOpen(true),  []);
  const closeLogin = useCallback(() => setIsLoginModalOpen(false), []);

  return (
    <div className="min-h-screen relative flex bg-ink text-bone overflow-x-hidden selection:bg-signal/30 font-sans">

      {activeTab === 'admin' ? (
        <Suspense fallback={<PageLoader />}>
          <AdminPanel onExit={() => handleTabChange('home')} onOpenLogin={openLogin} />
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
          <main className="flex-1 lg:pl-72 pb-28 lg:pb-16 relative z-10 w-full min-h-screen flex flex-col">
            {/* Page content with smooth fade-up */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 w-full"
              >
                <Suspense fallback={<PageLoader />}>
                  {activeTab === 'home'       && (
                    <>
                      <Hero 
                        setActiveTab={handleTabChange}
                        onStart={() => handleTabChange('dashboard')}
                        onMore={() => handleTabChange('projects')}
                      />
                      <EcoComments />
                    </>
                  )}
                  {activeTab === 'dashboard'  && <GlobalDashboard />}
                  {activeTab === 'calculator' && <CarbonCalculator />}
                  {activeTab === 'projects'   && <EcoProjects />}
                  {activeTab === 'plant'      && <PlantTree />}
                </Suspense>
              </motion.div>
            </AnimatePresence>

            <Suspense fallback={null}>
              {activeTab !== 'plant' && <Footer setActiveTab={handleTabChange} />}
            </Suspense>
          </main>

          {/* Floating Chat */}
          <Suspense fallback={null}>
            <EcoAIChat />
          </Suspense>
        </>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <Suspense fallback={null}>
            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={closeLogin}
              setActiveTab={handleTabChange}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Version Updates Modal & Floating Toast */}
      <Suspense fallback={null}>
        <VersionUpdateModal />
      </Suspense>
      <VersionToast />
    </div>
  );
}

export default App;
