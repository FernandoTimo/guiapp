"use client";

import React from "react";

export default function CreateScriptSection() {
  return (
    <section className="mb-4 w-[65vw]">
      <input
        type="text"
        placeholder="Título del guión"
        className="w-full border rounded p-2 mb-4"
      />
      <textarea
        placeholder="Escribe tu guión aquí..."
        className="w-full border rounded p-2"
        rows={6}
      ></textarea>
    </section>
  );
}
