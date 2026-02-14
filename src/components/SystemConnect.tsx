"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Cable, Radio, Speaker, CheckCircle2, RotateCcw, FileText, Loader2, Sparkles, Send, User as UserIcon, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useUser } from "@/context/UserContext";
import Logo from "./Logo";

export default function SystemConnect() {
    const { user } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([
        { role: "assistant", content: user ? `Hola ${user.name}, es un placer saludarte. Soy tu asesor de Fónica. ¿Cómo puedo ayudarte a perfeccionar tu experiencia sonora hoy?` : "Hola, soy tu experto de Fónica. ¿En qué puedo asesorarte con tus equipos de audio hoy?" }
    ]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [selections, setSelections] = useState({
        amplifier: "",
        turntable: "",
        speakers: "",
        cables: "",
        other: ""
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelections(prev => ({ ...prev, [name]: value }));
    };

    const sendMessage = async () => {
        if (!currentMessage.trim() || isChatLoading) return;

        const userMsg = { role: "user", content: currentMessage };
        setChatMessages(prev => [...prev, userMsg]);
        setCurrentMessage("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...chatMessages, userMsg],
                    userName: user?.name || "Audiófilo"
                }),
            });
            const data = await response.json();
            setChatMessages(prev => [...prev, data]);
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsChatLoading(false);
        }
    };

    const generateAdvisory = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selections,
                    userName: user?.name || "Audiófilo"
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setReport(data);
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo generar la asesoría. Verifica tu conexión o API Key.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            backgroundColor: "#0A0A0A",
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Asesoria_Fonica_${user?.name || "Premium"}.pdf`);
    };

    const resetAdvisor = () => {
        setReport(null);
        setSelections({
            amplifier: "",
            turntable: "",
            speakers: "",
            cables: "",
            other: ""
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
            <header className="text-center space-y-6">
                <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-bronze/10 border border-bronze/20 rounded-full text-bronze text-[10px] font-black uppercase tracking-[0.3em]">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Maestro de Sinergia IA</span>
                </div>
                <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">Asesoría <span className="text-bronze italic">Maestra.</span></h2>
                <p className="text-bronze/50 max-w-2xl mx-auto font-display text-lg">
                    {user ? `${user.name}, confía en la sabiduría de un experto audiófilo.` : "Confía en la sabiduría de un experto audiófilo."} Describe tus componentes y diseñaremos la configuración perfecta.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form or Report */}
                <div className="lg:col-span-8 space-y-8">
                    {!report ? (
                        <div className="glass-gold p-8 md:p-12 rounded-3xl border border-analog-gold/20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Amplificador tienes?</label>
                                    <input
                                        name="amplifier"
                                        value={selections.amplifier}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Marantz 2270, Sansui AU-D11..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Tornamesa usas?</label>
                                    <input
                                        name="turntable"
                                        value={selections.turntable}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Technics SL-1200, Rega Planar 3..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Parlantes tienes?</label>
                                    <input
                                        name="speakers"
                                        value={selections.speakers}
                                        onChange={handleInputChange}
                                        placeholder="Ej. JBL L100, Klipsch Heresy..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué cables estás usando?</label>
                                    <input
                                        name="cables"
                                        value={selections.cables}
                                        onChange={handleInputChange}
                                        placeholder="Ej. RCA genéricos, Kimber Kable, Cobre OFC..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">Otros componentes o dudas específicas</label>
                                <textarea
                                    name="other"
                                    value={selections.other}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Tengo un DAC externo, la sala es pequeña, busco sonido cálido..."
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display resize-none"
                                />
                            </div>

                            <button
                                onClick={generateAdvisory}
                                disabled={isGenerating || !selections.amplifier}
                                className="w-full py-5 bg-bronze text-obsidian rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:shadow-2xl hover:shadow-bronze/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Consultando al Experto...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Obtener Asesoría Maestra</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in zoom-in-95 duration-700">
                            <div
                                ref={reportRef}
                                className="p-10 md:p-16 rounded-[40px] border border-bronze/20 space-y-16 bg-obsidian relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <Logo className="w-32 h-32 rotate-12" />
                                </div>
                                <div className="text-center space-y-6 relative z-10">
                                    <Logo className="w-20 h-20 mx-auto mb-8" />
                                    <h3 className="text-5xl font-serif font-bold text-white tracking-tighter">{report.title}</h3>
                                    <div className="h-px w-20 bg-bronze mx-auto opacity-30 my-8"></div>
                                    <p className="text-bronze/80 italic font-serif text-xl max-w-2xl mx-auto">{report.intro}</p>
                                </div>

                                {/* Graphical Connection Guide */}
                                <div className="space-y-4 pt-8 border-t border-analog-gold/10">
                                    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                        <MessageCircle className="w-3 h-3" />
                                        <span>Esquema Gráfico de Conexión</span>
                                    </div>
                                    <div className="bg-black/40 p-10 rounded-3xl border border-analog-gold/10 flex items-center justify-center min-h-[350px] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-analog-gold/5 to-transparent opacity-50"></div>
                                        <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-4">
                                            {/* Dynamic Visual Guide */}
                                            <div className="flex flex-col md:flex-row justify-between w-full items-center gap-8 md:gap-0">
                                                {report.connectionScheme.visual?.nodes.map((node: any, idx: number) => (
                                                    <div key={node.id} className="flex flex-col md:flex-row items-center w-full">
                                                        <div className="flex flex-col items-center space-y-3 z-10">
                                                            <div className={clsx(
                                                                "w-24 h-24 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                                                node.type === 'amplifier'
                                                                    ? "bg-analog-gold/10 border-analog-gold/40 shadow-xl shadow-analog-gold/5 scale-110"
                                                                    : "bg-white/5 border-white/10"
                                                            )}>
                                                                {node.type === 'source' && <Radio className="w-8 h-8 text-analog-gold/60" />}
                                                                {node.type === 'amplifier' && <Zap className="w-10 h-10 text-analog-gold" />}
                                                                {node.type === 'speakers' && <Speaker className="w-8 h-8 text-analog-gold/60" />}
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="block text-[8px] text-analog-gold font-black uppercase tracking-widest mb-1">{node.id}</span>
                                                                <span className="block text-[10px] text-white/60 font-display max-w-[120px] leading-tight">{node.label}</span>
                                                            </div>
                                                        </div>

                                                        {idx < report.connectionScheme.visual.nodes.length - 1 && (
                                                            <div className="flex-1 h-px md:h-px w-px md:w-full bg-gradient-to-b md:bg-gradient-to-r from-analog-gold/40 to-analog-gold/40 mx-0 md:mx-4 relative min-h-[40px] md:min-h-0">
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-3 py-1 rounded-full border border-analog-gold/50 text-[7px] text-analog-gold font-black uppercase tracking-tighter whitespace-nowrap z-20">
                                                                    {report.connectionScheme.visual.connections[idx].cable}
                                                                </div>
                                                                {/* Animated particles along lines */}
                                                                <div className="absolute inset-0 overflow-hidden">
                                                                    <div className="absolute top-0 left-0 w-2 h-full bg-analog-gold/20 blur-sm animate-pulse"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-analog-gold/40 text-center italic mt-12 bg-analog-gold/5 px-4 py-2 rounded-full border border-analog-gold/10">
                                                * Esquema técnico generado por el Asesor Experto basado en tu configuración específica.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-analog-gold/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                            <Radio className="w-3 h-3" />
                                            <span>Fuente {'>'} Ampli</span>
                                        </div>
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                            {report.connectionScheme.sourceToAmp}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                            <Zap className="w-3 h-3" />
                                            <span>Ampli {'>'} Parlantes</span>
                                        </div>
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                            {report.connectionScheme.ampToSpeakers}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                            <Cable className="w-3 h-3" />
                                            <span>Masa / Tierra</span>
                                        </div>
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                            {report.connectionScheme.grounding}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xl font-display font-bold text-white flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5 text-analog-gold" />
                                        <span>Análisis de Sinergia y Tips</span>
                                    </h4>
                                    <div className="bg-black/20 p-8 rounded-3xl border border-analog-gold/10">
                                        <p className="text-sm text-analog-gold/90 leading-relaxed mb-6">
                                            {report.synergyDetails}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {report.expertTips.map((tip: string, i: number) => (
                                                <div key={i} className="flex items-start space-x-3 text-xs text-white/60">
                                                    <CheckCircle2 className="w-4 h-4 text-analog-gold shrink-0 mt-0.5" />
                                                    <span>{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-analog-gold/5 text-center">
                                    <p className="text-[9px] font-mono text-analog-gold/20 uppercase tracking-[0.5em]">
                                        Reporte Generado por Audiofilo Asesor IA // v1.2.0
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                                <button
                                    onClick={downloadPDF}
                                    className="btn-premium px-12 flex items-center space-x-3"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>Descargar Ficha PDF</span>
                                </button>
                                <button
                                    onClick={resetAdvisor}
                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-analog-gold/40 hover:text-analog-gold transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Nueva Asesoría</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 sticky top-12">
                    <div className="bg-obsidian rounded-3xl border border-bronze/20 flex flex-col h-[600px] overflow-hidden">
                        <div className="p-4 border-b border-bronze/10 bg-bronze/5 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-bronze flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-obsidian" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">Chat con Experto</h4>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] text-bronze/60 uppercase font-bold tracking-widest">En Línea</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={clsx(
                                    "flex flex-col space-y-2 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className={clsx(
                                        "px-4 py-3 rounded-2xl text-xs leading-relaxed font-display",
                                        msg.role === "user"
                                            ? "bg-bronze/20 text-white border border-bronze/30 rounded-tr-none"
                                            : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex items-start mr-auto space-x-2">
                                    <Loader2 className="w-4 h-4 text-bronze animate-spin" />
                                    <span className="text-[10px] text-bronze/40 font-black uppercase tracking-widest mt-0.5">Pensando...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-black/40 border-t border-bronze/10">
                            <div className="relative">
                                <input
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Pregunta lo que quieras..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-bronze/40 transition-all font-display"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!currentMessage.trim() || isChatLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-bronze flex items-center justify-center text-obsidian hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[8px] text-white/20 text-center mt-3 uppercase font-bold tracking-widest">
                                Haz preguntas técnicas sobre equipos Hi-Fi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
