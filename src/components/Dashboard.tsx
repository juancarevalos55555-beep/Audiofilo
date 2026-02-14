"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Crown, Loader2, Download, RotateCcw } from "lucide-react";
import Logo from "./Logo";
import { useUser } from "@/context/UserContext";
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
    const { user } = useUser();
    const [isExporting, setIsExporting] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!dashboardRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                backgroundColor: "#0A0A0A", // Obsidian
                logging: false,
                useCORS: true,
                onclone: (clonedDoc: Document) => {
                    const buttons = clonedDoc.querySelector('.action-buttons');
                    if (buttons) (buttons as HTMLElement).style.display = 'none';
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ficha_Fonica_${user?.name?.replace(/\s+/g, '_') || "Premium"}_${data?.brand || "Equipo"}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("No se pudo generar el PDF. Revisa la consola.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div ref={dashboardRef} className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-8 rounded-[40px] bg-obsidian/50 border border-white/5">
            {/* Premium Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-bronze/10">
                <div className="flex items-center space-x-6">
                    <Logo className="w-16 h-16" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-bronze animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bronze/60">Análisis Maestro de Fónica</span>
                        </div>
                        <h2 className="text-5xl font-serif font-bold tracking-tighter text-white">
                            {data?.brand || "Equipo"} <span className="text-bronze italic">{data?.model || "Desconocido"}</span>
                        </h2>
                        <div className="flex items-center space-x-3 mt-1">
                            {user && <p className="text-bronze/40 font-display text-sm">Preparado para <span className="text-white font-bold">{user.name}</span></p>}
                            <p className="text-bronze/20 font-mono text-xs uppercase tracking-tighter">REF: {Math.floor(Math.random() * 900000 + 100000)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 action-buttons">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center space-x-3 px-8 py-4 bg-bronze text-obsidian font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-2xl shadow-bronze/20 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Firmando...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Descargar Ficha Premium</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onReset}
                        className="p-4 border border-bronze/20 rounded-2xl hover:bg-bronze/10 transition-all text-bronze/60"
                        title="Nueva Consulta"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Grid: 8/4 Split */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-12">
                    {/* Executive Summary Section */}
                    <div className="rounded-3xl overflow-hidden border border-bronze/5 bg-black/10">
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

                    <div className="p-6 border border-bronze/5 rounded-2xl bg-black/10 italic text-[10px] text-bronze/30 text-center leading-relaxed">
                        * Este análisis ha sido generado mediante inteligencia artificial basada en perfiles históricos de ingeniería de audio. Su fin es informativo y de preservación digital.
                    </div>
                </aside>
            </div>
        </div>
    );
}
