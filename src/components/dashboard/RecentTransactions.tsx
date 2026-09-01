import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types';
import { TransactionTable } from '../transactions/TransactionTable';
import { TransactionCardList } from '../transactions/TransactionCardList';
import { TransactionModal } from '../transactions/TransactionModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { ArrowRight, FilterX } from 'lucide-react';

interface RecentTransactionsProps {
  onNavigateToTransactions?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onNavigateToTransactions,
}) => {
  const {
    monthlyTransactions,
    deleteTransaction,
    setIsAddModalOpen,
    dashboardCategoryFilter,
    setDashboardCategoryFilter,
  } = useFinance();

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filter if user clicked category on Donut chart (PRD Section 8.14)
  const filteredList = dashboardCategoryFilter
    ? monthlyTransactions.filter(
        (t) => t.category.toLowerCase() === dashboardCategoryFilter.toLowerCase()
      )
    : monthlyTransactions;

  const displayList = filteredList.slice(0, 5);

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white tracking-tight">Recent Transactions</h4>
            {dashboardCategoryFilter && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Category: {dashboardCategoryFilter}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {dashboardCategoryFilter
              ? `Menampilkan transaksi kategori ${dashboardCategoryFilter}`
              : 'Daftar transaksi terbaru di bulan ini'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {dashboardCategoryFilter && (
            <button
              onClick={() => setDashboardCategoryFilter(null)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          )}

          {onNavigateToTransactions && (
            <button
              onClick={onNavigateToTransactions}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {displayList.length === 0 ? (
        <EmptyState
          type="transactions"
          title={
            dashboardCategoryFilter
              ? `Belum ada transaksi untuk kategori ${dashboardCategoryFilter}`
              : 'No transactions yet.'
          }
          description="Start tracking your money today and see real-time updates."
          actionLabel="Add Transaction"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TransactionTable
              transactions={displayList}
              onEdit={(tx) => setEditingTx(tx)}
              onDelete={(tx) => setDeletingTx(tx)}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <TransactionCardList
              transactions={displayList}
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

      {/* Delete Confirm Dialog */}
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
