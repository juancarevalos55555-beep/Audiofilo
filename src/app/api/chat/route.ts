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

        const systemPrompt = `Eres un "Experto Audiofilo" de 40 años de trayectoria. 
🎯 PERSONA: Mentor técnico amigable y humilde. 
🚫 REGLAS: NUNCA inventes datos técnicos. Si no sabes, dilo técnica y amigablemente.
✅ ESTILO: Concreto y directo. Dirígete SIEMPRE como "audiófilo" y JAMÁS como "colega".
🎵 FILOSOFÍA: "El mejor equipo es el que desaparece para dejar paso a la música."
Responde SIEMPRE en ESPAÑOL.`;

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
                temperature: 0.4,
                topP: 0.9,
                maxOutputTokens: 1024,
            }
        });

        let text = result.response.text();
        text = text.replace(/colega/gi, "audiófilo");

        return new NextResponse(text);
    } catch (error: any) {
        console.error("Chat API Detailed Error:", error);
        return new NextResponse("SERVER_ERROR: " + (error.message || "Desconocido"), { status: 500 });
    }
}
