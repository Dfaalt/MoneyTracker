import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatMonthYear } from '../lib/utils';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { DailyExpenseBarChart } from '../components/dashboard/DailyExpenseBarChart';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { PieChart as PieIcon } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { summary, categorySummaries, selectedMonth, monthlyTransactions } = useFinance();

  const largestCategory = categorySummaries[0];
  const totalTransactions = monthlyTransactions.length;
  const expenseCount = monthlyTransactions.filter((t) => t.type === 'expense').length;
  const incomeCount = monthlyTransactions.filter((t) => t.type === 'income').length;
  const avgExpensePerTx = expenseCount > 0 ? summary.expense / expenseCount : 0;
  const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expense) / summary.income) * 1000) / 10 : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Financial Reports & Insights</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis mendalam pola pengeluaran dan pemasukan periode {formatMonthYear(selectedMonth)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportDropdown label="Export Laporan" />
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Largest Category</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{largestCategory?.icon || '🏷️'}</span>
            <h4 className="text-xl font-bold text-white truncate">{largestCategory?.category || 'None'}</h4>
          </div>
          <p className="text-xs font-mono text-emerald-400">
            {largestCategory ? `${formatRupiah(largestCategory.total)} (${largestCategory.percentage}%)` : 'Rp0'}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Expense / Trans</span>
          <h4 className="text-xl font-bold text-white font-mono">{formatRupiah(avgExpensePerTx)}</h4>
          <p className="text-xs text-slate-400">{expenseCount} transaksi pengeluaran</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Savings Rate</span>
          <h4 className={`text-xl font-bold font-mono ${savingsRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {savingsRate}%
          </h4>
          <p className="text-xs text-slate-400">
            {savingsRate >= 20 ? 'Pola tabungan sangat baik' : '⚠️ Tingkatkan alokasi tabungan'}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Activity</span>
          <h4 className="text-xl font-bold text-white">{totalTransactions} Transaksi</h4>
          <p className="text-xs text-slate-400">{incomeCount} Income · {expenseCount} Expense</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CategoryDonutChart />
        </div>
        <div className="lg:col-span-6">
          <DailyExpenseBarChart />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="rounded-2xl glass-card border border-slate-800 p-6 space-y-4">
        <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-400" />
          <span>Detailed Category Breakdown</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Transactions</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {categorySummaries.map((cat) => (
                <tr key={cat.category} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.category}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 font-sans">{cat.count}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">{formatRupiah(cat.total)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {cat.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
