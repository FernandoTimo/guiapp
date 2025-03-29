"use client";

import React from "react";
import ScriptSection from "./script/ScriptSection";
import TimelineSection from "./timeline/TimelineSection";
import NotesSection from "./notes/NotesSection";

export default function Editor() {
  return (
    <main className="flex-1 relative p-4">
      <ScriptSection />
      <TimelineSection />
      <NotesSection />
    </main>
  );
}
