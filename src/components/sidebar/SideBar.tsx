"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTimelines } from "@/hooks/useTimelines";
import { supabase } from "@/lib/supabase/client";

interface Script {
  id: string;
  title: string;
  created_at?: string;
}

export default function Sidebar() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const { latestTimelines } = useTimelines();
  const router = useRouter();

  useEffect(() => {
    const fetchScripts = async () => {
      const { data, error } = await supabase
        .from("scripts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) setScripts(data);
    };

    fetchScripts();
  }, []);

  const handleCreateScript = async () => {
    const latestTimeline = latestTimelines[0];
    if (!latestTimeline) return;

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
          notas: [],
        },
      ])
      .select("id, title, created_at")
      .single();

    if (!error && data) {
      setScripts((prev) => [data, ...prev]);
      router.replace(`/?id=${data.id}`);
      window.history.replaceState(null, "", `/${data.id}`);
    }
  };

  const grouped = groupScriptsByDate(scripts);

  return (
    <aside className="w-64 bg-[#1e1e1e] text-white p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-neutral-400 mb-2 uppercase">
        Proyectos
      </h3>
      <button
        onClick={handleCreateScript}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 px-3 py-2 rounded-xl transition"
      >
        ➕ Nuevo guión
      </button>

      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="mb-6">
          <h4 className="text-xs font-semibold text-neutral-500 mb-2">
            {section}
          </h4>
          <ul className="space-y-1">
            {items.map((script) => (
              <li key={script.id}>
                <Link
                  href={`/${script.id}`}
                  className="block text-sm text-neutral-300 px-3 py-2 rounded-xl hover:bg-neutral-800 transition"
                >
                  {script.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function groupScriptsByDate(scripts: Script[]) {
  const grouped: Record<string, Script[]> = {};
  const today = new Date();

  scripts.forEach((script) => {
    const date = script.created_at?.split("T")[0];
    if (!date) return;

    const created = new Date(date);
    const diff = Math.floor((+today - +created) / (1000 * 60 * 60 * 24));

    let label = "Más antiguos";
    if (diff === 0) label = "Hoy";
    else if (diff <= 7) label = "7 días anteriores";
    else if (diff <= 30) label = "30 días anteriores";
    else label = created.toLocaleString("default", { month: "long" });

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(script);
  });

  return grouped;
}
