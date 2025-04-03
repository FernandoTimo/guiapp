"use client";
/**
 * @file ScriptSection.tsx
 * @description Componente principal para la edición del Script.
 *
 * Permite editar el título del guion y renderiza el ScriptBody que contiene
 * todas las secciones del script.
 */

import { useState, useEffect } from "react";
import { useScript } from "@/features/script/hooks/useScript";
import ScriptBody from "./ScriptBody";

export default function ScriptSection() {
  const { script, updateScript } = useScript();
  const [title, setTitle] = useState(script?.title || "");

  // Sincroniza el título con el script cargado
  useEffect(() => {
    setTitle(script?.title || "");
  }, [script?.title]);

  // Auto-guardado del título
  useEffect(() => {
    const handler = setTimeout(() => {
      if (title && script?.title !== title) {
        updateScript({ title });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [title, script?.title, updateScript]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <input
        className="w-full bg-transparent text-xl font-bold border-b border-neutral-600 focus:outline-none mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ScriptBody />
    </div>
  );
}
