import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useNavigationStore, useChatStore } from '@/stores';
import { MessageSquare, Send, Bot, User, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const QUICK_PROMPTS = [
  'Como posso melhorar meu foco?',
  'Explique a técnica Pomodoro',
  'Dicas para reduzir ansiedade',
  'Como organizar minhas tarefas?',
  'Técnicas de respiração para relaxar',
];

export function AIChat() {
  const { currentScreen, navigate } = useNavigationStore();

  // Use global chat store instead of local state
  const {
    messages,
    isLoading,
    error,
    sendMessageStream,
    clearHistory
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setInputMessage('');
    await sendMessageStream(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    clearHistory();
    toast.success('Conversa limpa');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
            Assistente inteligente para dicas de produtividade e bem-estar
          </p>
        </div>

        {error && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-900/10">
            <CardContent className="flex items-center p-4 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

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
                        <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} aria-hidden="true" />
                        {isLoading ? 'Digitando...' : 'Online'}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearChat}
                    aria-label="Limpar conversa"
                    disabled={isLoading}
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
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.role === 'user'
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
                          className={`flex-1 max-w-[80%] space-y-1 ${message.role === 'user' ? 'items-end' : 'items-start'
                            }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              }`}
                          >
                            <div
                              className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                // Basic markdown-like parsing for bold text
                                __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }}
                            />
                            {isLoading && message.role === 'assistant' && message.content === '' && (
                              <div className="flex gap-1 py-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <CardContent className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                    aria-label="Mensagem"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
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
                  Inicie uma conversa rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isLoading}
                  >
                    <span className="text-sm">{prompt}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  Powered by MindEase AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  As respostas são geradas em tempo real pelo modelo local ou via API, oferecendo conselhos dinâmicos e precisos sobre neuroarquitetura e foco.
                </p>
                <Badge variant="secondary" className="mt-2">
                  Integração Ativa
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
                  <span>Respostas Streamadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />
                  <span>Contexto de Conversa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" aria-hidden="true" />
                  <span>Histórico Persistido</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}