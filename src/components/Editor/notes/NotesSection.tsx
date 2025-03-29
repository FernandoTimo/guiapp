"use client";

import React from "react";

export default function NotesSection() {
  return (
    <section className="fixed right-4 top-4 w-80 h-[85vh]  border border-gray-300 rounded p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Sketch</h2>
      <textarea
        placeholder="Escribe tus ideas aquí..."
        className="w-full border rounded p-2"
        rows={6}
      ></textarea>
    </section>
  );
}
