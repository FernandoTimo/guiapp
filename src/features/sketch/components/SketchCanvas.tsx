"use client";

/**
 * SketchCanvas.tsx
 * Recibe un noteKey, notesData, setNotesData, y delega la lógica a useSketchCanvas,
 * que maneja la parte local y la DB.
 */

import React from "react";
import { useSketchCanvas } from "../hooks/useSketchCanvas";

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
  const {
    canvasRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useSketchCanvas({ noteKey, notesData, setNotesData });

  return (
    <div className="relative w-full h-full">
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
    </div>
  );
}
