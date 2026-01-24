# Guia Completo de Funcionalidades - MindEase

## 🎯 Visão Geral das Telas

### 1. 🔐 Tela de Login

**Funcionalidades:**
- Autenticação acessível com validação em tempo real
- Mostrar/ocultar senha
- Mensagens de erro claras
- Auto-focus no primeiro campo
- Totalmente navegável por teclado

**Casos de Uso:**
- Primeiro acesso de usuário
- Login rápido com credenciais salvas
- Recuperação de senha

**Acessibilidade:**
- ✅ Labels associados corretamente
- ✅ Mensagens de erro com aria-describedby
- ✅ Validação inline
- ✅ Alto contraste

---

### 2. 🏠 Dashboard

**Funcionalidades:**
- Controle de nível de estimulação (0-100%)
- Cards de acesso rápido a todas as funcionalidades
- Estatísticas de produtividade em tempo real
- Guia de acessibilidade integrado

**Nível de Estimulação:**
- **0-30% (Mínimo)**: Cores suaves, sem animações, alto contraste
- **30-70% (Moderado)**: Equilíbrio entre estímulo e calma
- **70-100% (Alto)**: Cores vibrantes, animações ativas

**Casos de Uso:**
- Ajustar ambiente para diferentes estados cognitivos
- Visualizar progresso diário
- Navegação rápida entre funcionalidades

---

### 3. 🎯 Modo Foco

**Funcionalidades:**
- Ativação/desativação com transição suave
- Bloqueio de notificações
- Sons ambientes: Chuva, Floresta, Oceano, Ruído Branco, Café
- Redução de brilho opcional
- Durações personalizáveis (15, 25, 45, 60, 90 min)

**Estados:**
- **Inativo**: Configuração e personalização
- **Ativo**: Interface minimalista com timer grande

**Casos de Uso:**
- Sessões de trabalho profundo
- Estudo intensivo
- Momentos de hiperfoco (TDAH)
- Combinação com Pomodoro

**Acessibilidade:**
- ✅ Anúncio de mudanças de estado
- ✅ Controles grandes e claros
- ✅ Feedback visual de ativação

---

### 4. ✅ Tarefas com Micro-Etapas

**Funcionalidades:**
- Criação rápida de tarefas
- Divisão em micro-etapas (2-5 minutos cada)
- Priorização: Alta, Média, Baixa
- Barra de progresso por tarefa
- Expansão/recolhimento de etapas
- Exclusão de tarefas

**Micro-Etapas - Por quê?**
- Reduz paralisia de tarefas grandes
- Ideal para TDAH e ansiedade
- Gamificação natural (marcar ✓)
- Sensação de progresso constante

**Exemplo de Tarefa:**
```
📋 Escrever relatório mensal
  ✅ Abrir template
  ✅ Reunir dados de janeiro
  ⬜ Escrever seção de vendas
  ⬜ Criar gráficos
  ⬜ Revisar ortografia
  ⬜ Enviar para gerente
```

**Casos de Uso:**
- Gerenciamento de projetos pessoais
- Lista de tarefas diárias
- Divisão de trabalhos acadêmicos
- Rotinas de autocuidado

---

### 5. 📖 Leitor de Conteúdo

**Funcionalidades:**
- **Modo Resumido**: Pontos-chave em lista
- **Modo Detalhado**: Conteúdo completo formatado
- Alternância rápida entre modos
- Modo tela cheia para leitura imersiva
- Leitura por voz (Text-to-Speech)
- Tempo estimado de leitura

**Benefícios:**
- Reduz sobrecarga cognitiva
- Permite escaneamento rápido
- Aprofundamento sob demanda
- Acessível para dislexia

**Casos de Uso:**
- Leitura de artigos longos
- Resumo de documentação
- Estudo de conteúdo técnico
- Revisão rápida antes de reuniões

---

### 6. ⏱️ Timer Pomodoro

**Funcionalidades:**
- Timer com 3 modos: Foco (25min), Pausa Curta (5min), Pausa Longa (15min)
- Auto-transição entre modos
- Notificação sonora ao completar
- Estatísticas de produtividade
- Contador de ciclos completos

**Técnica Pomodoro:**
```
1. 🍅 25 min de foco
2. ☕ 5 min de pausa
3. 🍅 25 min de foco
4. ☕ 5 min de pausa
5. 🍅 25 min de foco
6. ☕ 5 min de pausa
7. 🍅 25 min de foco
8. 🏖️ 15-30 min de pausa longa
```

**Casos de Uso:**
- Sessões de estudo
- Trabalho com prazos
- Prevenção de burnout
- Treinamento de foco (TDAH)

**Estatísticas:**
- Pomodoros completados hoje
- Próxima pausa
- Ciclos completos (4 pomodoros = 1 ciclo)

---

### 7. 💬 Chat de Suporte IA

**Funcionalidades:**
- Interface de chat acessível
- Respostas contextuais sobre produtividade
- Perguntas rápidas pré-definidas
- Histórico completo de conversação
- Indicador de digitação
- Limpeza de conversa

**Tópicos de Suporte:**
1. **Produtividade**: Técnicas de foco, Pomodoro, GTD
2. **Ansiedade**: Respiração, mindfulness, grounding
3. **Organização**: Sistema de tarefas, priorização
4. **Acessibilidade**: Configurações, ajustes
5. **Bem-estar**: Pausas, autocuidado, limites

**Perguntas Rápidas:**
- Como posso melhorar meu foco?
- Explique a técnica Pomodoro
- Dicas para reduzir ansiedade
- Como organizar minhas tarefas?
- Técnicas de respiração para relaxar

**Com Ollama (Produção):**
- Respostas personalizadas baseadas em contexto
- Aprendizado do padrão do usuário
- 100% privado e local
- Sem envio de dados para terceiros

---

### 8. ⚙️ Configurações e Acessibilidade

**Abas:**

#### 🦾 Acessibilidade
- **Fonte**: 12-24px
- **Altura de Linha**: 1.2-2.0
- **Espaçamento de Letras**: 0-0.2em
- **Reduzir Movimento**: On/Off
- **Modo Leitor de Tela**: On/Off
- **Modo Daltônico**: Nenhum, Protanopia, Deuteranopia, Tritanopia

#### 🎨 Aparência
- **Tema Claro**: Fundo branco, texto escuro
- **Tema Escuro**: Fundo escuro, texto claro
- **Alto Contraste**: Preto/branco puro

#### 👤 Perfil
- Informações da conta
- Estatísticas de uso
- Logout

---

## 📱 Responsividade

### Desktop (1920px+)
- Layout em 3 colunas
- Navegação horizontal completa
- Sidebar expandida
- Cards grandes

### Tablet (768px)
- Layout em 2 colunas
- Navegação com ícones e texto
- Cards médios
- Scroll otimizado

### Mobile (375px)
- Layout em 1 coluna
- Navegação apenas com ícones
- Cards empilhados
- Bottom sheet para detalhes

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Alt + 1` | Dashboard |
| `Alt + 2` | Modo Foco |
| `Alt + 3` | Tarefas |
| `Alt + 4` | Leitor |
| `Alt + 5` | Pomodoro |
| `Alt + 6` | Chat IA |
| `Alt + 9` | Configurações |
| `Tab` | Próximo elemento |
| `Shift + Tab` | Elemento anterior |
| `Enter` / `Space` | Ativar/Selecionar |
| `Esc` | Fechar modal/diálogo |

---

## 🎯 Casos de Uso por Perfil

### 👨‍💼 Profissional com TDAH
1. **Manhã**: Login → Dashboard → Ajustar estimulação para "Alto"
2. **Trabalho**: Modo Foco + Pomodoro → Tarefas divididas em micro-etapas
3. **Tarde**: Reduzir estimulação → Leitor (modo resumido) para emails
4. **Dúvida**: Chat IA para técnicas de foco

### 👩‍🎓 Estudante com Ansiedade
1. **Início**: Login → Configurar tema escuro + redução de movimento
2. **Estudo**: Pomodoro 25min → Pausas com respiração guiada (Chat IA)
3. **Leitura**: Leitor modo detalhado → Text-to-Speech ativo
4. **Organização**: Tarefas com micro-etapas para projetos

### 👴 Idoso com Baixa Visão
1. **Setup**: Configurações → Fonte 24px → Alto contraste
2. **Uso**: Navegação por teclado → Comandos de voz
3. **Interface**: Cards grandes → Espaçamento aumentado
4. **Suporte**: Chat IA com respostas claras e simples

### 🎨 Designer com Daltonismo
1. **Configuração**: Modo daltônico → Protanopia
2. **Cores**: Ajuste automático de paleta
3. **Contraste**: Sempre acima de 4.5:1
4. **Ícones**: Sempre acompanhados de texto

---

## 🔒 Privacidade e Dados

### Armazenamento Local
- Configurações: `localStorage`
- Tarefas: `localStorage`
- Histórico de chat: `localStorage`
- Nenhum cookie de rastreamento

### Com Supabase (Opcional)
- Sincronização entre dispositivos
- Backup automático
- Compartilhamento de tarefas
- **Sempre criptografado**

### Com Ollama
- IA 100% local
- Nenhum dado enviado para internet
- Privacidade total
- LGPD/GDPR compliant

---

## 📊 Métricas de Acessibilidade

### WCAG 2.2 AA - Checklist

#### Perceptível
- [x] 1.1.1 Conteúdo Não-textual: Todos os ícones têm aria-label
- [x] 1.3.1 Info e Relacionamentos: Estrutura semântica correta
- [x] 1.4.3 Contraste (Mínimo): 4.5:1 para texto normal
- [x] 1.4.4 Redimensionar Texto: Até 200% sem quebra
- [x] 1.4.11 Contraste Não-textual: 3:1 para componentes UI

#### Operável
- [x] 2.1.1 Teclado: Totalmente navegável
- [x] 2.1.2 Sem Armadilha de Teclado: Sempre pode sair
- [x] 2.4.3 Ordem do Foco: Lógica e previsível
- [x] 2.4.7 Foco Visível: Sempre visível com outline
- [x] 2.5.3 Label no Nome: Labels correspondem ao nome acessível

#### Compreensível
- [x] 3.1.1 Idioma da Página: pt-BR declarado
- [x] 3.2.1 Em Foco: Sem mudanças automáticas
- [x] 3.3.1 Identificação de Erro: Erros claramente identificados
- [x] 3.3.2 Labels ou Instruções: Todos os campos têm labels

#### Robusto
- [x] 4.1.2 Nome, Função, Valor: ARIA correto
- [x] 4.1.3 Mensagens de Status: aria-live para atualizações

---

## 🚀 Roadmap Futuro

### Fase 1 (MVP) ✅
- [x] Login e autenticação
- [x] Dashboard com estimulação
- [x] Configurações de acessibilidade
- [x] Modo Foco
- [x] Tarefas com micro-etapas
- [x] Leitor de conteúdo
- [x] Timer Pomodoro
- [x] Chat IA (demo)

### Fase 2 (Em Planejamento)
- [ ] Integração Ollama real
- [ ] Sincronização Supabase
- [ ] PWA com modo offline
- [ ] Notificações push
- [ ] Gamificação e conquistas

### Fase 3 (Futuro)
- [ ] Mobile apps nativo (React Native)
- [ ] Integração com calendário
- [ ] Análise de produtividade com ML
- [ ] Modo colaborativo
- [ ] Extensão de navegador

---

**💡 Dica Final**: Explore todas as telas, ajuste as configurações de acessibilidade conforme sua necessidade, e use o Chat IA para tirar dúvidas!
