import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  TreePine, TreeDeciduous, Plus, Minus, CheckCircle, Leaf,
  MapPin, Wind, Droplets, ChevronRight, Activity, Globe, ArrowRight, ShieldCheck, Download
} from 'lucide-react';

const PlantTree = () => {
  const { language } = useLanguage();
  const [selectedTree, setSelectedTree] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [step, setStep] = useState(1); // 1: Tree, 2: Region, 3: Impact/Pay, 4: Success
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const trees = [
    { id: 'oak', name: 'Qudratli Eman', price: 15, co2: 22, oxygen: 118, color: 'from-emerald-400 to-green-600', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1600', desc: 'Asrlar osha yashaydigan, tabiatning chinakam ustuni.' },
    { id: 'pine', name: 'Zomin Qarag\'ayi', price: 10, co2: 15, oxygen: 90, color: 'from-cyan-400 to-teal-600', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600', desc: 'Tog\' havosi va muzdek shabadani o\'zida mujassam etgan.' },
    { id: 'maple', name: 'Kuzgi Zarang', price: 18, co2: 20, oxygen: 100, color: 'from-orange-400 to-red-600', image: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?auto=format&fit=crop&q=80&w=1600', desc: 'Atrofga go\'zallik va o\'zgacha rang-baranglik bag\'ishlaydi.' },
    { id: 'sakura', name: 'Olcha daraxti', price: 25, co2: 12, oxygen: 80, color: 'from-pink-400 to-rose-600', image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1600', desc: 'Bahor faslining bebaho elchisi, estetik go\'zallik.' },
  ];

  const regions = [
    { id: 'aral', name: 'Orol Dengizi Tubi', risk: 'Kritik holat', temp: '+45°C', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1600', desc: 'Qurigan dengiz tubini yashil o\'rmonga aylantirish loyihasi.' },
    { id: 'zaamin', name: 'Zomin Tog\'lari', risk: 'Barqaror', temp: '+22°C', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600', desc: 'Tog\' yonbag\'irlarini yomg\'ir suvlari yuvib ketishidan asrash.' },
    { id: 'tashkent', name: 'Toshkent "Yashil Halqa"', risk: 'O\'rta', temp: '+35°C', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&q=80&w=1600', desc: 'Poytaxt havosini tozalash uchun shahar atrofidagi o\'rmonzor.' }
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
    }, 2000);
  };

  // Split-screen Layout variants
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

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

      {/* LEFT PANEL - CONTROLS */}
      <div className="w-full md:w-1/2 lg:w-5/12 z-10 flex flex-col justify-start pt-40 pb-12 px-8 lg:px-16 min-h-screen overflow-y-auto relative backdrop-blur-[2px] bg-eco-light/80 dark:bg-eco-dark/80 md:bg-transparent md:bg-gradient-to-r md:from-eco-light md:via-eco-light/90 dark:md:from-eco-dark dark:md:via-eco-dark/90 md:to-transparent border-r border-black/5 dark:border-white/5">

        {/* Step Indicator */}
        <div className="absolute top-12 lg:top-16 left-8 lg:left-16 flex items-center gap-3">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono transition-all duration-700 ${step === s ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110' :
                  step > s ? 'border border-emerald-500 text-emerald-500' : 'border border-white/10 text-white/30'
                }`}>
                {step > s ? <CheckCircle size={16} /> : `0${s}`}
              </div>
              {s !== 4 && <div className={`w-8 h-[1px] transition-all duration-700 ${step > s ? 'bg-emerald-500/50' : 'bg-white/10'}`}></div>}
            </div>
          ))}
        </div>

        <div className="px-8 lg:px-16 pt-32 pb-12 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* STEP 1: SELECT TREE */}
            {step === 1 && (
              <motion.div key="step1" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 my-auto">
                <div>
                  <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-400 dark:from-white dark:to-white/40 pb-2">
                    Nafas ol. <br /> <span className="text-emerald-400">Hayot ulash.</span>
                  </h1>
                  <p className="text-slate-600 dark:text-white/50 text-lg max-w-md font-light leading-relaxed">
                    Sayyoramizning ertangi kuni sizning bugungi tanlovingizda. Qaysi tabiat mo'jizasini dunyoga keltirmoqchisiz?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {trees.map((tree, idx) => (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedTree(idx)}
                      className={`w-full text-center p-4 rounded-3xl transition-all duration-500 border relative overflow-hidden group flex flex-col items-center justify-center ${selectedTree === idx
                          ? 'bg-white/10 border-white/20 shadow-xl'
                          : 'bg-white/40 dark:bg-transparent border-black/5 dark:border-transparent hover:bg-white/60 dark:hover:bg-white/5'
                        }`}
                    >
                      {selectedTree === idx && (
                        <motion.div layoutId="activeTreeBorder" className="absolute left-0 top-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                      )}
                      <div className="relative z-10 w-full flex flex-col items-center">
                        <img src={tree.image} alt={tree.name} className="w-16 h-16 lg:w-20 lg:h-20 mb-3 rounded-full object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500" />
                        <h3 className={`text-lg lg:text-xl font-bold transition-colors ${selectedTree === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{tree.name}</h3>
                        <p className="text-slate-500 dark:text-white/40 text-xs mt-1 font-mono">${tree.price} / dona</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                  <button onClick={() => setStep(2)} className="w-full py-5 bg-white text-black font-black text-xl uppercase tracking-widest rounded-full hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] transition-all duration-500 flex justify-center items-center gap-4">
                    Makon tanlash <ArrowRight size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SELECT REGION */}
            {step === 2 && (
              <motion.div key="step2" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 my-auto">
                <div>
                  <button onClick={() => setStep(1)} className="text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 mb-8 transition-colors"><ChevronRight className="rotate-180" size={16} /> Orqaga</button>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter">Ildiz otadigan <br /><span className="text-cyan-400">Makon.</span></h2>
                  <p className="text-slate-600 dark:text-white/50 text-lg max-w-md font-light">Siz tanlagan "{activeTree.name}" aynan qayerda tabiat muvozanatini tiklashga yordam bersin?</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {regions.map((region, idx) => (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(idx)}
                      className={`w-full text-center p-4 rounded-3xl transition-all duration-500 border relative overflow-hidden group flex flex-col items-center justify-center ${selectedRegion === idx
                          ? 'bg-white/10 border-white/20 shadow-xl'
                          : 'bg-white/40 dark:bg-transparent border-black/5 dark:border-transparent hover:bg-white/60 dark:hover:bg-white/5'
                        } ${idx === 2 ? 'col-span-2' : ''}`}
                    >
                      {selectedRegion === idx && (
                        <motion.div layoutId="activeRegionBorder" className="absolute left-0 top-0 right-0 h-1 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                      )}
                      <div className={`relative z-10 w-full flex ${idx === 2 ? 'flex-row gap-6 text-left justify-center items-center' : 'flex-col items-center'}`}>
                        <img src={region.image} alt={region.name} className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500 ${idx === 2 ? '' : 'mb-3'}`} />
                        <div>
                          <h3 className={`text-lg lg:text-xl font-bold transition-colors ${selectedRegion === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{region.name}</h3>
                          <div className={`flex items-center gap-2 mt-2 ${idx === 2 ? '' : 'justify-center'}`}>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-black/10 dark:bg-black/50 rounded text-rose-500 dark:text-rose-400">{region.risk}</span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">{region.temp}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                  <button onClick={() => setStep(3)} className="w-full py-5 bg-white text-black font-black text-xl uppercase tracking-widest rounded-full hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-500 flex justify-center items-center gap-4">
                    Miqdor & To'lov <ArrowRight size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div key="step3" variants={leftVariants} initial="hidden" animate="show" exit="exit" className="space-y-8 mt-4">
                <div>
                  <button onClick={() => setStep(2)} className="text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 mb-6 transition-colors"><ChevronRight className="rotate-180" size={16} /> Orqaga (Manzilga)</button>
                  <h2 className="text-5xl font-black mb-2 tracking-tighter">Buyuk <span className="text-emerald-400">Hissa.</span></h2>
                </div>

                {/* Interactive Quantity Slider area */}
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  <p className="text-slate-500 dark:text-white/50 text-sm uppercase tracking-widest mb-4">Ekish miqdori</p>
                  <div className="flex items-center justify-between relative z-10">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 rounded-full bg-slate-200 dark:bg-black border border-transparent dark:border-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/10 transition-colors active:scale-95 cursor-pointer text-slate-800 dark:text-white"><Minus size={20} /></button>
                    <div className="text-center">
                      <motion.span key={quantity} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
                        {quantity}
                      </motion.span>
                      <p className="text-emerald-500 dark:text-emerald-400 font-mono mt-1">dona daraxt</p>
                    </div>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 rounded-full bg-slate-200 dark:bg-black border border-transparent dark:border-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/10 transition-colors active:scale-95 cursor-pointer text-slate-800 dark:text-white"><Plus size={20} /></button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePay} className="space-y-6">
                  <div className="space-y-4">
                    <input type="text" required placeholder="KARTA EGASI" className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 px-0 py-4 font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 text-xl [&:-webkit-autofill]:[Webkit-box-shadow:0_0_0_30px_#07101a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    <input type="text" required placeholder="0000 0000 0000 0000" maxLength="19" className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 px-0 py-4 font-mono text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 text-2xl tracking-widest [&:-webkit-autofill]:[Webkit-box-shadow:0_0_0_30px_#07101a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    <div className="flex gap-6">
                      <input type="text" required placeholder="MM/YY" maxLength="5" className="w-1/2 bg-transparent border-b-2 border-slate-200 dark:border-white/10 px-0 py-4 font-mono text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 text-xl [&:-webkit-autofill]:[Webkit-box-shadow:0_0_0_30px_#07101a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                      <input type="password" required placeholder="CVV" maxLength="4" className="w-1/2 bg-transparent border-b-2 border-slate-200 dark:border-white/10 px-0 py-4 font-mono text-slate-900 dark:text-white tracking-widest outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-white/20 text-xl [&:-webkit-autofill]:[Webkit-box-shadow:0_0_0_30px_#07101a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-slate-500 dark:text-white/40 uppercase tracking-widest text-sm">Jami to'lov</span>
                      <span className="text-5xl font-black text-emerald-500 dark:text-emerald-400">${totalAmount}</span>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-black font-black text-2xl rounded-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-[0.98] relative overflow-hidden group">
                      <span className="relative z-10">{isLoading ? 'Qayta ishlanmoqda...' : 'Tasdiqlash'}</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    <p className="text-center text-slate-500 dark:text-white/30 text-xs mt-4 flex justify-center items-center gap-1"><ShieldCheck size={14} /> AES-256 Shifrlangan</p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS CERTIFICATE */}
            {step === 4 && (
              <motion.div key="step4" variants={leftVariants} initial="hidden" animate="show" className="space-y-10 text-center my-auto">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto relative">
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"></motion.div>
                  <CheckCircle size={48} className="text-emerald-400 relative z-10" />
                </div>

                <div>
                  <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pb-2">
                    Rasmiy Ekologik<br />Sertifikat
                  </h2>
                  <p className="text-slate-600 dark:text-white/50">Yer sayyorasining yashil kelajagiga qo'shgan hissangiz uchun cheksiz minnatdorchilik bildiramiz.</p>
                </div>

                <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900 dark:bg-[#020804] border border-slate-700 dark:border-white/20 rounded-3xl p-8 relative text-white">
                  <div className="absolute top-4 left-4 text-white/30 font-mono text-xs">CERT ID: {orderId}</div>
                  <ShieldCheck size={80} className="absolute -bottom-6 -right-6 text-emerald-500/20 rotate-12" />

                  <div className="mt-6 text-left space-y-6">
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-widest">Ekilgan daraxt</p>
                      <p className="text-2xl font-bold">{quantity} dona {activeTree.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-widest">Manzil</p>
                      <p className="text-2xl font-bold text-cyan-400">{activeRegion.name}</p>
                    </div>
                    <div className="border-t border-white/20 pt-6 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-3xl font-black text-emerald-400">{(activeTree.co2 * quantity)} <span className="text-sm font-normal text-white/50">kg</span></p>
                        <p className="text-xs text-white/50">Yillik CO2 yutilishi</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-rose-400">{(activeTree.co2 * 5 * quantity)} <span className="text-sm font-normal text-white/50">km</span></p>
                        <p className="text-xs text-white/50">Avto zararini yopish</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-blue-400">{(activeTree.oxygen * quantity)} <span className="text-sm font-normal text-white/50">kg</span></p>
                        <p className="text-xs text-white/50">Yillik O2</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => { setStep(1); setQuantity(1); }} className="flex-1 py-4 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-xl font-bold transition-colors text-slate-800 dark:text-white">Yana ekish</button>
                  <button onClick={() => window.print()} className="flex-1 py-4 bg-emerald-500 text-white dark:text-black rounded-xl font-black hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                    <Download size={20} /> Yuklab olish
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL - IMMERSIVE VISUALS */}
      <div className="hidden md:block w-1/2 lg:w-7/12 relative h-screen bg-slate-100 dark:bg-black">
        <AnimatePresence mode="wait">

          {/* Conditional Rendering for Step 2 vs Tree views */}
          {step === 2 ? (
            <motion.div key={`region-${activeRegion.id}`} variants={rightVariants} initial="hidden" animate="show" exit="exit" className="absolute inset-0">
              <img src={activeRegion.image} alt={activeRegion.name} className="w-full h-full object-cover opacity-40 dark:opacity-60" />
              <div className="absolute inset-0 bg-cyan-900/10 dark:bg-cyan-900/20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-eco-light dark:to-eco-dark"></div>

              {/* Dynamic Radar/Map Marker Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }} className="absolute w-32 h-32 border border-cyan-400 rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeOut" }} className="absolute w-32 h-32 border border-cyan-400 rounded-full"></motion.div>
                <div className="w-6 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(34,211,238,1)]"></div>
              </div>

              <div className="absolute bottom-16 right-16 text-right">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="inline-block backdrop-blur-md bg-white/85 dark:bg-[#020804]/85 border border-black/5 dark:border-white/10 p-8 rounded-3xl">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <Globe className="text-cyan-500 dark:text-cyan-400" />
                    <h3 className="text-4xl font-black text-cyan-600 dark:text-cyan-400">{activeRegion.name}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-white/60 max-w-sm ml-auto leading-relaxed">{activeRegion.desc}</p>
                </motion.div>
              </div>
            </motion.div>
          ) : (step === 1 || step === 3 || step === 4) ? (
            <motion.div key={`tree-${activeTree.id}`} variants={rightVariants} initial="hidden" animate="show" exit="exit" className="absolute inset-0">
              <img src={activeTree.image} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-60 text-transparent" onError={(e) => e.target.style.display = 'none'} />
              <div className={`absolute inset-0 bg-gradient-to-br ${activeTree.color} mix-blend-overlay opacity-10 dark:opacity-30`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/40 dark:from-[#020804] dark:via-[#020804]/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-eco-light dark:to-eco-dark"></div>

              <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col justify-end">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="w-full backdrop-blur-md bg-white/85 dark:bg-[#020804]/85 border border-black/5 dark:border-white/10 p-8 rounded-3xl shadow-2xl flex justify-between items-end text-slate-900 dark:text-white">

                  <div className="max-w-md">
                    <h3 className="text-5xl font-black mb-3">{activeTree.name}</h3>
                    <p className="text-slate-600 dark:text-white/60 leading-relaxed text-lg">{activeTree.desc}</p>
                  </div>

                  <div className="flex items-center gap-8 bg-black/5 dark:bg-black/40 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="text-left">
                      <Wind className="text-emerald-500 dark:text-emerald-400 mb-2" size={32} />
                      <p className="text-3xl font-black">{activeTree.co2} <span className="text-sm font-normal text-slate-500 dark:text-white/40">kg/yil</span></p>
                      <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/40">CO2 Yutilishi</p>
                    </div>
                    <div className="w-px h-16 bg-black/10 dark:bg-white/10"></div>
                    <div className="text-left">
                      <Activity className="text-rose-500 dark:text-rose-400 mb-2" size={32} />
                      <p className="text-3xl font-black">{(activeTree.co2 * 5)} <span className="text-sm font-normal text-slate-500 dark:text-white/40">km</span></p>
                      <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/40">Avto zararini yopish</p>
                    </div>
                    <div className="w-px h-16 bg-black/10 dark:bg-white/10"></div>
                    <div className="text-left">
                      <Droplets className="text-blue-500 dark:text-blue-400 mb-2" size={32} />
                      <p className="text-3xl font-black">{activeTree.oxygen} <span className="text-sm font-normal text-slate-500 dark:text-white/40">kg/yil</span></p>
                      <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/40">Sof Kislorod</p>
                    </div>
                  </div>

                </motion.div>
              </div>
            </motion.div>
          ) : null}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default PlantTree;
