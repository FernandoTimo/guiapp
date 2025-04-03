"use client";

/**
 * SketchCarousel.tsx
 * Muestra "GENERAL" + items del timeline (vía useTimelineStore).
 * Cada slide se asocia a un noteKey.
 * Almacena base64 local en notesData y, a su vez, useSketchCanvas guardará en DB.
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTimelineStore } from "@/hooks/useTimelineStore";
import SketchCanvas from "./SketchCanvas";
import SketchToolbar from "./SketchToolbar";

export default function SketchCarousel() {
  const { selectedKey, setSelectedKey, selectedTimeline } = useTimelineStore();

  // Estructura: timeline?.structure => array de strings
  const structure = useMemo(
    () => selectedTimeline?.structure || [],
    [selectedTimeline]
  );
  // "GENERAL" + items
  const allSlides = useMemo(() => ["GENERAL", ...structure], [structure]);

  // Índice local
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInternalChange, setIsInternalChange] = useState(false);

  // Estado local => base64 de cada lienzo
  const [notesData, setNotesData] = useState<Record<string, string>>({});

  // Flechas → y ←
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIsInternalChange(true);
        setActiveIndex((prev) => Math.min(prev + 1, allSlides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIsInternalChange(true);
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [allSlides.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Sincronizar activeIndex => selectedKey (cambio interno)
  useEffect(() => {
    if (isInternalChange) {
      const newKey = allSlides[activeIndex];
      if (newKey && newKey !== selectedKey) {
        setSelectedKey(newKey);
      }
      setIsInternalChange(false);
    }
  }, [activeIndex, allSlides, selectedKey, setSelectedKey, isInternalChange]);

  // Sincronizar selectedKey => activeIndex (cambio externo)
  useEffect(() => {
    if (!isInternalChange) {
      const idx = allSlides.findIndex((k) => k === selectedKey);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }, [selectedKey, allSlides, activeIndex, isInternalChange]);

  // Título arriba
  const currentTitle = useMemo(() => {
    if (activeIndex === 0) return "GENERAL";
    const itemKey = structure[activeIndex - 1] || "";
    return `ITEM ${activeIndex} (${itemKey})`;
  }, [activeIndex, structure]);

  // noteKey del slide actual
  const currentKey = allSlides[activeIndex];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Título */}
      <div className="text-center text-white text-xs font-bold uppercase tracking-widest mb-1">
        {currentTitle}
      </div>

      {/* Lienzo */}
      <div className="flex-1 rounded-xl overflow-hidden">
        <SketchCanvas
          noteKey={currentKey}
          notesData={notesData}
          setNotesData={setNotesData}
        />
      </div>

      {/* Dots */}
      <div className="mt-2 flex justify-center gap-1">
        {allSlides.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === activeIndex ? "bg-white" : "bg-neutral-600"
            }`}
          />
        ))}
      </div>

      {/* Barra herramientas */}
      <SketchToolbar />
    </div>
  );
}
