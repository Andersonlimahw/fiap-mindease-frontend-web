import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useNavigationStore, useAccessibilityStore, useThemeStore, useAuthStore } from '@/stores';
import { Navigation } from '@/app/components/Navigation';
import { LogOut, User, Palette, Accessibility, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onLogout?: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const { currentScreen, navigate } = useNavigationStore();
  const { settings, updateSettings } = useAccessibilityStore();
  const { theme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    navigate('login');
    toast.success('Logout realizado com sucesso');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalize sua experiência no MindEase
          </p>
        </div>

        <Tabs defaultValue="accessibility" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accessibility">
              <Accessibility className="h-4 w-4 mr-2" aria-hidden="true" />
              Acessibilidade
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" aria-hidden="true" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" aria-hidden="true" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tamanho da Fonte</CardTitle>
                <CardDescription>
                  Ajuste o tamanho do texto para melhor legibilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tamanho: {settings.fontSize}px</Label>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                    min={12}
                    max={24}
                    step={1}
                    aria-label="Tamanho da fonte"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pequeno (12px)</span>
                    <span>Grande (24px)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Espaçamento</CardTitle>
                <CardDescription>
                  Configure espaçamento entre linhas e letras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Altura da Linha: {settings.lineHeight.toFixed(1)}</Label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={(value) => updateSettings({ lineHeight: value[0] })}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    aria-label="Altura da linha"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Espaçamento de Letras: {settings.letterSpacing.toFixed(2)}em</Label>
                  <Slider
                    value={[settings.letterSpacing]}
                    onValueChange={(value) => updateSettings({ letterSpacing: value[0] })}
                    min={0}
                    max={0.2}
                    step={0.01}
                    aria-label="Espaçamento de letras"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências de Movimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduce-motion">Reduzir Movimento</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Minimiza animações e transições
                    </p>
                  </div>
                  <Switch
                    id="reduce-motion"
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => {
                      updateSettings({ reduceMotion: checked });
                      toast.success(checked ? 'Movimento reduzido ativado' : 'Movimento reduzido desativado');
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="screen-reader">Modo Leitor de Tela</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Otimiza para leitores de tela
                    </p>
                  </div>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReaderMode}
                    onCheckedChange={(checked) => {
                      updateSettings({ screenReaderMode: checked });
                      toast.success(checked ? 'Modo leitor de tela ativado' : 'Modo leitor de tela desativado');
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" aria-hidden="true" />
                  Modo Daltônico
                </CardTitle>
                <CardDescription>
                  Ajuste as cores para diferentes tipos de daltonismo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={settings.colorBlindMode}
                  onValueChange={(value: any) => {
                    updateSettings({ colorBlindMode: value });
                    toast.success('Modo de cor atualizado');
                  }}
                >
                  <SelectTrigger aria-label="Modo daltônico">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="protanopia">Protanopia (vermelho-verde)</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (vermelho-verde)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (azul-amarelo)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>
                  Escolha como o MindEase deve aparecer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setTheme('light');
                      toast.success('Tema claro ativado');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                    aria-pressed={theme === 'light'}
                  >
                    <div className="w-full h-20 bg-white border border-gray-300 rounded mb-2" />
                    <p className="text-sm font-medium">Claro</p>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      toast.success('Tema escuro ativado');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                    aria-pressed={theme === 'dark'}
                  >
                    <div className="w-full h-20 bg-gray-900 border border-gray-700 rounded mb-2" />
                    <p className="text-sm font-medium">Escuro</p>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('high-contrast');
                      updateSettings({ highContrast: true });
                      toast.success('Alto contraste ativado');
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      theme === 'high-contrast'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                    aria-pressed={theme === 'high-contrast'}
                  >
                    <div className="w-full h-20 bg-black border-4 border-white rounded mb-2" />
                    <p className="text-sm font-medium">Alto Contraste</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <p className="text-sm">Usuário Demo</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm">usuario@demo.com</p>
                </div>
                <div className="space-y-2">
                  <Label>Membro desde</Label>
                  <p className="text-sm">Janeiro 2026</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sair da Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}