"use client";
/**
 * @file TimelineCreationForm.tsx
 * @description Formulario para crear un nuevo Timeline. Recibe los valores y setters
 *   como props, y notifica al componente padre cuando el usuario envía la información.
 */

import React from "react";

interface TimelineCreationFormProps {
  newTitle: string;
  newStructure: string;
  newUsages: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewStructure: React.Dispatch<React.SetStateAction<string>>;
  setNewUsages: React.Dispatch<React.SetStateAction<string>>;
}

export function TimelineCreationForm({
  newTitle,
  newStructure,
  newUsages,
  setNewTitle,
  setNewStructure,
  setNewUsages,
}: TimelineCreationFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Título"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Estructura (separada por comas)"
        value={newStructure}
        onChange={(e) => setNewStructure(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-2 rounded bg-neutral-800 text-white"
        placeholder="Usages (separados por comas)"
        value={newUsages}
        onChange={(e) => setNewUsages(e.target.value)}
      />
    </div>
  );
}
