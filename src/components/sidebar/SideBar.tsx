"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTimelines } from "@/hooks/useTimelines";
import { supabase } from "@/lib/supabase/client";

interface Script {
  id: string;
  title: string;
}

export default function Sidebar() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const { latestTimelines } = useTimelines();

  useEffect(() => {
    const fetchScripts = async () => {
      const { data, error } = await supabase
        .from("scripts")
        .select("id, title")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al obtener los guiones:", error.message);
      } else {
        setScripts(data || []);
      }
    };

    fetchScripts();
  }, []);

  const handleCreateScript = async () => {
    const latestTimeline = latestTimelines[0];
    if (!latestTimeline) {
      alert("No hay timelines disponibles");
      return;
    }

    // cuerpo estructurado según el timeline
    const body = latestTimeline.structure.map((item: string) => ({
      [item]: `Texto generado para ${item}`,
    }));

    const { data, error } = await supabase
      .from("scripts")
      .insert([
        {
          title: "Nuevo Guión",
          body,
          timeline_id: latestTimeline.id,
          notes: [],
        },
      ])
      .select("id, title")
      .single();

    if (error) {
      console.error("Error al crear el guión:", error.message);
    } else if (data) {
      setScripts((prev) => [...prev, data]);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h3 className="text-xl font-bold mb-4">Listado de guiones creados</h3>
      <ul className="space-y-2">
        {scripts.map((script) => (
          <li key={script.id}>
            <Link href={`/${script.id}`} className="hover:underline text-sm">
              {script.title}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full"
        onClick={handleCreateScript}
      >
        Crear Nuevo Guión
      </button>
    </aside>
  );
}
