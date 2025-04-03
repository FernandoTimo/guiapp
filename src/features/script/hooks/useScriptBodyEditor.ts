"use client";
import { useEffect, useRef, useState } from "react";
import { useScript } from "@/features/script/hooks/useScript";
import { useTimelineStore } from "@/features/timeline/hooks/useTimelineStore";

/**
 * Declaramos los tipos para SpeechRecognition y SpeechRecognitionEvent
 * para que TypeScript reconozca estas APIs.
 */
declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
}

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

/**
 * @file useScriptBodyEditor.ts
 * @description Hook para gestionar la edición del scriptBody completo.
 *
 * Funcionalidades:
 *  - Transforma el script.body (array) en un objeto editable (localBody).
 *  - Realiza el guardado automático tras cambios (con debounce).
 *  - Configura el reconocimiento de voz para agregar texto a la sección activa.
 *
 * Retorna:
 *  - localBody: Objeto con las secciones del script.
 *  - setLocalBody: Función para actualizar el contenido local.
 *  - isListening, interimText: Estados del reconocimiento de voz.
 *  - selectedKey, setSelectedKey: La sección activa.
 */
export function useScriptBodyEditor() {
  const { script, updateScript } = useScript();
  const { selectedKey, setSelectedKey } = useTimelineStore();
  const [localBody, setLocalBody] = useState<Record<string, string>>({});
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");

  // Transformar el script.body (array) a objeto editable
  useEffect(() => {
    if (!script?.body) return;
    const transformed = script.body.reduce((acc, part) => {
      const key = Object.keys(part)[0];
      acc[key] = part[key];
      return acc;
    }, {} as Record<string, string>);
    setLocalBody(transformed);
  }, [script?.body]);

  // Guardado automático: Cada 600ms se actualiza la DB con el contenido actual
  useEffect(() => {
    if (!selectedKey || !script?.body || !updateScript) return;
    const handler = setTimeout(() => {
      const newBody = Object.entries(localBody).map(([k, v]) => ({ [k]: v }));
      updateScript({ body: newBody });
    }, 600);
    return () => clearTimeout(handler);
  }, [localBody, selectedKey, script?.body, updateScript]);

  // Configurar reconocimiento de voz
  useEffect(() => {
    // Obtenemos el constructor de SpeechRecognition de forma segura
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) return;

    const recognition: SpeechRecognition = new SpeechRecognitionConstructor();
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

  // Manejo global de eventos para iniciar y detener el reconocimiento de voz.
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

  return {
    localBody,
    setLocalBody,
    isListening,
    interimText,
    selectedKey,
    setSelectedKey,
  };
}
