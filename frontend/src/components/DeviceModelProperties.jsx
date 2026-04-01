import React, { useState, useEffect } from "react";
import {
  updateDeviceModel,
  createModelPort,
  deleteModelPort,
  deleteDeviceModel,
  getCategories,
} from "../api";
import { PORT_TYPES } from "../portTypes";

export default function DeviceModelProperties({ model, onClose, onUpdated }) {
  const [name, setName] = useState(model.name);
  const [categoryId, setCategoryId] = useState(model.category_id);
  const [categories, setCategories] = useState([]);
  const [ports, setPorts] = useState(model.ports || []);

  const [newPort, setNewPort] = useState({
    name: "",
    type: "",
    direction: "in",
  });

  useEffect(() => {
    loadCategories();
    setPorts(model.ports || []);
  }, [model]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleSave() {
    await updateDeviceModel(model.id, {
      name,
      category_id: Number(categoryId),
    });

    onUpdated();
    onClose();
  }

  async function handleAddPort() {
    if (!newPort.name || !newPort.type) return;

    await createModelPort(model.id, {
      name: newPort.name,
      type: newPort.type,
      direction: newPort.direction,
    });

    setNewPort({ name: "", type: "", direction: "in" });
    onUpdated();
  }

  async function handleDeleteModel() {
    if (!confirm("Delete this model?")) return;

    await deleteDeviceModel(model.id);
    onUpdated();
    onClose();
  }

  return (
    <div style={{ padding: 20, background: "#fff", width: 400 }}>
      <h2>Model Properties</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Category</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <h3>Ports</h3>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Name"
          value={newPort.name}
          onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
          style={{ flex: 1 }}
        />

        <select
          value={newPort.direction}
          onChange={(e) =>
            setNewPort({ ...newPort, direction: e.target.value })
          }
        >
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="inout">In-Out</option>
        </select>

        <select
          value={newPort.type}
          onChange={(e) => setNewPort({ ...newPort, type: e.target.value })}
        >
          <option value="">Type</option>
          {Object.entries(PORT_TYPES).map(([group, types]) => (
            <optgroup key={group} label={group}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button onClick={handleAddPort}>+</button>
      </div>

      {ports.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 6,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 6,
          }}
        >
          {p.name} — {p.type} — {p.direction}
        </div>
      ))}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={handleSave} style={{ flex: 1 }}>
          Save
        </button>

        <button
          onClick={handleDeleteModel}
          style={{
            flex: 1,
            backgroundColor: "#d9534f",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>

        <button onClick={onClose} style={{ flex: 1 }}>
          Close
        </button>
      </div>
    </div>
  );
}
