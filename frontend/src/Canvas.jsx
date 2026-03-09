import { useRef, useState, useEffect } from "react";
import { updateDevice } from "./api";

export default function Canvas({
  devices,
  selectedDevice,
  onSelectDevice,
  onUpdateDevice,
  refreshDevices,
}) {
  const canvasRef = useRef(null);
  const draggingRef = useRef(null); // { id, startX, startY, origX, origY }
  const [_, setTick] = useState(0); // for re-render while dragging

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onPointerMove(e) {
      if (!draggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const { startX, startY, origX, origY } = draggingRef.current;
      const x = Math.round(origX + (e.clientX - startX));
      const y = Math.round(origY + (e.clientY - startY));
      // update local position for immediate feedback
      draggingRef.current.currentX = x;
      draggingRef.current.currentY = y;
      setTick((t) => t + 1);
    }

    function onPointerUp(e) {
      if (!draggingRef.current) return;
      const { id, currentX, currentY } = draggingRef.current;
      // finalize: send update to backend
      updateDevice(id, { x: currentX, y: currentY }).then((updated) => {
        refreshDevices();
        if (onUpdateDevice && updated) onUpdateDevice(id, updated);
      });
      draggingRef.current = null;
      canvas.releasePointerCapture(e.pointerId);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [refreshDevices, onUpdateDevice]);

  function handlePointerDown(e, device) {
    // only left button
    if (e.button !== 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    draggingRef.current = {
      id: device.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: device.x ?? 100,
      origY: device.y ?? 100,
      currentX: device.x ?? 100,
      currentY: device.y ?? 100,
    };
    // capture pointer to ensure we get pointerup even if cursor leaves element
    e.currentTarget.setPointerCapture?.(e.pointerId);
    // prevent text selection
    e.preventDefault();
  }

  function handleClick(device) {
    // if draggingRef is active and id matches, ignore click
    if (draggingRef.current && draggingRef.current.id === device.id) return;
    onSelectDevice(device);
  }

  function renderDevice(device) {
    const isSelected = selectedDevice?.id === device.id;
    // if currently dragging this device, use live coords
    const live =
      draggingRef.current && draggingRef.current.id === device.id
        ? { left: draggingRef.current.currentX, top: draggingRef.current.currentY }
        : { left: device.x ?? 100, top: device.y ?? 100 };

    return (
      <div
        key={device.id}
        onPointerDown={(e) => handlePointerDown(e, device)}
        onClick={() => handleClick(device)}
        style={{
          position: "absolute",
          left: live.left,
          top: live.top,
          width: 140,
          padding: "10px",
          borderRadius: "6px",
          background: device.color || "#4444ff",
          cursor: "grab",
          userSelect: "none",
          textAlign: "center",
          fontWeight: "bold",
          border: isSelected ? "3px solid #ffd54f" : "2px solid white",
          color: "white",
          zIndex: isSelected ? 20 : 10,
          boxShadow: isSelected ? "0 0 12px rgba(255,213,79,0.6)" : "none",
        }}
      >
        {device.name}
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
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