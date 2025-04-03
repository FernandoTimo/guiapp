import Link from "next/link";
import { useSidebarLogic } from "../hooks/useSidebarLogic";
import SidebarItem from "./SidebarItem";

interface Props {
  onAnyAction?: () => void;
}

export default function SidebarContent({ onAnyAction }: Props) {
  const { grouped, handleCreateScript, handleDeleted, handleRenamed } =
    useSidebarLogic();

  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-400 mb-2 uppercase">
        Proyectos
      </h3>

      <Link
        href="/"
        onClick={onAnyAction}
        className="mb-3 flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 px-3 py-2 rounded-xl transition"
      >
        🏠 Inicio
      </Link>

      <button
        onClick={async () => {
          await handleCreateScript();
          onAnyAction?.(); // cerrar después de crear
        }}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 px-3 py-2 rounded-xl transition"
      >
        ➕ Nuevo guión
      </button>

      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="mb-6">
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
                onClick={onAnyAction} // pasa también a cada ítem
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
