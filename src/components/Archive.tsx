"use client";

import { useState, useEffect } from "react";
import { Library, Search, Disc, CassetteTape, Zap, History, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { legendaryEquipment } from "@/lib/mockData";

export default function Archive() {
    const [searchQuery, setSearchQuery] = useState("");
    const [library, setLibrary] = useState(legendaryEquipment);
    const [displayEquipment, setDisplayEquipment] = useState(legendaryEquipment);
    const [isLoading, setIsLoading] = useState(false);
    const [isAIOperated, setIsAIOperated] = useState(false);

    // Initialize library from localStorage
    useEffect(() => {
        const savedLibrary = localStorage.getItem("fonica_extended_archive");
        if (savedLibrary) {
            try {
                const parsed = JSON.parse(savedLibrary);
                const merged = [...legendaryEquipment];
                parsed.forEach((item: any) => {
                    const exists = merged.find(m =>
                        m.model.toLowerCase() === item.model.toLowerCase() &&
                        m.brand.toLowerCase() === item.brand.toLowerCase()
                    );
                    if (!exists) merged.push(item);
                });
                setLibrary(merged);
                setDisplayEquipment(merged);
            } catch (e) {
                console.error("Error loading library:", e);
            }
        }
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setDisplayEquipment(library);
            setIsAIOperated(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/archive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery }),
            });

            if (!response.ok) throw new Error("Error en la búsqueda");

            const data = await response.json();

            // Feed the library
            setLibrary(prev => {
                const newItems = [...prev];
                data.forEach((item: any) => {
                    const exists = newItems.find(n =>
                        n.model.toLowerCase() === item.model.toLowerCase() &&
                        n.brand.toLowerCase() === item.brand.toLowerCase()
                    );
                    if (!exists) newItems.push(item);
                });
                // Save to localStorage (only non-mock items)
                const mockIds = legendaryEquipment.map(l => l.id);
                localStorage.setItem("fonica_extended_archive", JSON.stringify(newItems.filter(i =>
                    !mockIds.includes(i.id)
                )));
                return newItems;
            });

            setDisplayEquipment(data);
            setIsAIOperated(true);
        } catch (error) {
            console.error("Search error:", error);
            const filtered = library.filter(item =>
                item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.model.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setDisplayEquipment(filtered);
            setIsAIOperated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const resetArchive = () => {
        setSearchQuery("");
        setDisplayEquipment(library);
        setIsAIOperated(false);
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 px-6 pt-24 pb-20">
            <header className="space-y-4">
                <div className="flex items-center space-x-2 text-netflix-red font-bold text-sm">
                    <Library className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Archivo Digital</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {isAIOperated ? "Resultados del" : "Componentes"} <span className="text-netflix-red">{isAIOperated ? "Análisis." : "Legendarios."}</span>
                </h1>
                <p className="text-netflix-muted max-w-2xl text-lg font-medium">
                    {isAIOperated
                        ? `Registros encontrados para "${searchQuery}" en la base de datos histórica de Fónica.`
                        : "Explora nuestra base de datos curada de hardware icónico que definió la historia del sonido Hi-Fi."}
                </p>
            </header>

            {/* Search Bar - Netflix Inspired */}
            <div className="max-w-xl space-y-3">
                <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-netflix-muted group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Empresa, modelo o categoría..."
                        className="w-full bg-netflix-dark border border-netflix-border/50 rounded px-12 py-4 text-white placeholder:text-netflix-muted focus:outline-none focus:border-white transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Disc className="w-5 h-5 text-netflix-red animate-spin" />
                        </div>
                    )}
                </form>

                {/* Searching Indicator */}
                <div className={clsx("flex items-center space-x-2 px-2 transition-all duration-300", isLoading ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none")}>
                    <Sparkles className="w-3 h-3 text-premium-gold animate-pulse" />
                    <span className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em] animate-pulse">
                        Buscando en registros históricos de alta fidelidad...
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {isAIOperated ? (
                    <button
                        onClick={resetArchive}
                        className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-2"
                    >
                        <History className="w-3 h-3" />
                        <span>Volver a la selección (Librería expandida: {library.length})</span>
                    </button>
                ) : (
                    <div className="text-[10px] font-bold text-netflix-muted uppercase tracking-widest flex items-center space-x-2">
                        <Disc className="w-3 h-3" />
                        <span>Librería: {library.length} componentes registrados</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-netflix-dark/50 p-6 rounded-lg border border-netflix-border/20 animate-pulse h-64 shadow-xl" />
                    ))
                ) : displayEquipment.length > 0 ? (
                    displayEquipment.map((item) => (
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
                    {isAIOperated ? "Análisis de Datos Generado por Gemini 2.5 Flash" : "Referencia Técnica Historica Fónica // Actualización 2026"}
                </p>
            </div>
        </div>
    );
}
