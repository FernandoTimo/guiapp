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
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setStrokes: (strokes: Stroke[]) => void;
  addStroke: (stroke: Stroke) => void;
  clearStrokes: () => void;
}

export const useSketchStore = create<SketchStore>((set) => ({
  tool: "pen",
  color: "#000000",
  size: 5,
  strokes: [],
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setStrokes: (strokes) => set({ strokes }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),
}));
