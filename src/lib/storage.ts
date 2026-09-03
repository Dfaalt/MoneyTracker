import { Transaction, Budget } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { INITIAL_DEMO_TRANSACTIONS, INITIAL_DEMO_BUDGETS } from "./constants";

const STORAGE_KEYS = {
  TRANSACTIONS: "money_tracker_transactions",
  BUDGETS: "money_tracker_budgets",
  ACTIVE_USER: "money_tracker_user",
};

function getLocalTransactions(userId: string): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      // Seed with initial demo transactions
      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(INITIAL_DEMO_TRANSACTIONS),
      );
      return INITIAL_DEMO_TRANSACTIONS;
    }
    const all = JSON.parse(raw) as Transaction[];
    let result: Transaction[];
    if (userId.startsWith("demo-")) {
      const userCustomTx = all.filter((t) => !t.id.startsWith("demo-tx-"));
      // Combine user's custom added transactions with latest demo seed
      result = [...userCustomTx, ...INITIAL_DEMO_TRANSACTIONS];
    } else {
      result = all.filter((t) => t.user_id === userId);
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.transaction_date).getTime();
      const dateB = new Date(b.transaction_date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      const createdA = new Date(a.created_at || a.transaction_date).getTime();
      const createdB = new Date(b.created_at || b.transaction_date).getTime();
      return createdB - createdA;
    });
  } catch {
    return INITIAL_DEMO_TRANSACTIONS;
  }
}

function saveLocalTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions),
    );
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

function getLocalBudgets(userId: string): Budget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.BUDGETS,
        JSON.stringify(INITIAL_DEMO_BUDGETS),
      );
      return INITIAL_DEMO_BUDGETS;
    }
    const all = JSON.parse(raw) as Budget[];
    if (userId.startsWith("demo-")) {
      const existingMonths = new Set(all.map((b) => b.month));
      const merged = [...all];
      INITIAL_DEMO_BUDGETS.forEach((demoB) => {
        if (!existingMonths.has(demoB.month)) {
          merged.push(demoB);
        }
      });
      return merged;
    }
    return all.filter((b) => b.user_id === userId);
  } catch {
    return INITIAL_DEMO_BUDGETS;
  }
}

function saveLocalBudgets(budgets: Budget[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error("Failed to save budgets to localStorage:", err);
  }
}

// --- Unified Storage API ---
export const storageService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase getTransactions error:", error);
        return getLocalTransactions(userId);
      }
      return data || [];
    }
    return getLocalTransactions(userId);
  },

  async createTransaction(
    txData: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">,
    userId: string,
  ): Promise<Transaction> {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...txData,
      id: "tx-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            type: txData.type,
            category: txData.category,
            amount: txData.amount,
            description: txData.description,
            transaction_date: txData.transaction_date,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase createTransaction error:", error);
        // Fallback to local
      } else if (data) {
        return data;
      }
    }

    const currentList = getLocalTransactions(userId);
    const updated = [newTx, ...currentList];
    saveLocalTransactions(updated);
    return newTx;
  },

  async updateTransaction(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>,
    userId: string,
  ): Promise<Transaction | null> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("transactions")
        .update({
          ...updates,
          updated_at: now,
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Supabase updateTransaction error:", error);
      } else if (data) {
        return data;
      }
    }

    const currentList = getLocalTransactions(userId);
    let updatedTx: Transaction | null = null;
    const nextList = currentList.map((tx) => {
      if (tx.id === id) {
        updatedTx = { ...tx, ...updates, updated_at: now };
        return updatedTx;
      }
      return tx;
    });

    saveLocalTransactions(nextList);
    return updatedTx;
  },

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase deleteTransaction error:", error);
        return false;
      }
      return true;
    }

    const currentList = getLocalTransactions(userId);
    const nextList = currentList.filter((tx) => tx.id !== id);
    saveLocalTransactions(nextList);
    return true;
  },

  async getBudgets(userId: string): Promise<Budget[]> {
    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase getBudgets error:", error);
        return getLocalBudgets(userId);
      }
      return data || [];
    }
    return getLocalBudgets(userId);
  },

  async upsertBudget(
    month: string,
    amount: number,
    userId: string,
  ): Promise<Budget> {
    const now = new Date().toISOString();
    // Normalize month key to YYYY-MM
    const normalizedMonth = month.length > 7 ? month.slice(0, 7) : month;

    if (isSupabaseConfigured && supabase && !userId.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("budgets")
        .upsert(
          {
            user_id: userId,
            month: normalizedMonth,
            amount,
            updated_at: now,
          },
          { onConflict: "user_id,month" },
        )
        .select()
        .single();

      if (error) {
        console.error("Supabase upsertBudget error:", error);
      } else if (data) {
        return data;
      }
    }

    const currentBudgets = getLocalBudgets(userId);
    const existingIndex = currentBudgets.findIndex(
      (b) => b.month === normalizedMonth,
    );
    let resultBudget: Budget;

    if (existingIndex >= 0) {
      resultBudget = {
        ...currentBudgets[existingIndex],
        amount,
        updated_at: now,
      };
      currentBudgets[existingIndex] = resultBudget;
    } else {
      resultBudget = {
        id: "budget-" + Date.now(),
        user_id: userId,
        month: normalizedMonth,
        amount,
        created_at: now,
        updated_at: now,
      };
      currentBudgets.push(resultBudget);
    }

    saveLocalBudgets(currentBudgets);
    return resultBudget;
  },
};
