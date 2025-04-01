"use client";

import { useSketchStore } from "@/hooks/useSketchStore";
import { useScript } from "@/hooks/useScript";
import { supabase } from "@/lib/supabase/client";
import React from "react";

export function SketchToolbar() {
  const { clearStrokes } = useSketchStore();
  const { script } = useScript();

  const handleClearCanvas = async () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas || !script?.id) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar visualmente
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Borrar strokes en el estado
    clearStrokes();

    // Guardar lienzo limpio
    const emptyImage = canvas.toDataURL("image/png");

    const { error } = await supabase
      .from("scripts")
      .update({ notas: emptyImage })
      .eq("id", script.id);

    if (error) {
      console.error("Error al limpiar y guardar el lienzo:", error.message);
    }
  };

  return (
    <div className="absolute bottom-2 left-2 right-2 bg-transparent backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 text-xs text-white">
      <div className="flex justify-between mt-2">
        <button
          onClick={handleClearCanvas}
          className="flex-1 px-3 py-1 rounded bg-red-800 text-sm"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
