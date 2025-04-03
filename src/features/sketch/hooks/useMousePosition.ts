"use client";

/**
 * @file useMousePosition.ts
 * @description Captura la posición global del mouse, así como si el cursor está
 *   dentro de la ventana (visible) o no. Se utilizan eventos window para detectar
 *   movimiento y salida.
 *
 *   - Retorna un objeto { pos, visible, setPos }
 *   - 'pos' => { x, y }
 *   - 'visible' => boolean
 *   - 'setPos' => te permite actualizar la posición manualmente
 *                 (por ejemplo, para forzar un re-render).
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
