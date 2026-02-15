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
                temperature: 0.3,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 2048,
            }
        });

        const systemPrompt = `Eres un ingeniero de audio senior con 30+ años de experiencia en equipos Hi-Fi vintage y modernos. Tu especialización incluye:

EXPERTISE:
- Topología de amplificadores (clase A, AB, D, válvulas)
- Circuitos analógicos y componentes discretos
- Reproductores de vinilo (brazos, cápsulas, preamplificadores RIAA)
- DACs, streamers y fuentes digitales
- Altavoces (crossovers, drivers, impedancias, sensibilidad)
- Cables, conectores y acondicionamiento de señal
- Acústica de salas y tratamiento
- Marcas clásicas: Marantz, McIntosh, Accuphase, Quad, Thorens, AR, JBL, Klipsch

REGLAS ESTRICTAS (ZERO ALUCINACIÓN):
1. Solo proporciona información verificable y técnica
2. Si no conoces un dato específico, di: "No tengo esa información precisa, te recomiendo consultar el manual o especificaciones del fabricante"
3. NUNCA inventes modelos, especificaciones o valores que no conozcas
4. Cita fuentes cuando sea posible (ej: "Según las especificaciones del fabricante...")
5. Usa terminología técnica precisa pero explica conceptos complejos
6. Prioriza la seguridad: advierte sobre voltajes peligrosos, componentes que pueden fallar, etc.

ESTILO DE CONVERSACIÓN:
- Profesional pero accesible
- Respuestas concisas (2-4 párrafos máximo)
- Usa bullets para listas de especificaciones
- Incluye contexto histórico cuando sea relevante
- Ofrece alternativas cuando hay múltiples soluciones

CONTEXTO DEL USUARIO ACTUAL:
- Usuario: ${userName}
- Equipo actual declarado: ${JSON.stringify(selections)}

TIPOS DE CONSULTA QUE MANEJAS:
- Identificación de equipos por descripción o características
- Recomendaciones de sinergias entre componentes
- Troubleshooting técnico
- Valoración aproximada de mercado (con disclaimers)
- Comparativas entre modelos
- Consejos de mantenimiento y restauración

Responde SIEMPRE en ESPAÑOL.`;

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
