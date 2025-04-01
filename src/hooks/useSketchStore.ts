// hooks/useSketchStore.ts
import { create } from "zustand";

export type Tool = "pen" | "eraser";
export type Point = { x: number; y: number };

export type Stroke = {
  tool: Tool;
  color: string;
  size: number;
  points: Point[];
};

type SketchStore = {
  tool: Tool;
  color: string;
  size: number;
  strokes: Stroke[];
  setStrokes: (strokes: Stroke[]) => void;
  addStroke: (stroke: Stroke) => void;
  clearStrokes: () => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setTool: (tool: Tool) => void;
};

export const useSketchStore = create<SketchStore>((set) => ({
  tool: "pen",
  color: "#ddd", // valor por defecto fijo
  size: 10,
  strokes: [],
  setStrokes: (strokes) => set({ strokes }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),
  setColor: (color) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sketch_color", color);
    }
    set({ color });
  },
  setSize: (size) => set({ size }),
  setTool: (tool) => set({ tool }),
}));
