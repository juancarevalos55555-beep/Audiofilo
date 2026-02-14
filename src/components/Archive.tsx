"use client";

import { useState } from "react";
import { Library, Search, Disc, CassetteTape, Zap, History } from "lucide-react";
import { legendaryEquipment } from "@/lib/mockData";

export default function Archive() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEquipment = legendaryEquipment.filter(item =>
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-analog-gold/10 border border-analog-gold/20 rounded-full text-analog-gold text-[10px] font-bold uppercase tracking-widest">
                    <Library className="w-3 h-3" />
                    <span>Biblioteca Digital</span>
                </div>
                <h2 className="text-5xl font-display font-black text-white">Archivo de Audio</h2>
                <p className="text-analog-gold/60 max-w-2xl mx-auto">
                    Explora nuestra base de datos curada de componentes legendarios de la era dorada del Hi-Fi.
                </p>
            </header>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-analog-gold/40 group-focus-within:text-analog-gold transition-colors" />
                <input
                    type="text"
                    placeholder="Busca por marca, modelo o tipo..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-analog-gold/40 focus:ring-1 focus:ring-analog-gold/40 transition-all font-display"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((item) => (
                        <div key={item.id} className="glass-gold p-6 rounded-3xl border border-analog-gold/10 hover:border-analog-gold/40 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                                <History className="w-12 h-12 text-analog-gold" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60">{item.brand}</span>
                                    <h4 className="text-2xl font-display font-black text-white leading-tight">{item.model}</h4>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/5 rounded text-[9px] text-white/40 uppercase tracking-tighter">{item.type} • {item.year}</span>
                                </div>

                                <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="space-y-1.5 pt-4 border-t border-white/5">
                                    {item.specs.map((spec, i) => (
                                        <div key={i} className="flex items-center space-x-2 text-[9px] text-analog-gold/80 italic">
                                            <Zap className="w-2 h-2 fill-analog-gold" />
                                            <span>{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <Search className="w-12 h-12 text-analog-gold/20 mx-auto" />
                        <p className="text-analog-gold/40 font-display italic">No encontramos equipos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>

            <div className="p-8 glass rounded-3xl border border-white/5 text-center">
                <p className="text-[10px] font-mono text-analog-gold/30 uppercase tracking-[0.3em]">
                    Base de datos en expansión constante // Curaduría Técnica
                </p>
            </div>
        </div>
    );
}
