# MindEase Component Library

## 📦 Índice de Componentes

Catálogo completo dos componentes do MindEase Design System com exemplos de uso, props e variantes.

---

## 🔘 Buttons

### Componente: `<Button />`

**Localização**: `@/app/components/ui/button`

#### Variantes

##### Default (Primary)
```tsx
<Button variant="default">
  Ação Principal
</Button>
```
**Uso**: Ação primária da tela (ex: "Salvar", "Confirmar")
**Estilo**: Background primário, texto em contraste máximo

##### Secondary
```tsx
<Button variant="secondary">
  Ação Secundária
</Button>
```
**Uso**: Ações alternativas menos críticas
**Estilo**: Background cinza suave, texto principal

##### Outline
```tsx
<Button variant="outline">
  Opção
</Button>
```
**Uso**: Ações não-destrutivas, alternativas
**Estilo**: Borda visível, background transparente

##### Ghost
```tsx
<Button variant="ghost">
  Ação Sutil
</Button>
```
**Uso**: Ações terciárias, menos visíveis
**Estilo**: Sem borda, background apenas no hover

##### Destructive
```tsx
<Button variant="destructive">
  Excluir
</Button>
```
**Uso**: Ações destrutivas (deletar, cancelar)
**Estilo**: Vermelho, alto contraste para alertar

##### Link
```tsx
<Button variant="link">
  Ver Mais
</Button>
```
**Uso**: Links inline, navegação sutil
**Estilo**: Sem background, sublinhado no hover

#### Tamanhos

```tsx
<Button size="sm">Pequeno</Button>      // 36px altura
<Button size="default">Padrão</Button>  // 40px altura
<Button size="lg">Grande</Button>       // 44px altura (WCAG touch target)
<Button size="icon">
  <Settings className="size-4" />
</Button>                                // 40x40px quadrado
```

#### Estados

```tsx
// Loading
<Button disabled aria-busy="true">
  {isLoading && <Loader2 className="mr-2 animate-spin" />}
  Salvando...
</Button>

// Disabled
<Button disabled>
  Não Disponível
</Button>

// Com ícone
<Button>
  <Check className="mr-2 size-4" />
  Concluído
</Button>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| variant | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | Estilo visual do botão |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Tamanho do botão |
| disabled | `boolean` | `false` | Desabilita interação |
| asChild | `boolean` | `false` | Renderiza como elemento filho |
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo do botão (para forms) |

---

## 📝 Inputs

### Componente: `<Input />`

**Localização**: `@/app/components/ui/input`

#### Básico

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="seu@email.com"
  />
</div>
```

#### Com Erro

```tsx
<div className="space-y-2">
  <Label htmlFor="password">Senha</Label>
  <Input
    id="password"
    type="password"
    aria-invalid={hasError}
    aria-describedby="password-error"
  />
  {hasError && (
    <p id="password-error" className="text-destructive text-sm" role="alert">
      Senha deve ter pelo menos 6 caracteres
    </p>
  )}
</div>
```

#### Com Ícone

```tsx
<div className="relative">
  <Input
    type="search"
    placeholder="Buscar..."
    className="pl-10"
  />
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
</div>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| type | `string` | `'text'` | Tipo do input (text, email, password, etc) |
| placeholder | `string` | - | Texto de placeholder |
| disabled | `boolean` | `false` | Desabilita o input |
| aria-invalid | `boolean` | - | Indica erro de validação |
| aria-describedby | `string` | - | ID do elemento com descrição/erro |

---

## 🏷️ Labels

### Componente: `<Label />`

**Localização**: `@/app/components/ui/label`

```tsx
<Label htmlFor="username">
  Nome de Usuário
  <span className="text-destructive ml-1">*</span>
</Label>
<Input id="username" required />
```

**Acessibilidade**:
- Sempre use `htmlFor` correspondendo ao `id` do input
- Marque campos obrigatórios visualmente

---

## 🎴 Cards

### Componente: `<Card />`

**Localização**: `@/app/components/ui/card`

#### Estrutura Básica

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>
      Descrição opcional do conteúdo
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

#### Card Interativo

```tsx
<Card className="hover:shadow-md transition-shadow cursor-pointer">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Tarefa #1</CardTitle>
      <Badge variant="secondary">Em Progresso</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      Descrição da tarefa...
    </p>
  </CardContent>
</Card>
```

---

## 🔄 Switch

### Componente: `<Switch />`

**Localização**: `@/app/components/ui/switch`

```tsx
<div className="flex items-center space-x-2">
  <Switch
    id="airplane-mode"
    checked={isEnabled}
    onCheckedChange={setIsEnabled}
    aria-label="Ativar modo avião"
  />
  <Label htmlFor="airplane-mode">Modo Avião</Label>
</div>
```

#### Com Descrição

```tsx
<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label htmlFor="reduce-motion">Reduzir Movimento</Label>
    <p className="text-sm text-muted-foreground">
      Minimiza animações para reduzir distração
    </p>
  </div>
  <Switch
    id="reduce-motion"
    checked={reduceMotion}
    onCheckedChange={setReduceMotion}
  />
</div>
```

---

## 🎚️ Slider

### Componente: `<Slider />`

**Localização**: `@/app/components/ui/slider`

#### Básico

```tsx
<div className="space-y-2">
  <div className="flex justify-between">
    <Label>Tamanho da Fonte</Label>
    <span className="text-sm text-muted-foreground">{fontSize}px</span>
  </div>
  <Slider
    value={[fontSize]}
    onValueChange={([value]) => setFontSize(value)}
    min={12}
    max={24}
    step={1}
    className="w-full"
    aria-label="Ajustar tamanho da fonte"
  />
</div>
```

#### Com Marcadores

```tsx
<div className="space-y-4">
  <Label>Volume</Label>
  <Slider
    value={[volume]}
    onValueChange={([value]) => setVolume(value)}
    min={0}
    max={100}
    step={10}
  />
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>0%</span>
    <span>50%</span>
    <span>100%</span>
  </div>
</div>
```

---

## 📊 Progress

### Componente: `<Progress />`

**Localização**: `@/app/components/ui/progress`

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progresso</span>
    <span className="text-muted-foreground">{progress}%</span>
  </div>
  <Progress value={progress} className="w-full" />
</div>
```

#### Com Cores Customizadas

```tsx
<Progress
  value={75}
  className="w-full"
  indicatorClassName="bg-green-500"
/>
```

---

## 🏷️ Badge

### Componente: `<Badge />`

**Localização**: `@/app/components/ui/badge`

#### Variantes

```tsx
<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Contextos de Uso

```tsx
// Status de tarefa
<Badge variant="default">Completo</Badge>
<Badge variant="secondary">Em Progresso</Badge>
<Badge variant="destructive">Atrasado</Badge>

// Prioridade
<Badge variant="destructive">Alta</Badge>
<Badge variant="default">Média</Badge>
<Badge variant="outline">Baixa</Badge>
```

---

## 🗂️ Tabs

### Componente: `<Tabs />`

**Localização**: `@/app/components/ui/tabs`

```tsx
<Tabs defaultValue="account" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="account">Conta</TabsTrigger>
    <TabsTrigger value="password">Senha</TabsTrigger>
  </TabsList>
  
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Conta</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Conteúdo */}
      </CardContent>
    </Card>
  </TabsContent>
  
  <TabsContent value="password">
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Conteúdo */}
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

---

## 🔔 Toast

### Componente: `<Sonner />`

**Localização**: `@/app/components/ui/sonner`

#### Uso

```tsx
import { toast } from 'sonner';

// Success
toast.success('Tarefa criada com sucesso!');

// Error
toast.error('Não foi possível salvar as alterações');

// Info
toast.info('Nova atualização disponível');

// Warning
toast.warning('Você tem tarefas pendentes');

// Loading
const toastId = toast.loading('Salvando...');
// ... após operação
toast.success('Salvo!', { id: toastId });

// Com ação
toast('Tarefa deletada', {
  action: {
    label: 'Desfazer',
    onClick: () => console.log('Desfazer'),
  },
});
```

---

## 📋 Select

### Componente: `<Select />`

**Localização**: `@/app/components/ui/select`

```tsx
<div className="space-y-2">
  <Label htmlFor="priority">Prioridade</Label>
  <Select value={priority} onValueChange={setPriority}>
    <SelectTrigger id="priority">
      <SelectValue placeholder="Selecione a prioridade" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="low">Baixa</SelectItem>
      <SelectItem value="medium">Média</SelectItem>
      <SelectItem value="high">Alta</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

## 🗨️ Tooltip

### Componente: `<Tooltip />`

**Localização**: `@/app/components/ui/tooltip`

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon">
        <HelpCircle className="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Informações adicionais aqui</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 🎨 Avatar

### Componente: `<Avatar />`

**Localização**: `@/app/components/ui/avatar`

```tsx
<Avatar>
  <AvatarImage src="https://github.com/username.png" alt="Nome do usuário" />
  <AvatarFallback>NU</AvatarFallback>
</Avatar>
```

---

## 📜 Scroll Area

### Componente: `<ScrollArea />`

**Localização**: `@/app/components/ui/scroll-area`

```tsx
<ScrollArea className="h-[300px] w-full rounded-md border p-4">
  {longContent.map((item, index) => (
    <div key={index} className="py-2">
      {item}
    </div>
  ))}
</ScrollArea>
```

---

## 🎭 Dialog

### Componente: `<Dialog />`

**Localização**: `@/app/components/ui/dialog`

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Você tem certeza?</DialogTitle>
      <DialogDescription>
        Esta ação não pode ser desfeita.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        Confirmar
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 📱 Separator

### Componente: `<Separator />`

**Localização**: `@/app/components/ui/separator`

```tsx
<div>
  <h3>Seção 1</h3>
  <Separator className="my-4" />
  <h3>Seção 2</h3>
  <Separator orientation="vertical" className="mx-4 h-10" />
</div>
```

---

## 🎨 Skeleton

### Componente: `<Skeleton />`

**Localização**: `@/app/components/ui/skeleton`

```tsx
// Loading state de um card
<Card>
  <CardHeader>
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-20 w-full" />
  </CardContent>
</Card>
```

---

## 🎨 Accordion

### Componente: `<Accordion />`

**Localização**: `@/app/components/ui/accordion`

```tsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>O que é MindEase?</AccordionTrigger>
    <AccordionContent>
      MindEase é um painel neuroadaptativo de produtividade...
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-2">
    <AccordionTrigger>Como funciona?</AccordionTrigger>
    <AccordionContent>
      O sistema se adapta às suas necessidades...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 📝 Textarea

### Componente: `<Textarea />`

**Localização**: `@/app/components/ui/textarea`

```tsx
<div className="space-y-2">
  <Label htmlFor="description">Descrição</Label>
  <Textarea
    id="description"
    placeholder="Digite a descrição da tarefa..."
    rows={4}
  />
</div>
```

---

## 🎯 Checkbox

### Componente: `<Checkbox />`

**Localização**: `@/app/components/ui/checkbox`

```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="terms"
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <Label
    htmlFor="terms"
    className="text-sm font-normal cursor-pointer"
  >
    Aceito os termos e condições
  </Label>
</div>
```

---

## 📚 Padrões de Composição

### Formulário Completo

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-4">
    {/* Campo de texto */}
    <div className="space-y-2">
      <Label htmlFor="title">Título *</Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-required="true"
      />
    </div>

    {/* Select */}
    <div className="space-y-2">
      <Label htmlFor="priority">Prioridade</Label>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger id="priority">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Baixa</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Switch */}
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor="notifications">Notificações</Label>
        <p className="text-sm text-muted-foreground">
          Receber lembretes por email
        </p>
      </div>
      <Switch
        id="notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
    </div>
  </div>

  {/* Botões */}
  <div className="flex justify-end gap-3">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-2 animate-spin size-4" />}
      Salvar
    </Button>
  </div>
</form>
```

### Lista com Status

```tsx
<div className="space-y-4">
  {tasks.map((task) => (
    <Card key={task.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              aria-label={`Marcar ${task.title} como ${task.completed ? 'incompleta' : 'completa'}`}
            />
            <div>
              <CardTitle className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {task.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge
              variant={
                task.priority === 'high' ? 'destructive' :
                task.priority === 'medium' ? 'default' :
                'outline'
              }
            >
              {task.priority === 'high' ? 'Alta' :
               task.priority === 'medium' ? 'Média' : 'Baixa'}
            </Badge>
            
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  ))}
</div>
```

---

## ♿ Checklist de Acessibilidade por Componente

### Button
- [ ] Texto descritivo ou aria-label
- [ ] Estados hover/focus/active visíveis
- [ ] Desabilitado com aria-disabled quando necessário
- [ ] Loading state com aria-busy

### Input
- [ ] Label associado (htmlFor/id)
- [ ] Placeholder não substitui label
- [ ] Mensagens de erro com aria-describedby
- [ ] aria-invalid em caso de erro
- [ ] aria-required para campos obrigatórios

### Switch
- [ ] Label associado
- [ ] Estado (on/off) anunciado pelo leitor de tela
- [ ] Descrição adicional quando necessário

### Dialog
- [ ] Foco capturado ao abrir
- [ ] ESC fecha o modal
- [ ] Foco retorna ao trigger ao fechar
- [ ] aria-labelledby e aria-describedby

### Form
- [ ] Todos os campos têm labels
- [ ] Erros são anunciados (role="alert")
- [ ] Submit não funciona sem validação
- [ ] Navegação por teclado funcional

---

**Desenvolvido com ❤️ e acessibilidade em mente**
**MindEase Component Library v1.0**
