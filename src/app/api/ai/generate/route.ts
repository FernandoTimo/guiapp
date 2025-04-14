import { NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai } from "@/lib/openai/client"; // Aquí tienes que tener configurado tu cliente OpenAI

/**
 * @description API Route para generar contenido usando IA (streaming).
 * Recibe el título y sección actual, y devuelve tokens a medida que se generan.
 */
export async function POST(req: Request) {
  try {
    const { title, section } = await req.json();

    if (!title || !section) {
      return new NextResponse("Missing title or section", { status: 400 });
    }

    const prompt = `
Eres un asistente creativo especializado en redacción de guiones.

Título del guion: "${title}"
Sección: "${section}"

Escribe un contenido breve, coherente y de alta calidad para esta sección.
No agregues títulos ni repitas el nombre de la sección. Solo escribe el cuerpo del contenido.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Si tienes gpt-4o, si no puedes poner gpt-3.5-turbo
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Asiste en la creación de guiones de manera breve y creativa.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("[API ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
