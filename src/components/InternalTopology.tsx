"use client";

import { Cpu, Layers, Activity } from "lucide-react";

export default function InternalTopology({ topology }: { topology: any }) {
    return (
        <section className="glass rounded-3xl p-8 space-y-8">
            <div className="flex items-center space-x-3 border-b border-analog-gold/10 pb-6">
                <div className="p-2 bg-analog-gold/10 rounded-xl">
                    <Cpu className="w-6 h-6 text-analog-gold" />
                </div>
                <h3 className="text-2xl font-display font-bold tracking-tight">Topología Interna</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-analog-gold/60">
                        <Cpu className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Arquitectura</h4>
                    </div>
                    <p className="text-white text-sm italic font-medium leading-relaxed bg-black/20 p-4 rounded-2xl border border-analog-gold/5">
                        {topology?.architecture || "Analizando señales..."}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-analog-gold/60">
                        <Layers className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Componentes Críticos</h4>
                    </div>
                    <ul className="space-y-3 bg-black/20 p-4 rounded-2xl border border-analog-gold/5">
                        {topology?.criticalParts?.map((part: string, i: number) => (
                            <li key={i} className="flex items-start space-x-3 group">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-analog-gold rounded-full group-hover:scale-150 transition-transform" />
                                <span className="text-xs text-analog-gold/80 font-medium">{part}</span>
                            </li>
                        )) || <span className="text-xs italic opacity-20">No disponible</span>}
                    </ul>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-analog-gold/60">
                        <Activity className="w-4 h-4" />
                        <h4 className="font-bold uppercase text-[10px] tracking-widest">Flujo de Señal</h4>
                    </div>
                    <p className="text-xs text-analog-gold/70 leading-relaxed italic bg-black/20 p-4 rounded-2xl border border-analog-gold/5">
                        {topology?.signalFlow || "Sincronizando osciloscopio digital..."}
                    </p>
                </div>
            </div>
        </section>
    );
}
