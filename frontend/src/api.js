const API_URL = "http://localhost:8000";

// Generic request wrapper robusto
async function apiRequest(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      console.error("API ERROR:", res.status, data);
      throw new Error(data?.detail || `API Error ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return null;
  }
}

// Wrappers
export const apiGet = (path) => apiRequest(path, { method: "GET" });
export const apiPost = (path, body) =>
  apiRequest(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (path, body) =>
  apiRequest(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = (path) =>
  apiRequest(path, { method: "DELETE" });

// Devices
export const getDevices = () => apiGet("/devices/");
export const addDevice = (data) => apiPost("/devices/", data);
export const updateDevice = (id, data) => apiPut(`/devices/${id}`, data);
export const deleteDevice = (id) => apiDelete(`/devices/${id}`);
export const getDevicePorts = (id) => apiGet(`/devices/${id}/ports/`);

// Categories
export const getCategories = () => apiGet("/categories/");
export const addCategory = (data) => apiPost("/categories/", data);

// Templates
export const getTemplates = () => apiGet("/templates/");
export const addTemplate = (data) => apiPost("/templates/", data);
export const updateTemplate = (id, data) => apiPut(`/templates/${id}`, data);
export const deleteTemplate = (id) => apiDelete(`/templates/${id}`);
export const addTemplatePort = (templateId, data) =>
  apiPost(`/templates/${templateId}/ports/`, data);
export const getTemplatePorts = (templateId) =>
  apiGet(`/templates/${templateId}/ports/`);
export const instantiateTemplate = (templateId) =>
  apiPost(`/templates/${templateId}/instantiate/`, {});

// Device ports (device-specific)
export const addDevicePort = (deviceId, data) =>
  apiPost(`/devices/${deviceId}/ports/`, data);
export const updateDevicePort = (deviceId, portId, data) =>
  apiPut(`/devices/${deviceId}/ports/${portId}/`, data);
export const deleteDevicePort = (deviceId, portId) =>
  apiDelete(`/devices/${deviceId}/ports/${portId}/`);
