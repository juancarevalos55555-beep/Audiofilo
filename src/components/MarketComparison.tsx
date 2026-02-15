"use client";

import { TrendingUp, DollarSign, Globe2, BarChart3 } from "lucide-react";

export default function MarketComparison({ marketData }: { marketData: any }) {
    if (!marketData) return null;

    return (
        <section className="bg-netflix-dark rounded-lg border border-netflix-border/50 p-6 space-y-6">
            <div className="flex items-center space-x-2 text-netflix-red">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Contexto de Mercado</h3>
            </div>

            <div className="space-y-4">
                <div className="p-5 bg-netflix-hover/40 rounded border border-netflix-border/30">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold text-netflix-muted tracking-[0.2em]">Rango de Valor Estimado</span>
                        <TrendingUp className="w-4 h-4 text-netflix-red" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-white">{marketData.priceRange}</span>
                        <span className="text-sm font-bold text-netflix-muted uppercase">USD</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/20 rounded border border-netflix-border/30">
                        <div className="flex items-center space-x-2 text-netflix-muted mb-2">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Liquidez</span>
                        </div>
                        <p className="text-sm font-bold text-white uppercase">{marketData.liquidity}</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded border border-netflix-border/30">
                        <div className="flex items-center space-x-2 text-netflix-muted mb-2">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Tendencia</span>
                        </div>
                        <p className="text-sm font-bold text-white uppercase">{marketData.trend}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-netflix-border/50">
                    <h4 className="text-[10px] font-bold uppercase text-netflix-muted tracking-[0.2em] mb-3">Análisis de Inversión</h4>
                    <p className="text-xs font-medium text-netflix-text leading-relaxed">
                        "{marketData.investmentInsight}"
                    </p>
                </div>
            </div>
        </section>
    );
}
