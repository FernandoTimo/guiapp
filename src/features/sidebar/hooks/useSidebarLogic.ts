"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTimeline } from "@/features/timeline/hooks/useTimeline";
import { useRouter } from "next/navigation";

// Definición de la interfaz para un Script.
export interface Script {
  id: string;
  title: string;
  created_at?: string;
}

/**
 * groupScriptsByDate
 *
 * Agrupa los scripts por fecha (Hoy, 7 días anteriores, 30 días anteriores, etc.)
 */
function groupScriptsByDate(scripts: Script[]): Record<string, Script[]> {
  const grouped: Record<string, Script[]> = {};
  const today = new Date();
  scripts.forEach((script) => {
    const date = script.created_at?.split("T")[0];
    if (!date) return;
    const created = new Date(date);
    const diff = Math.floor((+today - +created) / (1000 * 60 * 60 * 24));
    let label = "Más antiguos";
    if (diff === 0) label = "Hoy";
    else if (diff <= 7) label = "7 días anteriores";
    else if (diff <= 30) label = "30 días anteriores";
    else label = created.toLocaleString("default", { month: "long" });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(script);
  });
  return grouped;
}

/**
 * useSidebarLogic
 *
 * Encapsula la lógica de:
 *  - Cargar la lista de scripts desde la DB.
 *  - Crear un nuevo script.
 *  - Actualizar la lista tras eliminar o renombrar un script.
 *  - Agrupar los scripts por fecha.
 *
 * Retorna:
 *  - scripts: Lista de scripts.
 *  - grouped: Scripts agrupados por fecha.
 *  - handleCreateScript: Función para crear un nuevo script.
 *  - handleDeleted: Función para eliminar un script.
 *  - handleRenamed: Función para renombrar un script.
 */
export function useSidebarLogic() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const { latestTimelines } = useTimeline();
  const router = useRouter();

  // Cargar scripts desde la DB al montar
  useEffect(() => {
    const fetchScripts = async () => {
      const { data, error } = await supabase
        .from("scripts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setScripts(data);
      }
    };
    fetchScripts();
  }, []);

  // Función para crear un nuevo script
  const handleCreateScript = async () => {
    const latestTimeline = latestTimelines[0];
    if (!latestTimeline) return;
    const body = latestTimeline.structure.map((item: string) => ({
      [item]: `Texto generado para ${item}`,
    }));
    const { data, error } = await supabase
      .from("scripts")
      .insert([
        {
          title: "Nuevo Guión",
          body,
          timeline_id: latestTimeline.id,
          notas: [],
        },
      ])
      .select("id, title, created_at")
      .single();
    if (!error && data) {
      setScripts((prev) => [data, ...prev]);
      router.replace(`/?id=${data.id}`);
      window.history.replaceState(null, "", `/${data.id}`);
    }
  };

  // Función para eliminar un script
  const handleDeleted = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
  };

  // Función para renombrar un script
  const handleRenamed = (id: string, newTitle: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const grouped = groupScriptsByDate(scripts);

  return {
    scripts,
    grouped,
    handleCreateScript,
    handleDeleted,
    handleRenamed,
  };
}
