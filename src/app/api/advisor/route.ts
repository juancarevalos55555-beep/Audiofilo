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
        const { selections } = await req.json();
        const { amplifier, turntable, speakers, cables, other } = selections;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      Actúa como un experto mundial en audio de alta fidelidad (Hi-Fi) y vintage. 
      Un usuario quiere conectar su sistema y necesita tu asesoría experta.
      
      DATOS DEL SISTEMA:
      - Amplificador: ${amplifier || "No especificado"}
      - Tornamesa: ${turntable || "No especificada"}
      - Parlantes: ${speakers || "No especificados"}
      - Cables: ${cables || "No especificados"}
      - Otros componentes: ${other || "Ninguno"}

      INSTRUCCIONES:
      1. Genera un reporte detallado de cómo conectar este sistema.
      2. Da consejos de sinergia entre los componentes mencionados.
      3. Si falta algún componente crítico o sugieres una mejora en cables, menciónalo.
      4. Mantén un tono profesional, apasionado y experto.
      
      Devuelve estrictamente un objeto JSON con la siguiente estructura:
      {
        "title": "Título del Reporte Personalizado",
        "intro": "Resumen de la configuración",
        "steps": [
          {"step": "Nombre del paso", "description": "Detalle técnico de conexión"}
        ],
        "synergyDetails": "Análisis profundo de la sinergia entre los equipos",
        "expertTips": ["Consejo 1", "Consejo 2", "Consejo 3"],
        "connectionScheme": {
          "sourceToAmp": "Instrucción de cableado fuente-ampli",
          "ampToSpeakers": "Instrucción de cableado ampli-parlantes",
          "grounding": "Instrucción sobre tierra/masa (si aplica)"
        }
      }
      Toda la información debe estar en ESPAÑOL.
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
