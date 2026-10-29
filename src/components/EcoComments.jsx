import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, ThumbsUp, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import GlassCard from './GlassCard';
import VideoBackdrop from './VideoBackdrop';

const initialMockComments = [
  {
    id: 1,
    name: 'Azizbek',
    text: {
      UZ: "Juda zo'r tashabbus! Men ham 5 ta eman daraxti ekdim. Jarayon juda oson va tushunarli.",
      RU: "Отличная инициатива! Я посадил 5 саженцев дуба. Процесс очень легкий и понятный.",
      EN: "Such an inspiring initiative! I already planted 5 oak trees. The process is remarkably smooth."
    },
    time: {
      UZ: "2 soat oldin",
      RU: "2 часа назад",
      EN: "2 hours ago"
    },
    rating: 5,
    likes: 12
  },
  {
    id: 2,
    name: 'Malika',
    text: {
      UZ: "Platforma dizayni ajoyib. Karta orqali to'lov qilishda muammo bo'lmadi. Rahmat sizlarga!",
      RU: "Дизайн платформы потрясающий. Оплата картой прошла моментально. Спасибо вам!",
      EN: "Stunning platform design. Instant card processing without any friction. Thank you!"
    },
    time: {
      UZ: "5 soat oldin",
      RU: "5 часов назад",
      EN: "5 hours ago"
    },
    rating: 5,
    likes: 8
  },
  {
    id: 3,
    name: 'Olimjon',
    text: {
      UZ: "Tabiat uchun ajoyib loyiha. Tez orada kompaniyamiz nomidan ham qatnashamiz.",
      RU: "Замечательный проект для планеты. Скоро подключимся от имени нашей компании.",
      EN: "A wonderful project for nature. We will be participating on behalf of our company soon."
    },
    time: {
      UZ: "1 kun oldin",
      RU: "1 день назад",
      EN: "1 day ago"
    },
    rating: 4,
    likes: 24
  }
];

const EcoComments = () => {
  const { language, t, tText } = useLanguage();
  const [userComments, setUserComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ecopulse_user_comments')) || [];
    } catch {
      return [];
    }
  });
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(5);
  const [likedIds, setLikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ecopulse_liked_comments')) || {};
    } catch {
      return {};
    }
  });

  const handleLike = (id) => {
    setLikedIds(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('ecopulse_liked_comments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const comment = {
      id: Date.now(),
      name: newName.trim(),
      text: newComment.trim(),
      time: t('comments', 'now') || 'Hozirgina',
      rating: selectedStar,
      likes: 0
    };

    const updated = [comment, ...userComments];
    setUserComments(updated);
    try {
      localStorage.setItem('ecopulse_user_comments', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNewComment('');
    setNewName('');
    setSelectedStar(5);
  };

  const allComments = [
    ...userComments,
    ...initialMockComments.map(c => ({
      ...c,
      displayComment: typeof c.text === 'object' ? tText(c.text) : c.text,
      displayTime: typeof c.time === 'object' ? tText(c.time) : c.time,
      currentLikes: c.likes + (likedIds[c.id] ? 1 : 0)
    }))
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-transparent text-bone">
      {/* Dynamic Looping Video Background */}
      <VideoBackdrop 
        src="/videos/aurora.mp4" 
        poster="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=75&w=1080" 
        opacity={0.2} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border border-signal/20 bg-signal/10 text-signal font-mono text-xs"
          >
            <MessageSquare size={13} />
            <span>Community Voice</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-display font-light text-slate-900 dark:text-bone tracking-tight mb-3"
          >
            {t('comments', 'title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-sm text-slate-600 dark:text-mist max-w-xl mx-auto font-normal font-sans"
          >
            {t('comments', 'subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Comments List */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence>
              {allComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <GlassCard tone="base" className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-800 dark:text-bone font-mono text-xs font-semibold">
                          {comment.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-slate-900 dark:text-bone font-medium text-sm font-sans">{comment.name}</h4>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-mist/60">
                            {comment.displayTime || comment.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < comment.rating ? "fill-ember text-ember" : "fill-transparent text-slate-300 dark:text-mist/30"} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-slate-700 dark:text-bone/85 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                      {comment.displayComment || comment.text}
                    </p>
                    
                    <div className="flex items-center gap-4 border-t border-slate-200 dark:border-white/[0.06] pt-3">
                      <button 
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
                          likedIds[comment.id] 
                            ? 'text-emerald-700 dark:text-signal font-semibold' 
                            : 'text-slate-500 hover:text-emerald-600 dark:text-mist dark:hover:text-signal'
                        }`}
                      >
                        <ThumbsUp size={13} className={likedIds[comment.id] ? "fill-signal" : ""} /> 
                        <span className="tabular-nums">{comment.currentLikes !== undefined ? comment.currentLikes : comment.likes}</span>
                      </button>
                      <button 
                        onClick={() => {
                          setNewComment(`@${comment.name} `);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-900 dark:text-mist dark:hover:text-bone transition-colors font-sans"
                      >
                        {t('comments', 'reply')}
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Leave a Comment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 sticky top-24"
          >
            <GlassCard tone="raised" className="p-6">
              <h3 className="text-xl font-display font-light text-slate-900 dark:text-bone mb-6">
                {t('comments', 'leave_comment')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setSelectedStar(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={20} 
                          className={`transition-all ${star <= (hoveredStar || selectedStar) ? "fill-ember text-ember scale-105" : "text-slate-300 dark:text-mist/30 hover:text-slate-500 dark:hover:text-mist/60"}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-mist" size={16} />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t('comments', 'name')}
                    className="w-full bg-white dark:bg-moss/40 border border-slate-300 dark:border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-bone placeholder:text-slate-400 dark:placeholder:text-mist/50 outline-none focus:border-emerald-500 dark:focus:border-signal/40 transition-all font-sans"
                  />
                </div>

                <div className="relative">
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('comments', 'comment')}
                    rows="4"
                    className="w-full bg-white dark:bg-moss/40 border border-slate-300 dark:border-white/[0.08] rounded-xl p-3 text-xs text-slate-900 dark:text-bone placeholder:text-slate-400 dark:placeholder:text-mist/50 outline-none focus:border-emerald-500 dark:focus:border-signal/40 transition-all resize-none font-sans"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-signal dark:text-ink dark:hover:bg-signal/90 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  {t('comments', 'send')} <Send size={14} />
                </button>
              </form>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default EcoComments;
