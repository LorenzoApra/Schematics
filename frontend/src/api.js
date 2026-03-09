const API_URL = "http://localhost:8000";

// -------------------------
//   DEVICES
// -------------------------

export async function getDevices() {
  const res = await fetch(`${API_URL}/devices`);
  return res.json();
}

export async function addDevice(device) {
  const res = await fetch(`${API_URL}/devices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device),
  });
  return res.json();
}

export async function updateDevice(id, data) {
  const res = await fetch(`${API_URL}/devices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDevice(id) {
  const res = await fetch(`${API_URL}/devices/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// -------------------------
//   DEVICE PORTS
// -------------------------

export async function getDevicePorts(deviceId) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports`);
  return res.json();
}

export async function addDevicePort(deviceId, data) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDevicePort(portId, data) {
  const res = await fetch(`${API_URL}/device_ports/${portId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDevicePort(portId) {
  const res = await fetch(`${API_URL}/device_ports/${portId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function reorderDevicePorts(deviceId, direction, order) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, order }),
  });
  return res.json();
}

// -------------------------
//   CATEGORIES
// -------------------------

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function addCategory(data) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(id, data) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// -------------------------
//   TEMPLATES
// -------------------------

export async function getTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  return res.json();
}

export async function addTemplate(data) {
  const res = await fetch(`${API_URL}/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTemplate(id, data) {
  const res = await fetch(`${API_URL}/templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTemplate(id) {
  const res = await fetch(`${API_URL}/templates/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// -------------------------
//   TEMPLATE PORTS
// -------------------------

export async function getTemplatePorts(templateId) {
  const res = await fetch(`${API_URL}/templates/${templateId}/ports`);
  return res.json();
}

export async function addTemplatePort(templateId, data) {
  const res = await fetch(`${API_URL}/templates/${templateId}/ports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTemplatePort(portId, data) {
  const res = await fetch(`${API_URL}/template_ports/${portId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTemplatePort(portId) {
  const res = await fetch(`${API_URL}/template_ports/${portId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function reorderTemplatePorts(templateId, direction, order) {
  const res = await fetch(`${API_URL}/templates/${templateId}/ports/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, order }),
  });
  return res.json();
}

// -------------------------
//   INSTANTIATE TEMPLATE
// -------------------------

export async function instantiateTemplate(templateId) {
  const res = await fetch(`${API_URL}/templates/${templateId}/instantiate`, {
    method: "POST",
  });
  return res.json();
}
