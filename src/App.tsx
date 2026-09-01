import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
