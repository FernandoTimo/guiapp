"use client";

import { useRef } from "react";

export function useSwipeDownInComponent(onSwipeDown: () => void) {
  const touchStartY = useRef<number | null>(null);

  const handleTouchStartDown = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMoveDown = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 50) {
      // Se deslizó hacia abajo más de 50px
      onSwipeDown();
      touchStartY.current = null; // Evitar que dispare múltiples veces
    }
  };

  const handleTouchEndDown = () => {
    touchStartY.current = null;
  };

  return {
    handleTouchStartDown,
    handleTouchMoveDown,
    handleTouchEndDown,
  };
}
