// 1) Asegura que scriptId esté definido
// 2) Asegura que 'notas' sea parseado si viene como string
// 3) Asegúrate de hacer console.log en caso de error, si quieres debug

import { supabase } from "./client";

export async function fetchNotes(scriptId: string) {
  if (!scriptId) {
    console.warn("No scriptId provided to fetchNotes");
    return {};
  }

  const { data, error } = await supabase
    .from("scripts")
    .select("notas")
    .eq("id", scriptId) // O .eq("uuid", scriptId) si tu PK es "uuid"
    .single();

  if (error) {
    console.error("Error fetching notes:", error);
    return {};
  }

  // data?.notas podría ser objeto (jsonb) o string (text)
  let notasObject = {};
  if (data?.notas) {
    if (typeof data.notas === "string") {
      try {
        notasObject = JSON.parse(data.notas);
      } catch (err) {
        console.error("Error parseando notas:", err);
        notasObject = {};
      }
    } else {
      notasObject = data.notas;
    }
  }

  return notasObject;
}
