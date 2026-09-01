import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatMonthYear, getBudgetStatusConfig } from '../../lib/utils';
import { Target, AlertTriangle, ShieldCheck, AlertCircle, Edit3 } from 'lucide-react';

export const BudgetProgressBar: React.FC = () => {
  const { summary, selectedMonth, setIsBudgetModalOpen } = useFinance();
  const { budgetProgress } = summary;
  const config = getBudgetStatusConfig(budgetProgress.status);

  let StatusIcon = ShieldCheck;
  if (budgetProgress.status === 'warning' || budgetProgress.status === 'critical') {
    StatusIcon = AlertTriangle;
  } else if (budgetProgress.status === 'exceeded') {
    StatusIcon = AlertCircle;
  }

  // If budget not set for this month
  if (budgetProgress.totalBudget <= 0) {
    return (
      <div className="rounded-2xl glass-card p-5 border border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-slate-800 text-slate-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {formatMonthYear(selectedMonth)} Budget
            </h4>
            <p className="text-xs text-slate-400">No budget set for this month.</p>
          </div>
        </div>
        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all hover:scale-105"
        >
          Set Budget
        </button>
      </div>
    );
  }

  const cappedPercentage = Math.min(Math.max(budgetProgress.percentage, 0), 100);

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {formatMonthYear(selectedMonth)} Budget
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-slate-400">
                <strong className="text-slate-200">{formatRupiah(budgetProgress.spent)}</strong> / {formatRupiah(budgetProgress.totalBudget)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{config.label} ({budgetProgress.percentage}%)</span>
          </div>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit Budget"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${config.barGradient}`}
            style={{ width: `${cappedPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-0.5">
          <span>{budgetProgress.percentage}% used</span>
          <span className={budgetProgress.remaining < 0 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
            {budgetProgress.remaining >= 0
              ? `${formatRupiah(budgetProgress.remaining)} remaining`
              : `${formatRupiah(Math.abs(budgetProgress.remaining))} over budget`}
          </span>
        </div>
      </div>

      {/* Feedback Message */}
      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${config.badgeBg}`}>
        <StatusIcon className="w-4 h-4 flex-shrink-0" />
        <p>{config.message}</p>
      </div>
    </div>
  );
};
