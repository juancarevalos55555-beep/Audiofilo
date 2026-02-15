"use client";

import { MessageSquare, Lightbulb, AlertCircle } from "lucide-react";

export default function ExpertVoice({ brand, insights }: { brand: string, insights: any }) {
    return (
        <div className="space-y-8">
            {/* Main Comment */}
            <div className="bg-netflix-dark rounded-lg p-8 relative overflow-hidden group border border-netflix-border/50">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MessageSquare className="w-24 h-24 text-netflix-red" />
                </div>

                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-bold text-white leading-tight italic">
                        "{insights?.mainComment || "El análisis histórico sugiere un componente de gran relevancia técnica..."}"
                    </h3>
                    <div className="pt-6 border-t border-netflix-border/50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-netflix-red">
                            CURADOR SENIOR // {brand || "AUDIO FILO"}
                        </p>
                        <p className="text-[9px] text-netflix-muted font-bold uppercase tracking-widest mt-1">Sello de Veracidad Técnica Fónica</p>
                    </div>
                </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-netflix-dark p-6 rounded-lg space-y-4 border border-netflix-border/30">
                    <div className="flex items-center space-x-2 text-netflix-red">
                        <AlertCircle className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Puntos de Atención</h4>
                    </div>
                    <ul className="space-y-3">
                        {insights?.commonIssues?.map((issue: string, i: number) => (
                            <li key={i} className="flex items-start space-x-3">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-netflix-red rounded-full shrink-0" />
                                <span className="text-xs text-netflix-text font-bold leading-relaxed">{issue}</span>
                            </li>
                        )) || <span className="text-xs italic opacity-20">Analizando fatiga de materiales...</span>}
                    </ul>
                </div>

                <div className="bg-netflix-dark p-6 rounded-lg space-y-4 border border-netflix-border/30">
                    <div className="flex items-center space-x-2 text-premium-gold">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Sinergia Sugerida</h4>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium border-l-2 border-premium-gold/50 pl-4 py-1">
                        {insights?.synergyTip || "Determinando compatibilidad acústica..."}
                    </p>
                </div>
            </div>
        </div>
    );
}
