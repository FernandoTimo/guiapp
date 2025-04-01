"use client";

import { useSketchStore } from "@/hooks/useSketchStore";
import { useScript } from "@/hooks/useScript";
import { supabase } from "@/lib/supabase/client";
import React, { useEffect, useRef, useState } from "react";

const SketchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastImage = useRef<string | null>(null);

  const strokeColor = useSketchStore((state) => state.color);
  const strokeWidth = useSketchStore((state) => state.size);
  const tool = useSketchStore((state) => state.tool);
  const setColor = useSketchStore((state) => state.setColor);
  const setSize = useSketchStore((state) => state.setSize);

  const { script } = useScript();
  const scriptId = script?.id;

  const [showCursor, setShowCursor] = useState(true);

  // 🖼️ Cargar la imagen guardada de notas
  useEffect(() => {
    const loadCanvasFromSupabase = async () => {
      if (!canvasRef.current || !scriptId) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const { data, error } = await supabase
        .from("scripts")
        .select("notas")
        .eq("id", scriptId)
        .single();

      if (error) return console.error("Error cargando notas:", error);

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (data?.notas) {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
        };
        image.src = data.notas;
        lastImage.current = data.notas;
      } else {
        lastImage.current = null;
      }
    };

    loadCanvasFromSupabase();
  }, [scriptId]);

  // 🎨 Ajustar tamaño del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { offsetWidth, offsetHeight } = canvas;
      if (!offsetWidth || !offsetHeight) return;

      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
      ctx.scale(dpr, dpr);

      if (lastImage.current) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, offsetWidth, offsetHeight);
        };
        img.src = lastImage.current;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 🎯 Dibujar
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.button !== 2) return; // solo izquierdo o derecho

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.globalCompositeOperation =
      e.button === 2 ? "destination-out" : "source-over";

    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;

    canvas.setPointerCapture(e.pointerId);

    if (cursorRef.current) {
      cursorRef.current.style.left = `${x}px`;
      cursorRef.current.style.top = `${y}px`;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing.current) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (cursorRef.current) {
      cursorRef.current.style.left = `${x}px`;
      cursorRef.current.style.top = `${y}px`;
    }
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (isDrawing.current) {
      ctx.closePath();
      isDrawing.current = false;

      try {
        const dataURL = canvas.toDataURL("image/png");
        lastImage.current = dataURL;

        const { error } = await supabase
          .from("scripts")
          .update({ notas: dataURL })
          .eq("id", scriptId);

        if (error) console.error("Error guardando notas:", error);
      } catch (err) {
        console.error("Error al guardar el lienzo:", err);
      }
    }

    canvas?.releasePointerCapture(e.pointerId);
  };

  // 🎡 Scroll para tamaño de herramienta
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -1 : 1;
    const isRightClick = e.buttons === 2;

    const factor = isRightClick ? 3 : 1;
    const newSize = Math.min(50, Math.max(1, strokeWidth + delta * factor));
    setSize(newSize);
  };
  useEffect(() => {
    const storedColor = localStorage.getItem("sketch_color");
    if (storedColor) setColor(storedColor);
    const colorMap: Record<string, string> = {
      Digit1: "#b8f2e6", // Blanco puro
      Digit2: "#ffaa00", // Naranja neón
      Digit3: "#aaf683", // Verde lima
      Digit4: "#ef476f", // Rojo neón
      Digit5: "#9400ff", // Violeta neón
      Digit6: "#00bfff", // Azul eléctrico
      Digit7: "#59cd90", // Fucsia
      Digit8: "#fec3a6", // Amarillo neón
      Digit9: "#000000", // Negro
      Digit0: "#ffffff", // Neón cyan
    };

    const handleAltColorChange = (e: KeyboardEvent) => {
      if (e.altKey && colorMap[e.code]) {
        e.preventDefault();
        setColor(colorMap[e.code]);
      }
    };

    window.addEventListener("keydown", handleAltColorChange);
    return () => {
      window.removeEventListener("keydown", handleAltColorChange);
    };
  }, [setColor]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none bg-transparent touch-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      {showCursor && (
        <div
          ref={cursorRef}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: strokeWidth,
            height: strokeWidth,
            left: "-100px",
            top: "-100px",
            transform: "translate(-50%, -50%)",
            backgroundColor: tool === "eraser" ? "transparent" : strokeColor,
            border: tool === "eraser" ? "2px solid #ddd" : "none",
            mixBlendMode: "difference",
          }}
        />
      )}
    </div>
  );
};

export default SketchCanvas;
