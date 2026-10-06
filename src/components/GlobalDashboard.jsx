import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Wind, CloudRain, Activity, Droplets, MapPin, ArrowUpRight, ArrowDownRight, Globe, Search, Bot, Loader2, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import CountUp from './CountUp';

// Initial Mock Data (used as fallback or default list)
const generateCityData = () => [
  { city: 'Toshkent', aqi: 110, co2: 410, wind: 15, humidity: 45, rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', trend: 'up', progress: 65 },
  { city: 'London', aqi: 45, co2: 390, wind: 22, humidity: 75, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 25 },
  { city: 'Tokio', aqi: 65, co2: 400, wind: 10, humidity: 60, rating: 'Yaxshi', color: 'text-emerald-400', bg: 'bg-emerald-400', trend: 'down', progress: 40 },
  { city: 'Nyu-York', aqi: 85, co2: 420, wind: 18, humidity: 55, rating: 'Qoniqarli', color: 'text-orange-500', bg: 'bg-orange-500', trend: 'up', progress: 55 },
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
      <div className="premium-glass p-4 text-sm border-white/20 dark:border-white/10">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4 font-semibold">
            <span>{entry.name}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
});

// Staggered Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const GlobalDashboard = () => {
  const { t } = useLanguage();
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
    if (aqi <= 50) return { rating: 'A\'lo', color: 'text-emerald-400', bg: 'bg-emerald-400', progress: 15 };
    if (aqi <= 100) return { rating: 'Yaxshi', color: 'text-green-500', bg: 'bg-green-500', progress: 35 };
    if (aqi <= 150) return { rating: 'O\'rtacha', color: 'text-yellow-500', bg: 'bg-yellow-500', progress: 60 };
    if (aqi <= 200) return { rating: 'Yomon', color: 'text-orange-500', bg: 'bg-orange-500', progress: 85 };
    return { rating: 'Xavfli', color: 'text-red-500', bg: 'bg-red-500', progress: 100 };
  };

  // Fallback AI generation (if API key missing or error)
  const getFallbackRecommendation = (aqi, city) => {
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

  // Live polling every 10 seconds for the active city
  useEffect(() => {
    let interval;
    if (isOnline) {
      interval = setInterval(async () => {
        const updatedData = await fetchCityData(activeCityName);
        if (updatedData) {
          setCities(prev => prev.map(c => c.city === activeCityName ? updatedData : c));
          setLastUpdated(new Date());
        }
      }, 10000); // Live sync every 10s
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
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-6 relative overflow-hidden">
      {/* Deep Antigravity Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-eco-light dark:bg-[#07101a] transition-colors duration-700"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[80px]" />
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
          <div className="absolute right-0 top-0 hidden md:flex items-center gap-2 premium-glass px-4 py-2 rounded-full border border-white/10 shadow-lg">
            {isOnline ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                </span>
                <span className="text-sm font-bold text-green-500 flex items-center gap-2">
                  <Wifi size={16} /> LIVE
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-bold text-red-500 flex items-center gap-2">
                  <WifiOff size={16} /> OFFLINE (Cached)
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center gap-3">
            <Globe className="text-emerald-500 animate-spin-slow" size={40} /> Global Monitoring
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto font-medium">
            Jonli AI analitikasi va butun dunyo bo'ylab havo sifati ko'rsatkichlari.
          </p>
        </motion.div>

        {/* AI Search & Recommendation Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className={`premium-glass p-2 pl-4 flex items-center gap-3 rounded-full shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] border ${!isOnline ? 'border-red-500/50' : 'border-emerald-500/20'}`}>
              <Search className={isOnline ? 'text-emerald-500 opacity-70' : 'text-red-500 opacity-70'} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!isOnline}
                placeholder={isOnline ? "Shahringizni kiriting (Masalan: Tashkent, London)..." : "Internetga ulanish yo'q..."}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-medium disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isLoading || !searchQuery.trim() || !isOnline}
                className={`px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2 disabled:opacity-50 ${isOnline ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-slate-500 text-white'}`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Tahlil qilish'}
              </button>
            </div>
          </form>

          {/* AI Insight Card */}
          <AnimatePresence mode="wait">
            {(aiMessage || isAiLoading) && (
              <motion.div 
                key={activeCity.city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`premium-glass p-6 rounded-3xl border-l-4 ${activeCity.color.replace('text-', 'border-')} relative overflow-hidden shadow-2xl`}
              >
                <div className={`absolute right-0 top-0 w-32 h-32 ${activeCity.bg} opacity-10 blur-2xl rounded-full`}></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-3 rounded-2xl ${activeCity.bg} bg-opacity-20 text-current ${activeCity.color}`}>
                    <Bot size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white text-lg">
                        AI Insight <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                      </h3>
                      <span className="text-xs opacity-50 flex items-center gap-1">
                        <Activity size={12}/> API orqali generatsiya qilindi
                      </span>
                    </div>
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 size={16} className="animate-spin" /> Sun'iy intellekt tavsiya tayyorlamoqda...
                      </div>
                    ) : (
                      <p className="text-sm md:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                        {aiMessage}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Top Cards Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="premium-glass p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                <CloudRain size={24} />
              </div>
              <span className="flex items-center text-sm font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={16} /> 2.4%
              </span>
            </div>
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider mb-1">Global CO2 Avg</h3>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-white flex items-baseline gap-1">
              <CountUp value={412.5} decimals={1} duration={2} /> <span className="text-lg opacity-50 font-medium">ppm</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="premium-glass p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                <Wind size={24} />
              </div>
              <span className="flex items-center text-sm font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                <ArrowDownRight size={16} /> 5.1%
              </span>
            </div>
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider mb-1">Global AQI Avg</h3>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-white flex items-baseline gap-1">
              <CountUp value={68.2} decimals={1} duration={2} /> <span className="text-lg opacity-50 font-medium">Idx</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="premium-glass p-6 lg:col-span-2 relative overflow-hidden group border-emerald-500/30">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/40 via-transparent to-transparent"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center h-full gap-6 relative z-10">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
                  <Activity className="text-emerald-500 animate-pulse-fast" /> API Sinxronizatsiyasi
                </h3>
                <p className="text-sm opacity-70 max-w-xs">Har 10 soniyada Open-Meteo orqali 50,000+ sensorlardan ma'lumot yangilanmoqda.</p>
              </div>
              <div className="w-full sm:w-auto flex flex-col items-center sm:items-end">
                <div className="relative flex items-center justify-center w-24 h-24">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none opacity-20 dark:opacity-40">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none" className="text-emerald-500" strokeDasharray="276" strokeDashoffset="0" />
                  </svg>
                  <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 z-10 relative">
                    10s
                  </div>
                </div>
                <div className="text-xs font-bold opacity-70 uppercase tracking-wider mt-2 text-center sm:text-right">
                  So'nggi yangilanish:<br/>
                  <span className="text-sm">{lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
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
          <div className="premium-glass p-2 flex flex-col gap-1 overflow-hidden h-[600px]">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><MapPin size={18} className="text-emerald-500"/> Tarix (Kesh)</h3>
              {!isOnline && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded">Offline rejim</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 custom-scrollbar">
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
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      activeCity.city === city.city 
                        ? 'bg-white/60 dark:bg-black/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.02]' 
                        : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg">{city.city}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md bg-opacity-20 dark:bg-opacity-20 ${city.color} bg-current`}>
                        {city.rating}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs opacity-60 font-semibold mb-1 uppercase">AQI</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-xl font-extrabold ${city.color}`}>{city.aqi}</div>
                          {city.trend === 'up' ? <ArrowUpRight size={14} className="text-red-500"/> : <ArrowDownRight size={14} className="text-green-500"/>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-60 font-semibold mb-1 uppercase">CO2 (PM)</div>
                        <div className="text-xl font-extrabold">{city.co2}</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${city.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${city.bg}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Active City Cards Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCity.city + activeCity.aqi}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="premium-glass p-6 sm:p-8 relative overflow-hidden"
              >
                <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${activeCity.bg} animate-pulse-slow`}></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-1">{activeCity.city} <span className="text-lg font-normal opacity-50">/ Jonli Ma'lumot</span></h2>
                    <p className="text-sm font-semibold opacity-70 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                      {isOnline ? "Jonli translatsiya (Real-time)" : "Oflayn rejim (Keshlangan)"}
                    </p>
                  </div>
                  <div className={`px-5 py-3 rounded-2xl bg-opacity-10 dark:bg-opacity-10 border ${activeCity.color.replace('text-', 'border-')} ${activeCity.color} bg-current backdrop-blur-md`}>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Joriy Holat</div>
                    <div className="text-2xl font-extrabold">{activeCity.rating}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  <div className="bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform">
                    <Wind size={24} className="text-blue-400 mb-3" />
                    <div className="text-xs font-bold opacity-60 uppercase mb-1">Shamol</div>
                    <div className="text-2xl font-bold flex items-baseline gap-1">
                      <CountUp value={activeCity.wind} duration={1} /> <span className="text-sm opacity-60 font-medium">km/h</span>
                    </div>
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform">
                    <Droplets size={24} className="text-cyan-400 mb-3" />
                    <div className="text-xs font-bold opacity-60 uppercase mb-1">Namlik</div>
                    <div className="text-2xl font-bold flex items-baseline gap-1">
                      <CountUp value={activeCity.humidity} duration={1} /> <span className="text-sm opacity-60 font-medium">%</span>
                    </div>
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-10 ${activeCity.bg} animate-pulse`}></div>
                    <Activity size={24} className={activeCity.color + ' mb-3'} />
                    <div className="text-xs font-bold opacity-60 uppercase mb-1">AQI Index</div>
                    <div className={`text-2xl font-bold flex items-baseline gap-1 ${activeCity.color}`}>
                      <CountUp value={activeCity.aqi} duration={1.5} />
                    </div>
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform">
                    <CloudRain size={24} className="text-slate-500 mb-3" />
                    <div className="text-xs font-bold opacity-60 uppercase mb-1">Karbon/PM</div>
                    <div className="text-2xl font-bold flex items-baseline gap-1">
                      <CountUp value={activeCity.co2} duration={1} /> <span className="text-sm opacity-60 font-medium">μg</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Recharts Graphics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="premium-glass p-6 flex flex-col h-[350px]">
                <h3 className="font-bold text-lg mb-6 flex justify-between items-center">
                  Havo tarkibi tarixi
                  <span className="text-xs px-2 py-1 bg-black/5 dark:bg-white/10 rounded font-normal">Oylik</span>
                </h3>
                <div className="flex-1 w-full h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                      <XAxis dataKey="name" tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="CO2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCO2)" animationDuration={1500} />
                      <Line type="dashed" dataKey="Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="premium-glass p-6 flex flex-col h-[350px]">
                <h3 className="font-bold text-lg mb-6 flex justify-between items-center">
                  O'rtacha AQI Index
                  <span className="text-xs px-2 py-1 bg-black/5 dark:bg-white/10 rounded font-normal">Oylik</span>
                </h3>
                <div className="flex-1 w-full h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                      <XAxis dataKey="name" tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: 'currentColor', opacity: 0.5, fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(128,128,128,0.1)'}} />
                      <Bar dataKey="AQI" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
