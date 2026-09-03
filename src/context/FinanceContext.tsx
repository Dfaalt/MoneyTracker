import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import confetti from "canvas-confetti";
import {
  Transaction,
  Budget,
  FinancialSummary,
  CategorySummary,
  DailyExpenseSummary,
  ToastNotification,
} from "../types";
import { storageService } from "../lib/storage";
import { useAuth } from "./AuthContext";
import { calculateBudgetStatus, formatDate, getMonthKey } from "../lib/utils";
import { ALL_CATEGORIES } from "../lib/constants";

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  isLoading: boolean;

  // Financial summaries for selectedMonth
  monthlyTransactions: Transaction[];
  summary: FinancialSummary;
  categorySummaries: CategorySummary[];
  dailyExpenseSummaries: DailyExpenseSummary[];

  // CRUD Actions
  addTransaction: (
    tx: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<boolean>;
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>,
  ) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  setMonthlyBudget: (month: string, amount: number) => Promise<boolean>;

  // Toasts
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;

  // Quick Add Modal Trigger State
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;

  // Selected category filter from dashboard interactive donut chart
  dashboardCategoryFilter: string | null;
  setDashboardCategoryFilter: (cat: string | null) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?.id || "demo-user-123";

  // Automatically initialize to the real-time current month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    getMonthKey(),
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [dashboardCategoryFilter, setDashboardCategoryFilter] = useState<
    string | null
  >(null);

  const showToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id =
      "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 4000,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [txData, budgetData] = await Promise.all([
        storageService.getTransactions(userId),
        storageService.getBudgets(userId),
      ]);
      setTransactions(txData);
      setBudgets(budgetData);
    } catch (err) {
      console.error("Error loading finance data:", err);
      showToast({
        title: "Gagal Memuat Data",
        message: "Silakan periksa koneksi atau muat ulang halaman.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter transactions for current selectedMonth, sorted by transaction_date desc then created_at desc
  const monthlyTransactions = useMemo(() => {
    return transactions
      .filter((tx) => tx.transaction_date.startsWith(selectedMonth))
      .sort((a, b) => {
        const dateA = new Date(a.transaction_date).getTime();
        const dateB = new Date(b.transaction_date).getTime();
        if (dateB !== dateA) {
          return dateB - dateA;
        }
        const createdA = new Date(a.created_at || a.transaction_date).getTime();
        const createdB = new Date(b.created_at || b.transaction_date).getTime();
        return createdB - createdA;
      });
  }, [transactions, selectedMonth]);

  // Compute Financial Summary
  const summary = useMemo<FinancialSummary>(() => {
    let income = 0;
    let expense = 0;

    monthlyTransactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        income += amt;
      } else {
        expense += amt;
      }
    });

    const balance = income - expense;

    // Find budget for selectedMonth (matching YYYY-MM)
    const currentBudgetObj = budgets.find((b) =>
      b.month.startsWith(selectedMonth),
    );
    const budgetAmount = currentBudgetObj ? Number(currentBudgetObj.amount) : 0;
    const remainingBudget = budgetAmount > 0 ? budgetAmount - expense : 0;
    const percentage =
      budgetAmount > 0 ? Math.round((expense / budgetAmount) * 1000) / 10 : 0;
    const status = calculateBudgetStatus(expense, budgetAmount);

    return {
      income,
      expense,
      balance,
      budget: budgetAmount,
      remainingBudget,
      budgetProgress: {
        spent: expense,
        totalBudget: budgetAmount,
        remaining: remainingBudget,
        percentage,
        status,
      },
    };
  }, [monthlyTransactions, budgets, selectedMonth]);

  // Category Summaries for interactive donut chart
  const categorySummaries = useMemo<CategorySummary[]>(() => {
    const expenseTx = monthlyTransactions.filter((tx) => tx.type === "expense");
    const totalExpense = expenseTx.reduce(
      (sum, tx) => sum + (Number(tx.amount) || 0),
      0,
    );

    const map = new Map<string, { total: number; count: number }>();

    expenseTx.forEach((tx) => {
      const prev = map.get(tx.category) || { total: 0, count: 0 };
      map.set(tx.category, {
        total: prev.total + (Number(tx.amount) || 0),
        count: prev.count + 1,
      });
    });

    const list: CategorySummary[] = [];
    map.forEach((value, catName) => {
      const catDef = ALL_CATEGORIES.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase(),
      );
      list.push({
        category: catName,
        icon: catDef?.icon || "https://cdn.lordicon.com/nocovwne.json",
        color: catDef?.color || "#94A3B8",
        total: value.total,
        percentage:
          totalExpense > 0
            ? Math.round((value.total / totalExpense) * 1000) / 10
            : 0,
        count: value.count,
      });
    });

    // Sort descending by total amount
    return list.sort((a, b) => b.total - a.total);
  }, [monthlyTransactions]);

  // Daily Expense Summaries for interactive bar chart
  const dailyExpenseSummaries = useMemo<DailyExpenseSummary[]>(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Group existing transactions by day
    const dayMap = new Map<
      number,
      { expense: number; income: number; count: number }
    >();

    monthlyTransactions.forEach((tx) => {
      const dayNum = parseInt(tx.transaction_date.split("-")[2], 10);
      const prev = dayMap.get(dayNum) || { expense: 0, income: 0, count: 0 };
      const amt = Number(tx.amount) || 0;
      if (tx.type === "expense") {
        prev.expense += amt;
      } else {
        prev.income += amt;
      }
      prev.count += 1;
      dayMap.set(dayNum, prev);
    });

    const result: DailyExpenseSummary[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${selectedMonth}-${dayStr}`;
      const data = dayMap.get(d) || { expense: 0, income: 0, count: 0 };

      result.push({
        date: dateStr,
        dayLabel: String(d),
        formattedDate: formatDate(dateStr, "short"),
        expense: data.expense,
        income: data.income,
        count: data.count,
      });
    }

    return result;
  }, [monthlyTransactions, selectedMonth]);

  // Actions
  const addTransaction = async (
    txData: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<boolean> => {
    try {
      const created = await storageService.createTransaction(txData, userId);
      setTransactions((prev) => [created, ...prev]);

      // Check if newly created transaction month matches or navigate to it
      const txMonth = txData.transaction_date.slice(0, 7);
      if (txMonth !== selectedMonth) {
        setSelectedMonth(txMonth);
      }

      // Check budget alerts if it's expense
      if (txData.type === "expense") {
        const currentBudgetObj = budgets.find((b) =>
          b.month.startsWith(txMonth),
        );
        const budgetAmount = currentBudgetObj
          ? Number(currentBudgetObj.amount)
          : 0;
        if (budgetAmount > 0) {
          const newSpent = summary.expense + Number(txData.amount);
          const newStatus = calculateBudgetStatus(newSpent, budgetAmount);
          if (newStatus === "exceeded") {
            showToast({
              title: "You've exceeded your monthly budget.",
              message: "Pengeluaran bulan ini telah melampaui batas budget!",
              type: "warning",
              duration: 5000,
            });
          } else if (newStatus === "warning" || newStatus === "critical") {
            showToast({
              title: "Your budget is almost used.",
              message: `Pengeluaran mendekati batas (${Math.round((newSpent / budgetAmount) * 100)}% terpakai).`,
              type: "warning",
              duration: 4500,
            });
          }
        }
      } else if (txData.type === "income" && txData.amount >= 1000000) {
        // Celebrate income!
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10B981", "#34D399", "#6EE7B7"],
        });
      }

      showToast({
        title: "✓ Transaction added",
        message: `${txData.description || txData.category}`,
        type: "success",
        details: {
          description: txData.description,
          amount: txData.amount,
          type: txData.type,
        },
      });

      return true;
    } catch (err) {
      console.error("Failed to add transaction:", err);
      showToast({
        title: "Gagal Menambah Transaksi",
        message: "Terjadi kesalahan saat menyimpan transaksi.",
        type: "error",
      });
      return false;
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>,
  ): Promise<boolean> => {
    try {
      const updated = await storageService.updateTransaction(
        id,
        updates,
        userId,
      );
      if (updated) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
        showToast({
          title: "✓ Transaction updated",
          message: "Perubahan transaksi berhasil disimpan.",
          type: "success",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update transaction:", err);
      showToast({
        title: "Gagal Mengubah Transaksi",
        message: "Terjadi kesalahan saat memperbarui data.",
        type: "error",
      });
      return false;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const target = transactions.find((t) => t.id === id);
      const success = await storageService.deleteTransaction(id, userId);
      if (success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showToast({
          title: "✓ Transaction deleted",
          message: target
            ? `${target.description || target.category} telah dihapus`
            : "Transaksi berhasil dihapus.",
          type: "info",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      showToast({
        title: "Gagal Menghapus Transaksi",
        message: "Terjadi kesalahan saat menghapus data.",
        type: "error",
      });
      return false;
    }
  };

  const setMonthlyBudget = async (
    month: string,
    amount: number,
  ): Promise<boolean> => {
    try {
      const normalizedMonth = month.length > 7 ? month.slice(0, 7) : month;
      const updatedBudget = await storageService.upsertBudget(
        normalizedMonth,
        amount,
        userId,
      );

      setBudgets((prev) => {
        const idx = prev.findIndex((b) => b.month.startsWith(normalizedMonth));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedBudget;
          return next;
        }
        return [...prev, updatedBudget];
      });

      showToast({
        title: "✓ Budget Saved",
        message: `Budget untuk ${month} berhasil ditetapkan.`,
        type: "success",
      });
      return true;
    } catch (err) {
      console.error("Failed to save budget:", err);
      showToast({
        title: "Gagal Menyimpan Budget",
        message: "Terjadi kesalahan saat menyimpan budget.",
        type: "error",
      });
      return false;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        selectedMonth,
        setSelectedMonth,
        isLoading,
        monthlyTransactions,
        summary,
        categorySummaries,
        dailyExpenseSummaries,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setMonthlyBudget,
        toasts,
        showToast,
        removeToast,
        isAddModalOpen,
        setIsAddModalOpen,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        dashboardCategoryFilter,
        setDashboardCategoryFilter,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context)
    throw new Error("useFinance must be used within a FinanceProvider");
  return context;
};
