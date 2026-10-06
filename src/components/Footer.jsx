import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Mail, MapPin, Phone, Globe, MessageCircle, Video, Code } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden bg-white/80 dark:bg-eco-dark-lighter/80 border-t border-black/5 dark:border-white/10">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-eco-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo />
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">
              {t('footer', 'about')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-eco-primary hover:text-white transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                <Video size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">{t('footer', 'links')}</h4>
            <ul className="space-y-4 text-sm opacity-80">
              <li><a href="/" className="hover:text-eco-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-eco-primary"></div> Bosh sahifa</a></li>
              <li><a href="/dashboard" className="hover:text-eco-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-eco-primary"></div> Dashboard</a></li>
              <li><a href="/calculator" className="hover:text-eco-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-eco-primary"></div> Kalkulyator</a></li>
              <li><a href="/projects" className="hover:text-eco-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-eco-primary"></div> Loyihalar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Aloqa</h4>
            <ul className="space-y-4 text-sm opacity-80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-eco-primary shrink-0 mt-0.5" />
                <span>100084, Toshkent shahri, Amir Temur shoh ko'chasi, 107-B</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-eco-primary shrink-0" />
                <span>+998 71 200-00-00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-eco-primary shrink-0" />
                <span>info@ecopulse.uz</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">{t('footer', 'newsletter')}</h4>
            <p className="text-sm opacity-70 mb-4">
              Eng so'nggi ekologik yangiliklar va loyihalar haqida xabardor bo'ling.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('footer', 'placeholder')}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-eco-primary transition-colors text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-eco-primary text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Send size={16} className="transform translate-x-[1px] translate-y-[1px]" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <p>{t('footer', 'rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-eco-primary transition-colors">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-eco-primary transition-colors">Foydalanish shartlari</a>
            <a href="#" className="hover:text-eco-primary transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
