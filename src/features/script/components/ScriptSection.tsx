"use client";

/**
 * @file ScriptSection.tsx
 * @description Componente principal para la edición del título y generación automática del guion.
 */

import { useState, useEffect } from "react";
import { useScript } from "@/features/script/hooks/useScript";
import { useScriptAutoGenerator } from "@/features/script/hooks/useScriptAutoGenerator";
import ScriptBody from "./ScriptBody";

export default function ScriptSection() {
  const { script, updateScript } = useScript();
  const { generateScript, isGenerating } = useScriptAutoGenerator();
  const [title, setTitle] = useState(script?.title || "");

  useEffect(() => {
    setTitle(script?.title || "");
  }, [script?.title]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title && script?.title !== title) {
        updateScript({ title });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, script?.title, updateScript]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4 items-center">
        <input
          className="flex-1 bg-transparent text-amber-50 text-xl font-bold border-b border-neutral-600 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={() => generateScript(title)}
          disabled={isGenerating}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Generando..." : "Auto-Generar"}
        </button>
      </div>

      <ScriptBody />
    </div>
  );
}
