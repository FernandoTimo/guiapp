"use client";

import React from "react";
import CreateScriptSection from "./Editor/CreateScriptSection";
import TimelineSection from "./Editor/TimelineSection";
import BrainstormingSection from "./Editor/BrainstormingSection";

export default function Editor() {
  return (
    <main className="flex-1 relative p-4">
      <CreateScriptSection />
      <TimelineSection />
      <BrainstormingSection />
    </main>
  );
}
