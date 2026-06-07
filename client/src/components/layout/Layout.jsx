import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Search, Star, User, CheckCircle,
  MessageCircle, LogOut, Menu, X, Sparkles, Shield, ChevronRight, Home, ClipboardList
} from 'lucide-react';




// REPLACE WITH (added Home at top):
const navItems = [
  { to: '/',                icon: Home,             label: 'Home' },
  { to: '/dashboard',       icon: LayoutDashboard,  label: 'Dashboard' },
  { to: '/recommendations', icon: Sparkles,         label: 'AI Recommendations' },
  { to: '/schemes',         icon: Search,           label: 'Browse Schemes' },
  { to: '/saved',           icon: Star,             label: 'Saved Schemes' },
  { to: '/eligibility',     icon: CheckCircle,      label: 'Eligibility Check' },
  { to: '/chat',            icon: MessageCircle,    label: 'AI Assistant' },
  { to: '/tracker',         icon: ClipboardList,   label: 'App Tracker' },
  { to: '/profile',         icon: User,             label: 'My Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profilePct = user?.profileComplete ? 100 :
    (() => {
      const fields = ['age', 'gender', 'state', 'income', 'occupation', 'category', 'education'];
      const filled = fields.filter(f => user?.[f] !== undefined && user?.[f] !== '' && user?.[f] !== null && user?.[f] !== 0);
      return Math.round((filled.length / fields.length) * 100);
    })();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-saffron-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">YS</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-navy-800 text-base leading-none">YojnaSetu</h1>
              <p className="text-xs text-gray-400 mt-0.5">AI Scheme Finder</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} mt-2`}>
              <Shield size={18} />
              <span className="text-sm">Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* Profile card */}
        <div className="p-3 border-t border-gray-100">
          {!user?.profileComplete && (
            <div className="mb-2 p-3 bg-saffron-50 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-saffron-700">Profile {profilePct}%</span>
                <button onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
                  className="text-xs text-saffron-600 hover:underline flex items-center gap-0.5">
                  Complete <ChevronRight size={10} />
                </button>
              </div>
              <div className="w-full bg-saffron-100 rounded-full h-1.5">
                <div className="bg-saffron-600 h-1.5 rounded-full transition-all" style={{ width: `${profilePct}%` }} />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-navy-800">YojnaSetu AI</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
