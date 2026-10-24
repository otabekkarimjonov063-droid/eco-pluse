import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Plus, Minus, CheckCircle, Leaf,
  ChevronRight, Activity, Globe, ArrowRight, ShieldCheck, Download, Wind, Droplets,
  Rotate3D, Image as ImageIcon
} from 'lucide-react';
import Tree3D from './Tree3D';
import GlassCard from './GlassCard';
import VideoBackdrop from './VideoBackdrop';

const PlantTree = () => {
  const { language, t, tText } = useLanguage();
  const [selectedTree, setSelectedTree] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [step, setStep] = useState(1); // 1: Tree, 2: Region, 3: Impact/Pay, 4: Success
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'photo'
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
      const generatedId = `ECO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setOrderId(generatedId);
      setStep(4);

      // Save order to localStorage
      try {
        const newTransaction = {
          id: generatedId,
          user: cardData.name || 'Foydalanuvchi',
          amount: totalAmount,
          type: `${tText(activeTree.name)} (${quantity}x)`,
          date: new Date().toLocaleDateString('uz-UZ'),
          status: 'Muvaffaqiyatli',
          region: tText(activeRegion.name)
        };
        const existing = JSON.parse(localStorage.getItem('eco_transactions') || '[]');
        localStorage.setItem('eco_transactions', JSON.stringify([newTransaction, ...existing]));

        const existingTrees = JSON.parse(localStorage.getItem('ecopulse_planted_trees') || '[]');
        const treeRecord = {
          orderId: generatedId,
          treeName: tText(activeTree.name),
          region: tText(activeRegion.name),
          quantity,
          amount: totalAmount,
          date: new Date().toISOString()
        };
        localStorage.setItem('ecopulse_planted_trees', JSON.stringify([treeRecord, ...existingTrees]));
      } catch (err) {
        console.error(err);
      }
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
    <div className="min-h-[calc(100vh-2rem)] lg:min-h-screen bg-transparent text-white flex flex-col md:flex-row overflow-hidden font-sans relative lg:border-l border-white/10 transition-colors duration-300">
      {/* Dynamic Looping Video Background */}
      <VideoBackdrop 
        src="/videos/growth.mp4" 
        poster="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1600" 
        opacity={0.3} 
      />

      {/* LEFT PANEL - CONTROLS (Ultra-Transparent Crystal Frosted Glass) */}
      <div className="w-full md:w-1/2 lg:w-5/12 z-10 flex flex-col justify-start pt-24 pb-12 px-6 lg:px-12 min-h-screen overflow-y-auto relative backdrop-blur-2xl bg-white/[0.08] dark:bg-black/20 border-r border-white/10 shadow-2xl transition-colors duration-300 text-white">

        {/* Step Indicator */}
        <div className="absolute top-8 left-6 lg:left-12 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                step === s 
                  ? 'bg-emerald-400 text-black font-bold shadow-[0_0_14px_rgba(52,211,153,0.7)]' 
                  : step > s 
                    ? 'border border-emerald-400/60 text-emerald-300 bg-emerald-500/20' 
                    : 'border border-white/20 text-white/50 bg-white/5'
              }`}>
                {step > s ? <CheckCircle size={13} /> : `0${s}`}
              </div>
              {s !== 4 && <div className={`w-5 h-[1px] transition-all duration-300 ${step > s ? 'bg-emerald-400/60' : 'bg-white/15'}`}></div>}
            </div>
          ))}
        </div>

        <div className="pt-14 pb-8 flex flex-col justify-center">
          
          {/* Mobile Preview Showcase */}
          <div className="md:hidden mb-6 rounded-2xl overflow-hidden border border-white/15 bg-black/40">
            <div className="relative h-60 overflow-hidden bg-[#08090a]">
              {step !== 2 && viewMode === '3d' ? (
                <Tree3D treeType={activeTree.id} quantity={quantity} />
              ) : (
                <img 
                  src={step === 2 ? activeRegion.image : activeTree.image} 
                  alt="" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white pointer-events-none">
                <div>
                  <div className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider">
                    {step === 2 ? t('plant', 'step2') : t('plant', 'step1')}
                  </div>
                  <div className="text-base font-semibold text-white">{step === 2 ? tText(activeRegion.name) : tText(activeTree.name)}</div>
                </div>
                <span className="font-mono text-xs bg-black/60 px-2.5 py-1 rounded-md border border-white/20 text-white">
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
                  <h1 className="font-display text-3xl lg:text-4xl font-light mb-2 tracking-tight text-white drop-shadow-md">
                    {t('plant', 'headline').split('.')[0]}. <br />
                    <span className="text-emerald-400 font-medium italic drop-shadow-[0_0_16px_rgba(52,211,153,0.6)]">{t('plant', 'headline').split('.')[1] || ''}</span>
                  </h1>
                  <p className="text-white/80 text-sm max-w-md font-normal leading-relaxed drop-shadow-sm">
                    {t('plant', 'subheadline')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {trees.map((tree, idx) => {
                    const isSelected = selectedTree === idx;
                    const displayTreeName = tText(tree.name);
                    return (
                      <GlassCard
                        key={tree.id}
                        tone={isSelected ? "raised" : "base"}
                        as="button"
                        onClick={() => setSelectedTree(idx)}
                        className={`w-full text-center p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition ${
                          isSelected 
                            ? 'border-emerald-400/80 bg-emerald-500/20 shadow-[0_0_24px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50' 
                            : 'border-white/15 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl'
                        }`}
                      >
                        <div className="relative z-10 w-full flex flex-col items-center">
                          <div className={`p-1 rounded-xl transition-all duration-200 mb-2 border ${
                            isSelected 
                              ? 'border-emerald-400/60 bg-emerald-500/25' 
                              : 'border-white/15 bg-white/[0.04]'
                          }`}>
                            <img 
                              src={tree.image} 
                              alt={displayTreeName} 
                              width="64"
                              height="64"
                              loading="lazy"
                              decoding="async"
                              className="w-16 h-16 rounded-lg object-cover" 
                            />
                          </div>

                          <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-emerald-300 drop-shadow-sm' : 'text-white'}`}>
                            {displayTreeName}
                          </h3>
                          <p className="text-emerald-300/85 text-[11px] mt-0.5 font-mono tabular-nums">
                            ${tree.price} / {t('plant', 'per_tree')}
                          </p>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full py-3.5 rounded-full primary-button text-sm font-semibold flex justify-center items-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    {t('plant', 'continue_btn')} <ArrowRight size={16} />
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
                    className="text-white/70 hover:text-white flex items-center gap-2 mb-4 font-semibold transition-colors text-sm cursor-pointer"
                  >
                    <ChevronRight className="rotate-180" size={16} /> {t('plant', 'back_btn')}
                  </button>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight mb-2 text-white drop-shadow-md">
                    {t('plant', 'select_region')}
                  </h2>
                  <p className="text-white/80 text-sm max-w-md">
                    {tText(activeTree.name)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {regions.map((region, idx) => {
                    const isSelected = selectedRegion === idx;
                    const displayRegionName = tText(region.name);
                    const displayRisk = tText(region.risk);
                    const displayDesc = tText(region.desc);

                    return (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(idx)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border relative overflow-hidden group flex items-center gap-3.5 cursor-pointer backdrop-blur-xl ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400/80 shadow-[0_0_24px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/40'
                            : 'bg-white/[0.06] border-white/15 hover:bg-white/[0.12]'
                        }`}
                      >
                        {isSelected && (
                          <motion.div layoutId="activeRegionBorder" className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400" />
                        )}
                        
                        <div className={`p-1 rounded-xl transition-all shrink-0 border ${
                          isSelected 
                            ? 'border-emerald-400/60 bg-emerald-500/25' 
                            : 'border-white/15 bg-white/[0.04]'
                        }`}>
                          <img 
                            src={region.image} 
                            alt={displayRegionName} 
                            width="56"
                            height="56"
                            loading="lazy"
                            decoding="async"
                            className="w-14 h-14 rounded-lg object-cover" 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-emerald-300 drop-shadow-sm' : 'text-white'}`}>
                            {displayRegionName}
                          </h3>
                          <p className="text-xs text-white/75 truncate mt-0.5">
                            {displayDesc}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/25 text-rose-200 rounded-md border border-rose-500/40">
                              {displayRisk}
                            </span>
                            <span className="text-[10px] font-mono text-white/80">
                              {region.temp}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setStep(3)} 
                    className="w-full py-3.5 primary-button text-sm font-semibold rounded-xl flex justify-center items-center gap-2 shadow-lg"
                  >
                    {t('plant', 'continue_btn')} <ArrowRight size={16} />
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
                    className="text-white/70 hover:text-white flex items-center gap-2 mb-4 font-semibold transition-colors text-xs cursor-pointer"
                  >
                    <ChevronRight className="rotate-180" size={14} /> {t('plant', 'back_btn')}
                  </button>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight mb-2 text-white drop-shadow-md">
                    {t('plant', 'step3')}
                  </h2>
                  <p className="text-xs font-mono text-emerald-300/80">
                    {tText(activeTree.name)} • {tText(activeRegion.name)}
                  </p>
                </div>

                {/* Quantity selector */}
                <div className="p-4 bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-between">
                  <span className="font-medium text-sm text-white">{t('plant', 'quantity')}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:border-emerald-400 transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-base font-mono font-bold w-8 text-center text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:border-emerald-400 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Total box */}
                <div className="p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl flex items-center justify-between backdrop-blur-xl shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <span className="font-semibold text-sm text-emerald-300">{t('plant', 'total_amount')}</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">${totalAmount}</span>
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
                      className="w-full bg-white/[0.08] border border-white/20 p-3 rounded-xl font-medium text-white placeholder-white/40 outline-none focus:border-emerald-400 focus:bg-white/[0.14] transition-all text-xs tracking-wider uppercase" 
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
                      className="w-full bg-white/[0.08] border border-white/20 p-3 rounded-xl font-mono text-white placeholder-white/40 outline-none focus:border-emerald-400 focus:bg-white/[0.14] transition-all text-xs" 
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
                      className="w-full bg-white/[0.08] border border-white/20 p-3 rounded-xl font-mono text-white placeholder-white/40 outline-none focus:border-emerald-400 focus:bg-white/[0.14] text-xs" 
                    />
                    <input 
                      type="password" 
                      required 
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.slice(0, 4) })}
                      placeholder="CVV" 
                      maxLength="4" 
                      className="w-full bg-white/[0.08] border border-white/20 p-3 rounded-xl font-mono text-white placeholder-white/40 outline-none focus:border-emerald-400 focus:bg-white/[0.14] text-xs" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 primary-button text-sm font-semibold rounded-xl flex justify-center items-center gap-2 mt-4 disabled:opacity-50 shadow-lg cursor-pointer"
                  >
                    {isLoading ? '...' : t('plant', 'pay_btn')}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="text-center space-y-6 my-auto py-8">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-normal tracking-tight mb-2 text-white drop-shadow-md">
                    {t('plant', 'order_placed')}
                  </h2>
                  <p className="text-xs text-white/80 max-w-sm mx-auto">
                    {t('plant', 'order_desc')}
                  </p>
                  <div className="mt-4 inline-block px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-lg border border-emerald-400/40">
                    ID: {orderId}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2.5 max-w-sm mx-auto">
                  <button 
                    onClick={() => window.print()}
                    className="w-full py-3 primary-button text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Download size={16} /> {t('plant', 'download_cert')}
                  </button>
                  <button 
                    onClick={() => { setStep(1); setQuantity(1); }}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium rounded-xl text-white cursor-pointer backdrop-blur-md transition-colors"
                  >
                    {t('plant', 'close')}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL - IMMERSIVE VISUALS WITH 3D TREE LOWER DOWN AND TEXT ON TOP */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 sticky top-0 h-screen p-6 lg:p-8 flex-col justify-center items-center overflow-hidden pb-16">
        <AnimatePresence mode="wait">
          {step === 2 ? (
            <GlassCard 
              tone="feature"
              key={`region-${activeRegion.id}`} 
              as={motion.div}
              variants={rightVariants} 
              initial="hidden" 
              animate="show" 
              exit="exit" 
              className="w-full h-full max-h-[86vh] rounded-3xl overflow-hidden"
            >
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col gap-3 justify-between">
                {/* Top Badge */}
                <div className="flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-xs font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{t('plant', 'step2')}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-xs font-mono text-white tabular-nums">
                    {activeRegion.temp}
                  </div>
                </div>

                {/* Region Info Card (Ultra-Transparent Frosted Glass) */}
                <div className="shrink-0 backdrop-blur-2xl bg-white/[0.08] dark:bg-black/20 border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col gap-2 text-white shadow-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Globe className="text-emerald-400" size={20} />
                      <h3 className="text-xl sm:text-2xl font-display font-light text-white drop-shadow-sm">{tText(activeRegion.name)}</h3>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 bg-rose-500/25 text-rose-200 rounded-md border border-rose-500/40">
                      {tText(activeRegion.risk)}
                    </span>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {tText(activeRegion.desc)}
                  </p>
                </div>

                {/* Region Photo Viewport */}
                <div className="relative flex-1 w-full min-h-[320px] rounded-2xl overflow-hidden border border-white/15">
                  <img 
                    src={activeRegion.image} 
                    alt="" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard 
              tone="feature"
              key={`tree-${activeTree.id}`} 
              as={motion.div}
              variants={rightVariants} 
              initial="hidden" 
              animate="show" 
              exit="exit" 
              className="w-full h-full max-h-[86vh] rounded-3xl overflow-hidden"
            >
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col gap-3 justify-between">
                
                {/* Top Badge & 3D / Photo Mode Switcher */}
                <div className="flex justify-between items-center shrink-0 pointer-events-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-xs font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('plant', 'step1')}</span>
                  </div>

                  {/* 3D / Photo Switcher Pill */}
                  <div className="flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <button
                      type="button"
                      onClick={() => setViewMode('3d')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        viewMode === '3d'
                          ? 'bg-white/25 text-white font-semibold shadow-xs'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Rotate3D size={13} className={viewMode === '3d' ? 'animate-spin-slow' : ''} /> 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('photo')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        viewMode === 'photo'
                          ? 'bg-white/25 text-white font-semibold shadow-xs'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <ImageIcon size={13} /> Photo
                    </button>
                  </div>

                  <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono text-emerald-300 font-bold tabular-nums">
                    ${activeTree.price}
                  </div>
                </div>

                {/* Tree Info Card at Top (Ultra-Transparent Frosted Glass, Radiant Contrast) */}
                <div className="shrink-0 backdrop-blur-2xl bg-white/[0.08] dark:bg-black/20 border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col gap-2.5 shadow-2xl text-white">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-light tracking-tight mb-0.5 text-white drop-shadow-md">{tText(activeTree.name)}</h3>
                    <p className="text-white/80 text-xs leading-relaxed">{tText(activeTree.desc)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white/[0.05] p-2 rounded-xl border border-white/15">
                    <div className="text-center">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-200/80">CO2 (kg/yr)</p>
                      <p className="text-base sm:text-lg font-display font-medium text-emerald-400 mt-0.5 tabular-nums drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{activeTree.co2}</p>
                    </div>
                    <div className="text-center border-l border-white/15">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-200/80">O2 (kg/yr)</p>
                      <p className="text-base sm:text-lg font-display font-medium text-emerald-400 mt-0.5 tabular-nums drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{activeTree.oxygen}</p>
                    </div>
                  </div>
                </div>

                {/* Dedicated 3D Tree Viewport */}
                <div className="relative flex-1 w-full min-h-[340px] rounded-2xl overflow-hidden border border-white/15 bg-black/20">
                  {viewMode === '3d' ? (
                    <Tree3D treeType={activeTree.id} quantity={quantity} />
                  ) : (
                    <>
                      <img 
                        src={activeTree.image} 
                        alt="" 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </>
                  )}
                </div>

              </div>
            </GlassCard>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default PlantTree;
