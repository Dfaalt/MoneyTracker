import { Category, Transaction, Budget } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: '/icons/french-fries.json', emoji: '🍜', type: 'expense', color: '#F97316', bgColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'transportation', name: 'Transportation', icon: '/icons/electric-car.json', emoji: '🚗', type: 'expense', color: '#3B82F6', bgColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'drinks', name: 'Drinks', icon: '/icons/glass-water.json', emoji: '🥤', type: 'expense', color: '#06B6D4', bgColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { id: 'quota', name: 'Quota', icon: '/icons/wifi.json', emoji: '📱', type: 'expense', color: '#8B5CF6', bgColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'personal', name: 'Personal', icon: '/icons/person-walking.json', emoji: '🛍️', type: 'expense', color: '#EC4899', bgColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { id: 'household', name: 'Household', icon: '/icons/home.json', emoji: '🏠', type: 'expense', color: '#EAB308', bgColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { id: 'other_expense', name: 'Other', icon: '/icons/file-pencil.json', emoji: '📦', type: 'expense', color: '#94A3B8', bgColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: '/icons/lock-dollar.json', emoji: '💼', type: 'income', color: '#10B981', bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'bonus', name: 'Bonus', icon: '/icons/gift.json', emoji: '🎁', type: 'income', color: '#F59E0B', bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'freelance', name: 'Freelance', icon: '/icons/stock-market.json', emoji: '💻', type: 'income', color: '#6366F1', bgColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { id: 'other_income', name: 'Other', icon: '/icons/commodity.json', emoji: '💵', type: 'income', color: '#14B8A6', bgColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const QUICK_CATEGORIES = [
  { label: 'Makanan', categoryName: 'Food', icon: '/icons/french-fries.json', emoji: '🍜', type: 'expense' as const },
  { label: 'Transportasi', categoryName: 'Transportation', icon: '/icons/electric-car.json', emoji: '🚗', type: 'expense' as const },
  { label: 'Minuman', categoryName: 'Drinks', icon: '/icons/glass-water.json', emoji: '🥤', type: 'expense' as const },
  { label: 'Kuota', categoryName: 'Quota', icon: '/icons/wifi.json', emoji: '📱', type: 'expense' as const },
  { label: 'Kebutuhan', categoryName: 'Household', icon: '/icons/home.json', emoji: '🏠', type: 'expense' as const },
];

// Pool of realistic demo transactions
const EXPENSE_POOL = [
  { category: 'Food', desc: 'Makan siang Nasi Padang', amount: 28000 },
  { category: 'Food', desc: 'Ayam Geprek & Es Teh', amount: 35000 },
  { category: 'Food', desc: 'Makan malam bersama tim', amount: 85000 },
  { category: 'Food', desc: 'Belanja Mingguan Supermarket', amount: 315000 },
  { category: 'Food', desc: 'Sarapan Bubur Ayam', amount: 18000 },
  { category: 'Food', desc: 'Pizza Hut weekend party', amount: 145000 },
  { category: 'Food', desc: 'Sushi Tei lunch treat', amount: 160000 },
  { category: 'Food', desc: 'Bakso & Jus Alpukat', amount: 32000 },
  { category: 'Transportation', desc: 'Gojek ke kantor', amount: 14000 },
  { category: 'Transportation', desc: 'GrabCar ke Meeting', amount: 65000 },
  { category: 'Transportation', desc: 'Isi Bensin Pertamax & Tol', amount: 230000 },
  { category: 'Transportation', desc: 'Service & Ganti Oli Motor', amount: 175000 },
  { category: 'Transportation', desc: 'Tiket KRL & MRT Commuter', amount: 25000 },
  { category: 'Drinks', desc: 'Kopi Kenangan Mantan sore', amount: 24000 },
  { category: 'Drinks', desc: 'Starbucks Caramel Macchiato', amount: 58000 },
  { category: 'Drinks', desc: 'Chatime Milk Tea boba', amount: 32000 },
  { category: 'Drinks', desc: 'Jus Buah Segar', amount: 18000 },
  { category: 'Drinks', desc: 'Kopi Tuku tetangga', amount: 20000 },
  { category: 'Quota', desc: 'Paket Internet Bulanan Telkomsel', amount: 115000 },
  { category: 'Quota', desc: 'Langganan Spotify Family', amount: 35000 },
  { category: 'Quota', desc: 'Langganan Netflix Premium', amount: 65000 },
  { category: 'Quota', desc: 'Paket Kuota By.U 50GB', amount: 95000 },
  { category: 'Personal', desc: 'Belanja Skincare & Sabun', amount: 145000 },
  { category: 'Personal', desc: 'Beli Baju Uniqlo', amount: 299000 },
  { category: 'Personal', desc: 'Nonton XXI Cinema & Popcorn', amount: 75000 },
  { category: 'Personal', desc: 'Potong Rambut & Grooming', amount: 60000 },
  { category: 'Household', desc: 'Token Listrik PLN 200k', amount: 202500 },
  { category: 'Household', desc: 'Galon Aqua & Gas Elpiji', amount: 48000 },
  { category: 'Household', desc: 'Pembersih Lantai & Deterjen', amount: 65000 },
  { category: 'Household', desc: 'Iuran Kebersihan RT', amount: 50000 },
];

const BONUS_INCOME_POOL = [
  { category: 'Freelance', desc: 'Website Landing Page Project', amount: 1500000 },
  { category: 'Freelance', desc: 'Desain UI/UX Mobile App', amount: 1250000 },
  { category: 'Bonus', desc: 'Bonus Kinerja Kuartal', amount: 1000000 },
  { category: 'Other', desc: 'Cashback & Dividen Reksadana', amount: 350000 },
];

const BUDGET_OPTIONS = [2500000, 2800000, 3000000, 3200000, 3500000];

// Deterministic pseudo-random number generator per seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate distinct, randomized demo transactions for each month
export const generateDemoTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();

  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${year}-${String(m).padStart(2, '0')}`;
      const monthSeed = year * 100 + m;

      // Determine number of expense transactions for this month (between 7 and 12)
      const count = 7 + Math.floor(pseudoRandom(monthSeed * 11) * 6);
      
      // Select random days and expenses
      const usedDays = new Set<number>();
      for (let i = 0; i < count; i++) {
        const itemIdx = Math.floor(pseudoRandom(monthSeed * 23 + i * 7) * EXPENSE_POOL.length);
        const item = EXPENSE_POOL[itemIdx];
        
        let day = 1 + Math.floor(pseudoRandom(monthSeed * 37 + i * 13) * 27);
        while (usedDays.has(day)) {
          day = (day % 28) + 1;
        }
        usedDays.add(day);

        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${monthStr}-${dayStr}`;

        transactions.push({
          id: `demo-tx-${monthStr}-exp-${i + 1}`,
          user_id: 'demo-user-123',
          type: 'expense',
          category: item.category,
          amount: item.amount,
          description: item.desc,
          transaction_date: dateStr,
          created_at: `${dateStr}T12:00:00.000Z`,
          updated_at: `${dateStr}T12:00:00.000Z`,
        });
      }

      // Always add monthly Salary on day 3
      const salaryDate = `${monthStr}-03`;
      transactions.push({
        id: `demo-tx-${monthStr}-sal`,
        user_id: 'demo-user-123',
        type: 'income',
        category: 'Salary',
        amount: 5000000,
        description: 'Monthly Salary PT Inovasi Digital',
        transaction_date: salaryDate,
        created_at: `${salaryDate}T09:00:00.000Z`,
        updated_at: `${salaryDate}T09:00:00.000Z`,
      });

      // Optionally add bonus/freelance income for some months
      if (pseudoRandom(monthSeed * 47) > 0.35) {
        const bonusIdx = Math.floor(pseudoRandom(monthSeed * 59) * BONUS_INCOME_POOL.length);
        const bonus = BONUS_INCOME_POOL[bonusIdx];
        const bonusDay = 5 + Math.floor(pseudoRandom(monthSeed * 71) * 15);
        const bonusDate = `${monthStr}-${String(bonusDay).padStart(2, '0')}`;
        
        transactions.push({
          id: `demo-tx-${monthStr}-bon`,
          user_id: 'demo-user-123',
          type: 'income',
          category: bonus.category,
          amount: bonus.amount,
          description: bonus.desc,
          transaction_date: bonusDate,
          created_at: `${bonusDate}T14:00:00.000Z`,
          updated_at: `${bonusDate}T14:00:00.000Z`,
        });
      }
    }
  }

  // Sort descending by date
  return transactions.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
};

// Generate randomized demo budget for each month
export const generateDemoBudgets = (): Budget[] => {
  const budgets: Budget[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();

  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${year}-${String(m).padStart(2, '0')}`;
      const monthSeed = year * 100 + m;
      const budgetIdx = Math.floor(pseudoRandom(monthSeed * 83) * BUDGET_OPTIONS.length);
      const budgetAmount = BUDGET_OPTIONS[budgetIdx];

      budgets.push({
        id: `demo-budget-${monthStr}`,
        user_id: 'demo-user-123',
        month: monthStr,
        amount: budgetAmount,
        created_at: `${monthStr}-01T00:00:00.000Z`,
        updated_at: `${monthStr}-01T00:00:00.000Z`,
      });
    }
  }

  return budgets;
};

export const INITIAL_DEMO_TRANSACTIONS: Transaction[] = generateDemoTransactions();
export const INITIAL_DEMO_BUDGETS: Budget[] = generateDemoBudgets();
