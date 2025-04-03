"use client";
/**
 * @file SidebarContent.tsx
 * @description Componente que renderiza el contenido común del Sidebar.
 *
 * Este componente se encarga de mostrar:
 *  - El título "Proyectos".
 *  - Un enlace de navegación a la página de inicio.
 *  - Un botón para crear un nuevo guión.
 *  - La lista de scripts agrupados por fecha, utilizando el componente SidebarItem.
 *
 * La lógica de carga, creación, eliminación, renombrado y agrupación de scripts
 * se gestiona en el hook `useSidebarLogic`, permitiendo que este componente se
 * concentre únicamente en la presentación.
 *
 * @returns {JSX.Element} El contenido renderizado del Sidebar.
 */
import Link from "next/link";
import { useSidebarLogic } from "../hooks/useSidebarLogic";
import SidebarItem from "./SidebarItem";

export default function SidebarContent() {
  // Extraemos la lógica del Sidebar: agrupación, creación y manejo de scripts.
  const { grouped, handleCreateScript, handleDeleted, handleRenamed } =
    useSidebarLogic();

  return (
    <div>
      {/* Título principal del Sidebar */}
      <h3 className="text-sm font-semibold text-neutral-400 mb-2 uppercase">
        Proyectos
      </h3>
      {/* Enlace de navegación a la página de inicio */}
      <Link
        href="/"
        className="mb-3 flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 px-3 py-2 rounded-xl transition"
      >
        🏠 Inicio
      </Link>
      {/* Botón para crear un nuevo guión */}
      <button
        onClick={handleCreateScript}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 px-3 py-2 rounded-xl transition"
      >
        ➕ Nuevo guión
      </button>
      {/* Se renderiza la lista de scripts agrupados por fecha */}
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="mb-6">
          {/* Título del grupo (por fecha) */}
          <h4 className="text-xs font-semibold text-neutral-500 mb-2">
            {section}
          </h4>
          <ul className="space-y-1">
            {items.map((script) => (
              <SidebarItem
                key={script.id}
                id={script.id}
                title={script.title}
                onDeleted={handleDeleted}
                onRenamed={handleRenamed}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
