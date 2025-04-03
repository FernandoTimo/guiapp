"use client";
/**
 * @file useSidebarItemLogic.ts
 * @description Hook para encapsular la lógica de interacción de un SidebarItem.
 *
 * Se encarga de:
 *  - Manejar el estado de edición y el valor del input.
 *  - Diferenciar entre clic y doble clic para navegar o activar el modo edición.
 *  - Gestionar la visibilidad del menú contextual.
 *  - Ejecutar acciones de borrado y renombrado a través de supabase.
 *
 * Retorna los estados y funciones necesarias para que el componente de UI se centre solo en renderizar.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface SidebarItemLogicProps {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, newTitle: string) => void;
}

export function useSidebarItemLogic({
  id,
  title,
  onDeleted,
  onRenamed,
}: SidebarItemLogicProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const [showMenu, setShowMenu] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Actualiza el inputValue cuando title cambia.
  useEffect(() => {
    setInputValue(title);
  }, [title]);

  // Función para eliminar el script.
  const handleDelete = useCallback(async () => {
    const { error } = await supabase.from("scripts").delete().eq("id", id);
    if (!error) {
      if (pathname === `/${id}`) {
        router.push(`/templates?removed=${id}`);
      }
      onDeleted(id);
    }
  }, [id, pathname, router, onDeleted]);

  // Función para renombrar el script.
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

  // Manejo de clic simple (navegación) y doble clic (activar edición).
  const handleClick = useCallback(() => {
    if (clickTimeout.current) return;
    clickTimeout.current = setTimeout(() => {
      if (!editing) router.push(`/${id}`);
      clickTimeout.current = null;
    }, 250);
  }, [editing, id, router]);

  const handleDoubleClick = useCallback(() => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Cierra el menú contextual y, si se está editando, ejecuta handleRename al hacer clic fuera.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (editing) {
          handleRename();
        }
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, handleRename]);

  return {
    containerRef,
    inputRef,
    editing,
    setEditing, // Retornamos setEditing para poder activar edición desde la UI.
    inputValue,
    setInputValue,
    showMenu,
    setShowMenu,
    handleClick,
    handleDoubleClick,
    handleDelete,
    handleRename,
  };
}
