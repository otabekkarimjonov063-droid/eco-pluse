import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { TreePine, TreeDeciduous, Plus, Minus, CheckCircle, Leaf, Camera, CreditCard, ShieldCheck } from 'lucide-react';

const PlantTree = () => {
  const { t } = useLanguage();
  const [selectedTree, setSelectedTree] = useState('oak');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState('select'); // 'select' | 'payment' | 'success'
  const [isLoading, setIsLoading] = useState(false);

  // Payment state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const trees = [
    { id: 'oak', name: t('plant', 'trees.oak') || 'Eman (Oak)', price: 15, icon: <TreeDeciduous size={32} className="text-emerald-500" />, image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a56?auto=format&fit=crop&q=80&w=2000' },
    { id: 'pine', name: t('plant', 'trees.pine') || 'Qarag\'ay (Pine)', price: 10, icon: <TreePine size={32} className="text-emerald-400" />, image: 'https://images.unsplash.com/photo-1598284523363-f09c25f4cc0c?auto=format&fit=crop&q=80&w=2000' },
    { id: 'maple', name: t('plant', 'trees.maple') || 'Zarang (Maple)', price: 18, icon: <Leaf size={32} className="text-orange-500" />, image: 'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?auto=format&fit=crop&q=80&w=2000' },
    { id: 'fruit', name: t('plant', 'trees.fruit') || 'Mevali Daraxt', price: 25, icon: <Leaf size={32} className="text-pink-500" />, image: 'https://images.unsplash.com/photo-1590059520935-e10dbfc09a39?auto=format&fit=crop&q=80&w=2000' },
    { id: 'sakura', name: 'Sakura (Olcha)', price: 30, icon: <TreeDeciduous size={32} className="text-pink-400" />, image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=2000' },
    { id: 'redwood', name: 'Sekvoya (Redwood)', price: 40, icon: <TreePine size={32} className="text-red-800 dark:text-red-500" />, image: 'https://images.unsplash.com/photo-1444044205806-38f3ed106c10?auto=format&fit=crop&q=80&w=2000' },
    { id: 'palm', name: 'Palma Daraxti', price: 20, icon: <TreePine size={32} className="text-yellow-600" />, image: 'https://images.unsplash.com/photo-1596700684074-9457635293fb?auto=format&fit=crop&q=80&w=2000' },
    { id: 'willow', name: 'Majnuntol (Willow)', price: 12, icon: <TreeDeciduous size={32} className="text-green-300" />, image: 'https://images.unsplash.com/photo-1623838612177-3e54bdecc6cc?auto=format&fit=crop&q=80&w=2000' },
  ];

  const activeTree = trees.find(t => t.id === selectedTree);
  const totalAmount = activeTree.price * quantity;

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      setIsLoading(false);
      setStep('success');

      // Update total raised
      const prevTotal = parseFloat(localStorage.getItem('ecopulse_total_raised') || '0');
      const newTotal = prevTotal + totalAmount;
      localStorage.setItem('ecopulse_total_raised', newTotal.toString());

      // Send to Telegram
      const time = new Date().toLocaleString('uz-UZ');
      const caption = `
🌳 <b>YANGI DARAXT BUYURTMASI!</b> 🌳

👤 <b>Mijoz:</b> ${cardName}
💳 <b>Karta:</b> **** **** **** ${cardNumber.slice(-4)}
🌲 <b>Daraxt:</b> ${activeTree.name}
🔢 <b>Soni:</b> ${quantity} ta
💰 <b>To'langan summa:</b> $${totalAmount}
🕒 <b>Vaqt:</b> ${time}

📈 <b>Umumiy Yig'ilgan Pul:</b> $${newTotal}
      `;
      
      const { sendTelegramPhoto } = await import('../utils/telegram.js');
      await sendTelegramPhoto(activeTree.image, caption);
    }, 2000);
  };

  const resetForm = () => {
    setStep('select');
    setQuantity(1);
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 md:px-12 pb-24 relative overflow-hidden">
      {/* Lightweight static background gradients instead of heavy blurs */}
      <div className="absolute top-[0%] right-[0%] w-[40vw] h-[40vh] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[0%] w-[40vw] h-[40vh] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 mb-4 inline-flex items-center gap-4">
            <TreePine size={44} className="text-emerald-500" />
            {t('plant', 'title') || 'Real Tree Planting'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Tabiatga o'z hissangizni qo'shing. Daraxt tanlang, buyurtma bering va biz uni siz uchun ekib, maxsus rasmini yuboramiz.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div 
              key="select-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-5 gap-8 items-start"
            >
              {/* Tree Selection Area */}
              <div className="lg:col-span-3 premium-glass rounded-3xl p-6 md:p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                  Daraxt turini tanlang
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
                  {trees.map((tree) => (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedTree(tree.id)}
                      className={`relative p-4 md:p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 border overflow-hidden group ${
                        selectedTree === tree.id 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                          : 'border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40'
                      }`}
                    >
                      <div className="relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-3">
                        {tree.icon}
                      </div>
                      <span className="font-semibold text-sm text-center text-slate-800 dark:text-white relative z-10">{tree.name}</span>
                      <span className="text-xs font-bold text-emerald-500 relative z-10">${tree.price}</span>
                      
                      {selectedTree === tree.id && (
                        <motion.div 
                          layoutId="treeSelect"
                          className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Quantity & Next */}
                <div className="bg-white/50 dark:bg-black/30 rounded-2xl p-6 backdrop-blur-md border border-white/40 dark:border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      Qancha daraxt ekmoqchisiz?
                    </span>
                    <div className="flex items-center gap-4 bg-white dark:bg-[#0f172a] rounded-xl p-2 shadow-inner border border-black/5 dark:border-white/5">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6">
                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300">Jami hisob:</span>
                    <span className="text-3xl font-extrabold text-emerald-500">
                      ${totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Image Column */}
              <div className="lg:col-span-2 h-full">
                <div className="relative h-full min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 group">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeTree.id}
                      src={activeTree.image}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt={activeTree.name}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div 
                      key={`desc-${activeTree.id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-white"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md mb-4 border border-white/30 text-xs font-medium">
                        <Camera size={14} /> <span>Haqiqiy ekilgan daraxt rasmi yuboriladi</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-2">{activeTree.name}</h2>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">
                        Siz tanlagan bu ajoyib tabiat mo'jizasi sayyoramizni yashil va toza qilishga katta yordam beradi. Har bir daraxt qahramondir.
                      </p>
                      <button 
                        onClick={handleProceedToPayment}
                        className="w-full primary-button py-4 text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                      >
                        Davom etish <CheckCircle size={20} />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div 
              key="payment-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto premium-glass rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <CreditCard className="text-indigo-500" /> To'lovni amalga oshirish
                </h2>
                <button onClick={() => setStep('select')} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium">
                  Orqaga qaytish
                </button>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Buyurtma qilingan:</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{quantity}x {activeTree.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Jami To'lov:</p>
                  <p className="text-2xl font-extrabold text-indigo-500">${totalAmount}</p>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Karta egasining ismi</label>
                  <input 
                    type="text" required value={cardName} onChange={e => setCardName(e.target.value)}
                    placeholder="JOHN DOE" 
                    className="w-full bg-white/50 dark:bg-black/30 border border-slate-300 dark:border-white/20 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors uppercase font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Karta raqami</label>
                  <div className="relative">
                    <input 
                      type="text" required value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000" maxLength="19"
                      className="w-full bg-white/50 dark:bg-black/30 border border-slate-300 dark:border-white/20 rounded-xl px-4 py-3 pl-12 outline-none focus:border-indigo-500 transition-colors font-mono"
                    />
                    <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amal qilish muddati (MM/YY)</label>
                    <input 
                      type="text" required value={expiry} onChange={e => setExpiry(e.target.value)}
                      placeholder="12/26" maxLength="5"
                      className="w-full bg-white/50 dark:bg-black/30 border border-slate-300 dark:border-white/20 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">CVV</label>
                    <input 
                      type="password" required value={cvv} onChange={e => setCvv(e.target.value)}
                      placeholder="•••" maxLength="4"
                      className="w-full bg-white/50 dark:bg-black/30 border border-slate-300 dark:border-white/20 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 my-4">
                  <ShieldCheck size={16} className="text-green-500" />
                  Barcha to'lovlar 256-bit SSL orqali shifrlangan va xavfsiz.
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full relative py-4 rounded-xl font-bold text-lg text-white overflow-hidden group bg-indigo-600 hover:bg-indigo-500 transition-colors active:scale-[0.98] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>To'lash va Buyurtma qilish (${totalAmount})</>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto premium-glass rounded-3xl p-12 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)] border border-emerald-500/30"
            >
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                <CheckCircle size={48} className="text-emerald-500 relative z-10" />
              </div>
              
              <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                To'lov qabul qilindi!
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                Sizning buyurtmangiz muvaffaqiyatli amalga oshirildi. Tabiat sizdan minnatdor!
                Tez orada daraxt ekilib, haqiqiy rasmi elektron pochtangizga yuboriladi.
              </p>

              <div className="p-6 bg-white/50 dark:bg-black/30 rounded-2xl mb-8 border border-black/5 dark:border-white/5 text-left inline-block">
                <div className="grid sm:grid-cols-3 gap-8">
                  <div>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Daraxt:</span>
                    <span className="font-bold text-lg text-slate-800 dark:text-white">{activeTree.name}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Soni:</span>
                    <span className="font-bold text-lg text-slate-800 dark:text-white">{quantity} ta</span>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">To'landi:</span>
                    <span className="font-bold text-lg text-emerald-500">${totalAmount}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={resetForm}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                >
                  Yana daraxt ekish
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlantTree;
