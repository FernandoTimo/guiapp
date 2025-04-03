"use client";
import { create } from "zustand";

export type Tool = "pen" | "eraser";

export const useSketchStore = create<{
  tool: Tool;
  color: string;
  size: number;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
}>((set) => {
  let initialColor = "#ddd";
  let initialSize = 10;
  if (typeof window !== "undefined") {
    const c = localStorage.getItem("sketch_color");
    if (c) initialColor = c;
    const s = localStorage.getItem("sketch_size");
    if (s) {
      const n = parseInt(s, 10);
      if (!isNaN(n)) initialSize = n;
    }
  }
  return {
    tool: "pen",
    color: initialColor,
    size: initialSize,
    setTool: (tool) => set({ tool }),
    setColor: (color) => {
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
  };
});
