"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * TemplatesContent
 *
 * Este componente se encarga de leer los parámetros de búsqueda (por ejemplo, "removed")
 * y renderizar el contenido correspondiente de la página de plantillas.
 */
function TemplatesContent() {
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

/**
 * TemplatesPage
 *
 * Componente principal de la página de plantillas.
 * Envuelve el contenido en un Suspense para que useSearchParams se ejecute correctamente.
 */
export default function TemplatesPage() {
  return (
    <Suspense fallback={<div>Cargando plantillas...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
