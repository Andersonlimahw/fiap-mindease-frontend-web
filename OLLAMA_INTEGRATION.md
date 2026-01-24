# Integração com Ollama API - MindEase

## 📋 Visão Geral

Este documento descreve como integrar o MindEase com a Ollama API para funcionalidade de IA local e privada.

## 🔧 Pré-requisitos

1. **Ollama instalado localmente**
   ```bash
   # macOS/Linux
   curl https://ollama.ai/install.sh | sh
   
   # Windows
   # Baixe de https://ollama.ai/download
   ```

2. **Modelo instalado**
   ```bash
   ollama pull llama2
   # ou
   ollama pull mistral
   # ou qualquer outro modelo de sua preferência
   ```

## 🚀 Configuração

### 1. Iniciar o servidor Ollama

```bash
ollama serve
```

Por padrão, o servidor roda em `http://localhost:11434`

### 2. Testar a conexão

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Por que o céu é azul?",
  "stream": false
}'
```

## 💻 Implementação no MindEase

### Arquivo: `/src/services/ollama.ts`

```typescript
export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generate(prompt: string, context?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: context ? `${context}\n\n${prompt}` : prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }

  async chat(messages: OllamaMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Error calling Ollama chat API:', error);
      throw error;
    }
  }

  async streamChat(
    messages: OllamaMessage[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              onChunk(json.message.content);
            }
          } catch (e) {
            console.warn('Failed to parse chunk:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error streaming from Ollama:', error);
      throw error;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data.models.map((m: any) => m.name);
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }
}

export const ollama = new OllamaService();
```

### Atualizar `/src/app/components/AIChat.tsx`

```typescript
import { ollama } from '@/services/ollama';

// No componente AIChat:
const sendMessage = async (message: string) => {
  if (!message.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: message,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputMessage('');
  setIsTyping(true);

  try {
    // Converte mensagens para o formato Ollama
    const ollamaMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    ollamaMessages.push({
      role: 'user',
      content: message,
    });

    // Adiciona contexto do sistema
    const systemMessage = {
      role: 'system' as const,
      content: `Você é um assistente de produtividade do MindEase, especializado em:
- Técnicas de foco e concentração
- Gerenciamento de tempo (Pomodoro, GTD)
- Redução de ansiedade e estresse
- Organização de tarefas
- Acessibilidade e neurodiversidade
Seja empático, prático e forneça respostas claras e acionáveis.`,
    };

    const response = await ollama.chat([systemMessage, ...ollamaMessages]);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Erro ao conectar com Ollama. Verifique se está rodando.');
    
    // Fallback para resposta padrão
    const fallbackResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Desculpe, estou tendo problemas para me conectar ao serviço de IA local. Verifique se o Ollama está rodando.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fallbackResponse]);
  } finally {
    setIsTyping(false);
  }
};
```

## 🎯 Prompts Especializados

### Contexto do Sistema

```typescript
const SYSTEM_PROMPTS = {
  productivity: `Você é um especialista em produtividade neuroadaptativa.
Foque em técnicas que funcionam para pessoas com TDAH, autismo e outras neurodivergências.
Seja prático e forneça passos específicos e acionáveis.`,

  accessibility: `Você é um especialista em acessibilidade e design inclusivo.
Ajude usuários a configurar e usar ferramentas de acessibilidade.
Explique conceitos de forma clara e sem jargões.`,

  wellness: `Você é um coach de bem-estar e saúde mental.
Forneça técnicas baseadas em evidências para gerenciar estresse e ansiedade.
Sempre sugira buscar ajuda profissional quando apropriado.`,
};
```

## 🔒 Privacidade e Segurança

### Vantagens da Ollama (IA Local)

1. **100% Privado**: Dados nunca saem do computador do usuário
2. **Sem custos de API**: Não requer chaves de API ou assinaturas
3. **Offline**: Funciona sem internet após o modelo ser baixado
4. **LGPD/GDPR Compliant**: Nenhum dado compartilhado com terceiros
5. **Customizável**: Pode usar modelos específicos para cada caso de uso

## 📊 Monitoramento e Fallback

```typescript
export class RobustOllamaService extends OllamaService {
  private isAvailable: boolean = false;

  async checkAvailability(): Promise<boolean> {
    try {
      const models = await this.listModels();
      this.isAvailable = models.length > 0;
      return this.isAvailable;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  async safeGenerate(prompt: string): Promise<string> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      // Fallback para respostas pré-programadas
      return this.getFallbackResponse(prompt);
    }

    try {
      return await this.generate(prompt);
    } catch {
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    // Respostas padrão quando Ollama não está disponível
    return 'Ollama não está disponível. Por favor, inicie o serviço.';
  }
}
```

## 🚀 Deploy em Produção

### Docker Compose

```yaml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped

volumes:
  ollama_data:
```

### Variáveis de Ambiente

```env
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2
VITE_OLLAMA_ENABLED=true
```

## 📚 Modelos Recomendados

| Modelo | Tamanho | Uso | RAM Necessária |
|--------|---------|-----|----------------|
| llama2 | 3.8GB | Geral | 8GB |
| mistral | 4.1GB | Geral (melhor) | 8GB |
| llama2:13b | 7.3GB | Mais preciso | 16GB |
| codellama | 3.8GB | Código | 8GB |
| neural-chat | 4.1GB | Conversação | 8GB |

## 🔧 Troubleshooting

### Ollama não inicia
```bash
# Verificar status
ollama list

# Reinstalar modelo
ollama pull llama2

# Verificar logs
journalctl -u ollama -f  # Linux
```

### CORS Issues
```bash
# Adicionar variável de ambiente
export OLLAMA_ORIGINS="http://localhost:5173"
ollama serve
```

### Performance
```bash
# Usar modelo menor
ollama pull llama2:7b

# Ou ajustar num_ctx para conversas mais curtas
```

## 📖 Recursos Adicionais

- [Documentação Ollama](https://github.com/ollama/ollama)
- [Lista de Modelos](https://ollama.ai/library)
- [API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)

---

**Nota**: Esta é uma implementação demonstrativa. Em produção, considere adicionar autenticação, rate limiting, e monitoramento apropriados.
