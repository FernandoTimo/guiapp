"use client";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Hook global para detectar "(max-width: 768px)"
import SidebarContent from "./SidebarContent";

// Sidebar: Muestra el contenido completo en escritorio y, en móviles,
// muestra un botón de toggle que despliega el sidebar con animaciones.
export default function Sidebar() {
  // Detecta si estamos en un dispositivo móvil.
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Estado que controla si el sidebar está abierto en móviles.
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Botón de toggle en móvil: se muestra en la esquina inferior izquierda */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-11">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-30 left-[0%] h-30 w-10 p-3 bg-neutral-900 rounded-r-3xl text-white shadow-lg transition-all duration-100 hover:bg-neutral-800"
          >
            {isOpen ? "<-" : "->"}
          </button>
        </div>
      )}
      <aside
        // En móvil: el sidebar ocupa toda la pantalla y se desliza desde la izquierda.
        // En escritorio: se muestra el sidebar completo con un ancho fijo.
        className={
          isMobile
            ? `fixed inset-0 z-10 flex flex-col transition-transform duration-300 ${
                isOpen
                  ? "translate-x-0 delay-0"
                  : "-translate-x-full delay-[325ms]"
              }`
            : "w-64 bg-[#1e1e1e] text-white p-4 overflow-y-auto"
        }
      >
        {isMobile && (
          // Overlay para móviles: Fondo semitransparente con desenfoque que aparece al abrir el sidebar.
          <div
            className={`fixed inset-0 z-10 transition-opacity duration-200 ${
              isOpen ? "delay-[200ms] opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
        {isMobile ? (
          // En móvil, el contenido se renderiza dentro de un contenedor con padding y scroll.
          <div className="relative h-full w-[50%] p-4 overflow-y-auto bg-neutral-900">
            <SidebarContent />
          </div>
        ) : (
          // En escritorio, se muestra el contenido completo directamente.
          <SidebarContent />
        )}
      </aside>
    </>
  );
}
