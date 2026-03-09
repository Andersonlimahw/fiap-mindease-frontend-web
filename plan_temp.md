# Integração Firebase Web - MindEase (Vite)

A seguir, a proposta técnica para integração do Firebase Web no MindEase, adaptando o repositório de Expo/Mobile para Vite (Web) e seguindo as regras de neuroarquitetura, acessibilidade e boas práticas do projeto ([prompt-base.toon](file:///Users/andersonlimadev/Projects/mobile/mindease/fiap-mindease-frontend-web/prompt-base.toon)).

## User Review Required

> [!IMPORTANT]
> A migração do [.env](file:///Users/andersonlimadev/Projects/mobile/mindease/fiap-mindease-frontend-web/.env) de EXPO para VITE requer a atualização do arquivo local e do CI/CD, caso configurado. Confirme se a estrutura de pastas e a abordagem de Repositories (Adapters) está alinhada com suas expectativas antes de prosseguirmos para a execução.

---

## Proposed Changes

### 1. Dependências e Configuração Base
- **Instalações**: `npm install firebase`
- **Variáveis de Ambiente**:
  - Atualização do arquivo [.env](file:///Users/andersonlimadev/Projects/mobile/mindease/fiap-mindease-frontend-web/.env): Substituição do prefixo `EXPO_PUBLIC_` por `VITE_`.

#### [MODIFY] .env
#### [NEW] src/config/firebase.ts
Arquivo dedicado à inicialização do Firebase (`initializeApp`, `getAuth`, `getFirestore`) usando as variáveis `import.meta.env.VITE_FIREBASE_*`.

---

### 2. Padrões de Arquitetura (Checklists das Imagens)

Conforme os critérios de avaliação:
- **Uso de interfaces/adapters**: O Firebase não será chamado diretamente nas Stores ou UI. Criaremos uma camada de serviços (`src/services/firebase/`) atuando como Adapters.
- **Persistência Real**: Conectaremos o estado do Zustand ao Firebase (Firestore) para garantir sincronização na nuvem e restauração de dados nos recarregamentos.
- **Separação por domínio**: Criação de repositórios específicos (ex: `AuthRepository`, `TaskRepository`).

---

### 3. Mapeamento de Features e Contratos (Firestore)

Abaixo, o mapeamento de entidades locais (Zustand Stores) para coleções do Firebase:

#### Feature: Autenticação (Auth)
- **Store**: `useAuthStore`
- **Serviço**: `FirebaseAuthService`
- **Contrato Firebase (Auth)**:
  - Integração com `signInWithEmailAndPassword` e mapeamento do objeto de usuário do Firebase para o formato local `{ email, name, uid }`.

#### Feature: Gerenciamento de Tarefas (Tasks & Kanban)
- **Store**: `useTasksStore`
- **Serviço**: `FirebaseTaskRepository`
- **Contrato Firestore**: `users/{userId}/tasks/{taskId}`
  ```typescript
  interface FirestoreTask {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    subTasks: Array<{ id: string; title: string; completed: boolean }>;
    createdAt: string; // ISO String
    completedAt?: string;
  }
