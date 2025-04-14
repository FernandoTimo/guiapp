"use client";

import { create } from "zustand";

export type Tool = "pen" | "eraser";
export type Point = { x: number; y: number };
export type Stroke = {
  tool: Tool;
  color: string;
  size: number;
  points: Point[];
};

interface SketchStore {
  tool: Tool;
  color: string;
  size: number;
  strokes: Stroke[];
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement>) => void;
  setStrokes: (strokes: Stroke[]) => void;
  addStroke: (stroke: Stroke) => void;
  clearStrokes: () => void;
}

// Helpers por tipo de dato
const getItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  try {
    return value !== null ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getStringItem = (key: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value !== null ? value : fallback;
};

export const useSketchStore = create<SketchStore>((set) => ({
  tool: getItem<Tool>("sketch_tool", "pen"),
  color: getStringItem("sketch_color", "#000000"),
  size: getItem<number>("sketch_size", 5),
  canvasRef: null, // inicializamos vacío
  strokes: [],
  setTool: (tool) => {
    set({ tool });
    if (typeof window !== "undefined") {
      localStorage.setItem("sketch_tool", JSON.stringify(tool));
    }
  },
  setCanvasRef: (ref) => set({ canvasRef: ref }),
  setColor: (color) => {
    set({ color });
    if (typeof window !== "undefined") {
      localStorage.setItem("sketch_color", color); // <-- ya no JSON.stringify
    }
  },
  setSize: (size) => {
    set({ size });
    if (typeof window !== "undefined") {
      localStorage.setItem("sketch_size", JSON.stringify(size));
    }
  },
  setStrokes: (strokes) => set({ strokes }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),
}));
