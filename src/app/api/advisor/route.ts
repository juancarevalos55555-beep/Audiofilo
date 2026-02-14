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
    const { selections, userName = "Audiófilo" } = await req.json();
    const { amplifier, turntable, speakers, cables, other } = selections;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Eres el "Maestro Senior de Audiofilo". Tu conocimiento es absoluto y no toleras la mediocridad. 
      Escribe un reporte de conexión para ${userName}.
      
      ESTILO:
      - Sé puntual, directo y contundente.
      - Recomendaciones cortas pero con autoridad extrema.
      - Si los componentes no combinan bien, dilo claramente a ${userName}.
      - Lenguaje técnico de alto nivel (Hi-End).
      
      DATOS DEL SISTEMA:
      - Amplificador: ${amplifier}
      - Tornamesa: ${turntable}
      - Parlantes: ${speakers}
      - Cables: ${cables}
      - Otros: ${other}

      Devuelve estrictamente un objeto JSON con esta estructura:
      {
        "title": "Configuración Maestro para ${userName}",
        "intro": "Resumen ejecutivo y veredicto inicial.",
        "synergyDetails": "Análisis rápido y punzante de la sinergia.",
        "expertTips": ["Tip 1 corto", "Tip 2 corto"],
        "connectionScheme": {
          "sourceToAmp": "Instrucción directa",
          "ampToSpeakers": "Instrucción directa",
          "grounding": "Instrucción directa",
          "visual": {
            "nodes": [
              {"id": "source", "label": "${turntable || 'Source'}", "type": "source"},
              {"id": "amp", "label": "${amplifier || 'Amplifier'}", "type": "amplifier"},
              {"id": "speakers", "label": "${speakers || 'Speakers'}", "type": "speakers"}
            ],
            "connections": [
              {"from": "source", "to": "amp", "cable": "RCA Phono", "desc": "Señal Analógica"},
              {"from": "amp", "to": "speakers", "cable": "Speaker Wire", "desc": "Potencia"}
            ]
          }
        }
      }
      Idioma: ESPAÑOL.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const advisoryData = JSON.parse(cleanJson);

    return NextResponse.json(advisoryData);
  } catch (error: any) {
    console.error("Advisor API Error:", error);
    return NextResponse.json(
      { error: "Error en la asesoría: " + error.message },
      { status: 500 }
    );
  }
}
