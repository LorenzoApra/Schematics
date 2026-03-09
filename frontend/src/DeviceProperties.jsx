import { useState, useEffect } from "react";
import { addDevicePort, updateDevicePort, deleteDevicePort } from "./api";

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
  const [localPorts, setLocalPorts] = useState([]);

  useEffect(() => {
    if (device) {
      setLocalName(device.name);
      setLocalColor(device.color || "#cccccc");
    }
  }, [device]);

  useEffect(() => {
    setLocalPorts(ports || []);
  }, [ports]);

  // debounce name update
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

  // PORTS CRUD (frontend + API)
  async function handleAddPort() {
    if (!device) return;
    if ((localPorts?.length || 0) >= 30) return alert("Max 30 ports allowed");
    const name = `port${(localPorts?.length || 0) + 1}`;
    const created = await addDevicePort(device.id, { name, type: "ethernet" });
    if (created) {
      onRefreshPorts();
    }
  }

  async function handleUpdatePort(portId, data) {
    if (!device) return;
    await updateDevicePort(device.id, portId, data);
    onRefreshPorts();
  }

  async function handleDeletePort(portId) {
    if (!device) return;
    await deleteDevicePort(device.id, portId);
    onRefreshPorts();
  }

  if (!device) return null;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack} style={{ marginBottom: 20, padding: "6px 10px", cursor: "pointer" }}>
        ← Back
      </button>

      <h2 style={{ marginBottom: 10 }}>Device Properties</h2>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Name</label>
        <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Color</label>
        <input type="color" value={localColor} onChange={(e) => setLocalColor(e.target.value)} style={{ width: "100%", height: 40, padding: 0, border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Ports ({localPorts.length}/30)</h3>
        <button onClick={handleAddPort} style={{ marginBottom: 10, padding: "6px 10px", cursor: "pointer" }} disabled={localPorts.length >= 30}>
          Add Port
        </button>

        <ul>
          {localPorts.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <input value={p.name} onChange={(e) => handleUpdatePort(p.id, { name: e.target.value })} style={{ marginRight: 8 }} />
              <select value={p.type} onChange={(e) => handleUpdatePort(p.id, { type: e.target.value })} style={{ marginRight: 8 }}>
                <option value="ethernet">ethernet</option>
                <option value="fiber">fiber</option>
                <option value="serial">serial</option>
              </select>
              <button onClick={() => handleDeletePort(p.id)} style={{ marginLeft: 8 }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => onDeleteDevice(device.id)} style={{ background: "#ff4444", color: "white", padding: "8px 12px", border: "none", borderRadius: 4, cursor: "pointer", marginTop: 20 }}>
        Delete Device
      </button>
    </div>
  );
}
