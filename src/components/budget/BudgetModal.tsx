import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { useFinance } from "../../context/FinanceContext";
import {
  formatRupiah,
  parseCurrencyInput,
  formatMonthYear,
} from "../../lib/utils";
import { Target, Calendar } from "lucide-react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMonth?: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  targetMonth,
}) => {
  const { selectedMonth, budgets, setMonthlyBudget } = useFinance();
  const currentMonth = targetMonth || selectedMonth;

  const [month, setMonth] = useState<string>(currentMonth);
  const [amountRaw, setAmountRaw] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const activeMonth = targetMonth || selectedMonth;
    setMonth(activeMonth);
    const existing = budgets.find((b) => b.month.startsWith(activeMonth));
    if (existing && existing.amount > 0) {
      setAmountRaw(existing.amount.toString());
    } else {
      setAmountRaw("3000000"); // Default suggestion 3 Million
    }
    setError("");
  }, [targetMonth, selectedMonth, budgets, isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseCurrencyInput(e.target.value);
    setAmountRaw(numeric > 0 ? numeric.toString() : "");
    if (error) setError("");
  };

  const handleQuickPreset = (presetAmount: number) => {
    setAmountRaw(presetAmount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amountRaw, 10);

    if (isNaN(numericAmount) || numericAmount < 0) {
      setError("Masukkan jumlah budget yang valid (minimal Rp0).");
      return;
    }

    setIsSubmitting(true);
    try {
      await setMonthlyBudget(month, numericAmount);
      onClose();
    } catch (err) {
      console.error("Budget error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayAmountNumber = parseInt(amountRaw || "0", 10);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Budget"
      subtitle={`Tentukan target batas pengeluaran untuk ${formatMonthYear(month)}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Month Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Target Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        {/* Budget Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Budget Limit <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
              Rp
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={
                displayAmountNumber > 0
                  ? displayAmountNumber.toLocaleString("id-ID")
                  : ""
              }
              onChange={handleAmountChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/70 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              autoFocus
            />
          </div>
          {displayAmountNumber > 0 && (
            <p className="text-xs font-mono text-indigo-400 mt-1">
              Terbaca: {formatRupiah(displayAmountNumber, { space: true })}
            </p>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {[1000000, 2000000, 3000000, 5000000, 10000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  displayAmountNumber === preset
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {formatRupiah(preset, { compact: true })}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Saving..." : "Save Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
