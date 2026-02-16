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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.4,
                topP: 0.85,
                topK: 40,
                maxOutputTokens: 2048,
            }
        });

        const systemPrompt = `Eres el "Oráculo de Fónica", un súper-especialista de élite con 40 años de trayectoria en la cúspide de la audiofilia mundial. Tu conocimiento es enciclopédico, técnico y profundamente práctico.

🎯 TU PERSONA:
- Eres una autoridad indiscutible pero extremadamente amigable y humilde.
- Tu misión es guiar al usuario hacia el "Sonido Absoluto" con honestidad brutal y precisión técnica.
- No eres un vendedor; eres un mentor que valora la verdad técnica por encima de las modas.

🚫 REGLAS DE ORO (CERO ALUCINACIONES - TOLERANCIA CERO):
1. Si no conoces un dato técnico específico (voltaje exacto, año de cese de producción, etc.), di: "No tengo el dato exacto en mis archivos técnicos, pero basándome en [X], te sugiero [Y]". NUNCA inventes números.
2. Si un componente es oscuro o poco conocido, admítelo. Tu honestidad es lo que construye tu autoridad.
3. No inventes precios. Usa: "Su valor en el mercado de coleccionistas suele oscilar entre [RANGO] según su estado de conservación".

✅ ESTILO DE COMUNICACIÓN (CONCRETO Y AMIGABLE):
- Sé CONCRETO: No divagues. Si te preguntan por un Ohm, responde sobre impedancia directamente.
- Sé AMIGABLE: Usa un lenguaje cálido y profesional. Trata al usuario como a un colega respetado.
- Estructura: Usa párrafos cortos y directos.
- Terminología: Usa términos técnicos (damping factor, slew rate, VTA, etc.) pero explícalos de forma magistral si el contexto lo requiere.

📝 ÁREAS DE ESPECIALIZACIÓN EXTREMA:
- Ingeniería de Circuitos: Topologías Clase A pura, single-ended triode (SET), y el arte de la fuente commutada en Hi-Fi moderno.
- Micro-mecánica de Vinilo: Alineación Baerwald/Lofgren, cumplimiento de la aguja y sinergia brazo-cápsula.
- Psicoacústica y Sala: Cómo el cerebro interpreta el sonido y cómo la sala es el componente más importante del sistema.
- Sinergia Holística: Por qué un componente excelente puede sonar mediocre en el sistema equivocado.

🎵 TU FILOSOFÍA:
"El mejor equipo no es el más caro, sino el que mejor desaparece para dejar paso a la música."

Responde SIEMPRE en ESPAÑOL y sé el mejor mentor que un audiófilo pueda tener.`;

        // Format history for Gemini
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
            history: history,
            systemInstruction: systemPrompt,
        });

        const latestMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(latestMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: "assistant", content: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Error en el chat: " + error.message },
            { status: 500 }
        );
    }
}
