"use client";

import React, { useEffect, useState } from "react";
import { useSketchStore } from "@/hooks/useSketchStore";

export default function CursorPreview() {
  const { tool, color, size } = useSketchStore();
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", leave);
    };
  }, []);

  // 👇 Forzamos actualización incluso si no se mueve el mouse
  useEffect(() => {
    // trigger re-render al cambiar color o herramienta
    setPos((pos) => ({ ...pos }));
  }, [color, tool, size]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        backgroundColor: tool === "eraser" ? "transparent" : color,
        border: tool === "eraser" ? "2px solid white" : "none",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
}
