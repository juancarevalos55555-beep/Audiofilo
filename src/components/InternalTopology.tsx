"use client";

import { Cpu, Layers, Activity } from "lucide-react";

export default function InternalTopology({ topology }: { topology: any }) {
    return (
        <section className="bg-netflix-dark rounded-lg p-8 space-y-8 border border-netflix-border/50">
            <div className="flex items-center space-x-3 border-b border-netflix-border/50 pb-6">
                <div className="p-2 bg-netflix-red/10 rounded-lg">
                    <Cpu className="w-6 h-6 text-netflix-red" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white uppercase">Topología Interna</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-netflix-muted">
                        <Cpu className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Arquitectura</h4>
                    </div>
                    <p className="text-white text-sm font-medium leading-relaxed bg-black/20 p-5 rounded border border-netflix-border/30">
                        {topology?.architecture || "Analizando señales..."}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-netflix-muted">
                        <Layers className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Componentes Críticos</h4>
                    </div>
                    <ul className="space-y-3 bg-black/20 p-5 rounded border border-netflix-border/30">
                        {topology?.criticalParts?.map((part: string, i: number) => (
                            <li key={i} className="flex items-start space-x-3 group">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-netflix-red rounded-full group-hover:scale-150 transition-transform" />
                                <span className="text-xs text-netflix-text font-bold uppercase tracking-tight">{part}</span>
                            </li>
                        )) || <span className="text-xs italic opacity-20">No disponible</span>}
                    </ul>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-netflix-muted">
                        <Activity className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Flujo de Señal</h4>
                    </div>
                    <p className="text-xs text-netflix-text leading-relaxed font-medium bg-black/20 p-5 rounded border border-netflix-border/30">
                        {topology?.signalFlow || "Sincronizando osciloscopio digital..."}
                    </p>
                </div>
            </div>
        </section>
    );
}
