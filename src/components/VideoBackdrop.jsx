import React, { useState, useEffect, useRef } from 'react';

/**
 * Reusable full-screen looping ambient video backdrop component
 * Optimized for performance: pauses when tab is hidden, falls back on mobile/reduced-motion/saveData.
 */
export default function VideoBackdrop({ 
  src, 
  poster = '', 
  opacity = 0.35 
}) {
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Check constraints: prefers-reduced-motion, mobile screen (<768px), or Save-Data mode
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isSaveData = Boolean(
      navigator.connection && navigator.connection.saveData
    );

    if (!prefersReducedMotion && !isMobile && !isSaveData && src) {
      setShouldLoadVideo(true);
    } else {
      setShouldLoadVideo(false);
    }
  }, [src]);

  // Pause when tab is not active / visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
      {/* Fallback poster image */}
      {poster && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: canPlay ? 0 : opacity }}
        />
      )}

      {/* Video element */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setCanPlay(true)}
          onError={() => setCanPlay(false)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: canPlay ? opacity : 0 }}
        />
      )}

      {/* Atmospheric readability gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink transition-colors duration-300" />
    </div>
  );
}
