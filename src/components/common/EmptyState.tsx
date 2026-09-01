import React from 'react';
import { Plus, Wallet, FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  type?: 'transactions' | 'budget' | 'search' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'transactions',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  let defaultIcon = FileQuestion;
  let defaultTitle = 'No data available';
  let defaultDesc = 'There is currently no information to display.';
  let defaultAction = 'Add New';

  if (type === 'transactions') {
    defaultIcon = Wallet;
    defaultTitle = 'No transactions yet.';
    defaultDesc = 'Start tracking your money today and take control of your financial freedom.';
    defaultAction = '+ Add Transaction';
  } else if (type === 'budget') {
    defaultIcon = Wallet;
    defaultTitle = 'No budget set for this month.';
    defaultDesc = 'Set a monthly spending limit to monitor and control your expenses.';
    defaultAction = 'Set Budget';
  } else if (type === 'search') {
    defaultIcon = FileQuestion;
    defaultTitle = 'No matching transactions found.';
    defaultDesc = 'Try adjusting your search keywords or filter criteria.';
    defaultAction = 'Clear Filters';
  }

  const Icon = defaultIcon;
  const displayTitle = title || defaultTitle;
  const displayDesc = description || defaultDesc;
  const displayAction = actionLabel || defaultAction;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl glass-card border border-dashed border-slate-800 my-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-emerald">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1.5">{displayTitle}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{displayDesc}</p>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {displayAction}
        </button>
      )}
    </div>
  );
};
