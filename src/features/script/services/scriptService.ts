/**
 * @file scriptService.ts
 * @description Servicio para gestionar la entidad "Script" en la base de datos.
 *
 * Este servicio centraliza la lógica para:
 *   - Crear un nuevo script.
 *   - Actualizar un script existente.
 *   - Obtener un script por su ID.
 *
 * Se utiliza el cliente de Supabase (importado desde "@/lib/supabase/client")
 * para realizar las operaciones en la tabla "scripts".
 */

import { supabase } from "@/lib/supabase/client";

/**
 * Interfaz que describe la estructura de un Script.
 * Ajusta los tipos según la estructura real de tu tabla "scripts".
 */
export interface Script {
  id: string;
  title: string;
  body: Array<Record<string, string>>; // Por ejemplo, un arreglo de objetos para cada sección del guion.
  timeline_id: string;
  notas?: string | null; // Almacena un objeto JSON con las notas o Sketches.
  created_at?: string;
  miniaturas?: Record<string, string>;
}

/**
 * Crea un nuevo Script en la tabla "scripts".
 *
 * @returns {Promise<string | null>} El ID del nuevo script, o null si falla.
 *
 * @remarks
 *   - Se inicializa con valores por defecto.
 *   - Puedes modificar la lógica para asignar un timeline_id por defecto o
 *     parametrizar la función para recibirlos.
 */
export async function createNewScript(): Promise<string | null> {
  try {
    const defaultTitle = "Nuevo Guion";
    const defaultTimelineId = "default_timeline_id"; // Reemplaza o ajusta según tu lógica de timelines.
    const defaultBody: Array<Record<string, string>> = []; // Inicialmente vacío.
    const defaultNotas = "{}"; // Representa un objeto JSON vacío.

    const { data, error } = await supabase
      .from("scripts")
      .insert([
        {
          title: defaultTitle,
          timeline_id: defaultTimelineId,
          body: defaultBody,
          notas: defaultNotas,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creando Script:", error);
      return null;
    }
    return data.id;
  } catch (err) {
    console.error("Excepción en createNewScript:", err);
    return null;
  }
}

/**
 * Actualiza un script existente con los cambios proporcionados.
 *
 * @param scriptId - El ID del script a actualizar.
 * @param changes - Objeto con las propiedades a modificar del script.
 * @returns {Promise<boolean>} true si la actualización fue exitosa, false en caso contrario.
 */
export async function updateScript(
  scriptId: string,
  changes: Partial<Script>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("scripts")
      .update(changes)
      .eq("id", scriptId);

    if (error) {
      console.error("Error actualizando script:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Excepción en updateScript:", err);
    return false;
  }
}

/**
 * Obtiene un script por su ID.
 *
 * @param scriptId - El ID del script a obtener.
 * @returns {Promise<Script | null>} El script obtenido o null si ocurre algún error.
 */
export async function fetchScript(scriptId: string): Promise<Script | null> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", scriptId)
      .single();

    if (error) {
      console.error("Error obteniendo script:", error);
      return null;
    }
    return data as Script;
  } catch (err) {
    console.error("Excepción en fetchScript:", err);
    return null;
  }
}
