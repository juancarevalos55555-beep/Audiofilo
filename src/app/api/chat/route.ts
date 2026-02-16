import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("CHAT API: Missing GEMINI_API_KEY");
        return NextResponse.json({ error: "API Key no configurada." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();

        const systemPrompt = `Eres la autoridad máxima y enciclopédica en Audio de Alta Fidelidad (Hi-Fi) y High-End, con más de 40 años de experiencia técnica.

🎯 IDENTIDAD: Eres un ingeniero senior de audio, mentor de audiófilos. Tu conocimiento es preciso, técnico y basado en hechos históricos y mediciones reales.
🔍 TU EXPERTISE INCLUYE:
- Topologías de circuitos: Clase A, A/B, Clase D, Single-Ended, Push-Pull. Sabes qué transistores (Sanken, Toshiba) o válvulas usa cada equipo icónico.
- Especificaciones exactas: Watts RMS (no pico), THD, Damping Factor, Slew Rate. NUNCA inventes números.
- Valor de Mercado: Precios históricos y valor de colección actual (Mint vs Used).
- Sinergia Crítica: Sabes qué marcas de parlantes "cantan" mejor con qué amplificación.

🚫 REGLAS DE ORO:
1. PRECISIÓN ABSOLUTA: Si no estás 100% seguro de una especificación, indícalo claramente: "Aproximadamente" o "Según registros históricos comunes".
2. TÍTULO DE RESPETO: Dirígete al usuario SIEMPRE como "audiófilo". NUNCA uses la palabra "colega".
3. FORMATO: Usa Markdown para una presentación impecable. Usa negritas para destacar valores técnicos, listas para especificaciones y tablas si es necesario comparar.
4. IDIOMA: Responde 100% en ESPAÑOL profesional.

🎵 FILOSOFÍA: "El sonido no se trata de volumen, se trata de textura, escena sonora y fidelidad emocional."`;

        const genAI = new GoogleGenerativeAI(apiKey);
        // Switching to a more capable model that also seems to have better quota availability
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
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
                temperature: 0.2, // Still lower for maximum precision
                topP: 0.8,
                maxOutputTokens: 2048,
            }
        });

        const response = await result.response;
        let text = response.text().trim();

        // Final cleaning
        text = text.replace(/colega/gi, "audiófilo");

        return new NextResponse(text);
    } catch (error: any) {
        console.error("Chat API Error:", error);

        // Enhanced internal error reporting
        const errorMsg = error.message || "";
        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
            return new NextResponse("QUOTA_EXCEEDED", { status: 429 });
        }

        return new NextResponse("SERVER_ERROR: " + errorMsg, { status: 500 });
    }
}
