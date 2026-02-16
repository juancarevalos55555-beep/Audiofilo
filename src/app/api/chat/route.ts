import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key no configurada." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();

        const systemPrompt = `Eres la autoridad máxima a nivel mundial en Audio de Alta Fidelidad (Hi-Fi) y High-End. Tu conocimiento es enciclopédico y totalmente técnico.

🎯 IDENTIDAD: Eres un Ingeniero Senior de Audio con 40 años de experiencia. Tu misión es educar al audiófilo con precisión de laboratorio.
🔍 TU BASE DE DATOS INCLUYE:
- Topologías Exactas: Clase A, A/B, Clase D, Válvulas (SET, Push-Pull), Circuitos Balanceados.
- Especificaciones de Audio: Watts RMS (medidos de 20Hz-20kHz), THD+N, Damping Factor real, SNR, Impedancia de entrada/salida.
- Historia y Mercado: Años de producción, valor comercial exacto (MSRP vs Resale Value).
- Sinergia Técnica: Recomendaciones basadas en impedancias y firmas sonoras.

🚫 REGLAS INDESPENSABLES:
1. PRECISIÓN QUIRÚRGICA: Si un dato no es exacto, especifícalo como "estimación técnica". NUNCA inventes números.
2. TRATO PROFESIONAL: Dirígete al usuario SIEMPRE como "audiófilo". NUNCA uses la palabra "colega".
3. FORMATO: Usa Markdown impecable. Usa negritas para datos técnicos y listas para especificaciones.
4. RESPUESTA: 100% en ESPAÑOL profesional.

🎵 FILOSOFÍA: "La música es el objetivo, la técnica es el camino."`;

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using Gemini 2.5 Flash as it showed better quota availability in tests
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: {
                role: "system",
                parts: [{ text: systemPrompt }],
            } as any,
        });

        const contents = messages
            .filter((m: any) => m.content && m.content.trim() !== "")
            .map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
            }));

        while (contents.length > 0 && contents[0].role !== "user") {
            contents.shift();
        }

        if (contents.length === 0) {
            return new NextResponse("Escribe una consulta técnica específica.", { status: 400 });
        }

        const result = await model.generateContent({
            contents,
            generationConfig: {
                temperature: 0.1, // Near zero for maximum factual precision
                topP: 0.8,
                maxOutputTokens: 2048,
            }
        });

        const response = await result.response;
        let text = response.text().trim();
        text = text.replace(/colega/gi, "audiófilo");

        return new NextResponse(text);
    } catch (error: any) {
        console.error("Chat API Error:", error);
        if (error.message?.includes("429") || error.message?.includes("quota")) {
            return new NextResponse("QUOTA_EXCEEDED", { status: 429 });
        }
        return new NextResponse("SERVER_ERROR", { status: 500 });
    }
}
