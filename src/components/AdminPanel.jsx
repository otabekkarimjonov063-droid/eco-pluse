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
import { useAuth } from '../contexts/AuthContext';

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
  { id: 1, name: 'Otabek Karimjonov', email: 'otabekkarimjonov063@gmail.com', role: 'Admin', status: 'Active', lastLogin: 'Hozir' },
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
      <div className="bg-moss/95 border border-white/[0.08] p-3 rounded-lg shadow-xl font-sans text-bone">
        <p className="text-xs text-mist mb-1">{label}</p>
        <p className="text-signal font-semibold text-sm tabular-nums font-mono">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN ADMIN PANEL ---
const AdminPanel = ({ onExit, onOpenLogin }) => {
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin, login: authLogin } = useAuth();
  
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
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
    if (password === 'kemmchik82' || password === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setError(false);
      const { sendTelegramMessage } = await import('../utils/telegram.js');
      await sendTelegramMessage(`🔐 <b>Admin kirdi (Otabek Karimjonov)</b>\n🕒 Vaqt: ${new Date().toLocaleString('uz-UZ')}\n🌐 IP/Device: Tizim paneli`);
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
    localStorage.removeItem('adminLoggedIn');
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
          className="fixed inset-0 z-[9999] bg-ink text-bone font-sans flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* Ambient Background */}
          <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 6, repeat: Infinity }} className="absolute w-[80vw] h-[80vw] bg-[radial-gradient(circle,_rgba(47,176,140,0.12)_0%,_transparent_60%)] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center bg-moss/70 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-2xl shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="w-14 h-14 bg-signal/10 border border-signal/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-signal"
              >
                <Shield size={28} />
              </motion.div>
              <h2 className="text-3xl font-display font-light text-bone mb-1.5 tracking-tight">Eco Admin</h2>
              <p className="text-xs text-mist font-sans">Tizimni boshqarish paneli</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 w-full">
              <div className="relative group">
                <input 
                  type="password" 
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Maxfiy parolni kiriting"
                  className={`w-full bg-ink/60 border ${error ? 'border-red-500' : 'border-white/[0.08] focus:border-signal/50'} text-bone rounded-xl text-center text-sm px-4 py-3 outline-none transition-colors placeholder:text-mist/40 font-sans`}
                />
                {error && <p className="text-red-400 text-xs mt-2 text-center absolute -bottom-5 w-full font-sans">Noto'g'ri parol</p>}
              </div>
              <button type="submit" className="w-full bg-signal text-ink hover:bg-signal/90 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                 Tizimga kirish
              </button>
            </form>

            <div className="mt-8 text-center">
               <button onClick={closeAdmin} className="text-xs text-mist hover:text-bone uppercase tracking-widest transition-colors flex items-center gap-2 font-mono">
                 <X size={14} /> Asosiy saytga qaytish
               </button>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="admin-dashboard"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-ink text-bone font-sans flex overflow-hidden"
        >
      
      {/* 1. COMPACT SAAS SIDEBAR */}
      <aside className="w-16 hover:w-64 flex-shrink-0 bg-moss/80 border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 group z-50 backdrop-blur-xl">
        <div>
          <div className="h-16 flex items-center justify-center group-hover:justify-start group-hover:px-4 border-b border-white/[0.08]">
            <div className="w-8 h-8 bg-signal/15 border border-signal/20 rounded flex items-center justify-center shrink-0">
              <Command size={18} className="text-signal" />
            </div>
            <span className="ml-3 font-display font-light text-bone truncate opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-base">Eco Admin</span>
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
                className={`w-full flex items-center p-3 rounded-lg transition-colors relative ${
                  activeTab === item.id ? 'text-signal bg-white/[0.04]' : 'text-mist hover:text-bone hover:bg-white/[0.02]'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="adminSidebarActive" className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-signal" />
                )}
                <item.icon size={18} className="shrink-0" />
                <span className="ml-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-2 border-t border-white/[0.08]">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-mist hover:text-red-400 hover:bg-white/[0.02] transition-colors">
            <LogOut size={18} className="shrink-0" />
            <span className="ml-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans">{tAdmin('logout')}</span>
          </button>
          <button onClick={closeAdmin} className="w-full flex items-center p-3 rounded-lg text-mist hover:text-signal hover:bg-white/[0.02] transition-colors mt-1">
            <X size={18} className="shrink-0" />
            <span className="ml-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans">{tAdmin('exit')}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-ink">
        
        {/* HEADER */}
        <header className="h-14 border-b border-white/[0.08] flex items-center justify-between px-6 bg-moss/70 backdrop-blur-md shrink-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-ink/60 border border-white/[0.08] rounded-lg text-xs text-mist hover:border-signal/30 hover:text-bone transition-colors w-64"
            >
              <Search size={14} />
              <span>Search...</span>
              <span className="ml-auto text-[10px] font-mono bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded text-mist">Ctrl+K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Health Mini Widget */}
            <div className="flex items-center gap-2 px-3 py-1 bg-ink/60 border border-white/[0.08] rounded-lg text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
              </span>
              <span className="text-signal">API: 42ms</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-ink/60 border border-white/[0.08] rounded-lg p-0.5">
              {['UZ', 'RU', 'EN'].map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[10px] font-mono font-medium rounded transition-colors ${language === lang ? 'bg-signal text-ink font-semibold' : 'text-mist hover:text-bone'}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-1.5 text-mist hover:text-bone transition-colors rounded-lg border border-white/[0.08] bg-ink/60"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-1.5 text-mist hover:text-bone transition-colors relative rounded-lg border border-white/[0.08] bg-ink/60">
                <Bell size={16} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-ember rounded-full"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-moss border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 text-bone"
                  >
                    <div className="p-3 border-b border-white/[0.08] flex justify-between items-center bg-moss/90">
                      <h4 className="text-xs font-semibold text-bone font-sans">{tAdmin('notifications')}</h4>
                      <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-[11px] text-signal hover:underline font-mono">{tAdmin('mark_read')}</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                      {notifications.map(n => (
                        <div key={n.id} onClick={() => setReplyingNotifId(replyingNotifId === n.id ? null : n.id)} className={`p-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${!n.read ? 'bg-signal/[0.03]' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium text-bone font-sans">{tAdmin(`notif_title_${n.id}`)}</span>
                            <span className="text-[10px] text-mist/60 font-mono">{tAdmin(`notif_time_${n.id}`)}</span>
                          </div>
                          <p className="text-xs text-mist font-sans">{tAdmin(`notif_desc_${n.id}`)}</p>
                          
                          <AnimatePresence>
                            {replyingNotifId === n.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden">
                                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                                  <input type="text" placeholder="Izoh/Javob yozish..." className="flex-1 bg-ink/70 text-xs text-bone rounded-lg px-3 py-1.5 outline-none border border-white/[0.08] focus:border-signal/40" onClick={(e) => e.stopPropagation()} />
                                  <button className="bg-signal text-ink p-1.5 rounded-lg hover:bg-signal/90 transition-colors" onClick={(e) => { e.stopPropagation(); setReplyingNotifId(null); }}><ArrowRight size={14} /></button>
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

            <div className="w-px h-5 bg-white/[0.08]"></div>
            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.1] text-signal font-mono text-xs font-semibold flex items-center justify-center cursor-pointer hover:border-signal/40 transition-all"
              >
                {user?.name ? user.name[0].toUpperCase() : 'O'}
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-moss border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 py-2 text-bone font-sans"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08] mb-1">
                      <p className="text-sm font-medium text-bone">{user?.name || 'Otabek Karimjonov'}</p>
                      <p className="text-xs text-mist font-mono mt-0.5">{user?.email || 'otabekkarimjonov063@gmail.com'}</p>
                    </div>
                    
                    <button onClick={() => { setActiveTab('users'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-mist hover:text-bone hover:bg-white/[0.04] transition-colors">
                      <User size={15} className="text-signal" /> Profilim
                    </button>
                    <button onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-mist hover:text-bone hover:bg-white/[0.04] transition-colors">
                      <Settings size={15} className="text-signal" /> Sozlamalar
                    </button>
                    
                    <div className="h-px bg-white/[0.08] my-1" />
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={15} /> Tizimdan chiqish
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
                    <h1 className="text-2xl font-display font-light text-bone mb-1">{tAdmin('overview_title')}</h1>
                    <p className="text-xs text-mist font-sans">{tAdmin('overview_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setIsExportOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-moss/80 border border-white/[0.08] hover:border-signal/40 text-bone hover:text-signal text-xs font-mono rounded-lg transition-colors"
                  >
                    <Download size={14} /> {tAdmin('export_report')}
                  </button>
                </div>

                {/* Compact SaaS Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: tAdmin('total_revenue'), value: totalSum, prefix: '$', trend: '+12.5%', color: 'text-signal' },
                    { label: tAdmin('active_projects'), value: 12, prefix: '', trend: '0%', color: 'text-mist' },
                    { label: tAdmin('total_users_stat'), value: 1248, prefix: '', trend: '+18.1%', color: 'text-signal' },
                    { label: tAdmin('system_errors'), value: 3, prefix: '', trend: '-2.4%', color: 'text-ember' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-moss/50 border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-mono text-mist uppercase tracking-wider">{stat.label}</span>
                        <Move size={12} className="text-mist/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-display font-light text-bone tracking-tight tabular-nums">
                          <CountUp value={stat.value} prefix={stat.prefix} duration={1} />
                        </span>
                        <span className={`text-xs font-mono tabular-nums ${stat.color}`}>{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Clean Line Chart */}
                  <div className="lg:col-span-2 bg-moss/50 border border-white/[0.08] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('revenue_dynamics')}</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                          className="bg-ink/50 border border-white/[0.08] text-xs text-bone rounded px-3 py-1 outline-none hover:border-signal/40 transition-colors flex items-center gap-2 font-mono"
                        >
                          {tAdmin(selectedYear)} <ChevronDown size={13} />
                        </button>
                        <AnimatePresence>
                          {isYearDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-full mt-1 w-32 bg-moss border border-white/[0.08] rounded-lg shadow-xl overflow-hidden z-20"
                            >
                              <button onClick={() => { setSelectedYear('this_year'); setIsYearDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.04] transition-colors font-mono ${selectedYear === 'this_year' ? 'text-signal font-bold' : 'text-mist'}`}>{tAdmin('this_year')}</button>
                              <button onClick={() => { setSelectedYear('last_year'); setIsYearDropdownOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.04] transition-colors font-mono ${selectedYear === 'last_year' ? 'text-signal font-bold' : 'text-mist'}`}>{tAdmin('last_year')}</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8c9a92', fontFamily: 'JetBrains Mono' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8c9a92', fontFamily: 'JetBrains Mono' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                          <Line type="monotone" dataKey="amount" stroke="#9bf0b8" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#9bf0b8', stroke: '#040908', strokeWidth: 2 }} animationDuration={1000} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* System Health Widget */}
                  <div className="bg-moss/50 border border-white/[0.08] rounded-xl p-5">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-mist mb-6">{tAdmin('system_health')}</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/[0.04] border border-white/[0.08] rounded text-signal"><Server size={16} /></div>
                          <div>
                            <p className="text-xs font-medium text-bone font-sans">{tAdmin('main_server')}</p>
                            <p className="text-[10px] text-mist font-mono">us-east-1</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-signal bg-signal/10 border border-signal/20 px-2 py-0.5 rounded">{tAdmin('operational')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/[0.04] border border-white/[0.08] rounded text-signal"><Database size={16} /></div>
                          <div>
                            <p className="text-xs font-medium text-bone font-sans">PostgreSQL</p>
                            <p className="text-[10px] text-mist font-mono">{tAdmin('primary_db')}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-signal bg-signal/10 border border-signal/20 px-2 py-0.5 rounded">99.9% {tAdmin('uptime')}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/[0.04] border border-white/[0.08] rounded text-ember"><Cpu size={16} /></div>
                          <div>
                            <p className="text-xs font-medium text-bone font-sans">{tAdmin('bg_workers')}</p>
                            <p className="text-[10px] text-mist font-mono">{tAdmin('queue_proc')}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-ember bg-ember/10 border border-ember/20 px-2 py-0.5 rounded">{tAdmin('high_load')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Transactions Table with Sticky Header */}
                <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/[0.08] flex justify-between items-center bg-moss/70">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('recent_transactions')}</h3>
                    <button className="text-xs text-signal hover:underline font-mono">{tAdmin('view_all')}</button>
                  </div>
                  <div className="overflow-x-auto max-h-[340px]">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="sticky top-0 bg-moss z-10 text-[11px] font-mono text-mist border-b border-white/[0.08] uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5 font-normal">{tAdmin('th_id')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_date')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_project')}</th>
                          <th className="p-3.5 font-normal text-right">{tAdmin('th_amount')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {transactions.length === 0 ? (
                          <tr><td colSpan="5" className="p-8 text-center text-mist">{tAdmin('no_recent_transactions')}</td></tr>
                        ) : (
                          transactions.slice(0,5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-3.5 text-mist font-mono text-xs">#{tx.id.slice(-6)}</td>
                              <td className="p-3.5 text-mist font-mono">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="p-3.5 text-bone">{tx.project}</td>
                              <td className="p-3.5 text-right text-bone font-mono tabular-nums">${tx.amount}</td>
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-signal/10 text-signal border border-signal/20 uppercase tracking-wider">
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
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                  <div>
                    <h1 className="text-2xl font-display font-light text-bone mb-1">{tAdmin('users_title')}</h1>
                    <p className="text-xs text-mist font-sans">{tAdmin('users_desc')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                      <input 
                        type="text" 
                        placeholder={tAdmin('search_users')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-moss/50 border border-white/[0.08] text-xs text-bone rounded-xl py-2.5 pl-10 pr-3.5 outline-none focus:border-signal/40 transition-all font-sans placeholder:text-mist/50"
                      />
                    </div>
                    <button className="px-3 py-2.5 bg-moss/50 border border-white/[0.08] rounded-xl text-mist hover:text-bone hover:border-signal/30 transition-all flex items-center justify-center">
                      <Filter size={15} />
                    </button>
                    <button onClick={openAddUserModal} className="px-4 py-2.5 bg-signal hover:bg-signal/90 text-ink text-xs font-medium rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 font-sans">
                      <Users size={15} /> {tAdmin('add_user')}
                    </button>
                  </div>
                </div>

                <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative">
                  {selectedUsers.length > 0 && (
                    <div className="bg-signal/10 border-b border-signal/20 px-4 py-2.5 flex justify-between items-center">
                      <span className="text-xs font-mono text-signal flex items-center gap-2">
                        <CheckSquare size={14} /> {selectedUsers.length} {tAdmin('users_selected')}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={changeSelectedRole} className="text-xs font-mono bg-moss/80 hover:bg-moss px-3 py-1.5 rounded-lg text-bone transition-all border border-white/[0.08]">{tAdmin('change_role')}</button>
                        <button onClick={deleteSelectedUsers} className="text-xs font-mono bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-red-400 transition-all border border-red-500/20">{tAdmin('delete_btn')}</button>
                      </div>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto max-h-[480px]">
                    <table className="w-full text-left text-xs whitespace-nowrap font-sans">
                      <thead className="sticky top-0 bg-moss z-10 text-[11px] font-mono text-mist border-b border-white/[0.08] uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5 w-12 text-center">
                            <button onClick={toggleAllUsers} className="text-mist hover:text-bone transition-colors">
                              {selectedUsers.length === users.length && users.length > 0 ? <CheckSquare size={16} className="text-signal" /> : <Square size={16} />}
                            </button>
                          </th>
                          <th className="p-3.5 font-normal">{tAdmin('th_user')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_role')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_status')}</th>
                          <th className="p-3.5 font-normal">{tAdmin('th_last_login')}</th>
                          <th className="p-3.5 text-right font-normal">{tAdmin('th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => {
                          const isSelected = selectedUsers.includes(user.id);
                          const initials = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                          
                          return (
                            <tr key={user.id} className={`group hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-signal/[0.04]' : ''}`}>
                              <td className="p-3.5 text-center">
                                <button onClick={() => toggleUserSelection(user.id)} className={`transition-colors ${isSelected ? 'text-signal' : 'text-mist/50 group-hover:text-mist'}`}>
                                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                </button>
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-mono font-medium text-xs text-signal">
                                    {initials}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-bone group-hover:text-signal transition-colors">{user.name}</span>
                                    <span className="text-[11px] text-mist font-mono">{user.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  user.role === 'Admin' ? 'bg-signal/10 text-signal border border-signal/20' :
                                  user.role === 'Moderator' ? 'bg-ember/10 text-ember border border-ember/20' :
                                  'bg-white/[0.04] text-mist border border-white/[0.08]'
                                }`}>
                                  {user.role === 'Admin' ? tAdmin('role_admin') : user.role === 'Moderator' ? tAdmin('role_moderator') : tAdmin('role_user')}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                                  user.status === 'Active' ? 'bg-signal/10 text-signal border border-signal/20' : 
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-signal animate-pulse' : 'bg-red-400'}`}></span>
                                  {user.status === 'Active' ? tAdmin('status_active') : tAdmin('status_blocked')}
                                </span>
                              </td>
                              <td className="p-3.5 text-mist font-mono text-xs">{tTime(user.lastLogin)}</td>
                              <td className="p-3.5 text-right">
                                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => deleteUser(user.id)} className="p-1.5 text-mist hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AUDIT LOGS VIEW */}
            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-display font-light text-bone mb-1">{tAdmin('audit_title')}</h1>
                  <p className="text-xs text-mist font-sans">{tAdmin('audit_desc')}</p>
                </div>

                <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative p-6 md:p-8">
                  <div className="relative border-l border-white/[0.08] ml-4 md:ml-6 space-y-6 md:space-y-8">
                    {activity.map((log) => {
                      const initials = log.user === 'System' ? 'S' : log.user.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                      
                      return (
                        <div key={log.id} className="relative pl-6 md:pl-8 group">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[7px] top-4 w-3.5 h-3.5 rounded-full border-2 border-ink ${
                            log.type === 'create' ? 'bg-signal' :
                            log.type === 'approve' ? 'bg-signal' :
                            log.type === 'alert' ? 'bg-ember' : 'bg-mist'
                          }`}></div>
                          
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-ink/40 p-4 rounded-xl border border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] text-bone font-mono text-xs flex items-center justify-center font-medium shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="text-xs text-bone font-sans leading-relaxed">
                                  <span className="font-medium text-bone">{log.user}</span>{' '}
                                  <span className="text-mist">{log.action}</span>{' '}
                                  <span className="text-signal font-medium">{log.target}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-mist bg-moss/80 px-3 py-1 rounded-lg shrink-0 border border-white/[0.08]">{log.time}</span>
                          </div>
                        </div>
                      );
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
                  <h1 className="text-2xl font-display font-light text-bone mb-1">{tAdmin('roles_title')}</h1>
                  <p className="text-xs text-mist font-sans">{tAdmin('roles_desc')}</p>
                </div>

                <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden font-sans">
                  <div className="p-4 border-b border-white/[0.08] bg-moss/70 flex justify-between items-center">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('admin_profile')}</h3>
                    <button className="text-xs bg-signal text-ink hover:bg-signal/90 font-medium px-3.5 py-1.5 rounded-lg transition-colors">{tAdmin('save_changes')}</button>
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
                          <p className="text-xs font-medium text-bone">{perm.title}</p>
                          <p className="text-[11px] text-mist">{perm.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked={i !== 3} />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-signal"></div>
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
                className="max-w-4xl mx-auto space-y-6 font-sans"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-display font-light text-bone mb-1">{tAdmin('settings_title')}</h1>
                  <p className="text-xs text-mist font-sans">{tAdmin('settings_desc')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* General Config */}
                  <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/[0.08] bg-moss/70 flex items-center gap-2.5">
                      <div className="p-1.5 bg-signal/10 text-signal rounded-lg"><Sliders size={16} /></div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('general_config')}</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1.5">{tAdmin('site_name')}</label>
                        <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1.5">{tAdmin('contact_email')}</label>
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1.5">{tAdmin('timezone')}</label>
                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans">
                          <option>Asia/Tashkent (UTC+5)</option>
                          <option>Europe/London (UTC+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/[0.08] bg-moss/70 flex items-center gap-2.5">
                      <div className="p-1.5 bg-signal/10 text-signal rounded-lg"><Shield size={16} /></div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('security')}</h3>
                    </div>
                    <div className="p-5 space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-bone mb-0.5">{tAdmin('two_factor')}</p>
                          <p className="text-[11px] text-mist">{tAdmin('two_factor_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-signal"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* API & Integrations */}
                  <div className="bg-moss/50 border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/[0.08] bg-moss/70 flex items-center gap-2.5">
                      <div className="p-1.5 bg-signal/10 text-signal rounded-lg"><Server size={16} /></div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-mist">{tAdmin('api_integrations')}</h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1.5">{tAdmin('openai_key')}</label>
                        <div className="relative">
                          <input type={showOpenaiKey ? "text" : "password"} value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 pr-9 text-xs text-bone focus:border-signal/40 outline-none transition-all font-mono" />
                          <button onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-signal transition-colors">
                            {showOpenaiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1.5">{tAdmin('telegram_token')}</label>
                        <div className="relative">
                          <input type={showTelegramToken ? "text" : "password"} value={telegramToken} onChange={(e) => setTelegramToken(e.target.value)} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 pr-9 text-xs text-bone focus:border-signal/40 outline-none transition-all font-mono" />
                          <button onClick={() => setShowTelegramToken(!showTelegramToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-signal transition-colors">
                            {showTelegramToken ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-moss/50 border border-red-500/20 rounded-xl overflow-hidden relative">
                    <div className="p-4 border-b border-red-500/10 bg-moss/70 flex items-center gap-2.5">
                      <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg"><AlertTriangle size={16} /></div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-red-400">{tAdmin('danger_zone')}</h3>
                    </div>
                    <div className="p-5 space-y-5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-bone mb-0.5">{tAdmin('maintenance_mode')}</p>
                          <p className="text-[11px] text-mist">{tAdmin('maintenance_desc')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      
                      <div className="pt-3.5 border-t border-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-bone mb-0.5">{tAdmin('factory_reset')}</p>
                          <p className="text-[11px] text-mist">{tAdmin('factory_reset_desc')}</p>
                        </div>
                        <button onClick={handleFactoryReset} className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-mono rounded-lg transition-colors shrink-0 border border-red-500/20">
                          Reset All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Action Button for saving */}
                  <div className="lg:col-span-2 flex justify-end mt-2">
                    <button onClick={handleSaveSettings} disabled={isSavingSettings} className="px-6 py-2.5 bg-signal hover:bg-signal/90 disabled:opacity-50 text-ink text-xs font-medium rounded-xl shadow-sm transition-all flex items-center gap-2">
                      {isSavingSettings ? <Activity className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
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
              className="relative bg-moss border border-white/[0.08] rounded-xl w-full max-w-md shadow-2xl p-6 text-bone font-sans"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-display font-light text-bone">Export Report</h2>
                <button onClick={() => setIsExportOpen(false)} className="text-mist hover:text-bone transition-colors"><X size={18}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['PDF', 'Excel', 'CSV'].map(fmt => (
                      <button key={fmt} className={`py-2 border rounded-lg text-xs font-mono transition-colors ${fmt === 'CSV' ? 'bg-signal/10 border-signal/30 text-signal' : 'bg-ink/60 border-white/[0.08] text-mist hover:text-bone'}`}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-2">Date Range</label>
                  <select className="w-full bg-ink/60 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-bone outline-none focus:border-signal/40 font-sans">
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button onClick={() => setIsExportOpen(false)} className="px-3.5 py-1.5 text-xs text-mist hover:text-bone transition-colors font-mono">Cancel</button>
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
                  className="px-4 py-2 bg-signal text-ink hover:bg-signal/90 text-xs font-medium rounded-lg transition-colors shadow-sm font-sans"
                >
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Add/Edit Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-moss border border-white/[0.08] w-full max-w-md rounded-xl shadow-2xl overflow-hidden text-bone font-sans"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/[0.08] bg-moss/70">
                <h3 className="text-base font-display font-light text-bone">{editingUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}</h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-mist hover:text-bone transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={saveUser} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase mb-1.5">Ism</label>
                  <input required type="text" value={userFormData.name} onChange={(e) => setUserFormData({...userFormData, name: e.target.value})} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase mb-1.5">Email</label>
                  <input required type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1.5">Rol</label>
                    <select value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value})} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans">
                      <option value="User">User</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1.5">Holat</label>
                    <select value={userFormData.status} onChange={(e) => setUserFormData({...userFormData, status: e.target.value})} className="w-full bg-ink/60 border border-white/[0.08] rounded-lg p-2.5 text-xs text-bone focus:border-signal/40 outline-none transition-all font-sans">
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2.5">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-3.5 py-1.5 text-xs text-mist hover:text-bone transition-colors font-mono">Bekor qilish</button>
                  <button type="submit" className="px-4 py-2 bg-signal hover:bg-signal/90 text-ink text-xs font-medium rounded-lg transition-colors shadow-sm font-sans">Saqlash</button>
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
              className="relative bg-moss border border-white/[0.08] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-bone font-sans"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/[0.08]">
                <Search size={16} className="text-mist mr-3" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search users, projects, or settings..." 
                  className="flex-1 bg-transparent border-none outline-none text-bone placeholder:text-mist/50 text-sm font-sans"
                />
                <span className="text-[10px] font-mono bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded text-mist">ESC</span>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-mono text-mist uppercase tracking-wider">Quick Actions</div>
                <button onClick={() => { setActiveTab('users'); setIsCommandPaletteOpen(false); openAddUserModal(); }} className="w-full flex items-center px-3 py-2 hover:bg-white/[0.04] hover:text-signal rounded-lg text-mist text-xs transition-colors text-left font-sans">
                  <Users size={15} className="mr-3 text-signal" /> Add new user
                </button>
                <button onClick={() => { setActiveTab('settings'); setIsCommandPaletteOpen(false); }} className="w-full flex items-center px-3 py-2 hover:bg-white/[0.04] hover:text-signal rounded-lg text-mist text-xs transition-colors text-left font-sans">
                  <Settings size={15} className="mr-3 text-signal" /> System settings
                </button>
                <button onClick={() => { setIsCommandPaletteOpen(false); setIsExportOpen(true); }} className="w-full flex items-center px-3 py-2 hover:bg-white/[0.04] hover:text-signal rounded-lg text-mist text-xs transition-colors text-left font-sans">
                  <Download size={15} className="mr-3 text-signal" /> Export monthly report
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
