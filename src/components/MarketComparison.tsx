"use client";

import { TrendingUp, DollarSign, Globe2, BarChart3 } from "lucide-react";

export default function MarketComparison({ marketData }: { marketData: any }) {
    if (!marketData) return null;

    return (
        <section className="bg-obsidian/40 backdrop-blur-md border border-bronze/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-2 text-bronze">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-xl font-serif font-semibold">Contexto de Mercado</h3>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-bronze/5 rounded-xl border border-bronze/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase font-bold text-bronze/40 tracking-widest">Rango de Precio</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-serif font-bold text-bronze">{marketData.priceRange}</span>
                        <span className="text-xs text-bronze/40">USD</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/20 rounded-lg border border-bronze/5">
                        <div className="flex items-center space-x-2 text-bronze/40 mb-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-bronze/60">Liquidez</span>
                        </div>
                        <p className="text-sm font-medium text-white">{marketData.liquidity}</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-bronze/5">
                        <div className="flex items-center space-x-2 text-bronze/40 mb-1">
                            <BarChart3 className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-bronze/60">Tendencia</span>
                        </div>
                        <p className="text-sm font-medium text-white">{marketData.trend}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-bronze/10">
                    <h4 className="text-[10px] font-black uppercase text-bronze/40 tracking-widest mb-2">Comentario de Inversión</h4>
                    <p className="text-xs italic text-bronze/70 leading-relaxed font-serif">
                        "{marketData.investmentInsight}"
                    </p>
                </div>
            </div>
        </section>
    );
}
