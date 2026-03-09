import { useEffect, useRef } from "react";
import { updateDevice } from "./api";

export default function Canvas({ devices, onSelectDevice, refreshDevices }) {
  const canvasRef = useRef(null);

  // -------------------------
  //   DRAG DEVICE ON CANVAS
  // -------------------------
  function handleDragStart(e, device) {
    e.dataTransfer.setData("deviceId", device.id);
  }

  function handleDrop(e) {
    const deviceId = e.dataTransfer.getData("deviceId");
    if (!deviceId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 25;

    updateDevice(deviceId, { x, y }).then(() => {
      refreshDevices();
    });
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  // -------------------------
  //   RENDER DEVICE BOX
  // -------------------------
  function renderDevice(device) {
    return (
      <div
        key={device.id}
        draggable
        onDragStart={(e) => handleDragStart(e, device)}
        onClick={() => onSelectDevice(device)}
        style={{
          position: "absolute",
          left: device.x,
          top: device.y,
          width: 120,
          padding: "10px",
          borderRadius: "6px",
          background: device.color || "#ddd",
          cursor: "pointer",
          userSelect: "none",
          textAlign: "center",
          fontWeight: "bold",
          border: "2px solid #333",
        }}
      >
        {device.name}
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={allowDrop}
    style={{
  flex: 1,
  position: "relative",
  background: "pink",   // 👈 colore vistoso
  border: "3px solid red",
  overflow: "hidden",
}}

    >
      {devices.map(renderDevice)}
    </div>
  );
}
