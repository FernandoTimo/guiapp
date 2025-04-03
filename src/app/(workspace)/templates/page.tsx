"use client";

import { useSearchParams } from "next/navigation";

export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const removedId = searchParams.get("removed");

  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8 text-white">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-semibold">
          Elige entre estas plantillas para empezar a trabajar
        </h1>
        {removedId && (
          <p className="text-sm text-neutral-400">
            El guión con ID{" "}
            <span className="font-mono text-red-400">{removedId}</span> no
            existe o fue eliminado.
          </p>
        )}
        {/* Aquí podrías mostrar plantillas futuras */}
      </div>
    </div>
  );
}
