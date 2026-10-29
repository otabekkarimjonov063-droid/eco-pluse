import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Car, Zap, Utensils, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from './CountUp';
import GlassCard from './GlassCard';
import VideoBackdrop from './VideoBackdrop';
import { chart, ChartDefs } from '../lib/chartTheme';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white dark:bg-[#0c0d12]/95 border border-black/[0.08] dark:border-white/10 px-3.5 py-2 shadow-xl backdrop-blur-md text-xs font-mono">
        <p className="text-zinc-500 dark:text-zinc-400 mb-0.5">{label}</p>
        <p className="text-emerald-500 font-semibold">{payload[0].value} T CO2</p>
      </div>
    );
  }
  return null;
};

const RangeSlider = ({ value, min, max, step, suffix, onChange, prefix = '' }) => {
  const [localVal, setLocalVal] = useState(value);
  
  React.useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setLocalVal(val);
    onChange(val);
  };

  const percentage = ((localVal - min) / (max - min)) * 100;

  return (
    <div className="relative">
      <div className="relative h-7 flex items-center mb-3">
        {/* Native Input for Functionality */}
        <input 
          type="range" min={min} max={max} step={step}
          value={localVal} 
          onChange={handleChange}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
        />
        {/* Custom Track Background */}
        <div className="w-full h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full relative overflow-hidden pointer-events-none">
          {/* Custom Track Fill */}
          <div 
            className="h-full bg-signal transition-all duration-75 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Custom Thumb */}
        <div 
          className="absolute w-5 h-5 bg-white dark:bg-ink rounded-full shadow-md pointer-events-none border-2 border-signal transition-all duration-75 ease-out z-10 flex items-center justify-center"
          style={{ left: `calc(${percentage}% - 10px)` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-signal" />
        </div>
      </div>
      
      <div className="text-right text-3xl font-display font-light tabular-nums text-slate-900 dark:text-bone tracking-tight">
        {prefix}{localVal} {suffix && <span className="text-base text-slate-500 dark:text-mist font-normal font-sans">{suffix}</span>}
      </div>
    </div>
  );
};

const CarbonCalculator = () => {
  const { t, language } = useLanguage();

  const savedCalc = (() => {
    try {
      return JSON.parse(localStorage.getItem('ecopulse_calc_data')) || null;
    } catch {
      return null;
    }
  })();

  const [step, setStep] = useState(1);
  const [isCalculated, setIsCalculated] = useState(savedCalc ? Boolean(savedCalc.isCalculated) : false);
  
  // States for all inputs
  const [carKm, setCarKm] = useState(savedCalc?.inputs?.carKm ?? 50);
  const [flights, setFlights] = useState(savedCalc?.inputs?.flights ?? 1);
  const [energy, setEnergy] = useState(savedCalc?.inputs?.energy ?? 250);
  const [meat, setMeat] = useState(savedCalc?.inputs?.meat ?? 4);
  const [shopping, setShopping] = useState(savedCalc?.inputs?.shopping ?? 500);

  const [result, setResult] = useState(savedCalc?.result ?? { total: 0, breakdown: [] });

  // Debounced persistence to avoid blocking UI during slider dragging
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const prev = JSON.parse(localStorage.getItem('ecopulse_calc_data')) || {};
        localStorage.setItem('ecopulse_calc_data', JSON.stringify({
          ...prev,
          inputs: { carKm, flights, energy, meat, shopping }
        }));
      } catch (e) {
        console.error(e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [carKm, flights, energy, meat, shopping]);

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
    
    const newResult = {
      total: Number(total.toFixed(2)),
      breakdown: [
        { name: t('calculator', 'step1'), value: parseFloat(transportCO2.toFixed(2)), fullTarget: 2 },
        { name: t('calculator', 'step2'), value: parseFloat(energyCO2.toFixed(2)), fullTarget: 1.5 },
        { name: t('calculator', 'step3'), value: parseFloat(foodCO2.toFixed(2)), fullTarget: 1 },
        { name: t('calculator', 'step4'), value: parseFloat(shoppingCO2.toFixed(2)), fullTarget: 0.5 },
      ]
    };

    setResult(newResult);
    setIsCalculated(true);

    try {
      localStorage.setItem('ecopulse_calc_data', JSON.stringify({
        inputs: { carKm, flights, energy, meat, shopping },
        result: newResult,
        isCalculated: true
      }));
    } catch (e) {
      console.error(e);
    }
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
    try {
      const prev = JSON.parse(localStorage.getItem('ecopulse_calc_data')) || {};
      localStorage.setItem('ecopulse_calc_data', JSON.stringify({
        ...prev,
        isCalculated: false
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative flex flex-col justify-center overflow-hidden">
      {/* Dynamic Looping Video Background */}
      <VideoBackdrop 
        src="/videos/forest.mp4" 
        poster="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=75&w=1080" 
        opacity={0.3} 
      />

      {/* Premium Deep Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-transparent" />
        
        {/* Antigravity Floating Orbs (Optimized GPU CSS) */}
        <div 
          className="absolute top-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none"
        />
        <div 
          className="absolute bottom-[20%] left-[15%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none"
        />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-light mb-3 text-slate-900 dark:text-bone tracking-tight">
            {t('calculator', 'title')}
          </h1>
          <p className="text-base text-slate-600 dark:text-mist font-normal max-w-xl mx-auto">
            {t('calculator', 'subtitle')}
          </p>
        </motion.div>

        <GlassCard 
          tone="feature"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 md:p-10 relative overflow-hidden"
        >
          
          {/* Stepper Header with fixed un-clipped layer stacking */}
          {!isCalculated && (
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="absolute left-6 right-6 top-5 h-0.5 bg-slate-200 dark:bg-white/[0.08] z-0 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-signal rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              
              {steps.map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    animate={step >= s.num ? { scale: 1.05 } : { scale: 1 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                      step >= s.num 
                        ? `bg-signal text-ink border-signal font-semibold shadow-sm` 
                        : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-moss/90 dark:border-white/[0.08] dark:text-mist'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 size={18} /> : s.icon}
                  </motion.div>
                  <span className={`text-[10px] font-mono mt-2 uppercase tracking-wider ${
                    step >= s.num ? 'text-emerald-700 dark:text-signal font-semibold' : 'text-slate-500 dark:text-mist/60'
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
                  <div className="space-y-8">
                    <h2 className="font-display text-2xl font-light flex items-center gap-3 text-slate-900 dark:text-bone">
                      <Car className="text-signal" size={28} /> {t('calculator', 'step1')}
                    </h2>
                    
                    <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.025] p-6 shadow-xs">
                      <label className="block text-sm font-medium mb-4 text-slate-900 dark:text-bone">{t('calculator', 'q_car')}</label>
                      <RangeSlider 
                        min="0" max="1000" step="10" 
                        value={carKm} onChange={setCarKm} 
                        suffix="km" 
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.025] p-6 shadow-xs">
                      <label className="block text-sm font-medium mb-4 text-slate-900 dark:text-bone">{t('calculator', 'q_flight')}</label>
                      <RangeSlider 
                        min="0" max="20" step="1" 
                        value={flights} onChange={setFlights} 
                        suffix={language === 'RU' ? 'раз' : language === 'EN' ? 'times' : 'marta'} 
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Energy */}
                {step === 2 && (
                  <div className="space-y-8">
                    <h2 className="font-display text-2xl font-light flex items-center gap-3 text-slate-900 dark:text-bone">
                      <Zap className="text-signal" size={28} /> {t('calculator', 'step2')}
                    </h2>
                    
                    <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.025] p-6 shadow-xs">
                      <label className="block text-sm font-medium mb-4 text-slate-900 dark:text-bone">{t('calculator', 'q_energy')}</label>
                      <RangeSlider 
                        min="50" max="1000" step="10" 
                        value={energy} onChange={setEnergy} 
                        suffix="kVt" 
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Diet */}
                {step === 3 && (
                  <div className="space-y-8">
                    <h2 className="font-display text-2xl font-light flex items-center gap-3 text-slate-900 dark:text-bone">
                      <Utensils className="text-signal" size={28} /> {t('calculator', 'step3')}
                    </h2>
                    
                    <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.025] p-6 shadow-xs">
                      <label className="block text-sm font-medium mb-4 text-slate-900 dark:text-bone">{t('calculator', 'q_meat')}</label>
                      <RangeSlider 
                        min="0" max="21" step="1" 
                        value={meat} onChange={setMeat} 
                        suffix={language === 'RU' ? 'раз' : language === 'EN' ? 'times' : 'marta'} 
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Shopping */}
                {step === 4 && (
                  <div className="space-y-8">
                    <h2 className="font-display text-2xl font-light flex items-center gap-3 text-slate-900 dark:text-bone">
                      <ShoppingBag className="text-signal" size={28} /> {t('calculator', 'step4')}
                    </h2>
                    
                    <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.025] p-6 shadow-xs">
                      <label className="block text-sm font-medium mb-4 text-slate-900 dark:text-bone">{t('calculator', 'q_shopping')} ($)</label>
                      <RangeSlider 
                        min="50" max="5000" step="50" 
                        value={shopping} onChange={setShopping} 
                        prefix="$" 
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
                  <button 
                    onClick={handlePrev}
                    disabled={step === 1}
                    className="rounded-full border border-slate-300 bg-slate-100 px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-200 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-bone/80 dark:hover:bg-white/[0.08] flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ArrowLeft size={16} /> {t('calculator', 'prev')}
                  </button>
                  <button 
                    onClick={handleNext}
                    className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-bone dark:text-ink dark:hover:bg-white px-7 py-2.5 text-sm font-medium transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {step === 4 ? t('calculator', 'calculate') : t('calculator', 'next')} 
                    {step !== 4 && <ArrowRight size={16} />}
                  </button>
                </div>
              </motion.div>
            ) : (
              
              /* Results View */
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className="text-center mb-10">
                  <Leaf size={40} className={`mx-auto mb-3 ${result.total < 4 ? 'text-signal' : 'text-ember'}`} />
                  <h2 className="font-display text-3xl font-light text-slate-900 dark:text-bone mb-2">{t('calculator', 'result_title')}</h2>
                  <div className="text-6xl sm:text-7xl font-display font-light tabular-nums mb-3 text-slate-900 dark:text-bone inline-block tracking-tight">
                    <CountUp value={result.total} decimals={2} duration={1.5} /> <span className="text-2xl text-slate-600 dark:text-mist font-normal font-sans">{language === 'RU' ? 'Тонн' : language === 'EN' ? 'Tons' : 'Tonna'}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-mist max-w-lg mx-auto font-normal">
                    {result.total < 4 ? t('calculator', 'result_desc_good') : t('calculator', 'result_desc_bad')}
                  </p>
                </div>

                {/* Graph Breakdown */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <GlassCard tone="raised" className="p-5 h-[300px]">
                    <h3 className="font-mono text-xs uppercase tracking-wider mb-4 text-slate-700 dark:text-mist font-semibold">{t('calculator', 'breakdown_title')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.breakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <ChartDefs />
                        <CartesianGrid {...chart.gridProps} />
                        <XAxis dataKey="name" {...chart.axisProps} />
                        <YAxis {...chart.axisProps} />
                        <Tooltip {...chart.tooltipProps} />
                        <Area type="monotone" dataKey="value" stroke={chart.signal} strokeWidth={2} fill="url(#areaFill)" animationDuration={1000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </GlassCard>
                  
                  <GlassCard tone="raised" className="p-5">
                    <h3 className="font-mono text-xs uppercase tracking-wider mb-4 text-slate-700 dark:text-mist font-semibold">{t('calculator', 'recommendations')}</h3>
                    <ul className="space-y-2.5">
                      {result.breakdown.sort((a,b) => b.value - a.value).slice(0, 3).map((item, idx) => (
                        <motion.li 
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + idx * 0.08 }}
                          key={idx} 
                          className="flex gap-3 items-start bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]"
                        >
                          <span className="w-5 h-5 rounded-full bg-signal/15 text-emerald-800 dark:text-signal flex items-center justify-center font-mono font-medium text-[11px] shrink-0 border border-signal/30">{idx+1}</span>
                          <div className="text-xs text-slate-800 dark:text-bone/80 font-normal leading-relaxed">
                            {language === 'RU' ? `Ваши выбросы по сектору "${item.name}" высоки.` : language === 'EN' ? `Your emissions in "${item.name}" are high.` : `Sizning "${item.name}" bo'yicha emissiyangiz yuqori.`} {item.name === 'Transport' ? t('calculator', 'rec_transport') : item.name === 'Ovqatlanish' ? t('calculator', 'rec_food') : t('calculator', 'rec_energy')}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>

                <div className="text-center">
                  <button onClick={reset} className="rounded-full border border-slate-300 bg-slate-100 px-6 py-2.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-mist dark:hover:text-bone transition inline-flex items-center gap-2 cursor-pointer">
                    <RotateCcw size={14} /> {t('calculator', 'recalculate')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </GlassCard>
      </div>
    </div>
  );
};

export default CarbonCalculator;
