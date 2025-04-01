"use client";

import { useSketchStore } from "@/hooks/useSketchStore";
import { useScript } from "@/hooks/useScript";
import { supabase } from "@/lib/supabase/client";
import React, { useEffect, useRef } from "react";

const SketchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastImage = useRef<string | null>(null);

  const { color: strokeColor, size: strokeWidth, tool } = useSketchStore();
  const { script } = useScript();
  const scriptId = script?.id;

  // Cargar lienzo guardado
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

  // Inicializar tamaño del canvas
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

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || e.button !== 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";

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

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none bg-transparent touch-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
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
          border: tool === "eraser" ? "2px solid white" : "none",
          mixBlendMode: "difference",
        }}
      />
    </div>
  );
};

export default SketchCanvas;
