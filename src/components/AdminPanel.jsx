import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, Calendar, Activity, Box, Download, Filter, 
  MoreVertical, CheckCircle2, XCircle, Clock, Trash2, Edit, Bell, Search,
  Settings, Shield, List, AlertTriangle, CheckSquare, Square, SearchCode,
  LogOut, Server, Cpu, Database, Command, X, Sliders, ChevronDown, Move, Lock, Key, Globe, Eye, EyeOff, User, ArrowRight, Sun, Moon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import CountUp from './CountUp';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// --- INITIAL MOCK DATA ---
const initialChartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 6890 },
  { name: 'Jun', amount: 4390 },
  { name: 'Jul', amount: 8490 },
];

const lastYearChartData = [
  { name: 'Jan', amount: 2000 },
  { name: 'Feb', amount: 1500 },
  { name: 'Mar', amount: 4000 },
  { name: 'Apr', amount: 1200 },
  { name: 'May', amount: 5000 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 4490 },
];

const initialUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Moderator', status: 'Active', lastLogin: '1 hour ago' },
  { id: 3, name: 'Mike Ross', email: 'mike@example.com', role: 'User', status: 'Blocked', lastLogin: '3 days ago' },
  { id: 4, name: 'Harvey Specter', email: 'harvey@example.com', role: 'User', status: 'Active', lastLogin: '5 mins ago' },
  { id: 5, name: 'Rachel Zane', email: 'rachel@example.com', role: 'User', status: 'Active', lastLogin: '1 day ago' },
];

const initialActivity = [
  { id: 1, user: 'Alex Johnson', action: 'Created new project', target: 'Ocean Cleanup', time: '10 mins ago', type: 'create' },
  { id: 2, user: 'Sarah Connor', action: 'Approved transaction', target: '#TX-8832', time: '1 hour ago', type: 'approve' },
  { id: 3, user: 'System', action: 'Database backup completed', target: 'Server', time: '3 hours ago', type: 'system' },
  { id: 4, user: 'Mike Ross', action: 'Failed login attempt', target: 'Security', time: '5 hours ago', type: 'alert' },
];

const mockNotifications = [
  { id: 1, title: 'New User Registered', desc: 'Rachel Zane joined the platform.', time: '2m ago', read: false },
  { id: 2, title: 'High API Latency', desc: 'Response time exceeded 500ms.', time: '1h ago', read: false },
  { id: 3, title: 'Project Goal Reached', desc: 'Amazon Rescue hit 100%.', time: '3h ago', read: true },
];

// --- TOOLTIP COMPONENT (CLEAN SAAS) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1A1D24] border border-slate-300 dark:border-white/10 p-3 rounded-lg shadow-xl font-['Inter',sans-serif]">
        <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN ADMIN PANEL ---
const AdminPanel = ({ onExit }) => {
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  
  const tAdmin = (key) => {
    const dict = {
      UZ: {
        overview: 'Umumiy ko\'rinish', users: 'Foydalanuvchilar', roles: 'Rollar va Huquqlar', audit: 'Audit Jurnali', settings: 'Sozlamalar',
        search: 'Qidirish...', logout: 'Tizimdan chiqish', exit: 'Asosiy saytga qaytish',
        overview_title: 'Umumiy ko\'rinish', overview_desc: 'SaaS ko\'rsatkichlari.',
        users_title: 'Foydalanuvchilar', users_desc: 'Platforma a\'zolarini boshqarish.',
        roles_title: 'Rollar va Huquqlar', roles_desc: 'Admin ruxsatlarini sozlash.',
        audit_title: 'Audit Jurnali', audit_desc: 'Tizim hodisalari xronologiyasi.',
        settings_title: 'Tizim Sozlamalari', settings_desc: 'Global konfiguratsiyalarni boshqarish.',
        total_revenue: 'Umumiy Daromad', active_projects: 'Faol Loyihalar', total_users_stat: 'Foydalanuvchilar', system_errors: 'Tizim Xatolari',
        export_report: 'Hisobotni yuklash', revenue_dynamics: 'Daromad Dinamikasi', system_health: 'Tizim Holati',
        notifications: 'Xabarnomalar', mark_read: 'Barchasini o\'qilgan qilish', this_year: 'Bu yil', last_year: 'O\'tgan yil',
        notif_title_1: 'Yangi foydalanuvchi', notif_desc_1: 'Rachel Zane platformaga qo\'shildi.', notif_time_1: '2d oldin',
        notif_title_2: 'API kechikishi', notif_desc_2: 'Javob vaqti 500ms dan oshdi.', notif_time_2: '1s oldin',
        notif_title_3: 'Loyiha maqsadi', notif_desc_3: 'Amazon qutqaruvi 100% ga yetdi.', notif_time_3: '3s oldin',
        general_config: 'Umumiy Sozlamalar', save_settings: 'Saqlash', site_name: 'Sayt Nomi', contact_email: 'Aloqa Email', timezone: 'Vaqt Mintaqasi',
        security: 'Xavfsizlik', two_factor: 'Ikki bosqichli autentifikatsiya (2FA)', two_factor_desc: 'Barcha adminlar uchun 2FA talab qilish.',
        api_integrations: 'API va Integratsiyalar', openai_key: 'OpenAI API Kaliti', telegram_token: 'Telegram Bot Token',
        danger_zone: 'Xavfli Hudud', maintenance_mode: 'Texnik Xizmat Rejimi', maintenance_desc: 'Foydalanuvchilarga vaqtincha xizmat ko\'rsatilmaydi.',
        factory_reset: 'Zavod Sozlamalari', factory_reset_desc: 'Barcha ma\'lumotlar o\'chiriladi va dastlabki holatga qaytadi.',
        search_users: 'Foydalanuvchilarni qidirish...', add_user: 'Foydalanuvchi Qo\'shish',
        users_selected: 'foydalanuvchi tanlandi', change_role: 'Rolni O\'zgartirish', delete_btn: 'O\'chirish',
        th_user: 'FOYDALANUVCHI', th_role: 'ROL', th_status: 'HOLAT', th_last_login: 'SO\'NGGI KIRISH', th_actions: 'HARAKATLAR',
        showing: 'Ko\'rsatilmoqda', to: '-', of: 'dan jami', results: 'natija', prev: 'Oldingi', next: 'Keyingi',
        role_admin: 'Admin', role_moderator: 'Moderator', role_user: 'Foydalanuvchi',
        status_active: 'FAOL', status_blocked: 'BLOKLANGAN',
        recent_transactions: 'So\'nggi Tranzaksiyalar', view_all: 'Barchasini ko\'rish',
        th_id: 'ID', th_date: 'Sana', th_project: 'Loyiha', th_amount: 'Summa',
        no_recent_transactions: 'Yangi tranzaksiyalar yo\'q', status_success: 'Muvaffaqiyatli',
        main_server: 'Asosiy Server', primary_db: 'Asosiy MB', operational: 'Faol',
        uptime: 'Ishlash vaqti', bg_workers: 'Orqa fon jarayonlari', queue_proc: 'Navbat ishlash',
        high_load: 'Yuqori yuklama', admin_profile: 'Admin Profili', save_changes: 'O\'zgartirishlarni saqlash',
        manage_users: 'Foydalanuvchilarni boshqarish', manage_users_desc: 'Foydalanuvchilarni boshqarish uchun ruxsat.',
        view_fin_reports: 'Moliyaviy hisobotlarni ko\'rish', view_fin_reports_desc: 'Moliyaviy ma\'lumotlarni ko\'rishga ruxsat.',
        edit_site_content: 'Sayt kontentini tahrirlash', edit_site_content_desc: 'Sayt ma\'lumotlarini o\'zgartirishga ruxsat.',
        sys_config: 'Tizim konfiguratsiyasi', sys_config_desc: 'Tizim sozlamalarini o\'zgartirishga ruxsat.'
      },
      RU: {
        overview: 'Обзор', users: 'Пользователи', roles: 'Роли и Права', audit: 'Журнал аудита', settings: 'Настройки',
        search: 'Поиск...', logout: 'Выйти', exit: 'Вернуться на сайт',
        overview_title: 'Обзор', overview_desc: 'Краткий обзор показателей.',
        users_title: 'Пользователи', users_desc: 'Управление участниками.',
        roles_title: 'Роли и Права', roles_desc: 'Настройка доступов.',
        audit_title: 'Журнал аудита', audit_desc: 'Хронология событий.',
        settings_title: 'Настройки системы', settings_desc: 'Глобальная конфигурация.',
        total_revenue: 'Общий доход', active_projects: 'Активные проекты', total_users_stat: 'Пользователи', system_errors: 'Ошибки системы',
        export_report: 'Экспорт отчета', revenue_dynamics: 'Динамика доходов', system_health: 'Состояние системы',
        notifications: 'Уведомления', mark_read: 'Отметить все', this_year: 'В этом году', last_year: 'В прошлом году',
        notif_title_1: 'Новый пользователь', notif_desc_1: 'Rachel Zane присоединилась.', notif_time_1: '2м назад',
        notif_title_2: 'Задержка API', notif_desc_2: 'Время ответа превысило 500мс.', notif_time_2: '1ч назад',
        notif_title_3: 'Цель проекта', notif_desc_3: 'Спасение Амазонии 100%.', notif_time_3: '3ч назад',
        general_config: 'Общие настройки', save_settings: 'Сохранить', site_name: 'Название сайта', contact_email: 'Контактный Email', timezone: 'Часовой пояс',
        security: 'Безопасность', two_factor: 'Двухфакторная аутентификация (2FA)', two_factor_desc: 'Требовать 2FA для всех администраторов.',
        api_integrations: 'API и интеграции', openai_key: 'Ключ OpenAI API', telegram_token: 'Токен Telegram Bot',
        danger_zone: 'Опасная зона', maintenance_mode: 'Режим обслуживания', maintenance_desc: 'Сайт будет временно недоступен для пользователей.',
        factory_reset: 'Сброс до заводских настроек', factory_reset_desc: 'Все данные будут удалены и система вернется к исходному состоянию.',
        search_users: 'Поиск пользователей...', add_user: 'Добавить пользователя',
        users_selected: 'пользователей выбрано', change_role: 'Изменить роль', delete_btn: 'Удалить',
        th_user: 'ПОЛЬЗОВАТЕЛЬ', th_role: 'РОЛЬ', th_status: 'СТАТУС', th_last_login: 'ПОСЛЕДНИЙ ВХОД', th_actions: 'ДЕЙСТВИЯ',
        showing: 'Показано', to: '-', of: 'из', results: 'результатов', prev: 'Назад', next: 'Вперед',
        role_admin: 'Админ', role_moderator: 'Модератор', role_user: 'Пользователь',
        status_active: 'АКТИВЕН', status_blocked: 'ЗАБЛОКИРОВАН',
        recent_transactions: 'Последние транзакции', view_all: 'Смотреть все',
        th_id: 'ID', th_date: 'Дата', th_project: 'Проект', th_amount: 'Сумма',
        no_recent_transactions: 'Нет новых транзакций', status_success: 'Успешно',
        main_server: 'Основной сервер', primary_db: 'Основная БД', operational: 'Работает',
        uptime: 'Аптайм', bg_workers: 'Фоновые процессы', queue_proc: 'Обработка очередей',
        high_load: 'Высокая нагрузка', admin_profile: 'Профиль администратора', save_changes: 'Сохранить изменения',
        manage_users: 'Управление пользователями', manage_users_desc: 'Доступ к управлению пользователями.',
        view_fin_reports: 'Просмотр фин. отчетов', view_fin_reports_desc: 'Доступ к финансовым данным.',
        edit_site_content: 'Редактирование контента', edit_site_content_desc: 'Доступ к изменению сайта.',
        sys_config: 'Системная конфигурация', sys_config_desc: 'Доступ к настройкам системы.'
      },
      EN: {
        overview: 'Overview', users: 'Users', roles: 'Roles & Perms', audit: 'Audit Log', settings: 'Settings',
        search: 'Search...', logout: 'Logout', exit: 'Exit Admin',
        overview_title: 'Overview', overview_desc: 'Your SaaS performance at a glance.',
        users_title: 'User Management', users_desc: 'Manage access and roles across the platform.',
        roles_title: 'Roles & Permissions', roles_desc: 'Configure access levels for admin roles.',
        audit_title: 'Audit Trail', audit_desc: 'Chronological timeline of system events.',
        settings_title: 'System Settings', settings_desc: 'Manage global configurations and preferences.',
        total_revenue: 'Total Revenue', active_projects: 'Active Projects', total_users_stat: 'Total Users', system_errors: 'System Errors',
        export_report: 'Export Report', revenue_dynamics: 'Revenue Dynamics', system_health: 'System Health',
        notifications: 'Notifications', mark_read: 'Mark all read', this_year: 'This Year', last_year: 'Last Year',
        notif_title_1: 'New User Registered', notif_desc_1: 'Rachel Zane joined the platform.', notif_time_1: '2m ago',
        notif_title_2: 'High API Latency', notif_desc_2: 'Response time exceeded 500ms.', notif_time_2: '1h ago',
        notif_title_3: 'Project Goal Reached', notif_desc_3: 'Amazon Rescue hit 100%.', notif_time_3: '3h ago',
        general_config: 'General Configuration', save_settings: 'Save Settings', site_name: 'Site Name', contact_email: 'Contact Email', timezone: 'Timezone',
        security: 'Security & Authentication', two_factor: 'Two-Factor Authentication (2FA)', two_factor_desc: 'Enforce 2FA for all administrative accounts.',
        api_integrations: 'API & Integrations', openai_key: 'OpenAI API Key', telegram_token: 'Telegram Bot Token',
        danger_zone: 'Danger Zone', maintenance_mode: 'Maintenance Mode', maintenance_desc: 'Regular users will see a maintenance screen.',
        factory_reset: 'Factory Reset', factory_reset_desc: 'Wipe all configuration and reset to default state.',
        search_users: 'Search users...', add_user: 'Add User',
        users_selected: 'users selected', change_role: 'Change Role', delete_btn: 'Delete',
        th_user: 'USER', th_role: 'ROLE', th_status: 'STATUS', th_last_login: 'LAST LOGIN', th_actions: 'ACTIONS',
        showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next',
        role_admin: 'Admin', role_moderator: 'Moderator', role_user: 'User',
        status_active: 'ACTIVE', status_blocked: 'BLOCKED',
        recent_transactions: 'Recent Transactions', view_all: 'View all',
        th_id: 'ID', th_date: 'Date', th_project: 'Project', th_amount: 'Amount',
        no_recent_transactions: 'No recent transactions', status_success: 'Success',
        main_server: 'Main Server', primary_db: 'Primary DB', operational: 'Operational',
        uptime: 'Uptime', bg_workers: 'Background Workers', queue_proc: 'Queue processing',
        high_load: 'High Load', admin_profile: 'Administrator Profile', save_changes: 'Save Changes',
        manage_users: 'Manage Users', manage_users_desc: 'Allow user to perform actions related to manage users.',
        view_fin_reports: 'View Financial Reports', view_fin_reports_desc: 'Allow user to perform actions related to financial reports.',
        edit_site_content: 'Edit Site Content', edit_site_content_desc: 'Allow user to perform actions related to site content.',
        sys_config: 'System Configuration', sys_config_desc: 'Allow user to perform actions related to system configuration.'
      }
    };
    return dict[language]?.[key] || dict['EN'][key] || key;
  };

  const tTime = (timeStr) => {
    if (language === 'EN') return timeStr;
    const map = {
      'Just now': { UZ: 'Hozirgina', RU: 'Только что' },
      '2 mins ago': { UZ: '2 daqiqa oldin', RU: '2 минуты назад' },
      '5 mins ago': { UZ: '5 daqiqa oldin', RU: '5 минут назад' },
      '10 mins ago': { UZ: '10 daqiqa oldin', RU: '10 минут назад' },
      '1 hour ago': { UZ: '1 soat oldin', RU: '1 час назад' },
      '3 hours ago': { UZ: '3 soat oldin', RU: '3 часа назад' },
      '5 hours ago': { UZ: '5 soat oldin', RU: '5 часов назад' },
      '1 day ago': { UZ: '1 kun oldin', RU: '1 день назад' },
      '3 days ago': { UZ: '3 kun oldin', RU: '3 дня назад' },
    };
    return map[timeStr]?.[language] || timeStr;
  };

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('this_year');
  const [replyingNotifId, setReplyingNotifId] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Functional States
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', role: 'User', status: 'Active' });
  
  const [transactions, setTransactions] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  const [chartData, setChartData] = useState(initialChartData);
  const [activity, setActivity] = useState(initialActivity);

  // Settings States
  const [siteName, setSiteName] = useState('Eco Pulse');
  const [contactEmail, setContactEmail] = useState('support@eco-pulse.uz');
  const [timezone, setTimezone] = useState('Asia/Tashkent (UTC+5)');
  const [twoFactor, setTwoFactor] = useState(true);
  const [openaiKey, setOpenaiKey] = useState('sk-proj-7x8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p');
  const [telegramToken, setTelegramToken] = useState('6123456789:AAH_bcdEFG_hijKLM_nopQRS_tuvWXY');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Settings Handlers
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const { sendTelegramMessage } = await import('../utils/telegram.js');
    await sendTelegramMessage(`⚙️ <b>Sozlamalar saqlandi</b>\nSayt nomi: ${siteName}\nEmail: ${contactEmail}\n2FA: ${twoFactor ? 'Yoqilgan' : 'O\'chirilgan'}\nTexnik xizmat: ${maintenanceMode ? 'Yoqilgan' : 'O\'chirilgan'}`);
    setTimeout(() => {
      setIsSavingSettings(false);
      alert(language === 'UZ' ? 'Sozlamalar muvaffaqiyatli saqlandi!' : language === 'RU' ? 'Настройки успешно сохранены!' : 'Settings saved successfully!');
    }, 1000);
  };

  const handleFactoryReset = async () => {
    const msg = language === 'UZ' ? "Barcha ma'lumotlarni dastlabki holatga qaytarishga ishonchingiz komilmi?" : language === 'RU' ? "Вы уверены, что хотите сбросить все настройки?" : "Are you sure you want to reset all settings to factory defaults?";
    if (window.confirm(msg)) {
      setSiteName('Eco Pulse');
      setContactEmail('support@eco-pulse.uz');
      setTimezone('Asia/Tashkent (UTC+5)');
      setTwoFactor(true);
      setOpenaiKey('sk-••••••••••••••••••••••••');
      setTelegramToken('123456789:••••••••••••••••');
      setMaintenanceMode(false);
      const { sendTelegramMessage } = await import('../utils/telegram.js');
      await sendTelegramMessage(`⚠️ <b>Zavod sozlamalariga qaytarildi!</b>\nIP: Tizim Paneli`);
      alert(language === 'UZ' ? 'Zavod sozlamalariga qaytarildi.' : language === 'RU' ? 'Сброшено до заводских настроек.' : 'Reset to factory settings.');
    }
  };

  // Users Handlers
  const toggleAllUsers = () => {
    if (selectedUsers.length === users.length) setSelectedUsers([]);
    else setSelectedUsers(users.map(u => u.id));
  };
  const toggleUserSelection = (id) => {
    if (selectedUsers.includes(id)) setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    else setSelectedUsers([...selectedUsers, id]);
  };
  const deleteSelectedUsers = () => {
    setUsers(users.filter(u => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };
  const changeSelectedRole = () => {
    setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, role: u.role === 'User' ? 'Moderator' : 'User' } : u));
    setSelectedUsers([]);
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: 'User', status: 'Active' });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsUserModalOpen(true);
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u));
    } else {
      const newUser = { 
        id: Date.now(), 
        ...userFormData,
        lastLogin: 'Just now' 
      };
      setUsers([newUser, ...users]);
    }
    setIsUserModalOpen(false);
  };

  const deleteUser = (id) => {
    if (window.confirm(language === 'UZ' ? 'Rostdan ham o\'chirmoqchimisiz?' : 'Are you sure you want to delete?')) {
      setUsers(users.filter(u => u.id !== id));
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    }
  };

  useEffect(() => {
    if (selectedYear === 'this_year') {
      setChartData(initialChartData);
    } else {
      setChartData(lastYearChartData);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (!isLoggedIn) return; // Only bind keys when logged in

    const saved = JSON.parse(localStorage.getItem('eco_transactions') || '[]');
    setTransactions(saved);
    const sum = saved.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    setTotalSum(sum);
    
    // Command Palette shortcut (Ctrl+K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
      setError(false);
      const { sendTelegramMessage } = await import('../utils/telegram.js');
      await sendTelegramMessage(`🔐 <b>Admin kirdi</b>\n🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}\n🌐 IP/Device: Tizim paneli`);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const closeAdmin = async () => {
    if (isLoggedIn) {
      const { sendTelegramMessage } = await import('../utils/telegram.js');
      await sendTelegramMessage(`🚪 <b>Admin chiqdi</b>\n🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`);
    }
    if (onExit) onExit();
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    const { sendTelegramMessage } = await import('../utils/telegram.js');
    await sendTelegramMessage(`🚪 <b>Admin chiqdi</b>\n🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}`);
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div 
          key="admin-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-[#0D0F12] text-slate-700 dark:text-slate-300 font-['Inter',sans-serif] flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* Ambient Background */}
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute w-[80vw] h-[80vw] bg-[radial-gradient(circle,_rgba(99,102,241,0.1)_0%,_transparent_50%)] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center"
          >
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
              >
                <Shield size={32} className="text-slate-900 dark:text-white" />
              </motion.div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Eco Admin</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400">Tizimni boshqarish paneli</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 w-full">
              <div className="relative group">
                <input 
                  type="password" 
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Maxfiy parolni kiriting (admin)"
                  className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-slate-300 dark:border-white/20'} text-white text-center text-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors placeholder-white/20`}
                />
                {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2 text-center absolute -bottom-6 w-full">Noto'g'ri parol</p>}
              </div>
              <button type="submit" className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] mt-8">
                 Tizimga kirish
              </button>
            </form>

            <div className="mt-12 text-center">
               <button onClick={closeAdmin} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                 <X size={14} /> Asosiy saytga qaytish
               </button>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="admin-dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-[#0D0F12] text-slate-700 dark:text-slate-300 font-['Inter',sans-serif] flex overflow-hidden"
        >
      
      {/* 1. COMPACT SAAS SIDEBAR */}
      <aside className="w-16 hover:w-64 flex-shrink-0 bg-white dark:bg-[#13161A] border-r border-slate-200 dark:border-white/5 flex flex-col justify-between transition-all duration-300 group z-50">
        <div>
          <div className="h-16 flex items-center justify-center group-hover:justify-start group-hover:px-4 border-b border-slate-200 dark:border-white/5">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shrink-0">
              <Command size={18} className="text-slate-900 dark:text-white" />
            </div>
            <span className="ml-3 font-semibold text-slate-900 dark:text-white truncate opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Eco Admin</span>
          </div>
          
          <nav className="p-2 space-y-1 mt-4">
            {[
              { id: 'overview', icon: Activity, label: tAdmin('overview') },
              { id: 'users', icon: Users, label: tAdmin('users') },
              { id: 'roles', icon: Shield, label: tAdmin('roles') },
              { id: 'activity', icon: List, label: tAdmin('audit') },
              { id: 'settings', icon: Settings, label: tAdmin('settings') },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-md transition-colors relative ${
                  activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-white/5' : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:bg-white/5'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="sidebarActive" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <item.icon size={20} className="shrink-0" />
                <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-2 border-t border-slate-200 dark:border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-md text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600 dark:text-red-400 hover:bg-slate-100 dark:bg-white/5 transition-colors">
            <LogOut size={20} className="shrink-0" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{tAdmin('logout')}</span>
          </button>
          <button onClick={closeAdmin} className="w-full flex items-center p-3 rounded-md text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:bg-white/5 transition-colors mt-1">
            <X size={20} className="shrink-0" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{tAdmin('exit')}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-[#0D0F12]">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 bg-[#0D0F12]/80 backdrop-blur-sm shrink-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-md text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-white/10 transition-colors w-64"
            >
              <Search size={14} />
              <span>Search...</span>
              <span className="ml-auto text-xs bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">Ctrl+K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Health Mini Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-md text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-500">API: 42ms</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-md p-0.5">
              {['UZ', 'RU', 'EN'].map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${language === lang ? 'bg-indigo-500 text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white'}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors relative">
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0F12]"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1A1D24] border border-slate-300 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#13161A]">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{tAdmin('notifications')}</h4>
                      <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-300">{tAdmin('mark_read')}</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} onClick={() => setReplyingNotifId(replyingNotifId === n.id ? null : n.id)} className={`p-3 border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{tAdmin(`notif_title_${n.id}`)}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{tAdmin(`notif_time_${n.id}`)}</span>
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400">{tAdmin(`notif_desc_${n.id}`)}</p>
                          
                          <AnimatePresence>
                            {replyingNotifId === n.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden">
                                <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
                                  <input type="text" placeholder="Izoh/Javob yozish..." className="flex-1 bg-slate-100 dark:bg-black/40 text-xs text-slate-900 dark:text-white rounded-md px-3 py-1.5 outline-none border border-slate-300 dark:border-white/10 focus:border-indigo-500" onClick={(e) => e.stopPropagation()} />
                                  <button className="bg-indigo-500 text-white p-1.5 rounded-md hover:bg-indigo-600 transition-colors" onClick={(e) => { e.stopPropagation(); setReplyingNotifId(null); }}><ArrowRight size={14} /></button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer border-2 border-transparent hover:border-slate-300 dark:border-white/20 transition-all shadow-lg"
              >
                A
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-[#111827]/90 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 mb-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Admin G'ofurov</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium mt-0.5">admin@eco-pulse.uz</p>
                    </div>
                    
                    <button onClick={() => { setActiveTab('users'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5 transition-colors">
                      <User size={16} className="text-indigo-600 dark:text-indigo-400" /> Profilim
                    </button>
                    <button onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5 transition-colors">
                      <Settings size={16} className="text-emerald-600 dark:text-emerald-400" /> Sozlamalar
                    </button>
                    
                    <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={16} /> Tizimdan chiqish
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{tAdmin('overview_title')}</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400">{tAdmin('overview_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setIsExportOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm shadow-indigo-500/20"
                  >
                    <Download size={16} /> {tAdmin('export_report')}
                  </button>
                </div>

                {/* Flat Minimal Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: tAdmin('total_revenue'), value: totalSum, prefix: '$', trend: '+12.5%', color: 'text-indigo-600 dark:text-indigo-400' },
                    { label: tAdmin('active_projects'), value: 12, prefix: '', trend: '0%', color: 'text-slate-700 dark:text-slate-300' },
                    { label: tAdmin('total_users_stat'), value: 1248, prefix: '', trend: '+18.1%', color: 'text-green-600 dark:text-green-400' },
                    { label: tAdmin('system_errors'), value: 3, prefix: '', trend: '-2.4%', color: 'text-red-600 dark:text-red-400' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-lg p-5 flex flex-col justify-between group cursor-move">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        <Move size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                          <CountUp value={stat.value} prefix={stat.prefix} duration={1} />
                        </span>
                        <span className={`text-xs font-medium ${stat.color}`}>{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Clean Line Chart */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{tAdmin('revenue_dynamics')}</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                          className="bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 rounded px-3 py-1.5 outline-none hover:border-indigo-500 transition-colors flex items-center gap-2"
                        >
                          {tAdmin(selectedYear)} <ChevronDown size={14} />
                        </button>
                        <AnimatePresence>
                          {isYearDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#1A1D24] border border-slate-300 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-20"
                            >
                              <button onClick={() => { setSelectedYear('this_year'); setIsYearDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:bg-white/5 transition-colors ${selectedYear === 'this_year' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{tAdmin('this_year')}</button>
                              <button onClick={() => { setSelectedYear('last_year'); setIsYearDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:bg-white/5 transition-colors ${selectedYear === 'last_year' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{tAdmin('last_year')}</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                          <Line type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#818cf8', stroke: '#13161A', strokeWidth: 2 }} animationDuration={1000} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* System Health Widget */}
                  <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">{tAdmin('system_health')}</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 rounded text-indigo-600 dark:text-indigo-400"><Server size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{tAdmin('main_server')}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">us-east-1</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-400/10 px-2 py-1 rounded">{tAdmin('operational')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Database size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">PostgreSQL</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{tAdmin('primary_db')}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-400/10 px-2 py-1 rounded">99.9% {tAdmin('uptime')}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded text-orange-400"><Cpu size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{tAdmin('bg_workers')}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{tAdmin('queue_proc')}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded">{tAdmin('high_load')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Transactions Table */}
                <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1A1D24]">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{tAdmin('recent_transactions')}</h3>
                    <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 font-medium">{tAdmin('view_all')}</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-[#0D0F12] text-xs text-slate-400 dark:text-slate-500 font-medium border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">
                        <tr>
                          <th className="p-4 font-semibold">{tAdmin('th_id')}</th>
                          <th className="p-4 font-semibold">{tAdmin('th_date')}</th>
                          <th className="p-4 font-semibold">{tAdmin('th_project')}</th>
                          <th className="p-4 font-semibold text-right">{tAdmin('th_amount')}</th>
                          <th className="p-4 font-semibold">{tAdmin('th_status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.length === 0 ? (
                          <tr><td colSpan="5" className="p-8 text-center text-slate-400 dark:text-slate-500">{tAdmin('no_recent_transactions')}</td></tr>
                        ) : (
                          transactions.slice(0,5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-100 dark:bg-white/5 transition-colors group">
                              <td className="p-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 font-mono text-xs">#{tx.id.slice(-6)}</td>
                              <td className="p-4 text-slate-400 dark:text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="p-4 text-slate-200">{tx.project}</td>
                              <td className="p-4 text-right text-slate-200 font-medium">${tx.amount}</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 uppercase tracking-wider">
                                  {tAdmin('status_success')}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* USERS TAB (USER MANAGEMENT) */}
            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                  <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">{tAdmin('users_title')}</h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium">{tAdmin('users_desc')}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input 
                        type="text" 
                        placeholder={tAdmin('search_users')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0A0F16] border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                      />
                    </div>
                    <button className="px-4 py-3 bg-[#0A0F16] border border-slate-300 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5 transition-all flex items-center justify-center shadow-sm">
                      <Filter size={18} />
                    </button>
                    <button onClick={openAddUserModal} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-2">
                      <Users size={18} /> {tAdmin('add_user')}
                    </button>
                  </div>
                </div>

                <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                  {/* Subtle Top Glow */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
                  
                  {selectedUsers.length > 0 && (
                    <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-6 py-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <CheckSquare size={16} /> {selectedUsers.length} {tAdmin('users_selected')}
                      </span>
                      <div className="flex gap-3">
                        <button onClick={changeSelectedRole} className="text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 px-4 py-2 rounded-lg text-slate-900 dark:text-white transition-all active:scale-95 border border-slate-200 dark:border-white/5">{tAdmin('change_role')}</button>
                        <button onClick={deleteSelectedUsers} className="text-xs font-bold bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 transition-all active:scale-95 border border-red-500/10">{tAdmin('delete_btn')}</button>
                      </div>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#0A0F16] text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-white/5 uppercase tracking-widest">
                        <tr>
                          <th className="p-5 w-14 text-center">
                            <button onClick={toggleAllUsers} className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-white transition-colors">
                              {selectedUsers.length === users.length && users.length > 0 ? <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400" /> : <Square size={18} />}
                            </button>
                          </th>
                          <th className="p-5">{tAdmin('th_user')}</th>
                          <th className="p-5">{tAdmin('th_role')}</th>
                          <th className="p-5">{tAdmin('th_status')}</th>
                          <th className="p-5">{tAdmin('th_last_login')}</th>
                          <th className="p-5 text-right">{tAdmin('th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => {
                          const isSelected = selectedUsers.includes(user.id);
                          const initials = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                          
                          return (
                            <tr key={user.id} className={`group hover:bg-slate-100 dark:bg-white/5 transition-all duration-200 ${isSelected ? 'bg-indigo-500/5' : ''}`}>
                              <td className="p-5 text-center">
                                <button onClick={() => toggleUserSelection(user.id)} className={`transition-colors ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 group-hover:text-slate-400 dark:text-slate-500 dark:text-slate-400'}`}>
                                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner border border-slate-300 dark:border-white/10 ${
                                    user.role === 'Admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 
                                    user.role === 'Moderator' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 
                                    'bg-white dark:bg-[#13161A] text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {initials}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-300 transition-colors">{user.name}</span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{user.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                                  user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' :
                                  user.role === 'Moderator' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                  'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/10'
                                }`}>
                                  {user.role === 'Admin' ? tAdmin('role_admin') : user.role === 'Moderator' ? tAdmin('role_moderator') : tAdmin('role_user')}
                                </span>
                              </td>
                              <td className="p-5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  user.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 
                                  'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                                  {user.status === 'Active' ? tAdmin('status_active') : tAdmin('status_blocked')}
                                </span>
                              </td>
                              <td className="p-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium">{tTime(user.lastLogin)}</td>
                              <td className="p-5 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEditUserModal(user)} className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit size={16} /></button>
                                  <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination placeholder */}
                  <div className="p-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium bg-[#0A0F16]/50">
                    <span>{tAdmin('showing')} 1 {tAdmin('to')} {users.length} {tAdmin('of')} {users.length} {tAdmin('results')}</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:bg-white/5 disabled:opacity-50" disabled>{tAdmin('prev')}</button>
                      <button className="px-3 py-1.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-sm">1</button>
                      <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:bg-white/5">{tAdmin('next')}</button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ACTIVITY LOG (AUDIT TRAIL) */}
            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">{tAdmin('audit_title')}</h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium">{tAdmin('audit_desc')}</p>
                </div>

                <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl relative p-6 md:p-10">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
                  
                  <div className="relative border-l-2 border-slate-300 dark:border-white/10 ml-4 md:ml-6 space-y-8 md:space-y-10">
                    {activity.map((log, idx) => {
                      const initials = log.user === 'System' ? 'S' : log.user.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                      
                      return (
                        <div key={log.id} className="relative pl-8 md:pl-12 group">
                          {/* Glowing Timeline Dot */}
                          <div className={`absolute -left-[11px] top-4 w-5 h-5 rounded-full border-4 border-[#111827] shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-125 ${
                            log.type === 'create' ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' :
                            log.type === 'approve' ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' :
                            log.type === 'alert' ? 'bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : 'bg-slate-400'
                          }`}></div>
                          
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:bg-white/10 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
                            <div className="flex items-center gap-4 md:gap-5">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-inner shrink-0 ${
                                log.user === 'System' ? 'bg-slate-700 text-white' : 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white'
                              }`}>
                                {initials}
                              </div>
                              <div>
                                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                  <span className="font-bold text-slate-900 dark:text-white tracking-wide">{log.user}</span>{' '}
                                  <span className="opacity-80">{log.action}</span>{' '}
                                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wide">{log.target}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-black/40 px-4 py-2 rounded-xl whitespace-nowrap shrink-0 border border-slate-200 dark:border-white/5">{log.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROLES & PERMISSIONS */}
            {activeTab === 'roles' && (
              <motion.div 
                key="roles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{tAdmin('roles_title')}</h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400">{tAdmin('roles_desc')}</p>
                </div>

                <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#1A1D24] flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{tAdmin('admin_profile')}</h3>
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors">{tAdmin('save_changes')}</button>
                  </div>
                  <div className="p-6 space-y-6">
                    {[
                      { title: tAdmin('manage_users'), desc: tAdmin('manage_users_desc') },
                      { title: tAdmin('view_fin_reports'), desc: tAdmin('view_fin_reports_desc') },
                      { title: tAdmin('edit_site_content'), desc: tAdmin('edit_site_content_desc') },
                      { title: tAdmin('sys_config'), desc: tAdmin('sys_config_desc') }
                    ].map((perm, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{perm.title}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{perm.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked={i !== 3} />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{tAdmin('settings_title')}</h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500 dark:text-slate-400">{tAdmin('settings_desc')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* General Config */}
                  <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-slate-300 dark:border-white/10 transition-colors">
                    <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#1A1D24] flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg"><Sliders size={18} /></div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tAdmin('general_config')}</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{tAdmin('site_name')}</label>
                        <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{tAdmin('contact_email')}</label>
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{tAdmin('timezone')}</label>
                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all">
                          <option>Asia/Tashkent (UTC+5)</option>
                          <option>Europe/London (UTC+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-slate-300 dark:border-white/10 transition-colors">
                    <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#1A1D24] flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><Shield size={18} /></div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tAdmin('security')}</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tAdmin('two_factor')}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{tAdmin('two_factor_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* API & Integrations */}
                  <div className="bg-white dark:bg-[#13161A] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-slate-300 dark:border-white/10 transition-colors">
                    <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#1A1D24] flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><Server size={18} /></div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tAdmin('api_integrations')}</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{tAdmin('openai_key')}</label>
                        <div className="relative">
                          <input type={showOpenaiKey ? "text" : "password"} value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 rounded-lg p-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                          <button onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-cyan-400 transition-colors">
                            {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{tAdmin('telegram_token')}</label>
                        <div className="relative">
                          <input type={showTelegramToken ? "text" : "password"} value={telegramToken} onChange={(e) => setTelegramToken(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0D0F12] border border-slate-300 dark:border-white/10 rounded-lg p-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                          <button onClick={() => setShowTelegramToken(!showTelegramToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-cyan-400 transition-colors">
                            {showTelegramToken ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white dark:bg-[#13161A] border border-red-500/20 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                    <div className="p-5 border-b border-red-500/10 bg-white dark:bg-[#1A1D24] flex items-center gap-3 relative z-10">
                      <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg"><AlertTriangle size={18} /></div>
                      <h3 className="text-sm font-bold text-red-600 dark:text-red-400">{tAdmin('danger_zone')}</h3>
                    </div>
                    <div className="p-6 space-y-6 relative z-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tAdmin('maintenance_mode')}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{tAdmin('maintenance_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      
                      <div className="pt-4 border-t border-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tAdmin('factory_reset')}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{tAdmin('factory_reset_desc')}</p>
                        </div>
                        <button onClick={handleFactoryReset} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors shrink-0 border border-red-500/20 hover:border-red-500">
                          Reset All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Action Button for saving */}
                  <div className="lg:col-span-2 flex justify-end mt-4">
                    <button onClick={handleSaveSettings} disabled={isSavingSettings} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                      {isSavingSettings ? <Activity className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                      {isSavingSettings ? 'Saving...' : tAdmin('save_settings')}
                    </button>
                  </div>
                  
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Export Report Modal */}
      <AnimatePresence>
        {isExportOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsExportOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#13161A] border border-slate-300 dark:border-white/10 rounded-xl w-full max-w-md shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Export Report</h2>
                <button onClick={() => setIsExportOpen(false)} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['PDF', 'Excel', 'CSV'].map(fmt => (
                      <button key={fmt} className={`py-2 border rounded-md text-sm font-medium transition-colors ${fmt === 'CSV' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:bg-white/10'}`}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date Range</label>
                  <select className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    const csvRows = [
                      ['ID', 'Sana', 'Loyiha/Daraxt', 'Summa', 'Mijoz'],
                      ...transactions.map(tx => [
                        `#${tx.id.slice(-6)}`,
                        new Date(tx.date).toLocaleDateString('uz-UZ'),
                        tx.project,
                        `$${tx.amount}`,
                        tx.user
                      ])
                    ];
                    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `EcoPulse_Report_${new Date().toLocaleDateString()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setIsExportOpen(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                >
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Add/Edit Modal (Moved outside tab for global stacking) */}
      <AnimatePresence>
        {isUserModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111827] border border-slate-300 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-white/5 bg-[#0A0F16]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}</h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={saveUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase mb-2">Ism</label>
                  <input required type="text" value={userFormData.name} onChange={(e) => setUserFormData({...userFormData, name: e.target.value})} className="w-full bg-[#0A0F16] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase mb-2">Email</label>
                  <input required type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} className="w-full bg-[#0A0F16] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase mb-2">Rol</label>
                    <select value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value})} className="w-full bg-[#0A0F16] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all">
                      <option value="User">User</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase mb-2">Holat</label>
                    <select value={userFormData.status} onChange={(e) => setUserFormData({...userFormData, status: e.target.value})} className="w-full bg-[#0A0F16] border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all">
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">Bekor qilish</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg">Saqlash</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCommandPaletteOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              className="relative bg-white dark:bg-[#13161A] border border-slate-300 dark:border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-white/5">
                <Search size={18} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 mr-3" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search users, projects, or settings..." 
                  className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-lg"
                />
                <span className="text-xs font-mono bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-500 dark:text-slate-400">ESC</span>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick Actions</div>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-indigo-400 rounded-md text-slate-700 dark:text-slate-300 text-sm transition-colors text-left">
                  <Users size={16} className="mr-3" /> Add new user
                </button>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-indigo-400 rounded-md text-slate-700 dark:text-slate-300 text-sm transition-colors text-left">
                  <Settings size={16} className="mr-3" /> System settings
                </button>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-indigo-400 rounded-md text-slate-700 dark:text-slate-300 text-sm transition-colors text-left">
                  <Download size={16} className="mr-3" /> Export monthly report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
    )}
    </AnimatePresence>
  );
};

export default AdminPanel;
