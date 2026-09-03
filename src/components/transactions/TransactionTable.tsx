import React from 'react';
import { Transaction } from '../../types';
import { formatDate, formatRupiah } from '../../lib/utils';
import { ALL_CATEGORIES } from '../../lib/constants';
import { CategoryIcon } from '../common/CategoryIcon';
import { Edit2, Trash2, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl glass-card border border-slate-800 shadow-card">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
          <tr>
            <th className="py-4 px-5">Date</th>
            <th className="py-4 px-4">Type</th>
            <th className="py-4 px-4">Category</th>
            <th className="py-4 px-5">Description</th>
            <th className="py-4 px-5 text-right">Amount</th>
            <th className="py-4 px-5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const cat = ALL_CATEGORIES.find(
              (c) => c.name.toLowerCase() === tx.category.toLowerCase()
            );

            return (
              <tr
                key={tx.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Date */}
                <td className="py-3.5 px-5 font-mono text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(tx.transaction_date, 'short')}
                </td>

                {/* Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {isIncome ? 'Income' : 'Expense'}
                  </span>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200">
                    <CategoryIcon
                      category={tx.category}
                      icon={cat?.icon}
                      size={24}
                      trigger="hover"
                    />
                    <span>{tx.category}</span>
                  </div>
                </td>

                {/* Description */}
                <td className="py-3.5 px-5 font-medium text-white max-w-xs truncate">
                  {tx.description || (
                    <span className="text-slate-500 italic">No description</span>
                  )}
                </td>

                {/* Amount */}
                <td
                  className={`py-3.5 px-5 text-right font-mono font-bold whitespace-nowrap ${
                    isIncome ? 'text-emerald-400' : 'text-slate-100'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatRupiah(tx.amount)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Edit Transaction"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
