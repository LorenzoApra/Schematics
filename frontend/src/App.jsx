import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import DeviceSidebar from "./DeviceSidebar";
import {
  getDevices,
  updateDevice,
  deleteDevice,
  getDevicePorts,
} from "./api";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDevicePorts, setSelectedDevicePorts] = useState([]);

  // -------------------------
  //   LOAD DEVICES
  // -------------------------
  useEffect(() => {
    refreshDevices();
  }, []);

  function refreshDevices() {
    getDevices().then((data) => {
      setDevices(data || []);
    });
  }

  // -------------------------
  //   SELECT DEVICE
  // -------------------------
  function handleSelectDevice(device) {
    setSelectedDevice(device);

    getDevicePorts(device.id).then((ports) => {
      setSelectedDevicePorts(ports || []);
    });
  }

  // -------------------------
  //   CLEAR SELECTION
  // -------------------------
  function clearSelection() {
    setSelectedDevice(null);
    setSelectedDevicePorts([]);
  }

  // -------------------------
  //   UPDATE DEVICE (name/color/pos)
  // -------------------------
  function handleUpdateDevice(id, data) {
    updateDevice(id, data).then((updated) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? updated : d))
      );
      if (selectedDevice && selectedDevice.id === id) {
        setSelectedDevice(updated);
      }
    });
  }

  // -------------------------
  //   DELETE DEVICE
  // -------------------------
  function handleDeleteDevice(id) {
    deleteDevice(id).then(() => {
      setDevices((prev) => prev.filter((d) => d.id !== id));
      if (selectedDevice && selectedDevice.id === id) {
        clearSelection();
      }
    });
  }

  // -------------------------
  //   UPDATE PORT LIST
  // -------------------------
  function refreshSelectedDevicePorts() {
    if (!selectedDevice) return;
    getDevicePorts(selectedDevice.id).then((ports) =>
      setSelectedDevicePorts(ports || [])
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <DeviceSidebar
        devices={devices}
        selectedDevice={selectedDevice}
        selectedDevicePorts={selectedDevicePorts}
        onUpdateDevice={handleUpdateDevice}
        onDeleteDevice={handleDeleteDevice}
        onRefreshPorts={refreshSelectedDevicePorts}
        onBack={clearSelection}
        refreshDevices={refreshDevices}
      />

      {/* CANVAS */}
      <Canvas
        devices={devices}
        onSelectDevice={handleSelectDevice}
        refreshDevices={refreshDevices}
      />
    </div>
  );
}
