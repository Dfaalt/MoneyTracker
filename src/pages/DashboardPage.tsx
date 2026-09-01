import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { BudgetProgressBar } from '../components/dashboard/BudgetProgressBar';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { DailyExpenseBarChart } from '../components/dashboard/DailyExpenseBarChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { NavPage } from '../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: NavPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { isLoading } = useFinance();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Financial Summary Cards (Income, Expense, Balance, Budget, Remaining) */}
      <section>
        <SummaryCards />
      </section>

      {/* 2. Budget Progress Bar & Alerts */}
      <section>
        <BudgetProgressBar />
      </section>

      {/* 3. Interactive Visual Charts (Donut + Daily Bar) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <CategoryDonutChart />
        </div>
        <div className="lg:col-span-6">
          <DailyExpenseBarChart />
        </div>
      </section>

      {/* 4. Recent Transactions Section */}
      <section>
        <RecentTransactions onNavigateToTransactions={() => onNavigate('transactions')} />
      </section>
    </div>
  );
};
