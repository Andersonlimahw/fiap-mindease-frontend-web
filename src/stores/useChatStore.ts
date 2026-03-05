import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FirebaseChatRepository } from '../services/firebase/FirebaseChatRepository';
import { GeminiService } from '../services/ai/GeminiService';
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
  error: string | null;
  addMessage: (content: string, role: 'user' | 'assistant') => string;
  appendChunkToMessage: (id: string, chunk: string) => void;
  sendMessageStream: (content: string) => Promise<void>;
  clearHistory: () => void;
}

const generateId = () => {
    try {
        return crypto.randomUUID();
    } catch {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'initial',
          role: 'assistant',
          content: 'Olá! Sou o MindEase AI, seu assistente de produtividade. Como posso ajudar você hoje com foco, gerenciamento de tarefas ou redução de ansiedade?',
          timestamp: new Date().toISOString()
        }
      ],
      isLoading: false,
      error: null,

      addMessage: (content, role) => {
        const id = generateId();
        const message: ChatMessage = {
          id,
          role,
          content,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, message],
        }));

        const user = useAuthStore.getState().user;
        if (user?.uid) {
          FirebaseChatRepository.addMessage(user.uid, message);
        }
        
        return id;
      },

      appendChunkToMessage: (id: string, chunk: string) => {
        set((state) => ({
            messages: state.messages.map((msg) => 
                msg.id === id ? { ...msg, content: msg.content + chunk } : msg
            )
        }));
      },

      sendMessageStream: async (content: string) => {
        set({ error: null });
        
        // 1. Add User Message
        get().addMessage(content, 'user');

        // 2. Add Empty Assistant Message to stream into
        const assistantMsgId = get().addMessage('', 'assistant');

        set({ isLoading: true });

        try {
            const finalContent = await GeminiService.streamMessage(content, (chunk) => {
                get().appendChunkToMessage(assistantMsgId, chunk);
            });

            // 3. Update Firebase with the final complete message
            const user = useAuthStore.getState().user;
            if (user?.uid) {
                // Find the complete message from store to send to Firebase
                const completeMsg = get().messages.find(m => m.id === assistantMsgId);
                if (completeMsg) {
                     FirebaseChatRepository.addMessage(user.uid, completeMsg);
                }
            }
        } catch (error: any) {
             set({ error: error.message || 'Erro ao comunicar com a IA.' });
             get().appendChunkToMessage(assistantMsgId, '\n\n*(Erro: Não foi possível completar a resposta. Verifique sua chave de API nas configurações ou tente novamente mais tarde.)*');
        } finally {
             set({ isLoading: false });
        }
      },

      clearHistory: async () => {
        set({ messages: [
            {
                id: generateId(),
                role: 'assistant',
                content: 'Conversa reiniciada. Como posso ajudar?',
                timestamp: new Date().toISOString()
            }
        ], isLoading: false, error: null });

        GeminiService.clearChat();

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
