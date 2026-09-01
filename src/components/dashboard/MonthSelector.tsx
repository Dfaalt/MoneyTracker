import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatMonthYear, getPreviousMonth, getNextMonth } from '../../lib/utils';

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
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-card backdrop-blur-md">
      <button
        onClick={handlePrev}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Bulan Sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-100">
        <Calendar className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-semibold tracking-wide min-w-[130px] text-center select-none">
          {formatMonthYear(selectedMonth)}
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
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Bulan Berikutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
