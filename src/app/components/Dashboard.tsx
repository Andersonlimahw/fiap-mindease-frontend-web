import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Slider } from '@/app/components/ui/slider';
import { Progress } from '@/app/components/ui/progress';
import { useNavigationStore, useThemeStore } from '@/stores';
import type { Screen } from '@/stores';
import { Target, CheckSquare, BookOpen, Timer, MessageSquare, Brain, Zap, Moon, Sun } from 'lucide-react';
import { Navigation } from '@/app/components/Navigation';
import { KeyboardShortcuts } from '@/app/components/KeyboardShortcuts';
import { AccessibilityGuide } from '@/app/components/AccessibilityGuide';

export function Dashboard() {
  const [stimulationLevel, setStimulationLevel] = useState(50);
  const { currentScreen, navigate } = useNavigationStore();
  const { theme } = useThemeStore();

  const quickActions = [
    { screen: 'focus' as Screen, icon: Target, label: 'Modo Foco', description: 'Minimize distrações', color: 'from-blue-500 to-cyan-500' },
    { screen: 'tasks' as Screen, icon: CheckSquare, label: 'Tarefas', description: 'Gerencie micro-etapas', color: 'from-purple-500 to-pink-500' },
    { screen: 'reader' as Screen, icon: BookOpen, label: 'Leitor', description: 'Conteúdo adaptativo', color: 'from-green-500 to-emerald-500' },
    { screen: 'pomodoro' as Screen, icon: Timer, label: 'Pomodoro', description: 'Timer de foco', color: 'from-orange-500 to-red-500' },
    { screen: 'chat' as Screen, icon: MessageSquare, label: 'IA Chat', description: 'Suporte inteligente', color: 'from-indigo-500 to-purple-500' },
  ];

  const getStimulationLabel = (level: number) => {
    if (level < 30) return 'Mínimo';
    if (level < 50) return 'Baixo';
    if (level < 70) return 'Moderado';
    if (level < 90) return 'Alto';
    return 'Máximo';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6" role="main">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo ao MindEase</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Seu painel neuroadaptativo de produtividade
          </p>
        </div>

        {/* Stimulation Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              Nível de Estimulação
            </CardTitle>
            <CardDescription>
              Ajuste o nível de estímulo visual e interativo conforme sua necessidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Nível Atual: {getStimulationLabel(stimulationLevel)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stimulationLevel}%
                </span>
              </div>
              <Slider
                value={[stimulationLevel]}
                onValueChange={(value) => setStimulationLevel(value[0])}
                min={0}
                max={100}
                step={10}
                aria-label="Nível de estimulação"
                aria-valuetext={`${stimulationLevel}% - ${getStimulationLabel(stimulationLevel)}`}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>Mínimo</span>
                <span>Moderado</span>
                <span>Máximo</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <span className="font-medium">Animações:</span> {stimulationLevel > 50 ? 'Ativas' : 'Reduzidas'}
              </div>
              <div className="p-2 rounded bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                <span className="font-medium">Cores:</span> {stimulationLevel > 70 ? 'Vibrantes' : 'Suaves'}
              </div>
              <div className="p-2 rounded bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <span className="font-medium">Contraste:</span> {stimulationLevel < 30 ? 'Alto' : 'Normal'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.screen}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(action.screen)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(action.screen);
                    }
                  }}
                >
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <CardTitle>{action.label}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tarefas Hoje</CardDescription>
              <CardTitle className="text-3xl">8</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 dark:text-green-400">5 concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tempo de Foco</CardDescription>
              <CardTitle className="text-3xl">2h 15m</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400">Meta: 4h/dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sequência</CardDescription>
              <CardTitle className="text-3xl">12 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600 dark:text-purple-400">Recorde: 18 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Accessibility Guide */}
        <AccessibilityGuide />
      </main>
    </div>
  );
}