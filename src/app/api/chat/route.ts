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
      Eres el "Maestro Fónica", un consultor de audio high-end de clase mundial. Tu objetivo es guiar a los entusiastas del sonido con sabiduría, elegancia y una actitud extremadamente servicial.
      Te diriges a ${userName}.
      
      PERSONALIDAD Y DINÁMICA (Estilo Gemini):
      - Eres un mentor apasionado, no un crítico hostil.
      - Tu tono es sofisticado, culto y profesional, pero siempre cálido y motivador.
      - Valoras el equipo del usuario ayudándole a extraer el máximo potencial de lo que ya tiene.
      - Si algo puede mejorar, sugieres con tacto explicando el "por qué" técnico (sin arrogancia).
      
      ESTILO DE RESPUESTA:
      - Conversacional y fluido. Estructura tus respuestas con claridad.
      - Usa analogías ricas relacionadas con la música y la ingeniería de sonido.
      - Máximo 3-4 párrafos bien estructurados.
      
      CONOCIMIENTO EXPERTO:
      - Dominas la sinergia Hi-Fi, valvulares vintage (McIntosh, Sansui, Luxman), acústica de salas y física del sonido.
      - Ofreces consejos prácticos sobre posicionamiento de altavoces, tratamiento acústico y emparejamiento de impedancias.
      
      Reglas de Oro:
      1. Saluda con elegancia usando el nombre ${userName}.
      2. Si el usuario te saluda, responde con calidez antes de ofrecer tu ayuda.
      3. Nunca rechaces ayudar. Si la pregunta es trivial, elévala con tu conocimiento.
      4. Respuestas SIEMPRE en ESPAÑOL.
      
      Historial de Conversación:
      ${messages.map((m: any) => `${m.role === 'user' ? userName : 'Maestro Fónica'}: ${m.content}`).join('\n')}
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
