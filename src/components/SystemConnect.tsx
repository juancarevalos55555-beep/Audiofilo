"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Cable, Radio, Speaker, CheckCircle2, RotateCcw, FileText, Loader2, Sparkles, Send, User as UserIcon, MessageCircle, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useUser } from "@/context/UserContext";
import Logo from "./Logo";
import ReactMarkdown from "react-markdown";

export default function SystemConnect() {
    const { user } = useUser();
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);
    const [msgCount, setMsgCount] = useState(0);

    // Manual Advisor States
    const [isManualMode, setIsManualMode] = useState(false);
    const [selections, setSelections] = useState({
        amplifier: "",
        turntable: "",
        speakers: "",
        cables: "",
        other: ""
    });
    const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
    const [advisorResult, setAdvisorResult] = useState<any>(null);

    // Persistence and Initialize
    useEffect(() => {
        // Handle persistence
        const savedChat = localStorage.getItem("fonica_chat_history_v2");
        const containsColega = savedChat && savedChat.toLowerCase().includes("colega");
        const shouldReset = savedChat && (savedChat.includes("Oráculo") || containsColega);

        if (savedChat && !shouldReset) {
            try {
                const parsed = JSON.parse(savedChat);
                if (Array.isArray(parsed)) {
                    setChatMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chat history:", e);
            }
        }

        if (chatMessages.length === 0 || shouldReset) {
            const welcomeMsg = {
                role: "assistant",
                content: "Hola audiófilo. Escribe tu consulta y hablemos de música y técnica.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages([welcomeMsg]);
            if (shouldReset) localStorage.removeItem("fonica_chat_history_v2");
        }

        const count = localStorage.getItem("fonica_msg_count_v2");
        if (count) setMsgCount(parseInt(count));
    }, []);

    useEffect(() => {
        if (chatMessages.length > 0) {
            const limitedHistory = chatMessages.slice(-50);
            localStorage.setItem("fonica_chat_history_v2", JSON.stringify(limitedHistory));

            // Auto-scroll ONLY for user messages and NOT on initial load
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
                return;
            }

            const lastMsg = chatMessages[chatMessages.length - 1];
            if (lastMsg.role === "user") {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [chatMessages]);

    useEffect(() => {
        localStorage.setItem("fonica_msg_count_v2", msgCount.toString());
    }, [msgCount]);

    const sendMessage = async (messageOverride?: string) => {
        const msgToSend = messageOverride || currentMessage;
        if (!msgToSend.trim() || isChatLoading) return;

        const maxFree = 15;
        if (msgCount >= maxFree && !user?.isPremium) {
            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: "Has alcanzado el límite de consultas gratuitas de hoy. Actualiza a Premium para mantener una línea abierta ilimitada conmigo.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            return;
        }

        const userMsg = {
            role: "user",
            content: msgToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, userMsg]);
        setCurrentMessage("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatMessages.concat(userMsg).slice(-10),
                    userName: user?.name || "Audiófilo"
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la conexión con el asesor.");
            }

            const content = await response.text();

            const aiMsg = {
                role: "assistant",
                content: content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setChatMessages(prev => [...prev, aiMsg]);
            setMsgCount(prev => prev + 1);

        } catch (error: any) {
            console.error("Chat Error Detailed:", error);
            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: "⚠️ ERROR DE ENLACE: " + (error.message || "Interferencia técnica desconocida."),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleAdvisorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdvisorLoading(true);
        setAdvisorResult(null);

        try {
            const response = await fetch("/api/advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selections,
                    userName: user?.name || "Audiófilo"
                }),
            });

            if (!response.ok) throw new Error("Error al obtener la asesoría.");
            const data = await response.json();
            setAdvisorResult(data);
        } catch (error: any) {
            console.error("Advisor Error:", error);
            alert("No se pudo generar la asesoría. Intenta de nuevo.");
        } finally {
            setIsAdvisorLoading(false);
        }
    };

    const clearChat = () => {
        localStorage.removeItem("fonica_chat_history_v2");
        const welcomeMsg = {
            role: "assistant",
            content: "Bienvenido de nuevo. ¿En qué aspecto de tu viaje audiófilo nos enfocamos ahora?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([welcomeMsg]);
        setMsgCount(0);
    };

    const suggestions = [
        "¿Cuáles son los mejores altavoces para Clase A?",
        "Explícame el factor de amortiguamiento (Damping Factor)",
        "¿Cómo influye el VTA en la reproducción de vinilos?",
        "Recomiéndame un DAC con sonido analógico"
    ];

    return (
        <div className="fixed top-20 left-0 right-0 bottom-0 bg-netflix-black z-40 flex flex-col p-4 md:p-6 animate-in fade-in duration-1000 overflow-hidden">
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col bg-[#1a1a1a] rounded-xl border border-[#404040] overflow-hidden relative shadow-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                {/* Chat Tabs */}
                <div className="flex bg-[#121212] border-b border-[#404040]">
                    <button
                        onClick={() => setIsManualMode(false)}
                        className={clsx(
                            "flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all",
                            !isManualMode ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1a1a1a]" : "text-netflix-muted hover:text-white"
                        )}
                    >
                        Chat con Experto
                    </button>
                    <button
                        onClick={() => setIsManualMode(true)}
                        className={clsx(
                            "flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all",
                            isManualMode ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1a1a1a]" : "text-netflix-muted hover:text-white"
                        )}
                    >
                        Configurar Sistema
                    </button>
                </div>

                {/* Dashboard Header Overlay (only for chat) */}
                {!isManualMode && (
                    <div className="px-6 py-4 bg-[#1a1a1a] border-b border-[#404040] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#2d2d2d] border border-[#FFD700]/30 flex items-center justify-center">
                                <Logo className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Experto Audiofilo</h4>
                                <div className="flex items-center space-x-1.5">
                                    <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-widest">Súper-Especialista de Élite</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {!user?.isPremium && (
                                <span className="text-[10px] font-bold text-netflix-muted uppercase tracking-tighter">
                                    {msgCount}/15 consultas hoy
                                </span>
                            )}
                            <button
                                onClick={clearChat}
                                className="p-2 text-netflix-muted hover:text-white transition-colors"
                                title="Limpiar Conversación"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#1a1a1a]">
                    {!isManualMode ? (
                        /* Messages Area */
                        <div className="p-4 md:p-8 space-y-8">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    id={`msg-${i}`}
                                    className={clsx(
                                        "flex flex-col space-y-2 max-w-[85%] md:max-w-[70%]",
                                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg markdown-content",
                                        msg.role === "user"
                                            ? "bg-[#3a3a3a] text-white rounded-tr-none whitespace-pre-wrap"
                                            : "bg-[#2d2d2d] text-white border-l-[4px] border-l-[#FFD700] rounded-tl-none"
                                    )}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 px-2">
                                        <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                            {(msg as any).timestamp}
                                        </span>
                                        <span className="text-[10px] text-[#FFD700]/40 font-bold uppercase tracking-widest">•</span>
                                        <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                            {msg.role === "user" ? (user?.name || "Tú") : "Experto Audiofilo"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex flex-col items-start mr-auto space-y-3 px-2">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-[0.2em] animate-pulse">Analizando circuitos...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    ) : (
                        /* Manual Config Form & Results */
                        <div className="p-6 md:p-10 space-y-10">
                            {advisorResult ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center justify-between border-b border-[#404040] pb-4">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{advisorResult.title}</h3>
                                        <button
                                            onClick={() => setAdvisorResult(null)}
                                            className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline"
                                        >
                                            Editar Configuración
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="bg-[#252525] p-6 rounded-xl border border-[#404040]">
                                                <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-4">Veredicto Inicial</h5>
                                                <p className="text-white text-sm leading-relaxed italic">"{advisorResult.intro}"</p>
                                            </div>

                                            <div className="bg-[#252525] p-6 rounded-xl border border-[#404040]">
                                                <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-4">Tips de Experto</h5>
                                                <ul className="space-y-3">
                                                    {advisorResult.expertTips?.map((tip: string, idx: number) => (
                                                        <li key={idx} className="flex items-start space-x-3 text-sm text-netflix-text">
                                                            <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mt-1.5 shrink-0" />
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-[#121212] p-6 rounded-xl border border-[#FFD700]/20 flex flex-col items-center justify-center space-y-8">
                                            <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] w-full text-center mb-4">Esquema de Conexión</h5>

                                            <div className="w-full space-y-4">
                                                {advisorResult.connectionScheme?.visual?.nodes?.map((node: any) => (
                                                    <div key={node.id} className="p-3 bg-[#2d2d2d] border border-[#404040] rounded text-center">
                                                        <span className="text-[10px] font-bold text-netflix-muted uppercase tracking-tighter block">{node.type}</span>
                                                        <span className="text-sm font-bold text-white">{node.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="w-full text-[10px] text-netflix-muted uppercase tracking-widest text-center">
                                                * Esquema técnico sugerido basado en sinergia Hi-End
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#2d2d2d]/30 p-6 rounded-xl border-l-4 border-[#FFD700]">
                                        <h5 className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-2">Análisis de Sinergia</h5>
                                        <p className="text-white text-sm leading-relaxed">{advisorResult.synergyDetails}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleAdvisorSubmit} className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                                    <div className="text-center space-y-2 mb-10">
                                        <h3 className="text-3xl font-bold text-white">Mapa de Conexión Maestro</h3>
                                        <p className="text-netflix-muted text-sm">Define tu sistema y deja que el Experto trace la ruta de señal perfecta.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Amplificador / Receiver</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Sansui AU-D11"
                                                    value={selections.amplifier}
                                                    onChange={e => setSelections({ ...selections, amplifier: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Tornamesa / Fuente</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Thorens TD-124"
                                                    value={selections.turntable}
                                                    onChange={e => setSelections({ ...selections, turntable: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Parlantes</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: JBL L100 Century"
                                                    value={selections.speakers}
                                                    onChange={e => setSelections({ ...selections, speakers: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Cables</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Kimber Kable 8TC"
                                                    value={selections.cables}
                                                    onChange={e => setSelections({ ...selections, cables: e.target.value })}
                                                    className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest ml-1">Otros Componentes</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: DAC Chord Hugo, Ecualizador..."
                                            value={selections.other}
                                            onChange={e => setSelections({ ...selections, other: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#404040] rounded-lg px-4 py-3 text-sm text-white focus:border-[#FFD700] outline-none transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAdvisorLoading}
                                        className="w-full py-4 bg-[#FFD700] text-black font-bold uppercase tracking-[0.2em] rounded-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
                                    >
                                        {isAdvisorLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Calculando Sinergia...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                <span>Generar Esquema Maestro</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Input Area (only for chat) */}
                {!isManualMode && (
                    <div className="p-4 md:p-6 space-y-4 bg-[#1a1a1a]/80 backdrop-blur-md border-t border-[#404040]">
                        {/* Quick Suggestions */}
                        {chatMessages.length < 3 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="whitespace-nowrap px-4 py-2 bg-[#2d2d2d] border border-[#404040] rounded-full text-[11px] font-bold text-white hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-end space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows={1}
                                    placeholder="Haz una consulta de nivel experto..."
                                    className="w-full bg-[#252525] border border-[#404040] rounded-xl px-4 py-4 pr-14 text-sm md:text-base text-white focus:outline-none focus:border-[#FFD700] transition-all placeholder:text-gray-500 resize-none min-h-[56px] max-h-32"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!currentMessage.trim() || isChatLoading}
                                    className={clsx(
                                        "absolute right-2 bottom-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-30",
                                        currentMessage.trim() ? "bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]" : "bg-[#3a3a3a] text-gray-500"
                                    )}
                                >
                                    {isChatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
