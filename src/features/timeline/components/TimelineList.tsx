"use client";
/**
 * @file TimelineList.tsx
 * @description Muestra la lista de timelines disponibles y notifica cuando el usuario
 *   selecciona uno.
 *
 * @remarks
 *   - Usa AnimatePresence (framer-motion) para animar la aparición/desaparición.
 *   - Recibe `timelines`, `isOpen` y un callback `onSelectOne`.
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timeline } from "../types/timelineTypes";

interface TimelineListProps extends React.HTMLAttributes<HTMLDivElement> {
  timelines: Timeline[];
  isOpen: boolean;
  onSelectOne: (timeline: Timeline) => void;
}

export function TimelineList({
  timelines,
  isOpen,
  onSelectOne,
  ...props
}: TimelineListProps) {
  return (
    <AnimatePresence>
      {isOpen && timelines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-2 w-[280] bg-neutral-900 p-4 rounded-2xl pointer-events-auto"
          {...props}
        >
          {timelines.map((timeline) => (
            <motion.div
              key={timeline.id}
              className="p-4 border-2 border-neutral-800 rounded-2xl cursor-pointer"
              whileHover={{ backgroundColor: "#222" }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectOne(timeline)}
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
