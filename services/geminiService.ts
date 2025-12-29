import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIResponse = async (prompt: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: Eres Lobus IA, la inteligencia soberana de la Unión Lobus. 
      Hablas con elegancia, autoridad y un ligero misticismo futurista. Siempre respondes en español.
      Contexto del Usuario Actual: ${context}
      
      Consulta del Usuario: ${prompt}`,
    });

    return response.text || "Sistemas procesando... sin salida.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sentinel-X: Conexión Interrumpida. Verifica tu cuota o conexión.";
  }
};