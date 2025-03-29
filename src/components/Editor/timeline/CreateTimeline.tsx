// src/components/TimelineSection.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TimelineSection: React.FC = () => {
  const [title, setTitle] = useState("");
  const [structure, setStructure] = useState<string[]>([""]);
  const [usages, setUsages] = useState<string[]>([""]);

  const handleAddStructure = () => {
    setStructure([...structure, ""]);
  };

  const handleStructureChange = (index: number, value: string) => {
    const newStructure = [...structure];
    newStructure[index] = value;
    setStructure(newStructure);
  };

  const handleAddUsage = () => {
    setUsages([...usages, ""]);
  };

  const handleUsageChange = (index: number, value: string) => {
    const newUsages = [...usages];
    newUsages[index] = value;
    setUsages(newUsages);
  };

  const handleSaveTimeline = async () => {
    const { data, error } = await supabase
      .from("timelines")
      .insert([{ title, structure, usages }]);

    if (error) {
      console.error("Error al guardar el timeline:", error.message);
    } else {
      console.log("Timeline guardado:", data);
      // Resetear campos después de guardar
      setTitle("");
      setStructure([""]);
      setUsages([""]);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Timeline</h2>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Estructura:</label>
        {structure.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleStructureChange(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleAddStructure}>Agregar Item</button>
      </div>
      <div>
        <label>Usages (Links de Video):</label>
        {usages.map((link, index) => (
          <div key={index}>
            <input
              type="text"
              value={link}
              onChange={(e) => handleUsageChange(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleAddUsage}>Agregar Link</button>
      </div>
      <button onClick={handleSaveTimeline}>Guardar Timeline</button>
    </div>
  );
};

export default TimelineSection;
