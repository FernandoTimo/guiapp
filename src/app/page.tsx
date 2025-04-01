import Sidebar from "@/components/sidebar/SideBar";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// Carga dinámica de Editor como componente cliente
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
