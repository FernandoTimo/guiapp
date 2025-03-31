"use client";

import React from "react";

interface TimelineCreationFormProps {
  newTitle: string;
  newStructure: string;
  newUsages: string;
  setNewTitle: (value: string) => void;
  setNewStructure: (value: string) => void;
  setNewUsages: (value: string) => void;
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
    <div className="flex gap-2 h-10">
      <input
        type="text"
        placeholder="Título"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="border-2 border-neutral-700 px-2 rounded-2xl"
      />
      <input
        type="text"
        placeholder="Estructura"
        value={newStructure}
        onChange={(e) => setNewStructure(e.target.value)}
        className="border-2 border-neutral-700 px-2 rounded-2xl"
      />
      <input
        type="text"
        placeholder="Usages"
        value={newUsages}
        onChange={(e) => setNewUsages(e.target.value)}
        className="border-2 border-neutral-700 px-2 rounded-2xl"
      />
    </div>
  );
}
