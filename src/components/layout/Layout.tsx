import React, { useState } from 'react';
import { Sidebar, NavPage } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { TransactionModal } from '../transactions/TransactionModal';
import { BudgetModal } from '../budget/BudgetModal';
import { useFinance } from '../../context/FinanceContext';
import { DashboardPage } from '../../pages/DashboardPage';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { BudgetPage } from '../../pages/BudgetPage';
import { ReportsPage } from '../../pages/ReportsPage';

export const Layout: React.FC = () => {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
  } = useFinance();

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'transactions':
        return <TransactionsPage />;
      case 'budget':
        return <BudgetPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col antialiased">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Desktop Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />

      {/* Global Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Global Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </div>
  );
};
