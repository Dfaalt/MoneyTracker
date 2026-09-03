export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  transaction_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  month: string; // YYYY-MM or YYYY-MM-01
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji?: string;
  type: TransactionType;
  color: string;
  bgColor: string;
}

export type BudgetStatusLevel = 'safe' | 'warning' | 'critical' | 'exceeded';

export interface BudgetProgress {
  spent: number;
  totalBudget: number;
  remaining: number;
  percentage: number;
  status: BudgetStatusLevel;
}

export interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
  budget: number;
  remainingBudget: number;
  budgetProgress: BudgetProgress;
}

export interface CategorySummary {
  category: string;
  icon: string;
  emoji?: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
}

export interface DailyExpenseSummary {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "26"
  formattedDate: string; // e.g. "26 Aug"
  expense: number;
  income: number;
  count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  details?: {
    description?: string;
    amount?: number;
    type?: TransactionType;
  };
  duration?: number;
}
