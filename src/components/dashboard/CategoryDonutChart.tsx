import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah } from '../../lib/utils';
import { PieChart as PieIcon, FilterX } from 'lucide-react';

export const CategoryDonutChart: React.FC = () => {
  const { categorySummaries, summary, dashboardCategoryFilter, setDashboardCategoryFilter } = useFinance();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (categorySummaries.length === 0) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Expense by Category</h4>
        <p className="text-xs text-slate-400 max-w-xs">Belum ada pengeluaran pada bulan ini untuk divisualisasikan.</p>
      </div>
    );
  }

  const handlePieClick = (entry: any) => {
    if (dashboardCategoryFilter === entry.category) {
      setDashboardCategoryFilter(null);
    } else {
      setDashboardCategoryFilter(entry.category);
    }
  };

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight">Expense by Category</h4>
          <p className="text-xs text-slate-400">Distribusi pengeluaran berdasarkan kategori</p>
        </div>

        {dashboardCategoryFilter && (
          <button
            onClick={() => setDashboardCategoryFilter(null)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset: {dashboardCategoryFilter}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-6 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{data.icon}</span>
                          <span>{data.category}</span>
                        </div>
                        <div className="text-emerald-400 font-mono font-semibold">
                          {formatRupiah(data.total)}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          {data.percentage}% dari total pengeluaran
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={categorySummaries}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={4}
                dataKey="total"
                nameKey="category"
                onClick={handlePieClick}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                cursor="pointer"
              >
                {categorySummaries.map((entry, index) => {
                  const isSelected = dashboardCategoryFilter === entry.category;
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#0B0F17"
                      strokeWidth={isSelected || isHovered ? 3 : 2}
                      opacity={
                        dashboardCategoryFilter && !isSelected
                          ? 0.35
                          : isHovered
                          ? 1
                          : 0.9
                      }
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Info in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total</span>
            <span className="text-sm font-bold font-mono text-white">
              {formatRupiah(summary.expense, { compact: true })}
            </span>
          </div>
        </div>

        {/* Category Legend & Breakdown */}
        <div className="md:col-span-6 space-y-2 max-h-56 overflow-y-auto pr-1">
          {categorySummaries.map((cat) => {
            const isSelected = dashboardCategoryFilter === cat.category;
            return (
              <div
                key={cat.category}
                onClick={() => setDashboardCategoryFilter(isSelected ? null : cat.category)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border border-slate-700 shadow-sm'
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                  <span className="text-xs font-semibold text-slate-200 truncate">{cat.category}</span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-mono font-medium text-slate-300">
                    {formatRupiah(cat.total)}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
