"use client";

/**
 * @file useSketchStore.ts
 * @description Store central para la funcionalidad de Sketch (dibujo).
 *   - Maneja herramienta (pen/eraser), color, tamaño de pincel, y una lista de strokes.
 *   - Persiste color/tamaño en localStorage para conservar preferencias entre recargas.
 *   - Podría ampliarse para manejar snapshots, redo/undo, y lógica adicional.
 */

import { create } from "zustand";
// (Opcional) import { devtools } from "zustand/middleware";

export type Tool = "pen" | "eraser";
export type Point = { x: number; y: number };

export type Stroke = {
  tool: Tool;
  color: string;
  size: number;
  points: Point[];
};

interface SketchStore {
  // Estado
  tool: Tool;
  color: string;
  size: number;
  strokes: Stroke[];

  // Acciones
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;

  setStrokes: (strokes: Stroke[]) => void;
  addStroke: (stroke: Stroke) => void;
  clearStrokes: () => void;
}

// Ejemplo con devtools (opcional):
// export const useSketchStore = create<SketchStore>()(
//   devtools((set) => ({
//     ...
//   }), { name: "SketchStore" })
// );

export const useSketchStore = create<SketchStore>((set) => {
  // 1) Cargamos color/size iniciales de localStorage (si existen)
  let initialColor = "#ddd";
  let initialSize = 10;

  if (typeof window !== "undefined") {
    const storedColor = localStorage.getItem("sketch_color");
    const storedSize = localStorage.getItem("sketch_size");

    if (storedColor) initialColor = storedColor;

    if (storedSize) {
      const parsed = parseInt(storedSize, 10);
      if (!isNaN(parsed)) {
        initialSize = parsed;
      }
    }
  }

  return {
    // Estado inicial
    tool: "pen",
    color: initialColor,
    size: initialSize,
    strokes: [],

    // Acciones
    setTool: (tool) => set({ tool }),
    setColor: (color) => {
      // Guardamos en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("sketch_color", color);
      }
      set({ color });
    },
    setSize: (size) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("sketch_size", String(size));
      }
      set({ size });
    },

    setStrokes: (strokes) => set({ strokes }),
    addStroke: (stroke) =>
      set((state) => ({
        strokes: [...state.strokes, stroke],
      })),
    clearStrokes: () => set({ strokes: [] }),
  };
});
