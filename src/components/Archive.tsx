"use client";

import { Library, Search, Disc, CassetteTape } from "lucide-react";

export default function Archive() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-analog-gold/10 border border-analog-gold/20 rounded-full text-analog-gold text-[10px] font-bold uppercase tracking-widest">
                    <Library className="w-3 h-3" />
                    <span>Biblioteca Digital</span>
                </div>
                <h2 className="text-5xl font-display font-black text-white">Archivo de Audio</h2>
                <p className="text-analog-gold/60 max-w-2xl mx-auto">
                    Explora nuestra base de datos curada de componentes legendarios, manuales técnicos y catálogos de la era dorada del Hi-Fi.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Amplificadores", icon: Library, count: "1,240 manuales" },
                    { title: "Tocadiscos", icon: Disc, count: "850 especificaciones" },
                    { title: "Decks de Cinta", icon: CassetteTape, count: "420 guías" },
                ].map((item, idx) => (
                    <div key={idx} className="glass-gold p-8 rounded-3xl border border-analog-gold/10 hover:border-analog-gold/30 transition-all cursor-not-allowed group">
                        <item.icon className="w-10 h-10 text-analog-gold mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-bold text-white">{item.title}</h4>
                        <p className="text-analog-gold/40 text-xs mt-2">{item.count}</p>
                    </div>
                ))}
            </div>

            <div className="p-12 glass rounded-3xl border border-white/5 text-center space-y-6">
                <Search className="w-12 h-12 text-analog-gold/20 mx-auto" />
                <p className="text-analog-gold/40 font-display italic">Módulo bajo restauración técnica. Próximamente disponible.</p>
            </div>
        </div>
    );
}
