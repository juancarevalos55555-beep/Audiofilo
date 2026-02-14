"use client";

import { Zap, Cable, Radio, Speaker } from "lucide-react";

export default function SystemConnect() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-analog-gold/10 border border-analog-gold/20 rounded-full text-analog-gold text-[10px] font-bold uppercase tracking-widest">
                    <Cable className="w-3 h-3" />
                    <span>Asesoría Técnica</span>
                </div>
                <h2 className="text-5xl font-display font-black text-white">Conecta tu Sistema</h2>
                <p className="text-analog-gold/60 max-w-2xl mx-auto">
                    ¿Tienes dudas sobre cómo optimizar tu flujo de señal? Te ayudamos a emparejar impedancias y configurar tu cadena de audio ideal.
                </p>
            </header>

            <div className="max-w-4xl mx-auto glass-gold p-12 rounded-3xl border border-analog-gold/20 text-center space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <Cable className="w-6 h-6 text-analog-gold mx-auto mb-2" />
                        <span className="text-[9px] uppercase tracking-widest text-analog-gold/60">Cableado</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <Zap className="w-6 h-6 text-analog-gold mx-auto mb-2" />
                        <span className="text-[9px] uppercase tracking-widest text-analog-gold/60">Impedancia</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <Radio className="w-6 h-6 text-analog-gold mx-auto mb-2" />
                        <span className="text-[9px] uppercase tracking-widest text-analog-gold/60">Phono/Line</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <Cable className="w-6 h-6 text-analog-gold mx-auto mb-2 rotate-90" />
                        <span className="text-[9px] uppercase tracking-widest text-analog-gold/60">Bi-Amp</span>
                    </div>
                </div>

                <div className="pt-8 border-t border-analog-gold/10">
                    <p className="text-analog-gold/40 font-display italic">Estamos calibrando el asesor de conexiones. Disponible muy pronto.</p>
                </div>
            </div>
        </div>
    );
}
