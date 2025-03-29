"use client";

import React from "react";
import CreateScriptSection from "./editor/CreateScriptSection";
import TimelineSection from "./editor/timeline/TimelineSection";
import BrainstormingSection from "./editor/BrainstormingSection";

export default function Editor() {
  return (
    <main className="flex-1 relative p-4">
      <CreateScriptSection />
      <TimelineSection />
      <BrainstormingSection />
    </main>
  );
}
