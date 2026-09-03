import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { Layout } from "./components/layout/Layout";
import { AuthPage } from "./pages/AuthPage";
import { PWAPrompt } from "./components/common/PWAPrompt";

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <PWAPrompt />
        <AuthPage />
      </>
    );
  }

  return (
    <FinanceProvider>
      <PWAPrompt />
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
