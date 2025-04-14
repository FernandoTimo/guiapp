"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useScript } from "@/features/script/hooks/useScript";

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
  const saveThumbnail = useCallback(
    async (noteKey: string, thumbnailDataURL: string) => {
      if (!scriptId) return;

      // Primero traemos las miniaturas actuales
      const { data, error } = await supabase
        .from("scripts")
        .select("miniaturas")
        .eq("id", scriptId)
        .single();

      if (error) {
        console.error("Error cargando miniaturas:", error);
        return;
      }

      let allThumbnails: Record<string, string> = {};

      if (data?.miniaturas) {
        if (typeof data.miniaturas === "string") {
          try {
            allThumbnails = JSON.parse(data.miniaturas);
            if (Array.isArray(allThumbnails)) {
              allThumbnails = {}; // Si estaba mal guardado como array
            }
          } catch (err) {
            console.error("Error parseando miniaturas:", err);
            allThumbnails = {};
          }
        } else if (Array.isArray(data.miniaturas)) {
          allThumbnails = {};
        } else {
          allThumbnails = data.miniaturas;
        }
      }

      // Actualizamos la miniatura específica
      allThumbnails[noteKey] = thumbnailDataURL;

      // Ahora guardamos de vuelta
      const { error: updateError } = await supabase
        .from("scripts")
        .update({ miniaturas: allThumbnails })
        .eq("id", scriptId);

      if (updateError) {
        console.error("Error actualizando miniaturas:", updateError);
      } else {
        console.log(`Miniatura guardada para ${noteKey}`);
      }
    },
    [scriptId]
  );
  const clearSketch = async (noteKey: string) => {
    if (!scriptId) return;
    const { data, error } = await supabase
      .from("scripts")
      .select("notas")
      .eq("id", scriptId)
      .single();

    if (error || !data) {
      console.error("Error obteniendo notas:", error);
      return;
    }

    let allNotes: Record<string, string> = {};

    try {
      if (typeof data.notas === "string") {
        allNotes = JSON.parse(data.notas);
      } else {
        allNotes = data.notas || {};
      }
    } catch (err) {
      console.error("Error parseando notas:", err);
      return;
    }

    delete allNotes[noteKey]; // 👈 Elimina la nota específica

    const { error: updateError } = await supabase
      .from("scripts")
      .update({ notas: allNotes })
      .eq("id", scriptId);

    if (updateError) {
      console.error("Error actualizando notas:", updateError);
    }
  };
  return {
    saveThumbnail,
    loadSketch,
    saveSketch,
    updateSketchNotesForTimeline,
    clearSketch, // <-- Retornamos la nueva función
  };
}
