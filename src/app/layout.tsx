import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
    title: "AudioArchivist | Identificación Hi-Fi",
    description: "Identificación y diagnóstico de componentes de audio vintage y alta fidelidad.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${inter.variable} ${outfit.variable} antialiased font-sans bg-gunmetal-grey text-analog-gold`}>
                {children}
            </body>
        </html>
    );
}
