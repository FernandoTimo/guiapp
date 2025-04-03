"use client";
/**
 * @file useMousePosition.ts
 * @description Hook para capturar la posición global del mouse y controlar la visibilidad del cursor.
 *
 * Escucha "mousemove" y "mouseout" en window para actualizar la posición y visibilidad.
 *
 * @returns {Object} { pos: { x: number, y: number }, visible: boolean, setPos: Function }
 */

import { useEffect, useState } from "react";

export function useMousePosition() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseOut = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return { pos, visible, setPos };
}
