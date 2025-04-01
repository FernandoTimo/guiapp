import NotesSection from "@/components/editor/notes/NotesSection";
import ScriptSection from "@/components/editor/script/ScriptSection";
import TimelineSection from "@/components/editor/timeline/TimelineSection";
import Sidebar from "@/components/sidebar/SideBar";
import React from "react";

// Tipado correcto para rutas dinámicas con Next.js App Router
interface PageProps {
  params: {
    id: string;
  };
}

export default function Editor({ params }: PageProps) {
  console.log("Editor ID:", params.id);

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
