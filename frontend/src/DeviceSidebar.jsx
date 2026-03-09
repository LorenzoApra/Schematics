import { useState, useEffect } from "react";
import {
  getCategories,
  getTemplates,
  instantiateTemplate,
} from "./api";

import DeviceProperties from "./DeviceProperties";
import TemplateProperties from "./TemplateProperties";

export default function DeviceSidebar({
  devices,
  selectedDevice,
  selectedDevicePorts,
  onUpdateDevice,
  onDeleteDevice,
  onRefreshPorts,
  onBack,
  refreshDevices,          // 👈 AGGIUNTO
}) {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // -------------------------
  //   LOAD CATEGORIES + TEMPLATES
  // -------------------------
  useEffect(() => {
    refreshCategories();
    refreshTemplates();
  }, []);

  function refreshCategories() {
    getCategories().then(setCategories);
  }

  function refreshTemplates() {
    getTemplates().then(setTemplates);
  }

  // -------------------------
  //   INSTANTIATE TEMPLATE
  // -------------------------
function handleInstantiate(templateId) {
  instantiateTemplate(templateId).then(() => {
    refreshDevices();   // aggiorna i device
  });
}



  // -------------------------
  //   SIDEBAR MODES
  // -------------------------
  const mode = selectedDevice
    ? "device"
    : selectedTemplate
    ? "template"
    : "library";

  // -------------------------
  //   RENDER LIBRARY
  // -------------------------
  function renderLibrary() {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ marginBottom: 10 }}>Device Library</h2>

        {categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: 5,
                color: cat.color,
              }}
            >
              {cat.name}
            </div>

            {templates
              .filter((t) => t.category_id === cat.id)
              .map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "6px 10px",
                    background: "#eee",
                    borderRadius: 6,
                    marginBottom: 6,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span onClick={() => handleInstantiate(t.id)}>
                    ➕ {t.name}
                  </span>

                  <span
                    onClick={() => setSelectedTemplate(t)}
                    style={{
                      fontSize: 18,
                      cursor: "pointer",
                      padding: "0 6px",
                    }}
                  >
                    ⋮
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  // -------------------------
  //   RENDER DEVICE PROPERTIES
  // -------------------------
  function renderDeviceProperties() {
    return (
      <DeviceProperties
        device={selectedDevice}
        ports={selectedDevicePorts}
        onUpdateDevice={onUpdateDevice}
        onDeleteDevice={onDeleteDevice}
        onRefreshPorts={onRefreshPorts}
        onBack={onBack}
      />
    );
  }

  // -------------------------
  //   RENDER TEMPLATE PROPERTIES
  // -------------------------
  function renderTemplateProperties() {
    return (
      <TemplateProperties
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
        refreshTemplates={refreshTemplates}
      />
    );
  }

  // -------------------------
  //   MAIN RENDER
  // -------------------------
  return (
    <div
       style={{
    width: 320,
    flexShrink: 0,   
     background: "#ffffff",
    borderRight: "2px solid #ccc",
    overflowY: "auto",
  }}

    >
      {mode === "library" && renderLibrary()}
      {mode === "device" && renderDeviceProperties()}
      {mode === "template" && renderTemplateProperties()}
    </div>
  );
}


