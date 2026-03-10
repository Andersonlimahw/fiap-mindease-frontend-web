import { Brain, Settings, Target, CheckSquare, BookOpen, Timer, MessageSquare, Home, User, Smartphone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Screen, useAuthStore } from '@/stores';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { screen: 'dashboard' as Screen, icon: Home, label: 'Início' },
  { screen: 'focus' as Screen, icon: Target, label: 'Modo Foco' },
  { screen: 'tasks' as Screen, icon: CheckSquare, label: 'Tarefas' },
  { screen: 'reader' as Screen, icon: BookOpen, label: 'Leitor' },
  { screen: 'pomodoro' as Screen, icon: Timer, label: 'Pomodoro' },
  { screen: 'chat' as Screen, icon: MessageSquare, label: 'IA Chat' },
  { screen: 'mobile' as Screen, icon: Smartphone, label: 'App Mobile' },
  { screen: 'settings' as Screen, icon: Settings, label: 'Configurações' },
];

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <nav
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/icons/Logo.svg"
              alt="MindEase Logo"
              className="h-10 w-10"
              aria-hidden="true"
            />
            <span className="font-bold text-xl hidden sm:inline">MindEase</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen;

              return (
                <Button
                  key={item.screen}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(item.screen)}
                  className="gap-2"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}

            {/* User Avatar */}
            <div className="ml-2 border-l border-gray-200 dark:border-gray-800 pl-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full overflow-hidden h-9 w-9 p-0 border border-gray-100 dark:border-gray-800"
                onClick={() => onNavigate('settings')}
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name || 'User avatar'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}