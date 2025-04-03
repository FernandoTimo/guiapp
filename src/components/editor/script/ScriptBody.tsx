"use client";

import { useEffect, useRef, useState } from "react";
import { useScript } from "@/hooks/useScript";
import { useTimelineStore } from "@/features/timeline/hooks/useTimelineStore";

export default function ScriptBody() {
  const { script, updateScript } = useScript();
  const { selectedKey, setSelectedKey } = useTimelineStore();

  const [localBody, setLocalBody] = useState<Record<string, string>>({});
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");

  // 🧠 Transformar array a objeto local editable
  useEffect(() => {
    if (!script?.body) return;
    const transformed = script.body.reduce((acc, part) => {
      const key = Object.keys(part)[0];
      acc[key] = part[key];
      return acc;
    }, {} as Record<string, string>);
    setLocalBody(transformed);
  }, [script?.body]);

  // 💾 Guardado automático
  useEffect(() => {
    if (!selectedKey || !script?.body || !updateScript) return;

    const handler = setTimeout(() => {
      const newBody = Object.entries(localBody).map(([k, v]) => ({ [k]: v }));
      updateScript({ body: newBody });
    }, 600);

    return () => clearTimeout(handler);
  }, [localBody, selectedKey, script?.body, updateScript]);

  // 🎙️ Configuración de reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-PE";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setLocalBody((prev) => ({
          ...prev,
          [selectedKey]: (prev[selectedKey] || "") + final,
        }));
      }

      setInterimText(interim);
    };

    recognitionRef.current = recognition;
  }, [selectedKey]);

  // 👂 Eventos de teclado global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        if (!isListening && recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === "Alt" || e.key === "Enter") && isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        setInterimText("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isListening]);

  if (!selectedKey) return null;

  return (
    <div className="mt-10 text-white">
      <div className="relative p-6 border border-neutral-800 bg-neutral-900 rounded-lg">
        {Object.entries(localBody).map(([key, value]) => (
          <div key={key} className="relative mb-6 group">
            <button
              onClick={() => setSelectedKey(key)}
              className={`absolute -left-24 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                ${
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
