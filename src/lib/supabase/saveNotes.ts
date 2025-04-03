import { supabase } from "./client";

// updatedNotas se espera que sea un objeto con la(s) clave(s) a actualizar
export async function saveNotes(
  scriptId: string,
  noteKey: string,
  noteBase64: string
) {
  if (!scriptId) {
    console.warn("No scriptId provided to saveNotes");
    return;
  }

  // 1) Obtenemos la columna 'notas' existente
  const { data, error: fetchError } = await supabase
    .from("scripts")
    .select("notas")
    .eq("id", scriptId) // O "uuid", si corresponde
    .single();

  if (fetchError) {
    console.error("Error fetching 'notas' before update:", fetchError);
    return;
  }

  let notasObject: Record<string, string> = {};
  if (data?.notas) {
    if (typeof data.notas === "string") {
      try {
        notasObject = JSON.parse(data.notas);
      } catch (err) {
        console.error("Error parseando 'notas' actual:", err);
        notasObject = {};
      }
    } else {
      notasObject = data.notas;
    }
  }

  // 3) Actualizamos solo la clave noteKey
  notasObject[noteKey] = noteBase64;

  // 4) Guardamos en DB
  const { error: updateError } = await supabase
    .from("scripts")
    .update({ notas: JSON.stringify(notasObject) })
    .eq("id", scriptId);

  if (updateError) {
    console.error("Error updating notas:", updateError);
  }
}
