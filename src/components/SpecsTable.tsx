"use client";

import { Table } from "lucide-react";

export default function SpecsTable({ specs }: { specs: any[] }) {
    return (
        <section className="bg-netflix-dark rounded overflow-hidden border border-netflix-border/50">
            <div className="p-6 border-b border-netflix-border/50 flex items-center space-x-3 bg-netflix-hover/40">
                <Table className="w-5 h-5 text-netflix-red" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Especificaciones Técnicas</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-netflix-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                            <th className="px-8 py-4">Parámetro</th>
                            <th className="px-8 py-4">Detalle Técnico</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-netflix-border/30">
                        {specs?.map((spec, i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 text-netflix-red font-bold tracking-tight uppercase text-xs">
                                    {spec.label}
                                </td>
                                <td className="px-8 py-5 text-white/90 font-medium">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
