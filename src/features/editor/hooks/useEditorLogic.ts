"use client";
/**
 * @file useEditorLogic.ts
 * @description Hook para gestionar la lógica central del Editor.
 *
 * Se encarga de:
 *  - Extraer el scriptId de los search params o del pathname.
 *  - Sincronizar el estado con la URL.
 *  - Proveer una función para crear un nuevo guion.
 */

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createNewScript } from "@/features/script/services/scriptService";

export function useEditorLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Función para extraer el id del guion, ya sea desde search params o el pathname.
  const getScriptId = useCallback(() => {
    const searchId = searchParams.get("id");
    if (searchId) return searchId;
    const pathSegments = pathname.split("/").filter(Boolean);
    return pathSegments[0] || null;
  }, [searchParams, pathname]);

  const [scriptId, setScriptId] = useState<string | null>(getScriptId());

  useEffect(() => {
    const id = getScriptId();
    if (id) {
      setScriptId(id);
      // Limpiar la URL para que quede en el formato "/{id}"
      window.history.replaceState(null, "", `/${id}`);
    }
  }, [getScriptId]);

  // Función para crear un nuevo guion
  const handleCreateScript = useCallback(async () => {
    const newScriptId = await createNewScript();
    if (!newScriptId) return;
    router.replace(`/?id=${newScriptId}`);
    window.history.replaceState(null, "", `/${newScriptId}`);
    setScriptId(newScriptId);
  }, [router]);

  return { scriptId, handleCreateScript };
}
