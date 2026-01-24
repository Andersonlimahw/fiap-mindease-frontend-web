import { Toaster } from '@/app/components/ui/sonner';
import { ColorBlindFilters } from '@/app/components/ColorBlindFilters';
import { StoreInitializer } from '@/app/components/StoreInitializer';
import { useEffect } from 'react';
import { LoginScreen } from '@/app/components/LoginScreen';
import { Dashboard } from '@/app/components/Dashboard';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import { FocusMode } from '@/app/components/FocusMode';
import { TasksScreen } from '@/app/components/TasksScreen';
import { ContentReader } from '@/app/components/ContentReader';
import { PomodoroTimer } from '@/app/components/PomodoroTimer';
import { AIChat } from '@/app/components/AIChat';
import { useAuthStore, useNavigationStore, usePomodoroStore, useFocusModeStore } from '@/stores';

export default function App() {
  const { isAuthenticated, logout } = useAuthStore();
  const { currentScreen, navigate } = useNavigationStore();
  const { tick: pomodoroTick } = usePomodoroStore();
  const { tick: focusTick } = useFocusModeStore();

  // Initialize authentication screen
  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'login') {
      navigate('login');
    } else if (isAuthenticated && currentScreen === 'login') {
      navigate('dashboard');
    }
  }, [isAuthenticated, currentScreen, navigate]);

  // Timer intervals for Pomodoro and Focus Mode
  useEffect(() => {
    const interval = setInterval(() => {
      pomodoroTick();
      focusTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroTick, focusTick]);

  const renderScreen = () => {
    if (!isAuthenticated && currentScreen !== 'login') {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsScreen onLogout={logout} />;
      case 'focus':
        return <FocusMode />;
      case 'tasks':
        return <TasksScreen />;
      case 'reader':
        return <ContentReader />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'chat':
        return <AIChat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StoreInitializer>
      <div className="min-h-screen bg-background text-foreground">
        {renderScreen()}
        <Toaster />
        <ColorBlindFilters />
      </div>
    </StoreInitializer>
  );
}