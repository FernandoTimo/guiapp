// lib/supabase/fetchNotes.ts
import { Stroke } from "@/hooks/useSketchStore";
import { supabase } from "@/lib/supabase/client";

export async function fetchNotes(scriptId: string): Promise<Stroke[] | null> {
  const { data, error } = await supabase
    .from("scripts")
    .select("notas")
    .eq("id", scriptId)
    .single();

  if (error) {
    console.error("Error al obtener las notas:", error.message);
    return null;
  }

  return data.notas || [];
}
