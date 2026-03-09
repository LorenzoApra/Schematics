const API_URL = "http://127.0.0.1:8000";


// ============================================================
// CATEGORY API
// ============================================================

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function createCategory(data) {
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



// ============================================================
// DEVICE MODEL API (ex Template)
// ============================================================

export async function getDeviceModels() {
  const res = await fetch(`${API_URL}/device-models`);
  return res.json();
}

export async function createDeviceModel(data) {
  const res = await fetch(`${API_URL}/device-models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDeviceModel(id, data) {
  const res = await fetch(`${API_URL}/device-models/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDeviceModel(id) {
  const res = await fetch(`${API_URL}/device-models/${id}`, {
    method: "DELETE",
  });
  return res.json();
}



// ============================================================
// MODEL PORT API (porte del modello)
// ============================================================

export async function getModelPorts(modelId) {
  const res = await fetch(`${API_URL}/device-models/${modelId}/ports`);
  return res.json();
}

export async function createModelPort(modelId, data) {
  const res = await fetch(`${API_URL}/device-models/${modelId}/ports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateModelPort(modelId, portId, data) {
  const res = await fetch(`${API_URL}/device-models/${modelId}/ports/${portId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteModelPort(modelId, portId) {
  const res = await fetch(`${API_URL}/device-models/${modelId}/ports/${portId}`, {
    method: "DELETE",
  });
  return res.json();
}



// ============================================================
// INSTANTIATE DEVICE MODEL → CREATE DEVICE INSTANCE
// ============================================================

export async function instantiateDeviceModel(modelId) {
  const res = await fetch(`${API_URL}/device-models/${modelId}/instantiate`, {
    method: "POST",
  });
  return res.json();
}



// ============================================================
// DEVICE INSTANCE API
// ============================================================

export async function getDevices() {
  const res = await fetch(`${API_URL}/devices`);
  return res.json();
}

export async function createDevice(data) {
  const res = await fetch(`${API_URL}/devices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
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



// ============================================================
// DEVICE PORT INSTANCE API
// ============================================================

export async function getDevicePorts(deviceId) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports`);
  return res.json();
}

export async function createDevicePort(deviceId, data) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDevicePort(deviceId, portId, data) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports/${portId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDevicePort(deviceId, portId) {
  const res = await fetch(`${API_URL}/devices/${deviceId}/ports/${portId}`, {
    method: "DELETE",
  });
  return res.json();
}
