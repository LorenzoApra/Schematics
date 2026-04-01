import React, { useState, useEffect } from "react";
import {
  updateDeviceModel,
  createModelPort,
  updateModelPort,
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

  // 🔥 Manteniamo il pannello sincronizzato SOLO quando cambia il modello
  useEffect(() => {
    loadCategories();
    setPorts(model.ports || []);
    setName(model.name);
    setCategoryId(model.category_id);
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

    const created = await createModelPort(model.id, {
      name: newPort.name,
      type: newPort.type,
      direction: newPort.direction,
    });

    // 🔥 Aggiorna subito la UI
    setPorts((prev) => [...prev, created]);

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
    <div
      style={{
        padding: 20,
        background: "#fff",
        width: "100%",
        maxWidth: 420,
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2 style={{ margin: 0 }}>Model Properties</h2>

      {/* NAME */}
      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      {/* CATEGORY */}
      <label>Category</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          marginBottom: 10,
        }}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* PORTS */}
      <h3 style={{ marginTop: 10 }}>Ports</h3>

      {ports.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={p.name}
            onChange={(e) =>
              setPorts((prev) =>
                prev.map((port) =>
                  port.id === p.id ? { ...port, name: e.target.value } : port
                )
              )
            }
            style={{
              flex: "1 1 120px",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <select
            value={p.direction}
            onChange={(e) =>
              setPorts((prev) =>
                prev.map((port) =>
                  port.id === p.id
                    ? { ...port, direction: e.target.value }
                    : port
                )
              )
            }
            style={{
              flex: "1 1 100px",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="in">In</option>
            <option value="out">Out</option>
            <option value="inout">In-Out</option>
          </select>

          <select
            value={p.type}
            onChange={(e) =>
              setPorts((prev) =>
                prev.map((port) =>
                  port.id === p.id ? { ...port, type: e.target.value } : port
                )
              )
            }
            style={{
              flex: "1 1 120px",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
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

          <button
            onClick={async () => {
              const updated = await updateModelPort(p.id, {
                name: p.name,
                type: p.type,
                direction: p.direction,
              });

              // 🔥 Aggiorna subito la UI
              setPorts((prev) =>
                prev.map((port) => (port.id === p.id ? updated : port))
              );

              // 🔥 Aggiorna anche il modello locale
              model.ports = model.ports.map((port) =>
                port.id === p.id ? updated : port
              );

              onUpdated();
            }}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Save
          </button>

          <button
            onClick={async () => {
              await deleteModelPort(p.id);

              // 🔥 Rimuovi subito dalla UI
              setPorts((prev) => prev.filter((port) => port.id !== p.id));

              onUpdated();
            }}
            style={{
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* ADD NEW PORT */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 12,
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={newPort.name}
          onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
          style={{
            flex: "1 1 120px",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={newPort.direction}
          onChange={(e) =>
            setNewPort({ ...newPort, direction: e.target.value })
          }
          style={{
            flex: "1 1 100px",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        >
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="inout">In-Out</option>
        </select>

        <select
          value={newPort.type}
          onChange={(e) => setNewPort({ ...newPort, type: e.target.value })}
          style={{
            flex: "1 1 120px",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
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

        <button
          onClick={handleAddPort}
          style={{
            padding: "6px 10px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* FOOTER BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
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
