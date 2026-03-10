import { useState, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useNavigationStore, useFocusModeStore, AmbientSound } from '@/stores';
import { Target, Volume2, VolumeX, Moon, Sun, Music, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function FocusMode() {
  const { currentScreen, navigate } = useNavigationStore();
  const {
    isActive,
    duration,
    ambientSound,
    dimBrightness,
    blockNotifications,
    activate,
    deactivate,
    setDuration,
    setAmbientSound,
    setDimBrightness,
    setBlockNotifications,
  } = useFocusModeStore();
  
  // Local state for hide distractions (not persisted)
  const [hideDistractions, setHideDistractions] = useState(true);

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    return () => document.body.classList.remove('focus-mode');
  }, [isActive]);

  const handleActivate = () => {
    if (isActive) {
      deactivate();
      toast.success('Modo Foco desativado');
    } else {
      activate();
      toast.success('Modo Foco ativado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-16 md:p-16 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-500" aria-hidden="true" />
            Modo Foco
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Minimize distrações e maximize sua concentração
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse">
                    <Target className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-3xl">Modo Foco Ativo</CardTitle>
                  <CardDescription className="text-lg">
                    Mantenha-se concentrado. Você está no controle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                      <p className="text-2xl font-bold">{duration} min</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distrações Bloqueadas</p>
                      <p className="text-2xl font-bold">{hideDistractions ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleActivate}
                    className="w-full max-w-md"
                  >
                    Desativar Modo Foco
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Modo Foco</CardTitle>
                  <CardDescription>
                    Personalize como o modo foco funciona para você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications" className="flex items-center gap-2">
                          {blockNotifications ? (
                            <BellOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Bell className="h-4 w-4" aria-hidden="true" />
                          )}
                          Bloquear Notificações
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Silencia todas as notificações durante o foco
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={blockNotifications}
                        onCheckedChange={(checked) =>
                          setBlockNotifications(checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dim-screen" className="flex items-center gap-2">
                          <Moon className="h-4 w-4" aria-hidden="true" />
                          Reduzir Brilho
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Diminui o brilho para reduzir fadiga visual
                        </p>
                      </div>
                      <Switch
                        id="dim-screen"
                        checked={dimBrightness}
                        onCheckedChange={(checked) =>
                          setDimBrightness(checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-distractions">Ocultar Distrações</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Remove elementos não essenciais da interface
                        </p>
                      </div>
                      <Switch
                        id="hide-distractions"
                        checked={hideDistractions}
                        onCheckedChange={(checked) =>
                          setHideDistractions(checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ambient-sound" className="flex items-center gap-2">
                      {ambientSound !== 'none' ? (
                        <Volume2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-4 w-4" aria-hidden="true" />
                      )}
                      Som Ambiente
                    </Label>
                    <Select
                      value={ambientSound}
                      onValueChange={(value: string) =>
                        setAmbientSound(value as AmbientSound)
                      }
                    >
                      <SelectTrigger id="ambient-sound">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        <SelectItem value="rain">Chuva</SelectItem>
                        <SelectItem value="forest">Floresta</SelectItem>
                        <SelectItem value="ocean">Oceano</SelectItem>
                        <SelectItem value="white-noise">Ruído Branco</SelectItem>
                        <SelectItem value="cafe">Café</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração Padrão</Label>
                    <Select
                      value={duration.toString()}
                      onValueChange={(value) =>
                        setDuration(parseInt(value))
                      }
                    >
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="25">25 minutos (Pomodoro)</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    size="lg"
                    onClick={handleActivate}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Target className="h-5 w-5 mr-2" aria-hidden="true" />
                    Ativar Modo Foco
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-base">💡 Dica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    O Modo Foco funciona melhor quando combinado com o Timer Pomodoro.
                    Experimente ativar ambos para máxima produtividade!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}