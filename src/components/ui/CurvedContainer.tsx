// src/components/ui/CurvedContainer.tsx
"use client";

import React from "react";

interface CurvedContainerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Rectángulo con dos esquinas redondeadas:
 * - Superior Izquierda: (rounded-tl-3xl)
 * - Inferior Derecha:   (rounded-br-3xl)
 * Ajusta libremente si quieres otras esquinas.
 */
export default function CurvedContainer({
  children,
  className = "",
}: CurvedContainerProps) {
  return (
    <div
      className={`
        relative
        border border-white/20
        bg-white/10
        text-white
        flex items-center justify-center
        rounded-tl-3xl
        rounded-br-3xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
