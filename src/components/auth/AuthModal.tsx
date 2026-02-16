"use client";

import { useState } from "react";
import { X, Mail, User, Globe, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

const countryCodes = [
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+34", country: "España", flag: "🇪🇸" },
    { code: "+52", country: "México", flag: "🇲🇽" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+51", country: "Perú", flag: "🇵🇪" },
];

export default function AuthModal({ onClose }: { onClose: () => void }) {
    const { login } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: "Colombia",
        phone: "",
        countryCode: "+57"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));

        login({
            name: formData.name,
            email: formData.email,
            country: formData.country,
            phone: `${formData.countryCode} ${formData.phone}`,
            isPremium: false
        });

        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-[#2a2a2a] rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                {/* Decorative Top Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-netflix-red/40 to-transparent"></div>

                <div className="p-12 space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase whitespace-nowrap">
                                Bienvenido a <span className="text-netflix-red tracking-tighter">Fónica</span>
                            </h2>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">Inteligencia Artificial para Audiofilos</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Nombre Completo</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white/20" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Tu Correo</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-white/20" />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@ejemplo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Country Select */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">País</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                                            <Globe className="w-4 h-4 text-white/20" />
                                        </div>
                                        <select
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-white appearance-none focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner cursor-pointer"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.country} value={c.country} className="bg-[#0f0f0f]">{c.flag} {c.country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-5">Celular</label>
                                    <div className="flex space-x-3">
                                        <select
                                            value={formData.countryCode}
                                            onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                                            className="w-24 bg-[#1a1a1a] border border-white/5 rounded-[20px] py-2 px-2 text-white text-xs text-center focus:outline-none focus:border-netflix-red/30 transition-all font-black cursor-pointer shadow-inner"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code} className="bg-[#0f0f0f]">{c.code}</option>
                                            ))}
                                        </select>
                                        <div className="relative flex-1">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                                <Phone className="w-3 h-3 text-white/20" />
                                            </div>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="Número"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-[#1a1a1a] border border-white/5 rounded-[20px] py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-netflix-red/30 transition-all font-bold text-sm shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-netflix-red text-white rounded-[32px] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center space-x-4 hover:bg-white hover:text-black hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Inscribiendo...</span>
                                </>
                            ) : (
                                <>
                                    <span>Comenzar Experiencia</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-8 bg-[#141414] border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.5em]">Fónica // Audiofilo Experiencia</p>
                </div>
            </div>
        </div>
    );
}
