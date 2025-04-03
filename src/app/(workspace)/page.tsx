import Editor from "@/components/editor/Editor";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando editor...</div>}>
      <Editor />
    </Suspense>
  );
}
