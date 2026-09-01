import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart2,
  LogOut,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavPage = 'dashboard' | 'transactions' | 'budget' | 'reports';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { user, isDemo, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as NavPage, label: 'Transactions', icon: Receipt },
    { id: 'budget' as NavPage, label: 'Budget', icon: Target },
    { id: 'reports' as NavPage, label: 'Reports', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-[#0D131F]/90 border-r border-slate-800/80 flex flex-col justify-between p-5 min-h-screen fixed left-0 top-0 z-30 hidden lg:flex backdrop-blur-xl">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-glow-emerald">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">
              Money<span className="text-emerald-400">Tracker</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
              Smart Finance
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Logout Section */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        {isDemo && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span className="leading-tight">Demo Mode: Data disimpan lokal di browser.</span>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
