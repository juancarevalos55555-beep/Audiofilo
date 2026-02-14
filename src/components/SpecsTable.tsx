"use client";

import { Table } from "lucide-react";

export default function SpecsTable({ specs }: { specs: any[] }) {
    return (
        <section className="glass rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-bronze/10 flex items-center space-x-3 bg-bronze/5">
                <Table className="w-5 h-5 text-bronze" />
                <h3 className="text-xl font-serif font-bold uppercase tracking-tight">Especificaciones Técnicas</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-black/20 text-bronze/40 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-8 py-4">Parámetro</th>
                            <th className="px-8 py-4">Detalle Técnico</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-bronze/5">
                        {specs?.map((spec, i) => (
                            <tr key={i} className="group hover:bg-bronze/[0.03] transition-colors">
                                <td className="px-8 py-5 text-bronze font-bold tracking-tight font-serif">
                                    {spec.label}
                                </td>
                                <td className="px-8 py-5 text-bronze/80 font-mono text-xs">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                        {!specs && (
                            <tr className="opacity-20 italic">
                                <td className="px-8 py-5">No disponible</td>
                                <td className="px-8 py-5">N/A</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
