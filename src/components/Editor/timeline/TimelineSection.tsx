"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Timeline {
  id: string;
  title: string;
  structure: string[];
  usages: string[];
  created_at?: string;
}

export default function TimelineSection() {
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTimeline() {
      // Obtenemos el último timeline creado ordenando por 'created_at' descendente.
      const { data, error } = await supabase
        .from("timelines")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) {
        console.error("Error fetching timeline:", error.message);
      } else if (data && data.length > 0) {
        setTimeline(data[0]);
      }
      setLoading(false);
    }
    fetchTimeline();
  }, []);

  return (
    <section className="fixed ml-5 mr-5 bottom-5 w-[65%] bg-gray-800 text-white p-4 shadow-inner rounded-lg">
      {loading ? (
        <div>Cargando...</div>
      ) : timeline ? (
        <div className="max-w-4xl mx-auto flex justify-between">
          {timeline.structure.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      ) : (
        <div>No hay timelines creados</div>
      )}
    </section>
  );
}
