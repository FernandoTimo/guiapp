import Editor from "@/features/editor/components/Editor";
import { Suspense } from "react";

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Cargando editor...</div>}>
      <Editor />
    </Suspense>
  );
}
