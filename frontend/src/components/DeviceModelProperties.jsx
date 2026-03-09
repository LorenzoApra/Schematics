import React, { useEffect, useState } from "react";
import {
  getCategories,
  updateDeviceModel,
  deleteDeviceModel,
  getModelPorts,
  createModelPort,
  updateModelPort,
  deleteModelPort,
} from "../api";

export default function DeviceModelProperties({ model, onClose, onUpdated }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(model?.name || "");
  const [categoryId, setCategoryId] = useState(model?.category_id || "");
  const [ports, setPorts] = useState([]);

  // New port fields
  const [newPort, setNewPort] = useState({ name: "", type: "" });

  // ------------------------------------------------------------
  // LOAD CATEGORIES + PORTS
  // ------------------------------------------------------------
  useEffect(() => {
    async function load() {
      const cats = await getCategories();
      setCategories(cats);

      const p = await getModelPorts(model.id);
      setPorts(p);
    }
    load();
  }, [model]);

  // ------------------------------------------------------------
  // SAVE MODEL
  // ------------------------------------------------------------
  async function handleSave() {
    await updateDeviceModel(model.id, {
      name,
      category_id: Number(categoryId),
    });

    onUpdated();
    onClose();
  }

  // ------------------------------------------------------------
  // DELETE MODEL
  // ------------------------------------------------------------
  async function handleDelete() {
    if (!window.confirm("Delete this model?")) return;
    await deleteDeviceModel(model.id);
    onUpdated();
    onClose();
  }

  // ------------------------------------------------------------
  // PORT CRUD
  // ------------------------------------------------------------
  async function handleAddPort() {
    if (!newPort.name || !newPort.type) return;

    const created = await createModelPort(model.id, newPort);
    setPorts([...ports, created]);

    setNewPort({ name: "", type: "" });
  }

  async function handleUpdatePort(portId, field, value) {
    const updated = await updateModelPort(model.id, portId, { [field]: value });

    setPorts((prev) =>
      prev.map((p) => (p.id === portId ? updated : p))
    );
  }

  async function handleDeletePort(portId) {
    await deleteModelPort(model.id, portId);
    setPorts((prev) => prev.filter((p) => p.id !== portId));
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div
      style={{
        width: 350,
        padding: 20,
        background: "#ffffff",
        borderLeft: "1px solid #ccc",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Edit Device Model</h2>

      {/* NAME */}
      <label style={{ fontWeight: "bold" }}>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 6, marginBottom: 12 }}
      />

      {/* CATEGORY */}
      <label style={{ fontWeight: "bold" }}>Category</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        style={{ width: "100%", padding: 6, marginBottom: 20 }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* PORTS */}
      <h3>Ports</h3>

      {ports.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 6,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={p.name}
            onChange={(e) => handleUpdatePort(p.id, "name", e.target.value)}
            style={{ flex: 1, padding: 4 }}
          />
          <input
            type="text"
            value={p.type}
            onChange={(e) => handleUpdatePort(p.id, "type", e.target.value)}
            style={{ flex: 1, padding: 4 }}
          />
          <button
            onClick={() => handleDeletePort(p.id)}
            style={{ padding: "4px 8px" }}
          >
            🗑
          </button>
        </div>
      ))}

      {/* ADD NEW PORT */}
      {ports.length < 30 && (
        <div style={{ marginTop: 12 }}>
          <strong>Add Port</strong>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <input
              type="text"
              placeholder="Name"
              value={newPort.name}
              onChange={(e) =>
                setNewPort({ ...newPort, name: e.target.value })
              }
              style={{ flex: 1, padding: 4 }}
            />
            <input
              type="text"
              placeholder="Type"
              value={newPort.type}
              onChange={(e) =>
                setNewPort({ ...newPort, type: e.target.value })
              }
              style={{ flex: 1, padding: 4 }}
            />
            <button onClick={handleAddPort}>➕</button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
        <button
          onClick={handleSave}
          style={{ flex: 1, padding: 10, background: "#4caf50", color: "white" }}
        >
          Save
        </button>

        <button
          onClick={handleDelete}
          style={{ flex: 1, padding: 10, background: "#e53935", color: "white" }}
        >
          Delete
        </button>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 10,
          background: "#ccc",
        }}
      >
        Close
      </button>
    </div>
  );
}
