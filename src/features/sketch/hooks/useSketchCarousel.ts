// useSketchCarousel.ts
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTimelineStore } from "@/features/timeline/hooks/useTimelineStore";

/**
 * useSketchCarousel
 * Hook personalizado que maneja la navegación de slides en el carrusel de Sketch.
 * Además gestiona el estado de los datos de los lienzos (notesData) y sus actualizaciones.
 */
export function useSketchCarousel() {
  const { selectedKey, setSelectedKey, selectedTimeline } = useTimelineStore();

  // Estructura base: "GENERAL" + items de la estructura del timeline
  const structure = useMemo(
    () => selectedTimeline?.structure || [],
    [selectedTimeline]
  );

  const allSlides = useMemo(() => ["GENERAL", ...structure], [structure]);

  // Estado para manejar la navegación
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInternalChange, setIsInternalChange] = useState(false);

  // Estado local para los datos de los lienzos
  const [notesData, setNotesData] = useState<Record<string, string>>({});

  /**
   * Manejador para las flechas de teclado.
   */
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

  /**
   * Cuando cambia el activeIndex (por teclado o miniatura), actualizar selectedKey.
   */
  useEffect(() => {
    if (isInternalChange) {
      const newKey = allSlides[activeIndex];
      if (newKey && newKey !== selectedKey) {
        setSelectedKey(newKey);
      }
      setIsInternalChange(false);
    }
  }, [activeIndex, allSlides, selectedKey, setSelectedKey, isInternalChange]);

  /**
   * Cuando cambia selectedKey (desde fuera), actualizar activeIndex.
   */
  useEffect(() => {
    if (!isInternalChange) {
      const idx = allSlides.findIndex((k) => k === selectedKey);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }, [selectedKey, allSlides, activeIndex, isInternalChange]);

  // currentKey activo
  const currentKey = allSlides[activeIndex];

  // currentTitle para mostrar arriba
  const currentTitle = useMemo(() => {
    if (activeIndex === 0) return "GENERAL";
    const itemKey = structure[activeIndex - 1] || "";
    return `BOSQUEJO ${itemKey}`;
  }, [activeIndex, structure]);

  /**
   * Función para navegar a un slide manualmente (por click en miniatura)
   */
  const goToSlide = (index: number) => {
    setIsInternalChange(true);
    setActiveIndex(index);
  };

  return {
    allSlides,
    activeIndex,
    currentKey,
    currentTitle,
    notesData,
    setNotesData,
    goToSlide,
    setSelectedKey,
  };
}
