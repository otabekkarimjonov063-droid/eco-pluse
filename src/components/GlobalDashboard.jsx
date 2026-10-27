import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Wind, CloudRain, Activity, Droplets, MapPin, ArrowUpRight, ArrowDownRight, Globe, Search, Bot, Loader2, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import CountUp from './CountUp';
import GlassCard from './GlassCard';
import VideoBackdrop from './VideoBackdrop';
import WeatherWidget from './WeatherWidget';
import { chart, ChartDefs, aqiColor } from '../lib/chartTheme';

// Initial Mock Data (used as fallback or default list)
const generateCityData = () => [
  { city: 'Toshkent, UZ', aqi: 110, co2: 410, wind: 15, humidity: 45, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'up', progress: 65 },
  { city: 'London, UK', aqi: 45, co2: 390, wind: 22, humidity: 75, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 25 },
  { city: 'Tokio, JP', aqi: 65, co2: 400, wind: 10, humidity: 60, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 40 },
  { city: 'Nyu-York, US', aqi: 85, co2: 420, wind: 18, humidity: 55, rating: 'Qoniqarli', color: 'text-green-500', bg: 'bg-green-500', trend: 'up', progress: 55 },
  { city: 'Dehli, IN', aqi: 210, co2: 520, wind: 5, humidity: 65, rating: 'Xavfli', color: 'text-red-500', bg: 'bg-red-500', trend: 'up', progress: 95 },
  { city: 'Parij, FR', aqi: 50, co2: 385, wind: 12, humidity: 70, rating: 'A\'lo', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 30 },
  { city: 'Pekin, CN', aqi: 155, co2: 480, wind: 8, humidity: 50, rating: 'Yomon', color: 'text-orange-500', bg: 'bg-orange-500', trend: 'up', progress: 80 },
  { city: 'Sidney, AU', aqi: 35, co2: 380, wind: 25, humidity: 60, rating: 'A\'lo', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 15 },
  { city: 'Moskva, RU', aqi: 75, co2: 415, wind: 14, humidity: 80, rating: 'Yaxshi', color: 'text-green-500', bg: 'bg-green-500', trend: 'up', progress: 45 },
  { city: 'Dubay, AE', aqi: 120, co2: 430, wind: 18, humidity: 30, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'down', progress: 60 },
  { city: 'Olmaota, KZ', aqi: 140, co2: 445, wind: 10, humidity: 55, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'up', progress: 70 },
  { city: 'Seul, KR', aqi: 90, co2: 410, wind: 11, humidity: 65, rating: 'Qoniqarli', color: 'text-green-500', bg: 'bg-green-500', trend: 'down', progress: 50 },
  { city: 'Berlin, DE', aqi: 40, co2: 388, wind: 16, humidity: 72, rating: 'A\'lo', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 20 },
  { city: 'Rim, IT', aqi: 60, co2: 395, wind: 12, humidity: 68, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'up', progress: 35 },
  { city: 'Istanbul, TR', aqi: 105, co2: 425, wind: 20, humidity: 60, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'up', progress: 65 },
  { city: 'Qohira, EG', aqi: 170, co2: 460, wind: 8, humidity: 40, rating: 'Yomon', color: 'text-orange-500', bg: 'bg-orange-500', trend: 'up', progress: 85 },
  { city: 'Singapur, SG', aqi: 55, co2: 390, wind: 14, humidity: 85, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 28 },
  { city: 'Toronto, CA', aqi: 30, co2: 385, wind: 22, humidity: 60, rating: 'A\'lo', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 10 },
  { city: 'San-Paulu, BR', aqi: 115, co2: 435, wind: 12, humidity: 75, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'up', progress: 68 },
];

const generateChartData = () => {
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'];
  return months.map(month => ({
    name: month,
    CO2: 380 + Math.floor(Math.random() * 60),
    AQI: 40 + Math.floor(Math.random() * 80),
    Target: 390
  }));
};

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white dark:bg-[#0c0d12]/95 border border-black/[0.08] dark:border-white/10 px-3.5 py-2.5 shadow-xl backdrop-blur-md text-xs font-mono">
        <p className="text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4 py-0.5">
            <span className="text-zinc-600 dark:text-zinc-300 font-sans">{entry.name}:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

// Staggered Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
};

const getRatingStyle = (rating, color) => {
  const r = (rating || '').toLowerCase();
  const c = (color || '').toLowerCase();

  if (r.includes("a'lo") || r.includes('alo') || c.includes('emerald')) {
    return {
      badge: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30',
      label: 'text-emerald-700/80 dark:text-emerald-300/80',
      value: 'text-emerald-700 dark:text-emerald-300',
      chip: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
      dot: 'bg-emerald-500',
      border: 'border-emerald-500',
      bgLight: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    };
  }
  if (r.includes('yaxshi') || (c.includes('green') && !c.includes('emerald'))) {
    return {
      badge: 'bg-green-500/10 dark:bg-green-500/20 border-green-500/30',
      label: 'text-green-700/80 dark:text-green-300/80',
      value: 'text-green-700 dark:text-green-300',
      chip: 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30',
      dot: 'bg-green-500',
      border: 'border-green-500',
      bgLight: 'bg-green-500/20 text-green-600 dark:text-green-400',
    };
  }
  if (r.includes('qoniqarli') || c.includes('teal')) {
    return {
      badge: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30',
      label: 'text-teal-700/80 dark:text-teal-300/80',
      value: 'text-teal-700 dark:text-teal-300',
      chip: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30',
      dot: 'bg-teal-500',
      border: 'border-teal-500',
      bgLight: 'bg-teal-500/20 text-teal-600 dark:text-teal-400',
    };
  }
  if (r.includes("o'rtacha") || r.includes('ortacha') || c.includes('yellow')) {
    return {
      badge: 'bg-amber-500/10 dark:bg-yellow-500/20 border-amber-500/30',
      label: 'text-amber-800/80 dark:text-yellow-300/80',
      value: 'text-amber-800 dark:text-yellow-300',
      chip: 'bg-amber-500/10 dark:bg-yellow-500/20 text-amber-800 dark:text-yellow-300 border border-amber-500/30',
      dot: 'bg-amber-500',
      border: 'border-amber-500',
      bgLight: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    };
  }
  if (r.includes('yomon') || c.includes('orange')) {
    return {
      badge: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30',
      label: 'text-orange-800/80 dark:text-orange-300/80',
      value: 'text-orange-800 dark:text-orange-300',
      chip: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/30',
      dot: 'bg-orange-500',
      border: 'border-orange-500',
      bgLight: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    };
  }
  if (r.includes('xavfli') || c.includes('red')) {
    return {
      badge: 'bg-rose-500/10 dark:bg-red-500/20 border-rose-500/30',
      label: 'text-rose-800/80 dark:text-rose-300/80',
      value: 'text-rose-800 dark:text-rose-300',
      chip: 'bg-rose-500/10 dark:bg-red-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30',
      dot: 'bg-rose-500',
      border: 'border-red-500',
      bgLight: 'bg-red-500/20 text-red-600 dark:text-red-400',
    };
  }
  return {
    badge: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30',
    label: 'text-emerald-700/80 dark:text-emerald-300/80',
    value: 'text-emerald-700 dark:text-emerald-300',
    chip: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    dot: 'bg-emerald-500',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  };
};

const getRatingText = (rating, lang) => {
  const r = (rating || '').toLowerCase();
  if (r.includes('alo') || r.includes("a'lo") || r.includes('excellent') || r.includes('отлич')) {
    return lang === 'RU' ? 'Отлично' : lang === 'EN' ? 'Excellent' : "A'lo";
  }
  if (r.includes('yaxshi') || r.includes('good') || r.includes('хорош')) {
    return lang === 'RU' ? 'Хорошо' : lang === 'EN' ? 'Good' : 'Yaxshi';
  }
  if (r.includes('qoniqarli') || r.includes('satisfactory') || r.includes('удовл')) {
    return lang === 'RU' ? 'Удовлетворительно' : lang === 'EN' ? 'Satisfactory' : 'Qoniqarli';
  }
  if (r.includes('ortacha') || r.includes("o'rtacha") || r.includes('moderate') || r.includes('средн')) {
    return lang === 'RU' ? 'Средне' : lang === 'EN' ? 'Moderate' : "O'rtacha";
  }
  if (r.includes('yomon') || r.includes('poor') || r.includes('плох')) {
    return lang === 'RU' ? 'Плохо' : lang === 'EN' ? 'Poor' : 'Yomon';
  }
  if (r.includes('xavfli') || r.includes('dangerous') || r.includes('опасн')) {
    return lang === 'RU' ? 'Опасно' : lang === 'EN' ? 'Dangerous' : 'Xavfli';
  }
  return rating || '';
};

const GlobalDashboard = () => {
  const { language, t } = useLanguage();
  const [cities, setCities] = useState(generateCityData());
  const [chartData] = useState(generateChartData());
  const [activeCityName, setActiveCityName] = useState(cities[0].city);
  
  // Real-time & Network state
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine styling based on AQI
  const getAqiConfig = (aqi) => {
    if (aqi <= 50) return { rating: "A'lo", color: 'text-emerald-400', bg: 'bg-emerald-400', progress: 15 };
    if (aqi <= 100) return { rating: 'Yaxshi', color: 'text-green-500', bg: 'bg-green-500', progress: 35 };
    if (aqi <= 150) return { rating: "O'rtacha", color: 'text-yellow-500', bg: 'bg-yellow-500', progress: 60 };
    if (aqi <= 200) return { rating: 'Yomon', color: 'text-orange-500', bg: 'bg-orange-500', progress: 85 };
    return { rating: 'Xavfli', color: 'text-red-500', bg: 'bg-red-500', progress: 100 };
  };

  // Fallback AI generation (if API key missing or error)
  const getFallbackRecommendation = (aqi, city) => {
    if (language === 'RU') {
      if (aqi <= 50) return `Отлично! В городе ${city} очень чистый воздух. Идеальное время для спорта на открытом воздухе.`;
      if (aqi <= 100) return `Качество воздуха в городе ${city} удовлетворительное. Можно безопасно гулять.`;
      if (aqi <= 150) return `Внимание: в городе ${city} легкое загрязнение. Рекомендуется ограничить время на открытом воздухе.`;
      if (aqi <= 200) return `Опасно! В ${city} показатель AQI ${aqi}. Рекомендуется надевать защитную маску N95.`;
      return `Критический уровень! В ${city} воздух загрязнен. Закройте окна и оставайтесь дома.`;
    }
    if (language === 'EN') {
      if (aqi <= 50) return `Excellent! The air quality in ${city} is pristine. Ideal time for outdoor activities.`;
      if (aqi <= 100) return `Air quality in ${city} is satisfactory. Safe for daily outdoor movement.`;
      if (aqi <= 150) return `Notice: ${city} has moderate pollution. Sensitive groups should wear protective masks.`;
      if (aqi <= 200) return `Warning! AQI in ${city} reached ${aqi}. N95 mask is strongly advised outdoors.`;
      return `Critical alert! Air pollution in ${city} is hazardous. Close windows and remain indoors.`;
    }
    if (aqi <= 50) return `Ajoyib! ${city}da havo juda toza. Ochiq havoda sport bilan shug'ullanish uchun ideal vaqt.`;
    if (aqi <= 100) return `${city}da havo sifati qoniqarli. Tashqarida bemalol sayr qilishingiz mumkin.`;
    if (aqi <= 150) return `Diqqat: ${city}da havo biroz ifloslangan. Nafas olish yo'llarida muammosi borlar uzoq vaqt ko'chada qolmasin.`;
    if (aqi <= 200) return `Xavfli! ${city}da AQI ${aqi}. Tashqariga chiqish tavsiya etilmaydi, albatta N95 maska taqing.`;
    return `Kritik xavf! ${city}da havo o'ta iflos. Zudlik bilan derazalarni yoping va uydan chiqmang!`;
  };

  // Real LLM API Generation (OpenAI)
  const generateRealAIRecommendation = async (city, aqi, co2) => {
    setIsAiLoading(true);
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // If no key is set in .env, use fallback
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      setTimeout(() => {
        setAiMessage(getFallbackRecommendation(aqi, city));
        setIsAiLoading(false);
      }, 800);
      return;
    }

    try {
      const prompt = `Shahar: ${city}, AQI: ${aqi}, CO2: ${co2}. Shu ma'lumotlar asosida foydalanuvchiga 1-2 gapli sog'liq bo'yicha maslahat ber, o'zbek tilida, qisqa va aniq. Agar AQI > 100 bo'lsa maska taqishni eslat.`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 80,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiMessage(data.choices[0].message.content);
      } else {
        setAiMessage(getFallbackRecommendation(aqi, city));
      }
    } catch (err) {
      console.error("AI API Xatosi:", err);
      setAiMessage(getFallbackRecommendation(aqi, city));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Fetch real data from Open-Meteo API
  const fetchCityData = async (cityName) => {
    try {
      // 1. Get Coordinates
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        return null;
      }
      
      const { latitude, longitude, name } = geoData.results[0];
      
      // 2. Get Air Quality & Weather
      const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm2_5,carbon_monoxide`);
      const aqiData = await aqiRes.json();
      
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m,relative_humidity_2m`);
      const weatherData = await weatherRes.json();

      const aqi = aqiData.current.european_aqi || Math.floor(Math.random() * 100) + 20;
      const config = getAqiConfig(aqi);
      
      return {
        city: name,
        aqi: aqi,
        co2: aqiData.current.carbon_monoxide ? Math.round(aqiData.current.carbon_monoxide) : 400,
        wind: weatherData.current?.wind_speed_10m ? Math.round(weatherData.current.wind_speed_10m) : 12,
        humidity: weatherData.current?.relative_humidity_2m || 50,
        rating: config.rating,
        color: config.color,
        bg: config.bg,
        trend: 'up',
        progress: config.progress,
      };
    } catch (error) {
      console.error("Ma'lumot olishda xato:", error);
      return null;
    }
  };

  // User search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !isOnline) return;
    
    setIsLoading(true);
    setAiMessage('');
    
    const newCity = await fetchCityData(searchQuery);
    
    if (newCity) {
      setCities(prev => {
        const filtered = prev.filter(c => c.city !== newCity.city);
        return [newCity, ...filtered].slice(0, 5); // Keep top 5 cached
      });
      setActiveCityName(newCity.city);
      setSearchQuery('');
      setLastUpdated(new Date());
      // Call AI for recommendation
      generateRealAIRecommendation(newCity.city, newCity.aqi, newCity.co2);
    } else {
      setAiMessage(`Kechirasiz, "${searchQuery}" shahri topilmadi yoki tarmoq xatosi.`);
    }
    
    setIsLoading(false);
  };

  // Live polling every 45 seconds for the active city (throttled to avoid network/CPU lag)
  useEffect(() => {
    let interval;
    if (isOnline) {
      interval = setInterval(async () => {
        if (typeof document !== 'undefined' && document.hidden) return;
        const updatedData = await fetchCityData(activeCityName);
        if (updatedData) {
          setCities(prev => prev.map(c => c.city === activeCityName ? updatedData : c));
          setLastUpdated(new Date());
        }
      }, 45000); // Throttled 45s interval
    }
    return () => clearInterval(interval);
  }, [isOnline, activeCityName]);

  const activeCity = cities.find(c => c.city === activeCityName) || cities[0];

  // On initial mount, generate AI message for first city
  useEffect(() => {
    if (!aiMessage && activeCity) {
      generateRealAIRecommendation(activeCity.city, activeCity.aqi, activeCity.co2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 relative overflow-hidden text-slate-800 dark:text-bone">
      {/* Dynamic Looping Video Background */}
      <VideoBackdrop 
        src="/videos/clouds.mp4" 
        poster="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=1600" 
        opacity={0.25} 
      />

      {/* Deep Antigravity Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header & Live Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 relative"
        >
          {/* Live Indicator Network Status */}
          <div className="absolute right-0 top-0 hidden md:flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-moss/70 px-4 py-2 backdrop-blur-md shadow-xs">
            {isOnline ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-signal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-signal shadow-[0_0_8px_rgba(155,240,184,0.6)]"></span>
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-signal flex items-center gap-2">
                  <Wifi size={14} /> LIVE
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-mono font-medium text-red-500 dark:text-red-400 flex items-center gap-2">
                  <WifiOff size={14} /> OFFLINE
                </span>
              </>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-light mb-3 text-slate-900 dark:text-bone flex items-center justify-center gap-3 py-1">
            <Globe className="text-emerald-600 dark:text-signal" size={36} /> {t('dashboard', 'title')}
          </h1>
          <p className="text-base text-slate-600 dark:text-mist max-w-2xl mx-auto font-normal">
            {t('dashboard', 'subtitle')}
          </p>
        </motion.div>

        {/* Live 10s Open-Meteo Weather Sensor Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <WeatherWidget variant="banner" />
        </motion.div>

        {/* AI Search & Recommendation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className={`rounded-2xl p-1.5 pl-4 flex items-center gap-3 eco-glass-input shadow-md ${!isOnline ? '!border-red-500/60' : ''}`}>
              <Search size={18} className={isOnline ? 'text-emerald-600 dark:text-signal' : 'text-red-400'} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!isOnline}
                placeholder={isOnline ? t('dashboard', 'search_placeholder') : t('dashboard', 'no_connection')}
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-bone placeholder-slate-400 dark:placeholder-mist text-sm font-normal disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isLoading || !searchQuery.trim() || !isOnline}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-signal dark:hover:bg-signal/90 px-5 py-2 text-xs font-semibold text-white dark:text-ink transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : t('dashboard', 'analyze_btn')}
              </button>
            </div>
          </form>

          {/* AI Insight Card */}
          <AnimatePresence mode="wait">
            {(aiMessage || isAiLoading) && (
              <GlassCard 
                tone="raised"
                as={motion.div}
                key={activeCity.city}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5"
              >
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 dark:bg-signal/10 text-emerald-700 dark:text-signal border border-emerald-500/25 dark:border-signal/20">
                    <Bot size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="font-medium text-sm flex items-center gap-1.5 text-slate-900 dark:text-bone">
                        AI Intelligence <Sparkles size={14} className="text-emerald-600 dark:text-signal" />
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-mist flex items-center gap-1">
                        <Activity size={11} className="text-emerald-600 dark:text-signal" /> Open-Meteo
                      </span>
                    </div>
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-mist text-xs font-mono">
                        <Loader2 size={14} className="animate-spin" /> Generating environmental insight...
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm font-normal leading-relaxed text-slate-700 dark:text-bone/90">
                        {aiMessage}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Top Cards Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
        >
          <GlassCard tone="base" as={motion.div} variants={itemVariants} className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] rounded-xl text-slate-800 dark:text-bone">
                <CloudRain size={20} />
              </div>
              <span className="flex items-center text-xs font-mono font-semibold text-emerald-700 dark:text-signal bg-emerald-500/10 dark:bg-signal/10 px-2 py-0.5 rounded-md border border-emerald-500/20 dark:border-signal/20">
                <ArrowUpRight size={13} /> 2.4%
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-1">Global CO2 Avg</h3>
            <div className="text-3xl font-display font-light tabular-nums text-slate-900 dark:text-bone flex items-baseline gap-1.5">
              <CountUp value={412.5} decimals={1} duration={1.5} /> <span className="text-sm font-sans text-slate-500 dark:text-mist font-normal">ppm</span>
            </div>
          </GlassCard>

          <GlassCard tone="base" as={motion.div} variants={itemVariants} className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] rounded-xl text-emerald-600 dark:text-signal">
                <Wind size={20} />
              </div>
              <span className="flex items-center text-xs font-mono font-semibold text-emerald-700 dark:text-signal bg-emerald-500/10 dark:bg-signal/10 px-2 py-0.5 rounded-md border border-emerald-500/20 dark:border-signal/20">
                <ArrowDownRight size={13} /> 5.1%
              </span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-1">Global AQI Avg</h3>
            <div className="text-3xl font-display font-light tabular-nums text-slate-900 dark:text-bone flex items-baseline gap-1.5">
              <CountUp value={68.2} decimals={1} duration={1.5} /> <span className="text-sm font-sans text-slate-500 dark:text-mist font-normal">Idx</span>
            </div>
          </GlassCard>

          <GlassCard tone="raised" as={motion.div} variants={itemVariants} className="p-5 lg:col-span-2 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-full gap-5 relative z-10">
              <div>
                <h3 className="text-base font-medium mb-1 flex items-center gap-2 text-slate-900 dark:text-bone">
                  <Activity size={18} className="text-emerald-600 dark:text-signal" /> API Sinxronizatsiyasi
                </h3>
                <p className="text-xs text-slate-600 dark:text-mist max-w-sm leading-relaxed">
                  {t('dashboard', 'api_sync_desc') || "Har 10 soniyada Open-Meteo orqali 50,000+ sensorlardan ma'lumot yangilanmoqda."}
                </p>
              </div>
              
              {/* Telemetry Status Block */}
              <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-9 h-9 rounded-full border border-emerald-500/30 dark:border-signal/30 bg-emerald-500/10 dark:bg-signal/5">
                    <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-signal">10s</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist whitespace-nowrap">
                    {t('dashboard', 'last_update') || "So'nggi yangilanish:"}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-signal bg-emerald-500/10 dark:bg-signal/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 dark:border-signal/20 whitespace-nowrap">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* City List (Cache) */}
          <GlassCard tone="base" className="p-2 flex flex-col gap-1 overflow-hidden h-[600px]">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h3 className="font-medium text-base mb-1 flex items-center gap-2 text-slate-900 dark:text-bone"><MapPin size={16} className="text-emerald-600 dark:text-signal"/> Tarix (Kesh)</h3>
              {!isOnline && <span className="text-[10px] font-mono bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-0.5 rounded">Offline</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
              <AnimatePresence>
                {cities.map((city) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={city.city}
                    onClick={() => {
                      setActiveCityName(city.city);
                      generateRealAIRecommendation(city.city, city.aqi, city.co2);
                    }}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      activeCity.city === city.city 
                        ? 'bg-emerald-500/10 dark:bg-white/[0.08] border-emerald-500/40 dark:border-signal/50 text-slate-900 dark:text-bone shadow-xs' 
                        : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.05] text-slate-600 dark:text-mist hover:text-slate-900 dark:hover:text-bone hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm text-slate-900 dark:text-bone">{city.city}</h4>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md" style={{ color: aqiColor(city.aqi), background: 'rgba(0,0,0,0.04)' }}>
                        {city.rating}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-mist font-mono uppercase">AQI</div>
                        <div className="flex items-center gap-2">
                          <div className="text-base font-display font-light tabular-nums" style={{ color: aqiColor(city.aqi) }}>{city.aqi}</div>
                          {city.trend === 'up' ? <ArrowUpRight size={13} className="text-red-500"/> : <ArrowDownRight size={13} className="text-emerald-600 dark:text-signal"/>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-mist font-mono uppercase">CO2</div>
                        <div className="text-base font-display font-light tabular-nums text-slate-900 dark:text-bone">{city.co2}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Active City Cards Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {/* Feature card: The one most important card on this page */}
              <GlassCard 
                tone="feature"
                key={activeCity.city + activeCity.aqi}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-light text-slate-900 dark:text-bone mb-1">
                      {activeCity.city} <span className="text-sm font-sans font-normal text-slate-500 dark:text-mist">/ {t('dashboard', 'live_data')}</span>
                    </h2>
                    <p className="text-xs font-mono text-slate-600 dark:text-mist flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-signal"></span>
                      {isOnline ? t('dashboard', 'live_stream') : t('dashboard', 'offline_mode')}
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist">
                      {t('dashboard', 'rating')}
                    </div>
                    <div className="text-base font-semibold flex items-center gap-2" style={{ color: aqiColor(activeCity.aqi) }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: aqiColor(activeCity.aqi) }}></span>
                      {getRatingText(activeCity.rating, language)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                  <div className="bg-black/[0.03] dark:bg-white/[0.03] p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                    <Wind size={16} className="text-slate-500 dark:text-mist mb-2" />
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-0.5">{t('dashboard', 'wind')}</div>
                    <div className="text-xl font-display font-light tabular-nums text-slate-900 dark:text-bone flex items-baseline gap-1">
                      <CountUp value={activeCity.wind} duration={1} /> <span className="text-xs font-sans text-slate-500 dark:text-mist">km/h</span>
                    </div>
                  </div>
                  <div className="bg-black/[0.03] dark:bg-white/[0.03] p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                    <Droplets size={16} className="text-slate-500 dark:text-mist mb-2" />
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-0.5">{t('dashboard', 'humidity')}</div>
                    <div className="text-xl font-display font-light tabular-nums text-slate-900 dark:text-bone flex items-baseline gap-1">
                      <CountUp value={activeCity.humidity} duration={1} /> <span className="text-xs font-sans text-slate-500 dark:text-mist">%</span>
                    </div>
                  </div>
                  <div className="bg-black/[0.03] dark:bg-white/[0.03] p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                    <Activity size={16} className="text-emerald-600 dark:text-signal mb-2" />
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-0.5">{t('dashboard', 'aqi')}</div>
                    <div className="text-xl font-display font-light tabular-nums text-emerald-600 dark:text-signal flex items-baseline gap-1">
                      <CountUp value={activeCity.aqi} duration={1.2} />
                    </div>
                  </div>
                  <div className="bg-black/[0.03] dark:bg-white/[0.03] p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                    <CloudRain size={16} className="text-slate-500 dark:text-mist mb-2" />
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-mist mb-0.5">{t('dashboard', 'co2')}</div>
                    <div className="text-xl font-display font-light tabular-nums text-slate-900 dark:text-bone flex items-baseline gap-1">
                      <CountUp value={activeCity.co2} duration={1} /> <span className="text-xs font-sans text-slate-500 dark:text-mist">μg</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatePresence>

            {/* Recharts Graphics - Restyled with chartTheme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard tone="raised" className="p-5 flex flex-col h-[340px]">
                <h3 className="font-sans font-medium text-sm mb-4 flex justify-between items-center text-slate-900 dark:text-bone">
                  {t('dashboard', 'chart_title')}
                </h3>
                <div className="flex-1 w-full h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <ChartDefs />
                      <CartesianGrid {...chart.gridProps} />
                      <XAxis dataKey="name" {...chart.axisProps} />
                      <YAxis {...chart.axisProps} />
                      <Tooltip {...chart.tooltipProps} />
                      <Area type="monotone" dataKey="CO2" stroke={chart.signal} strokeWidth={2} fill="url(#areaFill)" isAnimationActive={false} />
                      <Line type="dashed" dataKey="Target" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard tone="raised" className="p-5 flex flex-col h-[340px]">
                <h3 className="font-sans font-medium text-sm mb-4 flex justify-between items-center text-slate-900 dark:text-bone">
                  {t('dashboard', 'chart_aqi_title')}
                </h3>
                <div className="flex-1 w-full h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <ChartDefs />
                      <CartesianGrid {...chart.gridProps} />
                      <XAxis dataKey="name" {...chart.axisProps} />
                      <YAxis {...chart.axisProps} />
                      <Tooltip {...chart.tooltipProps} />
                      <Bar dataKey="AQI" {...chart.barProps} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
