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
        const savedChat = localStorage.getItem("fonica_chat_history_v2");
        if (savedChat) {
            setChatMessages(JSON.parse(savedChat));
        } else {
            const welcomeMsg = {
                role: "assistant",
                content: "¡Hola! 👋 Soy tu asesor experto en audio Hi-Fi.\n\nCon más de 35 años de experiencia en equipos analógicos y digitales, estoy aquí para ayudarte con:\n\n🔸 Identificación de equipos vintage y modernos\n🔸 Recomendaciones de componentes y sinergias\n🔸 Diagnóstico de problemas técnicos\n🔸 Configuración óptima de tu sistema\n🔸 Consejos de compra y valoración de mercado\n\n¿En qué puedo ayudarte hoy?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages([welcomeMsg]);
        }

        const count = localStorage.getItem("fonica_msg_count_v2");
        if (count) setMsgCount(parseInt(count));
    }, []);

    useEffect(() => {
        if (chatMessages.length > 0) {
            // Limit to 50 messages
            const limitedHistory = chatMessages.slice(-50);
            localStorage.setItem("fonica_chat_history_v2", JSON.stringify(limitedHistory));
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                content: "Has alcanzado el límite de consultas gratuitas. Actualiza a Premium para consultas ilimitadas.",
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
                    messages: chatMessages.concat(userMsg),
                    userName: user?.name || "Audiófilo"
                }),
            });
            const data = await response.json();
            const aiMsg = {
                ...data,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, aiMsg]);
            setMsgCount(prev => prev + 1);
        } catch (error) {
            console.error("Chat Error:", error);
            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: "Disculpa, tuve un problema técnico. Intenta de nuevo.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const clearChat = () => {
        localStorage.removeItem("fonica_chat_history_v2");
        const welcomeMsg = {
            role: "assistant",
            content: "¡Hola! 👋 Soy tu asesor experto en audio Hi-Fi. ¿En qué puedo ayudarte hoy?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([welcomeMsg]);
        setMsgCount(0);
    };

    const suggestions = [
        "¿Qué amplificador me recomiendas para empezar?",
        "Explica la diferencia entre clase A y clase AB",
        "¿Cómo mejoro la acústica de mi sala?",
        "¿Vale la pena un amplificador de válvulas?"
    ];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000 px-4 md:px-6 pt-24 pb-12">
            <header className="max-w-4xl mx-auto text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center space-x-3">
                    <span className="text-2xl md:text-3xl">💬</span>
                    <span>Chat con Experto Audiófilico</span>
                </h1>
                <p className="text-netflix-muted font-medium">Tu asesor personal en equipos Hi-Fi • Respuestas en tiempo real</p>
            </header>

            <div className="max-w-4xl mx-auto w-full flex flex-col h-[75vh] md:h-[700px] bg-[#1a1a1a] rounded-xl border border-[#404040] overflow-hidden relative shadow-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                {/* Chat Header */}
                <div className="px-6 py-4 bg-[#252525]/80 border-b border-[#404040] flex items-center justify-between z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2d2d2d] border border-[#FFD700]/30 flex items-center justify-center">
                            <Logo className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Experto Fónica</h4>
                            <div className="flex items-center space-x-1.5">
                                <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-widest">IA Generativa Hi-Fi</span>
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

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={clsx(
                            "flex flex-col space-y-2 max-w-[85%] md:max-w-[70%]",
                            msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        )}>
                            <div className={clsx(
                                "px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-lg",
                                msg.role === "user"
                                    ? "bg-[#3a3a3a] text-white rounded-tr-none"
                                    : "bg-[#2d2d2d] text-white border-l-[4px] border-l-[#FFD700] rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                            <div className="flex items-center space-x-2 px-2">
                                <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                    {(msg as any).timestamp}
                                </span>
                                <span className="text-[10px] text-[#FFD700]/40 font-bold uppercase tracking-widest">•</span>
                                <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-widest">
                                    {msg.role === "user" ? (user?.name || "Tú") : "Mentor Experto"}
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
                            <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-[0.2em] animate-pulse">El experto está escribiendo...</span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
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
                                placeholder="Escribe tu pregunta profesional..."
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
            </div>
        </div>
    );
}
