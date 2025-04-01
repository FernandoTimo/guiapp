// app/[id]/page.tsx
import NotesSection from "@/components/editor/notes/NotesSection";
import ScriptSection from "@/components/editor/script/ScriptSection";
import TimelineSection from "@/components/editor/timeline/TimelineSection";
import Sidebar from "@/components/sidebar/SideBar";
import React from "react";

// ✅ define tú mismo el tipo de params
type Props = {
  params: {
    id: string;
  };
};

// ❌ NO pongas "use client" aquí
export default function EditorPage({ params }: Props) {
  // Este log solo se ejecuta en el servidor
  console.log("ID recibido por la ruta:", params.id);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative p-4">
        <ScriptSection />
        <TimelineSection />
        <NotesSection />
      </main>
    </div>
  );
}
