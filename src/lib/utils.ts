import { BudgetStatusLevel } from '../types';

/**
 * Format number into Indonesian Rupiah currency string
 * e.g., formatRupiah(1061850) -> "Rp1.061.850"
 */
export function formatRupiah(amount: number, options?: { space?: boolean; compact?: boolean }): string {
  const { space = false, compact = false } = options || {};
  
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `Rp${space ? ' ' : ''}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `Rp${space ? ' ' : ''}${(amount / 1_000).toFixed(0)}k`;
  }

  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return `Rp${space ? ' ' : ''}${formatted}`;
}

/**
 * Parse input currency string to numeric value
 */
export function parseCurrencyInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Format ISO date string into user friendly format
 * e.g. "2026-08-31" -> "31 Aug" or "31 Aug 2026"
 */
export function formatDate(dateString: string, format: 'short' | 'medium' | 'full' = 'medium'): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  
  if (isNaN(date.getTime())) return dateString;

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();

  if (format === 'short') {
    return `${day} ${monthsShort[monthIdx]}`;
  }
  if (format === 'medium') {
    return `${day} ${monthsShort[monthIdx]} ${year}`;
  }
  return `${days[date.getDay()]}, ${day} ${monthsFull[monthIdx]} ${year}`;
}

/**
 * Format 'YYYY-MM' to readable month name and year e.g. "August 2026"
 */
export function formatMonthYear(monthStr: string): string {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-').map(Number);
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthsFull[(month - 1) || 0]} ${year || 2026}`;
}

/**
 * Get string representation 'YYYY-MM' from Date object
 */
export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get previous month 'YYYY-MM'
 */
export function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}

/**
 * Get next month 'YYYY-MM'
 */
export function getNextMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth === 13) {
    nextMonth = 1;
    nextYear += 1;
  }
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

/**
 * Calculate budget status based on PRD Section 8.3:
 * Safe: < 70%
 * Warning: 70–89%
 * Critical: 90–99%
 * Exceeded: >= 100%
 */
export function calculateBudgetStatus(spent: number, totalBudget: number): BudgetStatusLevel {
  if (totalBudget <= 0) return spent > 0 ? 'exceeded' : 'safe';
  const percentage = (spent / totalBudget) * 100;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'critical';
  if (percentage >= 70) return 'warning';
  return 'safe';
}

export function getBudgetStatusConfig(status: BudgetStatusLevel) {
  switch (status) {
    case 'safe':
      return {
        label: 'Safe',
        color: 'text-emerald-400',
        barColor: 'bg-emerald-500',
        barGradient: 'from-emerald-500 to-teal-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        message: 'Pengeluaran masih dalam batas aman.',
      };
    case 'warning':
      return {
        label: 'Warning',
        color: 'text-amber-400',
        barColor: 'bg-amber-500',
        barGradient: 'from-amber-500 to-orange-400',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        message: 'Your budget is almost used. Perhatikan sisa pengeluaran.',
      };
    case 'critical':
      return {
        label: 'Critical',
        color: 'text-orange-400',
        barColor: 'bg-orange-500',
        barGradient: 'from-orange-500 to-rose-400',
        badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        message: 'Sangat mendekati batas budget bulanan!',
      };
    case 'exceeded':
      return {
        label: 'Exceeded',
        color: 'text-rose-400',
        barColor: 'bg-rose-500',
        barGradient: 'from-rose-600 to-red-500',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        message: "You've exceeded your monthly budget. Pengeluaran melebihi limit!",
      };
  }
}
