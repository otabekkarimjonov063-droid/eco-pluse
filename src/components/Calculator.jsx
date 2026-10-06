import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Car, Zap, Utensils, Leaf } from 'lucide-react';

const Calculator = () => {
  const { t } = useLanguage();
  const [transport, setTransport] = useState(10);
  const [energy, setEnergy] = useState(150);
  const [food, setFood] = useState(3);
  const [result, setResult] = useState(null);

  const calculateFootprint = () => {
    // Basic mock calculation
    const transportCO2 = transport * 0.2 * 365;
    const energyCO2 = energy * 0.5 * 12;
    const foodCO2 = food * 50 * 52;
    const total = (transportCO2 + energyCO2 + foodCO2) / 1000; // in tons
    setResult(total.toFixed(2));
  };

  return (
    <section id="calculator" className="py-20 px-6 bg-black/5 dark:bg-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            {t('calculator', 'title')}
          </h2>
          <div className="w-24 h-1 bg-eco-neon mx-auto rounded-full"></div>
        </div>

        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-eco-primary/10 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Car size={18} className="text-eco-primary" /> {t('calculator', 'transport')}
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={transport} 
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full accent-eco-primary"
                />
                <div className="text-right text-sm font-bold text-eco-primary mt-1">{transport} km</div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Zap size={18} className="text-yellow-500" /> {t('calculator', 'energy')}
                </label>
                <input 
                  type="range" 
                  min="0" max="1000" 
                  value={energy} 
                  onChange={(e) => setEnergy(e.target.value)}
                  className="w-full accent-yellow-500"
                />
                <div className="text-right text-sm font-bold text-yellow-500 mt-1">{energy} kVt</div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Utensils size={18} className="text-orange-400" /> {t('calculator', 'food')}
                </label>
                <input 
                  type="range" 
                  min="0" max="21" 
                  value={food} 
                  onChange={(e) => setFood(e.target.value)}
                  className="w-full accent-orange-400"
                />
                <div className="text-right text-sm font-bold text-orange-400 mt-1">{food} marta</div>
              </div>

              <button 
                onClick={calculateFootprint}
                className="w-full primary-button py-4 text-lg"
              >
                {t('calculator', 'calculate')}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
              {result !== null ? (
                <div className="animate-fade-in">
                  <p className="text-lg opacity-80 mb-2">{t('calculator', 'result')}</p>
                  <div className="text-6xl font-extrabold text-eco-primary mb-4">{result} <span className="text-2xl">tonna</span></div>
                  <p className="text-sm opacity-70">
                    {result < 4 ? "Ajoyib natija! Siz tabiatni asrashga katta hissa qo'shmoqdasiz." : "O'rtacha ko'rsatkich. Uglerod izingizni kamaytirish uchun jamoat transportidan ko'proq foydalanishni maslahat beramiz."}
                  </p>
                </div>
              ) : (
                <div className="opacity-50">
                  <Leaf size={64} className="mx-auto mb-4" />
                  <p>Natijani ko'rish uchun "Hisoblash" tugmasini bosing</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
