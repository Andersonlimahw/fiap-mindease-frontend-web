import { Brain, Settings, Target, CheckSquare, BookOpen, Timer, MessageSquare, Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Screen } from '@/stores';

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
  { screen: 'settings' as Screen, icon: Settings, label: 'Configurações' },
];

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  return (
    <nav 
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl">MindEase</span>
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
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}