import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import {
  formatMonthYear,
  getPreviousMonth,
  getNextMonth,
} from "../../lib/utils";

export const MonthSelector: React.FC = () => {
  const { selectedMonth, setSelectedMonth } = useFinance();

  const handlePrev = () => {
    setSelectedMonth(getPreviousMonth(selectedMonth));
  };

  const handleNext = () => {
    setSelectedMonth(getNextMonth(selectedMonth));
  };

  const handleMonthInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedMonth(e.target.value);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 sm:p-1.5 shadow-card backdrop-blur-md shrink-0">
      <button
        onClick={handlePrev}
        className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Bulan Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-100">
        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
        <span className="text-xs sm:text-sm font-semibold tracking-tight sm:tracking-wide min-w-[70px] sm:min-w-[130px] text-center select-none whitespace-nowrap">
          <span className="sm:hidden">
            {formatMonthYear(selectedMonth, true)}
          </span>
          <span className="hidden sm:inline">
            {formatMonthYear(selectedMonth, false)}
          </span>
        </span>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthInput}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Pilih Bulan"
        />
      </div>

      <button
        onClick={handleNext}
        className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Bulan Berikutnya"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
