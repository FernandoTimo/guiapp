"use client";
/**
 * @file SketchCursorPreview.tsx
 * @description Muestra un cursor personalizado para el lienzo de dibujo.
 *
 * Recibe la posición del mouse, la herramienta, color y tamaño del pincel a través de props.
 * Se renderiza como un elemento absolute dentro del contenedor del lienzo.
 */

import React from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface SketchCursorPreviewProps {
  mousePos: MousePosition;
  tool: "pen" | "eraser";
  color: string;
  size: number;
}

export default function SketchCursorPreview({
  mousePos,
  tool,
  color,
  size,
}: SketchCursorPreviewProps) {
  // Si la posición sigue siendo la inicial, no renderizamos.
  if (mousePos.x === -9999 && mousePos.y === -9999) return null;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: mousePos.y,
        left: mousePos.x,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: tool === "eraser" ? "transparent" : color,
        border: tool === "eraser" ? "2px solid white" : "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
}
