"use client";

/**
 * @file SketchSection.tsx
 * @description Sección fija (aside) que alberga el carrusel de dibujo (SketchCarousel)
 *   u otras funcionalidades relacionadas con el sketch. Se ubica en el lado derecho
 *   de la pantalla, con altura y anchura fijas.
 *
 *   - Incluye un contenedor con bordes, fondo y relleno (Tailwind classes).
 *   - Integra la lógica de SketchCarousel (que maneja slides, etc.).
 */

import React from "react";
import SketchCarousel from "./SketchCarousel";

export default function SketchSection() {
  return (
    <aside className="fixed right-4 top-[5vh] h-[80vh] w-72 flex flex-col justify-between z-10  bg-neutral-950">
      <div
        className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-800 
                      bg-[radial-gradient(#444_1px,transparent_1px)] bg-[length:16px_16px] p-2"
      >
        {/* Sección principal donde se renderiza el carrusel de dibujos */}
        <SketchCarousel />
      </div>
    </aside>
  );
}
