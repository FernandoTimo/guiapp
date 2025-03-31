// src/hooks/useTimelines.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Timeline {
  id: string;
  title: string;
  structure: string[];
  usages: string[];
  created_at?: string;
}

export function useTimelines() {
  const [oldestTimeline, setOldestTimeline] = useState<Timeline | null>(null);
  const [latestTimelines, setLatestTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTimelines = async () => {
    setLoading(true);
    // Obtiene el timeline más antiguo (primer timeline creado)
    const { data: oldestData, error: oldestError } = await supabase
      .from("timelines")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);
    if (oldestError) {
      console.error(
        "Error al obtener el timeline más antiguo:",
        oldestError.message
      );
    } else if (oldestData && oldestData.length > 0) {
      setOldestTimeline(oldestData[0]);
    }

    // Obtiene los 4 últimos timelines (más recientes)
    const { data: latestData, error: latestError } = await supabase
      .from("timelines")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);
    if (latestError) {
      console.error(
        "Error al obtener los últimos timelines:",
        latestError.message
      );
    } else if (latestData) {
      setLatestTimelines(latestData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimelines();
  }, []);

  return { oldestTimeline, latestTimelines, loading, fetchTimelines };
}
