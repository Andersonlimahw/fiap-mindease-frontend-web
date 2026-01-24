# MindEase Design System - Especificações para Figma

## 📐 Guia de Implementação no Figma

Este documento fornece as especificações completas para recriar o MindEase Design System no Figma, incluindo todos os componentes, tokens e variantes.

---

## 🎨 1. COLOR STYLES

### 1.1 Criar Coleções de Variáveis

#### Coleção: `MindEase/Semantic Colors`

**Mode: Light**
```
Background
  Value: #FFFFFF

Foreground  
  Value: oklch(0.145 0 0) → #262626

Primary
  Value: #030213

Primary Foreground
  Value: #FFFFFF

Secondary
  Value: oklch(0.95 0.0058 264.53) → #F2F2F7

Secondary Foreground
  Value: #030213

Muted
  Value: #ECECF0

Muted Foreground
  Value: #717182

Accent
  Value: #E9EBEF

Accent Foreground
  Value: #030213

Destructive
  Value: #D4183D

Destructive Foreground
  Value: #FFFFFF

Border
  Value: rgba(0, 0, 0, 0.1)

Input Background
  Value: #F3F3F5

Ring (Focus)
  Value: oklch(0.708 0 0) → #B4B4B4
```

**Mode: Dark**
```
Background
  Value: oklch(0.145 0 0) → #262626

Foreground
  Value: oklch(0.985 0 0) → #FAFAFA

Primary
  Value: oklch(0.985 0 0) → #FAFAFA

Primary Foreground
  Value: oklch(0.205 0 0) → #353535

Secondary
  Value: oklch(0.269 0 0) → #454545

Secondary Foreground
  Value: oklch(0.985 0 0) → #FAFAFA

Muted
  Value: oklch(0.269 0 0) → #454545

Muted Foreground
  Value: oklch(0.708 0 0) → #B4B4B4

Accent
  Value: oklch(0.269 0 0) → #454545

Accent Foreground
  Value: oklch(0.985 0 0) → #FAFAFA

Destructive
  Value: oklch(0.396 0.141 25.723) → #A13636

Destructive Foreground
  Value: oklch(0.637 0.237 25.331) → #E86565

Border
  Value: oklch(0.269 0 0) → #454545

Ring (Focus)
  Value: oklch(0.439 0 0) → #707070
```

**Mode: High Contrast**
```
Background
  Value: #000000

Foreground
  Value: #FFFFFF

Primary
  Value: #FFFFFF

Primary Foreground
  Value: #000000

Secondary
  Value: #FFFFFF

Secondary Foreground
  Value: #000000

Muted
  Value: #333333

Muted Foreground
  Value: #FFFFFF

Accent
  Value: #FFFFFF

Accent Foreground
  Value: #000000

Destructive
  Value: #FF0000

Destructive Foreground
  Value: #FFFFFF

Border
  Value: #FFFFFF

Ring (Focus)
  Value: #FFFFFF
```

#### Coleção: `MindEase/Gradients`

```
Dashboard
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #3B82F6
    100%: #8B5CF6

Focus Mode
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #F97316
    100%: #EF4444

Tasks
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #A855F7
    100%: #EC4899

Reader
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #10B981
    100%: #059669

Chat
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #6366F1
    100%: #8B5CF6

Pomodoro
  Type: Linear Gradient
  Angle: 135°
  Stops:
    0%: #EF4444
    100%: #DC2626
```

---

## 📏 2. TEXT STYLES

### 2.1 Criar Estilos de Texto

```
H1
  Font: System (SF Pro / Segoe UI)
  Size: 30px
  Weight: 500 (Medium)
  Line Height: 45px (1.5)
  Letter Spacing: 0

H2
  Font: System
  Size: 24px
  Weight: 500
  Line Height: 36px
  Letter Spacing: 0

H3
  Font: System
  Size: 20px
  Weight: 500
  Line Height: 30px
  Letter Spacing: 0

H4
  Font: System
  Size: 16px
  Weight: 500
  Line Height: 24px
  Letter Spacing: 0

Body
  Font: System
  Size: 16px
  Weight: 400 (Regular)
  Line Height: 24px
  Letter Spacing: 0

Body Small
  Font: System
  Size: 14px
  Weight: 400
  Line Height: 21px
  Letter Spacing: 0

Caption
  Font: System
  Size: 12px
  Weight: 400
  Line Height: 18px
  Letter Spacing: 0

Label
  Font: System
  Size: 16px
  Weight: 500
  Line Height: 24px
  Letter Spacing: 0

Button
  Font: System
  Size: 16px
  Weight: 500
  Line Height: 24px
  Letter Spacing: 0
```

---

## 🔲 3. EFFECT STYLES

### 3.1 Shadows

```
Shadow SM
  Type: Drop Shadow
  X: 0, Y: 1, Blur: 2, Spread: 0
  Color: rgba(0, 0, 0, 0.05)

Shadow Base
  Type: Drop Shadow
  X: 0, Y: 1, Blur: 3, Spread: 0
  Color: rgba(0, 0, 0, 0.1)
  
  X: 0, Y: 1, Blur: 2, Spread: 0
  Color: rgba(0, 0, 0, 0.06)

Shadow MD
  Type: Drop Shadow
  X: 0, Y: 4, Blur: 6, Spread: 0
  Color: rgba(0, 0, 0, 0.1)
  
  X: 0, Y: 2, Blur: 4, Spread: 0
  Color: rgba(0, 0, 0, 0.06)

Shadow LG
  Type: Drop Shadow
  X: 0, Y: 10, Blur: 15, Spread: 0
  Color: rgba(0, 0, 0, 0.1)
  
  X: 0, Y: 4, Blur: 6, Spread: 0
  Color: rgba(0, 0, 0, 0.05)

Shadow XL
  Type: Drop Shadow
  X: 0, Y: 20, Blur: 25, Spread: 0
  Color: rgba(0, 0, 0, 0.1)
  
  X: 0, Y: 10, Blur: 10, Spread: 0
  Color: rgba(0, 0, 0, 0.04)
```

### 3.2 Focus Ring

```
Focus Ring
  Type: Drop Shadow (usado como outline)
  X: 0, Y: 0, Blur: 0, Spread: 3
  Color: {Ring} color variable
```

---

## 📦 4. COMPONENTS

### 4.1 Button Component

**Frame Setup**:
- Auto Layout: Horizontal
- Padding: 12px 24px
- Gap: 8px
- Height: 40px (default)
- Border Radius: 8px

**Variants (Properties)**:

**Property: Variant**
- default
- secondary
- outline
- ghost
- destructive
- link

**Property: Size**
- sm (height: 36px, padding: 8px 16px)
- default (height: 40px, padding: 12px 24px)
- lg (height: 44px, padding: 14px 28px)
- icon (width: 40px, height: 40px, padding: 12px)

**Property: State**
- default
- hover
- active
- disabled
- focus

**Layers**:
1. Background (Rectangle)
   - Fill: {Primary} (variant default)
   - Fill: {Secondary} (variant secondary)
   - Fill: Transparent, Stroke {Border} (variant outline)
   - etc...

2. Text (Text)
   - Content: "Button"
   - Style: Button
   - Fill: {Primary Foreground}

3. Icon (Optional Frame)
   - Size: 16x16
   - Visible: When needed

**Interactive States**:
- Hover: Reduce opacity to 90%
- Active: Reduce opacity to 80%
- Focus: Add Focus Ring effect
- Disabled: Opacity 50%, cursor not-allowed

### 4.2 Input Component

**Frame Setup**:
- Auto Layout: Horizontal
- Padding: 10px 12px
- Height: 40px
- Border Radius: 8px
- Border: 1px {Border}
- Background: {Input Background}

**Variants (Properties)**:

**Property: State**
- default
- hover
- focus
- error
- disabled

**Layers**:
1. Background (Rectangle)
   - Fill: {Input Background}
   - Stroke: {Border} (default)
   - Stroke: {Ring} (focus)
   - Stroke: {Destructive} (error)

2. Placeholder Text
   - Content: "Placeholder"
   - Fill: {Muted Foreground}
   - Style: Body

3. Input Text
   - Content: "Input value"
   - Fill: {Foreground}
   - Style: Body

**Interactive States**:
- Focus: Stroke 2px {Ring}, add Focus Ring
- Hover: Slight brightness increase
- Error: Stroke {Destructive}

### 4.3 Card Component

**Frame Setup**:
- Auto Layout: Vertical
- Padding: 24px
- Gap: 16px
- Border Radius: 10px
- Background: {Card}
- Border: 1px {Border}
- Shadow: Shadow SM

**Layers**:
1. Card Header (Optional Frame)
   - Auto Layout: Vertical
   - Gap: 8px
   
   a. Card Title (Text)
      - Style: H3
      - Fill: {Card Foreground}
   
   b. Card Description (Text)
      - Style: Body Small
      - Fill: {Muted Foreground}

2. Card Content (Frame)
   - Auto Layout: Vertical
   - Gap: 12px
   - Fill Width

3. Card Footer (Optional Frame)
   - Auto Layout: Horizontal
   - Gap: 12px
   - Justify: End

### 4.4 Switch Component

**Frame Setup**:
- Width: 44px
- Height: 24px
- Border Radius: 9999px
- Background: {Switch Background}

**Variants (Properties)**:

**Property: Checked**
- unchecked (false)
- checked (true)

**Layers**:
1. Background (Rectangle)
   - Fill: {Switch Background} (unchecked)
   - Fill: {Primary} (checked)
   - Border Radius: Full

2. Thumb (Circle)
   - Size: 20x20
   - Fill: {Background}
   - Position X: 2px (unchecked)
   - Position X: 22px (checked)
   - Shadow: Shadow SM

**Animation**:
- Transition: 200ms ease-in-out
- Property: Position X of Thumb
- Property: Background color

### 4.5 Slider Component

**Frame Setup**:
- Width: 200px (flexible)
- Height: 20px

**Layers**:
1. Track (Rectangle)
   - Width: 100%
   - Height: 4px
   - Border Radius: Full
   - Fill: {Muted}

2. Range (Rectangle)
   - Width: 50% (variable based on value)
   - Height: 4px
   - Border Radius: Full
   - Fill: {Primary}

3. Thumb (Circle)
   - Size: 20x20
   - Fill: {Primary}
   - Stroke: 2px {Background}
   - Shadow: Shadow MD
   - Position: Center on Range end

**Interactive States**:
- Hover (Thumb): Scale 1.1
- Active (Thumb): Scale 0.95
- Focus: Add Focus Ring to Thumb

### 4.6 Badge Component

**Frame Setup**:
- Auto Layout: Horizontal
- Padding: 4px 12px
- Height: Min-content
- Border Radius: 9999px

**Variants (Properties)**:

**Property: Variant**
- default
- secondary
- destructive
- outline

**Layers**:
1. Background (Rectangle)
   - Fill: {Primary} (default)
   - Fill: {Secondary} (secondary)
   - Fill: {Destructive} (destructive)
   - Fill: Transparent, Stroke {Border} (outline)

2. Text
   - Style: Caption
   - Fill: {Primary Foreground} (default)
   - Fill: {Secondary Foreground} (secondary)
   - etc...

### 4.7 Progress Component

**Frame Setup**:
- Width: 200px (flexible)
- Height: 8px
- Border Radius: Full

**Layers**:
1. Background (Rectangle)
   - Width: 100%
   - Height: 8px
   - Border Radius: Full
   - Fill: {Muted}

2. Indicator (Rectangle)
   - Width: 0-100% (variable)
   - Height: 8px
   - Border Radius: Full
   - Fill: {Primary}

**Animation**:
- Transition: 300ms ease-in-out
- Property: Width of Indicator

---

## 🎯 5. SPACING SYSTEM

### 5.1 Criar Variáveis de Espaçamento

```
Coleção: MindEase/Spacing

0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### 5.2 Uso em Auto Layout

- **Gap**: Use variáveis de spacing
- **Padding**: Use variáveis de spacing
- **Margins**: Use variáveis de spacing

Exemplo:
```
Card Component
  Padding: {spacing/6} (24px)
  Gap: {spacing/4} (16px)

Button Component
  Padding Horizontal: {spacing/6} (24px)
  Padding Vertical: {spacing/3} (12px)
  Gap: {spacing/2} (8px)
```

---

## 📐 6. BORDER RADIUS

### 6.1 Criar Variáveis

```
Coleção: MindEase/Radius

sm: 6px
md: 8px
lg: 10px
xl: 14px
2xl: 18px
full: 9999px
```

### 6.2 Aplicação

```
Button: {radius/md} = 8px
Card: {radius/lg} = 10px
Input: {radius/md} = 8px
Badge: {radius/full} = 9999px
Switch: {radius/full} = 9999px
```

---

## 🎬 7. INTERACTIVE STATES

### 7.1 Criar Variantes de Estado

Para cada componente interativo, criar variantes:

**State Property**:
- default
- hover
- active (pressed)
- focus
- disabled

**Implementação**:

**Hover**:
- Opacity: 90%
- OR Brightness filter: 110%

**Active**:
- Opacity: 80%
- OR Scale: 0.98

**Focus**:
- Add Focus Ring effect
- Outline: 3px {Ring}
- Outline Offset: 2px

**Disabled**:
- Opacity: 50%
- Cursor: not-allowed

---

## ♿ 8. ACESSIBILIDADE

### 8.1 Touch Targets

**Mínimo**: 44x44px (WCAG 2.2 AA - 2.5.8)

Componentes afetados:
- Buttons: min-height 44px (size lg)
- Switch: min-height 44px (add invisible touch area)
- Checkbox: min-size 44x44px
- Radio: min-size 44x44px

**Implementação no Figma**:
Adicionar layer invisível (Opacity 0) de 44x44px em volta de elementos menores

### 8.2 Focus Indicators

**Sempre visível** em todos os elementos interativos

**Especificações**:
- Outline: 3px solid
- Color: {Ring}
- Offset: 2px
- Shape: Segue border-radius do elemento

### 8.3 Contraste

**Verificar contraste** de todas as combinações de cores:

**Mínimos (WCAG 2.2 AA)**:
- Texto normal (<18px): 4.5:1
- Texto grande (≥18px ou ≥14px bold): 3:1
- Elementos de UI: 3:1

**Plugin Figma**:
- Stark (verificação de contraste)
- A11y - Color Contrast Checker

---

## 🎨 9. DARK MODE

### 9.1 Configuração

**Criar Modes** na Collection de Variáveis:
1. Light (default)
2. Dark
3. High Contrast

**Frame Setup**:
- Aplicar modo na propriedade do frame
- Testar cada componente em cada modo
- Garantir contraste adequado

### 9.2 Verificação

Para cada componente, verificar:
- [ ] Visível em Light Mode
- [ ] Visível em Dark Mode
- [ ] Visível em High Contrast Mode
- [ ] Contraste ≥ 4.5:1 em todos os modos

---

## 🧩 10. COMPONENT ORGANIZATION

### 10.1 Estrutura de Páginas

```
📁 MindEase Design System
  📄 Cover
  📄 Introduction
  📄 Colors
    - Semantic Colors (Light/Dark/High Contrast)
    - Gradients
    - Charts
  📄 Typography
    - Font Scales
    - Line Heights
    - Letter Spacing
  📄 Spacing
  📄 Border Radius
  📄 Shadows & Effects
  📄 Components
    📂 Buttons
    📂 Inputs
    📂 Cards
    📂 Switches
    📂 Sliders
    📂 Badges
    📂 Progress
    📂 Modals
    📂 Toasts
  📄 Accessibility
    - Touch Targets
    - Focus States
    - Contrast Examples
  📄 Examples
    - Login Screen
    - Dashboard
    - Settings
```

### 10.2 Naming Convention

**Components**:
```
MindEase/ComponentName
  └─ Variant=default, Size=default, State=default
```

**Variants**:
```
Button
  Variant: default | secondary | outline | ghost | destructive | link
  Size: sm | default | lg | icon
  State: default | hover | active | focus | disabled
```

---

## ✅ 11. CHECKLIST DE IMPLEMENTAÇÃO

### Cores
- [ ] Criar collection Semantic Colors (3 modes)
- [ ] Criar collection Gradients
- [ ] Criar collection Charts
- [ ] Aplicar em todos os componentes

### Tipografia
- [ ] Criar estilos de texto (H1-H4, Body, Caption, Label, Button)
- [ ] Configurar font families (System)
- [ ] Configurar scales (sizes, weights, line-heights)

### Espaçamento
- [ ] Criar variáveis de spacing (0-24)
- [ ] Aplicar em Auto Layouts

### Border Radius
- [ ] Criar variáveis de radius (sm-full)
- [ ] Aplicar em componentes

### Effects
- [ ] Criar estilos de sombra (sm-xl)
- [ ] Criar estilo de focus ring
- [ ] Aplicar em componentes

### Components
- [ ] Button (6 variants, 4 sizes, 5 states)
- [ ] Input (5 states)
- [ ] Card (header, content, footer)
- [ ] Switch (checked/unchecked)
- [ ] Slider (interactive)
- [ ] Badge (4 variants)
- [ ] Progress
- [ ] Modal/Dialog
- [ ] Toast

### Acessibilidade
- [ ] Touch targets ≥ 44px
- [ ] Focus indicators em todos elementos
- [ ] Verificar contraste (Stark plugin)
- [ ] Testar em 3 modos (Light/Dark/High Contrast)

### Documentação
- [ ] Cover page
- [ ] Introduction
- [ ] Guidelines de uso
- [ ] Examples de telas completas

---

## 📚 12. RECURSOS E PLUGINS RECOMENDADOS

### Plugins Figma Essenciais

1. **A11y - Color Contrast Checker**
   - Verificação de contraste WCAG
   
2. **Stark**
   - Suite completa de acessibilidade
   - Simulação de daltonismo
   
3. **Variables Import/Export**
   - Sincronização com código
   
4. **Component Inspector**
   - Debug de componentes
   
5. **Auto Layout**
   - Otimização de layouts

### Recursos Externos

- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383)
- [Design Systems in Figma](https://www.figma.com/best-practices/design-systems-in-figma/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Desenvolvido com ❤️ e acessibilidade em mente**
**MindEase Design System - Figma Spec v1.0**
