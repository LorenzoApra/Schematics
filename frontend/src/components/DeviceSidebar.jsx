import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  getDeviceModels,
  instantiateDeviceModel,
  createDeviceModel,
  createModelPort,
  deleteDeviceModel,
} from "../api";

export default function DeviceSidebar({ onAddDevice, onEditModel }) {
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState("");

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#888888",
  });

  const [newModel, setNewModel] = useState({
    name: "",
    category_id: "",
  });

  const [newPorts, setNewPorts] = useState([
    { name: "", type: "", direction: "inout" },
  ]);

  async function loadAll() {
    const cats = await getCategories();
    const mods = await getDeviceModels();

    setCategories(cats);
    setModels(mods);

    const col = {};
    cats.forEach((c) => (col[c.id] = false));
    setCollapsed(col);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function toggleCategory(catId) {
    setCollapsed((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  }

  function filterModelsBySearch(list) {
    if (!search.trim()) return list;
    return list.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  async function handleCreateCategory() {
    if (!newCategory.name) return;

    await createCategory({
      name: newCategory.name,
      color: newCategory.color,
    });

    setNewCategory({ name: "", color: "#888888" });
    loadAll();
  }

  async function handleCreateModel() {
    if (!newModel.name || !newModel.category_id) return;

    const created = await createDeviceModel({
      name: newModel.name,
      category_id: Number(newModel.category_id),
    });

    for (const p of newPorts) {
      if (p.name && p.type) {
        await createModelPort(created.id, {
          name: p.name,
          type: p.type,
          direction: p.direction || "inout",
        });
      }
    }

    setNewModel({ name: "", category_id: "" });
    setNewPorts([{ name: "", type: "", direction: "inout" }]);

    loadAll();
  }

  function addPortField() {
    if (newPorts.length >= 30) return;
    setNewPorts([...newPorts, { name: "", type: "", direction: "inout" }]);
  }

  function updatePortField(index, field, value) {
    const updated = [...newPorts];
    updated[index][field] = value;
    setNewPorts(updated);
  }

  async function handleAddToCanvas(modelId) {
    try {
      const device = await instantiateDeviceModel(modelId);
      onAddDevice(device);
    } catch (err) {
      console.error("Error creating device:", err);
    }
  }

  async function handleDeleteModel(modelId) {
    if (!window.confirm("Delete this model?")) return;
    await deleteDeviceModel(modelId);
    loadAll();
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        padding: 12,
        background: "#f5f5f5",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <input
        type="text"
        placeholder="Search devices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      {/* CREATE CATEGORY */}
      <div
        style={{
          padding: 12,
          background: "#fff",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>Create Category</h3>

        <input
          type="text"
          placeholder="Category name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          style={{ width: "100%", padding: 6 }}
        />

        <input
          type="color"
          value={newCategory.color}
          onChange={(e) =>
            setNewCategory({ ...newCategory, color: e.target.value })
          }
          style={{ width: "100%", padding: 6 }}
        />

        <button onClick={handleCreateCategory} style={{ padding: 8 }}>
          Save Category
        </button>
      </div>

      {/* CREATE MODEL */}
      <div
        style={{
          padding: 12,
          background: "#fff",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>Create Device Model</h3>

        <input
          type="text"
          placeholder="Model name"
          value={newModel.name}
          onChange={(e) =>
            setNewModel({ ...newModel, name: e.target.value })
          }
          style={{ width: "100%", padding: 6 }}
        />

        <select
          value={newModel.category_id}
          onChange={(e) =>
            setNewModel({ ...newModel, category_id: e.target.value })
          }
          style={{ width: "100%", padding: 6 }}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div>
          <strong>Ports</strong>
          {newPorts.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginTop: 6,
                padding: 6,
                background: "#f0f0f0",
                borderRadius: 4,
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={p.name}
                onChange={(e) => updatePortField(i, "name", e.target.value)}
                style={{ padding: 4 }}
              />
              <input
                type="text"
                placeholder="Type (DMX 5p, SDI, Dante...)"
                value={p.type}
                onChange={(e) => updatePortField(i, "type", e.target.value)}
                style={{ padding: 4 }}
              />
              <select
                value={p.direction}
                onChange={(e) =>
                  updatePortField(i, "direction", e.target.value)
                }
                style={{ padding: 4 }}
              >
                <option value="in">In</option>
                <option value="out">Out</option>
                <option value="inout">In-Out</option>
              </select>
            </div>
          ))}

          {newPorts.length < 30 && (
            <button onClick={addPortField} style={{ marginTop: 6 }}>
              + Add Port
            </button>
          )}
        </div>

        <button onClick={handleCreateModel} style={{ padding: 8 }}>
          Save Model
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categories.map((cat) => {
          const catModels = filterModelsBySearch(
            models.filter((m) => m.category_id === cat.id)
          );

          return (
            <div key={cat.id}>
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

                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: 6,
                        }}
                      >
                        <button
                          onClick={() => handleAddToCanvas(m.id)}
                          style={{ flex: 1 }}
                        >
                          ➕ Add
                        </button>

                        <button
                          onClick={() => onEditModel(m.id)}
                          style={{ flex: 1 }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleDeleteModel(m.id)}
                          style={{ flex: 1, background: "#f8d7da" }}
                        >
                          🗑 Delete
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
    </div>
  );
}
