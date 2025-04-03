"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScriptSection from "./script/ScriptSection";
import TimelineSection from "./timeline/TimelineSection";
import { createNewScript } from "@/lib/supabase/createScript";
import SketchSection from "@/features/sketch/components/SketchSection";

export default function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scriptId, setScriptId] = useState<string | null>(
    searchParams.get("id")
  );

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setScriptId(id);
      window.history.replaceState(null, "", `/${id}`);
    }
  }, [searchParams]);

  return (
    <main className="flex-1 relative p-4">
      {scriptId ? (
        <>
          <ScriptSection />
          <TimelineSection />
          <SketchSection />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="mb-4 text-neutral-400">
            Seleccione o cree un guion para empezar a trabajar.
          </p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={async () => {
              const newScriptId = await createNewScript();
              if (!newScriptId) return;

              // 1️⃣ Actualizar la URL
              router.replace(`/?id=${newScriptId}`);
              window.history.replaceState(null, "", `/${newScriptId}`);

              // 2️⃣ Forzar la actualización del estado
              setScriptId(newScriptId);
            }}
          >
            Crear Guion
          </button>
        </div>
      )}
    </main>
  );
}
