// src/hooks/useTimelineStore.ts
import { create } from "zustand";

export interface Timeline {
  id: string;
  title: string;
  structure: string[];
  usages: string[];
  created_at?: string;
}

interface TimelineStore {
  selectedTimeline: Timeline | null;
  setSelectedTimeline: (timeline: Timeline | null) => void;
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  selectedTimeline: null,
  setSelectedTimeline: (timeline) => set({ selectedTimeline: timeline }),
  selectedKey: "",
  setSelectedKey: (key) => set({ selectedKey: key }),
}));
