"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export type ScriptBody = { [key: string]: string }; // ejemplo: { introducción: "texto" }
export type Script = {
  id: string;
  title: string;
  body: ScriptBody[]; // lista de bloques de guión
  timeline_id: string;
  notas: string | null; // imagen base64
};

export function useScript() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const scriptId =
    searchParams.get("id") || pathname.split("/").filter(Boolean)[0];

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptId) {
      setScript(null);
      setLoading(false);
      return;
    }

    async function fetchScript() {
      setLoading(true);
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("id", scriptId)
        .single();

      if (error) {
        console.error("Error fetching script:", error);
        setError("No se pudo cargar el guion.");
      } else {
        setScript(data);
      }

      setLoading(false);
    }

    fetchScript();
  }, [scriptId]);

  async function updateScript(updatedData: Partial<Script>) {
    if (!scriptId) return;

    const { error } = await supabase
      .from("scripts")
      .update(updatedData)
      .eq("id", scriptId);

    if (error) {
      console.error("Error actualizando el guion:", error);
      return;
    }

    setScript((prev) => (prev ? { ...prev, ...updatedData } : prev));
  }

  return { script, loading, error, updateScript };
}
