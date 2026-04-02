import React, { useEffect, useState } from "react";
import {
  getDeviceModel,
  updateDeviceModel,
  createModelPort,
  updateModelPort,
  deleteModelPort,
  deleteDeviceModel,
} from "../api";

function directionColor(direction) {
  if (direction === "in") return "#cce5ff"; // blu chiaro
  if (direction === "out") return "#f8d7da"; // rosso chiaro
  return "#d4edda"; // verde chiaro
}

export default function DeviceModelProperties({ modelId, onClose, onSaved }) {
  const [model, setModel] = useState({
    id: null,
    name: "",
    category_id: null,
    ports: [],
  });

  const [editingPort, setEditingPort] = useState(null);
  const [portForm, setPortForm] = useState({
    name: "",
    type: "",
    direction: "inout",
  });

  useEffect(() => {
    loadModel();
  }, [modelId]);

  async function loadModel() {
    const data = await getDeviceModel(modelId);
    setModel(data);
  }

  function handleModelChange(e) {
    setModel({ ...model, [e.target.name]: e.target.value });
  }

  function handlePortFormChange(e) {
    setPortForm({ ...portForm, [e.target.name]: e.target.value });
  }

  function startAddPort() {
    setEditingPort(null);
    setPortForm({ name: "", type: "", direction: "inout" });
  }

  function startEditPort(port) {
    setEditingPort(port);
    setPortForm({
      name: port.name,
      type: port.type,
      direction: port.direction || "inout",
    });
  }

  async function savePort() {
    if (!portForm.name || !portForm.type) return;

    if (editingPort) {
      const updated = await updateModelPort(editingPort.id, {
        name: portForm.name,
        type: portForm.type,
        direction: portForm.direction || "inout",
      });

      setModel((prev) => ({
        ...prev,
        ports: prev.ports.map((p) => (p.id === updated.id ? updated : p)),
      }));
    } else {
      const created = await createModelPort(model.id, {
        name: portForm.name,
        type: portForm.type,
        direction: portForm.direction || "inout",
      });

      setModel((prev) => ({
        ...prev,
        ports: [...prev.ports, created],
      }));
    }

    setEditingPort(null);
    setPortForm({ name: "", type: "", direction: "inout" });
  }

  async function removePort(port) {
    if (!window.confirm("Delete this port?")) return;
    await deleteModelPort(port.id);
    setModel((prev) => ({
      ...prev,
      ports: prev.ports.filter((p) => p.id !== port.id),
    }));
  }

  async function saveModel() {
    const saved = await updateDeviceModel(model.id, {
      name: model.name,
      category_id: model.category_id ? Number(model.category_id) : null,
    });

    onSaved(saved);
  }

  async function handleDeleteModel() {
    if (!window.confirm("Delete this model and all its ports?")) return;
    await deleteDeviceModel(model.id);
    onSaved(model);
    onClose();
  }

  if (!model) return <div>Loading…</div>;

  return (
    <div
      style={{
        padding: 20,
        background: "#fff",
        borderLeft: "2px solid #ccc",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h2>Model Properties</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Name</label>
        <input
          name="name"
          value={model.name}
          onChange={handleModelChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Category ID</label>
        <input
          name="category_id"
          value={model.category_id ?? ""}
          onChange={handleModelChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      <h3>Ports</h3>

      <div style={{ marginBottom: 20 }}>
        {(model?.ports ?? []).map((p) => (
          <div
            key={p.id}
            style={{
              padding: 8,
              borderRadius: 6,
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: directionColor(p.direction || "inout"),
            }}
          >
            <div>
              <strong>{p.name}</strong>{" "}
              <span style={{ fontSize: 12 }}>
                ({p.direction || "inout"} – {p.type})
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEditPort(p)}>✏️ Edit</button>
              <button onClick={() => removePort(p)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 12,
          border: "1px solid #aaa",
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <h4>{editingPort ? "Edit Port" : "Add Port"}</h4>

        <div style={{ marginBottom: 10 }}>
          <label>Name</label>
          <input
            name="name"
            value={portForm.name}
            onChange={handlePortFormChange}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Type</label>
          <input
            name="type"
            value={portForm.type}
            onChange={handlePortFormChange}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
            placeholder="DMX 5p, SDI, Dante..."
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Direction</label>
          <select
            name="direction"
            value={portForm.direction}
            onChange={handlePortFormChange}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          >
            <option value="in">In</option>
            <option value="out">Out</option>
            <option value="inout">In-Out</option>
          </select>
        </div>

        <button onClick={savePort} style={{ marginTop: 10 }}>
          {editingPort ? "Save Port" : "Add Port"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={saveModel}
          style={{
            padding: "10px 20px",
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Save Model
        </button>

        <button
          onClick={handleDeleteModel}
          style={{
            padding: "10px 20px",
            background: "#f8d7da",
            color: "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          🗑 Delete Model
        </button>

        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: "#aaa",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
