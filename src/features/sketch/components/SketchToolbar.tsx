"use client";

/**
 * @file SketchToolbar.tsx
 * @description Barra de herramientas flotante para el lienzo de dibujo.
 *   - Actualmente brinda la acción de limpiar el lienzo.
 *   - Se integra con useSketchStore para manejar trazos.
 *
 * @remarks
 *   Esta Toolbar puede expandirse con más controles (cambio de color,
 *   ajustes de tamaño de pincel, etc.) según las necesidades de la aplicación.
 */

import React from "react";
import { useSketchStore } from "../hooks/useSketchStore";

export default function SketchToolbar() {
  const { clearStrokes } = useSketchStore();

  /**
   * handleClearCanvas:
   *   - Borra todos los trazos almacenados en el estado (useSketchStore).
   *   - Puede ampliarse para llamar a un servicio que también limpie
   *     la base de datos, cuando tengamos persistencia.
   */
  const handleClearCanvas = () => {
    clearStrokes();
    // En el futuro, aquí se podría notificar al backend o
    // sincronizar con supabase.
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
