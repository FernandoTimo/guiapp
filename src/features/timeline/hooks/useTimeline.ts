"use client";
/**
 * @file useTimeline.ts
 * @description Hook para manejar la lógica de "Timelines": cargar, crear, etc.
 *   - Se apoya en el timelineService (opcional) para realizar queries a la DB.
 *   - Provee estados como timelines, loading, error, y funciones create/fetch.
 */

import { useState, useEffect } from "react";
import { Timeline } from "../types/timelineTypes";
// Si usas timelineService, descomenta:
import { fetchAllTimelines, createTimeline } from "../services/timelineService";
// Si prefieres queries directos en este hook, puedes import { supabase } from "@/lib/supabase/client";

export function useTimeline() {
  const [latestTimelines, setLatestTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los timelines desde la DB.
   */
  async function fetchTimelines() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllTimelines();
      setLatestTimelines(data);
    } catch (err: any) {
      setError(err.message || "Error fetching timelines");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Crea un nuevo timeline con title, structure y usages.
   * Retorna el timeline creado o null si falla.
   */
  async function createNewTimeline(
    title: string,
    structure: string[],
    usages: string[]
  ): Promise<Timeline | null> {
    try {
      const newT = await createTimeline(title, structure, usages);
      if (newT) {
        // Actualizamos la lista local
        setLatestTimelines((prev) => [newT, ...prev]);
      }
      return newT;
    } catch (err) {
      console.error("Error creating timeline:", err);
      return null;
    }
  }

  /**
   * Efecto inicial para cargar la lista al montar el hook
   */
  useEffect(() => {
    fetchTimelines();
  }, []);

  return {
    latestTimelines,
    loading,
    error,
    fetchTimelines,
    createNewTimeline,
  };
}
