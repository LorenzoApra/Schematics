import { useState, useEffect } from "react";
import {
  addDevicePort,
  updateDevicePort,
  deleteDevicePort,
  reorderDevicePorts,
} from "./api";

import PortTypeSelector from "./PortTypeSelector";

export default function DeviceProperties({
  device,
  ports,
  onUpdateDevice,
  onDeleteDevice,
  onRefreshPorts,
  onBack,
}) {
  const [localPorts, setLocalPorts] = useState([]);

  useEffect(() => {
    setLocalPorts(ports);
  }, [ports]);

  // -------------------------
  //   FILTER IN / OUT
  // -------------------------
  const inPorts = localPorts.filter((p) => p.direction === "in");
  const outPorts = localPorts.filter((p) => p.direction === "out");

  // -------------------------
  //   ADD PORT
  // -------------------------
  function handleAddPort(direction) {
    addDevicePort(device.id, {
      name: direction === "in" ? "IN" : "OUT",
      type: "HDMI",
      direction,
    }).then(() => onRefreshPorts());
  }

  // -------------------------
  //   UPDATE PORT NAME
  // -------------------------
  function handleNameChange(portId, newName) {
    updateDevicePort(portId, { name: newName }).then(() =>
      onRefreshPorts()
    );
  }

  // -------------------------
  //   UPDATE PORT TYPE
  // -------------------------
  function handleTypeChange(portId, newType) {
    updateDevicePort(portId, { type: newType }).then(() =>
      onRefreshPorts()
    );
  }

  // -------------------------
  //   DELETE PORT
  // -------------------------
  function handleDeletePort(portId) {
    deleteDevicePort(portId).then(() => onRefreshPorts());
  }

  // -------------------------
  //   DRAG & DROP
  // -------------------------
  const [draggingId, setDraggingId] = useState(null);

  function handleDragStart(portId) {
    setDraggingId(portId);
  }

  function handleDragEnter(portId, direction) {
    if (!draggingId || draggingId === portId) return;

    const list = direction === "in" ? [...inPorts] : [...outPorts];
    const draggingIndex = list.findIndex((p) => p.id === draggingId);
    const targetIndex = list.findIndex((p) => p.id === portId);

    if (draggingIndex === -1 || targetIndex === -1) return;

    const newList = [...list];
    const [moved] = newList.splice(draggingIndex, 1);
    newList.splice(targetIndex, 0, moved);

    const updated = direction === "in"
      ? [...newList, ...outPorts]
      : [...inPorts, ...newList];

    setLocalPorts(updated);
  }

  function handleDragEnd(direction) {
    const list = direction === "in" ? inPorts : outPorts;
    const order = list.map((p) => p.id);

    reorderDevicePorts(device.id, direction, order).then(() => {
      setDraggingId(null);
      onRefreshPorts();
    });
  }

  // -------------------------
  //   RENDER PORT ROW
  // -------------------------
  function renderPort(port, direction) {
    return (
      <div
        key={port.id}
        draggable
        onDragStart={() => handleDragStart(port.id)}
        onDragEnter={() => handleDragEnter(port.id, direction)}
        onDragEnd={() => handleDragEnd(direction)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid #ddd",
          cursor: "grab",
        }}
      >
        {/* DRAG HANDLE */}
        <span style={{ cursor: "grab", fontSize: 18 }}>⠿</span>

        {/* TYPE SELECTOR */}
        <PortTypeSelector
          value={port.type}
          onChange={(v) => handleTypeChange(port.id, v)}
        />

        {/* NAME INPUT */}
        <input
          value={port.name}
          onChange={(e) => handleNameChange(port.id, e.target.value)}
          style={{
            flex: 1,
            padding: "4px 6px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        {/* DELETE */}
        <span
          onClick={() => handleDeletePort(port.id)}
          style={{
            cursor: "pointer",
            color: "red",
            fontWeight: "bold",
            padding: "0 6px",
          }}
        >
          ✕
        </span>
      </div>
    );
  }

  // -------------------------
  //   MAIN RENDER
  // -------------------------
  return (
    <div style={{ padding: 20 }}>
      <h2>Device Properties</h2>

      {/* NAME */}
      <label style={{ fontWeight: "bold" }}>Name</label>
      <input
        value={device.name}
        onChange={(e) => onUpdateDevice(device.id, { name: e.target.value })}
        style={{
          width: "100%",
          padding: "6px",
          marginBottom: 10,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      {/* COLOR */}
      <label style={{ fontWeight: "bold" }}>Color</label>
      <input
        type="color"
        value={device.color}
        onChange={(e) => onUpdateDevice(device.id, { color: e.target.value })}
        style={{ width: "100%", marginBottom: 20 }}
      />

      {/* IN PORTS */}
      <h3>IN Ports</h3>
      {inPorts.map((p) => renderPort(p, "in"))}
      <button onClick={() => handleAddPort("in")}>+ Add IN</button>

      {/* OUT PORTS */}
      <h3 style={{ marginTop: 20 }}>OUT Ports</h3>
      {outPorts.map((p) => renderPort(p, "out"))}
      <button onClick={() => handleAddPort("out")}>+ Add OUT</button>

      {/* DELETE DEVICE */}
      <button
        onClick={() => onDeleteDevice(device.id)}
        style={{
          marginTop: 30,
          width: "100%",
          padding: 10,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Delete Device
      </button>

      {/* BACK */}
      <button
        onClick={onBack}
        style={{
          marginTop: 10,
          width: "100%",
          padding: 10,
          background: "#ccc",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Back to Library
      </button>
    </div>
  );
}
