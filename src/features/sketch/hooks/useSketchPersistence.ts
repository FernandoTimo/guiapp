"use client";

/**
 * @file useSketchPersistence.ts
 * Maneja la lectura/escritura en la columna 'notas' de la tabla 'scripts'.
 */

import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useScript } from "@/hooks/useScript";

export function useSketchPersistence() {
  const { script } = useScript();
  const scriptId = script?.id;

  /**
   * loadSketch:
   *   Carga la imagen base64 para la clave `noteKey`.
   */
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
            // Si llega a ser array, lo convertimos en objeto vacío
            if (Array.isArray(allNotes)) {
              allNotes = {};
            }
          } catch (err) {
            console.error("Error parseando 'notas' como JSON:", err);
          }
        }
        // Si la DB ya es jsonb, supabase lo devuelve como objeto… o array
        else if (Array.isArray(data.notas)) {
          allNotes = {};
        } else {
          allNotes = data.notas;
        }
      }

      return allNotes[noteKey];
    },
    [scriptId]
  );

  /**
   * saveSketch:
   *   Actualiza la clave `noteKey` con el dataURL en la DB.
   */
  const saveSketch = useCallback(
    async (noteKey: string, dataURL: string) => {
      if (!scriptId) return;

      // 1) Traer la columna 'notas'
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
            // Si fuese un array, lo convertimos a {}
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

      // 2) Actualizamos la clave con el nuevo base64
      allNotes[noteKey] = dataURL;

      // 3) Guardamos en DB
      //   Opción A) Si la columna es JSONB, puedes mandar directamente allNotes
      //   Opción B) Si prefieres, usa JSON.stringify(allNotes).
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

  return {
    loadSketch,
    saveSketch,
  };
}
