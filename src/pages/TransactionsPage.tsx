import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';
import { TransactionFilterBar } from '../components/transactions/TransactionFilterBar';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionCardList } from '../components/transactions/TransactionCardList';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { ExportDropdown } from '../components/common/ExportDropdown';
import { formatRupiah, formatMonthYear } from '../lib/utils';
import { Plus, ArrowUpDown } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const {
    monthlyTransactions,
    deleteTransaction,
    selectedMonth,
    setIsAddModalOpen,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filter and Search logic (PRD Section 8.8 & 8.9)
  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter((tx) => {
      // Search matching description or category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const descMatch = tx.description?.toLowerCase().includes(query);
        const catMatch = tx.category.toLowerCase().includes(query);
        if (!descMatch && !catMatch) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter && tx.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.transaction_date).getTime();
      const dateB = new Date(b.transaction_date).getTime();
      if (dateA !== dateB) {
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      const createdA = new Date(a.created_at || a.transaction_date).getTime();
      const createdB = new Date(b.created_at || b.transaction_date).getTime();
      return sortOrder === 'desc' ? createdB - createdA : createdA - createdB;
    });
  }, [monthlyTransactions, searchQuery, typeFilter, categoryFilter, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('');
  };

  const handleConfirmDelete = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTx.id);
      setDeletingTx(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Transactions</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar transaksi periode {formatMonthYear(selectedMonth)} ({filteredTransactions.length} transaksi)
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <ExportDropdown label="Export" />

          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            title="Ubah Urutan Tanggal"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TransactionFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onReset={handleResetFilters}
      />

      {/* Filter Summary Badges */}
      {(searchQuery || typeFilter !== 'all' || categoryFilter) && (
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <span>Hasil Pencarian: {filteredTransactions.length} data</span>
          <div className="flex items-center gap-3 font-mono">
            {totalFilteredIncome > 0 && (
              <span className="text-emerald-400">+{formatRupiah(totalFilteredIncome)}</span>
            )}
            {totalFilteredExpense > 0 && (
              <span className="text-rose-400">-{formatRupiah(totalFilteredExpense)}</span>
            )}
          </div>
        </div>
      )}

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          type={searchQuery || typeFilter !== 'all' || categoryFilter ? 'search' : 'transactions'}
          title={searchQuery ? 'Tidak ada transaksi yang cocok' : 'No transactions yet.'}
          description={
            searchQuery
              ? `Tidak ditemukan transaksi untuk kata kunci "${searchQuery}".`
              : 'Start tracking your money today.'
          }
          actionLabel={searchQuery ? 'Clear Filters' : 'Add Transaction'}
          onAction={searchQuery ? handleResetFilters : () => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TransactionTable
              transactions={filteredTransactions}
              onEdit={(tx) => setEditingTx(tx)}
              onDelete={(tx) => setDeletingTx(tx)}
            />
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden">
            <TransactionCardList
              transactions={filteredTransactions}
              onEdit={(tx) => setEditingTx(tx)}
              onDelete={(tx) => setDeletingTx(tx)}
            />
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingTx && (
        <TransactionModal
          isOpen={Boolean(editingTx)}
          onClose={() => setEditingTx(null)}
          editTransaction={editingTx}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleConfirmDelete}
        itemDescription={deletingTx?.description || deletingTx?.category}
        itemAmount={deletingTx?.amount}
        isLoading={isDeleting}
      />
    </div>
  );
};
