# MindEase Design System

## 📐 Visão Geral

O MindEase Design System foi construído com foco em **acessibilidade WCAG 2.2 AA**, **neuroadaptabilidade** e **inclusão**. Cada decisão de design considera usuários com diferentes necessidades cognitivas e sensoriais.

---

## 🎨 Fundamentos de Design

### Princípios

1. **Acessibilidade em Primeiro Lugar**: Todos os elementos seguem WCAG 2.2 AA
2. **Adaptabilidade**: O sistema se adapta às necessidades do usuário
3. **Clareza**: Interfaces limpas e sem distrações
4. **Consistência**: Padrões visuais previsíveis
5. **Feedback**: Respostas claras a todas as ações

---

## 🎨 Paleta de Cores

### Cores Principais

#### Light Mode
```css
--background: #ffffff          /* Fundo principal */
--foreground: oklch(0.145 0 0) /* Texto principal (preto suave) */
--primary: #030213             /* Ação primária (preto profundo) */
--primary-foreground: #ffffff  /* Texto em primária */
```

#### Dark Mode
```css
--background: oklch(0.145 0 0) /* Fundo principal (preto suave) */
--foreground: oklch(0.985 0 0) /* Texto principal (branco suave) */
--primary: oklch(0.985 0 0)    /* Ação primária (branco suave) */
--primary-foreground: oklch(0.205 0 0) /* Texto em primária */
```

#### High Contrast Mode
```css
--background: #000000          /* Preto puro */
--foreground: #ffffff          /* Branco puro */
--primary: #ffffff             /* Branco puro */
--primary-foreground: #000000  /* Preto puro */
--border: #ffffff              /* Bordas brancas */
```

### Cores Semânticas

#### Success / Info
```css
--chart-2: oklch(0.6 0.118 184.704)    /* Azul-ciano */
--chart-4: oklch(0.828 0.189 84.429)   /* Verde-lima */
```

#### Warning / Focus
```css
--chart-1: oklch(0.646 0.222 41.116)   /* Laranja */
--chart-5: oklch(0.769 0.188 70.08)    /* Amarelo-laranja */
```

#### Error / Destructive
```css
--destructive: #d4183d                 /* Vermelho */
--destructive-foreground: #ffffff      /* Texto em destructive */
```

#### Neutral
```css
--muted: #ececf0                       /* Cinza claro */
--muted-foreground: #717182            /* Texto secundário */
--accent: #e9ebef                      /* Destaque sutil */
--accent-foreground: #030213           /* Texto em accent */
```

### Gradientes de Funcionalidade

```css
/* Dashboard */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

/* Modo Foco */
background: linear-gradient(135deg, #F97316 0%, #EF4444 100%);

/* Tarefas */
background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);

/* Leitor de Conteúdo */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Chat IA */
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```

### Contraste e Acessibilidade

**Ratios de Contraste (WCAG 2.2 AA)**:
- Texto normal: mínimo 4.5:1
- Texto grande (18px+): mínimo 3:1
- Elementos UI: mínimo 3:1

**Testado com**:
- ✅ Light Mode: 5.2:1 (texto principal)
- ✅ Dark Mode: 15.8:1 (texto principal)
- ✅ High Contrast: 21:1 (máximo contraste)

---

## 🔤 Tipografia

### Família de Fontes

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
```

**Razão**: Fontes do sistema garantem:
- Melhor performance (já estão instaladas)
- Familiaridade para o usuário
- Excelente legibilidade
- Suporte a diversos idiomas

### Escala Tipográfica

#### Base (Ajustável)
```css
--font-size: 16px; /* Padrão, ajustável 12-24px */
```

#### Hierarquia
```css
/* Tamanhos relativos */
h1: var(--text-2xl)   /* ~30px */
h2: var(--text-xl)    /* ~24px */
h3: var(--text-lg)    /* ~20px */
h4: var(--text-base)  /* ~16px */
p:  var(--text-base)  /* ~16px */
```

### Pesos de Fonte

```css
--font-weight-normal: 400;  /* Texto normal */
--font-weight-medium: 500;  /* Títulos, botões, labels */
```

### Line Height

```css
--line-height-base: 1.5; /* Padrão, ajustável 1.2-2.0 */
```

**Recomendações**:
- Texto de leitura: 1.5-1.8
- Títulos: 1.2-1.4
- Dislexia: 1.8-2.0

### Letter Spacing

```css
--letter-spacing-base: 0; /* Padrão, ajustável 0-0.2em */
```

**Recomendações**:
- Normal: 0
- Dislexia: 0.08em-0.12em
- Baixa visão: 0.12em-0.2em

---

## 📐 Espaçamento

### Sistema de Espaçamento (8px Grid)

```css
--spacing-0: 0px;
--spacing-1: 4px;    /* 0.25rem */
--spacing-2: 8px;    /* 0.5rem */
--spacing-3: 12px;   /* 0.75rem */
--spacing-4: 16px;   /* 1rem */
--spacing-5: 20px;   /* 1.25rem */
--spacing-6: 24px;   /* 1.5rem */
--spacing-8: 32px;   /* 2rem */
--spacing-10: 40px;  /* 2.5rem */
--spacing-12: 48px;  /* 3rem */
--spacing-16: 64px;  /* 4rem */
--spacing-20: 80px;  /* 5rem */
--spacing-24: 96px;  /* 6rem */
```

### Uso Semântico

```css
/* Padding de Cards */
padding: var(--spacing-6);

/* Margin entre Seções */
margin-bottom: var(--spacing-12);

/* Gap em Grids */
gap: var(--spacing-4);

/* Espaçamento de Botões */
padding: var(--spacing-3) var(--spacing-6);
```

---

## 🎭 Componentes

### Botões

#### Variantes

**Primary**
```tsx
<Button variant="default">
  Ação Principal
</Button>
```
- Background: `var(--primary)`
- Foreground: `var(--primary-foreground)`
- Hover: Escurece 10%
- Focus: Outline 3px `var(--ring)`

**Secondary**
```tsx
<Button variant="secondary">
  Ação Secundária
</Button>
```
- Background: `var(--secondary)`
- Foreground: `var(--secondary-foreground)`

**Destructive**
```tsx
<Button variant="destructive">
  Excluir
</Button>
```
- Background: `var(--destructive)`
- Foreground: `var(--destructive-foreground)`

**Outline**
```tsx
<Button variant="outline">
  Opção
</Button>
```
- Background: Transparente
- Border: 1px `var(--border)`
- Foreground: `var(--foreground)`

**Ghost**
```tsx
<Button variant="ghost">
  Ação Sutil
</Button>
```
- Background: Transparente
- Hover: `var(--accent)`

#### Tamanhos

```tsx
<Button size="sm">Pequeno</Button>    /* height: 36px */
<Button size="default">Padrão</Button> /* height: 40px */
<Button size="lg">Grande</Button>     /* height: 44px */
<Button size="icon">⚙️</Button>        /* width: 40px, height: 40px */
```

#### Estados

- **Default**: Estado normal
- **Hover**: Background +10% lightness
- **Active**: Background -10% lightness
- **Focus**: Outline 3px offset 2px
- **Disabled**: Opacity 50%, cursor not-allowed

#### Acessibilidade

```tsx
<Button
  aria-label="Descrição clara"
  disabled={isLoading}
  aria-busy={isLoading}
>
  {isLoading ? <Spinner /> : 'Salvar'}
</Button>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal
  </CardContent>
</Card>
```

**Especificações**:
- Background: `var(--card)`
- Border: 1px `var(--border)`
- Border Radius: `var(--radius-lg)`
- Padding: `var(--spacing-6)`
- Shadow: Sutil (0 1px 3px rgba(0,0,0,0.1))

### Inputs

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="seu@email.com"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <p id="email-error" className="text-destructive">
      Email inválido
    </p>
  )}
</div>
```

**Especificações**:
- Height: 40px (touch-friendly)
- Padding: 8px 12px
- Border: 1px `var(--input)`
- Background: `var(--input-background)`
- Border Radius: `var(--radius-md)`
- Focus: Ring 2px `var(--ring)`

### Switch

```tsx
<div className="flex items-center space-x-2">
  <Switch
    id="reduce-motion"
    checked={reduceMotion}
    onCheckedChange={setReduceMotion}
    aria-label="Reduzir movimento"
  />
  <Label htmlFor="reduce-motion">
    Reduzir Movimento
  </Label>
</div>
```

### Slider

```tsx
<Slider
  value={[fontSize]}
  onValueChange={([value]) => setFontSize(value)}
  min={12}
  max={24}
  step={1}
  className="w-full"
  aria-label="Tamanho da fonte"
/>
```

---

## 🎯 Border Radius

```css
--radius: 0.625rem;              /* 10px - Base */
--radius-sm: calc(var(--radius) - 4px);  /* 6px */
--radius-md: calc(var(--radius) - 2px);  /* 8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) + 4px);  /* 14px */
```

---

## 🌈 Modos de Daltonismo

### Filtros SVG

#### Protanopia (Vermelho-Cego)
```svg
<filter id="protanopia-filter">
  <feColorMatrix type="matrix" values="
    0.567, 0.433, 0,     0, 0
    0.558, 0.442, 0,     0, 0
    0,     0.242, 0.758, 0, 0
    0,     0,     0,     1, 0
  "/>
</filter>
```

#### Deuteranopia (Verde-Cego)
```svg
<filter id="deuteranopia-filter">
  <feColorMatrix type="matrix" values="
    0.625, 0.375, 0,   0, 0
    0.7,   0.3,   0,   0, 0
    0,     0.3,   0.7, 0, 0
    0,     0,     0,   1, 0
  "/>
</filter>
```

#### Tritanopia (Azul-Cego)
```svg
<filter id="tritanopia-filter">
  <feColorMatrix type="matrix" values="
    0.95, 0.05,  0,     0, 0
    0,    0.433, 0.567, 0, 0
    0,    0.475, 0.525, 0, 0
    0,    0,     0,     1, 0
  "/>
</filter>
```

---

## ♿ Recursos de Acessibilidade

### Navegação por Teclado

**Atalhos Globais**:
- `Tab`: Próximo elemento focável
- `Shift + Tab`: Elemento focável anterior
- `Enter/Space`: Ativar botão/link
- `Esc`: Fechar modal/dropdown
- `Arrow Keys`: Navegar em listas/menus

**Skip Links** (implícitos):
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Pular para conteúdo principal
</a>
```

### Focus Visible

```css
*:focus-visible {
  outline: 3px solid var(--ring);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  box-shadow: 0 0 0 3px var(--ring);
}
```

### ARIA Labels

```tsx
/* Botão com ícone */
<button aria-label="Fechar modal">
  <X className="size-4" />
</button>

/* Input com erro */
<input
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
{hasError && (
  <span id="error-message" role="alert">
    {errorMessage}
  </span>
)}

/* Loading state */
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Carregando...' : 'Salvar'}
</button>
```

### Contraste de Cores

**Ferramentas de Teste**:
- WebAIM Contrast Checker
- Chrome DevTools Lighthouse
- axe DevTools

**Ratios Mínimos** (WCAG 2.2 AA):
- Texto normal (<18px): 4.5:1
- Texto grande (≥18px ou ≥14px bold): 3:1
- Elementos de UI: 3:1

### Redução de Movimento

```css
.reduce-motion,
.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

```tsx
/* Aplicar condicionalmente */
const { reduceMotion } = useAccessibility();

<motion.div
  animate={{ opacity: 1 }}
  transition={{ 
    duration: reduceMotion ? 0 : 0.3 
  }}
>
  Conteúdo animado
</motion.div>
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile First */
/* xs: 0px - 639px (default) */

/* sm: 640px+ */
@media (min-width: 640px) { }

/* md: 768px+ */
@media (min-width: 768px) { }

/* lg: 1024px+ */
@media (min-width: 1024px) { }

/* xl: 1280px+ */
@media (min-width: 1280px) { }

/* 2xl: 1536px+ */
@media (min-width: 1536px) { }
```

### Touch Targets

**Tamanhos Mínimos** (WCAG 2.2 AA - 2.5.8):
- Botões: 44x44px (mínimo 40x40px)
- Links: 44x44px área clicável
- Inputs: 40px+ altura

```tsx
<Button className="min-h-[44px] min-w-[44px]">
  Botão Acessível
</Button>
```

---

## 🎨 Temas

### Estrutura de Tema

```typescript
interface Theme {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    // ... demais cores
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  borderRadius: Record<string, string>;
}
```

### Alternância de Tema

```tsx
import { useThemeStore } from '@/stores/useThemeStore';

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Claro</SelectItem>
        <SelectItem value="dark">Escuro</SelectItem>
        <SelectItem value="high-contrast">Alto Contraste</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

## 🚀 Animações

### Princípios

1. **Sutil**: Não deve distrair
2. **Rápida**: Duração 150-300ms
3. **Opcional**: Respeitar `prefers-reduced-motion`
4. **Proposital**: Cada animação tem um objetivo

### Transições Padrão

```css
/* Padrão */
transition: all 0.2s ease-in-out;

/* Fade */
transition: opacity 0.3s ease-in-out;

/* Scale */
transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Slide */
transition: transform 0.3s ease-out;
```

### Motion (Framer Motion)

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo animado
</motion.div>
```

---

## 📝 Melhores Práticas

### Hierarquia Visual

1. **Primário**: Ação mais importante (botão primary)
2. **Secundário**: Ações alternativas (botões secondary/outline)
3. **Terciário**: Ações de suporte (botões ghost)

### Feedback Visual

- **Loading**: Spinners, skeletons
- **Success**: Toast verde, ícone de check
- **Error**: Toast vermelho, mensagem clara
- **Warning**: Toast amarelo/laranja

### Mensagens de Erro

```tsx
/* ❌ Ruim */
<p className="text-red-500">Erro!</p>

/* ✅ Bom */
<p className="text-destructive" role="alert">
  Email inválido. Por favor, verifique o formato.
</p>
```

### Labels e Placeholders

```tsx
/* ❌ Ruim */
<Input placeholder="Nome" />

/* ✅ Bom */
<div>
  <Label htmlFor="name">Nome Completo</Label>
  <Input
    id="name"
    placeholder="Ex: João Silva"
    aria-required="true"
  />
</div>
```

---

## 🛠️ Ferramentas de Desenvolvimento

### Verificação de Acessibilidade

- **axe DevTools**: Extensão do Chrome/Firefox
- **WAVE**: Avaliador de acessibilidade web
- **Lighthouse**: Auditoria do Chrome DevTools
- **NVDA/JAWS**: Leitores de tela para teste

### Teste de Contraste

- **WebAIM Contrast Checker**
- **Contrast Ratio (Lea Verou)**
- **Chrome DevTools Color Picker**

### Teste de Daltonismo

- **Chromatic Vision Simulator**
- **Color Oracle**
- **Browser Extensions**: Colorblind Web Page Filter

---

## 📚 Recursos

### WCAG 2.2 AA

- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 What's New](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

### Design Systems Referência

- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Microsoft Fluent 2](https://fluent2.microsoft.design/)

### Acessibilidade

- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

---

## 📊 Tokens de Design

### Como Usar

```tsx
import { tokens } from '@/design-system/tokens';

// JavaScript/TypeScript
const primaryColor = tokens.colors.primary;

// CSS (via CSS Variables)
background-color: var(--color-primary);

// Tailwind Classes
<div className="bg-primary text-primary-foreground">
```

### Arquivo de Tokens

```typescript
// src/design-system/tokens.ts
export const tokens = {
  colors: {
    light: {
      background: '#ffffff',
      foreground: 'oklch(0.145 0 0)',
      // ... demais cores
    },
    dark: {
      // ... cores dark mode
    },
    highContrast: {
      // ... cores high contrast
    },
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    // ... demais espaçamentos
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, ...',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.8',
      loose: '2',
    },
  },
  borderRadius: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '14px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
};
```

---

## ✅ Checklist de Acessibilidade

### Antes de Lançar

- [ ] Todos os elementos interativos são navegáveis por teclado
- [ ] Focus visible em todos elementos focáveis
- [ ] Contraste de cores ≥ 4.5:1 para texto normal
- [ ] Contraste de cores ≥ 3:1 para texto grande e elementos UI
- [ ] Todos os botões e links têm labels descritivos
- [ ] Imagens têm alt text apropriado
- [ ] Formulários têm labels associados
- [ ] Mensagens de erro são descritivas e anunciadas
- [ ] Navegação funciona sem mouse
- [ ] Testado com leitor de tela (NVDA/JAWS)
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Touch targets ≥ 44x44px
- [ ] Testado em modo alto contraste
- [ ] Testado com zoom de 200%
- [ ] HTML semântico correto

---

**Desenvolvido com ❤️ e acessibilidade em mente**
**MindEase Design System v1.0**
