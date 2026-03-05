import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

// Initialize the SDK. We check for the API key in the environment variables.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// We define the model and system instructions to align with the MindEase persona.
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash', // Recommended model for text tasks
  systemInstruction: 'Você é o MindEase AI, um assistente especializado em neuroarquitetura, produtividade, foco, e bem-estar (como redução de ansiedade e técnica pomodoro). Responda sempre em português, de forma clara, concisa, empática e acessível. Use formatação markdown quando útil.',
});

let chatSession: ChatSession | null = null;

export const GeminiService = {
  /**
   * Initializes a new chat session to maintain conversational context.
   */
  initChat: () => {
    chatSession = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  },

  /**
   * Sends a message and streams the response back.
   * @param message The user's message
   * @param onChunk Callback triggered when a new chunk of text arrives
   * @returns The complete response text after the stream finishes
   */
  streamMessage: async (message: string, onChunk: (text: string) => void): Promise<string> => {
    if (!apiKey) {
      throw new Error('API Key do Gemini não configurada (VITE_GEMINI_API_KEY).');
    }

    if (!chatSession) {
      GeminiService.initChat();
    }

    try {
      const result = await chatSession!.sendMessageStream(message);
      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onChunk(chunkText);
      }

      return fullResponse;
    } catch (error) {
      console.error('Gemini Stream Error:', error);
      throw error;
    }
  },

  /**
   * Clears the current chat session context.
   */
  clearChat: () => {
    chatSession = null;
  }
};
