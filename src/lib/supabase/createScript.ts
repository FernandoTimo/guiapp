import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Crea un nuevo guion basado en el último timeline existente.
 * @returns {Promise<string | null>} El ID del nuevo guion o null si falla.
 */
export async function createNewScript(): Promise<string | null> {
  try {
    // 1️⃣ Obtener el último `timeline_id` creado
    const { data: lastTimeline, error: timelineError } = await supabase
      .from("timelines")
      .select("id, structure") // `structure` es el array que define la secuencia (ej. ["a", "b", "c"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (timelineError) throw timelineError;
    if (!lastTimeline) throw new Error("No hay timelines disponibles.");

    const { id: timelineId, structure } = lastTimeline;

    // 2️⃣ Generar el cuerpo (`body`) basado en la estructura del timeline
    const body = structure.map((item: string) => ({
      [item]: `Texto predeterminado para ${item}`,
    }));

    // 3️⃣ Insertar el nuevo guion en `scripts`
    const { data: newScript, error: insertError } = await supabase
      .from("scripts")
      .insert([
        {
          title: "Nuevo Guión",
          body, // Se guarda como JSONB
          timeline_id: timelineId,
          notes: [],
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (insertError) throw insertError;

    // 4️⃣ Devolver el ID del guion recién creado
    return newScript.id;
  } catch (error) {
    console.error("Error al crear el guion:", error);
    return null;
  }
}
