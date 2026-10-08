import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendTelegramMessage } from '../utils/telegram';

const EcoAIChat = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    { id: 'initial', text: t('chat', 'greeting'), isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('uglerod') || text.includes('carbon')) {
      return "Uglerod izini kamaytirish uchun quyidagilarni qiling: 1) Jamoat transportidan foydalaning. 2) Uyda energiya tejamkor lampalar o'rnating. 3) Go'sht iste'molini kamaytiring.";
    } else if (text.includes('toza') || text.includes('havo')) {
      return "Hozirgi vaqtda Singapur va London eng toza havo (AQI) ko'rsatkichlariga ega shahar deb topilgan. Bizning Dashboard sahifamizdan to'liq reytingni ko'rishingiz mumkin.";
    } else if (text.includes('energiya')) {
      return "Yashil energiya quyosh, shamol va suv orqali olinadi. U atmosferaga umuman CO2 ajratmaydi va to'liq qayta tiklanuvchidir.";
    }
    return "Juda ajoyib savol! Afsuski, hozir faqat demo rejimida ishlayapman. Ekologiya haqidagi boshqa ma'lumotlarni bizning platformadan o'qishingiz mumkin.";
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    const newMsgId = `msg-${messages.length + 1}`;
    const newMsg = { id: newMsgId, text, isUser: true };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Send to Telegram bot
    sendTelegramMessage(`🤖 <b>Eco-AI Chat:</b> Yozishdi:\n\n<i>"${text}"</i>`);

    // Mock AI Delay
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg = { id: `ai-${newMsgId}`, text: responseText, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const quickReplies = [
    t('chat', 'quick_reply_1'),
    t('chat', 'quick_reply_2'),
    t('chat', 'quick_reply_3')
  ];

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
            className="fixed bottom-24 lg:bottom-10 right-4 sm:right-6 sm:w-[420px] w-[calc(100vw-2rem)] h-[650px] max-h-[75vh] lg:max-h-[80vh] premium-glass-deep rounded-3xl flex flex-col z-50 overflow-hidden border border-emerald-500/20 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.3)]"
          >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/90 to-cyan-600/90 p-5 flex items-center justify-between text-white border-b border-white/20 relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-inner">
                <Bot size={26} className="text-white drop-shadow-md" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#009b83] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-1.5 tracking-wide">
                Eco-AI <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              </h3>
              <p className="text-[11px] font-medium opacity-80 uppercase tracking-widest mt-0.5">Yashil Assistent</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="hover:bg-white/20 p-2 rounded-xl transition-colors relative z-10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-5 overflow-y-auto bg-transparent custom-scrollbar scroll-smooth flex flex-col gap-5 relative z-10">
          
          <div className="text-center text-[10px] opacity-40 font-bold mb-2 uppercase tracking-widest text-slate-800 dark:text-white">
            Bugun
          </div>

          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${msg.isUser ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.isUser 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-tr-sm shadow-emerald-500/20' 
                    : 'bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/5 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] opacity-40 mt-1.5 px-1 font-medium">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start flex items-center gap-1.5 p-4 rounded-2xl rounded-tl-sm bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/5 backdrop-blur-md w-20 shadow-sm"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {!isTyping && messages.length < 3 && (
          <div className="px-5 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-sm flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar border-t border-black/5 dark:border-white/5 z-10 relative">
            {quickReplies.map((reply, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(reply)}
                className="whitespace-nowrap px-4 py-2 bg-white/40 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-transparent transition-all shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-t border-white/40 dark:border-white/10 z-10 relative rounded-b-3xl">
          <div className="relative flex items-center">
            <button className="absolute left-3 text-slate-400 hover:text-emerald-500 transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat', 'placeholder')}
              className="w-full bg-white/60 dark:bg-black/40 border border-transparent focus:border-emerald-500/50 rounded-2xl py-3.5 pl-11 pr-14 outline-none text-sm transition-all shadow-inner text-slate-800 dark:text-white"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500 shadow-md shadow-emerald-500/30"
            >
              <Send size={18} className="transform translate-x-[1px] translate-y-[1px]" />
            </button>
          </div>
        </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcoAIChat;
