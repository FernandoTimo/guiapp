"use client";
/**
 * @file SketchToolbar.tsx
 * @description Barra de herramientas flotante para el lienzo de dibujo.
 *   - Brinda la acción de limpiar el lienzo.
 *   - Se integra con useSketchStore para manejar trazos.
 *
 * @remarks
 *   Esta Toolbar puede expandirse con más controles (cambio de color,
 *   ajustes de tamaño de pincel, etc.) según las necesidades de la aplicación.
 */

import React from "react";
import { useSketchStore } from "../hooks/useSketchStore";
import { useSketchPersistence } from "../hooks/useSketchPersistence";
import { useScript } from "@/features/script/hooks/useScript";
import { useTimelineStore } from "@/features/timeline/hooks/useTimelineStore";

export default function SketchToolbar() {
  const { clearStrokes } = useSketchStore();

  const { clearSketch } = useSketchPersistence(); // 👈 vamos a crear esta función ahorita
  const { script } = useScript();
  const { selectedKey } = useTimelineStore();

  const handleClearCanvas = async () => {
    clearStrokes();
    if (script?.id && selectedKey) {
      await clearSketch(selectedKey); // ✅ limpia también Supabase para ese slide
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 👈 Borra el canvas visualmente también
      }
    }
  };
  return (
    <div className="absolute bottom-2 right-2 p-2 flex items-center gap-2 bg-black/30 rounded-full">
      <button
        onClick={handleClearCanvas}
        title="Limpiar lienzo"
        className="w-8 h-8 flex items-center justify-center rounded-full transition backdrop-blur-sm hover:backdrop-blur-md hover:bg-white/5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7v10m6-10v10M4 7h16l-1 13H5L4 7zM10 4h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
            className="stroke-neutral-400 hover:stroke-red-500 transition"
          />
        </svg>
      </button>
    </div>
  );
}
