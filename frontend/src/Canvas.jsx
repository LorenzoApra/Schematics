import { useRef, useState } from "react";
import { updateDevice } from "./api";

export default function Canvas({
  devices,
  selectedDevice,
  onSelectDevice,
  refreshDevices,
}) {
  const canvasRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // -------------------------
  //   DRAG START
  // -------------------------
  function handleDragStart(e, device) {
    setIsDragging(true);

    const rect = canvasRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - device.x,
      y: e.clientY - rect.top - device.y,
    };

    e.dataTransfer.setData("deviceId", device.id);
    e.dataTransfer.effectAllowed = "move";
  }

  // -------------------------
  //   DROP → UPDATE POSITION
  // -------------------------
  function handleDrop(e) {
    const deviceId = e.dataTransfer.getData("deviceId");
    if (!deviceId) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;

    updateDevice(deviceId, { x, y }).then(() => {
      refreshDevices();
      setIsDragging(false);
    });
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  // -------------------------
  //   CLICK DEVICE
  // -------------------------
  function handleClick(device) {
    if (isDragging) return; // evita click durante drag
    onSelectDevice(device);
  }

  // -------------------------
  //   RENDER DEVICE BOX
  // -------------------------
  function renderDevice(device) {
    const isSelected = selectedDevice?.id === device.id;

    return (
      <div
        key={device.id}
        draggable
        onDragStart={(e) => handleDragStart(e, device)}
        onClick={() => handleClick(device)}
        style={{
          position: "absolute",
          left: device.x ?? 100,
          top: device.y ?? 100,
          width: 140,
          padding: "10px",
          borderRadius: "6px",
          background: device.color || "#4444ff",
          cursor: "grab",
          userSelect: "none",
          textAlign: "center",
          fontWeight: "bold",
          border: isSelected ? "3px solid yellow" : "2px solid white",
          color: "white",
          zIndex: isSelected ? 20 : 10,
          boxShadow: isSelected
            ? "0 0 10px yellow"
            : "0 0 4px rgba(0,0,0,0.4)",
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
      }}
    >
      {devices.map(renderDevice)}
    </div>
  );
}
