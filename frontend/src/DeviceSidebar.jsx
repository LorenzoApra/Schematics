import { useState, useEffect } from "react";
import {
  getCategories,
  getTemplates,
  instantiateTemplate,
  addCategory,
  addTemplate,
  addTemplatePort,
  addDevice,
} from "./api";

import DeviceProperties from "./DeviceProperties";
import TemplateProperties from "./TemplateProperties";

export default function DeviceSidebar({
  devices,
  selectedDevice,
  selectedDevicePorts,
  onSelectDevice,
  onUpdateDevice,
  onDeleteDevice,
  onRefreshPorts,
  onBack,
  refreshDevices,
}) {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#cccccc");

  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateColor, setNewTemplateColor] = useState("#cccccc");
  const [newTemplateCategoryId, setNewTemplateCategoryId] = useState(null);
  const [newTemplatePortName, setNewTemplatePortName] = useState("");
  const [newTemplatePortType, setNewTemplatePortType] = useState("ethernet");

  const [manualDeviceName, setManualDeviceName] = useState("");
  const [manualDeviceColor, setManualDeviceColor] = useState("#cccccc");
  const [manualTemplateId, setManualTemplateId] = useState(null);

  useEffect(() => {
    refreshCategories();
    refreshTemplates();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      setSelectedTemplate(null);
    }
  }, [selectedDevice]);

  function refreshCategories() {
    getCategories().then((data) => setCategories(data || []));
  }

  function refreshTemplates() {
    getTemplates().then((data) => setTemplates(data || []));
  }

  // Helper: get category color, fallback to category id 1000 or default
  function getCategoryColor(catId) {
    const cat =
      categories.find((c) => c.id === catId) ||
      categories.find((c) => c.id === 1000);
    return cat ? cat.color : "#cccccc";
  }

  // CREATE CATEGORY
  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    const created = await addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
    });
    if (created) {
      setNewCategoryName("");
      setNewCategoryColor("#cccccc");
      refreshCategories();
      refreshTemplates();
    }
  }

  // CREATE TEMPLATE (+ optional initial port)
  async function handleCreateTemplate() {
    if (!newTemplateName.trim()) return;
    const created = await addTemplate({
      name: newTemplateName.trim(),
      color: newTemplateColor,
      category_id:
        newTemplateCategoryId || (categories[0] && categories[0].id) || 1000,
    });
    if (created) {
      if (newTemplatePortName.trim()) {
        await addTemplatePort(created.id, {
          name: newTemplatePortName.trim(),
          type: newTemplatePortType,
        });
        setNewTemplatePortName("");
        setNewTemplatePortType("ethernet");
      }
      setNewTemplateName("");
      setNewTemplateColor("#cccccc");
      setNewTemplateCategoryId(null);
      refreshTemplates();
      refreshCategories();
    }
  }

  // INSTANTIATE TEMPLATE (create device) — ensure device color inherits category color
  async function handleInstantiate(templateId) {
    const device = await instantiateTemplate(templateId);
    // If backend returned device, ensure color is set (fallback to template/category color)
    if (device) {
      let color = device.color;
      if (!color) {
        const tpl = templates.find((t) => t.id === templateId);
        const catId = tpl?.category_id ?? 1000;
        color = getCategoryColor(catId);
        // patch color via onUpdateDevice if available (keeps backend in sync)
        if (onUpdateDevice) {
          await onUpdateDevice(device.id, { color });
        }
      }
      refreshDevices();
      if (onSelectDevice) onSelectDevice(device);
    } else {
      // fallback: refresh lists
      refreshDevices();
    }
  }

  // CREATE DEVICE MANUALLY — assign color from selected template's category or fallback 1000
  async function handleCreateDevice() {
    if (!manualDeviceName.trim()) return;

    let colorToUse = manualDeviceColor || "#cccccc";
    if (!manualDeviceColor || manualDeviceColor === "#cccccc") {
      if (manualTemplateId) {
        const tpl = templates.find((t) => t.id === manualTemplateId);
        colorToUse = getCategoryColor(tpl?.category_id);
      } else {
        colorToUse = getCategoryColor(1000);
      }
    }

    const created = await addDevice({
      name: manualDeviceName.trim(),
      color: colorToUse,
      template_id: manualTemplateId || null,
      x: 100,
      y: 100,
    });

    if (created) {
      setManualDeviceName("");
      setManualDeviceColor("#cccccc");
      setManualTemplateId(null);
      refreshDevices();
      if (onSelectDevice) onSelectDevice(created);
    }
  }

  const mode = selectedDevice
    ? "device"
    : selectedTemplate
    ? "template"
    : "library";

  function renderLibrary() {
    return (
      <div style={{ padding: 12 }}>
        {/* CREATE CATEGORY */}
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: "6px 0" }}>Create Category</h3>
          <input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{ width: "100%", marginBottom: 6, padding: 6 }}
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            style={{ marginBottom: 6 }}
          />
          <div>
            <button onClick={handleCreateCategory} style={{ marginTop: 6 }}>
              Create Category
            </button>
          </div>
        </div>

        {/* CREATE TEMPLATE */}
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: "6px 0" }}>Create Template</h3>
          <input
            placeholder="Template name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            style={{ width: "100%", marginBottom: 6, padding: 6 }}
          />
          <input
            type="color"
            value={newTemplateColor}
            onChange={(e) => setNewTemplateColor(e.target.value)}
            style={{ marginBottom: 6 }}
          />
          <select
            value={newTemplateCategoryId || ""}
            onChange={(e) => setNewTemplateCategoryId(Number(e.target.value))}
            style={{ width: "100%", marginBottom: 6, padding: 6 }}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 6 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Initial Port (optional)</label>
            <input
              placeholder="eth0"
              value={newTemplatePortName}
              onChange={(e) => setNewTemplatePortName(e.target.value)}
              style={{ width: "60%", marginRight: 6, padding: 6 }}
            />
            <input
              placeholder="ethernet"
              value={newTemplatePortType}
              onChange={(e) => setNewTemplatePortType(e.target.value)}
              style={{ width: "35%", padding: 6 }}
            />
          </div>

          <div>
            <button onClick={handleCreateTemplate} style={{ marginTop: 8 }}>
              Create Template
            </button>
          </div>
        </div>

        {/* CREATE DEVICE MANUAL */}
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: "6px 0" }}>Create Device</h3>
          <input
            placeholder="Device name"
            value={manualDeviceName}
            onChange={(e) => setManualDeviceName(e.target.value)}
            style={{ width: "100%", marginBottom: 6, padding: 6 }}
          />
          <input
            type="color"
            value={manualDeviceColor}
            onChange={(e) => setManualDeviceColor(e.target.value)}
            style={{ marginBottom: 6 }}
          />
          <select
            value={manualTemplateId || ""}
            onChange={(e) => setManualTemplateId(Number(e.target.value))}
            style={{ width: "100%", marginBottom: 6, padding: 6 }}
          >
            <option value="">No template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <div>
            <button onClick={handleCreateDevice}>Create Device</button>
          </div>
        </div>

        {/* LIBRARY */}
        <div style={{ paddingTop: 8 }}>
          <h2 style={{ marginBottom: 10 }}>Device Library</h2>

          {categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: "bold", marginBottom: 6, color: cat.color }}>
                {cat.name}
              </div>

              {templates
                .filter((t) => t.category_id === cat.id)
                .map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: "8px 10px",
                      background: "#f6f6f6",
                      borderRadius: 6,
                      marginBottom: 6,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span onClick={() => handleInstantiate(t.id)}>➕ {t.name}</span>

                    <span
                      onClick={() => setSelectedTemplate(t)}
                      style={{ fontSize: 18, cursor: "pointer", padding: "0 6px" }}
                    >
                      ⋮
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

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

  function renderTemplateProperties() {
    return (
      <TemplateProperties
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
        refreshTemplates={refreshTemplates}
        refreshCategories={refreshCategories}
      />
    );
  }

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
