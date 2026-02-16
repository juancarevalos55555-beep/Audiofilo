"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import SystemConnect from "@/components/SystemConnect";
import AuthModal from "@/components/auth/AuthModal";
import SettingsModal from "@/components/SettingsModal";
import PremiumModule from "@/components/PremiumModule";
import Archive from "@/components/Archive";
import Logo from "@/components/Logo";
import { useUser } from "@/context/UserContext";
import { mockEquipmentData } from "@/lib/mockData";
import { AlertCircle, ShieldCheck, Zap, Cable, Settings, Crown, User as UserIcon, MessageCircle, Archive as ArchiveIcon } from "lucide-react";
import { clsx } from "clsx";

export default function Home() {
    const { user, updateProfile } = useUser();
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"advisor" | "connect" | "archive">("advisor");

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


    return (
        <main className="min-h-screen bg-netflix-black text-white selection:bg-netflix-red">
            {/* Global Navigation - Netflix Style */}
            <nav className="fixed top-0 left-0 right-0 z-[100] netflix-gradient h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        {/* Logo / Home Link */}
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => {
                                setActiveTab("advisor");
                                setAnalysisData(null);
                            }}
                        >
                            <span className="text-3xl font-black text-netflix-red tracking-tighter leading-none uppercase">Fónica</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            {[
                                { id: "advisor", label: "Identificar", icon: Zap },
                                { id: "connect", label: "Asesoría", icon: MessageCircle },
                                { id: "archive", label: "Archivo", icon: ArchiveIcon },
                            ].map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setAnalysisData(null);
                                    }}
                                    className={clsx(
                                        "text-sm font-medium transition-all hover:text-netflix-muted",
                                        activeTab === item.id ? "text-white font-bold" : "text-white/80"
                                    )}
                                >
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="flex items-center space-x-2 text-sm text-white hover:text-netflix-muted transition-colors"
                                >
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-4 py-1.5 bg-netflix-red text-white text-sm font-bold rounded hover:bg-netflix-red/90 transition-all"
                            >
                                Inscribirse
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {!analysisData ? (
                <div className="relative">
                    {activeTab === "advisor" && (
                        <div className="flex flex-col">
                            {/* Hero Section - Netflix Style */}
                            <div className="relative h-[80vh] w-full overflow-hidden flex items-end">
                                {/* Background Image placeholder - Premium Hi-Fi */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/20 to-transparent z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1545453303-122997921159?q=80&w=2000&auto=format&fit=crop"
                                        alt="Hi-Fi Equipment"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>

                                <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full space-y-6">
                                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-tight">
                                        Fónica - Tu Guía <span className="text-netflix-red">Hi-Fi</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl text-netflix-text max-w-2xl font-medium">
                                        Experiencia audiófila definitiva. Identifica, optimiza y descubre la verdadera alma de tu sistema de sonido.
                                    </p>
                                    <div className="flex space-x-4 pt-4">
                                        <button
                                            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-8 py-3 bg-white text-black font-bold rounded flex items-center space-x-2 hover:bg-white/80 transition-all"
                                        >
                                            <Zap className="fill-black" />
                                            <span>Comenzar Análisis Gratis</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Areas in Carousels/Rows */}
                            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30 space-y-20 pb-20 w-full">
                                {/* Upload/Identificar Section */}
                                <section id="upload-section" className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white">Identificar Equipos</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-8">
                                            <div className="glass p-8 rounded-lg space-y-6">
                                                <p className="text-netflix-muted">
                                                    Sube una foto de tu equipo para obtener un análisis técnico detallado,
                                                    incluyendo su firma sonora y valor de mercado.
                                                </p>
                                                <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
                                            </div>
                                        </div>
                                        <div className="lg:col-span-4">
                                            <PremiumModule onUpgrade={() => setShowPremium(true)} />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === "connect" && <SystemConnect />}
                    {activeTab === "archive" && <Archive />}

                    <footer className="mt-40 pb-20 border-t border-netflix-border/50 text-center space-y-6 pt-12">
                        <div className="flex justify-center space-x-8 text-netflix-muted text-sm font-medium">
                            <a href="#" className="hover:text-white transition-colors">Audiofilo Pro</a>
                            <a href="#" className="hover:text-white transition-colors">Soporte Técnico</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                        </div>
                        <p className="text-xs font-medium text-netflix-muted uppercase tracking-[0.4em] opacity-40">
                            Fónica Systems // © 2026 EXPERIENCIA AUDIÓFILA PREMIUM
                        </p>
                    </footer>
                </div>
            ) : (
                <div className="pt-24 px-6 md:px-12 bg-netflix-black min-h-screen">
                    <Dashboard data={analysisData} onReset={() => {
                        setAnalysisData(null);
                        setErrorMsg(null);
                    }} />
                </div>
            )}

            {/* Modals - Netflix style */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onOpenPremium={() => setShowPremium(true)} />}

            {/* Premium Upgrade Modal */}
            {showPremium && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowPremium(false)}></div>
                    <div className="relative bg-netflix-dark border border-netflix-border p-12 rounded-lg max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-netflix-red rounded-lg flex items-center justify-center mx-auto shadow-2xl">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">Suscripción Maestro</h2>
                            <p className="text-netflix-muted text-lg">Confirmar suscripción mensual para acceso ilimitado a la IA por <span className="text-white font-bold">$3 USD</span>.</p>
                            <div className="space-y-2 text-left pt-4">
                                <div className="flex items-center space-x-2 text-sm text-white">
                                    <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
                                    <span>Consultas ilimitadas con Gemini 2.0 Flash</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-white">
                                    <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
                                    <span>Análisis profundo de topologías</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-white">
                                    <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
                                    <span>Tips VIP de sinergia y cables</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                updateProfile({ isPremium: true });
                                setShowPremium(false);
                            }}
                            className="w-full py-4 bg-netflix-red text-white rounded font-bold uppercase text-sm tracking-widest hover:bg-netflix-red/90 transition-all"
                        >
                            Confirmar y Activar
                        </button>
                        <button onClick={() => setShowPremium(false)} className="text-xs font-bold uppercase tracking-widest text-netflix-muted hover:text-white transition-colors">Cancelar</button>
                    </div>
                </div>
            )}
        </main>
    );
}
