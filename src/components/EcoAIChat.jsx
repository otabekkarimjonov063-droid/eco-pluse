import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendTelegramMessage } from '../utils/telegram';

const EcoAIChat = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Update initial greeting message when language changes if no conversation yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [{ id: 'initial', text: t('chat', 'greeting'), isUser: false }];
      }
      return prev;
    });
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();

    if (language === 'RU') {
      if (text.includes('углерод') || text.includes('след') || text.includes('carbon')) {
        return "Чтобы сократить углеродный след: 1) Используйте общественный транспорт или велосипед. 2) Установите энергосберегающие LED лампы. 3) Сократите потребление мяса на 1-2 дня в неделю.";
      } else if (text.includes('чист') || text.includes('воздух') || text.includes('город')) {
        return "На данный момент одни из самых чистых показателей воздуха (AQI) зафиксированы в Рейкьявике, Осло и Сингапуре. Вы можете изучить данные городов в нашем разделе Global Dashboard.";
      } else if (text.includes('энерг') || text.includes('зелен')) {
        return "Зеленая энергия вырабатывается от солнца, ветра и воды. Она возобновляема, не загрязняет атмосферу выбросами CO2 и сохраняет ресурсы планеты.";
      }
      return "Спасибо за отличный экологический вопрос! Я анализирую глобальные данные по климату. Вы можете изучить наши проекты и рассчитать углеродный след в меню.";
    }

    if (language === 'EN') {
      if (text.includes('carbon') || text.includes('footprint') || text.includes('reduce')) {
        return "To reduce your carbon footprint: 1) Opt for public transit or cycling. 2) Switch to energy-efficient LED lighting. 3) Incorporate more plant-based meals weekly.";
      } else if (text.includes('clean') || text.includes('air') || text.includes('city')) {
        return "Currently, cities like Reykjavik, Zurich, and Singapore maintain top-tier Air Quality Index (AQI) scores. Explore real-time stats in our Global Dashboard.";
      } else if (text.includes('energy') || text.includes('green') || text.includes('solar')) {
        return "Green energy is harnessed from natural solar, wind, and hydro resources. It produces zero greenhouse gas emissions and is completely renewable.";
      }
      return "Thank you for asking! I am an Eco-AI assistant tracking planetary data. Feel free to explore our tree planting initiatives and carbon calculator.";
    }

    // Default UZ
    if (text.includes('uglerod') || text.includes('carbon')) {
      return "Uglerod izini kamaytirish uchun: 1) Jamoat transporti yoki velosipeddan foydalaning. 2) Uyda energiya tejamkor lampalar o'rnating. 3) Go'sht iste'molini haftasiga kamida bir kunga kamaytiring.";
    } else if (text.includes('toza') || text.includes('havo') || text.includes('shahar')) {
      return "Hozirgi vaqtda Singapur, Syurix va Oslo eng toza havo (AQI) ko'rsatkichlariga ega. Bizning Global Dashboard sahifamizdan jonli holatni kuzatishingiz mumkin.";
    } else if (text.includes('energiya') || text.includes('yashil')) {
      return "Yashil energiya quyosh, shamol va suv orqali olinadi. U atmosferaga zararli CO2 chiqindilarini ajratmaydi va to'liq qayta tiklanuvchidir.";
    }
    return "Juda ajoyib ekologik savol! Men doimiy yangilanib turuvchi Eco-AI assistentiman. Sayyoramizni asrash bo'yicha boshqa ma'lumotlarni platformamiz orqali ko'rishingiz mumkin.";
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    const newMsgId = `msg-${Date.now()}`;
    const newMsg = { id: newMsgId, text, isUser: true };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Send to Telegram bot
    sendTelegramMessage(`🤖 <b>Eco-AI Chat (${language}):</b> Yozishdi:\n\n<i>"${text}"</i>`);

    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg = { id: `ai-${Date.now()}`, text: responseText, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const quickReplies = [
    t('chat', 'quick_reply_1'),
    t('chat', 'quick_reply_2'),
    t('chat', 'quick_reply_3')
  ];

  const assistantSubtitle = language === 'RU' 
    ? 'Зеленый Ассистент' 
    : language === 'EN' 
      ? 'Green Assistant' 
      : 'Yashil Assistent';

  const todayText = language === 'RU' 
    ? 'Сегодня' 
    : language === 'EN' 
      ? 'Today' 
      : 'Bugun';

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 lg:bottom-10 right-6 p-4 rounded-[1.5rem] bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] z-40 group flex hover:-translate-y-1 transition-all"
            aria-label="Eco-AI Chat"
          >
            <MessageSquare size={26} className="group-hover:animate-pulse" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 border-2 border-white dark:border-[#07101a] rounded-full animate-pulse-fast"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Advanced Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed bottom-24 lg:bottom-10 right-4 sm:right-6 sm:w-[420px] w-[calc(100vw-2rem)] h-[650px] max-h-[75vh] lg:max-h-[80vh] premium-glass-deep rounded-3xl flex flex-col z-50 overflow-hidden border border-emerald-500/20 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.3)] bg-white/95 dark:bg-[#07101a]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/90 to-cyan-600/90 p-5 flex items-center justify-between text-white border-b border-white/20 relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-inner">
                    <Bot size={26} className="text-white drop-shadow-md" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#009b83] rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-1.5 tracking-wide">
                    Eco-AI <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                  </h3>
                  <p className="text-[11px] font-medium opacity-90 uppercase tracking-widest mt-0.5">{assistantSubtitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-xl transition-colors relative z-10 text-white"
                aria-label="Close Chat"
              >
                <X size={22} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-transparent custom-scrollbar scroll-smooth flex flex-col gap-4 relative z-10">
              <div className="text-center text-[10px] opacity-50 font-bold mb-1 uppercase tracking-widest text-slate-800 dark:text-white">
                {todayText}
              </div>

              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.isUser ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div 
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                      msg.isUser 
                        ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-tr-sm shadow-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-white/10 border border-black/5 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="self-start flex items-center gap-1.5 p-3.5 bg-slate-100 dark:bg-white/10 rounded-2xl rounded-tl-sm border border-black/5 dark:border-white/10">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-5 py-2.5 overflow-x-auto flex gap-2 no-scrollbar relative z-10 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-4 py-2 bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-sm shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-black/10 dark:border-white/10 relative z-10 bg-white dark:bg-[#07101a]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat', 'placeholder')}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:hover:bg-emerald-500 shadow-md shadow-emerald-500/30"
                  aria-label={t('chat', 'send')}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcoAIChat;
