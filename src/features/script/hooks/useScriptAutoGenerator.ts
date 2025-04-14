// features/script/hooks/useScriptAutoGenerator.ts
"use client";

/**
 * @file useScriptAutoGenerator.ts
 * @description Hook que permite generar automáticamente el contenido del script usando la IA de OpenAI en tiempo real.
 */

import { useState } from "react";
import { generateScript } from "@/lib/openai/generateScript";
import { useScriptBodyEditor } from "./useScriptBodyEditor";
import { useScript } from "./useScript";

export function useScriptAutoGenerator() {
  const { setLocalBody } = useScriptBodyEditor();
  const { script, updateScript } = useScript();
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateScriptContent(title: string) {
    if (!title || !script?.id) return;

    try {
      setIsGenerating(true);

      const stream = await generateScript(title);

      let currentText = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          currentText += content;

          // Cada 2 saltos de línea generamos una sección aproximada
          const sections = currentText
            .split("\n\n")
            .reduce((acc, section, index) => {
              const key = `SECCION_${index + 1}`;
              acc[key] = section.trim();
              return acc;
            }, {} as Record<string, string>);

          setLocalBody(sections);

          updateScript({
            body: Object.entries(sections).map(([k, v]) => ({ [k]: v })),
          });
        }
      }
    } catch (error) {
      console.error("Error generando el guión:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    generateScript: generateScriptContent,
    isGenerating,
  };
}
