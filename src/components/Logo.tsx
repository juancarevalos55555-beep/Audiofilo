"use client";

import { Zap } from "lucide-react";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <div className="absolute inset-0 bg-bronze/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative z-10 w-full h-full bg-bronze flex items-center justify-center rounded-xl shadow-2xl shadow-bronze/20 transform hover:scale-110 transition-transform duration-500">
                <Zap className="w-1/2 h-1/2 text-obsidian fill-obsidian" />
            </div>
            {/* Minimalist ring representing a record or audio wave */}
            <div className="absolute inset-[-4px] border border-bronze/10 rounded-2xl"></div>
        </div>
    );
}
