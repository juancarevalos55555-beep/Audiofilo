import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key no configurada." }), { status: 500 });
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
            model: "gemini-1.5-flash-8b",
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
            return new Response("Escribe una consulta técnica específica.", { status: 400 });
        }

        const result = await model.generateContentStream({
            contents,
            generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                maxOutputTokens: 512,
            }
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        let text = chunk.text();
                        text = text.replace(/colega/gi, "audiófilo");
                        controller.enqueue(encoder.encode(text));
                    }
                } catch (e) {
                    console.error("Streaming error:", e);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Content-Type-Options": "nosniff"
            },
        });
    } catch (error: any) {
        return new Response("Error: " + error.message, { status: 500 });
    }
}
