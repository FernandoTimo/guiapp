"use client";

/**
 * @file SketchCursorPreview.tsx
 * @description Muestra un cursor personalizado para el lienzo de dibujo.
 *   - Se alimenta del hook `useMousePosition` (posición global del mouse).
 *   - Lee color/tamaño/herramienta desde `useSketchStore`.
 *   - Requiere tener .cursor-none (o similar) aplicado al body o contenedor,
 *     si se desea ocultar el cursor nativo del sistema.
 */

import React, { useEffect } from "react";
import { useMousePosition } from "../hooks/useMousePosition";
import { useSketchStore } from "../hooks/useSketchStore";

export default function SketchCursorPreview() {
  const { pos, visible, setPos } = useMousePosition();
  const { tool, color, size } = useSketchStore();

  /**
   * Se fuerza un re-render cuando cambian las variables del pincel,
   * actualizando levemente la posición 'pos' para que la UI responda.
   */
  useEffect(() => {
    setPos((prev) => ({ ...prev }));
  }, [tool, color, size, setPos]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed"
      style={{
        top: pos.y,
        left: pos.x,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: tool === "eraser" ? "transparent" : color,
        border: tool === "eraser" ? "2px solid white" : "none",
        zIndex: 999999,
        mixBlendMode: "difference",
      }}
    />
  );
}
