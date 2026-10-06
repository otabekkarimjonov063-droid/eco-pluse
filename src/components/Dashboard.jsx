import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Wind, CloudRain, Activity } from 'lucide-react';

const mockData = [
  { city: 'Toshkent', aqi: 110, co2: 410, rating: 'O\'rtacha', color: 'text-yellow-400', progress: 'bg-yellow-400', val: 55 },
  { city: 'London', aqi: 45, co2: 390, rating: 'Yaxshi', color: 'text-eco-primary', progress: 'bg-eco-primary', val: 80 },
  { city: 'Tokio', aqi: 65, co2: 400, rating: 'Yaxshi', color: 'text-eco-primary', progress: 'bg-eco-primary', val: 75 },
  { city: 'Nyu-York', aqi: 85, co2: 420, rating: 'Qoniqarli', color: 'text-orange-400', progress: 'bg-orange-400', val: 65 },
];

const Dashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        aqi: item.aqi + Math.floor(Math.random() * 5) - 2,
        co2: item.co2 + Math.floor(Math.random() * 3) - 1,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-eco-primary to-cyan-500">
            {t('dashboard', 'title')}
          </h2>
          <div className="w-24 h-1 bg-eco-neon mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel p-6 hover:-translate-y-2 transition-transform duration-300 group">
              <h3 className="text-2xl font-bold mb-4">{item.city}</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1 opacity-80">
                    <span className="flex items-center gap-1"><Wind size={14}/> {t('dashboard', 'aqi')}</span>
                    <span className={`font-bold ${item.color}`}>{item.aqi}</span>
                  </div>
                  <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.progress} transition-all duration-1000`} style={{ width: `${Math.min(100, item.aqi / 2)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1 opacity-80">
                    <span className="flex items-center gap-1"><CloudRain size={14}/> {t('dashboard', 'co2')}</span>
                    <span className="font-bold">{item.co2} ppm</span>
                  </div>
                  <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${Math.min(100, (item.co2 - 300) / 2)}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-sm opacity-80 flex items-center gap-1">
                    <Activity size={14} /> {t('dashboard', 'rating')}
                  </span>
                  <span className={`font-semibold px-2 py-1 rounded text-xs bg-black/5 dark:bg-white/10 ${item.color}`}>
                    {item.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
