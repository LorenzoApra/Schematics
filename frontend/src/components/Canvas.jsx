import React, { useEffect, useState } from "react";
import { getDevices, updateDevice } from "../api";

export default function Canvas({ onSelectDevice }) {
  const [devices, setDevices] = useState([]);
  const [dragging, setDragging] = useState(null);

  // ------------------------------------------------------------
  // LOAD DEVICES
  // ------------------------------------------------------------
  async function loadDevices() {
    const list = await getDevices();
    setDevices(list);
  }

  useEffect(() => {
    loadDevices();
  }, []);

  // ------------------------------------------------------------
  // DRAG START
  // ------------------------------------------------------------
  function handleMouseDown(e, device) {
    e.stopPropagation();

    setDragging({
      id: device.id,
      offsetX: e.clientX - device.x,
      offsetY: e.clientY - device.y,
    });
  }

  // ------------------------------------------------------------
  // DRAG MOVE
  // ------------------------------------------------------------
  function handleMouseMove(e) {
    if (!dragging) return;

    const newX = e.clientX - dragging.offsetX;
    const newY = e.clientY - dragging.offsetY;

    setDevices((prev) =>
      prev.map((d) =>
        d.id === dragging.id ? { ...d, x: newX, y: newY } : d
      )
    );
  }

  // ------------------------------------------------------------
  // DRAG END → SAVE POSITION
  // ------------------------------------------------------------
  async function handleMouseUp() {
    if (!dragging) return;

    const dev = devices.find((d) => d.id === dragging.id);
    if (dev) {
      await updateDevice(dev.id, { x: dev.x, y: dev.y });
    }

    setDragging(null);
  }

  // ------------------------------------------------------------
  // SELECT DEVICE
  // ------------------------------------------------------------
  function handleSelect(device, e) {
    e.stopPropagation();
    onSelectDevice(device);
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        background: "#fafafa",
        overflow: "hidden",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={() => onSelectDevice(null)}
    >
      {devices.map((d) => (
        <div
          key={d.id}
          onMouseDown={(e) => handleMouseDown(e, d)}
          onClick={(e) => handleSelect(d, e)}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            padding: 10,
            background: d.color || "#ddd",
            borderRadius: 6,
            cursor: "grab",
            userSelect: "none",
            minWidth: 120,
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <strong>{d.name}</strong>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
            {d.model_id ? `Model #${d.model_id}` : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
