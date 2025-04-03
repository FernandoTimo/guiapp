"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTimeline } from "@/hooks/useTimeline";
import { useTimelineStore } from "@/hooks/useTimelineStore";
import { TimelineList } from "./TimelineList";
import { TimelineCreationForm } from "./TimelineCreationForm";
import { supabase } from "@/lib/supabase/client";
import { useScript } from "@/hooks/useScript";

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newStructure, setNewStructure] = useState("");
  const [newUsages, setNewUsages] = useState("");

  const { script, updateScript } = useScript();
  const { latestTimelines, fetchTimelines } = useTimeline();
  const { selectedTimeline, setSelectedTimeline, selectedKey, setSelectedKey } =
    useTimelineStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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

    const { data, error } = await supabase
      .from("timelines")
      .insert([
        {
          title: newTitle,
          structure: structureArray,
          usages: usagesArray,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error al guardar timeline:", error.message);
      return;
    }

    setNewTitle("");
    setNewStructure("");
    setNewUsages("");
    setIsCreating(false);
    fetchTimelines();

    if (data?.id && updateScript) {
      updateScript({ timeline_id: data.id });
    }
  };

  if (!mounted) return null;

  return (
    <section
      ref={containerRef}
      className="flex fixed flex-row bottom-5 left-1/2 transform -translate-x-1/2 w-[50%] text-white items-end gap-2 pointer-events-none"
    >
      <div className="flex items-center flex-col flex-1 gap-5 max-h-[50vh] ">
        <TimelineList
          timelines={latestTimelines}
          isOpen={isOpen}
          onSelect={(timeline) => {
            setSelectedTimeline(timeline);
            setSelectedKey(timeline.structure[0] || "");
            setIsOpen(false); // ✅ Se cierra automáticamente
            if (script?.id) {
              updateScript({ timeline_id: timeline.id });
            }
          }}
        />

        {selectedTimeline && (
          <div className="p-2 flex-1 w-full bg-neutral-900 rounded-3xl pointer-events-auto">
            <div className="flex flex-col gap-2 w-full">
              {!isCreating ? (
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
