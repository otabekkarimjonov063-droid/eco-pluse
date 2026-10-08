import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';

const PaymentModal = ({ isOpen, onClose, project, onFund }) => {
  const [amount, setAmount] = useState(10);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setAmount(10);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setComment('');
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) return;
    
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Save transaction to localStorage
      const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: Number(amount),
        project: project.title,
        comment: comment || 'Izohsiz'
      };
      const existing = JSON.parse(localStorage.getItem('eco_transactions') || '[]');
      localStorage.setItem('eco_transactions', JSON.stringify([newTransaction, ...existing]));

      // Send to Telegram
      sendTelegramMessage(`💰 <b>Yangi Xayriya!</b>\n\nLoyiha: ${project.title}\nSumma: $${amount}\nIzoh: ${comment || 'Izoh yo\'q'}`);

      setTimeout(() => {
        onFund(project.id, Number(amount));
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleCardNumber = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val.slice(0, 19));
  };

  const handleExpiry = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setExpiry(val);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-eco-dark rounded-3xl shadow-2xl overflow-hidden animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Close Button */}
        {!isLoading && !isSuccess && (
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-slate-500 dark:text-slate-300"
          >
            <X size={20} />
          </button>
        )}

        {isSuccess ? (
          <div className="p-12 text-center relative z-10 animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
              <CheckCircle2 size={40} className="animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold mb-2">To'lov Muvaffaqiyatli!</h2>
            <p className="opacity-70 text-sm">Sizning ${amount} hissangiz {project.title} loyihasiga qo'shildi.</p>
          </div>
        ) : (
          <div className="p-8 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                Moliyalashtirish
              </h2>
              <p className="text-sm opacity-70 truncate px-4">{project.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase opacity-70">Summa (USD)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 50, 100, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all ${
                        amount === val ? 'bg-eco-primary text-white shadow-md shadow-eco-primary/30' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold opacity-50">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-eco-primary font-bold text-lg"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Comment Field */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase opacity-70">Izoh (ixtiyoriy)</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-3 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary" size={18} />
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Loyiha uchun o'z tilaklaringizni yozing..."
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-eco-primary font-medium text-sm min-h-[80px] resize-none custom-scrollbar"
                  ></textarea>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase opacity-70">Karta raqami</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary" size={18} />
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={handleCardNumber}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-eco-primary font-mono"
                      required
                    />
                    {/* Visa/MC icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-8 h-5 bg-[#1434CB] rounded text-white flex items-center justify-center text-[8px] font-bold italic">VISA</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase opacity-70">Amal Qilishi</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={handleExpiry}
                      placeholder="MM/YY"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-eco-primary font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase opacity-70">CVV</label>
                    <input 
                      type="password" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-eco-primary font-mono tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs opacity-60 bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg">
                <ShieldCheck size={16} className="shrink-0" />
                To'lov ma'lumotlari 256-bit shifrlash orqali himoyalangan.
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full primary-button py-4 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    To'lash ${amount}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
