import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentModal = ({ isOpen, onClose, project, onFund }) => {
  const { language } = useLanguage();
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
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0c1613] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden animate-zoom-in"
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
            className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-slate-500 dark:text-slate-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        {isSuccess ? (
          <div className="p-12 text-center relative z-10 animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
              <CheckCircle2 size={40} className="animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
              {language === 'RU' ? 'Оплата прошла успешно!' : language === 'EN' ? 'Payment Successful!' : "To'lov Muvaffaqiyatli!"}
            </h2>
            <p className="opacity-70 text-sm text-slate-700 dark:text-slate-300">
              {language === 'RU'
                ? `Ваш вклад в размере $${amount} успешно направлен на проект.`
                : language === 'EN'
                ? `Your contribution of $${amount} has been added to the project.`
                : `Sizning $${amount} hissangiz loyihaga muvaffaqiyatli qo'shildi.`}
            </p>
          </div>
        ) : (
          <div className="p-8 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                {language === 'RU' ? 'Финансирование' : language === 'EN' ? 'Fund Project' : 'Moliyalashtirish'}
              </h2>
              <p className="text-sm opacity-70 truncate px-4 text-slate-600 dark:text-slate-400">{project.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              
              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-700 dark:text-slate-300">
                  {language === 'RU' ? 'Сумма (USD)' : language === 'EN' ? 'Amount (USD)' : 'Summa (USD)'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 50, 100, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        amount === val ? 'bg-eco-primary text-white shadow-md shadow-eco-primary/30' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 dark:text-slate-400">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-[#12221b] border border-slate-300 dark:border-white/15 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-emerald-500 font-bold text-lg text-slate-900 dark:text-emerald-300"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Comment Field */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-700 dark:text-slate-300">
                  {language === 'RU' ? 'Комментарий (необязательно)' : language === 'EN' ? 'Comment (optional)' : 'Izoh (ixtiyoriy)'}
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-3 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary text-slate-500 dark:text-slate-400" size={18} />
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={language === 'RU' ? 'Напишите пожелания для проекта...' : language === 'EN' ? 'Write your wishes for the project...' : "Loyiha uchun o'z tilaklaringizni yozing..."}
                    className="w-full bg-slate-100 dark:bg-[#12221b] border border-slate-300 dark:border-white/15 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-eco-primary font-medium text-sm min-h-[75px] resize-none custom-scrollbar text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  ></textarea>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-slate-700 dark:text-slate-300">
                    {language === 'RU' ? 'Номер карты' : language === 'EN' ? 'Card Number' : 'Karta raqami'}
                  </label>
                  <div className="relative group">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-eco-primary text-slate-500 dark:text-slate-400" size={18} />
                    <input 
                      type="text" 
                      inputMode="numeric"
                      autoComplete="off"
                      value={cardNumber}
                      onChange={handleCardNumber}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-slate-100 dark:bg-[#12221b] border border-slate-300 dark:border-emerald-500/30 rounded-xl py-3 pl-10 pr-14 outline-none focus:border-emerald-500 font-mono text-slate-900 dark:text-emerald-300 placeholder:text-slate-400 dark:placeholder:text-emerald-500/40 font-bold tracking-wider"
                      required
                    />
                    {/* Visa/MC icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                      <div className="w-8 h-5 bg-[#1434CB] rounded text-white flex items-center justify-center text-[8px] font-bold italic shadow-xs">VISA</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase text-slate-700 dark:text-slate-300">
                      {language === 'RU' ? 'Срок действия' : language === 'EN' ? 'Expires' : 'Amal Qilishi'}
                    </label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      autoComplete="off"
                      value={expiry}
                      onChange={handleExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-slate-100 dark:bg-[#12221b] border border-slate-300 dark:border-emerald-500/30 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 font-mono text-slate-900 dark:text-emerald-300 placeholder:text-slate-400 dark:placeholder:text-emerald-500/40 font-bold tracking-wider"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase text-slate-700 dark:text-slate-300">
                      CVV
                    </label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-slate-100 dark:bg-[#12221b] border border-slate-300 dark:border-emerald-500/30 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 font-mono tracking-widest text-slate-900 dark:text-emerald-300 placeholder:text-slate-400 dark:placeholder:text-emerald-500/40 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg border border-emerald-500/20">
                <ShieldCheck size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                {language === 'RU'
                  ? 'Платежные данные защищены 256-битным шифрованием.'
                  : language === 'EN'
                  ? 'Payment details are protected with 256-bit encryption.'
                  : "To'lov ma'lumotlari 256-bit shifrlash orqali himoyalangan."}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full primary-button py-4 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-lg cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {language === 'RU' ? 'Оплатить' : language === 'EN' ? 'Pay' : "To'lash"} ${amount}
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
