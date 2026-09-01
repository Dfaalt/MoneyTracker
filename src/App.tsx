import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <FinanceProvider>
      <Layout />
    </FinanceProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
