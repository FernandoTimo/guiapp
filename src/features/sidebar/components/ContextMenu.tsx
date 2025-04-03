"use client";
/**
 * @file ContextMenu.tsx
 * @description Componente para mostrar el menú contextual del SidebarItem.
 *
 * Muestra las opciones:
 *  - Compartir
 *  - Cambiar el nombre
 *  - Archivar
 *  - Eliminar
 *
 * Recibe callbacks para cada acción, lo que permite separar la lógica
 * de la UI y facilitar la escalabilidad.
 */

import React from "react";

interface ContextMenuProps {
  onShare: () => void;
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function ContextMenu({
  onShare,
  onRename,
  onArchive,
  onDelete,
}: ContextMenuProps) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-neutral-800 border border-neutral-700 rounded-xl text-sm shadow-md w-44">
      <div
        className="px-4 py-2 text-neutral-300 border-b border-neutral-700 cursor-pointer"
        onClick={onShare}
      >
        🔗 Compartir
      </div>
      <div
        className="px-4 py-2 text-neutral-300 border-b border-neutral-700 cursor-pointer"
        onClick={onRename}
      >
        ✏️ Cambiar el nombre
      </div>
      <div
        className="px-4 py-2 text-neutral-300 border-b border-neutral-700 cursor-pointer"
        onClick={onArchive}
      >
        📁 Archivar
      </div>
      <button
        onClick={onDelete}
        className="px-4 py-2 text-red-500 text-left w-full hover:bg-red-900"
      >
        🗑️ Eliminar
      </button>
    </div>
  );
}
