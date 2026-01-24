# MindEase - Painel Neuroadaptativo de Produtividade

## 📌 Sobre o Projeto

MindEase é um painel neuroadaptativo de produtividade e acessibilidade com IA de chat integrada. O projeto foi desenvolvido com foco total em acessibilidade (WCAG 2.2 AA) e experiência do usuário adaptativa.

## 🎯 Funcionalidades Principais

### 🔐 Tela de Login/Autenticação
- Login acessível com validação de formulário
- Navegação 100% por teclado
- Feedback visual e mensagens de erro acessíveis
- Suporte a leitores de tela
- **Demo**: Use qualquer email válido e senha com mínimo 6 caracteres

### 🏠 Dashboard Principal
- Visão geral de produtividade
- Controle de nível de estimulação ajustável
- Acesso rápido a todas as funcionalidades
- Cards de status em tempo real
- Design responsivo (desktop, tablet, mobile)

### ⚙️ Configurações e Acessibilidade
- **Tamanho de Fonte**: 12-24px ajustável
- **Espaçamento**: Altura de linha e espaçamento de letras personalizáveis
- **Temas**: Claro, Escuro e Alto Contraste
- **Modo Daltônico**: Protanopia, Deuteranopia, Tritanopia
- **Redução de Movimento**: Para sensibilidade a animações
- **Modo Leitor de Tela**: Otimizações específicas

### 🎯 Modo Foco
- Ativação/desativação com transições suaves
- Bloqueio de notificações
- Sons ambientes (chuva, floresta, oceano, etc.)
- Redução de brilho opcional
- Durações personalizáveis

### ✅ Gerenciamento de Tarefas
- Sistema de tarefas com micro-etapas
- Divisão de tarefas complexas em passos menores
- Priorização (Alta, Média, Baixa)
- Barra de progresso visual
- Animações suaves e feedback imediato

### 📖 Leitor de Conteúdo
- Modo Resumido vs. Detalhado
- Texto adaptativo para diferentes necessidades
- Modo tela cheia para leitura imersiva
- Suporte a leitura por voz (Text-to-Speech)
- Navegação por teclado completa

### ⏱️ Timer Pomodoro
- Técnica Pomodoro completa (25min foco, 5min pausa, 15min pausa longa)
- Notificações sonoras ao completar
- Auto-transição entre modos
- Estatísticas de produtividade
- Controles acessíveis

### 💬 Chat de Suporte IA
- Interface de chat acessível
- Respostas contextuais sobre produtividade
- Perguntas rápidas pré-definidas
- Histórico de conversação
- **Demo**: Respostas pré-programadas simulando Ollama API

## 🏗️ Arquitetura Moderna

### Estado Global com Zustand

O projeto utiliza **Zustand** para gerenciamento de estado, substituindo Context API por uma solução mais performática e escalável.

#### Stores Disponíveis

```typescript
// Autenticação
import { useAuthStore } from '@/stores';
const { isAuthenticated, user, login, logout } = useAuthStore();

// Tema
import { useThemeStore } from '@/stores';
const { theme, setTheme } = useThemeStore();

// Acessibilidade
import { useAccessibilityStore } from '@/stores';
const { settings, updateSettings, resetSettings } = useAccessibilityStore();

// Navegação
import { useNavigationStore } from '@/stores';
const { currentScreen, navigate, goBack } = useNavigationStore();

// Tarefas
import { useTasksStore } from '@/stores';
const { tasks, addTask, toggleTask, deleteTask } = useTasksStore();

// Pomodoro
import { usePomodoroStore } from '@/stores';
const { mode, timeLeft, isRunning, start, pause, reset } = usePomodoroStore();

// Chat IA
import { useChatStore } from '@/stores';
const { messages, sendMessage, clearHistory } = useChatStore();

// Modo Foco
import { useFocusModeStore } from '@/stores';
const { isActive, activate, deactivate } = useFocusModeStore();
```

### Características do Zustand

✅ **Performance**: Apenas componentes que usam o estado são re-renderizados
✅ **DevTools**: Integração com Redux DevTools
✅ **Persistência**: Stores com `persist` middleware salvam automaticamente em localStorage
✅ **TypeScript**: Type-safety completo
✅ **Simples**: API minimalista e fácil de entender

## ♿ Recursos de Acessibilidade (WCAG 2.2 AA)

### ✅ Implementado
- [x] Navegação 100% por teclado
- [x] Focus visible em todos elementos interativos
- [x] ARIA labels e roles apropriados
- [x] Contraste de cores adequado (4.5:1 para texto normal)
- [x] Suporte a leitores de tela
- [x] Redução de movimento opcional
- [x] Tamanhos de fonte ajustáveis
- [x] Temas claro/escuro/alto contraste
- [x] Paletas para daltonismo
- [x] Mensagens de erro claras e descritivas
- [x] Skip links implícitos
- [x] Formulários totalmente acessíveis
- [x] Feedback visual e sonoro
- [x] Tempo de resposta adequado (sem timeouts forçados)

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1**: Framework principal
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Estilização moderna
- **Zustand**: Gerenciamento de estado
- **Motion (Framer Motion)**: Animações acessíveis
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones SVG

### Bibliotecas de UI
- Shadcn/ui components
- Sonner (Toasts acessíveis)
- React Hook Form (validação de formulários)

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- **Desktop**: 1920px+, 1440px, 1024px
- **Tablet**: 768px
- **Mobile**: 375px, 390px, 414px

## 🚀 Como Usar

1. **Login**: Use qualquer email válido e senha com 6+ caracteres
2. **Explore o Dashboard**: Veja o panorama geral de produtividade
3. **Configure Acessibilidade**: Ajuste fontes, temas e preferências
4. **Ative o Modo Foco**: Para sessões de trabalho concentrado
5. **Gerencie Tarefas**: Crie tarefas e divida em micro-etapas
6. **Use o Timer Pomodoro**: Para gerenciamento de tempo eficaz
7. **Leia Conteúdo**: Alterne entre resumido e detalhado
8. **Chat com IA**: Peça ajuda sobre produtividade