import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, User, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { sendTelegramMessage } from '../utils/telegram';

/* ─── SVGs ─────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.14-3.41 1.83-2.66 6.55.97 7.78-.7 1.48-1.57 2.76-2.92 4.14zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#f35325" d="M1 1h10.5v10.5H1z"/>
    <path fill="#81bc06" d="M12.5 1H23v10.5H12.5z"/>
    <path fill="#05a6f0" d="M1 12.5h10.5V23H1z"/>
    <path fill="#ffba08" d="M12.5 12.5H23V23H12.5z"/>
  </svg>
);

/* ─── Google OAuth Account Picker — pixel-perfect replica ─── */
const GoogleAccountPicker = ({ onSelect }) => {
  const accounts = [
    { name: 'Otabek Karimjonov', email: 'otabekkarimjonov063@gmail.com', bg: '#1a73e8', initial: 'O' },
    { name: 'Eco Fan',           email: 'eco.user@gmail.com',            bg: '#34a853', initial: 'E' },
  ];

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        color: '#202124',
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col items-center px-10 pt-10 pb-6">
        {/* Google logo (official SVG wordmark) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 272 92"
          className="h-9 mb-5"
          aria-label="Google"
        >
          <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
          <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
          <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
        </svg>

        <h2 style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}
            className="text-[#202124] dark:text-[#e8eaed] text-center">
          Akkauntni tanlang
        </h2>
        <p style={{ fontSize: 16 }} className="text-[#5f6368] dark:text-[#9aa0a6] text-center">
          EcoPulse ilovasiga o'tish uchun
        </p>
      </div>

      {/* ── Account rows ── */}
      <div className="flex-1">
        {accounts.map((acc, i) => (
          <button
            key={i}
            onClick={() => onSelect(acc.email, acc.name)}
            className="w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#303134]"
          >
            {/* Avatar */}
            <div
              style={{
                width: 40, height: 40,
                borderRadius: '50%',
                backgroundColor: acc.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {acc.initial}
            </div>
            {/* Text */}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, lineHeight: '20px' }}
                 className="text-[#3c4043] dark:text-[#e8eaed] truncate">{acc.name}</p>
              <p style={{ fontSize: 13, lineHeight: '18px' }}
                 className="text-[#5f6368] dark:text-[#9aa0a6] truncate">{acc.email}</p>
            </div>
          </button>
        ))}

        {/* Use another account */}
        <button
          className="w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#303134]"
        >
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }} className="border border-[#dadce0] text-[#3c4043] dark:border-[#5f6368] dark:text-[#e8eaed]">
            {/* Person icon — SVG match Google's exact icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <p style={{ fontSize: 15 }} className="text-[#3c4043] dark:text-[#e8eaed]">
            Boshqa akkaunt ishlatish
          </p>
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#e0e0e0] dark:border-[#3c4043]">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
          <button style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                  className="text-[#5f6368] dark:text-[#9aa0a6] hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors">
            O'zbek
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Yordam', 'Maxfiylik', 'Shartlar'].map(txt => (
              <a key={txt} href="#"
                 style={{ fontSize: 12, textDecoration: 'none' }}
                 className="text-[#5f6368] dark:text-[#9aa0a6] hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors">
                {txt}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};




/* ─── Apple Screen ──────────────────────────────────────── */
const AppleScreen = ({ onSelect, onBack }) => (
  <div className="flex flex-col items-center h-full pt-10 px-8">
    <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-5 shadow-xl">
      <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white dark:fill-black">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.14-3.41 1.83-2.66 6.55.97 7.78-.7 1.48-1.57 2.76-2.92 4.14zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    </div>
    <h2 className="text-2xl font-semibold mb-1 text-slate-800 dark:text-white">Apple ID bilan kiring</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-10">
      EcoPulse ilovasiga Face ID yoki Touch ID orqali tez kiring
    </p>

    <button
      onClick={() => onSelect('apple.user@icloud.com', 'Apple User')}
      className="w-full bg-black text-white dark:bg-white dark:text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all mb-3 shadow-xl shadow-black/20"
    >
      <AppleIcon />
      Apple ID bilan davom etish
    </button>
    <button
      onClick={onBack}
      className="w-full text-center text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white transition-colors py-2"
    >
      Bekor qilish
    </button>
  </div>
);

/* ─── Microsoft Screen ──────────────────────────────────── */
const MicrosoftScreen = ({ onSelect, onBack }) => {
  const [msEmail, setMsEmail] = useState('');
  return (
    <div className="flex flex-col h-full pt-8 px-8">
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 24 24" className="w-10 h-10">
          <path fill="#f35325" d="M1 1h10.5v10.5H1z"/>
          <path fill="#81bc06" d="M12.5 1H23v10.5H12.5z"/>
          <path fill="#05a6f0" d="M1 12.5h10.5V23H1z"/>
          <path fill="#ffba08" d="M12.5 12.5H23V23H12.5z"/>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-1">Microsoft ga kiring</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">EcoPulse</p>

      <input
        type="email"
        value={msEmail}
        onChange={e => setMsEmail(e.target.value)}
        placeholder="Email, telefon yoki Skype"
        className="w-full border-b-2 border-slate-300 dark:border-white/30 focus:border-blue-600 outline-none py-2 bg-transparent text-slate-800 dark:text-white text-sm mb-8 transition-colors"
      />

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Akkauntingiz yo'qmi?{' '}
        <span className="text-blue-600 cursor-pointer hover:underline">Yarating!</span>
      </p>

      <div className="flex justify-end mt-auto">
        <button onClick={onBack} className="mr-3 px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
          Orqaga
        </button>
        <button
          onClick={() => onSelect(msEmail || 'user@outlook.com', msEmail.split('@')[0] || 'MS User')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
        >
          Keyingisi
        </button>
      </div>
    </div>
  );
};

/* ─── Success Screen ────────────────────────────────────── */
const SuccessScreen = ({ msg }) => (
  <div className="flex flex-col items-center justify-center h-full py-10 animate-zoom-in">
    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-4">
      <CheckCircle2 size={44} className="text-green-500" />
    </div>
    <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Muvaffaqiyatli!</h2>
    <p className="text-slate-500 dark:text-slate-400 text-center">{msg}</p>
  </div>
);

/* ─── Loading Screen ────────────────────────────────────── */
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full py-10">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-eco-primary rounded-full animate-spin mb-4" />
    <p className="text-slate-500 dark:text-slate-400 font-medium">Ulanmoqda...</p>
  </div>
);

/* ─── Main LoginModal ────────────────────────────────────── */
const LoginModal = ({ isOpen, onClose, setActiveTab }) => {
  const { t } = useLanguage();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(''); // '' | 'Google' | 'Apple' | 'Microsoft'

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setSuccessMsg('');
      setIsLogin(true);
      setOauthProvider('');
      setIsLoading(false);
    }
  }

  const handleOAuthLogin = useCallback((userEmail, userName) => {
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        name: userName,
        email: userEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff`,
      };
      setIsLoading(false);
      setSuccessMsg(`${oauthProvider} orqali muvaffaqiyatli kirdingiz!`);
      
      // Send Telegram notification
      sendTelegramMessage(`🔐 <b>Yangi Avtorizatsiya (${oauthProvider})</b>\n\nFoydalanuvchi: ${userName}\nEmail: ${userEmail}`);
      
      setTimeout(() => {
        login(userData);
        onClose();
        if (setActiveTab) setActiveTab('dashboard');
      }, 900);
    }, 1200);
  }, [oauthProvider, login, onClose, setActiveTab]);

  const validate = () => {
    if (!email) return 'Email kiritilishi shart';
    if (!/\S+@\S+\.\S+/.test(email)) return "Noto'g'ri email formati";
    if (!password) return 'Parol kiritilishi shart';
    if (password.length < 6) return "Parol kamida 6 belgidan iborat bo'lishi kerak";
    if (!isLogin && !name) return 'Ismingizni kiriting';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        name: isLogin ? email.split('@')[0] : name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isLogin ? email.split('@')[0] : name)}&background=10b981&color=fff`,
      };
      setIsLoading(false);
      const msg = isLogin ? 'Muvaffaqiyatli kirdingiz!' : 'Akkaunt yaratildi!';
      setSuccessMsg(msg);
      
      // Send Telegram notification
      sendTelegramMessage(`🔐 <b>${isLogin ? 'Tizimga kirish' : 'Yangi Akkaunt'} (Email)</b>\n\nFoydalanuvchi: ${userData.name}\nEmail: ${email}`);
      
      setTimeout(() => {
        login(userData);
        onClose();
        if (setActiveTab) setActiveTab('dashboard');
      }, 900);
    }, 1400);
  };

  if (!isOpen) return null;

  // Which screen content to show inside the OAuth panel
  const showingOAuth = oauthProvider !== '';
  const panelHeight = oauthProvider === 'Google' ? 'min-h-[520px]' : 'min-h-[460px]';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70"
      style={{ WebkitBackdropFilter: 'none', backdropFilter: 'none' }}
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 30, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30, rotateX: -15 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
        style={{ transformPerspective: 1200 }}
        className={`relative w-full max-w-md bg-white dark:bg-[#202124] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.15)] dark:shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden ${panelHeight} flex flex-col`}
      >

        {/* Decorative blobs — lightweight, pointer-events-none */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Close / Back button */}
        <button
          onClick={() => {
            if (isLoading) return;
            if (showingOAuth) { setOauthProvider(''); setSuccessMsg(''); }
            else onClose();
          }}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-slate-500 dark:text-slate-300"
          aria-label="Orqaga"
        >
          {showingOAuth ? <ChevronLeft size={20} /> : <X size={20} />}
        </button>

        {/* ── OAUTH SCREENS ── */}
        {showingOAuth ? (
          <div className="flex-1 relative z-10 animate-scale-up">
            {isLoading ? (
              <LoadingScreen />
            ) : successMsg ? (
              <SuccessScreen msg={successMsg} />
            ) : oauthProvider === 'Google' ? (
              <GoogleAccountPicker
                onSelect={handleOAuthLogin}
                onBack={() => setOauthProvider('')}
              />
            ) : oauthProvider === 'Apple' ? (
              <AppleScreen
                onSelect={handleOAuthLogin}
                onBack={() => setOauthProvider('')}
              />
            ) : (
              <MicrosoftScreen
                onSelect={handleOAuthLogin}
                onBack={() => setOauthProvider('')}
              />
            )}
          </div>
        ) : (
        /* ── MAIN LOGIN/REGISTER FORM ── */
          <div className="p-8 relative z-10 flex-1 overflow-y-auto">
            <div className="text-center mb-7">
              <h2 className="text-3xl font-extrabold mb-1.5 bg-clip-text text-transparent bg-gradient-to-r from-eco-primary to-cyan-500">
                {isLogin ? t('auth', 'login_title') : t('auth', 'register_title')}
              </h2>
              <p className="text-sm opacity-60">Ekotizim kelajagiga hissa qo'shishni boshlang</p>
            </div>

            {/* Social buttons */}
            <div className="space-y-3 mb-5">
              <button
                onClick={() => setOauthProvider('Google')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-semibold shadow-sm hover:shadow-md active:scale-95"
              >
                <GoogleIcon />
                {t('auth', 'google')}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOauthProvider('Apple')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-black text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-all font-semibold active:scale-95"
                >
                  <AppleIcon /> Apple
                </button>
                <button
                  onClick={() => setOauthProvider('Microsoft')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-semibold active:scale-95"
                >
                  <MicrosoftIcon /> Microsoft
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center mb-5">
              <div className="flex-1 border-t border-black/10 dark:border-white/10" />
              <span className="mx-4 text-xs text-slate-400 uppercase font-semibold">yoki email orqali</span>
              <div className="flex-1 border-t border-black/10 dark:border-white/10" />
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-shake">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={15} /> {successMsg}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="animate-slide-down">
                  <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider opacity-60">To'liq ismingiz</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary transition-colors" size={17} />
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-eco-primary/40 focus:border-eco-primary transition-all font-medium"
                      placeholder="John Doe" disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider opacity-60">{t('auth', 'email')}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary transition-colors" size={17} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-eco-primary/40 focus:border-eco-primary transition-all font-medium"
                    placeholder="you@example.com" disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 ml-1 uppercase tracking-wider opacity-60">{t('auth', 'password')}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-eco-primary transition-colors" size={17} />
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-eco-primary/40 focus:border-eco-primary transition-all font-medium"
                    placeholder="••••••••" disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full primary-button py-3.5 mt-1 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? t('auth', 'login_btn') : t('auth', 'register_btn')}
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center text-sm bg-black/5 dark:bg-white/5 p-4 rounded-xl">
              <span className="opacity-60">{isLogin ? t('auth', 'no_account') : t('auth', 'has_account')}</span>
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-eco-primary hover:text-emerald-500 hover:underline font-bold transition-colors ml-1"
              >
                {isLogin ? t('auth', 'register_link') : t('auth', 'login_link')}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
