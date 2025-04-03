/**
 * @file timelineService.ts
 * @description Funciones puras de acceso a la base de datos (Supabase) para la entidad 'timelines'.
 *
 * @remarks
 *  - Se recomienda aislar la lógica de la DB aquí, de modo que los hooks
 *    en /hooks la consuman. Así, si cambias de Supabase a otro backend,
 *    solo tocas este archivo.
 */

import { supabase } from "@/lib/supabase/client";
import { Timeline } from "../types/timelineTypes";

/**
 * Obtiene todos los timelines (ordenados si deseas) desde la tabla 'timelines'.
 */
export async function fetchAllTimelines(): Promise<Timeline[]> {
  const { data, error } = await supabase
    .from("timelines")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching timelines:", error);
    return [];
  }
  return data as Timeline[];
}

/**
 * Inserta un nuevo timeline en la tabla 'timelines'.
 */
export async function createTimeline(
  title: string,
  structure: string[],
  usages: string[]
): Promise<Timeline | null> {
  const { data, error } = await supabase
    .from("timelines")
    .insert([{ title, structure, usages }])
    .select("*")
    .single();

  if (error) {
    console.error("Error creating timeline:", error);
    return null;
  }

  return data as Timeline;
}

/**
 * (Opcional) Actualiza un timeline existente.
 */
export async function updateTimeline(
  timelineId: string,
  changes: Partial<Timeline>
) {
  const { error } = await supabase
    .from("timelines")
    .update(changes)
    .eq("id", timelineId);

  if (error) {
    console.error("Error updating timeline:", error);
  }
}
