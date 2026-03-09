import React, { useEffect, useState } from "react";
import {
  getCategories,
  getDeviceModels,
  instantiateDeviceModel,
  createDeviceModel,
  createModelPort,
} from "../api";

export default function DeviceSidebar({ onAddDevice, onEditModel }) {
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState("");

  // Create Device Model form
  const [newModel, setNewModel] = useState({
    name: "",
    category_id: "",
  });

  const [newPorts, setNewPorts] = useState([{ name: "", type: "" }]);

  // ------------------------------------------------------------
  // LOAD DATA
  // ------------------------------------------------------------
  async function loadAll() {
    const cats = await getCategories();
    const mods = await getDeviceModels();

    setCategories(cats);
    setModels(mods);

    // initialize collapsed state
    const col = {};
    cats.forEach((c) => (col[c.id] = false));
    setCollapsed(col);
  }

  useEffect(() => {
    loadAll();
  }, []);

  // ------------------------------------------------------------
  // COLLAPSE CATEGORY
  // ------------------------------------------------------------
  function toggleCategory(catId) {
    setCollapsed((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  }

  // ------------------------------------------------------------
  // SEARCH FILTER
  // ------------------------------------------------------------
  function filterModelsBySearch(list) {
    if (!search.trim()) return list;
    return list.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ------------------------------------------------------------
  // CREATE DEVICE MODEL
  // ------------------------------------------------------------
  async function handleCreateModel() {
    if (!newModel.name || !newModel.category_id) return;

    // 1) Create model
    const created = await createDeviceModel({
      name: newModel.name,
      category_id: Number(newModel.category_id),
    });

    // 2) Create ports
    for (const p of newPorts) {
      if (p.name && p.type) {
        await createModelPort(created.id, {
          name: p.name,
          type: p.type,
        });
      }
    }

    // Reset form
    setNewModel({ name: "", category_id: "" });
    setNewPorts([{ name: "", type: "" }]);

    // Reload
    loadAll();
  }

  function addPortField() {
    if (newPorts.length >= 30) return;
    setNewPorts([...newPorts, { name: "", type: "" }]);
  }

  function updatePortField(index, field, value) {
    const updated = [...newPorts];
    updated[index][field] = value;
    setNewPorts(updated);
  }

  // ------------------------------------------------------------
  // INSTANTIATE MODEL → ADD DEVICE TO CANVAS
  // ------------------------------------------------------------
  async function handleAddToCanvas(modelId) {
    const dev = await instantiateDeviceModel(modelId);
    onAddDevice(dev);
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div style={{ width: 300, padding: 12, background: "#f5f5f5", height: "100vh", overflowY: "auto" }}>
      
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search devices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 12,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {/* CREATE DEVICE MODEL */}
      <div style={{ padding: 10, background: "#fff", borderRadius: 8, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Create Device Model</h3>

        <input
          type="text"
          placeholder="Model name"
          value={newModel.name}
          onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
          style={{ width: "100%", padding: 6, marginBottom: 8 }}
        />

        <select
          value={newModel.category_id}
          onChange={(e) => setNewModel({ ...newModel, category_id: e.target.value })}
          style={{ width: "100%", padding: 6, marginBottom: 12 }}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div style={{ marginBottom: 10 }}>
          <strong>Ports</strong>
          {newPorts.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input
                type="text"
                placeholder="Name"
                value={p.name}
                onChange={(e) => updatePortField(i, "name", e.target.value)}
                style={{ flex: 1, padding: 4 }}
              />
              <input
                type="text"
                placeholder="Type"
                value={p.type}
                onChange={(e) => updatePortField(i, "type", e.target.value)}
                style={{ flex: 1, padding: 4 }}
              />
            </div>
          ))}

          {newPorts.length < 30 && (
            <button onClick={addPortField} style={{ marginTop: 6 }}>
              + Add Port
            </button>
          )}
        </div>

        <button onClick={handleCreateModel} style={{ width: "100%", padding: 8 }}>
          Save Model
        </button>
      </div>

      {/* CATEGORY LIST */}
      {categories.map((cat) => {
        const catModels = filterModelsBySearch(
          models.filter((m) => m.category_id === cat.id)
        );

        return (
          <div key={cat.id} style={{ marginBottom: 12 }}>
            <div
              onClick={() => toggleCategory(cat.id)}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                padding: "6px 4px",
                background: "#ddd",
                borderRadius: 4,
              }}
            >
              {collapsed[cat.id] ? "▶" : "▼"} {cat.name}
            </div>

            {!collapsed[cat.id] && (
              <div style={{ marginLeft: 12, marginTop: 6 }}>
                {catModels.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: 6,
                      background: "#fff",
                      borderRadius: 6,
                      marginBottom: 6,
                      borderLeft: `4px solid ${cat.color || "#999"}`,
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{m.name}</div>

                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <button
                        onClick={() => handleAddToCanvas(m.id)}
                        style={{ flex: 1 }}
                      >
                        ➕ Add
                      </button>

                      <button
                        onClick={() => onEditModel(m)}
                        style={{ flex: 1 }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}

                {catModels.length === 0 && (
                  <div style={{ fontStyle: "italic", color: "#666" }}>
                    No models
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
