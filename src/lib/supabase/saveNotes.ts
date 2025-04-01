// lib/supabase/saveNotes.ts
import { Stroke } from "@/hooks/useSketchStore";
import { supabase } from "@/lib/supabase/client";

export async function saveNotes(scriptId: string, strokes: Stroke[]) {
  const { error } = await supabase
    .from("scripts")
    .update({ notas: strokes })
    .eq("id", scriptId);

  if (error) {
    console.error("Error al guardar notas:", error.message);
  } else {
    console.log("Notas guardadas correctamente");
  }
}
