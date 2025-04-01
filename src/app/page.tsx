import dynamic from "next/dynamic";
import Sidebar from "@/components/sidebar/SideBar";
import { Suspense } from "react";

// ⬇️ Cargar Editor dinámicamente como client component
const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Suspense fallback={<div>Cargando editor...</div>}>
        <Editor />
      </Suspense>
    </div>
  );
}
