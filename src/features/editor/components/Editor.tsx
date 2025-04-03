"use client";
/**
 * @file Editor.tsx
 * @description Componente principal del Editor.
 *
 * Se encarga de renderizar las secciones del guion (ScriptSection, TimelineSection, SketchSection)
 * o mostrar el mensaje de creación cuando no hay un guion activo.
 */

import ScriptSection from "@/features/script/components/ScriptSection";
import TimelineSection from "@/features/timeline/components/TimelineSection";
import SketchSection from "@/features/sketch/components/SketchSection";
import { useEditorLogic } from "../hooks/useEditorLogic";

export default function Editor() {
  const { scriptId, handleCreateScript } = useEditorLogic();

  return (
    <main className="flex-1 relative p-4">
      {scriptId ? (
        <>
          <ScriptSection />
          <TimelineSection />
          <SketchSection />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="mb-4 text-neutral-400">
            Seleccione o cree un guion para empezar a trabajar.
          </p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={handleCreateScript}
          >
            Crear Guion
          </button>
        </div>
      )}
    </main>
  );
}
