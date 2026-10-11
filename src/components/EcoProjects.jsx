import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Share2, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CountUp from './CountUp';

const mockProjects = [
  {
    id: 1,
    title: {
      UZ: "Sahroi Kabir va Orol dengizini Ko'kalamzorlashtirish",
      RU: "Озеленение пустыни Сахара и Аральского моря",
      EN: "Afforestation of Sahara and Aral Sea Basin"
    },
    categoryKey: 'cat_renewable',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    image2: 'https://karakalpakstan.travel/data/uploads/00_media/2026/lyuna/1.jpg',
    desc: {
      UZ: "Cho'llashishga qarshi kurashish uchun yirik quyosh panellari va Orolbo'yida saksovullar ekish loyihasi.",
      RU: "Проект по борьбе с опустыниванием: установка солнечных панелей и посадка саксаула в Приаралье.",
      EN: "Mega initiative deploying solar panels and planting saxaul forests to combat desertification."
    },
    target: 500000,
    funded: 345000,
    votes: 12500
  },
  {
    id: 2,
    title: {
      UZ: "Okean Plastik tozalash tarmog'i",
      RU: "Очистка мирового океана от пластика",
      EN: "Ocean Plastic Cleanup Grid"
    },
    categoryKey: 'cat_ocean',
    image: 'https://uz24.uz/uploads/image/669ea75f1504b326e37d132fec021ee8/large.jpg',
    desc: {
      UZ: "Tinch okeanidagi ulkan plastik chiqindilar orolini avtonom dronlar va kemalar yordamida tozalash.",
      RU: "Очистка тихоокеанского мусорного пятна с помощью флота автономных экологических дронов.",
      EN: "Cleaning the Great Pacific garbage patch using automated cleanup vessels and AI drones."
    },
    target: 2000000,
    funded: 1850000,
    votes: 45200
  },
  {
    id: 3,
    title: {
      UZ: "Aqlli Yashil Shahar",
      RU: "Умный Эко-Город Будущего",
      EN: "Smart Eco City Infrastructure"
    },
    categoryKey: 'cat_infrastructure',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgfe_rYrHm7Av8jb87XFnPL5vU9o_yg9CdnNjKxzajHaXGo8g4zhft1MQ&s=10',
    desc: {
      UZ: "100% qayta tiklanuvchi energiya, nol-emissiya transport tizimiga ega futuristik eko-shaharcha.",
      RU: "Футуристический эко-город со 100% возобновляемой энергией и нулевым уровнем вредных выбросов.",
      EN: "Futuristic sustainable eco-city powered by 100% renewable power and zero-emission transit."
    },
    target: 10000000,
    funded: 4500000,
    votes: 8900
  },
  {
    id: 4,
    title: {
      UZ: "Amazonka O'rmonlarini Qutqarish",
      RU: "Спасение лесов Амазонки",
      EN: "Amazon Rainforest Protection"
    },
    categoryKey: 'cat_forests',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
    desc: {
      UZ: "Noqonuniy daraxt kesishni to'xtatish va yong'inlardan zarar ko'rgan hududlarda 1 million tup daraxt ekish.",
      RU: "Предотвращение незаконных вырубок и высадка 1 миллиона деревьев в пострадавших от пожаров зонах.",
      EN: "Halting illegal logging and planting 1 million native trees in fire-impacted jungle reserves."
    },
    target: 800000,
    funded: 780000,
    votes: 32000
  },
  {
    id: 5,
    title: {
      UZ: "Shamol Turbinalari Parki",
      RU: "Парк Ветровых Турбин",
      EN: "Offshore Wind Turbine Farm"
    },
    categoryKey: 'cat_energy',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    desc: {
      UZ: "Dengiz qirg'og'ida 50 MVt quvvatga ega shamol turbinalarini o'rnatish orqali 100,000 xonadonni yoritish.",
      RU: "Установка морских ветровых турбин мощностью 50 МВт для снабжения электричеством 100 000 домов.",
      EN: "Deploying 50MW offshore wind turbines supplying clean electricity to over 100,000 homes."
    },
    target: 5000000,
    funded: 1200000,
    votes: 5600
  },
  {
    id: 6,
    title: {
      UZ: "Sun'iy Go'sht Laboratoriyasi",
      RU: "Лаборатория Альтернативного Белка",
      EN: "Cultivated Clean Protein Lab"
    },
    categoryKey: 'cat_food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    desc: {
      UZ: "Chorvachilikning CO2 emissiyasini qisqartirish uchun o'simlik hujayralaridan yuqori sifatli eko-go'sht ishlab chiqarish.",
      RU: "Производство экологичного белка из растительных клеток для сокращения вредных выбросов животноводства.",
      EN: "Producing next-gen cultivated clean protein to substantially reduce agricultural emissions."
    },
    target: 1500000,
    funded: 1500000,
    votes: 21000
  }
];

const categoryKeys = [
  'all',
  'cat_renewable',
  'cat_ocean',
  'cat_infrastructure',
  'cat_forests',
  'cat_energy',
  'cat_food'
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const EcoProjects = () => {
  const { t, tText } = useLanguage();
  const [projects, setProjects] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ecopulse_projects'));
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return mockProjects.map(mp => {
          const found = saved.find(s => s.id === mp.id);
          return found ? { ...mp, votes: found.votes, funded: found.funded } : mp;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return mockProjects;
  });

  const [userVotedIds, setUserVotedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ecopulse_user_votes')) || {};
    } catch {
      return {};
    }
  });

  const [selectedFilterKey, setSelectedFilterKey] = useState('all');
  
  // Payment Modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const filteredProjects = selectedFilterKey === 'all' 
    ? projects 
    : projects.filter(p => p.categoryKey === selectedFilterKey);

  const handleVote = (id) => {
    const isVoted = !!userVotedIds[id];
    const newVoted = { ...userVotedIds, [id]: !isVoted };
    setUserVotedIds(newVoted);
    try {
      localStorage.setItem('ecopulse_user_votes', JSON.stringify(newVoted));
    } catch (e) {
      console.error(e);
    }

    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, votes: isVoted ? Math.max(0, p.votes - 1) : p.votes + 1 };
      }
      return p;
    });
    setProjects(updated);
    try {
      localStorage.setItem('ecopulse_projects', JSON.stringify(updated.map(p => ({ id: p.id, votes: p.votes, funded: p.funded }))));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenPayment = (project) => {
    setSelectedProject({
      ...project,
      title: tText(project.title)
    });
    setIsPaymentOpen(true);
  };

  const handleFundSuccess = (id, amount) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, funded: p.funded + amount };
      }
      return p;
    });
    setProjects(updated);
    try {
      localStorage.setItem('ecopulse_projects', JSON.stringify(updated.map(p => ({ id: p.id, votes: p.votes, funded: p.funded }))));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Deep Antigravity Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden fixed bg-eco-light dark:bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_#07101a_70%)] transition-colors duration-700">
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
          className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(16,185,129,0.08)_0%,_transparent_70%)] rounded-full pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
          className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(6,182,212,0.08)_0%,_transparent_70%)] rounded-full pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 tracking-tight leading-[1.5] py-2">
            {t('projects', 'title')}
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto font-medium mb-10">
            {t('projects', 'subtitle')}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <AnimatePresence>
              {categoryKeys.map((catKey) => {
                const isSelected = selectedFilterKey === catKey;
                const label = t('projects', catKey);
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedFilterKey(catKey)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden backdrop-blur-md border ${
                      isSelected 
                        ? 'text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="filterActive"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 -z-10 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const progress = (project.funded / project.target) * 100;
              const isCompleted = progress >= 100;
              const displayTitle = tText(project.title);
              const displayDesc = tText(project.desc);
              const categoryLabel = t('projects', project.categoryKey);

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="premium-glass overflow-hidden flex flex-col group border border-black/5 dark:border-white/10 rounded-3xl hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
                >
                  {/* Image Section */}
                  <div className="relative h-60 overflow-hidden bg-black/20">
                    <img 
                      src={project.image} 
                      alt={displayTitle} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold rounded-full text-emerald-600 dark:text-emerald-400 shadow-lg">
                        {categoryLabel}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30 animate-pulse">
                          100% {t('projects', 'funded')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-3 line-clamp-1 text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="text-sm opacity-70 mb-6 line-clamp-2 flex-1">
                      {displayDesc}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6 shrink-0">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-emerald-500">
                          $<CountUp value={project.funded} duration={1.5} /> {t('projects', 'funded')}
                        </span>
                        <span className="opacity-60">{t('projects', 'target')} ${project.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, progress)}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          className={`h-full rounded-full relative ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-5 border-t border-black/5 dark:border-white/5 shrink-0">
                      <button 
                        onClick={() => handleOpenPayment(project)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex justify-center items-center gap-2 ${
                          isCompleted 
                            ? 'bg-black/5 dark:bg-white/5 opacity-50 cursor-not-allowed text-slate-400' 
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                        }`}
                        disabled={isCompleted}
                      >
                        {isCompleted ? t('projects', 'completed') : t('projects', 'fund')}
                        {!isCompleted && <ArrowRight size={16} />}
                      </button>
                      <button 
                        onClick={() => handleVote(project.id)}
                        className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent flex items-center gap-2 group/vote transition-all"
                        title={t('projects', 'vote')}
                      >
                        <Heart size={18} className={`${userVotedIds[project.id] ? 'fill-rose-500 text-rose-500' : ''} group-hover/vote:fill-rose-500 transition-all`} /> 
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          <CountUp value={project.votes} duration={1} />
                        </span>
                      </button>
                      <button 
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: displayTitle, text: displayDesc, url: window.location.href });
                          }
                        }}
                        className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 border border-transparent transition-all"
                        aria-label="Share"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        project={selectedProject}
        onFund={handleFundSuccess}
      />
    </div>
  );
};

export default EcoProjects;
