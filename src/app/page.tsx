"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import SystemConnect from "@/components/SystemConnect";
import AuthModal from "@/components/auth/AuthModal";
import SettingsModal from "@/components/SettingsModal";
import PremiumModule from "@/components/PremiumModule";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";
import { mockEquipmentData } from "@/lib/mockData";
import { AlertCircle, ShieldCheck, Zap, Cable, Settings, Crown, User as UserIcon } from "lucide-react";
import { clsx } from "clsx";

export default function Home() {
    const { user, updateProfile } = useUser();
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"advisor" | "connect">("advisor");

    // UI States
    const [showAuth, setShowAuth] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showPremium, setShowPremium] = useState(false);

    // Initial Gate
    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => setShowAuth(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleUpload = async (file: File) => {
        setIsAnalyzing(true);
        setErrorMsg(null);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/identify", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Fallo inesperado del servidor");
            }

            setAnalysisData(data);
        } catch (error: any) {
            console.error("Error al identificar:", error);
            setErrorMsg(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDemo = () => {
        setErrorMsg(null);
        setAnalysisData(mockEquipmentData);
    };

    return (
        <main className="min-h-screen bg-obsidian selection:bg-bronze selection:text-obsidian text-bronze/80">
            {/* Global Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-obsidian/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div
                        className="flex items-center space-x-4 cursor-pointer group"
                        onClick={() => {
                            setActiveTab("advisor");
                            setAnalysisData(null);
                        }}
                    >
                        <Logo className="w-12 h-12" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-serif font-black text-white tracking-tighter leading-none">Audiofilo</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-bronze/40 group-hover:text-bronze transition-colors">Archivist</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-12">
                        <div className="hidden md:flex items-center space-x-8">
                            {[
                                { id: "advisor", label: "Identificar", icon: Zap },
                                { id: "connect", label: "Asesoría", icon: Cable },
                            ].map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={clsx(
                                        "flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                        activeTab === item.id ? "text-bronze scale-110" : "text-white/20 hover:text-white"
                                    )}
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-6 pl-8 border-l border-white/5">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-bronze/30">Bienvenido de vuelta</p>
                                        <p className="text-sm font-serif font-bold text-white">{user.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-bronze/40 transition-all group"
                                    >
                                        <Settings className="w-4 h-4 text-white/40 group-hover:text-bronze group-hover:rotate-90 transition-all duration-500" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="px-6 py-2.5 bg-bronze/10 border border-bronze/20 text-bronze rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-bronze hover:text-obsidian transition-all"
                                >
                                    Inscribirse
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {!analysisData ? (
                <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
                    {activeTab === "advisor" && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                            {/* Left: Hero & Content */}
                            <div className="lg:col-span-7 space-y-12">
                                <header className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
                                    <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-bronze/10 border border-bronze/20 rounded-full text-bronze text-[10px] font-black uppercase tracking-[0.3em]">
                                        <Crown className="w-3 h-3 fill-bronze animate-pulse" />
                                        <span>Inteligencia Artificial de Élite</span>
                                    </div>
                                    <h1 className="text-9xl font-serif font-bold tracking-tighter leading-[0.85] text-white">
                                        Archivística <br />
                                        <span className="text-bronze italic">del Sonido.</span>
                                    </h1>
                                    <p className="text-xl text-bronze/50 font-display leading-relaxed max-w-xl">
                                        Identificación profunda de componentes High-End mediante visión artificial. Estilo, sobriedad y precisión técnica para el audiófilo moderno.
                                    </p>
                                </header>

                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-serif font-bold text-white">Digitaliza tus Circuitos</h2>
                                        <p className="text-bronze/40 text-sm max-w-lg leading-relaxed">
                                            Cargue una fotografía nítida del chasis o panel frontal. Nuestra IA Maestro Senior identificará firma sonora, topología y valor de mercado.
                                        </p>
                                    </div>
                                    <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
                                </div>
                            </div>

                            {/* Right: Premium & Social */}
                            <aside className="lg:col-span-5 space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
                                <PremiumModule onUpgrade={() => setShowPremium(true)} />

                                <div className="glass p-8 rounded-[32px] border border-white/5 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-bronze font-black uppercase text-[10px] tracking-[0.4em]">Acceso Directo</h3>
                                        <p className="text-white text-2xl font-serif font-bold">Laboratorio Técnico</p>
                                    </div>
                                    <p className="text-bronze/40 text-xs leading-relaxed">
                                        Explore el análisis de referencia del **Marantz Model 2270**. Diagramas, componentes críticos y recomendaciones de sinergia de autor.
                                    </p>
                                    <button
                                        onClick={handleDemo}
                                        className="w-full py-5 border border-bronze/20 text-bronze rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-bronze hover:text-obsidian transition-all group"
                                    >
                                        <span>Explorar Análisis de Referencia</span>
                                        <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}

                    {activeTab === "connect" && <SystemConnect />}

                    <footer className="mt-40 pt-12 border-t border-white/5 text-center space-y-4">
                        <Logo className="w-8 h-8 mx-auto grayscale opacity-20" />
                        <p className="text-[10px] font-mono text-bronze/20 uppercase tracking-[0.6em]">
                            Sistemas de Audio Avanzados // v2.0.0 Maestro Premium
                        </p>
                    </footer>
                </div>
            ) : (
                <div className="py-24 px-6 md:px-12 bg-obsidian/50 min-h-screen">
                    <Dashboard data={analysisData} onReset={() => {
                        setAnalysisData(null);
                        setErrorMsg(null);
                    }} />
                </div>
            )}

            {/* Modals */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onOpenPremium={() => setShowPremium(true)} />}

            {/* Simple Premium Upgrade Simulation */}
            {showPremium && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-3xl" onClick={() => setShowPremium(false)}></div>
                    <div className="relative bg-obsidian border border-bronze/30 p-12 rounded-[40px] max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-bronze rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-bronze/20">
                            <Crown className="w-10 h-10 text-obsidian" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif font-bold text-white">Suscripción Maestro</h2>
                            <p className="text-bronze/60 font-display">Confirmar suscripción mensual por <span className="text-white font-bold">$3 USD</span>.</p>
                        </div>
                        <button
                            onClick={() => {
                                updateProfile({ isPremium: true });
                                setShowPremium(false);
                            }}
                            className="w-full py-5 bg-bronze text-obsidian rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:scale-[1.02] transition-all"
                        >
                            Confirmar y Activar
                        </button>
                        <button onClick={() => setShowPremium(false)} className="text-[10px] font-black uppercase tracking-widest text-bronze/30 hover:text-bronze transition-colors">Cancelar</button>
                    </div>
                </div>
            )}
        </main>
    );
}
