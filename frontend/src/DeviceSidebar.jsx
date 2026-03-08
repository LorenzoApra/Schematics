import { useState, useEffect } from "react";
import { getTemplates, addTemplate } from "./api";

export default function DeviceSidebar({ onAdd }) {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#dddddd");

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  function handleSaveTemplate() {
    if (!name.trim()) return;
    addTemplate({ name, color }).then(t => {
      setTemplates([...templates, t]);
      setName("");
    });
  }

  return (
    <div style={{ width: 220, padding: 20 }}>
      <h3>Device Library</h3>

      {templates.map(t => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          <button
            style={{
              width: "100%",
              background: t.color,
              padding: 10,
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => onAdd(t.name, t.color)}
          >
            {t.name}
          </button>
        </div>
      ))}

      <hr style={{ margin: "20px 0" }} />

      <h3>Create Custom</h3>

      <input
        placeholder="Device name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={() => onAdd(name, color)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        Add to Canvas
      </button>

      <button
        onClick={handleSaveTemplate}
        style={{ width: "100%" }}
      >
        Save to Library
      </button>
    </div>
  );
}
