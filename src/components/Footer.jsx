import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Mail, MapPin, Phone, Globe, MessageCircle, Video, Code } from 'lucide-react';
import Logo from './Logo';

const Footer = ({ setActiveTab }) => {
  const { t } = useLanguage();

  const handleNav = (e, tab) => {
    if (setActiveTab) {
      e.preventDefault();
      setActiveTab(tab);
    }
  };

  return (
    <footer className="relative mt-20 pt-16 pb-12 overflow-hidden border-t border-white/[0.08] bg-transparent text-bone font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-5">
            <Logo />
            <p className="text-xs text-mist leading-relaxed max-w-xs">
              {t('footer', 'about')}
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-mist hover:text-signal hover:border-signal/30 transition-all">
                <Globe size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-mist hover:text-signal hover:border-signal/30 transition-all">
                <MessageCircle size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-mist hover:text-signal hover:border-signal/30 transition-all">
                <Video size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-mist hover:text-signal hover:border-signal/30 transition-all">
                <Code size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs mb-5 uppercase tracking-widest text-mist/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              {t('footer', 'links')}
            </h4>
            <ul className="space-y-2.5 text-xs text-mist">
              <li><a href="/" onClick={(e) => handleNav(e, 'home')} className="hover:text-signal transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-mist/50" /> {t('navbar', 'home')}</a></li>
              <li><a href="/dashboard" onClick={(e) => handleNav(e, 'dashboard')} className="hover:text-signal transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-mist/50" /> {t('navbar', 'dashboard')}</a></li>
              <li><a href="/calculator" onClick={(e) => handleNav(e, 'calculator')} className="hover:text-signal transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-mist/50" /> {t('navbar', 'calculator')}</a></li>
              <li><a href="/projects" onClick={(e) => handleNav(e, 'projects')} className="hover:text-signal transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-mist/50" /> {t('navbar', 'projects')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs mb-5 uppercase tracking-widest text-mist/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              {t('footer', 'contact')}
            </h4>
            <ul className="space-y-3 text-xs text-mist">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-signal shrink-0 mt-0.5" />
                <span>{t('footer', 'address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-signal shrink-0" />
                <span className="font-mono tabular-nums">{t('footer', 'phone')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-signal shrink-0" />
                <span className="font-mono">{t('footer', 'email')}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs mb-5 uppercase tracking-widest text-mist/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              {t('footer', 'newsletter')}
            </h4>
            <p className="text-xs text-mist mb-4 leading-relaxed">
              {t('footer', 'newsletter_desc')}
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('footer', 'placeholder')}
                className="w-full bg-moss/40 border border-white/[0.08] rounded-xl py-2.5 pl-3.5 pr-11 outline-none focus:border-signal/40 text-bone placeholder:text-mist/50 transition-colors text-xs font-sans"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-signal text-ink hover:bg-signal/90 rounded-lg transition-colors"
                title={t('footer', 'subscribe')}
              >
                <Send size={13} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-mist/70">
          <p>{t('footer', 'rights')}</p>
          <div className="flex gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-signal transition-colors">{t('footer', 'privacy')}</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-signal transition-colors">{t('footer', 'terms')}</a>
            <a href="#faq" onClick={(e) => e.preventDefault()} className="hover:text-signal transition-colors">{t('footer', 'faq')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
