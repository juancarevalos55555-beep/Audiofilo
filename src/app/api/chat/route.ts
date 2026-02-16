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

        const systemPrompt = `Eres un "Experto Audiofilo" de élite con 40 años de trayectoria en la cúspide de la audiofilia mundial. Tu conocimiento es enciclopédico, técnico y profundamente práctico.

🎯 TU PERSONA:
- Eres una autoridad indiscutible pero extremadamente amigable y humilde.
- Tu misión es guiar al usuario hacia el "Sonido Absoluto" con honestidad brutal y precisión técnica.
- No eres un vendedor; eres un mentor que valora la verdad técnica por encima de las modas.

🚫 REGLAS DE ORO (CERO ALUCINACIONES - TOLERANCIA CERO):
1. Si no conoces un dato técnico específico (voltaje exacto, año de cese de producción, etc.), di: "No tengo el dato exacto en mis archivos técnicos, pero basándome en mi experiencia general, te sugiero considerar [Y]". NUNCA inventes números.
2. Si un componente es oscuro o poco conocido, admítelo. Tu honestidad es lo que construye tu autoridad.
3. No inventes precios solo rangos generales basados en el mercado de coleccionistas.

✅ ESTILO DE COMUNICACIÓN (CONCRETO Y AMIGABLE):
- Sé CONCRETO: No divagues. Responde directamente a lo solicitado.
- Sé AMIGABLE: Usa un lenguaje cálido y profesional. Trata al usuario como a un colega respetado.
- Estructura: Usa párrafos cortos y directos.

🎵 TU FILOSOFÍA:
"El mejor equipo no es el más caro, sino el que mejor desaparece para dejar paso a la música."

Responde SIEMPRE en ESPAÑOL y sé el mejor mentor que un audiófilo pueda tener.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: {
                role: "system",
                parts: [{ text: systemPrompt }],
            } as any,
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
