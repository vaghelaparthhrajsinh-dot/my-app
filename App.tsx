import { useState } from 'react';
import {
  LoadingScreen,
  LoginScreen,
  PendingAccessScreen,
} from './components/AuthScreens';
import { BookingModal } from './components/BookingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './contexts/AppContext';
import { AdvancesPage } from './pages/AdvancesPage';
import { BackupRestorePage } from './pages/BackupRestorePage';
import { BookingsPage } from './pages/BookingsPage';
import { CalendarPage } from './pages/CalendarPage';
import { CategoryPage } from './pages/CategoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { DailyReportPage } from './pages/DailyReportPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryDirectoryPage } from './pages/InventoryDirectoryPage';
import { NegotiationsPage } from './pages/NegotiationsPage';
import { ProfitLossPage } from './pages/ProfitLossPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { CategoryKey, NavSection } from './types';

function AppShell() {
  const { authLoading, dataLoading, firebaseUser, userProfile, bookings } = useApp();

  const [activeNav, setActiveNav] = useState<NavSection>('dashboard');
  const [globalBookingModal, setGlobalBookingModal] = useState<{
    open: boolean;
    mode: 'confirmed' | 'reserved';
    category: CategoryKey;
    date?: string;
  }>({
    open: false,
    mode: 'confirmed',
    category: 'DISPLAY',
  });

  if (authLoading) {
    return <LoadingScreen message="Checking AD OCCASION authentication..." />;
  }

  if (!firebaseUser) {
    return <LoginScreen />;
  }

  if (
    !userProfile ||
    userProfile.status === 'revoked' ||
    userProfile.role === 'pending'
  ) {
    return <PendingAccessScreen />;
  }

  if (dataLoading) {
    return <LoadingScreen message="Syncing AD OCCASION cloud database..." />;
  }

  const handleSelectSearchBooking = (bookingId: string) => {
    const found = bookings.find((b) => b.id === bookingId);
    if (found?.status === 'reserved') {
      setActiveNav('reservations');
    } else {
      setActiveNav('bookings');
    }
  };

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActiveNav}
            onOpenBookingModal={(opts) =>
              setGlobalBookingModal({
                open: true,
                mode: opts?.mode || 'confirmed',
                category: opts?.category || 'DISPLAY',
                date: opts?.date,
              })
            }
          />
        );
      case 'bookings':
        return <BookingsPage mode="bookings" />;
      case 'reservations':
        return <BookingsPage mode="reservations" />;
      case 'calendar':
        return <CalendarPage />;
      case 'display':
        return <CategoryPage key="DISPLAY" category="DISPLAY" />;
      case 'article':
        return <CategoryPage key="ARTICLE" category="ARTICLE" />;
      case 'crockery':
        return <CategoryPage key="CROCKERY" category="CROCKERY" />;
      case 'mocktail':
        return <CategoryPage key="MOCKTAIL" category="MOCKTAIL" />;
      case 'waiter':
        return <CategoryPage key="WAITER" category="WAITER" />;
      case 'pan':
        return <CategoryPage key="PAN" category="PAN" />;
      case 'girls':
        return <CategoryPage key="GIRLS" category="GIRLS" />;
      case 'juice':
        return <CategoryPage key="JUICE" category="JUICE" />;
      case 'inventory':
        return <InventoryDirectoryPage />;
      case 'customers':
        return <CustomersPage />;
      case 'advances':
        return <AdvancesPage />;
      case 'negotiations':
        return <NegotiationsPage />;
      case 'reports':
        return <DailyReportPage />;
      case 'profit-loss':
        return <ProfitLossPage />;
      case 'backup':
        return <BackupRestorePage />;
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onNavigate={setActiveNav}
            onOpenBookingModal={(opts) =>
              setGlobalBookingModal({
                open: true,
                mode: opts?.mode || 'confirmed',
                category: opts?.category || 'DISPLAY',
                date: opts?.date,
              })
            }
          />
        );
    }
  };

  return (
    <Layout
      activeNav={activeNav}
      onNavigate={setActiveNav}
      onNewBooking={() =>
        setGlobalBookingModal({
          open: true,
          mode: 'confirmed',
          category: 'DISPLAY',
        })
      }
      onSelectSearchBooking={handleSelectSearchBooking}
    >
      {renderPage()}

      {globalBookingModal.open && (
        <BookingModal
          isOpen={globalBookingModal.open}
          onClose={() => setGlobalBookingModal((prev) => ({ ...prev, open: false }))}
          initialMode={globalBookingModal.mode}
          initialCategory={globalBookingModal.category}
          initialDate={globalBookingModal.date}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
