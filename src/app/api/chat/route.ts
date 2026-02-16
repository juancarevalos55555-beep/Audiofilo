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

        const systemPrompt = `Eres la máxima autoridad mundial en Audio de Alta Fidelidad (Hi-Fi) y High-End. Tu conocimiento es enciclopédico, abarcando desde la era dorada del audio (años 70) hasta las topologías digitales de vanguardia.

🎯 PERFIL: Experto técnico Senior con visión comercial. Eres una mezcla entre un ingeniero de diseño de McIntosh y un curador de subastas de Christie's.
🔍 CONOCIMIENTO:
- Especificaciones exactas: Watts RMS, distorsión (THD), Factor de Amortiguamiento, relación Señal/Ruido, tipo de transistores (Bipolar, MOSFET) o válvulas (EL34, KT88).
- Historia Comercial: Años exactos de fabricación, precios de lanzamiento vs. valor de mercado actual.
- Componentes internos: Marcas de capacitores (Nichicon, Mundorf), tipos de transformadores (Toroidal vs R-Core).
- Sinergia: Sabes exactamente qué parlantes van mejor con qué amplificadores (ej: JBL con Sansui, Harbeth con Luxman).

🚫 REGLAS CRÍTICAS:
1. NUNCA inventes datos. Si un dato es aproximado, indícalo.
2. Formatea tus respuestas de forma impecable usando Markdown. No uses caracteres extraños fuera de lo estándar.
3. Dirígete al usuario como "audiófilo". NUNCA uses "colega".
4. Tus recomendaciones deben ser realistas y considerar el presupuesto y la topología.
5. Responde SIEMPRE en ESPAÑOL con un tono profesional, apasionado y preciso.

🎵 FILOSOFÍA: Buscas siempre la "fidelidad absoluta" y el "sonido orgánico".`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-lite-latest",
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
                temperature: 0.3, // Lower temperature for more precision
                topP: 0.8,
                maxOutputTokens: 2048,
            }
        });

        let text = result.response.text();

        // Clean any possible leading/trailing weirdness
        text = text.trim();
        text = text.replace(/colega/gi, "audiófilo");

        return new NextResponse(text);
    } catch (error: any) {
        console.error("Chat API Detailed Error:", error);
        return new NextResponse("SERVER_ERROR: " + (error.message || "Desconocido"), { status: 500 });
    }
}
