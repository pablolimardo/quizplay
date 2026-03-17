import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { topic } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Falta configurar la variable GEMINI_API_KEY en Vercel o en tu .env.local" });
  }

  const prompt = `Actúa como un profesor experto en evaluación técnica. Necesito generar 10 preguntas de opción múltiple con 4 alternativas sobre el tema: "${topic}". Las preguntas deben ser para un perfil de nivel secundario en una Escuela Industrial / Educación Técnica.

El formato DEBE ser un ARRAY JSON ÚNICAMENTE, sin bloque de código markdown ni texto adicional. Estructura exacta requerida:
[
  {
    "id": 1,
    "topic": "Subtema Corto",
    "type": "theory",
    "question": "¿Cuál es la capital de Francia?",
    "options": ["Madrid", "París", "Roma", "Berlín"],
    "correct": 1,
    "explanation": "París es la capital histórica de Francia y su ciudad más poblada.",
    "timeLimit": 20,
    "points": 100
  }
]
Asegúrate de que 'correct' sea simplemente un número del 0 al 3 (indicando el índice correcto). No envuelvas el resultado en bloques de código triple comilla (\`\`\`), devuelve literalmente el corchete de apertura como primer caracter.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.7 
        }
      })
    });

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Respuesta vacía de Gemini");
    }

    // Limpieza de formato en caso de que la IA ignore las instrucciones
    text = text.trim();
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");

    const questions = JSON.parse(text);
    return res.status(200).json({ questions });
  } catch (err: any) {
    console.error("Error generando IA:", err);
    return res.status(500).json({ error: "Error al generar preguntas con IA: " + err.message });
  }
}
