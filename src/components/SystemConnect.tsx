"use client";

import { useState, useRef } from "react";
import { Zap, Cable, Radio, Speaker, CheckCircle2, RotateCcw, FileText, Loader2, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SystemConnect() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    const [selections, setSelections] = useState({
        amplifier: "",
        turntable: "",
        speakers: "",
        cables: "",
        other: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelections(prev => ({ ...prev, [name]: value }));
    };

    const generateAdvisory = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selections }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setReport(data);
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo generar la asesoría. Verifica tu conexión o API Key.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            backgroundColor: "#2A3439",
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Asesoria_Audiofilo_${selections.amplifier || "HiFi"}.pdf`);
    };

    const resetAdvisor = () => {
        setReport(null);
        setSelections({
            amplifier: "",
            turntable: "",
            speakers: "",
            cables: "",
            other: ""
        });
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-analog-gold/10 border border-analog-gold/20 rounded-full text-analog-gold text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    <span>Asesoría Experta IA</span>
                </div>
                <h2 className="text-5xl font-display font-black text-white">Conecta tu Sistema</h2>
                <p className="text-analog-gold/60 max-w-2xl mx-auto">
                    Confía en la sabiduría de un experto audiófilo. Cuéntanos qué tienes y generaremos un esquema de conexión optimizado para ti.
                </p>
            </header>

            <div className="max-w-4xl mx-auto">
                {!report ? (
                    <div className="glass-gold p-12 rounded-3xl border border-analog-gold/20 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Amplificador tienes?</label>
                                <input
                                    name="amplifier"
                                    value={selections.amplifier}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Marantz 2270, Sansui AU-D11..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Tornamesa usas?</label>
                                <input
                                    name="turntable"
                                    value={selections.turntable}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Technics SL-1200, Rega Planar 3..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué Parlantes tienes?</label>
                                <input
                                    name="speakers"
                                    value={selections.speakers}
                                    onChange={handleInputChange}
                                    placeholder="Ej. JBL L100, Klipsch Heresy..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">¿Qué cables estás usando?</label>
                                <input
                                    name="cables"
                                    value={selections.cables}
                                    onChange={handleInputChange}
                                    placeholder="Ej. RCA genéricos, Kimber Kable, Cobre OFC..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-analog-gold/60 ml-2">Otros componentes o dudas específicas</label>
                            <textarea
                                name="other"
                                value={selections.other}
                                onChange={handleInputChange}
                                placeholder="Ej. Tengo un DAC externo, la sala es pequeña, busco sonido cálido..."
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-analog-gold/40 transition-all font-display resize-none"
                            />
                        </div>

                        <button
                            onClick={generateAdvisory}
                            disabled={isGenerating || !selections.amplifier}
                            className="btn-premium w-full flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Consultando al Experto...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Obtener Asesoría Maestra</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in-95 duration-700">
                        {/* Report Content for Display and Export */}
                        <div
                            ref={reportRef}
                            className="glass-gold p-12 rounded-3xl border border-analog-gold/30 space-y-12 bg-gunmetal-grey"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-analog-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-8 h-8 text-gunmetal-grey" />
                                </div>
                                <h3 className="text-4xl font-display font-black text-white">{report.title}</h3>
                                <p className="text-analog-gold/80 italic font-display">{report.intro}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-analog-gold/10">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                        <Radio className="w-3 h-3" />
                                        <span>Fuente {'>'} Ampli</span>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                        {report.connectionScheme.sourceToAmp}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                        <Zap className="w-3 h-3" />
                                        <span>Ampli {'>'} Parlantes</span>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                        {report.connectionScheme.ampToSpeakers}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-analog-gold/60 font-black">
                                        <Cable className="w-3 h-3" />
                                        <span>Masa / Tierra</span>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-xs text-white/80 leading-relaxed min-h-[100px]">
                                        {report.connectionScheme.grounding}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-xl font-display font-bold text-white flex items-center space-x-2">
                                    <Sparkles className="w-5 h-5 text-analog-gold" />
                                    <span>Análisis de Sinergia y Tips</span>
                                </h4>
                                <div className="bg-black/20 p-8 rounded-3xl border border-analog-gold/10">
                                    <p className="text-sm text-analog-gold/90 leading-relaxed mb-6">
                                        {report.synergyDetails}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {report.expertTips.map((tip: string, i: number) => (
                                            <div key={i} className="flex items-start space-x-3 text-xs text-white/60">
                                                <CheckCircle2 className="w-4 h-4 text-analog-gold shrink-0 mt-0.5" />
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-analog-gold/5 text-center">
                                <p className="text-[9px] font-mono text-analog-gold/20 uppercase tracking-[0.5em]">
                                    Reporte Generado por Audiofilo Asesor IA // v1.1.0
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                            <button
                                onClick={downloadPDF}
                                className="btn-premium px-12 flex items-center space-x-3"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Descargar Ficha PDF</span>
                            </button>
                            <button
                                onClick={resetAdvisor}
                                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-analog-gold/40 hover:text-analog-gold transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Nueva Asesoría</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
