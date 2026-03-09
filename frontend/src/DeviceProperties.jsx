import { useState, useEffect } from "react";

export default function DeviceProperties({
  device,
  ports,
  onUpdateDevice,
  onDeleteDevice,
  onRefreshPorts,
  onBack,
}) {
  const [localName, setLocalName] = useState("");
  const [localColor, setLocalColor] = useState("#cccccc");

  // -------------------------
  //   SYNC LOCAL STATE
  // -------------------------
  useEffect(() => {
    if (device) {
      setLocalName(device.name);
      setLocalColor(device.color || "#cccccc");
    }
  }, [device]);

  // -------------------------
  //   DEBOUNCED UPDATE
  // -------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (device && localName !== device.name) {
        onUpdateDevice(device.id, { name: localName });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [localName]);

  useEffect(() => {
    if (device && localColor !== device.color) {
      onUpdateDevice(device.id, { color: localColor });
    }
  }, [localColor]);

  if (!device) return null;

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

      <h2 style={{ marginBottom: 10 }}>Device Properties</h2>

      {/* NAME */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Name</label>
        <input
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
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
          value={localColor}
          onChange={(e) => setLocalColor(e.target.value)}
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

      {/* POSITION */}
      <div style={{ marginBottom: 20 }}>
        <h3>Position</h3>
        <div>X: {device.x}</div>
        <div>Y: {device.y}</div>
      </div>

      {/* PORT LIST */}
      <div style={{ marginBottom: 20 }}>
        <h3>Ports</h3>

        <button
          onClick={onRefreshPorts}
          style={{
            marginBottom: 10,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Refresh Ports
        </button>

        <ul>
          {ports.map((p) => (
            <li key={p.id}>
              {p.name} ({p.type})
            </li>
          ))}
        </ul>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => onDeleteDevice(device.id)}
        style={{
          background: "#ff4444",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        Delete Device
      </button>
    </div>
  );
}
