import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, ThumbsUp, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const EcoComments = () => {
  const { language } = useLanguage();
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Azizbek',
      text: 'Juda zo\'r tashabbus! Men ham 5 ta eman daraxti ekdim. Jarayon juda oson va tushunarli.',
      time: '2 soat oldin',
      rating: 5,
      likes: 12
    },
    {
      id: 2,
      name: 'Malika',
      text: 'Platforma dizayni ajoyib. Karta orqali to\'lov qilishda muammo bo\'lmadi. Rahmat sizlarga!',
      time: '5 soat oldin',
      rating: 5,
      likes: 8
    },
    {
      id: 3,
      name: 'Olimjon',
      text: 'Tabiat uchun ajoyib loyiha. Tez orada kompaniyamiz nomidan ham qatnashamiz.',
      time: '1 kun oldin',
      rating: 4,
      likes: 24
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(5);

  const tLocal = (key) => {
    const dict = {
      UZ: { title: 'Fikr va Mulohazalar', subtitle: 'Foydalanuvchilarimizning loyiha haqidagi fikrlari', name: 'Ismingiz', comment: 'Fikringizni yozing...', send: 'Yuborish' },
      RU: { title: 'Отзывы и комментарии', subtitle: 'Что думают наши пользователи о проекте', name: 'Ваше имя', comment: 'Напишите свой отзыв...', send: 'Отправить' },
      EN: { title: 'Reviews & Comments', subtitle: 'What our users think about the project', name: 'Your name', comment: 'Write your feedback...', send: 'Send' }
    };
    return dict[language]?.[key] || dict['EN'][key];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const comment = {
      id: Date.now(),
      name: newName,
      text: newComment,
      time: 'Hozir',
      rating: selectedStar,
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setNewName('');
    setSelectedStar(5);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-eco-light dark:bg-[#0A0F16] transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20"
          >
            <MessageSquare size={32} className="text-emerald-500 dark:text-emerald-400" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight mb-4"
          >
            {tLocal('title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            {tLocal('subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Comments List */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors shadow-lg dark:shadow-none group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {comment.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg">{comment.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{comment.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < comment.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-300 text-slate-300 dark:fill-slate-800 dark:text-slate-800"} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-6">
                    {comment.text}
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-slate-200 dark:border-white/5 pt-4">
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-400">
                      <ThumbsUp size={16} /> {comment.likes}
                    </button>
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                      Javob berish
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Leave a Comment Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 sticky top-24"
          >
            <div className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 relative z-10 flex items-center gap-3">
                Izoh qoldirish
              </h3>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setSelectedStar(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={28} 
                          className={`transition-all ${star <= (hoveredStar || selectedStar) ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-110" : "text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500"}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={tLocal('name')}
                    className="w-full bg-slate-50 dark:bg-[#0A0F16] border border-slate-200 dark:border-white/10 rounded-xl px-12 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={tLocal('comment')}
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-[#0A0F16] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-white dark:text-[#0A0F16] rounded-xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                >
                  {tLocal('send')} <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default EcoComments;
