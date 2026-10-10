import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Heart, Share2, ArrowRight } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CountUp from './CountUp';

const mockProjects = [
  {
    id: 1,
    title: 'Sahroi Kabir va Orol dengizini Ko\'kalamzorlashtirish',
    category: 'Qayta tiklanuvchi',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    image2: 'https://karakalpakstan.travel/data/uploads/00_media/2026/lyuna/1.jpg',
    desc: 'Cho\'llashishga qarshi kurashish uchun yirik quyosh panellari va Orolbo\'yida saksovullar ekish loyihasi.',
    target: 500000,
    funded: 345000,
    votes: 12500
  },
  {
    id: 2,
    title: 'Okean Plastik tozalash tarmog\'i',
    category: 'Okean',
    image: 'https://uz24.uz/uploads/image/669ea75f1504b326e37d132fec021ee8/large.jpg',
    desc: 'Tinch okeanidagi ulkan plastik chiqindilar orolini avtonom dronlar va kemalar yordamida tozalash mega-loyihasi.',
    target: 2000000,
    funded: 1850000,
    votes: 45200
  },
  {
    id: 3,
    title: 'Aqlli Yashil Shahar',
    category: 'Infratuzilma',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgfe_rYrHm7Av8jb87XFnPL5vU9o_yg9CdnNjKxzajHaXGo8g4zhft1MQ&s=10',
    desc: '100% qayta tiklanuvchi energiya, nol-emissiya transport tizimiga ega futuristik eko-shaharcha qurish.',
    target: 10000000,
    funded: 4500000,
    votes: 8900
  },
  {
    id: 4,
    title: 'Amazonka O\'rmonlarini Qutqarish',
    category: 'O\'rmonlar',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
    desc: 'Noqonuniy daraxt kesishni to\'xtatish va yong\'inlardan zarar ko\'rgan hududlarda 1 million tup yangi daraxt ekish.',
    target: 800000,
    funded: 780000,
    votes: 32000
  },
  {
    id: 5,
    title: 'Shamol Turbinalari Parki',
    category: 'Energiya',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    desc: 'Dengiz qirg\'og\'ida 50 MVt quvvatga ega ulkan shamol turbinalarini o\'rnatish orqali 100,000 xonadonni yoritish.',
    target: 5000000,
    funded: 1200000,
    votes: 5600
  },
  {
    id: 6,
    title: 'Sun\'iy Go\'sht Laboratoriyasi',
    category: 'Oziq-ovqat',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    desc: 'Chorvachilikning CO2 emissiyasini qisqartirish uchun o\'simlik hujayralaridan yuqori sifatli eko-go\'sht ishlab chiqarish.',
    target: 1500000,
    funded: 1500000,
    votes: 21000
  },
  {
    id: 7,
    title: 'Maktablar uchun Quyosh Panellari',
    category: 'Energiya',
    image: 'https://images.unsplash.com/photo-1509391366360-128c7c9e030b?auto=format&fit=crop&q=80&w=800',
    desc: 'Qishloq hududlaridagi maktablarni 100% qayta tiklanuvchi energiya bilan ta\'minlash dasturi.',
    target: 250000,
    funded: 125000,
    votes: 8400
  },
  {
    id: 8,
    title: 'Yovvoyi Tabiat Qo\'riqchi Dronlari',
    category: 'O\'rmonlar',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800',
    desc: 'Brakonyerlikka qarshi kurashish va yovvoyi hayvonlar migratsiyasini kuzatish uchun sun\'iy intellektli dronlar tizimi.',
    target: 400000,
    funded: 310000,
    votes: 14200
  },
  {
    id: 9,
    title: 'Aqlli Tomchilatib Sug\'orish',
    category: 'Infratuzilma',
    image: 'https://ecdn6.globalso.com/upload/p/1685/image_product/2024-09/irr-1.jpg',
    desc: 'Suv resurslarini 70% gacha tejash imkonini beruvchi sensorli tomchilatib sug\'orish texnologiyalarini joriy etish.',
    target: 600000,
    funded: 450000,
    votes: 9500
  },
  {
    id: 10,
    title: 'Eko-Skuterlar Tarmog\'i',
    category: 'Infratuzilma',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    desc: 'Shaharlar havosini tozalash uchun qulay va arzon elektr skuterlar ijarasi tizimini yo\'lga qo\'yish.',
    target: 850000,
    funded: 220000,
    votes: 16700
  },
  {
    id: 11,
    title: 'Tez Chiriydigan Bio-Plastik',
    category: 'Qayta tiklanuvchi',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=800',
    desc: 'Oziq-ovqat chiqindilaridan 30 kunda to\'liq chiriydigan yangi avlod bio-plastik idishlar ishlab chiqarish.',
    target: 1200000,
    funded: 980000,
    votes: 27500
  },
  {
    id: 12,
    title: 'Sanoat Chiqindilarini Qayta ishlash',
    category: 'Qayta tiklanuvchi',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    desc: 'Zaharli sanoat chiqindilarini xavfsiz neytrallash va ulardan qurilish materiallari olish mega-zavodi.',
    target: 3000000,
    funded: 3000000,
    votes: 41000
  }
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
  const { t } = useLanguage();
  const [projects, setProjects] = useState(mockProjects);
  const [filter, setFilter] = useState('All');
  
  // Payment Modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const categories = ['All', ...new Set(mockProjects.map(p => p.category))];
  
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  const handleVote = (id) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        return { ...p, votes: p.votes + 1 };
      }
      return p;
    }));
  };

  const handleOpenPayment = (project) => {
    setSelectedProject(project);
    setIsPaymentOpen(true);
  };

  const handleFundSuccess = (id, amount) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        return { ...p, funded: p.funded + amount };
      }
      return p;
    }));
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
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden backdrop-blur-md border ${
                    filter === cat 
                      ? 'text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  {filter === cat && (
                    <motion.div 
                      layoutId="filterActive"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {cat}
                </button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const progress = (project.funded / project.target) * 100;
              const isCompleted = progress >= 100;

              return (
                <motion.div 
                  key={project.id} 
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-white/40 dark:bg-[rgba(13,15,18,0.4)] backdrop-blur-[12px] border border-black/5 dark:border-[rgba(255,255,255,0.1)] hover:border-emerald-500/40 hover:bg-white/60 dark:hover:bg-[rgba(13,15,18,0.6)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.25)]"
                >
                  {/* Image Section */}
                  <div className="relative h-60 overflow-hidden group/img shrink-0">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                    
                    {/* Soft gradient from image to text area */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-[rgba(13,15,18,0.95)] to-transparent z-10 pointer-events-none opacity-80 dark:opacity-100"></div>

                    {project.image2 ? (
                      <>
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 group-hover:opacity-0 transition-all duration-1000 z-0"
                        />
                        <img 
                          src={project.image2} 
                          alt={project.title} 
                          className="absolute inset-0 w-full h-full object-cover transform scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-1000 z-0"
                        />
                      </>
                    ) : (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold rounded-full text-emerald-600 dark:text-emerald-400 shadow-lg">
                        {project.category}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30 animate-pulse">
                          Funded 100%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-3 line-clamp-1 text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{project.title}</h3>
                    <p className="text-sm opacity-70 mb-6 line-clamp-2 flex-1">{project.desc}</p>
                    
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
                            ? 'bg-black/5 dark:bg-white/5 opacity-50 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                        }`}
                        disabled={isCompleted}
                      >
                        {isCompleted ? 'Yopilgan' : t('projects', 'fund')}
                        {!isCompleted && <ArrowRight size={16} />}
                      </button>
                      <button 
                        onClick={() => handleVote(project.id)}
                        className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent flex items-center gap-2 group/vote transition-all"
                        title="Ovoz berish"
                      >
                        <Heart size={18} className="group-hover/vote:fill-rose-500 transition-all" /> 
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          <CountUp value={project.votes} duration={1} />
                        </span>
                      </button>
                      <button className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 border border-transparent transition-all">
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
