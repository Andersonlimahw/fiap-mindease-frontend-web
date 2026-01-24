import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Progress } from '@/app/components/ui/progress';
import { useNavigationStore, usePomodoroStore } from '@/stores';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

type TimerMode = 'focus' | 'short-break' | 'long-break';

const TIMER_PRESETS = {
  focus: { duration: 25 * 60, label: 'Foco', icon: Brain, color: 'from-red-500 to-orange-500' },
  'short-break': { duration: 5 * 60, label: 'Pausa Curta', icon: Coffee, color: 'from-green-500 to-emerald-500' },
  'long-break': { duration: 15 * 60, label: 'Pausa Longa', icon: Coffee, color: 'from-blue-500 to-cyan-500' },
};

export function PomodoroTimer() {
  const { currentScreen, navigate } = useNavigationStore();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeLeft(TIMER_PRESETS[mode].duration);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound (using Web Audio API)
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }

    if (mode === 'focus') {
      setPomodorosCompleted((prev) => prev + 1);
      toast.success('🎉 Pomodoro concluído! Hora de uma pausa.');
      
      // Auto-switch to break
      const nextMode = (pomodorosCompleted + 1) % 4 === 0 ? 'long-break' : 'short-break';
      setMode(nextMode);
    } else {
      toast.success('✅ Pausa concluída! Pronto para focar novamente?');
      setMode('focus');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_PRESETS[mode].duration);
    toast.info('Timer reiniciado');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalDuration = TIMER_PRESETS[mode].duration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const preset = TIMER_PRESETS[mode];
  const Icon = preset.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Timer className="h-8 w-8 text-orange-500" aria-hidden="true" />
            Timer Pomodoro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Técnica de gerenciamento de tempo para máxima produtividade
          </p>
        </div>

        {/* Main Timer Card */}
        <Card className="overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${preset.color}`} aria-hidden="true" />
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${preset.color}`}>
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">{preset.label}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1 }}
                animate={{ scale: isRunning && timeLeft % 2 === 0 ? 1.02 : 1 }}
                className="text-8xl font-bold tracking-tight"
                role="timer"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatTime(timeLeft)}
              </motion.div>
              
              <Progress value={getProgress()} className="h-3" />
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRunning ? 'Em andamento...' : 'Pausado'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={`w-32 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : `bg-gradient-to-r ${preset.color}`}`}
                aria-label={isRunning ? 'Pausar timer' : 'Iniciar timer'}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" aria-hidden="true" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" aria-hidden="true" />
                    Iniciar
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
                aria-label="Reiniciar timer"
              >
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Mode Selector */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TIMER_PRESETS).map(([key, value]) => (
                  <Button
                    key={key}
                    variant={mode === key ? 'default' : 'outline'}
                    onClick={() => setMode(key as TimerMode)}
                    disabled={isRunning}
                    className="text-xs"
                  >
                    {value.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pomodoros Hoje</CardDescription>
              <CardTitle className="text-4xl">{pomodorosCompleted}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pomodorosCompleted * 25} minutos de foco
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Próxima Pausa</CardDescription>
              <CardTitle className="text-xl">
                {mode === 'focus'
                  ? (pomodorosCompleted + 1) % 4 === 0
                    ? 'Pausa Longa'
                    : 'Pausa Curta'
                  : 'Sessão de Foco'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Após completar atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sequência</CardDescription>
              <CardTitle className="text-4xl">
                {Math.floor(pomodorosCompleted / 4)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ciclos completos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-base">Como funciona a Técnica Pomodoro?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. <strong>Foco (25 min):</strong> Trabalhe com total concentração em uma tarefa</p>
            <p>2. <strong>Pausa Curta (5 min):</strong> Relaxe e recarregue as energias</p>
            <p>3. Repita o ciclo 4 vezes</p>
            <p>4. <strong>Pausa Longa (15 min):</strong> Faça uma pausa mais longa após 4 pomodoros</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}