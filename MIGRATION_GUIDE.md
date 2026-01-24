# Guia de Migração: Context API → Zustand

Este guia documenta a migração de React Context API para Zustand stores no projeto MindEase.

---

## 📋 Visão Geral

### Antes (Context API)

```tsx
// ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    localStorage.setItem('mindease_theme', theme);
    // ...
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// App.tsx
<ThemeProvider>
  <AccessibilityProvider>
    <App />
  </AccessibilityProvider>
</ThemeProvider>
```

### Depois (Zustand)

```tsx
// useThemeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.classList.add(theme);
        set({ theme });
      },
    }),
    { name: 'mindease-theme' }
  )
);

// App.tsx - Sem providers!
<App />

// Componente qualquer
import { useThemeStore } from '@/stores';
const { theme, setTheme } = useThemeStore();
```

---

## ✅ Benefícios da Migração

### Performance

**Context API**:
- ❌ Re-renderiza TODOS os consumidores quando qualquer valor muda
- ❌ Precisa de `useMemo` e `useCallback` para otimizar
- ❌ Context hell (aninhamento de providers)

**Zustand**:
- ✅ Apenas componentes que usam o estado específico re-renderizam
- ✅ Otimização automática com seletores
- ✅ Sem providers, sem aninhamento

### Código

**Context API**: ~50 linhas por contexto
```tsx
// ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('mindease_theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('mindease_theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**Zustand**: ~25 linhas com persist middleware
```tsx
// useThemeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      
      setTheme: (theme: Theme) => {
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.classList.add(theme);
        set({ theme });
      },
    }),
    { name: 'mindease-theme' }
  )
);
```

### DevTools

**Zustand** integra automaticamente com Redux DevTools:
- Time-travel debugging
- Inspeção de estado
- Rastreamento de mudanças

---

## 🔄 Passo a Passo da Migração

### 1. Instalar Zustand

```bash
npm install zustand
```

### 2. Criar Store

Exemplo: Migrar `AccessibilityContext` → `useAccessibilityStore`

#### Antes (Context)

```tsx
// AccessibilityContext.tsx
export interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  // ...
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    localStorage.setItem('mindease_accessibility', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
```

#### Depois (Zustand)

```tsx
// useAccessibilityStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  // ...
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.5,
  // ...
};

interface AccessibilityState {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (newSettings: Partial<AccessibilitySettings>) => {
        const updatedSettings = { ...get().settings, ...newSettings };
        
        // Apply changes
        applySettings(updatedSettings);
        
        set({ settings: updatedSettings });
      },

      resetSettings: () => {
        applySettings(defaultSettings);
        set({ settings: defaultSettings });
      },
    }),
    { name: 'mindease-accessibility' }
  )
);

// Helper function
function applySettings(settings: AccessibilitySettings) {
  document.documentElement.style.setProperty('--font-size-base', `${settings.fontSize}px`);
  document.documentElement.style.setProperty('--line-height-base', `${settings.lineHeight}`);
  // ...
}
```

### 3. Atualizar Componentes

#### Antes

```tsx
import { useAccessibility } from '@/app/contexts/AccessibilityContext';

function SettingsScreen() {
  const { settings, updateSettings } = useAccessibility();
  // ...
}
```

#### Depois

```tsx
import { useAccessibilityStore } from '@/stores';

function SettingsScreen() {
  const { settings, updateSettings } = useAccessibilityStore();
  // ...
}
```

### 4. Remover Providers

#### Antes

```tsx
// App.tsx
<ThemeProvider>
  <AccessibilityProvider>
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  </AccessibilityProvider>
</ThemeProvider>
```

#### Depois

```tsx
// App.tsx
<div className="min-h-screen">
  {renderScreen()}
</div>
```

---

## 🎯 Padrões de Uso

### Seletor Básico

```tsx
// Busca TODO o estado
const { theme, setTheme } = useThemeStore();
```

### Seletor Parcial (Otimizado)

```tsx
// Busca APENAS o que precisa - melhor performance
const theme = useThemeStore((state) => state.theme);
const setTheme = useThemeStore((state) => state.setTheme);
```

### Múltiplos Valores

```tsx
const { fontSize, lineHeight, updateSettings } = useAccessibilityStore(
  (state) => ({
    fontSize: state.settings.fontSize,
    lineHeight: state.settings.lineHeight,
    updateSettings: state.updateSettings,
  })
);
```

### Uso Fora de Componentes

```tsx
// utils/analytics.ts
import { useAuthStore } from '@/stores';

export function trackEvent(event: string) {
  const { user } = useAuthStore.getState();
  // ...
}
```

---

## 🔧 Features Avançadas

### Middleware: Persist

Salva automaticamente em localStorage:

```tsx
export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      // ...
    }),
    {
      name: 'mindease-tasks',
      partialize: (state) => ({ tasks: state.tasks }), // Salva apenas tasks
    }
  )
);
```

### Middleware: Devtools

```tsx
import { devtools } from 'zustand/middleware';

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        // state
      }),
      { name: 'store-name' }
    ),
    { name: 'Store Display Name' }
  )
);
```

### Subscriptions

Executar efeito colateral quando estado muda:

```tsx
useTasksStore.subscribe(
  (state) => state.tasks,
  (tasks, prevTasks) => {
    console.log('Tasks changed:', tasks);
  }
);
```

### Computed Values (Getters)

```tsx
export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  timeLeft: 1500,
  
  // Computed getter
  getFormattedTime: () => {
    const { timeLeft } = get();
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
}));

// Uso
const formattedTime = usePomodoroStore((state) => state.getFormattedTime());
```

---

## 📊 Comparação de Tamanho

### Bundle Size

| Biblioteca | Size (min+gzip) |
|------------|-----------------|
| React Context | 0 KB (built-in) |
| Zustand | 3.2 KB |
| Redux + Toolkit | 18.5 KB |
| MobX | 16.8 KB |

**Zustand é minúsculo e vale o overhead pelo que oferece!**

---

## 🐛 Troubleshooting

### Store não persiste

**Problema**: Estado não salva no localStorage
**Solução**: Certifique-se de usar o `persist` middleware

```tsx
// ❌ Errado
export const useStore = create<State>((set) => ({...}));

// ✅ Correto
export const useStore = create<State>()(
  persist(
    (set) => ({...}),
    { name: 'store-name' }
  )
);
```

### Mudanças não refletem

**Problema**: Componente não re-renderiza quando estado muda
**Solução**: Use `set()` para atualizar o estado

```tsx
// ❌ Errado
const addTask = (task) => {
  get().tasks.push(task); // Mutação direta
};

// ✅ Correto
const addTask = (task) => {
  set((state) => ({ tasks: [...state.tasks, task] }));
};
```

### Estado inicial não carrega

**Problema**: Estado padrão não aparece
**Solução**: Inicialize o estado no localStorage

```tsx
// useThemeStore.ts
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mindease-theme');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.theme) {
        document.documentElement.classList.add(state.theme);
      }
    } catch (e) {
      console.error('Failed to parse theme', e);
    }
  }
}
```

---

## ✅ Checklist de Migração

Por store:

- [ ] Criar arquivo `use[Nome]Store.ts` em `/src/stores`
- [ ] Copiar tipos e interfaces do context
- [ ] Implementar state e actions com `create()`
- [ ] Adicionar `persist` middleware se necessário
- [ ] Testar lógica de negócio (actions)
- [ ] Atualizar imports nos componentes
- [ ] Remover provider do App.tsx
- [ ] Deletar arquivo de context antigo
- [ ] Atualizar testes (se houver)
- [ ] Verificar no browser que funciona
- [ ] Verificar persistência no localStorage

Global:

- [ ] Todas as stores criadas
- [ ] Todos os componentes atualizados
- [ ] Providers removidos do App.tsx
- [ ] Arquivos de context deletados
- [ ] README atualizado
- [ ] Documentação atualizada

---

## 📚 Recursos

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Zustand vs Context Performance](https://github.com/pmndrs/zustand#performance)
- [Zustand TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)

---

**Migração completa! 🎉**
**MindEase agora usa Zustand para gerenciamento de estado!**
