"use client";

import React from "react";

interface CursorPreviewProps {
  show: boolean;
  size: number;
  color: string;
  isEraser: boolean;
}

export default function CursorPreview({
  show,
  size,
  color,
  isEraser,
}: CursorPreviewProps) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        backgroundColor: isEraser ? "transparent" : color,
        border: isEraser ? "2px solid white" : "none",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
}
