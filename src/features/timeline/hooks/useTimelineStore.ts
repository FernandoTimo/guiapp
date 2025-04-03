"use client";
/**
 * @file useTimelineStore.ts
 * @description Store global (con Zustand o similar) para manejar la selección
 *   de un timeline y la sección (key) activa.
 *
 * @remarks
 *   - Suele ser útil cuando necesitas compartir estado entre varios componentes
 *     sin pasar props. Maneja la timeline seleccionada y la "sección" actual (selectedKey).
 */

import { create } from "zustand";
import { Timeline } from "../types/timelineTypes";

interface TimelineStoreState {
  selectedTimeline: Timeline | null;
  selectedKey: string;
  setSelectedTimeline: (timeline: Timeline) => void;
  setSelectedKey: (key: string) => void;
}

export const useTimelineStore = create<TimelineStoreState>((set) => ({
  selectedTimeline: null,
  selectedKey: "",
  setSelectedTimeline: (timeline) =>
    set(() => ({ selectedTimeline: timeline })),
  setSelectedKey: (key) => set(() => ({ selectedKey: key })),
}));
