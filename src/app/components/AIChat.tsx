import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useNavigationStore, useChatStore } from '@/stores';
import { MessageSquare, Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'Como posso melhorar meu foco?',
  'Explique a técnica Pomodoro',
  'Dicas para reduzir ansiedade',
  'Como organizar minhas tarefas?',
  'Técnicas de respiração para relaxar',
];

const AI_RESPONSES: { [key: string]: string } = {
  default: 'Olá! Sou seu assistente de produtividade MindEase. Como posso ajudá-lo hoje?',
  foco: 'Para melhorar seu foco, recomendo:\n\n1. **Elimine distrações**: Desligue notificações e use o Modo Foco\n2. **Técnica Pomodoro**: Trabalhe em blocos de 25 minutos\n3. **Ambiente adequado**: Mantenha seu espaço organizado\n4. **Pausas regulares**: Faça intervalos curtos a cada hora\n5. **Hidratação**: Beba água regularmente',
  pomodoro: 'A Técnica Pomodoro é um método de gerenciamento de tempo:\n\n🍅 **Como funciona:**\n- Trabalhe focado por 25 minutos\n- Faça uma pausa de 5 minutos\n- Após 4 "pomodoros", faça uma pausa de 15-30 minutos\n\n✨ **Benefícios:**\n- Melhora o foco e concentração\n- Reduz fadiga mental\n- Aumenta a produtividade\n- Torna tarefas grandes mais gerenciáveis',
  ansiedade: 'Aqui estão algumas técnicas para reduzir ansiedade:\n\n🧘 **Respiração 4-7-8:**\n- Inspire por 4 segundos\n- Segure por 7 segundos\n- Expire por 8 segundos\n\n💭 **Mindfulness:**\n- Foque no momento presente\n- Observe seus pensamentos sem julgamento\n\n🚶 **Exercício físico:**\n- Caminhadas leves\n- Alongamento\n- Yoga',
  tarefas: 'Para organizar suas tarefas efetivamente:\n\n📝 **Método GTD (Getting Things Done):**\n1. Capture tudo em um só lugar\n2. Esclareça o que cada item significa\n3. Organize por categoria/prioridade\n4. Revise regularmente\n5. Execute as ações\n\n🎯 **Use micro-etapas:**\n- Divida tarefas grandes em partes menores\n- Cada etapa deve levar 5-15 minutos\n- Marque como concluído para motivação\n\nUse nossa seção de Tarefas para implementar isso!',
  respiração: 'Técnicas de respiração para relaxamento:\n\n🌬️ **Respiração Diafragmática:**\n- Coloque uma mão no peito, outra no abdômen\n- Respire profundamente pelo nariz\n- Sinta o abdômen expandir\n- Expire lentamente pela boca\n\n⚡ **Respiração Quadrada:**\n- Inspire: 4 segundos\n- Segure: 4 segundos\n- Expire: 4 segundos\n- Segure: 4 segundos\n\n💙 **Benefícios:**\n- Reduz estresse e ansiedade\n- Melhora o foco\n- Regula o sistema nervoso',
};

export function AIChat() {
  const { currentScreen, navigate } = useNavigationStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: AI_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('foco') || lowerMessage.includes('concentra')) {
      return AI_RESPONSES.foco;
    } else if (lowerMessage.includes('pomodoro')) {
      return AI_RESPONSES.pomodoro;
    } else if (lowerMessage.includes('ansiedade') || lowerMessage.includes('estress')) {
      return AI_RESPONSES.ansiedade;
    } else if (lowerMessage.includes('tarefa') || lowerMessage.includes('organiza')) {
      return AI_RESPONSES.tarefas;
    } else if (lowerMessage.includes('respira') || lowerMessage.includes('relaxa')) {
      return AI_RESPONSES.respiração;
    }
    
    return `Entendo que você está perguntando sobre "${userMessage}". Como assistente demo, tenho respostas prontas para tópicos como:\n\n- Melhorar foco\n- Técnica Pomodoro\n- Reduzir ansiedade\n- Organizar tarefas\n- Técnicas de respiração\n\nTente perguntar sobre um desses tópicos!`;
  };

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

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: AI_RESPONSES.default,
        timestamp: new Date(),
      },
    ]);
    toast.success('Conversa limpa');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation currentScreen={currentScreen} onNavigate={navigate} />
      
      <main className="container mx-auto p-16 md:p-16 space-y-6" role="main">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-indigo-500" aria-hidden="true" />
            Chat de Suporte IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assistente inteligente para produtividade e bem-estar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">MindEase AI</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                        Online
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    aria-label="Limpar conversa"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4" role="log" aria-live="polite" aria-atomic="false">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            message.role === 'user'
                              ? 'bg-blue-500'
                              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          }`}
                          aria-hidden="true"
                        >
                          {message.role === 'user' ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[80%] space-y-1 ${
                            message.role === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <CardContent className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isTyping}
                    aria-label="Mensagem"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    aria-label="Enviar mensagem"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                  Perguntas Rápidas
                </CardTitle>
                <CardDescription>
                  Clique para começar uma conversa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isTyping}
                  >
                    <span className="text-sm">{prompt}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-base">💡 Sobre o Chat IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Demo Mode:</strong> Este é um chat com respostas pré-programadas.
                </p>
                <p>
                  Em produção, este chat se conectaria à Ollama API para respostas
                  personalizadas baseadas em IA local.
                </p>
                <Badge variant="secondary" className="mt-2">
                  Privacidade Garantida
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                  <span>Respostas em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
                  <span>Histórico de conversas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" aria-hidden="true" />
                  <span>100% acessível</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}