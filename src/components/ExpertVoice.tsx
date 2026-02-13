"use client";

import { MessageSquare, Lightbulb, AlertCircle } from "lucide-react";

export default function ExpertVoice({ brand, insights }: { brand: string, insights: any }) {
    return (
        <div className="space-y-8">
            {/* Main Comment */}
            <div className="glass-gold rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MessageSquare className="w-24 h-24 text-analog-gold" />
                </div>

                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-display font-bold text-white leading-tight italic">
                        "{insights?.mainComment || "El análisis histórico sugiere un componente de gran relevancia técnica..."}"
                    </h3>
                    <div className="pt-6 border-t border-analog-gold/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-analog-gold">
                            Curador Senior de {brand || "AudioArchivist"}
                        </p>
                        <p className="text-[9px] text-analog-gold/40 uppercase tracking-widest mt-1">Sello de Autenticidad Garantizado</p>
                    </div>
                </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 gap-6">
                <div className="glass p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 text-red-500/60">
                        <AlertCircle className="w-4 h-4" />
                        <h4 className="font-black uppercase text-[10px] tracking-widest">Puntos de Atención</h4>
                    </div>
                    <ul className="space-y-3">
                        {insights?.commonIssues?.map((issue: string, i: number) => (
                            <li key={i} className="flex items-start space-x-3">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-red-500/40 rounded-full shrink-0" />
                                <span className="text-xs text-analog-gold/70 leading-relaxed">{issue}</span>
                            </li>
                        )) || <span className="text-xs italic opacity-20">Analizando fatiga de materiales...</span>}
                    </ul>
                </div>

                <div className="glass p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 text-analog-gold/60">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="font-black uppercase text-[10px] tracking-widest">Sinergia Sugerida</h4>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed italic border-l-2 border-analog-gold/20 pl-4 py-1">
                        {insights?.synergyTip || "Determinando compatibilidad acústica..."}
                    </p>
                </div>
            </div>
        </div>
    );
}
