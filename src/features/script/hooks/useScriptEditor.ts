"use client";
/**
 * @file useScriptEditor.ts
 * @description Hook para gestionar la edición del Script.
 *
 * Este hook se encarga de:
 * - Cargar el Script desde la DB usando fetchScript.
 * - Extraer y manejar el contenido de la sección "GENERAL" del guion.
 * - Proveer una función para actualizar el contenido y persistir cambios.
 *
 * Se implementa con buenas prácticas de memoización para facilitar su escalabilidad.
 */

import { useState, useEffect, useCallback } from "react";
import { fetchScript, updateScript, Script } from "../services/scriptService";

export function useScriptEditor(scriptId: string) {
  const [script, setScript] = useState<Script | null>(null);
  const [content, setContent] = useState<string>("");

  // Cargar el script al montar o cuando cambie scriptId.
  useEffect(() => {
    async function loadScript() {
      const fetchedScript = await fetchScript(scriptId);
      if (fetchedScript) {
        setScript(fetchedScript);
        // Asumimos que el body del script es un arreglo que incluye la sección "GENERAL".
        if (
          fetchedScript.body &&
          fetchedScript.body.length > 0 &&
          fetchedScript.body[0].GENERAL !== undefined
        ) {
          setContent(fetchedScript.body[0].GENERAL);
        } else {
          // Si no existe, inicializamos con vacío.
          setContent("");
        }
      }
    }
    loadScript();
  }, [scriptId]);

  /**
   * updateContent: Actualiza el contenido en el estado y persiste los cambios en la DB.
   */
  const updateContent = useCallback(
    async (newContent: string) => {
      setContent(newContent);
      // Actualiza el script, modificando la sección "GENERAL".
      await updateScript(scriptId, { body: [{ GENERAL: newContent }] });
    },
    [scriptId]
  );

  return { script, content, updateContent };
}
