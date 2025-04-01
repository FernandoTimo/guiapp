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
  color: "#e74c3c",
  size: 10,
  strokes: [],
  setStrokes: (strokes) => set({ strokes }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setTool: (tool) => set({ tool }),
}));
