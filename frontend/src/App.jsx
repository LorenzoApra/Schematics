import React, { useEffect, useState } from "react";
import DeviceSidebar from "./components/DeviceSidebar";
import Canvas from "./components/Canvas";
import DeviceProperties from "./components/DeviceProperties";
import DeviceModelProperties from "./components/DeviceModelProperties";
import { getDevices } from "./api";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);

  // ------------------------------------------------------------
  // LOAD DEVICES FROM BACKEND
  // ------------------------------------------------------------
  async function loadDevices() {
    const devs = await getDevices();
    setDevices(devs);
  }

  useEffect(() => {
    loadDevices();
  }, []);

  // ------------------------------------------------------------
  // ADD DEVICE TO CANVAS (from sidebar)
  // ------------------------------------------------------------
  function handleAddDeviceToCanvas(device) {
    // Aggiunge il device alla lista
    setDevices((prev) => [...prev, device]);

    // NON aprire DeviceProperties
    // (comportamento originale)
  }

  // ------------------------------------------------------------
  // SELECT DEVICE (from canvas)
  // ------------------------------------------------------------
  function handleSelectDevice(deviceId) {
    setSelectedDeviceId(deviceId);
    setSelectedModelId(null);
  }

  // ------------------------------------------------------------
  // SELECT MODEL (from sidebar → Edit)
  // ------------------------------------------------------------
  function handleEditModel(modelId) {
    setSelectedModelId(modelId);
    setSelectedDeviceId(null);
  }

  // ------------------------------------------------------------
  // UPDATE DEVICE AFTER EDIT
  // ------------------------------------------------------------
  function handleDeviceSaved(updated) {
    setDevices((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
    setSelectedDeviceId(null);
  }

  // ------------------------------------------------------------
  // UPDATE MODEL AFTER EDIT
  // ------------------------------------------------------------
  function handleModelSaved() {
    setSelectedModelId(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* SIDEBAR */}
      <DeviceSidebar
        onAddDevice={handleAddDeviceToCanvas}
        onEditModel={handleEditModel}
      />

      {/* CANVAS */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas
          devices={devices}
          onSelectDevice={handleSelectDevice}
          reloadDevices={loadDevices}
        />
      </div>

      {/* DEVICE PROPERTIES */}
      {selectedDeviceId && (
        <DeviceProperties
          deviceId={selectedDeviceId}
          onClose={() => setSelectedDeviceId(null)}
          onSaved={handleDeviceSaved}
        />
      )}

      {/* MODEL PROPERTIES */}
      {selectedModelId && (
        <DeviceModelProperties
          modelId={selectedModelId}
          onClose={() => setSelectedModelId(null)}
          onSaved={handleModelSaved}
        />
      )}
    </div>
  );
}
