import Editor from "@/components/editor/Editor";
import Sidebar from "@/components/sidebar/SideBar";
import { Suspense } from "react";
// Carga dinámica de Editor como componente cliente

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
