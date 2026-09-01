import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatMonthYear, getBudgetStatusConfig, calculateBudgetStatus } from '../lib/utils';
import { BudgetModal } from '../components/budget/BudgetModal';
import { Plus, Edit3, Calendar } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { budgets, transactions, selectedMonth, setIsBudgetModalOpen } = useFinance();
  const [editingTargetMonth, setEditingTargetMonth] = useState<string | null>(null);

  // Group transactions by month for historical budget progress
  const monthlyExpenseMap = new Map<string, number>();
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const m = tx.transaction_date.slice(0, 7);
      monthlyExpenseMap.set(m, (monthlyExpenseMap.get(m) || 0) + Number(tx.amount));
    }
  });

  // Current active month budget
  const currentBudget = budgets.find((b) => b.month.startsWith(selectedMonth));
  const currentSpent = monthlyExpenseMap.get(selectedMonth) || 0;
  const currentBudgetAmount = currentBudget ? Number(currentBudget.amount) : 0;
  const currentStatus = calculateBudgetStatus(currentSpent, currentBudgetAmount);
  const currentConfig = getBudgetStatusConfig(currentStatus);
  const currentPercentage = currentBudgetAmount > 0 ? Math.round((currentSpent / currentBudgetAmount) * 1000) / 10 : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Budget Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kontrol dan pantau batas pengeluaran bulanan Anda.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTargetMonth(selectedMonth);
            setIsBudgetModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 flex items-center gap-1.5 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{currentBudgetAmount > 0 ? 'Edit Current Budget' : 'Set New Budget'}</span>
        </button>
      </div>

      {/* Hero Active Budget Highlight */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Active Month
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {formatMonthYear(selectedMonth)}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {currentBudgetAmount > 0 ? formatRupiah(currentBudgetAmount) : 'No Budget Set'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              {currentBudgetAmount > 0
                ? `Telah digunakan ${formatRupiah(currentSpent)} (${currentPercentage}%) dari total alokasi budget.`
                : 'Belum ada batas budget untuk bulan ini. Tetapkan limit sekarang untuk memantau pengeluaran.'}
            </p>
          </div>

          {currentBudgetAmount > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center min-w-[200px] text-center space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Remaining</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  currentBudgetAmount - currentSpent < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatRupiah(currentBudgetAmount - currentSpent)}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentConfig.badgeBg}`}>
                {currentConfig.label} ({currentPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar & Status details */}
        {currentBudgetAmount > 0 && (
          <div className="mt-6 space-y-2 pt-6 border-t border-slate-800/80">
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${currentConfig.barGradient}`}
                style={{ width: `${Math.min(currentPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              💡 {currentConfig.message}
            </p>
          </div>
        )}
      </div>

      {/* Historical Budgets List */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>All Configured Monthly Budgets</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spent = monthlyExpenseMap.get(b.month) || 0;
            const limit = Number(b.amount) || 0;
            const pct = limit > 0 ? Math.round((spent / limit) * 1000) / 10 : 0;
            const status = calculateBudgetStatus(spent, limit);
            const cfg = getBudgetStatusConfig(status);
            const isCurrent = b.month.startsWith(selectedMonth);

            return (
              <div
                key={b.id || b.month}
                className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${
                  isCurrent ? 'border-indigo-500/50 shadow-glow-indigo' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-bold text-white">{formatMonthYear(b.month)}</h5>
                    <span className="text-xs font-mono text-slate-400">
                      Limit: <strong className="text-slate-200">{formatRupiah(limit)}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTargetMonth(b.month);
                      setIsBudgetModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Budget"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Mini Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatRupiah(spent)} spent</span>
                    <span className={cfg.color}>{pct}%</span>
                  </div>
                </div>

                <div className={`p-2 rounded-xl text-[11px] flex items-center justify-between border ${cfg.badgeBg}`}>
                  <span>Status: {cfg.label}</span>
                  <span>{limit - spent >= 0 ? `${formatRupiah(limit - spent)} sisa` : 'Over budget'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={Boolean(editingTargetMonth)}
        onClose={() => setEditingTargetMonth(null)}
        targetMonth={editingTargetMonth || selectedMonth}
      />
    </div>
  );
};
