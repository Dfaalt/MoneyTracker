import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah } from '../../lib/utils';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { summary } = useFinance();
  const isPositiveBalance = summary.balance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 border border-slate-800/80 shadow-card group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Balance</span>
          <div className={`p-2 rounded-xl ${isPositiveBalance ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${isPositiveBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatRupiah(summary.balance)}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span>Income - Expense</span>
          </p>
        </div>
      </div>

      {/* Income Card */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 border border-slate-800/80 shadow-card group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Income</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white">
            {formatRupiah(summary.income)}
          </h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span>Pemasukan Bulan Ini</span>
          </p>
        </div>
      </div>

      {/* Expense Card */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 border border-slate-800/80 shadow-card group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expense</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold font-mono tracking-tight text-rose-400">
            {formatRupiah(summary.expense)}
          </h3>
          <p className="text-xs text-slate-400">
            <span>Pengeluaran Bulan Ini</span>
          </p>
        </div>
      </div>

      {/* Budget & Remaining Card */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 border border-slate-800/80 shadow-card group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Remaining</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${summary.remainingBudget < 0 ? 'text-rose-400' : 'text-indigo-300'}`}>
            {formatRupiah(summary.remainingBudget)}
          </h3>
          <p className="text-xs text-slate-400">
            Budget: <span className="font-medium text-slate-300">{summary.budget > 0 ? formatRupiah(summary.budget) : 'Belum diatur'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
