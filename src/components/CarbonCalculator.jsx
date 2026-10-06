import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Car, Zap, Utensils, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from './CountUp';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-glass p-3 border-white/20 dark:border-white/10 text-sm font-bold shadow-xl">
        <p className="text-slate-800 dark:text-white mb-1">{label}</p>
        <p className="text-emerald-500">{payload[0].value} Tonna CO2</p>
      </div>
    );
  }
  return null;
};

const CarbonCalculator = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isCalculated, setIsCalculated] = useState(false);
  
  // States for all inputs
  const [carKm, setCarKm] = useState(50);
  const [flights, setFlights] = useState(1);
  const [energy, setEnergy] = useState(250);
  const [meat, setMeat] = useState(4);
  const [shopping, setShopping] = useState(500);

  const [result, setResult] = useState({ total: 0, breakdown: [] });

  const steps = [
    { num: 1, title: t('calculator', 'step1'), icon: <Car size={24} />, color: 'text-blue-500', shadow: 'shadow-blue-500/40' },
    { num: 2, title: t('calculator', 'step2'), icon: <Zap size={24} />, color: 'text-yellow-500', shadow: 'shadow-yellow-500/40' },
    { num: 3, title: t('calculator', 'step3'), icon: <Utensils size={24} />, color: 'text-orange-500', shadow: 'shadow-orange-500/40' },
    { num: 4, title: t('calculator', 'step4'), icon: <ShoppingBag size={24} />, color: 'text-purple-500', shadow: 'shadow-purple-500/40' }
  ];

  const calculateTotal = () => {
    // Advanced Mock Calculation (Tons of CO2 per year)
    const transportCO2 = (carKm * 52 * 0.192) / 1000 + (flights * 0.25);
    const energyCO2 = (energy * 12 * 0.4) / 1000;
    const foodCO2 = (meat * 52 * 5) / 1000;
    const shoppingCO2 = (shopping * 12 * 0.001) / 1000;
    
    const total = transportCO2 + energyCO2 + foodCO2 + shoppingCO2;
    
    setResult({
      total: Number(total.toFixed(2)),
      breakdown: [
        { name: t('calculator', 'step1'), value: parseFloat(transportCO2.toFixed(2)), fullTarget: 2 },
        { name: t('calculator', 'step2'), value: parseFloat(energyCO2.toFixed(2)), fullTarget: 1.5 },
        { name: t('calculator', 'step3'), value: parseFloat(foodCO2.toFixed(2)), fullTarget: 1 },
        { name: t('calculator', 'step4'), value: parseFloat(shoppingCO2.toFixed(2)), fullTarget: 0.5 },
      ]
    });
    
    setIsCalculated(true);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else calculateTotal();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const reset = () => {
    setStep(1);
    setIsCalculated(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative flex flex-col justify-center overflow-hidden">
      {/* Premium Deep Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden fixed">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 dark:opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-eco-light/90 dark:bg-[#07101a]/90 backdrop-blur-sm transition-colors duration-700"></div>
        
        {/* Antigravity Floating Orbs */}
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 tracking-tight leading-normal pb-2">
            {t('calculator', 'title')}
          </h1>
          <p className="text-lg opacity-70 font-medium">
            {t('calculator', 'subtitle')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="premium-glass-deep p-8 md:p-12 relative overflow-hidden rounded-[2rem]"
        >
          
          {/* Stepper Header */}
          {!isCalculated && (
            <div className="flex justify-between items-center mb-16 relative z-10">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-black/5 dark:bg-white/5 -z-10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <motion.div 
                    animate={step >= s.num ? { scale: 1.15 } : { scale: 1 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      step >= s.num 
                        ? `bg-emerald-500 text-white shadow-lg shadow-emerald-500/40` 
                        : 'bg-white/50 dark:bg-black/30 border-2 border-transparent text-slate-400 backdrop-blur-sm'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 size={28} /> : s.icon}
                  </motion.div>
                  <span className={`text-[10px] sm:text-xs font-bold mt-3 uppercase tracking-wider absolute -bottom-8 ${
                    step >= s.num ? 'text-emerald-500' : 'opacity-50'
                  }`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {!isCalculated ? (
              <motion.div 
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 min-h-[300px] flex flex-col justify-center"
              >
                
                {/* Step 1: Transport */}
                {step === 1 && (
                  <div className="space-y-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
                      <Car className="text-blue-500" size={32} /> {t('calculator', 'step1')}
                    </h2>
                    
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-white/20 dark:border-white/5">
                      <label className="block font-bold mb-6 text-slate-800 dark:text-slate-200">{t('calculator', 'q_car')}</label>
                      <input 
                        type="range" min="0" max="1000" step="10"
                        value={carKm} onChange={(e) => setCarKm(e.target.value)}
                        className="w-full accent-blue-500 h-3 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="text-right text-3xl font-extrabold text-blue-500 mt-4">{carKm} <span className="text-lg font-medium opacity-60">km</span></div>
                    </div>

                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-white/20 dark:border-white/5">
                      <label className="block font-bold mb-6 text-slate-800 dark:text-slate-200">{t('calculator', 'q_flight')}</label>
                      <input 
                        type="range" min="0" max="20" step="1"
                        value={flights} onChange={(e) => setFlights(e.target.value)}
                        className="w-full accent-blue-500 h-3 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="text-right text-3xl font-extrabold text-blue-500 mt-4">{flights} <span className="text-lg font-medium opacity-60">marta</span></div>
                    </div>
                  </div>
                )}

                {/* Step 2: Energy */}
                {step === 2 && (
                  <div className="space-y-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
                      <Zap className="text-yellow-500" size={32} /> {t('calculator', 'step2')}
                    </h2>
                    
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-white/20 dark:border-white/5">
                      <label className="block font-bold mb-6 text-slate-800 dark:text-slate-200">{t('calculator', 'q_energy')}</label>
                      <input 
                        type="range" min="50" max="1000" step="10"
                        value={energy} onChange={(e) => setEnergy(e.target.value)}
                        className="w-full accent-yellow-500 h-3 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="text-right text-3xl font-extrabold text-yellow-500 mt-4">{energy} <span className="text-lg font-medium opacity-60">kVt</span></div>
                    </div>
                  </div>
                )}

                {/* Step 3: Diet */}
                {step === 3 && (
                  <div className="space-y-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
                      <Utensils className="text-orange-500" size={32} /> {t('calculator', 'step3')}
                    </h2>
                    
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-white/20 dark:border-white/5">
                      <label className="block font-bold mb-6 text-slate-800 dark:text-slate-200">{t('calculator', 'q_meat')}</label>
                      <input 
                        type="range" min="0" max="21" step="1"
                        value={meat} onChange={(e) => setMeat(e.target.value)}
                        className="w-full accent-orange-500 h-3 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="text-right text-3xl font-extrabold text-orange-500 mt-4">{meat} <span className="text-lg font-medium opacity-60">marta</span></div>
                    </div>
                  </div>
                )}

                {/* Step 4: Shopping */}
                {step === 4 && (
                  <div className="space-y-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
                      <ShoppingBag className="text-purple-500" size={32} /> {t('calculator', 'step4')}
                    </h2>
                    
                    <div className="bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-white/20 dark:border-white/5">
                      <label className="block font-bold mb-6 text-slate-800 dark:text-slate-200">{t('calculator', 'q_shopping')} ($)</label>
                      <input 
                        type="range" min="50" max="5000" step="50"
                        value={shopping} onChange={(e) => setShopping(e.target.value)}
                        className="w-full accent-purple-500 h-3 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="text-right text-3xl font-extrabold text-purple-500 mt-4">${shopping}</div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t border-black/10 dark:border-white/10">
                  <button 
                    onClick={handlePrev}
                    disabled={step === 1}
                    className="premium-glass px-6 py-3 rounded-2xl flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/40 dark:hover:bg-white/10 font-bold transition-colors"
                  >
                    <ArrowLeft size={18} /> {t('calculator', 'prev')}
                  </button>
                  <button 
                    onClick={handleNext}
                    className="primary-button flex items-center gap-2"
                  >
                    {step === 4 ? t('calculator', 'calculate') : t('calculator', 'next')} 
                    {step !== 4 && <ArrowRight size={18} />}
                  </button>
                </div>
              </motion.div>
            ) : (
              
              /* Results View */
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative z-10"
              >
                <div className="text-center mb-12">
                  <motion.div 
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Leaf size={56} className={`mx-auto mb-6 ${result.total < 4 ? 'text-emerald-500' : 'text-amber-500'} drop-shadow-lg`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold opacity-80 mb-2">{t('calculator', 'result_title')}</h2>
                  <div className="text-7xl md:text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 inline-block drop-shadow-sm">
                    <CountUp value={result.total} decimals={2} duration={2} /> <span className="text-3xl opacity-50">Tonna</span>
                  </div>
                  <p className="text-xl font-medium opacity-90 max-w-lg mx-auto">
                    {result.total < 4 ? t('calculator', 'result_desc_good') : t('calculator', 'result_desc_bad')}
                  </p>
                </div>

                {/* Graph Breakdown */}
                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                  <div className="premium-glass p-6 h-[300px]">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-70">Sektorlar bo'yicha taqsimot</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValueCalc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'currentColor', opacity: 0.6}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'currentColor', opacity: 0.6}} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValueCalc)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="premium-glass p-6">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-70">{t('calculator', 'recommendations')}</h3>
                    <ul className="space-y-4">
                      {result.breakdown.sort((a,b) => b.value - a.value).slice(0, 3).map((item, idx) => (
                        <motion.li 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          key={idx} 
                          className="flex gap-4 items-start bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform"
                        >
                          <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/20">{idx+1}</span>
                          <div className="text-sm font-medium leading-relaxed">
                            Sizning <b>{item.name}</b> bo'yicha emissiyangiz yuqori. {item.name === 'Transport' ? 'Jamoat transporti yoki velosipeddan foydalanishni ko\'paytiring.' : item.name === 'Ovqatlanish' ? 'Go\'sht iste\'molini haftasiga kamida bir kun qisqartiring.' : 'Elektr energiyasini tejovchi uskunalarga o\'ting.'}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={reset} className="premium-glass px-8 py-4 rounded-2xl inline-flex items-center gap-3 font-bold hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-lg">
                    <RotateCcw size={20} /> Qaytadan hisoblash
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default CarbonCalculator;
