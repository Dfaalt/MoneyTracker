import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { MonthSelector } from '../dashboard/MonthSelector';
import { Plus, Wallet, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { setIsAddModalOpen } = useFinance();
  const { user, isDemo, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
      {/* Mobile Brand / Page Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-glow-emerald shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate">
            Money <span className="text-emerald-400">Tracker</span>
          </span>
        </div>

        {/* Desktop Quick Indicator */}
        <div className="hidden lg:flex items-center gap-2">
          {isDemo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Active
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Month Selector + Mobile Profile/Logout + Desktop Add Button */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <MonthSelector />

        {/* Desktop Quick Add Button (PRD Section 8.4) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>

        {/* Mobile User Profile & Logout Menu */}
        <div className="relative lg:hidden" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs hover:bg-emerald-500/30 transition-all"
            title="Profil & Logout"
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-modal border border-slate-700/80 shadow-2xl p-2.5 z-50 animate-scale-in">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || 'demo@moneytracker.app'}
                  </p>
                </div>
              </div>

              {isDemo && (
                <div className="mt-2 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 text-center font-medium">
                  Demo Mode
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 border border-rose-500/20 transition-all active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
