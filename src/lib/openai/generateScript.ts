// lib/openai/generateScript.ts
import { openai } from "./client";

export async function generateScript(title: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // usa el mejor modelo actual
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente creativo experto en guiones, responde solo con el contenido estructurado.",
      },
      {
        role: "user",
        content: `Genera un guion completo para el siguiente título: "${title}". Divide el contenido en secciones bien definidas.`,
      },
    ],
  });

  return response;
}
