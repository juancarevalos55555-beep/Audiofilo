"use client";

import { LayoutDashboard, Download, RotateCcw } from "lucide-react";
import ExecutiveSummary from "./ExecutiveSummary";
import SpecsTable from "./SpecsTable";
import InternalTopology from "./InternalTopology";
import ExpertVoice from "./ExpertVoice";
import MarketComparison from "./MarketComparison";

interface DashboardProps {
    data: any;
    onReset: () => void;
}

export default function Dashboard({ data, onReset }: DashboardProps) {
    const handleExport = () => {
        window.print();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Premium Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-analog-gold/10">
                <div className="flex items-center space-x-6">
                    <div className="p-4 bg-analog-gold/10 rounded-2xl border border-analog-gold/20 shadow-lg shadow-analog-gold/5">
                        <LayoutDashboard className="w-8 h-8 text-analog-gold" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-analog-gold to-analog-gold/60 bg-clip-text text-transparent">
                            {data?.brand || "Equipo"} {data?.model || "Desconocido"}
                        </h2>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className="px-2 py-0.5 bg-analog-gold/10 text-analog-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded">Certificado Oficial</span>
                            <p className="text-analog-gold/40 font-mono text-xs uppercase tracking-tighter">ID: AA-{Math.floor(Math.random() * 900000 + 100000)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-3 px-6 py-3 bg-analog-gold text-gunmetal-grey font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-xl shadow-analog-gold/10"
                    >
                        <Download className="w-4 h-4" />
                        <span>Exportar Peritaje</span>
                    </button>
                    <button
                        onClick={onReset}
                        className="p-3 border border-analog-gold/20 rounded-xl hover:bg-analog-gold/10 transition-all text-analog-gold/60"
                        title="Nueva Identificación"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Grid: 8/4 Split */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-12">
                    {/* Executive Summary Section */}
                    <div className="rounded-3xl overflow-hidden border border-analog-gold/5 bg-black/10">
                        <ExecutiveSummary data={data} />
                    </div>

                    {/* Specs Table Section */}
                    <div className="space-y-6">
                        <SpecsTable specs={data?.specs} />
                    </div>

                    {/* Topology Section */}
                    <div className="space-y-6">
                        <InternalTopology topology={data?.topology} />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="lg:w-96 space-y-10">
                    <ExpertVoice brand={data?.brand} insights={data?.expertInsights} />
                    <MarketComparison marketData={data?.marketData} />

                    <div className="p-6 border border-analog-gold/5 rounded-2xl bg-black/10 italic text-[10px] text-analog-gold/30 text-center leading-relaxed">
                        * Este análisis ha sido generado mediante inteligencia artificial basada en perfiles históricos de ingeniería de audio. Su fin es informativo y de preservación digital.
                    </div>
                </aside>
            </div>
        </div>
    );
}
