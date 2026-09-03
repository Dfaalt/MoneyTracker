import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { formatRupiah } from "../../lib/utils";
import { BarChart3 } from "lucide-react";

export const DailyExpenseBarChart: React.FC = () => {
  const { dailyExpenseSummaries, selectedMonth } = useFinance();
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Filter out days with expenses or keep full month sequence
  const hasExpenses = dailyExpenseSummaries.some((d) => d.expense > 0);

  if (!hasExpenses) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-400 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Daily Expense</h4>
        <p className="text-xs text-slate-400 max-w-xs">
          Belum ada data pengeluaran harian pada bulan ini.
        </p>
      </div>
    );
  }

  // Format Y-axis ticks e.g. Rp20k, Rp40k, Rp60k as in PRD Section 8.15
  const formatYAxis = (tick: number) => {
    if (tick === 0) return "0";
    if (tick >= 1000000) return `Rp${(tick / 1000000).toFixed(0)}M`;
    if (tick >= 1000) return `Rp${(tick / 1000).toFixed(0)}k`;
    return `Rp${tick}`;
  };

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card space-y-4">
      <div>
        <h4 className="text-base font-bold text-white tracking-tight">
          Daily Expense
        </h4>
        <p className="text-xs text-slate-400">
          Tren pengeluaran harian sepanjang {selectedMonth}
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyExpenseSummaries}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1E293B"
              vertical={false}
            />
            <XAxis
              dataKey="dayLabel"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              width={55}
            />
            <Tooltip
              cursor={{ fill: "rgba(51, 65, 85, 0.25)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs space-y-1">
                      <div className="font-semibold text-slate-300">
                        {data.formattedDate}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Expense</span>
                        <span className="text-rose-400 font-mono font-bold">
                          {formatRupiah(data.expense)}
                        </span>
                      </div>
                      {data.count > 0 && (
                        <div className="text-[10px] text-slate-400">
                          {data.count} transaksi tercatat
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="expense"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => setActiveBarIndex(index)}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              {dailyExpenseSummaries.map((entry, index) => {
                const isHovered = activeBarIndex === index;
                const hasValue = entry.expense > 0;
                return (
                  <Cell
                    key={`bar-${index}`}
                    fill={
                      hasValue ? (isHovered ? "#F43F5E" : "#E11D48") : "#1E293B"
                    }
                    opacity={hasValue ? (isHovered ? 1 : 0.85) : 0.2}
                    cursor={hasValue ? "pointer" : "default"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
