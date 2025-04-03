"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Hook global para detectar "(max-width: 768px)"
import SketchCarousel from "./SketchCarousel";

export default function SketchSection() {
  // Detecta si estamos en móvil
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Estado de apertura/cierre
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de toggle en móvil */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-11">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-30 right-[0%] h-30 w-10 p-3 bg-neutral-900 rounded-l-3xl text-white"
          >
            {isOpen ? "->" : "<-"}
          </button>
        </div>
      )}
      <aside
        className={
          isMobile
            ? `fixed inset-0 z-10 flex items-center justify-center transition-transform duration-300 ${
                isOpen
                  ? "translate-x-0 delay-0"
                  : "translate-x-full delay-[100ms]"
              }`
            : "fixed right-4 top-[5vh] h-[80vh] w-72 flex flex-col justify-between z-10 bg-neutral-950"
        }
      >
        {isMobile && (
          // Fondo (overlay) con transición de opacidad
          <div
            className={`absolute inset-0 transition-opacity duration-00 ${
              isOpen
                ? "delay-[180ms] opacity-100 bg-neutral-900/50 backdrop-blur-[2px]"
                : "delay-0 opacity-0"
            }`}
          ></div>
        )}
        {isMobile ? (
          // Contenedor exterior: maneja el desplazamiento (transform)
          <div
            className={`relative z-20  bg-neutral-950 rounded-4xl p-2 w-[80%] h-[90%] overflow-hidden bg-[radial-gradient(#444_1px,transparent_1px)] bg-[length:16px_16px] transition-transform duration-100 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Contenedor interior: maneja la opacidad de forma rápida */}
            <div
              className={`transition-opacity duration-50 h-[100%] flex${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <SketchCarousel />
            </div>
          </div>
        ) : (
          // En escritorio, usamos el estilo original
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-800 bg-[radial-gradient(#444_1px,transparent_1px)] bg-[length:16px_16px] p-2">
            <SketchCarousel />
          </div>
        )}
      </aside>
    </>
  );
}
