import type { Metadata } from "next";
import { Inter, Outfit, Lora } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
    title: "Audiofilo Asesor | Tu Guía Hi-Fi",
    description: "La primera plataforma para audiófilos: especificaciones de componentes y asesoría técnica.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${inter.variable} ${outfit.variable} ${lora.variable} antialiased font-sans bg-gunmetal-grey text-analog-gold selection:bg-bronze selection:text-obsidian`}>
                <UserProvider>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
