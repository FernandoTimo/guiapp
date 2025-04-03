"use client";

/**
 * @file useSketchCarousel.ts
 * @description Hook que encapsula la lógica de navegación de slides (flechas de teclado),
 *   y sincroniza con el timeline store (selectedKey, selectedTimeline).
 *
 *   - Retorna las slides a mostrar ("GENERAL" + estructura).
 *   - Expone activeIndex, currentTitle, etc.
 *   - Maneja isInternalChange para evitar bucles con selectedKey externo.
 *   - handleKeyDown: lógica de flechas (←, →).
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTimelineStore } from "@/hooks/useTimelineStore";

export function useSketchCarousel() {
  // 1) Integración con timeline store
  const { selectedKey, setSelectedKey, selectedTimeline } = useTimelineStore();

  // 2) Estructura
  const structure = useMemo(
    () => selectedTimeline?.structure || [],
    [selectedTimeline]
  );
  const allSlides = useMemo(() => ["GENERAL", ...structure], [structure]);

  // 3) Estado interno del carrusel
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInternalChange, setIsInternalChange] = useState(false);

  // 4) Lógica de flechas de teclado
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

  // 5) Al cambiar index internamente, actualizamos selectedKey
  useEffect(() => {
    if (isInternalChange) {
      const key = allSlides[activeIndex];
      if (key && key !== selectedKey) {
        setSelectedKey(key);
      }
      setIsInternalChange(false);
    }
  }, [activeIndex, allSlides, selectedKey, setSelectedKey, isInternalChange]);

  // 6) Si cambia selectedKey (desde fuera), sincronizamos activeIndex
  useEffect(() => {
    if (!isInternalChange) {
      const idx = allSlides.findIndex((k) => k === selectedKey);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }, [selectedKey, allSlides, activeIndex, isInternalChange]);

  // 7) currentTitle => "GENERAL" o "ITEM N (clave)"
  const currentTitle = useMemo(() => {
    if (activeIndex === 0) return "GENERAL";
    const itemKey = structure[activeIndex - 1] || "";
    return `ITEM ${activeIndex} (${itemKey})`;
  }, [activeIndex, structure]);

  // Retornamos todo lo necesario para construir el carrusel
  return {
    allSlides,
    activeIndex,
    currentTitle,
    handleKeyDown,
  };
}
