import { OllamaService, type OllamaMessage } from '../services/ai/OllamaService';
import { GeminiService } from '../services/ai/GeminiService';

export type AIProvider = 'ollama-remote' | 'gemini';

export interface AIServiceAdapter {
    /**
     * Streams a chat response.
     * @param messages  Full conversation history (user + assistant turns)
     * @param onChunk   Called for each text fragment received
     * @param signal    Optional abort signal
     * @returns         Fully assembled response text
     */
    streamMessage: (
        messages: OllamaMessage[],
        onChunk: (text: string) => void,
        signal?: AbortSignal
    ) => Promise<string>;

    /** Clears any server-side / SDK session state */
    clearChat: () => void;
}

/**
 * Returns the active AI service based on VITE_AI_PROVIDER env var.
 * Default: 'ollama-remote'
 */
export const getAIProvider = (): AIProvider => {
    const provider = import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined;
    if (provider === 'gemini') return 'gemini';
    return 'ollama-remote';
};

/**
 * Adapter that wraps OllamaService to expose the same interface as GeminiService.
 * Accepts a full message history so Ollama can maintain context without an SDK session.
 */
const ollamaAdapter: AIServiceAdapter = {
    streamMessage: (messages, onChunk, signal) =>
        OllamaService.streamChat(messages, onChunk, signal),
    clearChat: () => {
        /* Ollama is stateless — no session to clear */
    },
};

/**
 * Adapter that wraps GeminiService to expose the shared interface.
 * Falls back to single-message streaming (no history passed in).
 */
const geminiAdapter: AIServiceAdapter = {
    streamMessage: async (messages, onChunk, _signal) => {
        // GeminiService maintains session state internally
        const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
        return GeminiService.streamMessage(lastUserMsg?.content ?? '', onChunk);
    },
    clearChat: () => GeminiService.clearChat(),
};

/** Returns the configured AI service adapter */
export const AIServiceFactory = {
    create: (): AIServiceAdapter => {
        const provider = getAIProvider();
        return provider === 'gemini' ? geminiAdapter : ollamaAdapter;
    },
};
