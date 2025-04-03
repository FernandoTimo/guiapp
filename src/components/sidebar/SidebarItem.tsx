"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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

  const handleRename = async () => {
    const trimmed = inputValue.trim();

    // Si no se cambió el título o está vacío, solo salimos del modo edición
    if (!trimmed || trimmed === title) {
      setInputValue(title); // restauramos por si modificó sin guardar
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
  };

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
  }, [editing, inputValue]);

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
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-neutral-800 border border-neutral-700 rounded-xl text-sm shadow-md w-44">
          <div className="px-4 py-2 text-neutral-300 border-b border-neutral-700">
            🔗 Compartir
          </div>
          <div
            className="px-4 py-2 text-neutral-300 border-b border-neutral-700 cursor-pointer"
            onClick={() => {
              setEditing(true);
              setShowMenu(false);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            ✏️ Cambiar el nombre
          </div>
          <div className="px-4 py-2 text-neutral-300 border-b border-neutral-700">
            📁 Archivar
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-500 text-left w-full hover:bg-red-900"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
