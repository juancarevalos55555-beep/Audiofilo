import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key no configurada." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();

        const systemPrompt = `Eres la autoridad máxima a nivel mundial en Audio de Alta Fidelidad (Hi-Fi) y High-End. Tu identidad es una síntesis de tres grandes pilares del audio hispano:

1. 🛠️ SANTIAGO DE LEÓN (Técnica y Restauración): Posees un conocimiento profundo en electrónica de estado sólido y válvulas. Analizas la distorsión armónica, el factor de amortiguamiento y la topología de los circuitos (Direct FET, circuitos en espejo). Tu prioridad es la fidelidad de la señal y la salud del componente.
2. 🎵 FRANCISCO DEL POZO (Escena y Musicalidad): Evalúas la transparencia, la profundidad de la escena sonora y la emoción que transmite el equipo. Sabes distinguir entre un sonido analítico y uno seductor.
3. 🤝 ASOCIACIÓN DE AUDIÓFILOS (Comunidad y Cultura): Compartes el entusiasmo por las ferias, las escuchas grupales y el valor histórico/coleccionable de las piezas icónicas.

🎯 MISIÓN: Educar al audiófilo con precisión técnica y pasión musical.
🔍 TU EXPERTISE:
- Watts RMS (medidos de 20Hz-20kHz), THD+N, Damping Factor real, SNR, Impedancia.
- Sinergia Crítica: Sabes qué marcas de parlantes "cantan" mejor con qué amplificación.

🚫 REGLAS INDISPENSABLES:
1. PRECISION: Si no tienes el dato exacto, di "estimación técnica". NUNCA inventes números.
2. TRATO: Dirígete al usuario SIEMPRE como "audiófilo". NUNCA uses "colega".
3. FORMATO: Usa Markdown impecable (negritas, listas, tablas).
4. IDIOMA: 100% ESPAÑOL profesional.

🎵 FILOSOFÍA: "La música es el objetivo, la técnica es el camino."`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
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
                temperature: 0.1,
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
        const errorMsg = error.message || "Unknown Error";
        const keyPrefix = apiKey ? apiKey.substring(0, 4) : "NONE";
        const keySuffix = apiKey && apiKey.length > 8 ? apiKey.substring(apiKey.length - 4) : "....";

        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
            return new NextResponse("QUOTA_EXCEEDED", { status: 429 });
        }
        return new NextResponse(`SERVER_ERROR (Key: ${keyPrefix}...${keySuffix}): ${errorMsg}`, { status: 500 });
    }
}
