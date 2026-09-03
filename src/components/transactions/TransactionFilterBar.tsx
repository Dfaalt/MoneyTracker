import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ALL_CATEGORIES } from '../../lib/constants';

interface TransactionFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: 'all' | 'expense' | 'income';
  onTypeFilterChange: (val: 'all' | 'expense' | 'income') => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  onReset: () => void;
}

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onReset,
}) => {
  const isFiltered = searchQuery !== '' || typeFilter !== 'all' || categoryFilter !== '';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 rounded-2xl glass-card border border-slate-800 shadow-card">
      {/* Search Input (PRD Section 8.8) */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search transactions (e.g. gojek, makan)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters (PRD Section 8.9) */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value as any)}
          className="px-3 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="expense">Expense Only</option>
          <option value="income">Income Only</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-3 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[150px] truncate"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.emoji || '🏷️'} {cat.name}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-medium"
            title="Reset Filters"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
