import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Check,
  Tag,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../../lib/constants";
import { CategoryIcon } from "../common/CategoryIcon";

interface TransactionFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: "all" | "expense" | "income";
  onTypeFilterChange: (val: "all" | "expense" | "income") => void;
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
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const isFiltered =
    searchQuery !== "" || typeFilter !== "all" || categoryFilter !== "";

  const selectedCategoryObj = ALL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryFilter.toLowerCase(),
  );

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCategory = (catName: string) => {
    onCategoryFilterChange(catName);
    setIsCategoryOpen(false);
  };

  const handleSelectType = (type: "all" | "expense" | "income") => {
    onTypeFilterChange(type);
    setIsTypeOpen(false);
  };

  // Helper for type trigger icon & label
  const renderTypeTrigger = () => {
    if (typeFilter === "expense") {
      return (
        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Expense</span>
        </span>
      );
    }
    if (typeFilter === "income") {
      return (
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Income</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-slate-300">
        <Layers className="w-3.5 h-3.5 text-slate-400" />
        <span>All Types</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 rounded-2xl glass-card border border-slate-800 shadow-card relative z-30">
      {/* Search Input */}
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
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Custom Type Popover Dropdown */}
        <div className="relative" ref={typeDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsTypeOpen((prev) => !prev);
              setIsCategoryOpen(false);
            }}
            className={`px-3 py-2 bg-slate-900/90 border rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              typeFilter !== "all"
                ? "border-emerald-500/60 text-white bg-slate-800/90 shadow-sm"
                : "border-slate-700/60 text-slate-200 hover:bg-slate-800/70"
            } ${isTypeOpen ? "ring-2 ring-emerald-500/40 border-emerald-500/60" : ""}`}
          >
            {renderTypeTrigger()}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isTypeOpen ? "rotate-180 text-emerald-400" : ""
              }`}
            />
          </button>

          {/* Type Popover Menu */}
          {isTypeOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 rounded-2xl bg-slate-900/98 border border-slate-700/90 shadow-2xl shadow-black/90 p-1.5 z-50 animate-scale-in backdrop-blur-xl">
              <div className="space-y-1">
                {/* Reset to All Types (only when filtered) */}
                {typeFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => handleSelectType("all")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 transition-colors border-b border-slate-800/80 mb-1 pb-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span>Show All Types</span>
                    </div>
                  </button>
                )}

                {/* Expense Only */}
                <button
                  type="button"
                  onClick={() => handleSelectType("expense")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    typeFilter === "expense"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    </div>
                    <span>Expense Only</span>
                  </div>
                  {typeFilter === "expense" && (
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </button>

                {/* Income Only */}
                <button
                  type="button"
                  onClick={() => handleSelectType("income")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    typeFilter === "income"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <span>Income Only</span>
                  </div>
                  {typeFilter === "income" && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Category Dropdown with Lordicon */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen((prev) => !prev);
              setIsTypeOpen(false);
            }}
            className={`px-3 py-2 bg-slate-900/90 border rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              categoryFilter
                ? "border-emerald-500/60 text-white bg-slate-800/90 shadow-sm"
                : "border-slate-700/60 text-slate-200 hover:bg-slate-800/70"
            } ${isCategoryOpen ? "ring-2 ring-emerald-500/40 border-emerald-500/60" : ""}`}
          >
            {selectedCategoryObj ? (
              <span className="flex items-center gap-1.5 min-w-0 max-w-[140px] truncate">
                <CategoryIcon
                  category={selectedCategoryObj.name}
                  icon={selectedCategoryObj.icon}
                  size={20}
                  trigger="hover"
                />
                <span className="truncate">{selectedCategoryObj.name}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>All Categories</span>
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isCategoryOpen ? "rotate-180 text-emerald-400" : ""
              }`}
            />
          </button>

          {/* Category Popover Menu */}
          {isCategoryOpen && (
            <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-2xl bg-slate-900/98 border border-slate-700/90 shadow-2xl shadow-black/90 p-2 z-50 animate-scale-in backdrop-blur-xl">
              {/* Reset to All Categories (only when a specific category is selected) */}
              {categoryFilter !== "" && (
                <button
                  type="button"
                  onClick={() => handleSelectCategory("")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 transition-colors border-b border-slate-800/80 mb-2 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Show All Categories</span>
                  </div>
                </button>
              )}

              {/* Expense Section */}
              <div>
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400/90">
                  Expense Categories
                </p>
                <div className="space-y-0.5 mt-0.5">
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const isSelected =
                      categoryFilter.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors group ${
                          isSelected
                            ? "bg-slate-800 border border-emerald-500/50 text-white font-semibold"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CategoryIcon
                            category={cat.name}
                            icon={cat.icon}
                            size={22}
                            trigger="hover"
                          />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Income Section */}
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">
                  Income Categories
                </p>
                <div className="space-y-0.5 mt-0.5">
                  {INCOME_CATEGORIES.map((cat) => {
                    const isSelected =
                      categoryFilter.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors group ${
                          isSelected
                            ? "bg-slate-800 border border-emerald-500/50 text-white font-semibold"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CategoryIcon
                            category={cat.name}
                            icon={cat.icon}
                            size={22}
                            trigger="hover"
                          />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

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
