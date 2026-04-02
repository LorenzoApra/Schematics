import React, { useEffect, useState } from "react";
import {
  getDevice,
  updateDevice,
  createDevicePort,
  updateDevicePort,
  deleteDevicePort,
  deleteDevice,
} from "../api";

function directionColor(direction) {
  if (direction === "in") return "#cce5ff";
  if (direction === "out") return "#f8d7da";
  return "#d4edda";
}

export default function DeviceProperties({ deviceId, onClose, onSaved }) {
  const [device, setDevice] = useState({
    id: null,
    name: "",
    x: 100,
    y: 100,
    color: "#000000",
    model_id: null,
    ports: [],
  });

  const [editingPort, setEditingPort] = useState(null);
  const [portForm, setPortForm] = useState({
    name: "",
    type: "",
    direction: "inout",
  });

  useEffect(() => {
    loadDevice();
  }, [deviceId]);

  async function loadDevice() {
    const data = await getDevice(deviceId);
    setDevice(data);
  }

  function handleDeviceChange(e) {
    setDevice({ ...device, [e.target.name]: e.target.value });
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
      const updated = await updateDevicePort(editingPort.id, {
        name: portForm.name,
        type: portForm.type,
        direction: portForm.direction || "inout",
      });

      setDevice((prev) => ({
        ...prev,
        ports: prev.ports.map((p) => (p.id === updated.id ? updated : p)),
      }));
    } else {
      const created = await createDevicePort(device.id, {
        name: portForm.name,
        type: portForm.type,
        direction: portForm.direction || "inout",
      });

      setDevice((prev) => ({
        ...prev,
        ports: [...prev.ports, created],
      }));
    }

    setEditingPort(null);
    setPortForm({ name: "", type: "", direction: "inout" });
  }

  async function removePort(port) {
    if (!window.confirm("Delete this port?")) return;
    await deleteDevicePort(port.id);
    setDevice((prev) => ({
      ...prev,
      ports: prev.ports.filter((p) => p.id !== port.id),
    }));
  }

  async function saveDevice() {
    const saved = await updateDevice(device.id, {
      name: device.name,
      x: Number(device.x),
      y: Number(device.y),
      color: device.color,
      model_id: device.model_id ? Number(device.model_id) : null,
    });

    onSaved(saved);
  }

  async function handleDeleteDevice() {
    if (!window.confirm("Delete this device from canvas?")) return;
    await deleteDevice(device.id);
    onSaved(device);
    onClose();
  }

  if (!device) return <div>Loading…</div>;

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
      <h2>Device Properties</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Name</label>
        <input
          name="name"
          value={device.name}
          onChange={handleDeviceChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Position X</label>
        <input
          name="x"
          type="number"
          value={device.x}
          onChange={handleDeviceChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />

        <label style={{ marginTop: 10 }}>Position Y</label>
        <input
          name="y"
          type="number"
          value={device.y}
          onChange={handleDeviceChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Color</label>
        <input
          name="color"
          type="color"
          value={device.color || "#000000"}
          onChange={handleDeviceChange}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </div>

      <h3>Ports</h3>

      <div style={{ marginBottom: 20 }}>
        {(device?.ports ?? []).map((p) => (
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
          onClick={saveDevice}
          style={{
            padding: "10px 20px",
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Save Device
        </button>

        <button
          onClick={handleDeleteDevice}
          style={{
            padding: "10px 20px",
            background: "#f8d7da",
            color: "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          🗑 Delete Device
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
