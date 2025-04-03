"use client";
/**
 * @file TimelineSection.tsx
 * @description Contenedor principal para la funcionalidad de Timeline:
 *   - Muestra la lista de timelines (TimelineList).
 *   - Permite crear uno nuevo (TimelineCreationForm).
 *   - Muestra la estructura actual del timeline seleccionado.
 *   - Integra con el store (useTimelineStore) y con useScript para vincular timeline_id al script.
 */

import React, { useEffect, useRef, useState } from "react";
import { useScript } from "@/hooks/useScript"; // Ajusta la import si cambiaste su ubicación
import { useTimelineStore } from "../hooks/useTimelineStore";
import { useTimeline } from "../hooks/useTimeline";
import { TimelineList } from "./TimelineList";
import { TimelineCreationForm } from "./TimelineCreationForm";

export default function TimelineSection() {
  // Refs y estados locales
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Campos del formulario de creación
  const [newTitle, setNewTitle] = useState("");
  const [newStructure, setNewStructure] = useState("");
  const [newUsages, setNewUsages] = useState("");

  // Hooks globales
  const { script, updateScript } = useScript();
  const { latestTimelines, createNewTimeline } = useTimeline();
  const { selectedTimeline, setSelectedTimeline, selectedKey, setSelectedKey } =
    useTimelineStore();

  // Efecto para indicar que el componente ya está montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cuando cargue el script, sincroniza con su timeline_id
  useEffect(() => {
    if (script?.timeline_id && latestTimelines.length > 0) {
      const timeline = latestTimelines.find((t) => t.id === script.timeline_id);
      if (timeline) {
        setSelectedTimeline(timeline);
        setSelectedKey(timeline.structure[0] || "");
      }
    }
  }, [
    script?.timeline_id,
    latestTimelines,
    setSelectedTimeline,
    setSelectedKey,
  ]);

  // Manejo de click fuera para cerrar el panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /**
   * handleSaveNewTimeline:
   *   - Valida campos.
   *   - Crea el nuevo timeline (con createNewTimeline).
   *   - Actualiza el script con el nuevo timeline_id.
   */
  const handleSaveNewTimeline = async () => {
    if (!newTitle.trim() || !newStructure.trim() || !newUsages.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const structureArray = newStructure
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const usagesArray = newUsages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const created = await createNewTimeline(
      newTitle,
      structureArray,
      usagesArray
    );
    if (created && updateScript && script?.id) {
      updateScript({ timeline_id: created.id });
      // Podrías hacer algo adicional si necesitas
    }

    // Limpia y cierra el formulario
    setNewTitle("");
    setNewStructure("");
    setNewUsages("");
    setIsCreating(false);
  };

  if (!mounted) return null;

  return (
    <section
      ref={containerRef}
      className="flex fixed flex-row bottom-5 left-1/2 transform -translate-x-1/2 w-[50%] text-white items-end gap-2 pointer-events-none"
    >
      {/* Bloque principal */}
      <div className="flex items-center flex-col flex-1 gap-5 max-h-[50vh]">
        <TimelineList
          timelines={latestTimelines}
          isOpen={isOpen}
          onSelect={(timeline) => {
            setSelectedTimeline(timeline);
            setSelectedKey(timeline.structure[0] || "");
            setIsOpen(false); // Cierra la lista
            if (script?.id && updateScript) {
              updateScript({ timeline_id: timeline.id });
            }
          }}
        />

        {selectedTimeline && (
          <div className="p-2 flex-1 w-full bg-neutral-900 rounded-3xl pointer-events-auto">
            <div className="flex flex-col gap-2 w-full">
              {!isCreating ? (
                // Renderizamos la estructura del timeline seleccionado
                <div className="flex flex-wrap gap-2">
                  {selectedTimeline.structure.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedKey(item)}
                      className={`flex-1 text-xs rounded-2xl px-3 py-1 uppercase transition-all duration-150 font-bold ${
                        selectedKey === item
                          ? "bg-pink-600 text-white"
                          : "bg-neutral-800 text-neutral-600 opacity-60"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                // Formulario de creación
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
      </div>

      {/* Botones inferiores (cambiar/crear timeline) */}
      <div className="flex h-10 w-60 mb-2 gap-2">
        {isCreating ? (
          <>
            <button
              className="flex-1 border-2 border-green-600 rounded-2xl text-sm text-green-600 pointer-events-auto"
              onClick={handleSaveNewTimeline}
            >
              Guardar
            </button>
            <button
              className="flex-1 border-2 border-red-800 rounded-2xl text-sm text-red-500 pointer-events-auto"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="flex-1 border-2 border-amber-900 rounded-2xl text-sm text-amber-500 pointer-events-auto"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? "Ocultar" : "Cambiar"}
            </button>
            <button
              className="flex-1 border-2 border-blue-600 rounded-2xl text-sm text-blue-600 pointer-events-auto"
              onClick={() => {
                setIsCreating(true);
                setIsOpen(false);
              }}
            >
              Crear nuevo
            </button>
          </>
        )}
      </div>
    </section>
  );
}
