"use client";

import Nodge from "@/components/ui/nodge";
/**
 * @file SketchCarousel.tsx
 * @description Componente visual principal para manejar el carrusel de lienzos de dibujo.
 *
 * Integra:
 * - SketchCanvas: para dibujar en el lienzo actual.
 * - SketchToolbar: barra de herramientas flotante (ej. botón de limpiar).
 * - Miniaturas (PopOver): permite navegar rápidamente entre slides mediante thumbnails.
 *
 * La lógica de navegación y sincronización está delegada al hook `useSketchCarousel`.
 */

import { useSketchCarousel } from "../hooks/useSketchCarousel";
import SketchCanvas from "./SketchCanvas";
import SketchToolbar from "./SketchToolbar";

import { useScript } from "@/features/script/hooks/useScript";
import Image from "next/image";

export default function SketchCarousel() {
  const {
    allSlides,
    currentTitle,
    currentKey,
    notesData,
    setNotesData,
    setSelectedKey,
  } = useSketchCarousel();

  const { script } = useScript();

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Título actual del slide */}
      <div className="absolute top-[-5] self-center text-center text-neutral-400 text-[11px] font-bold uppercase tracking-widest bg-amber-100 mb-1 z-15">
        <Nodge className="p-1 w-30 h-6" color="#000">
          {currentTitle}
        </Nodge>
      </div>

      {/* Canvas principal para dibujar */}
      <div className="flex-1 rounded-xl overflow-hidden">
        <SketchCanvas
          noteKey={currentKey}
          notesData={notesData}
          setNotesData={setNotesData}
        />
      </div>

      {/* Dots + Miniaturas (Popover) */}
      <div className="flex justify-center items-center absolute bottom-[-45] hover:bottom-[-10] py-2 transition-all duration-150 cursor-pointer left-1/2 transform -translate-x-1/2  w-[100%]">
        <div className=" transition-all duration-150 h-20 flex justify-center items-center rounded-sm bg-neutral-950">
          <div className="flex h-full flex-wrap gap-1 transition-all duration-100 items-center opacity-50 hover:opacity-100 ">
            {allSlides.map((slideKey, index) => {
              const thumbnail = script?.miniaturas?.[slideKey]; // Miniatura asociada al slide
              return (
                <div
                  key={index}
                  onClick={() => setSelectedKey(slideKey)}
                  className={`w-10 h-[100%] transition-all duration-100 bg-neutral-950 rounded overflow-hidden  flex items-center justify-center cursor-pointer hover:border-2 border-neutral-900 bg-[radial-gradient(#4445_1px,transparent_1px)] bg-[length:5px_5px]  ${
                    currentKey === slideKey &&
                    "border-2 border-white/15 transform scale-110"
                  }`}
                >
                  {thumbnail && (
                    <Image
                      src={thumbnail}
                      alt={slideKey}
                      width={500}
                      height={2000}
                      className="object-fill h-full w-full"
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de herramientas (limpiar lienzo, etc) */}
      <SketchToolbar />
    </div>
  );
}
