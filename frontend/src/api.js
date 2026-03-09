const API_URL = "http://localhost:8000";

// -------------------------
//   GENERIC REQUEST
// -------------------------
async function apiRequest(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    // Se la risposta non è JSON valido, evita crash
    const text = await res.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      console.error("API ERROR:", res.status, data);
      throw new Error(data?.detail || "API Error");
    }

    return data;
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return null;
  }
}

// -------------------------
//   WRAPPERS
// -------------------------
function apiGet(path) {
  return apiRequest(path, { method: "GET" });
}

function apiPost(path, body) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function apiPut(path, body) {
  return apiRequest(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function apiDelete(path) {
  return apiRequest(path, { method: "DELETE" });
}

// -------------------------
//   DEVICES
// -------------------------
export const getDevices = () => apiGet("/devices");
export const addDevice = (data) => apiPost("/devices", data);
export const updateDevice = (id, data) => apiPut(`/devices/${id}`, data);
export const deleteDevice = (id) => apiDelete(`/devices/${id}`);
export const getDevicePorts = (id) => apiGet(`/devices/${id}/ports`);

// -------------------------
//   CATEGORIES
// -------------------------
export const getCategories = () => apiGet("/categories");

// -------------------------
//   TEMPLATES
// -------------------------
export const getTemplates = () => apiGet("/templates");
export const updateTemplate = (id, data) =>
  apiPut(`/templates/${id}`, data);
export const deleteTemplate = (id) =>
  apiDelete(`/templates/${id}`);
export const instantiateTemplate = (templateId) =>
  apiPost(`/templates/${templateId}/instantiate`, {});
