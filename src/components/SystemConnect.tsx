"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Cable, Radio, Speaker, CheckCircle2, RotateCcw, FileText, Loader2, Sparkles, Send, User as UserIcon, MessageCircle, ShieldCheck } from "lucide-react";
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
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [msgCount, setMsgCount] = useState(0);

    const [selections, setSelections] = useState({
        amplifier: "",
        turntable: "",
        speakers: "",
        cables: "",
        other: ""
    });

    // Persistence and Initialize
    useEffect(() => {
        const savedChat = localStorage.getItem("fonica_chat_history");
        if (savedChat) {
            setChatMessages(JSON.parse(savedChat));
        } else {
            setChatMessages([
                { role: "assistant", content: user ? `Hola ${user.name}. Soy tu experto en Hi-Fi. He analizado tu configuración actual. ¿Qué aspecto técnico de tu sistema deseas optimizar hoy?` : "Hola, soy experto en Audio. Describe tus componentes o hazme una consulta técnica para comenzar." }
            ]);
        }

        const count = localStorage.getItem("fonica_msg_count");
        if (count) setMsgCount(parseInt(count));
    }, [user]);

    useEffect(() => {
        if (chatMessages.length > 0) {
            localStorage.setItem("fonica_chat_history", JSON.stringify(chatMessages));
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem("fonica_msg_count", msgCount.toString());
    }, [msgCount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelections(prev => ({ ...prev, [name]: value }));
    };

    const sendMessage = async (messageOverride?: string) => {
        const msgToSend = messageOverride || currentMessage;
        if (!msgToSend.trim() || isChatLoading) return;

        if (msgCount >= 20 && !user?.isPremium) {
            setChatMessages(prev => [...prev, { role: "assistant", content: "Has alcanzado el límite de 20 mensajes gratuitos. Por favor, suscríbete a Fónica Maestro para continuar recibiendo asesoría ilimitada." }]);
            return;
        }

        const userMsg = { role: "user", content: msgToSend };
        setChatMessages(prev => [...prev, userMsg]);
        setCurrentMessage("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...chatMessages, userMsg],
                    userName: user?.name || "Audiófilo",
                    selections: selections
                }),
            });
            const data = await response.json();
            setChatMessages(prev => [...prev, data]);
            setMsgCount(prev => prev + 1);
        } catch (error) {
            console.error("Chat Error:", error);
            setChatMessages(prev => [...prev, { role: "assistant", content: "Lo siento, hubo un problema técnico al procesar tu consulta." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const clearChat = () => {
        localStorage.removeItem("fonica_chat_history");
        const initialMsg = { role: "assistant", content: user ? `Hola ${user.name}. Soy tu experto en Hi-Fi. ¿En qué puedo ayudarte?` : "Hola, soy tu experto en Hi-Fi. ¿En qué puedo ayudarte?" };
        setChatMessages([initialMsg]);
    };

    const suggestions = [
        "¿Qué amplificador me recomiendas?",
        "Explica la clase A vs AB",
        "Mejoras para mi tornamesa",
        "Troubleshooting de ruidos"
    ];

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
            alert("No se pudo generar la asesoría técnica detallada.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = async () => {
        if (!reportRef.current) return;
        const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#141414", logging: false, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Asesoria_Fonica_${user?.name || "Premium"}.pdf`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 px-6 pt-24 pb-20">
            <header className="space-y-4">
                <div className="flex items-center space-x-2 text-netflix-red font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Asesoría Maestra</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">Configuración y <span className="text-netflix-red">Sinergia.</span></h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column: Gear Setup */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-netflix-dark p-8 rounded-lg border border-netflix-border/50 space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white">Tu Sistema</h3>
                            <p className="text-sm text-netflix-muted">Declara tus componentes para que el experto tenga contexto total.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "amplifier", label: "Amplificador", placeholder: "Marantz 2270..." },
                                { name: "turntable", label: "Tornamesa", placeholder: "Technics SL-1200..." },
                                { name: "speakers", label: "Parlantes", placeholder: "JBL L100..." },
                                { name: "cables", label: "Cables", placeholder: "Cobre OFC..." },
                            ].map((field) => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-xs font-bold text-netflix-muted uppercase tracking-wider">{field.label}</label>
                                    <input
                                        name={field.name}
                                        value={(selections as any)[field.name]}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder}
                                        className="w-full bg-netflix-hover border border-netflix-border/50 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={generateAdvisory}
                            disabled={isGenerating || !selections.amplifier}
                            className="w-full py-4 bg-white text-black rounded font-bold uppercase text-xs tracking-widest hover:bg-white/80 transition-all flex items-center justify-center space-x-2"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            <span>Generar Reporte Técnico</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Chat Interface */}
                <div className="lg:col-span-8 flex flex-col h-[700px] bg-netflix-dark rounded-lg border border-netflix-border/50 overflow-hidden relative">
                    {/* Chat Header */}
                    <div className="p-4 bg-netflix-hover/40 border-b border-netflix-border flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-netflix-red flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Experto Audiófilo Fónica</h4>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest leading-none">En Línea</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="text-xs text-netflix-muted hover:text-white transition-colors flex items-center space-x-1"
                        >
                            <RotateCcw className="w-3 h-3" />
                            <span>Limpiar Chat</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-netflix-black/20">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={clsx(
                                "flex flex-col space-y-1 max-w-[85%]",
                                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                            )}>
                                <div className={clsx(
                                    "px-4 py-3 rounded-lg text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-netflix-hover text-white rounded-tr-none"
                                        : "bg-netflix-dark border border-netflix-border/50 border-l-[3px] border-l-netflix-red text-white/90 rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-netflix-muted font-bold uppercase tracking-widest px-1">
                                    {msg.role === "user" ? "Tú" : "Experto"}
                                </span>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex flex-col items-start mr-auto space-y-2">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-netflix-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-netflix-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-netflix-red rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[9px] text-netflix-muted font-bold uppercase tracking-widest">Analizando...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 space-y-4 bg-netflix-hover/20">
                        {/* Quick Suggestions */}
                        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-netflix-dark border border-netflix-border/50 rounded-full text-[10px] font-bold text-netflix-text hover:bg-white hover:text-black transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Haz una consulta técnica sobre tu equipo..."
                                className="w-full bg-netflix-hover border border-netflix-border rounded px-4 py-4 pr-14 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-netflix-muted"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!currentMessage.trim() || isChatLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded bg-netflix-red flex items-center justify-center text-white hover:bg-netflix-red/90 transition-all disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Display (Conditional) */}
            {report && (
                <div className="pt-20 animate-in slide-in-from-bottom-10 duration-700">
                    <div ref={reportRef} className="bg-netflix-dark border border-netflix-border rounded-lg p-10 md:p-20 space-y-12">
                        <div className="text-center space-y-4">
                            <Logo className="w-20 h-20 mx-auto" />
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{report.title}</h2>
                            <p className="text-xl text-netflix-muted italic max-w-2xl mx-auto">{report.intro}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-netflix-border">
                            <div className="space-y-4">
                                <h3 className="text-premium-gold font-bold uppercase tracking-widest flex items-center space-x-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Análisis de Sinergia</span>
                                </h3>
                                <p className="text-white/90 leading-relaxed">{report.synergyDetails}</p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-premium-gold font-bold uppercase tracking-widest flex items-center space-x-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Tips del Experto</span>
                                </h3>
                                <ul className="space-y-2">
                                    {report.expertTips.map((tip: string, i: number) => (
                                        <li key={i} className="flex items-start space-x-3 text-netflix-muted">
                                            <div className="w-1.5 h-1.5 bg-netflix-red rounded-full mt-2 shrink-0" />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-netflix-border flex justify-center">
                            <button onClick={downloadPDF} className="btn-premium">
                                Descargar Reporte PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
