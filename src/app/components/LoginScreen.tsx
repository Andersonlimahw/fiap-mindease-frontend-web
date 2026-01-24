import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { useAuthStore, useNavigationStore } from '@/stores';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  
  const { login } = useAuthStore();
  const { navigate } = useNavigationStore();

  useEffect(() => {
    // Auto-focus on email field for keyboard navigation
    emailRef.current?.focus();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await login(email, password);
        navigate('dashboard');
      } catch (error) {
        setErrors({ password: 'Erro ao fazer login' });
      } finally {
        setIsLoading(false);
      }
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                onClick={() => alert('Demo: use qualquer email/senha válidos')}
              >
                Esqueceu a senha?
              </button>
              <p className="text-gray-600 dark:text-gray-400">
                Não tem conta?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                  onClick={() => alert('Demo: funcionalidade de registro')}
                >
                  Criar conta
                </button>
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                💡 Demo: Use qualquer email e senha (mínimo 6 caracteres)
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}