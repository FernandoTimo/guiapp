"use client";
/**
 * @file SidebarItem.tsx
 * @description Componente presentacional para representar un ítem en el Sidebar.
 *
 * Se encarga de renderizar la UI (texto, input, menú contextual) y delega toda la lógica de interacción al hook useSidebarItemLogic.
 */

import React from "react";
import { useSidebarItemLogic } from "../hooks/useSidebarItemLogic";
import ContextMenu from "./ContextMenu";

interface Props {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, newTitle: string) => void;
  onClick?: () => void; // nuevo
}

export default function SidebarItem({
  id,
  title,
  onDeleted,
  onRenamed,
  onClick,
}: Props) {
  const {
    containerRef,
    inputRef,
    editing,
    setEditing,
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
          onClick={() => {
            handleClick();
            onClick?.();
          }}
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
            setEditing(true);
            setShowMenu(false);
            setTimeout(() => inputRef.current?.focus(), 0);
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
