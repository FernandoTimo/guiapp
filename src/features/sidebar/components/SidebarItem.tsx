"use client";
/**
 * @file SidebarItem.tsx
 * @description Componente para representar un ítem en el Sidebar.
 *
 * Permite ver, editar y manejar acciones del script.
 * Se ha refactorizado para delegar el menú contextual a un componente separado (ContextMenu).
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ContextMenu from "./ContextMenu";

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
  const router = useRouter();
  const pathname = usePathname();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const [showMenu, setShowMenu] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(title);
  }, [title]);

  const handleDelete = async () => {
    const { error } = await supabase.from("scripts").delete().eq("id", id);
    if (!error) {
      if (pathname === `/${id}`) {
        router.push(`/templates?removed=${id}`);
      }
      onDeleted(id);
    }
  };

  const handleRename = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === title) {
      setInputValue(title);
      setEditing(false);
      return;
    }
    const { error } = await supabase
      .from("scripts")
      .update({ title: trimmed })
      .eq("id", id);
    if (!error) {
      onRenamed(id, trimmed);
    }
    setEditing(false);
  }, [id, inputValue, title, onRenamed]);

  const handleClick = () => {
    if (clickTimeout.current) return;
    clickTimeout.current = setTimeout(() => {
      if (!editing) router.push(`/${id}`);
      clickTimeout.current = null;
    }, 250);
  };

  const handleDoubleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (editing) handleRename();
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, handleRename]);

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
