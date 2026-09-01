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
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0D131F]/95 border-t border-slate-800/90 backdrop-blur-xl px-1 pt-1.5 pb-2.5">
      <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto relative">
        {/* 1. Home / Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
            activePage === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
          {activePage === 'dashboard' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 -mb-1" />
          )}
        </button>

        {/* 2. Transactions */}
        <button
          onClick={() => onNavigate('transactions')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
            activePage === 'transactions' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Trans.</span>
          {activePage === 'transactions' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 -mb-1" />
          )}
        </button>

        {/* 3. Floating Action Button (+) */}
        <div className="flex items-center justify-center relative">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-2xl shadow-black/80 border-4 border-[#0B0F17] flex items-center justify-center absolute -top-8 hover:scale-105 active:scale-95 transition-all"
            title="Tambah Transaksi Baru"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Budget */}
        <button
          onClick={() => onNavigate('budget')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
            activePage === 'budget' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Budget</span>
          {activePage === 'budget' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 -mb-1" />
          )}
        </button>

        {/* 5. Reports */}
        <button
          onClick={() => onNavigate('reports')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
            activePage === 'reports' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Reports</span>
          {activePage === 'reports' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 -mb-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
