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
        <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 px-6 pt-24 pb-20">
            <header className="space-y-4">
                <div className="flex items-center space-x-2 text-netflix-red font-bold text-sm">
                    <Library className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Archivo Digital</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">Componentes <span className="text-netflix-red">Legendarios.</span></h1>
                <p className="text-netflix-muted max-w-2xl text-lg font-medium">
                    Explora nuestra base de datos curada de hardware icónico que definió la historia del sonido Hi-Fi.
                </p>
            </header>

            {/* Search Bar - Netflix Inspired */}
            <div className="max-w-xl relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-netflix-muted group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    placeholder="Empresa, modelo o categoría..."
                    className="w-full bg-netflix-dark border border-netflix-border/50 rounded px-12 py-4 text-white placeholder:text-netflix-muted focus:outline-none focus:border-white transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((item) => (
                        <div
                            key={item.id}
                            className="bg-netflix-dark p-6 rounded-lg border border-netflix-border/30 hover:bg-netflix-hover hover:scale-[1.02] hover:border-netflix-red/30 transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="space-y-4 flex-1">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-netflix-red">{item.brand}</span>
                                    <h4 className="text-xl font-bold text-white leading-tight group-hover:text-white transition-colors">{item.model}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] text-netflix-muted font-bold uppercase tracking-tighter">{item.type}</span>
                                        <span className="text-[10px] text-netflix-muted font-bold">•</span>
                                        <span className="text-[10px] text-premium-gold font-bold uppercase tracking-tighter">{item.year}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-netflix-muted leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="space-y-2 pt-4 border-t border-netflix-border/50">
                                    {item.specs.slice(0, 3).map((spec, i) => (
                                        <div key={i} className="flex items-center space-x-2 text-[10px] text-netflix-text font-medium">
                                            <Zap className="w-2.5 h-2.5 text-netflix-red fill-netflix-red" />
                                            <span>{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <Disc className="w-12 h-12 text-netflix-border mx-auto animate-spin-slow" />
                        <p className="text-netflix-muted font-bold uppercase tracking-widest text-sm">Sin resultados para tu búsqueda</p>
                    </div>
                )}
            </div>

            <div className="p-8 bg-netflix-dark/30 rounded-lg border border-netflix-border/50 text-center">
                <p className="text-[10px] font-bold text-netflix-muted uppercase tracking-[0.4em]">
                    Referencia Técnica Historica Fónica // Actualización 2026
                </p>
            </div>
        </div>
    );
}
