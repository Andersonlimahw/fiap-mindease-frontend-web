import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';
import { useAuthStore } from './useAuthStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

// Demo responses - Replace with Ollama API integration
const demoResponses: Record<string, string> = {
  'técnica pomodoro': 'A Técnica Pomodoro é um método de gerenciamento de tempo que divide o trabalho em intervalos de 25 minutos (chamados "pomodoros"), separados por pausas curtas. Após 4 pomodoros, você faz uma pausa mais longa. Isso ajuda a manter o foco e prevenir a fadiga mental.',

  'organizar tarefas': 'Para organizar suas tarefas de forma eficaz:\n1. Liste todas as tarefas\n2. Divida tarefas grandes em micro-etapas menores\n3. Priorize por urgência e importância\n4. Defina prazos realistas\n5. Use o MindEase para criar e acompanhar suas tarefas!',

  'reduzir ansiedade': 'Algumas estratégias para reduzir ansiedade:\n1. Respiração profunda (4-7-8)\n2. Meditação mindfulness (5-10 min)\n3. Exercício físico regular\n4. Limite de cafeína\n5. Estabeleça uma rotina de sono\n6. Use o modo foco do MindEase para minimizar distrações',

  'melhorar concentração': 'Para melhorar sua concentração:\n1. Elimine distrações (use o Modo Foco)\n2. Trabalhe em blocos de tempo (Pomodoro)\n3. Faça pausas regulares\n4. Mantenha-se hidratado\n5. Ajuste iluminação e temperatura\n6. Pratique meditação diariamente',

  default: 'Sou o assistente IA do MindEase! Posso ajudar com:\n- Técnicas de produtividade\n- Organização de tarefas\n- Gerenciamento de tempo\n- Redução de ansiedade e estresse\n- Dicas de foco e concentração\n\nComo posso ajudar você hoje?'
};

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const [key, response] of Object.entries(demoResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return demoResponses.default;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,

      addMessage: (content, role) => {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date().toISOString(),
        };

        // Optimistic UI update
        set((state) => ({
          messages: [...state.messages, message],
        }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          FirebaseChatRepository.addMessage(user.uid, message);
        }
      },

      sendMessage: async (content: string) => {
        // Add user message
        get().addMessage(content, 'user');

        set({ isLoading: true });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get AI response (demo)
        const response = getResponse(content);

        // Add AI response
        get().addMessage(response, 'assistant');

        set({ isLoading: false });
      },

      clearHistory: async () => {
        set({ messages: [], isLoading: false });

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          await FirebaseChatRepository.clearHistory(user.uid);
        }
      },
    }),
    {
      name: 'mindease-chat',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep only last 50 messages
      }),
    }
  )
);
