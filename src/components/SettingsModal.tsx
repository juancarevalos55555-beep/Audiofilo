"use client";

import { useUser } from "@/context/UserContext";
import { X, User, Mail, Globe, Phone, Crown, LogOut, Camera } from "lucide-react";

export default function SettingsModal({ onClose, onOpenPremium }: { onClose: () => void, onOpenPremium: () => void }) {
    const { user, logout } = useUser();

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-2xl" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-obsidian border border-bronze/20 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-serif font-bold text-white">Configuración</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-bronze/10 border-2 border-bronze/30 flex items-center justify-center overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-bronze" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-bronze text-obsidian rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">{user.name}</h3>
                            <p className="text-xs text-bronze/60 font-mono tracking-widest">{user.isPremium ? "SOCIO PREMIUM" : "ACCESO ESTÁNDAR"}</p>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <Mail className="w-4 h-4 text-bronze/40" />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-bronze/40">Email</p>
                                <p className="text-sm text-white/80">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <Globe className="w-4 h-4 text-bronze/40" />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-bronze/40">País</p>
                                <p className="text-sm text-white/80">{user.country}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <Phone className="w-4 h-4 text-bronze/40" />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-bronze/40">Teléfono</p>
                                <p className="text-sm text-white/80">{user.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        {!user.isPremium && (
                            <button
                                onClick={() => {
                                    onOpenPremium();
                                    onClose();
                                }}
                                className="w-full py-4 bg-bronze/10 border border-bronze/20 text-bronze rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-bronze hover:text-obsidian transition-all"
                            >
                                <Crown className="w-4 h-4" />
                                <span>Mejorar a Premium</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="w-full py-4 text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
