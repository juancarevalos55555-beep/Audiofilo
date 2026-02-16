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
                backgroundColor: "#050505", // Deep Netflix Black
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
        <div ref={dashboardRef} className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 p-8 md:p-12 rounded-lg bg-netflix-dark border border-netflix-border/50">
            {/* Premium Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-netflix-border/50">
                <div className="flex items-center space-x-8">
                    <Logo className="w-20 h-20" />
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Crown className="w-5 h-5 text-netflix-red" />
                            <span className="text-lg md:text-xl font-black uppercase tracking-[0.4em] text-white">
                                Informe Maestro de <span className="text-netflix-red underline decoration-netflix-red/30 underline-offset-8">Fónica</span>
                            </span>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight text-white uppercase">
                            {data?.brand || "Equipo"} <span className="text-netflix-red">{data?.model || "Desconocido"}</span>
                        </h2>
                        <div className="flex items-center space-x-4">
                            {user && <p className="text-netflix-muted font-medium text-sm">Consultor: <span className="text-white font-bold">{user.name}</span></p>}
                            <span className="text-netflix-border font-bold">•</span>
                            <p className="text-netflix-muted font-bold text-xs uppercase tracking-tighter">ID ANÁLISIS: {Math.floor(Math.random() * 900000 + 100000)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6 action-buttons">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center space-x-3 px-10 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Exportando...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Reporte HD</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onReset}
                        className="p-4 bg-netflix-hover/40 border border-white/20 rounded hover:bg-netflix-hover transition-all text-white"
                        title="Nueva Consulta"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Grid: 8/4 Split */}
            <div className="flex flex-col lg:flex-row gap-12 pt-4">
                <div className="flex-1 space-y-16">
                    {/* Executive Summary Section */}
                    <div className="rounded-lg overflow-hidden border border-netflix-border/50 bg-black/20">
                        <ExecutiveSummary data={data} />
                    </div>

                    {/* Specs Table Section */}
                    <div className="space-y-8">
                        <SpecsTable specs={data?.specs} />
                    </div>

                    {/* Topology Section */}
                    <div className="space-y-8">
                        <InternalTopology topology={data?.topology} />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="lg:w-[400px] space-y-12">
                    <div className="bg-netflix-dark/50 p-1 rounded-lg border border-netflix-border/30">
                        <ExpertVoice brand={data?.brand} insights={data?.expertInsights} />
                    </div>
                    <MarketComparison marketData={data?.marketData} />

                    <div className="p-8 border border-netflix-border/30 rounded-lg bg-black/20 font-bold text-[10px] text-netflix-muted uppercase tracking-widest text-center leading-loose">
                        * LA PRECISIÓN TÉCNICA ES NUESTRA PRIORIDAD. ESTE INFORME UTILIZA DATOS VERIFICADOS DE INGENIERÍA Y ARCHIVOS HISTÓRICOS.
                    </div>
                </aside>
            </div>
        </div>
    );
}
