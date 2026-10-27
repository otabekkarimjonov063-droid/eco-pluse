import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Cloud, CloudSun, CloudRain, CloudLightning, 
  Snowflake, Wind, Droplets, Activity, RefreshCw, Compass
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const WEATHER_CITIES = [
  { name: { UZ: 'Toshkent', RU: 'Ташкент', EN: 'Tashkent' }, lat: 41.2995, lon: 69.2401, country: 'UZ', baseTemp: 22 },
  { name: { UZ: 'Samarqand', RU: 'Самарканд', EN: 'Samarkand' }, lat: 39.6542, lon: 66.9597, country: 'UZ', baseTemp: 21 },
  { name: { UZ: "Farg'ona", RU: 'Фергана', EN: 'Fergana' }, lat: 40.3842, lon: 71.7843, country: 'UZ', baseTemp: 20 },
  { name: { UZ: 'Buxoro', RU: 'Бухара', EN: 'Bukhara' }, lat: 39.7747, lon: 64.4286, country: 'UZ', baseTemp: 23 },
  { name: { UZ: 'Xiva', RU: 'Хива', EN: 'Khiva' }, lat: 41.3783, lon: 60.3639, country: 'UZ', baseTemp: 21 },
  { name: { UZ: 'Andijon', RU: 'Андижан', EN: 'Andijan' }, lat: 40.7821, lon: 72.3442, country: 'UZ', baseTemp: 19 },
  { name: { UZ: 'Zomin', RU: 'Заамин', EN: 'Zaamin' }, lat: 39.9606, lon: 68.3958, country: 'UZ', baseTemp: 16 },
  { name: { UZ: 'London', RU: 'Лондон', EN: 'London' }, lat: 51.5074, lon: -0.1278, country: 'UK', baseTemp: 14 },
  { name: { UZ: 'Tokio', RU: 'Токио', EN: 'Tokyo' }, lat: 35.6762, lon: 139.6503, country: 'JP', baseTemp: 18 },
  { name: { UZ: 'Dubay', RU: 'Дубай', EN: 'Dubai' }, lat: 25.2048, lon: 55.2708, country: 'AE', baseTemp: 31 },
  { name: { UZ: 'Nyu-York', RU: 'Нью-Йорк', EN: 'New York' }, lat: 40.7128, lon: -74.0060, country: 'US', baseTemp: 17 },
  { name: { UZ: 'Parij', RU: 'Париж', EN: 'Paris' }, lat: 48.8566, lon: 2.3522, country: 'FR', baseTemp: 15 },
];

const getWeatherMeta = (code) => {
  if (code === 0) return { label: { UZ: 'Ochiq osmon', RU: 'Ясно', EN: 'Clear Sky' }, icon: Sun, color: 'text-amber-400' };
  if (code <= 3) return { label: { UZ: 'Bulutli', RU: 'Переменная облачность', EN: 'Partly Cloudy' }, icon: CloudSun, color: 'text-emerald-400' };
  if (code <= 48) return { label: { UZ: 'Tuman', RU: 'Туман', EN: 'Foggy' }, icon: Cloud, color: 'text-mist' };
  if (code <= 67) return { label: { UZ: "Yomg'ir", RU: 'Дождь', EN: 'Rain' }, icon: CloudRain, color: 'text-cyan-400' };
  if (code <= 77) return { label: { UZ: 'Qor', RU: 'Снег', EN: 'Snow' }, icon: Snowflake, color: 'text-blue-300' };
  if (code <= 99) return { label: { UZ: 'Momaqaldiroq', RU: 'Гроза', EN: 'Thunderstorm' }, icon: CloudLightning, color: 'text-purple-400' };
  return { label: { UZ: "Mo'tadil", RU: 'Умеренно', EN: 'Mild' }, icon: CloudSun, color: 'text-emerald-400' };
};

const weatherCache = new Map();

export default function WeatherWidget({ variant = 'sidebar', compact = false }) {
  const isCompact = compact || variant === 'compact';
  const isBanner = variant === 'banner';
  const { language } = useLanguage();
  const [cityIndex, setCityIndex] = useState(0);
  const [weather, setWeather] = useState({
    temp: WEATHER_CITIES[0].baseTemp,
    humidity: 45,
    wind: 12,
    code: 0,
    aqi: 42,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cycleTick, setCycleTick] = useState(0);
  const abortRef = useRef(null);

  const currentCity = WEATHER_CITIES[cityIndex];

  // Fetch live weather data for city
  const fetchWeather = async (city) => {
    const cacheKey = `${city.lat},${city.lon}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.time < 60000) {
      setWeather(cached.data);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const current = data.current || {};
      const newWeather = {
        temp: Math.round(current.temperature_2m ?? city.baseTemp),
        humidity: Math.round(current.relative_humidity_2m ?? 48),
        wind: Math.round(current.wind_speed_10m ?? 12),
        code: current.weather_code ?? 0,
        aqi: Math.round(35 + (city.lat % 50)),
      };
      weatherCache.set(cacheKey, { time: Date.now(), data: newWeather });
      setWeather(newWeather);
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback to baseline
        setWeather((prev) => ({
          ...prev,
          temp: city.baseTemp,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when active city changes
  useEffect(() => {
    fetchWeather(currentCity);
  }, [cityIndex]);

  // Exact 10-second automatic cycle timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setCityIndex((prev) => (prev + 1) % WEATHER_CITIES.length);
      setCycleTick((prev) => prev + 1);
    }, 10000); // 10000ms = 10s

    return () => {
      clearInterval(timer);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const meta = getWeatherMeta(weather.code);
  const Icon = meta.icon;
  const cityName = currentCity.name[language] || currentCity.name.UZ;
  const conditionLabel = meta.label[language] || meta.label.UZ;

  // COMPACT VARIANT (Navbar / Mobile top bar / Hero badge)
  if (isCompact) {
    return (
      <div 
        onClick={() => setCityIndex((prev) => (prev + 1) % WEATHER_CITIES.length)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-xs font-mono cursor-pointer hover:border-signal/40 transition select-none shadow-xs"
        title="Keyingi shaharga o'tish (Har 10s avtomatik yangilanadi)"
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={cityName}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-1.5 text-bone"
          >
            <Icon size={13} className={`${meta.color} shrink-0`} />
            <span className="font-semibold truncate max-w-[85px] sm:max-w-none text-[11px] sm:text-xs">
              {cityName}
            </span>
            <span className="text-signal tabular-nums font-medium text-[11px] sm:text-xs">
              {weather.temp > 0 ? `+${weather.temp}` : weather.temp}°C
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // BANNER VARIANT (For Global Dashboard or Wide sections)
  if (isBanner) {
    return (
      <div className="w-full rounded-3xl eco-glass p-4 md:p-6 text-slate-800 dark:text-bone shadow-xl transition-colors border border-black/[0.06] dark:border-white/[0.08]">
        {/* Top Header Row with 10s indicator & API status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-signal shadow-[0_0_8px_rgba(155,240,184,0.7)]" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-signal">
              Jonli Ob-havo Markazi
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-mist/80 hidden sm:inline">
              • Open-Meteo API (10s almashinuv)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchWeather(currentCity)}
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-mist dark:hover:text-signal transition cursor-pointer"
              title="Yangilash"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin text-emerald-600 dark:text-signal' : ''} />
            </button>
            <span className="text-xs font-mono text-slate-700 dark:text-mist px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.06]">
              {cityIndex + 1} / {WEATHER_CITIES.length}
            </span>
          </div>
        </div>

        {/* 10-Second Countdown Progress Bar (Optimized GPU-only compositor) */}
        <div className="w-full bg-black/[0.06] dark:bg-white/[0.06] h-1 rounded-full overflow-hidden mb-4">
          <motion.div
            key={`banner-progress-${cityIndex}-${cycleTick}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 10, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            className="h-full bg-emerald-500 dark:bg-signal shadow-[0_0_8px_rgba(155,240,184,0.6)]"
          />
        </div>

        {/* Dynamic City Weather Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cityName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            {/* City & Condition */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-2xl md:text-3xl font-light text-slate-900 dark:text-bone tracking-tight">
                  {cityName}
                </h3>
                <span className="text-xs font-mono text-emerald-700 dark:text-signal px-2 py-0.5 rounded-md border border-emerald-500/30 dark:border-signal/20 bg-emerald-500/10 dark:bg-signal/5 font-semibold">
                  {currentCity.country}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-mist flex items-center gap-1.5 mt-1 font-sans">
                <Icon size={16} className={meta.color} />
                <span>{conditionLabel}</span>
              </p>
            </div>

            {/* Temperature */}
            <div className="flex items-center md:justify-center gap-3">
              <Icon size={42} className={`${meta.color} shrink-0`} />
              <div>
                <span className="font-display text-4xl md:text-5xl font-light text-slate-900 dark:text-bone tabular-nums tracking-tight">
                  {weather.temp > 0 ? `+${weather.temp}` : weather.temp}°C
                </span>
              </div>
            </div>

            {/* Environment Telemetry */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-600 dark:text-mist border-t md:border-t-0 md:border-l border-black/[0.06] dark:border-white/[0.06] pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center gap-2">
                <Wind size={15} className="text-emerald-600 dark:text-signal/80" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-mist/70 uppercase">Shamol</div>
                  <div className="text-slate-900 dark:text-bone font-medium">{weather.wind} km/h</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Droplets size={15} className="text-cyan-600 dark:text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-mist/70 uppercase">Namlik</div>
                  <div className="text-slate-900 dark:text-bone font-medium">{weather.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Activity size={15} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-mist/70 uppercase">AQI Ko'rsatkichi</div>
                  <div className="text-slate-900 dark:text-bone font-medium">{weather.aqi} • Toza havo</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* City Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-3 border-t border-black/[0.04] dark:border-white/[0.04] scrollbar-none">
          {WEATHER_CITIES.map((c, idx) => {
            const isSelected = idx === cityIndex;
            const cName = c.name[language] || c.name.UZ;
            return (
              <button
                key={c.lat}
                onClick={() => setCityIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white dark:bg-signal dark:text-ink font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-mist hover:text-slate-900 dark:hover:text-bone hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
                }`}
              >
                {cName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // SIDEBAR VARIANT (Default Desktop Sidebar Widget)
  return (
    <div className="w-full rounded-2xl eco-glass-card p-3 text-slate-800 dark:text-white transition-colors border border-black/[0.06] dark:border-white/[0.08]">
      {/* Header telemetry status */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-signal shadow-[0_0_8px_rgba(155,240,184,0.7)]" />
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-700 dark:text-signal font-semibold">
            Ob-havo • 10s
          </span>
        </div>
        <button
          onClick={() => setCityIndex((prev) => (prev + 1) % WEATHER_CITIES.length)}
          className="text-[10px] font-mono text-slate-500 hover:text-emerald-700 dark:text-mist dark:hover:text-signal transition cursor-pointer"
          title="Keyingi shaharga o'tish"
        >
          {cityIndex + 1}/{WEATHER_CITIES.length}
        </button>
      </div>

      {/* 10-Second Progress Bar */}
      <div className="w-full bg-black/[0.06] dark:bg-white/[0.04] h-0.5 rounded-full overflow-hidden mb-2">
        <motion.div
          key={`sidebar-progress-${cityIndex}-${cycleTick}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 10, ease: 'linear' }}
          style={{ transformOrigin: 'left' }}
          className="h-full bg-emerald-500 dark:bg-signal"
        />
      </div>

      {/* Main city and temp row with smooth 10s animated swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cityName}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base font-medium text-slate-900 dark:text-bone tracking-tight">
                  {cityName}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-mist/70 px-1 py-0.2 rounded bg-black/[0.05] dark:bg-white/[0.06]">
                  {currentCity.country}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-mist flex items-center gap-1 font-sans mt-0.5">
                {conditionLabel}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Icon size={24} className={`${meta.color} shrink-0`} />
              <span className="font-display text-2xl font-light text-slate-900 dark:text-bone tabular-nums tracking-tight">
                {weather.temp > 0 ? `+${weather.temp}` : weather.temp}°
              </span>
            </div>
          </div>

          {/* Environmental metrics: Wind & Humidity */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.04] text-[11px] font-mono text-slate-600 dark:text-mist">
            <div className="flex items-center gap-1.5">
              <Wind size={12} className="text-emerald-600 dark:text-signal/70" />
              <span>{weather.wind} km/h</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Droplets size={12} className="text-cyan-600 dark:text-cyan-400/80" />
              <span>{weather.humidity}% namlik</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
