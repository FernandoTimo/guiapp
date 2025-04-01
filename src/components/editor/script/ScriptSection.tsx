import { useState, useEffect } from "react";
import { useScript } from "@/hooks/useScript";

export default function ScriptSection() {
  const { script, updateScript } = useScript();
  const [title, setTitle] = useState(script?.title || "");

  useEffect(() => {
    setTitle(script?.title || ""); // Sincroniza el estado cuando cambia el script
  }, [script?.title]); // ✅ Dependencia corregida

  useEffect(() => {
    if (!updateScript) return;

    const handler = setTimeout(() => {
      if (title && script?.title !== title) {
        updateScript({ title });
      }
    }, 500); // Espera 500ms después de la última tecla

    return () => clearTimeout(handler); // Cancela el timer si se sigue escribiendo
  }, [title, script?.title, updateScript]); // ✅ Dependencias corregidas

  return (
    <input
      className="w-full bg-transparent text-xl font-bold border-b border-neutral-600 focus:outline-none"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}
