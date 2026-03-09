import React, { useEffect, useState } from "react";
import {
  updateDevice,
  deleteDevice,
  getDevicePorts,
  createDevicePort,
  updateDevicePort,
  deleteDevicePort,
} from "../api";

export default function DeviceProperties({ device, onClose, onUpdated }) {
  const [name, setName] = useState(device?.name || "");
  const [x, setX] = useState(device?.x || 0);
  const [y, setY] = useState(device?.y || 0);
  const [color, setColor] = useState(device?.color || "#cccccc");
  const [ports, setPorts] = useState([]);

  const [newPort, setNewPort] = useState({ name: "", type: "" });

  // ------------------------------------------------------------
  // LOAD PORTS
  // ------------------------------------------------------------
  useEffect(() => {
    async function load() {
      const p = await getDevicePorts(device.id);
      setPorts(p);
    }
    load();
  }, [device]);

  // ------------------------------------------------------------
  // SAVE DEVICE
  // ------------------------------------------------------------
  async function handleSave() {
    await updateDevice(device.id, {
      name,
      x: Number(x),
      y: Number(y),
      color,
    });

    onUpdated();
    onClose();
  }

  // ------------------------------------------------------------
  // DELETE DEVICE
  // ------------------------------------------------------------
  async function handleDelete() {
    if (!window.confirm("Delete this device?")) return;
    await deleteDevice(device.id);
    onUpdated();
    onClose();
  }

  // ------------------------------------------------------------
  // PORT CRUD
  // ------------------------------------------------------------
  async function handleAddPort() {
    if (!newPort.name || !newPort.type) return;

    const created = await createDevicePort(device.id, newPort);
    setPorts([...ports, created]);

    setNewPort({ name: "", type: "" });
  }

  async function handleUpdatePort(portId, field, value) {
    const updated = await updateDevicePort(device.id, portId, { [field]: value });

    setPorts((prev) =>
      prev.map((p) => (p.id === portId ? updated : p))
    );
  }

  async function handleDeletePort(portId) {
    await deleteDevicePort(device.id, portId);
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
      <h2 style={{ marginTop: 0 }}>Device Properties</h2>

      {/* NAME */}
      <label style={{ fontWeight: "bold" }}>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 6, marginBottom: 12 }}
      />

      {/* POSITION */}
      <label style={{ fontWeight: "bold" }}>Position</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
          style={{ flex: 1, padding: 6 }}
          placeholder="X"
        />
        <input
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
          style={{ flex: 1, padding: 6 }}
          placeholder="Y"
        />
      </div>

      {/* COLOR */}
      <label style={{ fontWeight: "bold" }}>Color</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: "100%", padding: 6, marginBottom: 20 }}
      />

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
