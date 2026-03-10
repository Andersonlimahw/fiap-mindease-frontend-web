export interface OllamaMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OllamaConfig {
    host: string;
    model: string;
    apiKey?: string;
}

// Default system prompt mirrors the MindEase AI persona used in GeminiService
const SYSTEM_PROMPT: OllamaMessage = {
    role: 'system',
    content:
        'Você é o MindEase AI, um assistente especializado em neuroarquitetura, produtividade, foco, e bem-estar (como redução de ansiedade e técnica pomodoro). Responda sempre em português, de forma clara, concisa, empática e acessível. Use formatação markdown quando útil.',
};

const getConfig = (): OllamaConfig => ({
    host: import.meta.env.VITE_AI_OLLAMA_URL || 'https://ollama.com',
    model: import.meta.env.VITE_OLLAMA_MODEL || 'kimi-k2.5:cloud',
    apiKey: import.meta.env.VITE_AI_OLLAMA_API_KEY,
});

/**
 * Checks if the remote Ollama instance is reachable (2s timeout).
 */
const isAvailable = async (): Promise<boolean> => {
    try {
        const { host } = getConfig();
        const response = await fetch(`${host}/api/tags`, {
            signal: AbortSignal.timeout(2000),
        });
        return response.ok;
    } catch {
        return false;
    }
};

/**
 * Sends a list of messages to Ollama with streaming.
 * The Ollama /api/chat endpoint streams NDJSON lines.
 * Each line: { message?: { content?: string }, done?: boolean }
 *
 * @param messages  Full conversation history
 * @param onChunk   Callback invoked for every text fragment received
 * @param signal    Optional AbortSignal for request cancellation
 * @returns         The complete assembled response text
 */
const streamChat = async (
    messages: OllamaMessage[],
    onChunk: (text: string) => void,
    signal?: AbortSignal
): Promise<string> => {
    const { host, model, apiKey } = getConfig();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Bearer token support for hosted / guarded Ollama instances
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${host}/api/chat`, {
        method: 'POST',
        signal,
        headers,
        body: JSON.stringify({
            model,
            messages: [SYSTEM_PROMPT, ...messages].map((m) => ({
                role: m.role,
                content: m.content,
            })),
            stream: true,
        }),
    });

    if (!response.ok || !response.body) {
        throw new Error(
            `Ollama request failed: ${response.status} ${response.statusText}`
        );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (signal?.aborted) {
            throw new DOMException('Request aborted', 'AbortError');
        }

        const chunkText = decoder.decode(value, { stream: true });

        // Each line is an independent JSON object (NDJSON)
        for (const line of chunkText.split('\n')) {
            if (!line.trim()) continue;
            try {
                const parsed = JSON.parse(line) as {
                    message?: { content?: string };
                    done?: boolean;
                };
                const text = parsed.message?.content ?? '';
                if (text) {
                    fullResponse += text;
                    onChunk(text);
                }
            } catch {
                // Ignore incomplete JSON at stream buffer boundaries
            }
        }
    }

    return fullResponse;
};

export const OllamaService = {
    isAvailable,
    streamChat,
};
