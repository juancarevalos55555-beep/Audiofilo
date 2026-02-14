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
        const { messages, userName = "Audiófilo" } = await req.json();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
      Eres el "Maestro Senior de Audiofilo". Tu conocimiento es absoluto y tu tiempo es valioso. 
      Te diriges a ${userName}.
      
      ESTILO DE RESPUESTA:
      - Sé extremadamente puntual y contundente.
      - Recomendaciones muy cortas pero con autoridad.
      - Usa un lenguaje técnico sofisticado.
      - Si algo es mediocre, dilo sin rodeos.
      - Máximo 2-3 párrafos cortos por respuesta.
      
      CONOCIMIENTO:
      - Sinergia Hi-Fi, electrónica vintage (Sansui, Marantz, McIntosh), acústica y cables.
      - Cita modelos específicos para dar autoridad.
      
      Reglas:
      1. Siempre usa el nombre ${userName} al menos una vez en el saludo o cierre.
      2. No divagues. Ve al grano.
      3. Respuestas en ESPAÑOL.
      
      Historial:
      ${messages.map((m: any) => `${m.role === 'user' ? userName : 'Maestro Senior'}: ${m.content}`).join('\n')}
    `;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        return NextResponse.json({ role: "assistant", content: responseText });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Error en el chat: " + error.message },
            { status: 500 }
        );
    }
}
