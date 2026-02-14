"use client";

import { useCallback, useState } from "react";
import { Upload, FileImage, ShieldCheck, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FileUploadProps {
    onUpload: (file: File) => void;
    isAnalyzing: boolean;
}

export default function FileUpload({ onUpload, isAnalyzing }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    }, [onUpload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "relative group cursor-pointer rounded-[32px] p-1 transition-all duration-700",
                isDragging
                    ? "bg-bronze/20 scale-[1.03] rotate-1"
                    : "bg-obsidian/50 hover:border-bronze/30"
            )}
        >
            <div className={cn(
                "p-12 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center space-y-6 text-center transition-all duration-500",
                isDragging ? "border-bronze" : "border-white/5 group-hover:border-bronze/20"
            )}>
                {isAnalyzing ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="relative">
                            <div className="w-20 h-20 border-t-2 border-bronze rounded-full animate-spin" />
                            <Search className="absolute inset-0 m-auto w-6 h-6 text-bronze" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-serif font-black tracking-widest uppercase text-white">Escaneando Circuitos</p>
                            <p className="text-bronze/40 text-[10px] tracking-[0.3em] font-mono">Buscando patrones en archivos históricos</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-6 bg-bronze/5 rounded-full group-hover:scale-110 transition-transform duration-500 animate-float">
                            <Upload className="w-10 h-10 text-bronze" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-bold text-white group-hover:text-bronze transition-colors">Sube una foto</h3>
                            <p className="text-bronze/40 text-xs max-w-xs mx-auto leading-relaxed font-display">
                                Suelta una imagen aquí o haz clic para cargar. <span className="text-white">La IA identificará marca, modelo y especificaciones.</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 pt-4 text-[9px] font-black uppercase tracking-[0.2em] text-bronze/30">
                            <span className="flex items-center space-x-1">
                                <FileImage className="w-3 h-3" />
                                <span>Formatos RAW/HD</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Privacidad SSL</span>
                            </span>
                        </div>
                    </>
                )}

                {/* Hidden input moved to bottom and given full-surface coverage */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    disabled={isAnalyzing}
                />
            </div>
        </div>
    );
}
