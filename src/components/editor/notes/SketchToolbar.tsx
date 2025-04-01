"use client";

import React from "react";
import { useSketchStore } from "../../../hooks/useSketchStore";

export function SketchToolbar() {
  const { color, size, setColor, setSize, tool, setTool } = useSketchStore();

  return (
    <div className="absolute bottom-2 left-2 right-2  bg-transparent backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 text-xs  text-white">
      <label>Color del Pincel:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full h-8 rounded border border-neutral-700 bg-transparent"
      />
      <label>
        Tamaño del {tool === "pen" ? "pincel" : "borrador"}: {size}px
      </label>
      <input
        type="range"
        min={1}
        max={50}
        value={size}
        onChange={(e) => setSize(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        <button
          onClick={() => setTool("eraser")}
          className={`px-3 py-1 rounded bg-neutral-800 ${
            tool === "eraser" ? "border border-white/20" : ""
          }`}
        >
          Borrador
        </button>
        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1 rounded bg-neutral-800 ${
            tool === "pen" ? "border border-white/20" : ""
          }`}
        >
          Pincel
        </button>
        <button
          onClick={() => {
            const canvas = document.querySelector("canvas");
            if (canvas) {
              const ctx = canvas.getContext("2d");
              if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }}
          className="px-3 py-1 rounded bg-red-800"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
