import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { CategoryIcon } from '../common/CategoryIcon';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, TransactionType } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../lib/constants';
import { formatRupiah, parseCurrencyInput } from '../../lib/utils';
import { parseSmartTransaction } from '../../lib/smartParser';
import { Check, Calendar, Tag, FileText, ArrowRight, Zap } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

type TabMode = 'expense' | 'income' | 'smart';

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction, selectedMonth } = useFinance();

  const [activeTab, setActiveTab] = useState<TabMode>('expense');
  const [type, setType] = useState<TransactionType>('expense');
  const [amountRaw, setAmountRaw] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [smartInput, setSmartInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or reset form values
  useEffect(() => {
    if (editTransaction) {
      setActiveTab(editTransaction.type);
      setType(editTransaction.type);
      setAmountRaw(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDescription(editTransaction.description || '');
      setDate(editTransaction.transaction_date);
      setSmartInput('');
    } else {
      // Default to today's date if within selectedMonth, or 1st of selectedMonth
      const today = new Date();
      const todayIso = today.toISOString().split('T')[0];
      const defaultDate = todayIso.startsWith(selectedMonth)
        ? todayIso
        : `${selectedMonth}-01`;

      setActiveTab('expense');
      setType('expense');
      setAmountRaw('');
      setCategory('Food');
      setDescription('');
      setDate(defaultDate);
      setSmartInput('');
    }
    setError('');
  }, [editTransaction, isOpen, selectedMonth]);

  // Live parsing when smartInput changes
  const parsedSmart = parseSmartTransaction(smartInput);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTabChange = (tab: TabMode) => {
    setActiveTab(tab);
    setError('');

    if (tab === 'expense') {
      setType('expense');
      if (INCOME_CATEGORIES.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
        setCategory('Food');
      }
    } else if (tab === 'income') {
      setType('income');
      if (EXPENSE_CATEGORIES.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
        setCategory('Salary');
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseCurrencyInput(e.target.value);
    setAmountRaw(numeric > 0 ? numeric.toString() : '');
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalAmount = 0;
    let finalCategory = category;
    let finalType = type;
    let finalDesc = description.trim();
    const finalDate = date;

    if (activeTab === 'smart') {
      if (!smartInput.trim()) {
        setError('Ketik teks transaksi terlebih dahulu (misal: "makan siang 18k", "gojek 9k").');
        return;
      }
      if (parsedSmart.amount <= 0) {
        setError('Nominal belum terdeteksi. Gunakan format seperti 18k, 18.000, 9k, 50rb, atau 5jt.');
        return;
      }
      finalAmount = parsedSmart.amount;
      finalCategory = parsedSmart.category;
      finalType = parsedSmart.type;
      finalDesc = parsedSmart.description;
    } else {
      finalAmount = parseInt(amountRaw, 10);
      if (!finalAmount || finalAmount <= 0) {
        setError('Amount is required and must be greater than 0.');
        return;
      }
      if (!finalCategory) {
        setError('Please select a category.');
        return;
      }
    }

    if (!finalDate) {
      setError('Please select a date.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, {
          type: finalType,
          amount: finalAmount,
          category: finalCategory,
          description: finalDesc,
          transaction_date: finalDate,
        });
      } else {
        await addTransaction({
          type: finalType,
          amount: finalAmount,
          category: finalCategory,
          description: finalDesc,
          transaction_date: finalDate,
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
      subtitle={
        editTransaction
          ? 'Ubah detail transaksi Anda'
          : 'Tambah transaksi manual atau gunakan Smart Quick Text'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 3 Tabs: [ Expense ] [ Quick Text ] [ Income ] */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange('expense')}
            className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('smart')}
            className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'smart'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/50 scale-[1.02]'
                : 'text-blue-400 hover:text-white hover:bg-blue-950/30'
            }`}
          >
            <span>Quick Text</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('income')}
            className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Income</span>
          </button>
        </div>

        {/* --- TAB CONTENT 1: SMART QUICK TEXT --- */}
        {activeTab === 'smart' ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Ketik Cepat Transaksi
                </span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">
                  auto-detect nominal & kategori
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder='Contoh: "makan siang 18k", "gojek 9k", "gaji 5jt", "kopi 24rb"'
                  value={smartInput}
                  onChange={(e) => {
                    setSmartInput(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3.5 bg-slate-900 border-2 border-blue-500/40 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Live Detected Preview Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  Hasil Deteksi Otomatis:
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    parsedSmart.type === 'income'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {parsedSmart.type === 'income' ? '+ Pemasukan' : '- Pengeluaran'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Kategori</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CategoryIcon category={parsedSmart.category} size={24} trigger="hover" />
                    <span className="truncate">{parsedSmart.category}</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Nominal</span>
                  <span
                    className={`font-mono font-bold truncate text-sm ${
                      parsedSmart.amount > 0
                        ? parsedSmart.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {parsedSmart.amount > 0
                      ? formatRupiah(parsedSmart.amount)
                      : 'Belum terdeteksi'}
                  </span>
                </div>
              </div>

              {parsedSmart.description && (
                <div className="text-xs text-slate-300 flex items-center gap-1.5 px-1 pt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">Deskripsi:</span>
                  <span className="font-medium text-white truncate">"{parsedSmart.description}"</span>
                </div>
              )}
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
          </div>
        ) : (
          /* --- TAB CONTENT 2 & 3: MANUAL EXPENSE / INCOME FORM --- */
          <div className="space-y-4 animate-fade-in">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
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
                      <CategoryIcon
                        category={cat.name}
                        icon={cat.icon}
                        size={28}
                        trigger="hover"
                      />
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
          </div>
        )}

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
            disabled={isSubmitting || (activeTab === 'smart' && parsedSmart.amount <= 0)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              'Saving...'
            ) : activeTab === 'smart' ? (
              <>
                <span>
                  {parsedSmart.amount > 0
                    ? `Simpan (${formatRupiah(parsedSmart.amount)})`
                    : 'Simpan Transaksi'}
                </span>
              </>
            ) : editTransaction ? (
              'Save Changes'
            ) : (
              'Save Transaction'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
