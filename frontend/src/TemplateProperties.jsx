import { useState, useEffect } from "react";
import { updateTemplate, deleteTemplate } from "./api";

export default function TemplateProperties({
  template,
  onBack,
  refreshTemplates,
  refreshCategories,   // 👈 utile per aggiornare sidebar
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#cccccc");

  // -------------------------
  //   SYNC LOCAL STATE
  // -------------------------
  useEffect(() => {
    if (template) {
      setName(template.name);
      setColor(template.color || "#cccccc");
    }
  }, [template]);

  if (!template) return null;

  // -------------------------
  //   UPDATE TEMPLATE
  // -------------------------
  function handleSave() {
    updateTemplate(template.id, {
      name,
      color,
    }).then(() => {
      refreshTemplates();
      if (refreshCategories) refreshCategories();
      onBack();
    });
  }

  // -------------------------
  //   DELETE TEMPLATE
  // -------------------------
  function handleDelete() {
    deleteTemplate(template.id).then(() => {
      refreshTemplates();
      if (refreshCategories) refreshCategories();
      onBack();
    });
  }

  return (
    <div style={{ padding: 20 }}>
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        style={{
          marginBottom: 20,
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: 10 }}>Template Properties</h2>

      {/* NAME */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* COLOR */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: "100%",
            height: 40,
            padding: 0,
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        style={{
          background: "#4caf50",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        Save
      </button>

      {/* DELETE BUTTON */}
      <button
        onClick={handleDelete}
        style={{
          background: "#ff4444",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}
