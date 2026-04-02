import React, { useEffect, useRef, useState } from "react";
import {
  getConnections,
  createConnection,
  deleteConnection,
  updateDevice,
} from "../api";

// ------------------------------------------------------------
// COLORI PORTE (UI OLD)
// ------------------------------------------------------------
function directionColor(direction) {
  if (direction === "in") return "#cce5ff";   // blu
  if (direction === "out") return "#f8d7da";  // rosso
  return "#d4edda";                           // verde
}

// ------------------------------------------------------------
// SPLIT PORTE (UI OLD)
// ------------------------------------------------------------
function splitPorts(ports) {
  return {
    left: ports.filter((p) => p.direction === "in"),
    right: ports.filter((p) => p.direction === "out"),
    center: ports.filter((p) => p.direction === "inout"),
  };
}

export default function Canvas({ devices, onSelectDevice, reloadDevices }) {
  const canvasRef = useRef(null);
  const [connections, setConnections] = useState([]);

  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [connectingFrom, setConnectingFrom] = useState(null);

  // ------------------------------------------------------------
  // LOAD CONNECTIONS
  // ------------------------------------------------------------
  async function loadConnections() {
    const conns = await getConnections();
    setConnections(conns);
  }

  useEffect(() => {
    loadConnections();
  }, []);

  // ------------------------------------------------------------
  // START DRAG
  // ------------------------------------------------------------
  function handleMouseDown(e, device) {
    e.preventDefault(); // ← evita selezione blu
    const rect = e.currentTarget.getBoundingClientRect();

    setDragging(device);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  // ------------------------------------------------------------
  // DRAG MOVE
  // ------------------------------------------------------------
  function handleMouseMove(e) {
    if (!dragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const newX = e.clientX - rect.left - offset.x;
    const newY = e.clientY - rect.top - offset.y;

    dragging.x = newX;
    dragging.y = newY;

    reloadDevices(); // forza rerender
  }

  // ------------------------------------------------------------
  // END DRAG → SAVE POSITION
  // ------------------------------------------------------------
  async function handleMouseUp() {
    if (dragging) {
      await updateDevice(dragging.id, {
        name: dragging.name,
        x: dragging.x,
        y: dragging.y,
        color: dragging.color,
        model_id: dragging.model_id,
      });
    }
    setDragging(null);
  }

  // ------------------------------------------------------------
  // CLICK PORT → CREATE CONNECTION
  // ------------------------------------------------------------
  async function handlePortClick(port) {
    if (!connectingFrom) {
      setConnectingFrom(port);
      return;
    }

    if (connectingFrom.id === port.id) {
      setConnectingFrom(null);
      return;
    }

    await createConnection({
      from_port_id: connectingFrom.id,
      to_port_id: port.id,
    });

    setConnectingFrom(null);
    loadConnections();
  }

  // ------------------------------------------------------------
  // DELETE CONNECTION (right-click)
  // ------------------------------------------------------------
  async function handleConnectionRightClick(e, conn) {
    e.preventDefault();
    await deleteConnection(conn.id);
    loadConnections();
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#fafafa",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* CONNECTION LINES */}
      {connections.map((c) => {
        const allPorts = devices.flatMap((d) =>
          (d.ports || []).map((p) => ({ ...p, device: d }))
        );

        const from = allPorts.find((p) => p.id === c.from_port_id);
        const to = allPorts.find((p) => p.id === c.to_port_id);

        if (!from || !to) return null;

        return (
          <svg
            key={c.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            onContextMenu={(e) => handleConnectionRightClick(e, c)}
          >
            <line
              x1={from.device.x + 110}
              y1={from.device.y + 40}
              x2={to.device.x + 110}
              y2={to.device.y + 40}
              stroke="#444"
              strokeWidth="2"
            />
          </svg>
        );
      })}

      {/* DEVICES */}
      {devices.map((d) => {
        const { left, right, center } = splitPorts(d.ports || []);

        return (
          <div
            key={d.id}
            onMouseDown={(e) => handleMouseDown(e, d)}
            onClick={() => onSelectDevice(d.id)}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: 240,
              padding: 10,
              background: "#fff",
              border: "2px solid #ccc",
              borderRadius: 6,
              cursor: "move",
              userSelect: "none",
              WebkitUserSelect: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              
              {/* LEFT PORTS (IN) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {left.map((p) => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(p);
                    }}
                    style={{
                      padding: "4px 6px",
                      background: directionColor("in"),
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>

              {/* DEVICE NAME + CENTER PORTS */}
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                  {d.name}
                </div>

                {center.map((p) => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(p);
                    }}
                    style={{
                      padding: "4px 6px",
                      background: directionColor("inout"),
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>

              {/* RIGHT PORTS (OUT) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {right.map((p) => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(p);
                    }}
                    style={{
                      padding: "4px 6px",
                      background: directionColor("out"),
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
