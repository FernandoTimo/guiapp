"use client";
/**
 * @file useScript.ts
 * @description Hook para obtener y actualizar el Script actual.
 *
 * Este hook se encarga de:
 * - Extraer el ID del script desde los search params o el pathname.
 * - Obtener el script de la base de datos usando el servicio fetchScript.
 * - Proveer una función para actualizar el script usando el servicio updateScript.
 *
 * NOTA: La lógica de edición detallada se maneja en otros hooks (useScriptEditor, useScriptBodyEditor)
 * para mantener este hook lo más simple y enfocado posible.
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  fetchScript,
  updateScript as serviceUpdateScript,
  Script,
} from "../services/scriptService";

/**
 * Extrae el ID del script desde search params o el pathname.
 */
function getScriptId(
  searchParams: URLSearchParams,
  pathname: string
): string | null {
  const idFromSearch = searchParams.get("id");
  if (idFromSearch) return idFromSearch;
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] || null;
}

export function useScript() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scriptId = getScriptId(searchParams, pathname);

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar el script cada vez que cambia el scriptId o la URL
  useEffect(() => {
    if (!scriptId) {
      setScript(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchScript(scriptId)
      .then((data) => {
        setScript(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching script:", err);
        setError("No se pudo cargar el guion.");
      })
      .finally(() => setLoading(false));
  }, [scriptId, searchParams, pathname]);

  /**
   * updateScript: Función para actualizar el script.
   * Delegamos la actualización en el servicio y, si es exitosa, actualizamos el estado local.
   */
  const updateScript = useCallback(
    async (updatedData: Partial<Script>) => {
      if (!scriptId) return;
      const success = await serviceUpdateScript(scriptId, updatedData);
      if (success) {
        setScript((prev) => (prev ? { ...prev, ...updatedData } : prev));
      }
    },
    [scriptId]
  );

  return { script, loading, error, updateScript };
}
