"use client";

import { Check, Star, Zap, ShieldCheck, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function PremiumModule({ onUpgrade }: { onUpgrade: () => void }) {
    const { user } = useUser();

    if (user?.isPremium) return null;

    return (
        <div className="glass-gold p-8 rounded-[32px] border border-bronze/30 space-y-6 bg-gradient-to-br from-bronze/10 to-transparent">
            <div className="flex items-center justify-between">
                <div className="p-3 bg-bronze rounded-xl shadow-lg shadow-bronze/20">
                    <Crown className="w-6 h-6 text-obsidian" />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-bronze/60">Suscripción Anual</p>
                    <p className="text-2xl font-serif font-bold text-white">$3<span className="text-sm font-normal text-bronze/40 underline decoration-bronze/20">/mes</span></p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-white">Audiofilo <span className="text-bronze italic">Maestro</span></h3>
                <p className="text-xs text-bronze/60 leading-relaxed font-display">
                    Desbloquea el poder total de nuestra IA con análisis de circuitos ilimitados y exportación de fichas HD personalizadas.
                </p>
            </div>

            <div className="space-y-3">
                {[
                    "Escaneos de hardware ilimitados",
                    "Chat con Experto prioritario",
                    "Exportación PDF sin marca de agua",
                    "Acceso anticipado a nuevos modelos"
                ].map(item => (
                    <div key={item} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider text-white/60">
                        <Check className="w-3 h-3 text-bronze" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onUpgrade}
                className="w-full py-4 bg-bronze text-obsidian rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-bronze/10"
            >
                Subir a Premium
            </button>
        </div>
    );
}
