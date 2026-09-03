import React from "react";
import { Transaction } from "../../types";
import { formatDate, formatRupiah } from "../../lib/utils";
import { ALL_CATEGORIES } from "../../lib/constants";
import { CategoryIcon } from "../common/CategoryIcon";
import { Edit2, Trash2 } from "lucide-react";

interface TransactionCardListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export const TransactionCardList: React.FC<TransactionCardListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-2.5">
      {transactions.map((tx) => {
        const isIncome = tx.type === "income";
        const cat = ALL_CATEGORIES.find(
          (c) => c.name.toLowerCase() === tx.category.toLowerCase(),
        );

        return (
          <div
            key={tx.id}
            className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition-all"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <CategoryIcon
                  category={tx.category}
                  icon={cat?.icon}
                  size={30}
                  trigger="hover"
                />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">
                  {tx.description || tx.category}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                  <span>{tx.category}</span>
                  <span>·</span>
                  <span className="font-mono">
                    {formatDate(tx.transaction_date, "short")}
                  </span>
                </p>
              </div>
            </div>

            {/* Right Amount & Actions */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span
                className={`text-sm font-mono font-bold ${
                  isIncome ? "text-emerald-400" : "text-slate-100"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatRupiah(tx.amount)}
              </span>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(tx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(tx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
