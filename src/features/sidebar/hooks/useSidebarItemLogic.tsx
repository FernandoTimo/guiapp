"use client";
/**
 * @file SidebarItem.tsx
 * @description Componente presentacional para un ítem en el Sidebar.
 *
 * Se encarga únicamente de la UI, delegando la lógica al hook useSidebarItemLogic
 * y el menú contextual a ContextMenu.
 */

import React from "react";
import ContextMenu from "./ContextMenu";
import { useSidebarItemLogic } from "../hooks/useSidebarItemLogic";

interface Props {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, newTitle: string) => void;
}

export default function SidebarItem({
  id,
  title,
  onDeleted,
  onRenamed,
}: Props) {
  const {
    containerRef,
    inputRef,
    editing,
    inputValue,
    setInputValue,
    showMenu,
    setShowMenu,
    handleClick,
    handleDoubleClick,
    handleDelete,
    handleRename,
  } = useSidebarItemLogic({ id, title, onDeleted, onRenamed });

  return (
    <div ref={containerRef} className="relative group">
      {editing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleRename();
            }
          }}
          autoFocus
          className="w-full text-sm px-3 py-2 rounded-xl bg-neutral-900 text-white border border-neutral-700"
        />
      ) : (
        <div
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className="block text-sm text-neutral-300 px-3 py-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
        >
          {title}
        </div>
      )}

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-white"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        •••
      </button>

      {showMenu && (
        <ContextMenu
          onShare={() => {
            console.log("Compartir", id);
            setShowMenu(false);
          }}
          onRename={() => {
            setShowMenu(false);
            // Activa el modo edición
            setInputValue(title);
            // Llama a handleDoubleClick o activa edición directamente
            handleDoubleClick();
          }}
          onArchive={() => {
            console.log("Archivar", id);
            setShowMenu(false);
          }}
          onDelete={() => {
            handleDelete();
            setShowMenu(false);
          }}
        />
      )}
    </div>
  );
}
