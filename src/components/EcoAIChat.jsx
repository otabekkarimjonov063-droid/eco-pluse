import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendTelegramMessage } from '../utils/telegram';

const EcoAIChat = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ecopulse_chat_history'));
      if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    } catch (e) {
      console.error(e);
    }
    return [{ id: 'initial', text: t('chat', 'greeting'), isUser: false }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Update initial greeting message when language changes if no conversation yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1 && (!prev[0] || prev[0].id === 'initial')) {
        return [{ id: 'initial', text: t('chat', 'greeting'), isUser: false }];
      }
      return prev;
    });
  }, [language, t]);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ecopulse_chat_history', JSON.stringify(messages));
      } catch (e) {
        console.error(e);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase().trim();

    // 1. RUSSIAN RESPONSES
    if (language === 'RU') {
      if (text.match(/привет|здравствуй|добрый|хай|салют|как дела|ку/i)) {
        return "Здравствуйте! Я эко-ассистент EcoPulse 🌿 Готов помочь вам с вопросами качества воздуха, углеродного следа, посадки деревьев и экологичного образа жизни. О чем бы вы хотели узнать?";
      }
      if (text.match(/кто ты|кто вы|что умеешь|что можешь|твоя задача|твоя функция|зачем ты/i)) {
        return "Я искусственный интеллект EcoPulse. Я помогаю: 1) Узнать качество воздуха (AQI) по городам мира; 2) Рассчитать ваш личный углеродный след; 3) Посадить настоящее дерево на дне Арала или в Заамине; 4) Найти проверенные эко-советы.";
      }
      if (text.match(/дерев|посад|дуб|сосн|клен|сакур|вишн|лес|сажен/i)) {
        return "Через EcoPulse вы можете посадить реальное дерево! Доступны: Могучий Дуб (поглощает 22 кг CO2 в год), Зааминская Сосна, Осенний Клен и Цветущая Вишня. Локации: Дно Аральского моря, Заамин и Зеленое Кольцо Ташкента. Перейдите во вкладку «Посадка деревьев», и после посадки вы получите именной сертификат!";
      }
      if (text.match(/пластик|мусор|отход|переработ|сортировк|пакет|свалк/i)) {
        return "Пластик разлагается до 450 лет и отравляет мировой океан. Простые шаги: 1) Используйте тканевые шопперы; 2) Замените пластиковые бутылки многоразовой термокружкой; 3) Сдавайте пластик с маркировкой 1 (PET) и 2 (HDPE) на переработку.";
      }
      if (text.match(/вод|океан|рек|море|арал|эконом|кран/i)) {
        return "Пресная вода составляет менее 1% всей воды планеты! Выключая воду во время чистки зубов, вы сбережете до 8 литров в минуту. Проект восстановления Аральского моря — одна из главных целей нашей платформы в разделе «Проекты».";
      }
      if (text.match(/воздух|aqi|дыхан|смог|пыл|загрязнен|pm2\.5|маск/i)) {
        return "Индекс AQI (Air Quality Index): 0-50 — Отлично, 51-100 — Умеренно, 101-150 — Вредно для чувствительных людей, 151+ — Опасно. При AQI > 100 носите защитную маску и закрывайте окна. Вы можете в реальном времени проверить качество воздуха в любом городе в нашем «Global Dashboard».";
      }
      if (text.match(/углерод|след|калькулятор|рассчит|co2|выброс|тонн/i)) {
        return "Углеродный след — это суммарный объем CO2, образующийся от ваших поездок, электричества, рациона и покупок. В среднем житель вырабатывает 4-7 тонн CO2 в год. Пройдите тест в нашем «Калькуляторе» за 1 минуту, чтобы узнать свой результат и получить персональные советы!";
      }
      if (text.match(/солнечн|энерг|ветер|панел|зелен.*энерг|электричеств/i)) {
        return "Зеленая энергия вырабатывается солнцем, ветром и водой. Она возобновляема и не производит парниковых газов. Домашняя солнечная станция на 5 кВт сокращает выбросы CO2 на 3.5 тонны ежегодно и окупается за счет экономии счетов.";
      }
      if (text.match(/транспорт|машин|электромобил|велосипед|метро|автобус|поезд/i)) {
        return "Транспорт производит до 20% всех выбросов CO2. Один день в неделю без личного авто (на метро или велосипеде) уменьшит ваши выбросы на 350-400 кг CO2 в год. Электромобили сокращают локальный смог в городах на 80%.";
      }
      if (text.match(/еда|питани|мясо|рацион|веган|говядин/i)) {
        return "Производство 1 кг говядины выделяет до 60 кг парниковых газов и требует 15 000 литров воды. Даже один день в неделю без мяса («Зеленый понедельник») сокращает ваш личный экологический след на 15%!";
      }
      if (text.match(/потеплен|климат|ледник|температур|парников/i)) {
        return "Из-за парникового эффекта средняя температура Земли уже поднялась на 1.2°C. Это вызывает волны тепла, засухи и исчезновение ледников. Каждое посаженное дерево и сокращение отходов помогают удерживать потепление в пределах безопасных 1.5°C.";
      }
      if (text.match(/проект|фонд|помощь|спонсор|дон|поддерж/i)) {
        return "В разделе «Проекты» вы найдете инициативы: посадка лесов «Яшил Макон», спасение Арала, очистка рек и установка солнечных микросетей. Вы можете поддержать их голосом или финансовым вкладом!";
      }
      if (text.match(/админ|автор|создател|кто сделал|сайт|ecopulse/i)) {
        return "EcoPulse — это передовая платформа эко-мониторинга и зеленых инициатив, созданная для того, чтобы каждый человек мог внести реальный вклад в оздоровление природы.";
      }
      if (text.match(/спасибо|благодар|отлично|супер|молодец|круто|понятно/i)) {
        return "Всегда к вашим услугам! Рад быть полезным в защите нашей природы. Если появятся новые вопросы — задавайте! 🌿🌍";
      }
      if (text.match(/пока|до свидания|до встречи|бай|всего доброго/i)) {
        return "До свидания! Берегите окружающую среду и заглядывайте на EcoPulse чаще! 💚✨";
      }
      return `Интересный вопрос о «${userText}»! В экологии каждая деталь взаимосвязана: от осознанного потребления до чистой энергетики. Рекомендую воспользоваться нашим Калькулятором углерода или проверить данные в Global Dashboard!`;
    }

    // 2. ENGLISH RESPONSES
    if (language === 'EN') {
      if (text.match(/hello|hi|hey|good morning|good day|how are you/i)) {
        return "Hello there! I am your EcoPulse AI Assistant 🌿 Here to help you explore air quality data, plant real trees, compute your carbon footprint, and live sustainably. What would you like to know?";
      }
      if (text.match(/who are you|what can you do|your role|what is ecopulse|purpose/i)) {
        return "I am the EcoPulse Intelligence Assistant. I can help you: 1) Monitor live global Air Quality Index (AQI); 2) Compute your personal carbon footprint; 3) Sponsor real tree planting across vital biomes; 4) Provide science-backed eco living advice.";
      }
      if (text.match(/tree|plant|oak|pine|maple|sakura|forest|seedling/i)) {
        return "With EcoPulse, you can sponsor certified tree planting! Options: Mighty Oak (absorbs 22 kg CO2/yr), Mountain Pine, Autumn Maple, and Cherry Blossom. Planting regions include the Aral Sea basin, Zaamin mountains, and Tashkent Green Belt. You will receive an official verifiable certificate!";
      }
      if (text.match(/plastic|waste|trash|recycle|recycling|garbage|landfill|bag/i)) {
        return "Single-use plastics take over 450 years to degrade. Practical tips: 1) Carry a reusable cloth bag; 2) Bring your own insulated tumbler for drinks; 3) Segregate PET bottles, aluminum cans, and paper for recycling.";
      }
      if (text.match(/water|ocean|river|sea|aral|conserve|tap/i)) {
        return "Freshwater makes up less than 1% of Earth's water supplies. Turning off the tap while brushing teeth saves up to 8 liters every minute. Shortening shower times by just 3 minutes saves thousands of gallons yearly!";
      }
      if (text.match(/air|aqi|breath|smog|dust|pollution|pm2\.5|mask/i)) {
        return "The Air Quality Index (AQI): 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for sensitive groups, 151+ Hazardous. If AQI is above 100, wearing an N95 respirator outdoors is recommended. Check real-time scores for any city in our 'Global Dashboard'!";
      }
      if (text.match(/carbon|footprint|calculator|calculate|co2|emissions|tons/i)) {
        return "Your carbon footprint measures the greenhouse gases generated by your transport, diet, electricity, and shopping. The average individual emits 4-7 metric tons of CO2 annually. Take our 1-minute assessment in the 'Calculator' tab for custom reduction tips!";
      }
      if (text.match(/solar|energy|wind|renewable|clean energy|panel|electricity/i)) {
        return "Solar and wind energy produce zero emissions during operation. A typical 5kW rooftop solar setup prevents ~3.5 metric tons of CO2 from entering the atmosphere annually, while cutting electric bills by up to 70%.";
      }
      if (text.match(/transport|car|vehicle|ev|electric car|bike|bicycle|transit|bus|train/i)) {
        return "Transportation contributes roughly 20% of global CO2 emissions. Commuting by bicycle or mass transit just one day a week saves ~350-400 kg of CO2 per year. Electric vehicles eliminate toxic tailpipe particulates in urban centers.";
      }
      if (text.match(/food|diet|meat|vegan|vegetarian|beef|eating/i)) {
        return "Beef production generates up to 60 kg of greenhouse gases per kilogram of meat. Participating in 'Meatless Mondays' or shifting towards plant-forward nutrition can reduce your dietary footprint by 15-20%!";
      }
      if (text.match(/climate|warming|greenhouse|temperature|glacier|global warming/i)) {
        return "Earth's average temperature has risen by over 1.2°C due to atmospheric greenhouse gas concentrations. Reforestation, renewable power, and conscious consumption are essential to keep warming under the critical 1.5°C threshold.";
      }
      if (text.match(/project|projects|sponsor|fund|initiative|donation|support/i)) {
        return "In our 'Projects' tab, you can back meaningful causes: Aral Sea greening, Zaamin mountain preservation, ocean cleanups, and community solar installations. Vote or contribute directly today!";
      }
      if (text.match(/admin|author|creator|who made|about|platform/i)) {
        return "EcoPulse is a state-of-the-art sustainability and climate intelligence platform designed to empower people with actionable ecological data and real-world impact.";
      }
      if (text.match(/thank|thanks|awesome|great|good job|perfect|helpful|cool/i)) {
        return "You're very welcome! Every proactive ecological effort counts. Feel free to ask anytime you need more insights! 🌿🌍";
      }
      if (text.match(/bye|goodbye|see you|farewell|later/i)) {
        return "Goodbye! Have a wonderful day and thank you for taking care of our planet with EcoPulse! 💚✨";
      }
      return `That's an insightful question regarding "${userText}". In sustainability, personal habits and clean technologies work together. Feel free to check our live Air Dashboard or calculate your emissions in the Calculator tab!`;
    }

    // 3. UZBEK RESPONSES (DEFAULT)
    if (text.match(/salom|assalom|qalesan|qandaysiz|qalaysiz|tanish|hayrli/i)) {
      return "Assalomu alaykum! Men EcoPulse sun'iy intellekt assistentiman 🌿 Havo tozaligi, daraxt ekish, uglerod izini kamaytirish yoki ekologik turmush tarzi bo'yicha qanday savolingiz bor?";
    }
    if (text.match(/kimsan|kimsiz|vazifang|nima qila olasan|nima qilasiz|imkoniyat|kim bu/i)) {
      return "Men EcoPulse loyihasining aqlli yordamchisiman. Sizga quyidagilarda yordam bera olaman: 1) Dunyo shaharlaridagi jonli havo sifati (AQI); 2) Shaxsiy uglerod izingizni hisoblash; 3) Orol dengizi yoki Zominga haqiqiy daraxt ekish; 4) Ekologik foydali maslahatlar berish.";
    }
    if (text.match(/daraxt|ko'chat|kochat|ekish|eman|qarag'ay|zarang|sakura|olcha|o'rmon/i)) {
      return "Platformamiz orqali haqiqiy ko'chat ekishingiz mumkin! Daraxt turlari: Qudratli Eman (yiliga 22 kg CO2 yutadi), Zomin Qarag'ayi, Kuzgi Zarang va Gilos daraxti. Hududlar: Orol dengizi tubi, Zomin tog'lari va Toshkent Yashil Halqasi. Menyudagi 'Daraxt ekish' bo'limiga o'ting — ekilgach sizga sertifikat va hisobot taqdim etiladi!";
    }
    if (text.match(/plastik|chiqindi|axlat|musor|saralash|qayta ishlash|paket|baklajka/i)) {
      return "Plastik tabiatda 450 yildan ortiq vaqtda parchalanadi va tuproqni zaharlaydi. Oddiy maslahatlar: 1) Xarid uchun matoli xaltadan foydalaning; 2) Bir martalik idishlar o'rniga termos yoki shisha idish ishlating; 3) Qog'oz, plastmassa va shishani alohida saralab topshiring.";
    }
    if (text.match(/suv|daryo|dengiz|okean|orol|tejam|jo'mrak|kran/i)) {
      return "Ichimlik suvi Yer yuzidagi barcha suvning 1 foizidan ham kam! Tish yuvayotganda jo'mrakni o'chirib qo'ysangiz, bir daqiqada 6-8 litr toza suv tejaladi. Orol dengizi tubini ko'kalamzorlashtirish loyihasi esa 'Loyihalar' bo'limimizda mavjud.";
    }
    if (text.match(/havo|aqi|tutun|smog|chang|nafas|iflos|pm2\.5|maska/i)) {
      return "AQI (Air Quality Index) — havo sifati me'yori: 0-50: A'lo daraja; 51-100: Qoniqarli; 101-150: Sezgir odamlar uchun noqulay; 151+: Xavfli daraja. Agar ko'rsatkich 100 dan oshsa, ko'chada himoya niqobi taqish tavsiya qilinadi. 'Global Dashboard' bo'limida istalgan shahar havosini jonli tekshirishingiz mumkin!";
    }
    if (text.match(/uglerod|kalkulyator|hisobla|footprint|carbon|co2|iz|chiqindi/i)) {
      return "Uglerod izi — bu kundalik transport, elektr, taom va xaridlaringiz natijasida havoga chiqarilgan CO2 hajmidir. O'rtacha odam yiliga 4-7 tonna CO2 chiqaradi. Menyudagi 'Kalkulyator' bo'limiga kiring va 4 bosqichda o'z izingizni aniq bilib oling!";
    }
    if (text.match(/quyosh|energiya|panel|shamol|yashil energiya|elektr|batareya/i)) {
      return "Quyosh va shamol energiyasi zaharli gazlar chiqarmaydi va mutlaqo bitmas-tuganmasdir. Uyingizga 5 kVt quvvatli quyosh paneli o'rnatish yiliga 3.5 tonna CO2 ning havoga tarqalishini to'xtatadi va xarajatlaringizni 70% gacha kamaytiradi.";
    }
    if (text.match(/transport|mashina|avto|elektromobil|velosiped|metro|avtobus/i)) {
      return "Avtomobillar global chiqindilarning 20% iga sababchi bo'ladi. Haftada bor-yo'g'i 1 kun mashina o'rniga velosiped yoki metrodan foydalansangiz, yiliga 400 kg CO2 ni kamaytirasiz. Elektromobillar esa shahar ichida tutun chiqarmaydi.";
    }
    if (text.match(/ovqat|taom|go'sht|gosht|parhez|sabzavot|vegan/i)) {
      return "1 kg go'sht yetishtirish uchun 15 000 litr toza suv va ko'plab ozuqa sarflanadi. Haftada kamida 1 kun faqat o'simlik mahsulotlari bilan oziqlanish (Go'shtsiz kun) shaxsiy ekologik izingizni 15% gacha qisqartiradi!";
    }
    if (text.match(/global isish|iqlim|muzlik|harorat|issiqxona/i)) {
      return "Yer yuzida o'rtacha harorat sanoatgacha bo'lgan davrga nisbatan 1.2°C ga oshdi. Bu qurg'oqchilik va muzliklarning erishiga olib kelmoqda. Har bir ekilgan daraxt va tejalgan energiya sayyoramiz haroratini jilovlashda muhim rol o'ynaydi.";
    }
    if (text.match(/loyiha|loyihalar|homiylik|yordam|fond|yashil makon/i)) {
      return "EcoPulse platformasida faol loyihalar: Orol dengizini tiklash, Zomin o'rmonlarini asrash, quyosh elektr tarmoqlari va toza suv loyihalari. 'Loyihalar' bo'limida ularni ko'rib chiqishingiz va ovoz berishingiz mumkin!";
    }
    if (text.match(/admin|muallif|yaratuvchi|kim yaratgan|sayt haqida|ecopulse/i)) {
      return "EcoPulse — sayyoramiz tozaligini ta'minlash, global ekologik ma'lumotlarni monitoring qilish va haqiqiy ko'chat ekish tashabbuslarini birlashtiruvchi ekologik platformadir.";
    }
    if (text.match(/rahmat|tashakkur|katta rahmat|gap yo'q|gap yoq|zo'r|zor|yaxshi/i)) {
      return "Arzimaydi! Sayyoramiz tozaligi uchun intilayotganingizdan juda xursandman. Agar boshqa savollaringiz bo'lsa, bemalol beravering! 🌿🌍";
    }
    if (text.match(/xayr|ko'rishguncha|korishguncha|mayli|salomat bo'l/i)) {
      return "Xayr, salomat bo'ling! Tabiatni birgalikda asraymiz! 💚✨";
    }
    return `"${userText}" haqidagi savolingiz juda dolzarb. Ekologiyada har bir mayda odat katta o'zgarishlarga sabab bo'ladi. Ko'proq ma'lumot olish uchun saytimizning 'Kalkulyator', 'Global Dashboard' yoki 'Daraxt ekish' bo'limlaridan foydalanishingiz mumkin!`;
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 lg:bottom-8 right-5 lg:right-8 h-12 px-4 rounded-full bg-emerald-600/90 hover:bg-emerald-500 dark:bg-emerald-950/85 dark:hover:bg-emerald-900 border border-emerald-400/40 text-white backdrop-blur-2xl shadow-[0_10px_30px_rgba(16,185,129,0.35)] z-50 group flex items-center gap-2.5 transition-all font-sans cursor-pointer ring-2 ring-emerald-400/25 hover:scale-105 active:scale-95"
            aria-label="Eco-AI Chat"
          >
            <MessageSquare size={17} className="text-emerald-200 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-semibold tracking-wide text-white">AI Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Restrained 2026 Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 lg:bottom-8 right-4 sm:right-8 sm:w-[400px] w-[calc(100vw-2rem)] h-[580px] max-h-[75vh] rounded-3xl flex flex-col z-50 overflow-hidden eco-glass shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white font-sans"
          >
            {/* Header */}
            <div className="bg-moss/80 p-4 flex items-center justify-between border-b border-white/[0.08] text-bone">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-signal/10 text-signal border border-signal/20 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-display font-light text-base flex items-center gap-1.5 text-bone">
                    Eco-AI <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  </h3>
                  <p className="text-[10px] font-mono text-mist uppercase tracking-wider">{assistantSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    const initial = [{ id: 'initial', text: t('chat', 'greeting'), isUser: false }];
                    setMessages(initial);
                    try {
                      localStorage.setItem('ecopulse_chat_history', JSON.stringify(initial));
                    } catch (e) {
                      console.error(e);
                    }
                  }} 
                  className="p-1.5 rounded-lg text-mist hover:text-bone hover:bg-white/[0.05] transition-colors"
                  title={language === 'RU' ? 'Очистить чат' : language === 'EN' ? 'Clear chat' : 'Chatni tozalash'}
                >
                  <RotateCcw size={15} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 rounded-lg text-mist hover:text-bone hover:bg-white/[0.05] transition-colors"
                  aria-label="Close Chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              <div className="text-center text-[10px] font-mono uppercase tracking-widest text-mist/60 mb-1">
                {todayText}
              </div>

              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.isUser ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div 
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      msg.isUser 
                        ? 'bg-signal text-ink font-medium rounded-tr-sm' 
                        : 'bg-moss/70 border border-white/[0.08] text-bone rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="self-start flex items-center gap-1.5 p-3 bg-moss/70 rounded-xl rounded-tl-sm border border-white/[0.08]">
                  <span className="w-1.5 h-1.5 bg-signal rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-signal rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-signal rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 overflow-x-auto flex gap-1.5 no-scrollbar border-t border-white/[0.06] bg-moss/30">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-3 py-1.5 bg-moss/50 text-mist text-xs rounded-lg border border-white/[0.08] hover:border-signal/40 hover:text-signal transition-all shrink-0 font-medium font-sans"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/[0.08] bg-moss/80">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat', 'placeholder')}
                  className="w-full bg-ink/60 border border-white/[0.08] rounded-xl py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-bone placeholder:text-mist/50 focus:outline-none focus:border-signal/40 transition-colors font-sans"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="absolute right-1.5 p-1.5 bg-signal text-ink rounded-lg hover:bg-signal/90 transition-colors disabled:opacity-30"
                  aria-label={t('chat', 'send')}
                >
                  <Send size={14} />
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
