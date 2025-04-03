"use client";
/**
 * @file ScriptBody.tsx
 * @description Componente que renderiza el contenido editable del script.
 *
 * Utiliza el hook useScriptBodyEditor para obtener:
 *  - localBody: objeto con las secciones del guion.
 *  - isListening, interimText: para mostrar indicaciones del reconocimiento de voz.
 *  - selectedKey y setSelectedKey: para manejar la sección activa.
 *
 * Cada sección se renderiza con un textarea y un botón lateral para seleccionar la sección.
 */

import React from "react";
import { useScriptBodyEditor } from "../hooks/useScriptBodyEditor";

export default function ScriptBody() {
  const {
    localBody,
    setLocalBody,
    isListening,
    interimText,
    selectedKey,
    setSelectedKey,
  } = useScriptBodyEditor();

  if (!selectedKey) return null;

  return (
    <div className="mt-10 text-white">
      <div className="relative p-6 border border-neutral-800 bg-neutral-900 rounded-lg">
        {Object.entries(localBody).map(([key, value]) => (
          <div key={key} className="relative mb-6 group">
            <button
              onClick={() => setSelectedKey(key)}
              className={`absolute -left-24 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                key === selectedKey
                  ? "bg-pink-600 text-white"
                  : "bg-neutral-800 text-neutral-500 opacity-50"
              }`}
            >
              {key}
            </button>
            <textarea
              value={
                key === selectedKey
                  ? value +
                    (isListening && interimText ? " " + interimText : "")
                  : value
              }
              onChange={(e) =>
                setLocalBody((prev) => ({ ...prev, [key]: e.target.value }))
              }
              onFocus={() => setSelectedKey(key)}
              placeholder={`Escribe el contenido de "${key}"...`}
              className={`w-full bg-transparent p-1 outline-none resize-none text-base leading-relaxed transition duration-200 ${
                key !== selectedKey
                  ? "text-neutral-500 opacity-50"
                  : "text-white bg-neutral-800 rounded-lg shadow-inner"
              }`}
            />
            {key === selectedKey && isListening && (
              <div className="absolute right-4 top-3 animate-pulse text-blue-400 text-xs">
                🎤 Hablando...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
