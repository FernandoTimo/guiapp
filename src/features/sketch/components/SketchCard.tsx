"use client";

import React from "react";
import Image from "next/image";

export interface SketchCardProps {
  id: string;
  title: string;
  // Podría ser URL remota, un path local (public/...), o un base64 dataURL.
  thumbnail?: string;
  onSelect?: (id: string) => void;
  isActive?: boolean; // Podríamos resaltar la tarjeta activa
  date?: Date | string;
}

export default function SketchCard({
  id,
  title,
  thumbnail,
  onSelect,
  isActive,
  date,
}: SketchCardProps) {
  const handleClick = () => {
    if (onSelect) onSelect(id);
  };

  // Formateo opcional de fecha
  const dateString = date
    ? typeof date === "string"
      ? date
      : new Date(date).toLocaleDateString()
    : undefined;

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-32 h-40 cursor-pointer rounded-lg border 
        transition flex flex-col overflow-hidden
        ${
          isActive
            ? "border-white/70"
            : "border-neutral-700 hover:border-white/40"
        }
      `}
    >
      {/* Encabezado */}
      <div className="text-xs font-bold text-white p-1 line-clamp-1 bg-neutral-900/70">
        {title}
      </div>

      {/* Contenedor de la miniatura */}
      <div className="relative flex-1 bg-black/30">
        {thumbnail ? (
          // next/image con unspread de configuración
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            // Si es base64 y no deseas que Next optimice, usar:
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 italic">
            No thumbnail
          </div>
        )}
      </div>

      {/* Pie con fecha u otros datos */}
      {dateString && (
        <div className="text-[10px] text-neutral-500 px-1 py-0.5 bg-neutral-900/80">
          {dateString}
        </div>
      )}
    </div>
  );
}
