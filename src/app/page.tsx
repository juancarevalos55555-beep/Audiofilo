"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import { mockEquipmentData } from "@/lib/mockData";
import { AlertCircle, ShieldCheck, Zap, Info } from "lucide-react";

export default function Home() {
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        <main className="min-h-screen selection:bg-analog-gold selection:text-gunmetal-grey">
            {!analysisData ? (
                <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center space-y-16">

                    {/* Hero Section */}
                    <header className="text-center space-y-8 max-w-3xl animate-in fade-in slide-in-from-top-10 duration-1000">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-analog-gold/10 border border-analog-gold/20 rounded-full text-analog-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Zap className="w-3 h-3 fill-analog-gold" />
                            <span>Inteligencia Artificial Audiófila</span>
                        </div>
                        <h1 className="text-8xl font-display font-black tracking-tighter leading-none bg-gradient-to-b from-white via-analog-gold to-analog-gold/40 bg-clip-text text-transparent">
                            AudioArchivist
                        </h1>
                        <p className="text-xl text-analog-gold/60 font-medium leading-relaxed">
                            La primera plataforma de peritaje digital dedicada a la preservación y diagnóstico de componentes de alta fidelidad legendarios.
                        </p>
                    </header>

                    {/* Core Interaction Area */}
                    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-300">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-display font-bold text-white">Iniciar Peritaje</h2>
                                <p className="text-analog-gold/40 text-sm leading-relaxed">
                                    Cargue una fotografía nítida del frontal o del chasis abierto para una identificación profunda de circuitos, arquitectura y valor de mercado.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />

                                {errorMsg && (
                                    <div className="glass-gold p-6 rounded-3xl border-analog-gold/20 animate-in zoom-in duration-500">
                                        <div className="flex items-center space-x-3 text-analog-gold mb-4">
                                            <AlertCircle className="w-6 h-6 shrink-0" />
                                            <h4 className="font-bold uppercase text-xs tracking-[0.2em]">Configuración Requerida</h4>
                                        </div>

                                        <p className="text-sm text-white/90 mb-4 leading-relaxed">
                                            Para reconocer equipos reales, necesitamos conectar con el motor de IA. Sigue estos pasos:
                                        </p>

                                        <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-analog-gold/5 text-xs font-mono">
                                            <p className="text-analog-gold/80 italic">1. Crea un archivo llamado <span className="text-white">.env.local</span></p>
                                            <p className="text-analog-gold/80 italic">2. Agrega esta línea exacta:</p>
                                            <div className="bg-white/5 p-2 rounded border border-white/10 text-analog-gold">
                                                GEMINI_API_KEY=tu_llave_aqui
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-analog-gold/10">
                                            <p className="text-[10px] text-analog-gold/40">
                                                Error detectado: {errorMsg}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
                            <div className="glass-gold rounded-3xl p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-analog-gold font-bold uppercase text-[10px] tracking-[0.3em]">Acceso de Cortesía</h3>
                                    <p className="text-white text-lg font-display">Pruebe las capacidades sin una API Key</p>
                                </div>

                                <p className="text-analog-gold/50 text-xs leading-relaxed">
                                    Explore la profundidad del análisis técnico usando nuestro perfil histórico del **Marantz Model 2270**. Visualice diagramas, especificaciones y tendencias de inversión.
                                </p>

                                <button
                                    onClick={handleDemo}
                                    className="btn-premium w-full flex items-center justify-center space-x-3"
                                >
                                    <span>Explorar Demo Legacy</span>
                                    <ShieldCheck className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 glass rounded-2xl space-y-2">
                                    <div className="w-8 h-8 rounded-lg bg-analog-gold/10 flex items-center justify-center text-analog-gold">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-analog-gold/60 italic">Identificación 1.5s</p>
                                </div>
                                <div className="p-4 glass rounded-2xl space-y-2">
                                    <div className="w-8 h-8 rounded-lg bg-analog-gold/10 flex items-center justify-center text-analog-gold">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-analog-gold/60 italic">Peritaje Experto</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <footer className="pt-10 border-t border-analog-gold/5 w-full text-center">
                        <p className="text-[10px] font-mono text-analog-gold/20 uppercase tracking-[0.5em]">
                            Sistemas Digitales de Audio Avanzados // v0.2.0 Recovery
                        </p>
                    </footer>
                </div>
            ) : (
                <div className="py-12 px-6">
                    <Dashboard data={analysisData} onReset={() => {
                        setAnalysisData(null);
                        setErrorMsg(null);
                    }} />
                </div>
            )}
        </main>
    );
}
