import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ChatAssistant = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiMsg = { 
        text: "Tabiatni asrash uchun kundalik odatlarimizni biroz o'zgartirish kifoya. Masalan, velosipeddan ko'proq foydalanish yoki daraxt ekish katta yordam beradi.", 
        isUser: false 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-eco-primary text-white shadow-lg shadow-eco-primary/40 hover:scale-110 transition-transform z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[400px] glass-panel flex flex-col z-50 animate-fade-in overflow-hidden border border-eco-primary/30 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-eco-primary to-cyan-500 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">Eco-AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/5 dark:bg-black/10">
            <div className="bg-white/80 dark:bg-black/40 p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm">
              {t('chat', 'greeting')}
            </div>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg text-sm max-w-[85%] ${
                  msg.isUser 
                    ? 'bg-eco-primary text-white ml-auto rounded-tr-none' 
                    : 'bg-white/80 dark:bg-black/40 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat', 'placeholder')}
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />
            <button onClick={handleSend} className="p-2 text-eco-primary hover:bg-eco-primary/10 rounded-full transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
