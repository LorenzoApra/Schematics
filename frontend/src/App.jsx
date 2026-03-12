import React, { useState } from "react";
import DeviceSidebar from "./components/DeviceSidebar";
import Canvas from "./components/Canvas";
import DeviceModelProperties from "./components/DeviceModelProperties";
import DeviceProperties from "./components/DeviceProperties";

export default function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // ------------------------------------------------------------
  // REFRESH CANVAS + SIDEBAR
  // ------------------------------------------------------------
  function triggerRefresh() {
    setRefreshFlag(!refreshFlag);
  }

  // ------------------------------------------------------------
  // WHEN A DEVICE IS ADDED FROM SIDEBAR
  // ------------------------------------------------------------
  function handleAddDevice(device) {
    setSelectedDevice(device);
    setSelectedModel(null);
    triggerRefresh();
  }

  // ------------------------------------------------------------
  // WHEN A DEVICE IS SELECTED ON CANVAS
  // ------------------------------------------------------------
  function handleSelectDevice(device) {
    setSelectedDevice(device);
    setSelectedModel(null);
  }

  // ------------------------------------------------------------
  // WHEN A MODEL IS SELECTED FROM SIDEBAR
  // ------------------------------------------------------------
  function handleEditModel(model) {
    setSelectedModel(model);
    setSelectedDevice(null);
  }

  // ------------------------------------------------------------
  // CLOSE PROPERTY PANELS
  // ------------------------------------------------------------
  function closePanels() {
    setSelectedModel(null);
    setSelectedDevice(null);
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
<div
  style={{
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative"
  }}
>
      
      {/* SIDEBAR */}
      <DeviceSidebar
        onAddDevice={handleAddDevice}
        onEditModel={handleEditModel}
      />

      {/* CANVAS */}
     <Canvas
  refreshFlag={refreshFlag}
  onSelectDevice={handleSelectDevice}
/>


      {/* RIGHT PANEL: MODEL PROPERTIES */}
      {selectedModel && (
        <DeviceModelProperties
          model={selectedModel}
          onClose={closePanels}
          onUpdated={triggerRefresh}
        />
      )}

      {/* RIGHT PANEL: DEVICE PROPERTIES */}
      {selectedDevice && (
       <DeviceProperties
  device={selectedDevice}
  onClose={closePanels}
  onUpdated={triggerRefresh}
/>

      )}
    </div>
  );
}