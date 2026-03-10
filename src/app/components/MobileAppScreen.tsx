import { Navigation } from '@/app/components/Navigation';
import { useNavigationStore } from '@/stores';
import { Button } from '@/app/components/ui/button';
import { Download, Smartphone as SmartphoneIcon, Sparkles, CheckCircle2 } from 'lucide-react';

const PixelMockup = ({ src, alt, delay = 0 }: { src: string, alt: string, delay?: number }) => (
    <div
        className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[10px] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(99,102,241,0.2)] w-full aspect-[9/19.5]"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Screen glare / reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 z-20 pointer-events-none transition-opacity duration-500 hover:opacity-50"></div>

        {/* Camera punch hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.2)]"></div>

        {/* Speaker slit */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-black rounded-full z-20 opacity-50"></div>

        {/* Buttons on the side */}
        <div className="absolute -right-[14px] top-24 w-1 h-12 bg-gray-800 rounded-r-md z-0" />
        <div className="absolute -right-[14px] top-40 w-1 h-24 bg-gray-800 rounded-r-md z-0" />

        <div className="relative z-10 h-full w-full rounded-[2.3rem] overflow-hidden bg-white dark:bg-gray-950">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x600?text=${encodeURIComponent(alt)}`
                }}
            />
        </div>
    </div>
);

export function MobileAppScreen() {
    const { currentScreen, navigate } = useNavigationStore();

    const features = [
        'Sincronização em tempo real entre web e mobile',
        'Timer Pomodoro com notificações push',
        'Modo Foco com sons ambientes off-line',
        'Acesso rápido a tarefas pendentes',
        'Acompanhamento de progresso diário'
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] relative overflow-hidden">
            {/* Background Decorators for contrast and "pro-max" feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <Navigation currentScreen={currentScreen} onNavigate={navigate} />

                <main className="container mx-auto p-4 md:p-16 space-y-16" role="main">
                    {/* Header Section */}
                    <section className="text-center space-y-6 max-w-3xl mx-auto pt-12">
                        <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl mb-4 transform hover:scale-105 transition-transform">
                            <SmartphoneIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Sua mente em paz,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                                no seu celular.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Leve seu foco e produtividade para onde for. Baixe o aplicativo para Android e tenha controle total das suas tarefas e sessões de estudo na palma da sua mão.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
                            <Button size="lg" className="gap-2 rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all" asChild>
                                <a href="https://drive.google.com/file/d/1H-Kv0t6ORMKAiWECfu0GpPdBrGYRKwhK/view?usp=drive_link" download target='_blank'>
                                    <Download className="w-5 h-5" />
                                    Baixar APK para Android
                                </a>
                            </Button>
                        </div>
                        <p className="text-sm font-medium text-slate-400 dark:text-gray-500 pt-2">Versão requerida: Android 8.0+</p>
                    </section>

                    {/* Features Content */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mx-auto max-w-6xl py-16">
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 font-medium text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>Experiência Premium</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
                                Mantenha o foco em qualquer lugar
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                O aplicativo mobile do MindEase foi desenhado para ser uma extensão perfeita da sua experiência web, focando no que mais importa: manter você sem distrações quando estiver longe do computador.
                            </p>
                            <ul className="space-y-4 pt-6">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="mt-1 bg-green-100 dark:bg-green-900/40 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-slate-700 dark:text-gray-300 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-8 order-1 lg:order-2 px-8 md:px-12 lg:px-0 relative">
                            {/* Decorative blur behind phones */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-3xl rounded-full z-0 pointer-events-none" />

                            <div className="space-y-8 lg:space-y-12 relative z-10 pt-8 lg:pt-0">
                                <PixelMockup
                                    src="/images/mobile-mockups/media__1773123987863.png"
                                    alt="Tela inicial mobile"
                                />
                                <PixelMockup
                                    src="/images/mobile-mockups/media__1773124003493.png"
                                    alt="Timer Pomodoro mobile"
                                    delay={100}
                                />
                            </div>
                            <div className="space-y-8 lg:space-y-12 mt-16 md:mt-24 relative z-10">
                                <PixelMockup
                                    src="/images/mobile-mockups/media__1773123996256.png"
                                    alt="Assistente de IA chat no mobile"
                                    delay={200}
                                />
                                <PixelMockup
                                    src="/images/mobile-mockups/media__1773124010283.png"
                                    alt="Modo Foco mobile com sons ambientes"
                                    delay={300}
                                />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
