/**
 * @file sketchService.ts
 * @description Servicio para gestionar la persistencia de Sketch (antes "notes").
 * Este módulo centraliza la lógica de lectura, guardado y actualización de los datos
 * del Sketch en la base de datos mediante Supabase.
 *
 * Se recomienda centralizar toda la lógica de Sketch aquí para facilitar la escalabilidad
 * y el mantenimiento en un proyecto de gran envergadura.
 */

import { supabase } from "@/lib/supabase/client";

/**
 * Carga el Sketch asociado a un noteKey de un script.
 *
 * @param scriptId - El ID del script que contiene el Sketch.
 * @param noteKey - La clave que identifica el Sketch (ej. "GENERAL", "1", "2", etc.).
 * @returns El dataURL del Sketch si existe; de lo contrario, undefined.
 */
export async function loadSketch(
  scriptId: string,
  noteKey: string
): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .select("notas")
      .eq("id", scriptId)
      .single();

    if (error) {
      console.error("Error al cargar Sketch:", error);
      return undefined;
    }

    let allSketches: Record<string, string> = {};
    if (data?.notas) {
      if (typeof data.notas === "string") {
        try {
          allSketches = JSON.parse(data.notas);
          if (Array.isArray(allSketches)) {
            // Si viene un array, lo convertimos a objeto vacío
            allSketches = {};
          }
        } catch (err) {
          console.error("Error parseando Sketch:", err);
          return undefined;
        }
      } else if (Array.isArray(data.notas)) {
        allSketches = {};
      } else {
        allSketches = data.notas;
      }
    }

    return allSketches[noteKey];
  } catch (err) {
    console.error("Excepción en loadSketch:", err);
    return undefined;
  }
}

/**
 * Guarda o actualiza un Sketch en la base de datos.
 * Combina los Sketch existentes con el nuevo dataURL para la clave especificada.
 *
 * @param scriptId - El ID del script que contiene el Sketch.
 * @param noteKey - La clave identificadora del Sketch.
 * @param dataURL - La imagen en formato dataURL (string base64) a guardar.
 * @returns true si la operación fue exitosa, false en caso contrario.
 */
export async function saveSketch(
  scriptId: string,
  noteKey: string,
  dataURL: string
): Promise<boolean> {
  try {
    // Obtener los Sketch existentes
    const { data, error } = await supabase
      .from("scripts")
      .select("notas")
      .eq("id", scriptId)
      .single();

    if (error) {
      console.error("Error al obtener Sketches previos:", error);
      return false;
    }

    let allSketches: Record<string, string> = {};
    if (data?.notas) {
      if (typeof data.notas === "string") {
        try {
          allSketches = JSON.parse(data.notas);
          if (Array.isArray(allSketches)) {
            allSketches = {};
          }
        } catch (err) {
          console.error("Error parseando Sketches previos:", err);
          allSketches = {};
        }
      } else if (Array.isArray(data.notas)) {
        allSketches = {};
      } else {
        allSketches = data.notas;
      }
    }

    // Actualizar el Sketch correspondiente a noteKey
    allSketches[noteKey] = dataURL;

    // Guardar en la base de datos
    const { error: updateError } = await supabase
      .from("scripts")
      .update({ notas: allSketches })
      .eq("id", scriptId);

    if (updateError) {
      console.error("Error al guardar Sketch:", updateError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Excepción en saveSketch:", err);
    return false;
  }
}

/**
 * Actualiza la estructura de Sketches según la nueva estructura del timeline.
 * Conserva el Sketch "GENERAL" y actualiza o inicializa los Sketch para cada clave
 * de la nueva estructura.
 *
 * @param scriptId - El ID del script que contiene los Sketches.
 * @param newStructure - Array de claves que representan la nueva estructura del timeline.
 */
export async function updateSketchesForNewTimeline(
  scriptId: string,
  newStructure: string[]
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .select("notas")
      .eq("id", scriptId)
      .single();

    if (error) {
      console.error(
        "Error al obtener Sketches para actualizar timeline:",
        error
      );
      return;
    }

    let allSketches: Record<string, string> = {};
    if (data?.notas) {
      if (typeof data.notas === "string") {
        try {
          allSketches = JSON.parse(data.notas);
          if (Array.isArray(allSketches)) {
            allSketches = {};
          }
        } catch (err) {
          console.error("Error parseando Sketches:", err);
          allSketches = {};
        }
      } else if (Array.isArray(data.notas)) {
        allSketches = {};
      } else {
        allSketches = data.notas;
      }
    }

    // Construir el nuevo objeto con la nueva estructura.
    const newSketches: Record<string, string> = {};
    if (allSketches["GENERAL"]) {
      newSketches["GENERAL"] = allSketches["GENERAL"];
    }
    newStructure.forEach((key) => {
      newSketches[key] = allSketches[key] || "";
    });

    // Actualizar la base de datos
    const { error: updateError } = await supabase
      .from("scripts")
      .update({ notas: newSketches })
      .eq("id", scriptId);

    if (updateError) {
      console.error(
        "Error al actualizar Sketches para el nuevo timeline:",
        updateError
      );
    }
  } catch (err) {
    console.error("Excepción en updateSketchesForNewTimeline:", err);
  }
}
