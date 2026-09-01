import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../lib/constants';
import { formatRupiah, parseCurrencyInput } from '../../lib/utils';
import { Check, Calendar, Tag, FileText } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction, selectedMonth } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountRaw, setAmountRaw] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or reset form values
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmountRaw(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDescription(editTransaction.description || '');
      setDate(editTransaction.transaction_date);
    } else {
      // Default to today's date if within selectedMonth, or 1st of selectedMonth
      const today = new Date();
      const todayIso = today.toISOString().split('T')[0];
      const defaultDate = todayIso.startsWith(selectedMonth)
        ? todayIso
        : `${selectedMonth}-01`;

      setType('expense');
      setAmountRaw('');
      setCategory('Food');
      setDescription('');
      setDate(defaultDate);
    }
    setError('');
  }, [editTransaction, isOpen, selectedMonth]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Salary');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseCurrencyInput(e.target.value);
    setAmountRaw(numeric > 0 ? numeric.toString() : '');
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amountRaw, 10);

    if (!numericAmount || numericAmount <= 0) {
      setError('Amount is required and must be greater than 0.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, {
          type,
          amount: numericAmount,
          category,
          description: description.trim(),
          transaction_date: date,
        });
      } else {
        await addTransaction({
          type,
          amount: numericAmount,
          category,
          description: description.trim(),
          transaction_date: date,
        });
      }
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayAmountNumber = parseInt(amountRaw || '0', 10);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Transaction'}
      subtitle={editTransaction ? 'Ubah detail transaksi Anda' : 'Tambah pemasukan atau pengeluaran baru'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: [ Expense ] [ Income ] */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Income</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Amount <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
              Rp
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayAmountNumber > 0 ? displayAmountNumber.toLocaleString('id-ID') : ''}
              onChange={handleAmountChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/70 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              autoFocus
            />
          </div>
          {displayAmountNumber > 0 && (
            <p className="text-xs font-mono text-emerald-400 mt-1">
              Terbaca: {formatRupiah(displayAmountNumber, { space: true })}
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Category <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = category.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/60 shadow-sm text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-semibold truncate flex-1">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Input (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Description <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Makan siang, Gojek, Belanja..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Date <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
            {error}
          </p>
        )}

        {/* Action Buttons */}
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting
              ? 'Saving...'
              : editTransaction
              ? 'Save Changes'
              : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
