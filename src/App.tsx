import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { HomePage } from './components/HomePage';
import { MyKeysPage } from './components/MyKeysPage';
import { TelegramPage } from './components/TelegramPage';
import { StrategiesPage } from './components/StrategiesPage';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'mykeys' | 'telegram' | 'strategies'>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'mykeys':
        return <MyKeysPage />;
      case 'telegram':
        return <TelegramPage />;
      case 'strategies':
        return <StrategiesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
