import { useRef } from "react";
import { updateDevice } from "./api";

export default function Canvas({ devices, onSelectDevice, refreshDevices }) {
  const canvasRef = useRef(null);

  // -------------------------
  //   DRAG START
  // -------------------------
  function handleDragStart(e, device) {
    e.dataTransfer.setData("deviceId", device.id);
  }

  // -------------------------
  //   DROP → UPDATE POSITION
  // -------------------------
  function handleDrop(e) {
    const deviceId = e.dataTransfer.getData("deviceId");
    if (!deviceId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 30;

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
          left: device.x ?? 100,
          top: device.y ?? 100,
          width: 140,
          padding: "10px",
          borderRadius: "6px",
          background: device.color || "#4444ff",
          cursor: "pointer",
          userSelect: "none",
          textAlign: "center",
          fontWeight: "bold",
          border: "2px solid white",
          color: "white",
          zIndex: 10,
        }}
      >
        {device.name}
      </div>
    );
  }

  // -------------------------
  //   MAIN RENDER
  // -------------------------
  return (
    <div
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={allowDrop}
      style={{
        flex: 1,
        position: "relative",
        background: "#1e1e1e",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {devices.map(renderDevice)}
    </div>
  );
}
