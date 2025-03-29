"use client";

import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h3 className="text-xl font-bold mb-4">Listado de guiones creados</h3>
      <ul className="space-y-2">
        <li>Personaje personalizado estático</li>
        <li>Frase bonita de bondad</li>
        <li>Solicitud de permiso familiar</li>
        <li>...</li>
      </ul>
    </aside>
  );
}
