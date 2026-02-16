import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "API Key no configurada." },
            { status: 500 }
        );
    }

    try {
        const { messages, userName = "Audiófilo", selections = {} } = await req.json();

        const systemPrompt = `Eres un "Experto Audiofilo" de élite con 40 años de trayectoria. Tu conocimiento es enciclopédico, técnico y profundamente práctico. 🎯 TU PERSONA: - Autoridad indiscutible pero amigable. - Tu misión es guiar al usuario hacia el "Sonido Absoluto". ✅ ESTILO: CONCRETO y AMIGABLE. Responde SIEMPRE en ESPAÑOL. 🚫 REGLAS: Cero alucinaciones. Si no sabes algo, admítelo.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
        });

        // Format history for Gemini - MUST start with 'user'
        const contents = messages
            .filter((m: any) => m.content && m.content.trim() !== "")
            .map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
            }));

        // Gemini strict rule: History must start with a user message
        while (contents.length > 0 && contents[0].role !== "user") {
            contents.shift();
        }

        if (contents.length === 0) {
            return NextResponse.json({ role: "assistant", content: "Por favor, escribe una pregunta más específica." });
        }

        const result = await model.generateContent({
            contents,
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                maxOutputTokens: 1024,
            }
        });

        const response = await result.response;
        let text = "";
        try {
            text = response.text();
        } catch (e) {
            console.error("Error calling response.text():", e);
            const candidate = response.candidates?.[0];
            if (candidate?.finishReason === "SAFETY") {
                text = "Mi análisis técnico ha detectado contenido que no puedo procesar por políticas de seguridad. ¿Podrías reformular tu consulta?";
            } else {
                text = "He tenido un problema procesando tu consulta técnica. Por favor, intenta de nuevo.";
            }
        }

        if (!text || text.trim() === "") {
            text = "Mi sensor de respuesta está en silencio. Probemos con una pregunta sobre componentes técnicos específicos.";
        }

        return NextResponse.json({ role: "assistant", content: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({
            role: "assistant",
            content: "Error técnico: " + (error.message || "Interferencia en la señal.")
        });
    }
}
