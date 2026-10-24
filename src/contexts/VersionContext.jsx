import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VERSIONS_HISTORY } from '../data/versions';

const VersionContext = createContext(null);

export const VersionProvider = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState(() => {
    try {
      return localStorage.getItem('ecopulse_app_version') || 'v2.7';
    } catch {
      return 'v2.7';
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(() => {
    try {
      return localStorage.getItem('ecopulse_auto_update') !== 'false';
    } catch {
      return true;
    }
  });

  // Check if a newer version exists compared to current
  const latestVersion = VERSIONS_HISTORY[1]?.version || 'v2.8'; // v2.8 is latest stable/available
  const hasNewUpdate = currentVersion === 'v2.6' || currentVersion === 'v2.7';

  // Toggle auto update setting
  const toggleAutoUpdate = useCallback(() => {
    setAutoUpdateEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ecopulse_auto_update', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Dismiss toast notification
  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Apply update to a target version
  const applyUpdate = useCallback((targetVersion) => {
    setIsUpdating(true);
    setUpdateProgress(10);

    const step1 = setTimeout(() => setUpdateProgress(45), 250);
    const step2 = setTimeout(() => setUpdateProgress(80), 550);
    const step3 = setTimeout(() => {
      setUpdateProgress(100);
      setCurrentVersion(targetVersion);
      try {
        localStorage.setItem('ecopulse_app_version', targetVersion);
      } catch (e) {
        console.error(e);
      }
      setIsUpdating(false);
      setToast({
        version: targetVersion,
        type: 'success',
        title: `EcoPulse ${targetVersion} ga muvaffaqiyatli yangilandi!`,
        message: 'Barcha yangi imkoniyatlar va 60 FPS optimizatsiyalar faollashtirildi.'
      });
    }, 900);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, []);

  // Check for updates manually
  const checkUpdates = useCallback(() => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      if (hasNewUpdate) {
        setToast({
          version: latestVersion,
          type: 'info',
          title: `Yangi versiya mavjud: EcoPulse ${latestVersion}!`,
          message: 'Yangiliklar bilan tanishish va o\'rnatish uchun bosing.'
        });
      } else {
        setToast({
          version: currentVersion,
          type: 'neutral',
          title: 'Siz eng so\'nggi versiyadasiz',
          message: `EcoPulse ${currentVersion} barcha yangi imkoniyatlar bilan faol.`
        });
      }
    }, 1200);
  }, [hasNewUpdate, latestVersion, currentVersion]);

  // Periodic automatic update checking
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    // Check after 60s for automatic update notification
    const timer = setTimeout(() => {
      if (currentVersion === 'v2.6' || currentVersion === 'v2.7') {
        setToast({
          version: 'v2.8',
          type: 'info',
          title: '🎉 Yangi EcoPulse v2.8 versiyasi tayyor!',
          message: 'Yangilanishlar markazini ochish va o\'rnatish uchun bosing.'
        });
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [autoUpdateEnabled, currentVersion]);

  return (
    <VersionContext.Provider
      value={{
        currentVersion,
        latestVersion,
        hasNewUpdate,
        versionsHistory: VERSIONS_HISTORY,
        isModalOpen,
        setIsModalOpen,
        isCheckingUpdate,
        isUpdating,
        updateProgress,
        autoUpdateEnabled,
        toggleAutoUpdate,
        checkUpdates,
        applyUpdate,
        toast,
        dismissToast,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};
