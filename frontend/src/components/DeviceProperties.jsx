import React, { useState, useEffect } from "react";
import { updateDevice, createDevicePort } from "../api";
import { PORT_TYPES } from "../portTypes";
import { deleteDevice } from "../api";

export default function DeviceProperties({ device, onClose, onUpdated }) {
  const [name, setName] = useState(device.name);
  const [x, setX] = useState(device.x);
  const [y, setY] = useState(device.y);
  const [color, setColor] = useState(device.color);
  const [ports, setPorts] = useState(device.ports || []);

  const [newPort, setNewPort] = useState({
    name: "",
    type: "",
    direction: "in",
  });

  useEffect(() => {
    setName(device.name);
    setX(device.x);
    setY(device.y);
    setColor(device.color);
    setPorts(device.ports || []);
  }, [device]);

  async function handleSave() {
    await updateDevice(device.id, {
      name,
      x: Number(x),
      y: Number(y),
      color,
      model_id: device.model_id,
    });

    onUpdated();
    onClose();
  }

  async function handleAddPort() {
    if (!newPort.name || !newPort.type) return;

    await createDevicePort(device.id, {
      name: newPort.name,
      type: newPort.type,
      direction: newPort.direction,
    });

    setNewPort({ name: "", type: "", direction: "in" });
    onUpdated();
  }

  return (
    <div style={{ padding: 20, background: "#fff", width: 400 }}>
      <h2>Device Properties</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Position</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <label>Color</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

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
  onClick={async () => {
    await deleteDevice(device.id);
    onUpdated();   // aggiorna il canvas
    onClose();     // chiude il pannello
  }}
  style={{
    backgroundColor: "#d9534f",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1
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
