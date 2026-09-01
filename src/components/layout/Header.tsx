import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { MonthSelector } from '../dashboard/MonthSelector';
import { Plus, Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export const Header: React.FC = () => {
  const { setIsAddModalOpen } = useFinance();
  const { isDemo } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Brand / Page Indicator */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-theme-btn flex items-center justify-center text-white shadow-glow-theme">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">
            Money<span className="text-theme">Tracker</span>
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

      {/* Right Action Section */}
      <div className="flex items-center gap-3">
        <MonthSelector />

        {/* Dynamic Theme Switcher */}
        <ThemeSwitcher />

        {/* Desktop Quick Add Button (PRD Section 8.4) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-btn text-white font-semibold text-sm shadow-lg shadow-black/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
