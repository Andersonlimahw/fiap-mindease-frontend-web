import { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useNavigationStore } from '@/stores';
import { BookOpen, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sampleContent = {
  summary: {
    title: 'Neuroplasticidade e Aprendizado',
    points: [
      'O cérebro pode reorganizar suas conexões ao longo da vida',
      'Repetição e prática fortalecem conexões neurais',
      'Ambiente e experiências moldam a estrutura cerebral',
      'Sono é essencial para consolidação de memórias',
    ],
    readTime: '2 min',
  },
  detailed: {
    title: 'Neuroplasticidade e Aprendizado: Uma Visão Completa',
    content: `A neuroplasticidade é a capacidade extraordinária do cérebro de se reorganizar, formando novas conexões neurais ao longo da vida. Este conceito revolucionou nossa compreensão sobre como aprendemos e nos adaptamos.

## Como Funciona a Neuroplasticidade

O cérebro humano contém aproximadamente 86 bilhões de neurônios, cada um capaz de formar milhares de conexões com outros neurônios. Essas conexões, chamadas sinapses, são constantemente remodeladas com base em nossas experiências, pensamentos e comportamentos.

### Mecanismos Principais

**Potenciação de Longa Duração (LTP)**: Quando dois neurônios são ativados repetidamente juntos, a conexão entre eles se fortalece. Este é o princípio fundamental por trás do aprendizado e da formação de memórias.

**Poda Sináptica**: Conexões que não são usadas regularmente são eliminadas, tornando o cérebro mais eficiente. Este processo é especialmente ativo durante a adolescência e continua ao longo da vida.

## Aplicações Práticas

### Aprendizado e Educação
A compreensão da neuroplasticidade transformou métodos de ensino. Técnicas como:
- Repetição espaçada
- Prática intercalada
- Ensino multimodal

Estas abordagens aproveitam a capacidade do cérebro de formar e fortalecer conexões neurais através da prática deliberada.

### Recuperação de Lesões
Após um AVC ou lesão cerebral, a neuroplasticidade permite que áreas saudáveis do cérebro assumam funções de áreas danificadas. Programas de reabilitação intensivos podem promover reorganização significativa das redes neurais.

## O Papel do Sono

O sono não é apenas um período de descanso; é um momento crítico para a consolidação de memórias. Durante o sono profundo:
- Memórias de curto prazo são transferidas para armazenamento de longo prazo
- Conexões neurais importantes são fortalecidas
- Conexões desnecessárias são eliminadas

## Fatores que Influenciam a Neuroplasticidade

**Exercício Físico**: Aumenta a produção de BDNF (Fator Neurotrófico Derivado do Cérebro), uma proteína essencial para o crescimento e sobrevivência neuronal.

**Nutrição**: Ácidos graxos ômega-3, antioxidantes e vitaminas do complexo B são especialmente importantes para a saúde cerebral.

**Estresse**: Níveis crônicos de cortisol podem prejudicar a neuroplasticidade, enquanto desafios moderados podem promovê-la.

**Estímulo Mental**: Aprender novas habilidades, resolver quebra-cabeças e engajar-se em atividades criativas estimulam a formação de novas conexões.

## Conclusão

A neuroplasticidade demonstra que nossos cérebros são muito mais adaptáveis do que se pensava anteriormente. Compreender e aproveitar essa capacidade pode nos ajudar a aprender de forma mais eficaz, recuperar de lesões e manter a saúde cognitiva ao longo da vida.`,
    readTime: '8 min',
  },
};

export function ContentReader() {
  const { currentScreen, navigate } = useNavigationStore();
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (!isAudioEnabled) {
      // Simulated text-to-speech activation
      const utterance = new SpeechSynthesisUtterance('Leitura em áudio ativada');
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Navigation currentScreen={currentScreen} onNavigate={navigate} />}
      
      <main className="container mx-auto p-4 md:p-6 space-y-6" role="main">
        {!isFullscreen && (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-green-500" aria-hidden="true" />
              Leitor de Conteúdo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize conteúdo em formato resumido ou detalhado
            </p>
          </div>
        )}

        <Card className={isFullscreen ? 'min-h-screen' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as 'summary' | 'detailed')}>
                  <TabsList>
                    <TabsTrigger value="summary">
                      Resumido ({sampleContent.summary.readTime})
                    </TabsTrigger>
                    <TabsTrigger value="detailed">
                      Detalhado ({sampleContent.detailed.readTime})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAudio}
                  aria-label={isAudioEnabled ? 'Desativar áudio' : 'Ativar áudio'}
                  aria-pressed={isAudioEnabled}
                >
                  {isAudioEnabled ? (
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  aria-label={isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {viewMode === 'summary' ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{sampleContent.summary.title}</h2>
                    <div className="space-y-3">
                      {sampleContent.summary.points.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="flex-1 text-gray-700 dark:text-gray-300">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setViewMode('detailed')}
                      variant="outline"
                      className="w-full"
                    >
                      Ler Versão Completa
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.article
                  key="detailed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="prose dark:prose-invert max-w-none"
                  aria-label="Conteúdo detalhado"
                >
                  <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: sampleContent.detailed.content
                        .split('\n\n')
                        .map((paragraph) => {
                          if (paragraph.startsWith('## ')) {
                            return `<h2 class="text-2xl font-bold mt-6 mb-3">${paragraph.replace('## ', '')}</h2>`;
                          } else if (paragraph.startsWith('### ')) {
                            return `<h3 class="text-xl font-semibold mt-4 mb-2">${paragraph.replace('### ', '')}</h3>`;
                          } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return `<p class="font-semibold text-lg">${paragraph.replace(/\*\*/g, '')}</p>`;
                          } else if (paragraph.startsWith('- ')) {
                            const items = paragraph
                              .split('\n')
                              .map((item) => `<li>${item.replace('- ', '')}</li>`)
                              .join('');
                            return `<ul class="list-disc list-inside space-y-1 ml-4">${items}</ul>`;
                          }
                          return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed">${paragraph}</p>`;
                        })
                        .join(''),
                    }}
                  />

                  <div className="pt-6 border-t mt-6">
                    <Button
                      onClick={() => setViewMode('summary')}
                      variant="outline"
                      className="w-full"
                    >
                      Ver Resumo
                    </Button>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {!isFullscreen && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base">💡 Recursos de Acessibilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Use <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border rounded">Tab</kbd> para navegar entre seções</p>
              <p>• Pressione <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border rounded">Espaço</kbd> para alternar modo resumido/detalhado</p>
              <p>• Ative o áudio para ouvir o conteúdo</p>
              <p>• Use modo tela cheia para leitura imersiva</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}