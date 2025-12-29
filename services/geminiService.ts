import { GoogleGenAI } from "@google/genai";

// Previene el crash si la API KEY no está definida al iniciar
const apiKey = process.env.API_KEY || "temp_key_placeholder";
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateAIResponse = async (prompt: string, context: string): Promise<string> => {
  // Verificación en tiempo de ejecución
  if (!process.env.API_KEY || process.env.API_KEY.includes("placeholder")) {
    return "⚠️ Sistema: No se detecta la API Key. Configura la variable 'API_KEY' en Vercel con tu clave de Google AI Studio.";
  }

  try {
    const model = 'gemini-2.5-flash-latest'; // Usamos flash para velocidad en chat
    const response = await ai.models.generateContent({
      model: model,
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