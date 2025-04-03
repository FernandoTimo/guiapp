"use client";
import { useEffect, useRef, useCallback } from "react";
import { useSketchStore } from "./useSketchStore";
import { useScript } from "@/hooks/useScript";
import { useSketchPersistence } from "../hooks/useSketchPersistence"; // <-- Nuevo: usamos el hook de persistencia

interface UseSketchCanvasProps {
  noteKey: string;
  notesData: Record<string, string>;
  setNotesData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function useSketchCanvas({
  noteKey,
  notesData,
  setNotesData,
}: UseSketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const { script } = useScript();
  const { color, size, tool, setColor, setSize } = useSketchStore();
  const { loadSketch, saveSketch } = useSketchPersistence(); // <-- Extraemos funciones de persistencia

  // Cargar la imagen desde DB para el noteKey si aún no está en estado local
  useEffect(() => {
    if (!noteKey || notesData[noteKey] || !script?.id) return;

    (async () => {
      const loaded = await loadSketch(noteKey);
      if (loaded) {
        setNotesData((prev) => ({
          ...prev,
          [noteKey]: loaded,
        }));
      }
    })();
  }, [noteKey, notesData, script?.id, setNotesData, loadSketch]);

  // Renderiza la imagen en el canvas
  useEffect(() => {
    const base64 = notesData?.[noteKey];
    if (!base64) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = base64;
  }, [noteKey, notesData]);

  // Ajuste del tamaño del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { offsetWidth, offsetHeight } = canvas;
      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
      ctx.scale(dpr, dpr);

      // Redibuja la imagen si existe en estado local
      const base64 = notesData?.[noteKey];
      if (base64) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, offsetWidth, offsetHeight);
        };
        img.src = base64;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [noteKey, notesData]);

  // Manejador de pointerDown
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      if (e.button !== 0 && e.button !== 2) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      if (tool === "eraser" || e.button === 2) {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = size;

      const rect = canvasRef.current.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);

      isDrawing.current = true;
      canvasRef.current.setPointerCapture(e.pointerId);
    },
    [tool, color, size]
  );

  // Manejador de pointerMove
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const rect = canvasRef.current.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    },
    []
  );

  // Manejador de pointerUp: aquí actualizamos el estado local y guardamos en DB en tiempo real
  const handlePointerUp = useCallback(
    async (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.closePath();
      canvas.releasePointerCapture(e.pointerId);
      ctx.globalCompositeOperation = "source-over";

      // Genera el dataURL del canvas
      const dataURL = canvas.toDataURL("image/png");
      // Actualiza el estado local para el noteKey correspondiente
      setNotesData((prev) => ({
        ...prev,
        [noteKey]: dataURL,
      }));

      // Guarda en la DB usando la función de persistencia (guardado en tiempo real)
      if (script?.id) {
        await saveSketch(noteKey, dataURL);
      }
    },
    [noteKey, script?.id, setNotesData, saveSketch]
  );

  // Manejador de rueda: cambia el tamaño del pincel
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      const isRightClick = e.buttons === 2;
      const factor = isRightClick ? 3 : 1;
      const newSize = Math.min(50, Math.max(1, size + delta * factor));
      setSize(newSize);
    },
    [size, setSize]
  );

  // Atajos alt+[0..9] para cambiar color
  useEffect(() => {
    const colorMap: Record<string, string> = {
      Digit1: "#b8f2e6",
      Digit2: "#ffaa00",
      Digit3: "#aaf683",
      Digit4: "#ef476f",
      Digit5: "#9400ff",
      Digit6: "#00bfff",
      Digit7: "#59cd90",
      Digit8: "#fec3a6",
      Digit9: "#000000",
      Digit0: "#ffffff",
    };
    const handleAltColor = (ev: KeyboardEvent) => {
      if (ev.altKey && colorMap[ev.code]) {
        ev.preventDefault();
        setColor(colorMap[ev.code]);
      }
    };
    window.addEventListener("keydown", handleAltColor);
    return () => window.removeEventListener("keydown", handleAltColor);
  }, [setColor]);

  return {
    canvasRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
