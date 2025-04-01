// src/components/TimelineSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTimelines, Timeline } from "@/hooks/useTimelines";
import { TimelineList } from "./TimelineList";
import { TimelineCreationForm } from "./TimelineCreationForm";
import { supabase } from "@/lib/supabase/client";

export default function TimelineSection() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
    null
  );

  // Estados para el formulario de creación
  const [newTitle, setNewTitle] = useState("");
  const [newStructure, setNewStructure] = useState("");
  const [newUsages, setNewUsages] = useState("");

  const { oldestTimeline, latestTimelines, loading, fetchTimelines } =
    useTimelines();

  // Aseguramos que el componente se renderice solo en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Inicialmente, usamos el timeline más antiguo como seleccionado
  useEffect(() => {
    if (oldestTimeline && !selectedTimeline) {
      setSelectedTimeline(oldestTimeline);
    }
  }, [oldestTimeline, selectedTimeline]);

  // Función para guardar un nuevo timeline, con validación
  const handleSaveNewTimeline = async () => {
    if (!newTitle.trim() || !newStructure.trim() || !newUsages.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    const structureArray = newStructure
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    const usagesArray = newUsages
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    const { data, error } = await supabase
      .from("timelines")
      .insert([
        { title: newTitle, structure: structureArray, usages: usagesArray },
      ]);
    if (error) {
      console.error("Error al guardar el timeline:", error.message);
    } else {
      console.log("Timeline guardado:", data);
      // Limpiar campos y cerrar el formulario
      setNewTitle("");
      setNewStructure("");
      setNewUsages("");
      setIsCreating(false);
      // Refrescar los timelines
      fetchTimelines();
    }
  };

  if (!mounted) return null;

  return (
    <section className="flex fixed flex-row bottom-5 left-1/2 transform -translate-x-1/2 w-[50%] text-white items-end gap-2">
      <div className="flex items-center flex-col flex-1 gap-5 max-h-[50vh]">
        {loading ? (
          <div className="p-4">Cargando...</div>
        ) : (
          <>
            {/* Lista de los 4 últimos timelines */}
            <TimelineList
              timelines={latestTimelines}
              isOpen={isOpen}
              onSelect={(timeline) => setSelectedTimeline(timeline)}
            />
            {/* Sección principal para mostrar el timeline seleccionado o el formulario */}
            {selectedTimeline && (
              <div className="p-2 flex-1 w-full bg-neutral-900 rounded-3xl">
                <div className="flex flex-col gap-2 w-full">
                  {!isCreating ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTimeline.structure.map((item, index) => (
                        <span
                          key={index}
                          className="flex flex-1 justify-center items-center bg-neutral-950 text-neutral-700 uppercase rounded-2xl h-10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <TimelineCreationForm
                      newTitle={newTitle}
                      newStructure={newStructure}
                      newUsages={newUsages}
                      setNewTitle={setNewTitle}
                      setNewStructure={setNewStructure}
                      setNewUsages={setNewUsages}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex h-10 w-60 mb-2 gap-2">
        {isCreating ? (
          <>
            <button
              className="flex-1 border-2 border-green-600 rounded-2xl text-sm text-green-600"
              onClick={handleSaveNewTimeline}
            >
              Guardar
            </button>
            <button
              className="flex-1 px-2 py-1 rounded-2xl text-sm border-2 border-red-900 text-red-500"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="flex-1 border-2 border-amber-900 rounded-2xl text-sm text-amber-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Ocultar" : "Cambiar"}
            </button>
            <button
              className="flex-1 border-2 border-blue-600 rounded-2xl text-sm text-blue-600"
              onClick={() => {
                setIsCreating(true);
                setIsOpen(false);
              }}
            >
              Crear Nuevo
            </button>
          </>
        )}
      </div>
    </section>
  );
}
