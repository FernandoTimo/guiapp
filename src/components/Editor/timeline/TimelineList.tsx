// src/components/TimelineList.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timeline } from "@/hooks/useTimelines";

interface TimelineListProps {
  timelines: Timeline[];
  isOpen: boolean;
  onSelect: (timeline: Timeline) => void;
}

export function TimelineList({
  timelines,
  isOpen,
  onSelect,
}: TimelineListProps) {
  return (
    <AnimatePresence>
      {isOpen && timelines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-2 w-[90%] bg-neutral-900 p-4 rounded-2xl"
        >
          {timelines.map((timeline) => (
            <motion.div
              key={timeline.id}
              className="p-4 border-2 border-neutral-800 rounded-2xl cursor-pointer"
              whileHover={{ backgroundColor: "#222" }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelect(timeline)}
            >
              <div className="flex flex-wrap gap-2 w-full">
                {timeline.structure.map((item, index) => (
                  <span
                    key={index}
                    className="flex flex-1 justify-center items-center h-5 text-neutral-500 uppercase"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
