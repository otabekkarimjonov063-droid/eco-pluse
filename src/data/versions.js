export const VERSIONS_HISTORY = [
  {
    version: 'v3.0',
    date: '2026-11-01',
    status: 'upcoming', // 'active' | 'available' | 'upcoming'
    badge: {
      UZ: 'Katta Reliz • Tez Kunda',
      RU: 'Крупный Релиз • Скоро',
      EN: 'Major Release • Coming Soon'
    },
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    title: {
      UZ: "Global Ekologik Megaplatforma & Uglerod Birjasi",
      RU: "Глобальная Экологическая Мегаплатформа & Углеродная Биржа",
      EN: "Global Ecological Megaplatform & Carbon Credit Exchange"
    },
    description: {
      UZ: "Korporativ yashil sertifikatlar, blokcheyn orqali daraxt ekish verifikatsiyasi va global ekologik reyting.",
      RU: "Корпоративные зелёные сертификаты, верификация посадки деревьев через блокчейн и глобальный эко-рейтинг.",
      EN: "Corporate green certificates, blockchain-verified tree planting, and global ecological ranking."
    },
    features: [
      {
        tag: 'Yashil Birja',
        text: {
          UZ: "Kompaniyalar uchun avtomatlashtirilgan CO2 kompensatsiya birjasi",
          RU: "Автоматизированная биржа компенсации CO2 для компаний",
          EN: "Automated carbon offset exchange for corporations"
        }
      },
      {
        tag: '3D Virtual O\'rmon',
        text: {
          UZ: "Foydalanuvchilar o'z ekilgan daraxtlarini virtual 3D o'rmonda kuzatishi",
          RU: "Виртуальный 3D лес для отслеживания посаженных деревьев",
          EN: "Virtual 3D forest simulation to track all planted trees"
        }
      },
      {
        tag: 'Eko Hamyon',
        text: {
          UZ: "Eko-ballarni yig'ish va hamkor do'konlarda chegirmalarga almashtirish",
          RU: "Накопление эко-баллов и скидки у партнёров",
          EN: "Earn eco-tokens and redeem discounts at eco-friendly partners"
        }
      }
    ]
  },
  {
    version: 'v2.8',
    date: '2026-10-24',
    status: 'available',
    badge: {
      UZ: 'Yangi Imkoniyat',
      RU: 'Новые Возможности',
      EN: 'New Features'
    },
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    title: {
      UZ: "EcoPulse AI Assistant 2.0 & Jonli Dinamik Yangilanish",
      RU: "EcoPulse AI Ассистент 2.0 & Центр Динамических Обновлений",
      EN: "EcoPulse AI Assistant 2.0 & Live Dynamic Updates"
    },
    description: {
      UZ: "Platforma versiyalarini real vaqtda yangilash markazi va aqlli ekologik AI yordamchisi kengaytirildi.",
      RU: "Центр обновлений платформы в реальном времени и расширенный AI ассистент.",
      EN: "Real-time platform update center and expanded intelligent ecological AI assistant."
    },
    features: [
      {
        tag: 'Yangilanish Markazi',
        text: {
          UZ: "Versiya yangilanishlarini jonli tekshirish, avto-update va interaktiv changelog",
          RU: "Центр проверки обновлений, авто-апдейт и интерактивный чейнджлог",
          EN: "Live update checker, auto-update cycles, and interactive changelog"
        }
      },
      {
        tag: 'AI Eko-Tahlil',
        text: {
          UZ: "Toshkent va 20+ jahon shaharlari uchun jonli AQI tavsiyalari va xavf ogohlantirishlari",
          RU: "Живые рекомендации AQI для 20+ городов и оповещения об эко-рисках",
          EN: "Live AQI advice and environmental risk alerts for 20+ cities"
        }
      },
      {
        tag: 'Mobil Qulaylik',
        text: {
          UZ: "Smartfonlar uchun soddalashtirilgan teginish boshqaruvi va sensorlar paneli",
          RU: "Оптимизация под мобильные экраны и сенсорная панель",
          EN: "Streamlined mobile touch controls and ambient sensor bar"
        }
      }
    ]
  },
  {
    version: 'v2.7',
    date: '2026-10-24',
    status: 'active',
    badge: {
      UZ: 'Joriy • 60 FPS Engine',
      RU: 'Текущая • 60 FPS Engine',
      EN: 'Current • 60 FPS Engine'
    },
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    title: {
      UZ: "Ultra 60FPS Dvigateli & WebGL GPU Optimizatsiyasi",
      RU: "Движок Ultra 60FPS & WebGL Оптимизация",
      EN: "Ultra 60FPS Engine & WebGL GPU Optimization"
    },
    description: {
      UZ: "Web sayt qotishi to'liq bartaraf etildi. GPU vertex shaderlari, yuqori kontrastli matn va avtomatik resurs boshqaruvi joriy qilindi.",
      RU: "Полностью устранены зависания. Внедрены GPU vertex-шейдеры, высокая контрастность текста и автоматический менеджмент ресурсов.",
      EN: "Complete elimination of stuttering. Hardware-accelerated GPU vertex shaders, ultra-high contrast typography, and smart resource management."
    },
    features: [
      {
        tag: '60 FPS WebGL',
        text: {
          UZ: "Silliq 3D Globus (IntersectionObserver bilan avto-pauza va nol ortiqcha yuk)",
          RU: "Плавный 3D Глобус (авто-пауза через IntersectionObserver и ноль нагрузки)",
          EN: "Buttery smooth 3D Globe with auto-pause and zero offscreen overhead"
        }
      },
      {
        tag: 'Yuqori Kontrast',
        text: {
          UZ: "O'qilishi oson bo'lgan yuqori kontrastli yorqin matnlar va toza fonlar",
          RU: "Высококонтрастные шрифты и чистые премиум фоны",
          EN: "Crystal-clear high-contrast typography and clean backgrounds"
        }
      },
      {
        tag: '70% Xotira Tejami',
        text: {
          UZ: "Ortiqcha video va mato chaqiruvlari optimallashtirildi",
          RU: "Оптимизация рендера и 70% экономии памяти",
          EN: "Overdraw eliminated with 70% less memory consumption"
        }
      }
    ]
  },
  {
    version: 'v2.6',
    date: '2026-10-18',
    status: 'previous',
    badge: {
      UZ: 'Boshlang\'ich Bazaviy',
      RU: 'Базовый Релиз',
      EN: 'Base Release'
    },
    badgeColor: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    title: {
      UZ: "Antigravity Dizayn & Eko-Monitoring Integratsiyasi",
      RU: "Редизайн Antigravity & Интеграция Эко-Мониторинга",
      EN: "Antigravity Design & Eco-Monitoring Integration"
    },
    description: {
      UZ: "Yangi premium qorong'u interfeys, Glassmorphism komponentlar tizimi va jonli ob-havo vidjeti.",
      RU: "Новый премиальный интерфейс, система компонентов Glassmorphism и живой погодный виджет.",
      EN: "Brand new premium dark interface, Glassmorphism design system, and live weather widget."
    },
    features: [
      {
        tag: 'Dizayn',
        text: {
          UZ: "Fraunces va Figtree yozuv uslublari, GlassCard tizimi",
          RU: "Шрифты Fraunces и Figtree, система GlassCard",
          EN: "Fraunces and Figtree typography, GlassCard system"
        }
      },
      {
        tag: 'Navigatsiya',
        text: {
          UZ: "Sidebar boshqaruv paneli va tezkor sahifa almashinuvi",
          RU: "Панель управления Sidebar и быстрое переключение",
          EN: "Sidebar controls dock and rapid tab navigation"
        }
      }
    ]
  }
];
