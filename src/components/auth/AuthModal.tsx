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
            <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-obsidian border border-bronze/20 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze/50 to-transparent"></div>

                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Bienvenido a <span className="text-bronze italic">Fónica</span></h2>
                            <p className="text-bronze/60 text-sm font-display">Inteligencia Artificial para Audiofilos</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-bronze/40 ml-4">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bronze/30" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-bronze/40 transition-all font-display"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-bronze/40 ml-4">Tu Correo</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bronze/30" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@ejemplo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-bronze/40 transition-all font-display"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Country Select */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-bronze/40 ml-4">País</label>
                                    <div className="relative">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bronze/30" />
                                        <select
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white appearance-none focus:outline-none focus:border-bronze/40 transition-all font-display"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.country} value={c.country} className="bg-obsidian">{c.flag} {c.country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-bronze/40 ml-4">Celular</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={formData.countryCode}
                                            onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                                            className="w-20 bg-white/5 border border-white/10 rounded-2xl py-4 px-2 text-white text-xs text-center focus:outline-none focus:border-bronze/40 transition-all"
                                        >
                                            {countryCodes.map(c => (
                                                <option key={c.code} value={c.code} className="bg-obsidian">{c.code}</option>
                                            ))}
                                        </select>
                                        <div className="relative flex-1">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bronze/30" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="Número"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-bronze/40 transition-all font-display"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-bronze text-obsidian rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-white hover:shadow-2xl hover:shadow-bronze/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Inscribiendo...</span>
                                </>
                            ) : (
                                <>
                                    <span>Comenzar Experiencia</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                    <p className="text-[9px] text-bronze/30 uppercase tracking-[0.4em] font-mono">Fónica // Audiofilo Experiencia</p>
                </div>
            </div>
        </div>
    );
}
