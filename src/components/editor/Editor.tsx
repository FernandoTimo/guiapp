"use client";
/**
 * @file Editor.tsx
 * @description Componente principal del editor.
 *
 * Este componente se encarga de:
 *  - Sincronizar el estado del ID del guion con la URL.
 *  - Renderizar el ScriptSection, TimelineSection y SketchSection si hay un guion activo.
 *  - Permitir la creación de un nuevo guion.
 *
 * Se utiliza useSearchParams y useRouter de Next.js para gestionar la navegación.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ScriptSection from "./script/ScriptSection";
import TimelineSection from "@/features/timeline/components/TimelineSection";
import SketchSection from "@/features/sketch/components/SketchSection";
// Importamos createNewScript desde el nuevo servicio centralizado de scripts
import { createNewScript } from "@/features/script/services/scriptService";

export default function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local que mantiene el ID del guion actual.
  const [scriptId, setScriptId] = useState<string | null>(
    searchParams.get("id")
  );

  /**
   * Sincroniza el estado local con el parámetro "id" de la URL.
   * Si se encuentra un ID, se actualiza el estado y se limpia la URL.
   */
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setScriptId(id);
      window.history.replaceState(null, "", `/${id}`);
    }
  }, [searchParams]);

  /**
   * Callback para crear un nuevo guion.
   * - Llama a la función createNewScript (definida en el servicio de script).
   * - Actualiza la URL y el estado local con el nuevo ID.
   */
  const handleCreateScript = useCallback(async () => {
    const newScriptId = await createNewScript();
    if (!newScriptId) return;

    // Actualiza la URL para reflejar el nuevo ID
    router.replace(`/?id=${newScriptId}`);
    window.history.replaceState(null, "", `/${newScriptId}`);

    // Actualiza el estado local del ID del guion
    setScriptId(newScriptId);
  }, [router]);

  return (
    <main className="flex-1 relative p-4">
      {scriptId ? (
        // Si hay un ID, renderiza las secciones del editor.
        <>
          <ScriptSection />
          <TimelineSection />
          <SketchSection />
        </>
      ) : (
        // Si no hay ID, muestra el mensaje de selección o creación del guion.
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
