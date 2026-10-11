import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Plus, Minus, CheckCircle, Leaf,
  ChevronRight, Activity, Globe, ArrowRight, ShieldCheck, Download, Wind, Droplets
} from 'lucide-react';

const PlantTree = () => {
  const { language, t, tText } = useLanguage();
  const [selectedTree, setSelectedTree] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [step, setStep] = useState(1); // 1: Tree, 2: Region, 3: Impact/Pay, 4: Success
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const trees = [
    { 
      id: 'oak', 
      name: { UZ: 'Qudratli Eman', RU: 'Могучий Дуб', EN: 'Mighty Oak Tree' }, 
      price: 15, co2: 22, oxygen: 118, 
      color: 'from-emerald-400 to-green-600', 
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: 'Asrlar osha yashaydigan, tabiatning chinakam ustuni.', 
        RU: 'Величественное дерево, живущее веками и очищающее воздух.', 
        EN: 'Living for centuries, a true cornerstone of biodiversity.' 
      } 
    },
    { 
      id: 'pine', 
      name: { UZ: "Zomin Qarag'ayi", RU: 'Горная Сосна', EN: 'Mountain Pine' }, 
      price: 10, co2: 15, oxygen: 90, 
      color: 'from-cyan-400 to-teal-600', 
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: "Tog' havosi va muzdek shabadani o'zida mujassam etgan.", 
        RU: 'Наполняет воздух целебным ароматом хвои и фитонцидами.', 
        EN: 'Infuses pristine mountain breezes with natural resilience.' 
      } 
    },
    { 
      id: 'maple', 
      name: { UZ: 'Kuzgi Zarang', RU: 'Клен Осенний', EN: 'Autumn Maple' }, 
      price: 18, co2: 20, oxygen: 100, 
      color: 'from-orange-400 to-red-600', 
      image: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: "Atrofga go'zallik va o'zgacha rang-baranglik bag'ishlaydi.", 
        RU: 'Дарит ландшафту яркие краски и великолепную тень.', 
        EN: 'Brings aesthetic beauty and rich canopy shade.' 
      } 
    },
    { 
      id: 'sakura', 
      name: { UZ: 'Gilos / Olcha daraxti', RU: 'Цветущая Вишня', EN: 'Wild Cherry / Blossom' }, 
      price: 25, co2: 12, oxygen: 80, 
      color: 'from-pink-400 to-rose-600', 
      image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: 'Bahor faslining bebaho elchisi, estetik go\'zallik.', 
        RU: 'Символ весны, возрождения и гармонии природы.', 
        EN: 'A symbol of spring, renewal, and ecological elegance.' 
      } 
    },
  ];

  const regions = [
    { 
      id: 'aral', 
      name: { UZ: 'Orol Dengizi Tubi', RU: 'Дно Аральского моря', EN: 'Aral Sea Basin' }, 
      risk: { UZ: 'Kritik hudud', RU: 'Критическая зона', EN: 'Critical Zone' }, 
      temp: '+45°C', 
      image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: "Qurigan dengiz tubini yashil o'rmonga aylantirish loyihasi.", 
        RU: 'Масштабный проект создания зеленого щита на высохшем дне.', 
        EN: 'Transforming arid desert into a protective green forest.' 
      } 
    },
    { 
      id: 'zaamin', 
      name: { UZ: "Zomin Tog'lari", RU: 'Горы Заамина', EN: 'Zaamin Mountain Reserve' }, 
      risk: { UZ: 'Barqaror', RU: 'Стабильно', EN: 'Stable' }, 
      temp: '+22°C', 
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: "Tog' yonbag'irlarini eroziyadan va suvlardan asrash loyihasi.", 
        RU: 'Защита горных склонов от почвенной эрозии и селей.', 
        EN: 'Protecting alpine slopes from soil erosion.' 
      } 
    },
    { 
      id: 'tashkent', 
      name: { UZ: 'Toshkent "Yashil Halqa"', RU: 'Ташкент «Зеленое Кольцо»', EN: 'Tashkent Green Belt' }, 
      risk: { UZ: "O'rta xavf", RU: 'Средний риск', EN: 'Moderate' }, 
      temp: '+35°C', 
      image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&q=80&w=1600', 
      desc: { 
        UZ: 'Poytaxt havosini tozalash uchun shahar atrofidagi yashil halqa.', 
        RU: 'Очистка воздуха столицы через создание защитного лесопарка.', 
        EN: 'Purifying urban air quality through a continuous green perimeter.' 
      } 
    }
  ];

  const activeTree = trees[selectedTree];
  const activeRegion = regions[selectedRegion];
  const totalAmount = activeTree.price * quantity;

  const handlePay = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOrderId(`ECO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
      setStep(4);
    }, 1500);
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } }
  };

  const rightVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] lg:min-h-screen bg-eco-light dark:bg-eco-dark text-slate-900 dark:text-white flex flex-col md:flex-row overflow-hidden font-['Inter'] relative lg:rounded-l-[3rem] lg:border-l border-white/5 shadow-2xl transition-colors duration-500">

      {/* LEFT PANEL - CONTROLS */}
      <div className="w-full md:w-1/2 lg:w-5/12 z-10 flex flex-col justify-start pt-32 pb-12 px-6 lg:px-14 min-h-screen overflow-y-auto relative backdrop-blur-[2px] bg-eco-light/80 dark:bg-eco-dark/80 md:bg-transparent md:bg-gradient-to-r md:from-eco-light md:via-eco-light/90 dark:md:from-eco-dark dark:md:via-eco-dark/90 md:to-transparent border-r border-black/5 dark:border-white/5">

        {/* Step Indicator */}
        <div className="absolute top-10 left-6 lg:left-14 flex items-center gap-3">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-mono transition-all duration-500 ${
                step === s 
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110' 
                  : step > s 
                    ? 'border-2 border-emerald-500 text-emerald-500 bg-emerald-500/10' 
                    : 'border border-black/10 dark:border-white/10 text-slate-400 dark:text-white/30'
              }`}>
                {step > s ? <CheckCircle size={16} /> : `0${s}`}
              </div>
              {s !== 4 && <div className={`w-6 h-[2px] transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-black/10 dark:bg-white/10'}`}></div>}
            </div>
          ))}
        </div>

        <div className="pt-20 pb-8 flex flex-col justify-center">
          
          {/* Mobile Preview Showcase with Premium Glowing Border */}
          <div className="md:hidden mb-8 rounded-3xl p-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 shadow-xl ring-2 ring-emerald-500/20">
            <div className="relative h-48 rounded-[1.35rem] overflow-hidden">
              <img 
                src={step === 2 ? activeRegion.image : activeTree.image} 
                alt="" 
                className="w-full h-full object-cover transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                    {step === 2 ? t('plant', 'step2') : t('plant', 'step1')}
                  </div>
                  <div className="text-lg font-black">{step === 2 ? tText(activeRegion.name) : tText(activeTree.name)}</div>
                </div>
                <span className="font-mono font-bold text-sm bg-black/60 px-2.5 py-1 rounded-lg border border-white/20">
                  {step === 2 ? activeRegion.temp : `$${activeTree.price}`}
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1: SELECT TREE */}
            {step === 1 && (
              <motion.div key="step1" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">
                    {t('plant', 'headline').split('.')[0]}. <br />
                    <span className="text-emerald-500 dark:text-emerald-400">{t('plant', 'headline').split('.')[1] || ''}</span>
                  </h1>
                  <p className="text-slate-600 dark:text-white/60 text-base max-w-md font-medium leading-relaxed">
                    {t('plant', 'subheadline')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {trees.map((tree, idx) => {
                    const isSelected = selectedTree === idx;
                    const displayTreeName = tText(tree.name);
                    return (
                      <button
                        key={tree.id}
                        onClick={() => setSelectedTree(idx)}
                        className={`w-full text-center p-4 rounded-3xl transition-all duration-500 border relative overflow-hidden group flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-500/10 dark:bg-white/10 border-emerald-500 shadow-xl shadow-emerald-500/10'
                            : 'bg-slate-100/80 dark:bg-black/20 border-slate-300/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/10'
                        }`}
                      >
                        {isSelected && (
                          <motion.div layoutId="activeTreeBorder" className="absolute left-0 top-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                        )}
                        <div className="relative z-10 w-full flex flex-col items-center">
                          {/* Image with stunning luxury border and glow */}
                          <div className={`p-1.5 rounded-2xl transition-all duration-300 mb-3 border-2 ${
                            isSelected 
                              ? 'border-emerald-500 bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105 ring-2 ring-emerald-400/40' 
                              : 'border-slate-300 dark:border-white/10 bg-white/70 dark:bg-white/5 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-md'
                          }`}>
                            <img 
                              src={tree.image} 
                              alt={displayTreeName} 
                              className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl object-cover shadow-inner" 
                            />
                          </div>

                          <h3 className={`text-base lg:text-lg font-bold transition-colors ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white/80'}`}>
                            {displayTreeName}
                          </h3>
                          <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-mono font-semibold">
                            ${tree.price} / {t('plant', 'per_tree')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full py-4 primary-button text-lg font-bold rounded-2xl flex justify-center items-center gap-3 shadow-lg shadow-emerald-500/30 active:scale-95"
                  >
                    {t('plant', 'continue_btn')} <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SELECT REGION */}
            {step === 2 && (
              <motion.div key="step2" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 mb-4 font-bold transition-colors text-sm"
                  >
                    <ChevronRight className="rotate-180" size={16} /> {t('plant', 'back_btn')}
                  </button>
                  <h2 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">
                    {t('plant', 'select_region')}
                  </h2>
                  <p className="text-slate-600 dark:text-white/60 text-base max-w-md font-medium">
                    {tText(activeTree.name)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  {regions.map((region, idx) => {
                    const isSelected = selectedRegion === idx;
                    const displayRegionName = tText(region.name);
                    const displayRisk = tText(region.risk);
                    const displayDesc = tText(region.desc);

                    return (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(idx)}
                        className={`w-full text-left p-4 rounded-3xl transition-all duration-500 border relative overflow-hidden group flex items-center gap-4 ${
                          isSelected
                            ? 'bg-cyan-500/10 dark:bg-white/10 border-cyan-500 shadow-xl shadow-cyan-500/10'
                            : 'bg-slate-100/80 dark:bg-black/20 border-slate-300/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/10'
                        }`}
                      >
                        {isSelected && (
                          <motion.div layoutId="activeRegionBorder" className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-500" />
                        )}
                        
                        {/* Region image with sleek luxury border ring */}
                        <div className={`p-1.5 rounded-2xl transition-all shrink-0 border-2 ${
                          isSelected 
                            ? 'border-cyan-500 bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105 ring-2 ring-cyan-400/40' 
                            : 'border-slate-300 dark:border-white/10 bg-white/70 dark:bg-white/5 group-hover:border-cyan-400/60 group-hover:shadow-md'
                        }`}>
                          <img 
                            src={region.image} 
                            alt={displayRegionName} 
                            className="w-16 h-16 rounded-xl object-cover" 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-bold transition-colors ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>
                            {displayRegionName}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-white/60 truncate mt-0.5">
                            {displayDesc}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-md">
                              {displayRisk}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {region.temp}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setStep(3)} 
                    className="w-full py-4 primary-button text-lg font-bold rounded-2xl flex justify-center items-center gap-3 shadow-lg shadow-cyan-500/30 active:scale-95"
                  >
                    {t('plant', 'continue_btn')} <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: QUANTITY & PAYMENT */}
            {step === 3 && (
              <motion.div key="step3" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
                <div>
                  <button 
                    onClick={() => setStep(2)} 
                    className="text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 mb-4 font-bold transition-colors text-sm"
                  >
                    <ChevronRight className="rotate-180" size={16} /> {t('plant', 'back_btn')}
                  </button>
                  <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
                    {t('plant', 'step3')}
                  </h2>
                  <p className="text-sm opacity-70">
                    {tText(activeTree.name)} • {tText(activeRegion.name)}
                  </p>
                </div>

                {/* Quantity selector */}
                <div className="p-4 bg-white/70 dark:bg-black/30 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{t('plant', 'quantity')}</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-black w-8 text-center text-slate-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Total box */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">{t('plant', 'total_amount')}</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${totalAmount}</span>
                </div>

                {/* Card input */}
                <form onSubmit={handlePay} className="space-y-3 pt-2">
                  <div>
                    <input 
                      type="text" 
                      required 
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      placeholder="NAME ON CARD" 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3.5 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all text-sm uppercase" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      required 
                      value={cardData.number}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        val = val.replace(/(.{4})/g, '$1 ').trim();
                        setCardData({ ...cardData, number: val.slice(0, 19) });
                      }}
                      placeholder="8600 0000 0000 0000" 
                      maxLength="19" 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3.5 rounded-xl font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      required 
                      value={cardData.expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setCardData({ ...cardData, expiry: val.slice(0, 5) });
                      }}
                      placeholder="MM/YY" 
                      maxLength="5" 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3.5 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm" 
                    />
                    <input 
                      type="password" 
                      required 
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.slice(0, 4) })}
                      placeholder="CVV" 
                      maxLength="4" 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3.5 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 primary-button text-lg font-bold rounded-2xl flex justify-center items-center gap-3 shadow-lg shadow-emerald-500/30 active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {isLoading ? '...' : t('plant', 'pay_btn')}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="text-center space-y-6 my-auto py-8">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
                  <CheckCircle size={44} />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
                    {t('plant', 'order_placed')}
                  </h2>
                  <p className="text-sm opacity-70 max-w-sm mx-auto">
                    {t('plant', 'order_desc')}
                  </p>
                  <div className="mt-4 inline-block px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm rounded-xl border border-emerald-500/30">
                    ID: {orderId}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3 max-w-sm mx-auto">
                  <button 
                    onClick={() => window.print()}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={18} /> {t('plant', 'download_cert')}
                  </button>
                  <button 
                    onClick={() => { setStep(1); setQuantity(1); }}
                    className="w-full py-3.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl font-bold transition-all"
                  >
                    {t('plant', 'close')}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL - IMMERSIVE VISUALS WITH LUXURY GLOWING BORDER */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 sticky top-0 h-screen p-6 lg:p-10 flex-col justify-center items-center overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 2 ? (
            <motion.div 
              key={`region-${activeRegion.id}`} 
              variants={rightVariants} 
              initial="hidden" 
              animate="show" 
              exit="exit" 
              className="w-full h-full max-h-[88vh] rounded-[2.5rem] p-[3px] bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-500 shadow-[0_25px_60px_-15px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/30 flex flex-col"
            >
              <div className="relative w-full h-full rounded-[2.35rem] overflow-hidden bg-slate-950 flex flex-col justify-between">
                <img 
                  src={activeRegion.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700 opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent"></div>

                {/* Top Badge */}
                <div className="relative z-20 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-slate-950/70 border border-cyan-400/40 shadow-lg text-xs font-bold text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>{t('plant', 'step2')}</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-slate-950/70 border border-white/20 text-xs font-mono font-bold text-white">
                    {activeRegion.temp}
                  </div>
                </div>

                {/* Bottom Card */}
                <div className="relative z-20 p-6 sm:p-8">
                  <div className="backdrop-blur-2xl bg-slate-950/80 border border-white/15 p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col gap-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Globe className="text-cyan-400" size={26} />
                        <h3 className="text-2xl sm:text-3xl font-black text-cyan-300">{tText(activeRegion.name)}</h3>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                        {tText(activeRegion.risk)}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                      {tText(activeRegion.desc)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`tree-${activeTree.id}`} 
              variants={rightVariants} 
              initial="hidden" 
              animate="show" 
              exit="exit" 
              className="w-full h-full max-h-[88vh] rounded-[2.5rem] p-[3px] bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/30 flex flex-col"
            >
              <div className="relative w-full h-full rounded-[2.35rem] overflow-hidden bg-slate-950 flex flex-col justify-between">
                <img 
                  src={activeTree.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700 opacity-85" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent"></div>

                {/* Top Badge */}
                <div className="relative z-20 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-slate-950/70 border border-emerald-400/40 shadow-lg text-xs font-bold text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{t('plant', 'step1')}</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-slate-950/70 border border-white/20 text-xs font-mono font-bold text-emerald-300">
                    ${activeTree.price}
                  </div>
                </div>

                {/* Bottom Card */}
                <div className="relative z-20 p-6 sm:p-8">
                  <div className="backdrop-blur-2xl bg-slate-950/80 border border-white/15 p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col gap-5 text-white">
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black mb-2 text-emerald-400">{tText(activeTree.name)}</h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">{tText(activeTree.desc)}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 bg-white/10 p-4 rounded-2xl border border-white/10">
                      <div className="text-center flex-1">
                        <Wind className="text-emerald-400 mb-1 mx-auto" size={24} />
                        <p className="text-xl sm:text-2xl font-black text-white">{activeTree.co2}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">CO2 (kg/yr)</p>
                      </div>
                      <div className="w-px h-10 bg-white/20"></div>
                      <div className="text-center flex-1">
                        <Droplets className="text-cyan-400 mb-1 mx-auto" size={24} />
                        <p className="text-xl sm:text-2xl font-black text-white">{activeTree.oxygen}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">O2 (kg/yr)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default PlantTree;
