import React from 'react';
import { LayoutDashboard, Receipt, Target, BarChart2, Plus } from 'lucide-react';
import { NavPage } from './Sidebar';
import { useFinance } from '../../context/FinanceContext';

interface BottomNavProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { setIsAddModalOpen } = useFinance();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0D131F]/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around relative">
        {/* Home / Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activePage === 'dashboard' ? 'text-theme font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => onNavigate('transactions')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activePage === 'transactions' ? 'text-theme font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] font-medium">Trans.</span>
        </button>

        {/* Floating Action Button (PRD Section 8.4 & 14) */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-13 h-13 p-3.5 rounded-full bg-theme-btn text-white shadow-xl shadow-black/80 border-4 border-[#0D131F] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-glow-theme"
            title="Quick Add Transaction"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Budget */}
        <button
          onClick={() => onNavigate('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activePage === 'budget' ? 'text-theme font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px] font-medium">Budget</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => onNavigate('reports')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activePage === 'reports' ? 'text-theme font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Reports</span>
        </button>
      </div>
    </nav>
  );
};
