import { Stage, Layer, Rect, Text } from "react-konva";

export default function Canvas({ devices, onMove, onDelete }) {
  return (
    <Stage width={1200} height={800} style={{ background: "#fafafa" }}>
      <Layer>
        {devices.map(d => (
          <Rect
            key={d.id}
            x={d.x}
            y={d.y}
            width={120}
            height={60}
            fill={d.color || "#ddd"}
            draggable
            onDragEnd={e => onMove(d.id, e.target.x(), e.target.y())}
          />
        ))}

        {devices.map(d => (
          <Text
            key={d.id + "_t"}
            x={d.x + 10}
            y={d.y + 20}
            text={d.name}
            fill="black"
          />
        ))}

        {devices.map(d => (
          <Text
            key={d.id + "_del"}
            text="✕"
            x={d.x + 100}
            y={d.y - 10}
            fill="red"
            fontSize={20}
            onClick={() => onDelete(d.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
