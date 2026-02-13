"use client";

import { TrendingUp, DollarSign, Globe2, BarChart3 } from "lucide-react";

export default function MarketComparison({ marketData }: { marketData: any }) {
    if (!marketData) return null;

    return (
        <section className="bg-black/40 backdrop-blur-md border border-analog-gold/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-2 text-analog-gold">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-xl font-display font-semibold">Contexto de Mercado</h3>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-analog-gold/5 rounded-xl border border-analog-gold/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase font-bold text-analog-gold/40 tracking-widest">Rango de Precio</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-display font-bold text-analog-gold">{marketData.priceRange}</span>
                        <span className="text-xs text-analog-gold/40">USD</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/20 rounded-lg border border-analog-gold/5">
                        <div className="flex items-center space-x-2 text-analog-gold/40 mb-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Liquidez</span>
                        </div>
                        <p className="text-sm font-medium">{marketData.liquidity}</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-analog-gold/5">
                        <div className="flex items-center space-x-2 text-analog-gold/40 mb-1">
                            <BarChart3 className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Tendencia</span>
                        </div>
                        <p className="text-sm font-medium">{marketData.trend}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-analog-gold/10">
                    <h4 className="text-[10px] uppercase font-bold text-analog-gold/40 tracking-widest mb-2">Comentario de Inversión</h4>
                    <p className="text-xs italic text-analog-gold/70 leading-relaxed">
                        "{marketData.investmentInsight}"
                    </p>
                </div>
            </div>
        </section>
    );
}
