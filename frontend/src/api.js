const API_URL = "http://localhost:8000";   // 👈 modifica se usi un'altra porta

// -------------------------
//   GENERIC GET
// -------------------------
async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

// -------------------------
//   GENERIC POST
// -------------------------
async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// -------------------------
//   GENERIC PUT
// -------------------------
async function apiPut(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// -------------------------
//   GENERIC DELETE
// -------------------------
async function apiDelete(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
  return res.json();
}

// -------------------------
//   DEVICES
// -------------------------
export function getDevices() {
  return apiGet("/devices");
}

export function addDevice(data) {
  return apiPost("/devices", data);
}

export function updateDevice(id, data) {
  return apiPut(`/devices/${id}`, data);
}

export function deleteDevice(id) {
  return apiDelete(`/devices/${id}`);
}

export function getDevicePorts(id) {
  return apiGet(`/devices/${id}/ports`);
}

// -------------------------
//   CATEGORIES
// -------------------------
export function getCategories() {
  return apiGet("/categories");
}

// -------------------------
//   TEMPLATES
// -------------------------
export function getTemplates() {
  return apiGet("/templates");
}

export function updateTemplate(id, data) {
  return apiPut(`/templates/${id}`, data);
}

export function deleteTemplate(id) {
  return apiDelete(`/templates/${id}`);
}

export function instantiateTemplate(templateId) {
  return apiPost(`/templates/${templateId}/instantiate`, {});
}
