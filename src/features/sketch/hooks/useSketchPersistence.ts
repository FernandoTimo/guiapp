"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useScript } from "@/hooks/useScript";

export function useSketchPersistence() {
  const { script } = useScript();
  const scriptId = script?.id;

  // Función existente: loadSketch
  const loadSketch = useCallback(
    async (noteKey: string) => {
      if (!scriptId) return undefined;
      const { data, error } = await supabase
        .from("scripts")
        .select("notas")
        .eq("id", scriptId)
        .single();
      if (error) {
        console.error("Error cargando 'notas':", error);
        return undefined;
      }
      let allNotes: Record<string, string> = {};
      if (data?.notas) {
        if (typeof data.notas === "string") {
          try {
            allNotes = JSON.parse(data.notas);
            if (Array.isArray(allNotes)) {
              allNotes = {};
            }
          } catch (err) {
            console.error("Error parseando 'notas' como JSON:", err);
          }
        } else if (Array.isArray(data.notas)) {
          allNotes = {};
        } else {
          allNotes = data.notas;
        }
      }
      return allNotes[noteKey];
    },
    [scriptId]
  );

  // Función existente: saveSketch
  const saveSketch = useCallback(
    async (noteKey: string, dataURL: string) => {
      if (!scriptId) return;
      const { data, error } = await supabase
        .from("scripts")
        .select("notas")
        .eq("id", scriptId)
        .single();
      if (error) {
        console.error("Error cargando 'notas' (para update):", error);
        return;
      }
      let allNotes: Record<string, string> = {};
      if (data?.notas) {
        if (typeof data.notas === "string") {
          try {
            allNotes = JSON.parse(data.notas);
            if (Array.isArray(allNotes)) {
              allNotes = {};
            }
          } catch (err) {
            console.error("Error parseando 'notas':", err);
            allNotes = {};
          }
        } else if (Array.isArray(data.notas)) {
          allNotes = {};
        } else {
          allNotes = data.notas;
        }
      }
      allNotes[noteKey] = dataURL;
      const { error: updateError } = await supabase
        .from("scripts")
        .update({ notas: allNotes })
        .eq("id", scriptId);
      if (updateError) {
        console.error("Error actualizando 'notas':", updateError);
      } else {
        console.log("Guardado con éxito la noteKey:", noteKey);
      }
    },
    [scriptId]
  );

  // NUEVA FUNCIÓN: Actualiza las notas según la nueva estructura del timeline.
  const updateSketchNotesForTimeline = useCallback(
    async (newStructure: string[], scriptIdParam?: string) => {
      const id = scriptIdParam || scriptId;
      if (!id) return;
      const { data, error } = await supabase
        .from("scripts")
        .select("notas")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error cargando notas para actualizar timeline:", error);
        return;
      }
      let allNotes: Record<string, string> = {};
      if (data?.notas) {
        if (typeof data.notas === "string") {
          try {
            allNotes = JSON.parse(data.notas);
            if (Array.isArray(allNotes)) {
              allNotes = {};
            }
          } catch (err) {
            console.error("Error parseando 'notas':", err);
            allNotes = {};
          }
        } else if (Array.isArray(data.notas)) {
          allNotes = {};
        } else {
          allNotes = data.notas;
        }
      }
      // Construir nuevo objeto: conserva "GENERAL" y para cada elemento en la nueva estructura
      const newNotes: Record<string, string> = {};
      if (allNotes["GENERAL"]) {
        newNotes["GENERAL"] = allNotes["GENERAL"];
      }
      newStructure.forEach((key) => {
        newNotes[key] = allNotes[key] || "";
      });
      // Actualizar la DB
      const { error: updateError } = await supabase
        .from("scripts")
        .update({ notas: newNotes })
        .eq("id", id);
      if (updateError) {
        console.error("Error actualizando notas para timeline:", updateError);
      } else {
        console.log("Notas actualizadas para la nueva estructura:", newNotes);
      }
    },
    [scriptId]
  );

  return {
    loadSketch,
    saveSketch,
    updateSketchNotesForTimeline, // <-- Retornamos la nueva función
  };
}
