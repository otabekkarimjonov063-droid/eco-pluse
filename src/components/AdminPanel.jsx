import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, Calendar, Activity, Box, Download, Filter, 
  MoreVertical, CheckCircle2, XCircle, Clock, Trash2, Edit, Bell, Search,
  Settings, Shield, List, AlertTriangle, CheckSquare, Square, SearchCode,
  LogOut, Server, Cpu, Database, Command, X, Sliders, ChevronDown, Move
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import CountUp from './CountUp';

// --- MOCK DATA ---
const chartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 6890 },
  { name: 'Jun', amount: 4390 },
  { name: 'Jul', amount: 8490 },
];

const mockUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Moderator', status: 'Active', lastLogin: '1 hour ago' },
  { id: 3, name: 'Mike Ross', email: 'mike@example.com', role: 'User', status: 'Blocked', lastLogin: '3 days ago' },
  { id: 4, name: 'Harvey Specter', email: 'harvey@example.com', role: 'User', status: 'Active', lastLogin: '5 mins ago' },
  { id: 5, name: 'Rachel Zane', email: 'rachel@example.com', role: 'User', status: 'Active', lastLogin: '1 day ago' },
];

const mockActivity = [
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
      <div className="bg-[#1A1D24] border border-white/10 p-3 rounded-lg shadow-xl font-['Inter',sans-serif]">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-indigo-400 font-semibold text-sm">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN ADMIN PANEL ---
const AdminPanel = ({ onExit }) => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const [transactions, setTransactions] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const closeAdmin = () => {
    if (onExit) onExit();
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div 
          key="admin-login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#0D0F12] text-slate-300 font-['Inter',sans-serif] flex items-center justify-center p-4 overflow-hidden"
          style={{ perspective: 1200 }}
        >
          <motion.div animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(99,102,241,0.1)_0%,_transparent_70%)] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -40, rotateX: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative bg-[#13161A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-[0_0_80px_rgba(99,102,241,0.15)] z-10"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
              >
                <Command size={40} className="text-indigo-400" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Portal</h2>
              <p className="text-sm text-slate-400">Tizimni boshqarish uchun kiring</p>
            </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parol</label>
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting (admin)"
                className={`w-full bg-[#0D0F12] border ${error ? 'border-red-500' : 'border-white/10'} text-white rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors`}
              />
              {error && <p className="text-red-400 text-xs mt-2">Noto'g'ri parol kiritildi</p>}
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
               Tizimga kirish
            </button>
          </form>

            <div className="mt-6 text-center">
               <button onClick={closeAdmin} className="text-sm text-slate-500 hover:text-white transition-colors">
                 &larr; Asosiy saytga qaytish
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
          className="fixed inset-0 z-[9999] bg-[#0D0F12] text-slate-300 font-['Inter',sans-serif] flex overflow-hidden"
        >
      
      {/* 1. COMPACT SAAS SIDEBAR */}
      <aside className="w-16 hover:w-64 flex-shrink-0 bg-[#13161A] border-r border-white/5 flex flex-col justify-between transition-all duration-300 group z-50">
        <div>
          <div className="h-16 flex items-center justify-center group-hover:justify-start group-hover:px-4 border-b border-white/5">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shrink-0">
              <Command size={18} className="text-white" />
            </div>
            <span className="ml-3 font-semibold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Eco Admin</span>
          </div>
          
          <nav className="p-2 space-y-1 mt-4">
            {[
              { id: 'overview', icon: Activity, label: 'Overview' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'roles', icon: Shield, label: 'Roles & Perms' },
              { id: 'activity', icon: List, label: 'Audit Log' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-md transition-colors relative ${
                  activeTab === item.id ? 'text-indigo-400 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
        
        <div className="p-2 border-t border-white/5">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center p-3 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors">
            <LogOut size={20} className="shrink-0" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Logout</span>
          </button>
          <button onClick={closeAdmin} className="w-full flex items-center p-3 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-white/5 transition-colors mt-1">
            <X size={20} className="shrink-0" />
            <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0D0F12]">
        
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0D0F12]/80 backdrop-blur-sm shrink-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm text-slate-400 hover:bg-white/10 transition-colors w-64"
            >
              <Search size={14} />
              <span>Search...</span>
              <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded">Ctrl+K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Health Mini Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#13161A] border border-white/5 rounded-md text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-500">API: 42ms</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 text-slate-400 hover:text-white transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0F12]"></span>
              </button>
              
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-[#1A1D24] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#13161A]">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockNotifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-400">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-white/10"></div>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer border border-white/10">
              A
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
                    <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
                    <p className="text-sm text-slate-400">Your SaaS performance at a glance.</p>
                  </div>
                  <button 
                    onClick={() => setIsExportOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm shadow-indigo-500/20"
                  >
                    <Download size={16} /> Export Report
                  </button>
                </div>

                {/* Flat Minimal Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: totalSum, prefix: '$', trend: '+12.5%', color: 'text-indigo-400' },
                    { label: 'Active Projects', value: 12, prefix: '', trend: '0%', color: 'text-slate-300' },
                    { label: 'Total Users', value: 1248, prefix: '', trend: '+18.1%', color: 'text-green-400' },
                    { label: 'System Errors', value: 3, prefix: '', trend: '-2.4%', color: 'text-red-400' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-[#13161A] border border-white/5 rounded-lg p-5 flex flex-col justify-between group cursor-move">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        <Move size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-white tracking-tight">
                          <CountUp value={stat.value} prefix={stat.prefix} duration={1} />
                        </span>
                        <span className={`text-xs font-medium ${stat.color}`}>{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Clean Line Chart */}
                  <div className="lg:col-span-2 bg-[#13161A] border border-white/5 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-semibold text-white">Revenue Dynamics</h3>
                      <select className="bg-[#0D0F12] border border-white/10 text-xs text-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500">
                        <option>This Year</option>
                        <option>Last Year</option>
                      </select>
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
                  <div className="bg-[#13161A] border border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-6">System Health</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 rounded text-indigo-400"><Server size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-300 font-medium">Main Server</p>
                            <p className="text-xs text-slate-500">us-east-1</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">Operational</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Database size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-300 font-medium">PostgreSQL</p>
                            <p className="text-xs text-slate-500">Primary DB</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">99.9% Uptime</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded text-orange-400"><Cpu size={16} /></div>
                          <div>
                            <p className="text-sm text-slate-300 font-medium">Background Workers</p>
                            <p className="text-xs text-slate-500">Queue processing</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded">High Load</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Transactions Table */}
                <div className="bg-[#13161A] border border-white/5 rounded-lg overflow-hidden">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#1A1D24]">
                    <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#0D0F12] text-xs text-slate-500 font-medium border-b border-white/5 uppercase tracking-wider">
                        <tr>
                          <th className="p-4 font-semibold">ID</th>
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Project</th>
                          <th className="p-4 font-semibold text-right">Amount</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.length === 0 ? (
                          <tr><td colSpan="5" className="p-8 text-center text-slate-500">No recent transactions</td></tr>
                        ) : (
                          transactions.slice(0,5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                              <td className="p-4 text-slate-400 font-mono text-xs">#{tx.id.slice(-6)}</td>
                              <td className="p-4 text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                              <td className="p-4 text-slate-200">{tx.project}</td>
                              <td className="p-4 text-right text-slate-200 font-medium">${tx.amount}</td>
                              <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                                  Success
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
                    <p className="text-sm text-slate-400">Manage access and roles across the platform.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#13161A] border border-white/10 text-sm text-slate-200 rounded-md py-1.5 pl-9 pr-3 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <button className="px-3 py-1.5 bg-[#13161A] border border-white/10 rounded-md text-slate-300 hover:bg-white/5 transition-colors">
                      <Filter size={16} />
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
                      Add User
                    </button>
                  </div>
                </div>

                <div className="bg-[#13161A] border border-white/5 rounded-lg overflow-hidden">
                  {selectedUsers.length > 0 && (
                    <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-5 py-2 flex justify-between items-center">
                      <span className="text-xs font-medium text-indigo-400">{selectedUsers.length} selected</span>
                      <div className="flex gap-2">
                        <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-slate-300 transition-colors">Change Role</button>
                        <button className="text-xs bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded text-red-400 transition-colors">Delete</button>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#0D0F12] text-xs text-slate-500 font-medium border-b border-white/5 uppercase tracking-wider">
                        <tr>
                          <th className="p-4 w-12">
                            <button onClick={toggleAllUsers} className="text-slate-500 hover:text-white">
                              {selectedUsers.length === mockUsers.length ? <CheckSquare size={16} className="text-indigo-400" /> : <Square size={16} />}
                            </button>
                          </th>
                          <th className="p-4 font-semibold">User</th>
                          <th className="p-4 font-semibold">Role</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Last Login</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {mockUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                          <tr key={user.id} className={`hover:bg-white/5 transition-colors ${selectedUsers.includes(user.id) ? 'bg-indigo-500/5' : ''}`}>
                            <td className="p-4">
                              <button onClick={() => toggleUserSelection(user.id)} className="text-slate-500 hover:text-white">
                                {selectedUsers.includes(user.id) ? <CheckSquare size={16} className="text-indigo-400" /> : <Square size={16} />}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-200">{user.name}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-300 text-xs font-medium">{user.role}</span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${
                                user.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 text-xs">{user.lastLogin}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors"><Edit size={14} /></button>
                                <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">Audit Trail</h1>
                  <p className="text-sm text-slate-400">Chronological timeline of system events.</p>
                </div>

                <div className="bg-[#13161A] border border-white/5 rounded-lg p-6">
                  <div className="relative border-l border-white/10 ml-3 space-y-8">
                    {mockActivity.map((log, idx) => (
                      <div key={log.id} className="relative pl-6">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-[#13161A] ${
                          log.type === 'create' ? 'bg-green-400' :
                          log.type === 'approve' ? 'bg-indigo-400' :
                          log.type === 'alert' ? 'bg-red-400' : 'bg-slate-400'
                        }`}></div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div>
                            <p className="text-sm text-slate-200">
                              <span className="font-semibold text-white">{log.user}</span> {log.action} <span className="font-medium text-indigo-400">{log.target}</span>
                            </p>
                          </div>
                          <span className="text-xs text-slate-500 whitespace-nowrap">{log.time}</span>
                        </div>
                      </div>
                    ))}
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
                  <h1 className="text-2xl font-bold text-white mb-1">Roles & Permissions</h1>
                  <p className="text-sm text-slate-400">Configure access levels for admin roles.</p>
                </div>

                <div className="bg-[#13161A] border border-white/5 rounded-lg overflow-hidden">
                  <div className="p-5 border-b border-white/5 bg-[#1A1D24] flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white">Administrator Profile</h3>
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors">Save Changes</button>
                  </div>
                  <div className="p-6 space-y-6">
                    {['Manage Users', 'View Financial Reports', 'Edit Site Content', 'System Configuration'].map((perm, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{perm}</p>
                          <p className="text-xs text-slate-500">Allow user to perform actions related to {perm.toLowerCase()}.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked={i !== 3} />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    ))}
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
              className="relative bg-[#13161A] border border-white/10 rounded-xl w-full max-w-md shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Export Report</h2>
                <button onClick={() => setIsExportOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['PDF', 'Excel', 'CSV'].map(fmt => (
                      <button key={fmt} className={`py-2 border rounded-md text-sm font-medium transition-colors ${fmt === 'CSV' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date Range</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm">Download</button>
              </div>
            </motion.div>
          </div>
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
              className="relative bg-[#13161A] border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/5">
                <Search size={18} className="text-slate-400 mr-3" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search users, projects, or settings..." 
                  className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-lg"
                />
                <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-400">ESC</span>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</div>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-md text-slate-300 text-sm transition-colors text-left">
                  <Users size={16} className="mr-3" /> Add new user
                </button>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-md text-slate-300 text-sm transition-colors text-left">
                  <Settings size={16} className="mr-3" /> System settings
                </button>
                <button className="w-full flex items-center px-3 py-2.5 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-md text-slate-300 text-sm transition-colors text-left">
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
