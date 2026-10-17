import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Share2, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CountUp from './CountUp';
import GlassCard from './GlassCard';
import VideoBackdrop from './VideoBackdrop';

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
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
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
    <div className="min-h-screen pt-20 pb-20 px-6 relative overflow-hidden">
      {/* Dynamic Looping Video Background */}
      <VideoBackdrop 
        src="/videos/sunlight.mp4" 
        poster="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600" 
        opacity={0.25} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-light mb-3 text-bone tracking-tight py-1">
            {t('projects', 'title')}
          </h1>
          <p className="text-base text-mist max-w-xl mx-auto font-normal mb-8">
            {t('projects', 'subtitle')}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categoryKeys.map((catKey) => {
              const isSelected = selectedFilterKey === catKey;
              const label = t('projects', catKey);
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedFilterKey(catKey)}
                  className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
                    isSelected 
                      ? 'bg-signal text-ink border-signal font-semibold shadow-sm' 
                      : 'bg-white/[0.03] border-white/[0.08] text-mist hover:text-bone hover:border-white/20'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const progress = (project.funded / project.target) * 100;
              const isCompleted = progress >= 100;
              const displayTitle = tText(project.title);
              const displayDesc = tText(project.desc);
              const categoryLabel = t('projects', project.categoryKey);

              return (
                <GlassCard
                  tone={isCompleted ? "raised" : "base"}
                  as={motion.div}
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="overflow-hidden flex flex-col group transition-all duration-300"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src={project.image} 
                      alt={displayTitle} 
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 opacity-80 group-hover:opacity-95" 
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2.5 py-0.5 bg-moss/90 backdrop-blur-md text-[10px] font-mono text-signal rounded-md border border-signal/20">
                        {categoryLabel}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2.5 py-0.5 bg-signal text-ink text-[10px] font-mono font-semibold rounded-md">
                          100% {t('projects', 'funded')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-lg font-light mb-2 line-clamp-1 text-bone group-hover:text-signal transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-mist mb-5 line-clamp-2 leading-relaxed flex-1">
                      {displayDesc}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-5 shrink-0">
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-signal font-medium tabular-nums">
                          $<CountUp value={project.funded} duration={1.2} /> {t('projects', 'funded')}
                        </span>
                        <span className="text-mist text-[11px] tabular-nums">${project.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, progress)}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full bg-signal rounded-full"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.06] shrink-0">
                      <button 
                        onClick={() => handleOpenPayment(project)}
                        className={`flex-1 rounded-full py-2.5 px-4 text-xs font-medium transition-all flex justify-center items-center gap-1.5 cursor-pointer ${
                          isCompleted 
                            ? 'bg-white/[0.04] opacity-50 cursor-not-allowed text-mist' 
                            : 'bg-bone text-ink hover:bg-white'
                        }`}
                        disabled={isCompleted}
                      >
                        {isCompleted ? t('projects', 'completed') : t('projects', 'fund')}
                        {!isCompleted && <ArrowRight size={14} />}
                      </button>
                      <button 
                        onClick={() => handleVote(project.id)}
                        className="p-2 rounded-xl bg-white/[0.03] text-mist hover:text-rose-400 border border-white/[0.06] flex items-center gap-1.5 transition cursor-pointer"
                        title={t('projects', 'vote')}
                      >
                        <Heart size={14} className={userVotedIds[project.id] ? 'fill-rose-500 text-rose-500' : ''} /> 
                        <span className="text-xs font-mono tabular-nums">
                          <CountUp value={project.votes} duration={1} />
                        </span>
                      </button>
                      <button 
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: displayTitle, text: displayDesc, url: window.location.href });
                          }
                        }}
                        className="p-2 rounded-xl bg-white/[0.03] text-mist hover:text-bone border border-white/[0.06] transition cursor-pointer"
                        aria-label="Share"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
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
