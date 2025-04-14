"use client";
/**
 * @file SketchCanvas.tsx
 * @description Recibe un noteKey, notesData y setNotesData, delega la lógica a useSketchCanvas,
 * y renderiza el lienzo (canvas) junto con el cursor personalizado (SketchCursorPreview) que se muestra
 * únicamente cuando el mouse está dentro del contenedor.
 */

import React, { useEffect, useRef, useState } from "react";
import { useSketchCanvas } from "../hooks/useSketchCanvas";
import SketchCursorPreview from "./SketchCursorPreview";
import { useSketchStore } from "../hooks/useSketchStore";

interface SketchCanvasProps {
  noteKey: string;
  notesData: Record<string, string>;
  setNotesData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function SketchCanvas({
  noteKey,
  notesData,
  setNotesData,
}: SketchCanvasProps) {
  // Ref para el contenedor del lienzo.
  const containerRef = useRef<HTMLDivElement>(null);
  // Estado local para la posición del mouse relativa al contenedor.
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Estado para saber si el mouse está dentro del contenedor.
  const [inside, setInside] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { setCanvasRef } = useSketchStore();

  useEffect(() => {
    setCanvasRef(canvasRef); // 👈 guardamos el canvasRef globalmente
  }, [setCanvasRef]);

  const { handlePointerDown, handlePointerMove, handlePointerUp, handleWheel } =
    useSketchCanvas({ noteKey, notesData, setNotesData });

  const { tool, color, size } = useSketchStore();

  // Actualiza la posición relativa al contenedor.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      className="relative w-full h-full"
      ref={containerRef}
      style={{ cursor: "none" }} // Oculta el cursor nativo dentro del lienzo.
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-transparent"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      {inside && (
        <SketchCursorPreview
          mousePos={mousePos}
          tool={tool}
          color={color}
          size={size}
        />
      )}
    </div>
  );
}
