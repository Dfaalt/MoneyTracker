import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { formatRupiah, formatDate, isRentTransaction } from "../../lib/utils";
import { BarChart3, Home } from "lucide-react";
import { DailyExpenseSummary } from "../../types";

export const DailyExpenseBarChart: React.FC = () => {
  const { dailyExpenseSummaries, selectedMonth, monthlyTransactions } =
    useFinance();
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [excludeRent, setExcludeRent] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect rent / boarding house transactions this month
  const rentExpenses = useMemo(() => {
    return monthlyTransactions.filter(
      (t) => t.type === "expense" && isRentTransaction(t),
    );
  }, [monthlyTransactions]);

  const totalRentAmount = useMemo(() => {
    return rentExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [rentExpenses]);

  const hasRent = rentExpenses.length > 0;

  // Handle auto-dismissal when user taps outside or taps another chart
  useEffect(() => {
    const handleChartActivated = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail !== "daily-bar") {
        setActiveBarIndex(null);
      }
    };

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveBarIndex(null);
      }
    };

    window.addEventListener("chart-activated", handleChartActivated);
    document.addEventListener("pointerdown", handlePointerDownOutside);

    return () => {
      window.removeEventListener("chart-activated", handleChartActivated);
      document.removeEventListener("pointerdown", handlePointerDownOutside);
    };
  }, []);

  // Compute daily chart data with or without rent
  const chartData = useMemo<DailyExpenseSummary[]>(() => {
    if (!hasRent || !excludeRent) {
      return dailyExpenseSummaries;
    }

    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const dayMap = new Map<
      number,
      { expense: number; income: number; count: number }
    >();

    monthlyTransactions.forEach((tx) => {
      // Exclude rent expenses when toggle is active
      if (tx.type === "expense" && isRentTransaction(tx)) {
        return;
      }

      const dayNum = parseInt(tx.transaction_date.split("-")[2], 10);
      const prev = dayMap.get(dayNum) || { expense: 0, income: 0, count: 0 };
      const amt = Number(tx.amount) || 0;
      if (tx.type === "expense") {
        prev.expense += amt;
      } else {
        prev.income += amt;
      }
      prev.count += 1;
      dayMap.set(dayNum, prev);
    });

    const result: DailyExpenseSummary[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${selectedMonth}-${dayStr}`;
      const data = dayMap.get(d) || { expense: 0, income: 0, count: 0 };

      result.push({
        date: dateStr,
        dayLabel: String(d),
        formattedDate: formatDate(dateStr, "short"),
        expense: data.expense,
        income: data.income,
        count: data.count,
      });
    }

    return result;
  }, [
    hasRent,
    excludeRent,
    dailyExpenseSummaries,
    monthlyTransactions,
    selectedMonth,
  ]);

  // Check if there are any expenses to display
  const hasExpenses = chartData.some((d) => d.expense > 0);

  if (!hasExpenses) {
    return (
      <div className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card flex flex-col items-center justify-center min-h-[340px] text-center space-y-3">
        <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">Daily Expense</h4>
        <p className="text-xs text-slate-400 max-w-xs">
          {hasRent && excludeRent
            ? `Pengeluaran bulan ini hanya berupa biaya kos (${formatRupiah(totalRentAmount)}).`
            : "Belum ada data pengeluaran harian pada bulan ini."}
        </p>
        {hasRent && excludeRent && (
          <button
            type="button"
            onClick={() => setExcludeRent(false)}
            className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
          >
            Tampilkan transaksi kos di grafik
          </button>
        )}
      </div>
    );
  }

  // Format Y-axis ticks e.g. Rp20k, Rp40k, Rp60k
  const formatYAxis = (tick: number) => {
    if (tick === 0) return "0";
    if (tick >= 1000000) return `Rp${(tick / 1000000).toFixed(0)}M`;
    if (tick >= 1000) return `Rp${(tick / 1000).toFixed(0)}k`;
    return `Rp${tick}`;
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl glass-card p-6 border border-slate-800 shadow-card space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white tracking-tight">
              Daily Expense
            </h4>
            {hasRent && excludeRent && (
              <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-full font-medium">
                Tanpa Kos
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Tren pengeluaran harian sepanjang {selectedMonth}
          </p>
        </div>

        {hasRent && (
          <button
            type="button"
            onClick={() => {
              setExcludeRent((prev) => !prev);
              setActiveBarIndex(null);
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer select-none self-start sm:self-auto ${
              excludeRent
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 shadow-sm shadow-rose-950/40"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title={
              excludeRent
                ? `Kos (${formatRupiah(totalRentAmount)}) dikecualikan agar grafik harian tidak jomplang. Klik untuk menyertakan.`
                : "Kos disertakan. Klik untuk mengecualikan kos dari grafik."
            }
          >
            <Home className="w-3.5 h-3.5" />
            <span>{excludeRent ? "Kecualikan Kos" : "Sertakan Kos"}</span>
            <div
              className={`w-7 h-4 rounded-full transition-colors duration-200 p-0.5 flex items-center ${
                excludeRent
                  ? "bg-rose-500 justify-end"
                  : "bg-slate-700 justify-start"
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
            </div>
          </button>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            onClick={(state) => {
              if (state && typeof state.activeTooltipIndex === "number") {
                const idx = state.activeTooltipIndex;
                setActiveBarIndex((prev) => (prev === idx ? null : idx));
                window.dispatchEvent(
                  new CustomEvent("chart-activated", { detail: "daily-bar" }),
                );
              }
            }}
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
              active={activeBarIndex !== null ? undefined : false}
              wrapperStyle={{ zIndex: 40, pointerEvents: "none" }}
              content={({ active, payload }) => {
                if (
                  activeBarIndex !== null &&
                  active &&
                  payload &&
                  payload.length
                ) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs space-y-1 backdrop-blur-md">
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
              onClick={(_, index) => {
                setActiveBarIndex((prev) => (prev === index ? null : index));
                window.dispatchEvent(
                  new CustomEvent("chart-activated", { detail: "daily-bar" })
                );
              }}
              onMouseEnter={(_, index) => {
                setActiveBarIndex(index);
                window.dispatchEvent(
                  new CustomEvent("chart-activated", { detail: "daily-bar" })
                );
              }}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              {chartData.map((entry, index) => {
                const isHovered = activeBarIndex === index;
                const hasValue = entry.expense > 0;
                return (
                  <Cell
                    key={`bar-${index}`}
                    fill={
                      hasValue
                        ? isHovered
                          ? "#F43F5E"
                          : "#E11D48"
                        : "#1E293B"
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
