import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import DeviceSidebar from "./DeviceSidebar";
import { getDevices, addDevice, updateDevice, deleteDevice } from "./api";

export default function App() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getDevices().then(setDevices);
  }, []);

  function handleAdd(name, color) {
    addDevice({ name, color, x: 100, y: 100 }).then((d) =>
      setDevices([...devices, d])
    );
  }

  function handleMove(id, x, y) {
    updateDevice(id, { x, y });
    setDevices(devices.map((d) => (d.id === id ? { ...d, x, y } : d)));
  }

  function handleDelete(id) {
    deleteDevice(id);
    setDevices(devices.filter((d) => d.id !== id));
  }

  function handleEdit(id, newName, newColor) {
    updateDevice(id, { name: newName, color: newColor });
    setDevices(
      devices.map((d) =>
        d.id === id ? { ...d, name: newName, color: newColor } : d
      )
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <DeviceSidebar onAdd={handleAdd} />
      <Canvas
        devices={devices}
        onMove={handleMove}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
