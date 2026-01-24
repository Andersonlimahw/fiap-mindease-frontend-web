import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Keyboard, Accessibility, Eye, Moon, Volume2 } from 'lucide-react';

export function AccessibilityGuide() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          Guia de Acessibilidade
        </CardTitle>
        <CardDescription>
          MindEase é 100% acessível e compatível com WCAG 2.2 AA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {/* Keyboard Navigation */}
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Keyboard className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">Navegação por Teclado</p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <p>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Tab</kbd> - Navegar entre elementos</p>
                <p>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Enter</kbd> ou <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Espaço</kbd> - Ativar/selecionar</p>
                <p>• <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">1-6</kbd> - Atalhos de navegação</p>
              </div>
            </div>
          </div>

          {/* Visual Accessibility */}
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Eye className="h-5 w-5 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">Acessibilidade Visual</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="secondary" className="text-xs">Fontes ajustáveis</Badge>
                <Badge variant="secondary" className="text-xs">Alto contraste</Badge>
                <Badge variant="secondary" className="text-xs">Modo daltônico</Badge>
              </div>
            </div>
          </div>

          {/* Motion & Animations */}
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Moon className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">Movimento Reduzido</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Desative animações nas configurações para reduzir fadiga visual
              </p>
            </div>
          </div>

          {/* Screen Reader */}
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
            <Volume2 className="h-5 w-5 mt-0.5 text-orange-600 dark:text-orange-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">Leitores de Tela</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Compatível com NVDA, JAWS e VoiceOver. Todos os elementos possuem ARIA labels.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Precisa de mais ajuda? Visite as <span className="font-medium text-blue-600 dark:text-blue-400">Configurações</span> para personalizar sua experiência.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
