"use client";

import React from "react";
import SketchCanvas from "./SketchCanvas";
import { SketchToolbar } from "./SketchToolbar";

export default function NotesSection() {
  return (
    <aside className="fixed right-4 top-[5vh] h-[80vh] w-72 bg-transparent flex flex-col justify-between z-10">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-800 bg-[radial-gradient(#444_1px,transparent_1px)] bg-[length:16px_16px] p-2">
        <SketchCanvas />
        <SketchToolbar />
      </div>
    </aside>
  );
}
