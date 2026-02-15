"use client";

import { Award, Calendar, MapPin, Zap } from "lucide-react";

export default function ExecutiveSummary({ data }: { data: any }) {
    const items = [
        {
            label: "Época",
            value: data?.era || "Era Dorada",
            icon: Calendar,
            sub: "Cronología de Producción"
        },
        {
            label: "Origen",
            value: data?.origin || "Internacional",
            icon: MapPin,
            sub: "Manufactura Original"
        },
        {
            label: "Estatus",
            value: data?.statusLabel || "Equilibrado",
            icon: Zap,
            sub: "Posicionamiento Audiófilo",
            hl: true
        }
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-netflix-border/50">
            {items.map((item, i) => (
                <div key={i} className="p-8 space-y-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-netflix-red/10 rounded-lg group-hover:bg-netflix-red/20 transition-colors">
                            <item.icon className="w-4 h-4 text-netflix-red" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-netflix-muted">{item.label}</span>
                    </div>
                    <div className="space-y-1">
                        <p className={`text-xl font-bold tracking-tight ${item.hl ? 'text-netflix-red' : 'text-white'}`}>
                            {item.value}
                        </p>
                        <p className="text-[10px] font-bold text-netflix-muted uppercase tracking-wider">{item.sub}</p>
                    </div>
                </div>
            ))}

            <div className="p-8 space-y-4 bg-netflix-red/5">
                <div className="flex items-center justify-between">
                    <div className="p-2 bg-netflix-red/10 rounded-lg">
                        <Award className="w-4 h-4 text-netflix-red" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-netflix-muted">Factor Culto</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-1.5">
                        {[...Array(5)].map((_, i) => (
                            <Zap key={i} className={`w-5 h-5 transition-all duration-700 ${i < (data?.cultFactor || 0) ? 'fill-premium-gold text-premium-gold' : 'text-white/5'}`} />
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-premium-gold tracking-widest uppercase">
                        Nivel: {data?.cultFactor >= 5 ? 'Coleccionista Elite' : 'Entusiasta Pro'}
                    </p>
                </div>
            </div>
        </section>
    );
}
