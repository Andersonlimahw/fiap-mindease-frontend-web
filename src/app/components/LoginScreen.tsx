import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Brain, Chrome } from 'lucide-react';
import { useAuthStore, useNavigationStore } from '@/stores';
import { toast } from 'sonner';

export function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithGoogle } = useAuthStore();
  const { navigate } = useNavigationStore();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login realizado com sucesso!');
      navigate('dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Brain className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-3xl">MindEase</CardTitle>
          <CardDescription>
            Painel neuroadaptativo de produtividade e acessibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 text-lg font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-3" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              aria-label="Fazer login com Google"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" aria-hidden="true"></div>
              ) : (
                <>
                  <Chrome className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  Entrar com Google
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2 text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Ao entrar, você concorda com nossos{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                  onClick={() => alert('Demo: Termos de Uso')}
                >
                  Termos de Uso
                </button>
              </p>
            </div>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              💡 Acesso seguro via autenticação oficial do Google
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}