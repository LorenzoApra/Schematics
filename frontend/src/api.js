const API_URL = "http://127.0.0.1:8000";

// ------------------------------------------------------------
// HELPER: fetch con error handling
// ------------------------------------------------------------
async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    // Se la risposta non è OK → errore
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ API ERROR ${res.status} @ ${url}:`, text);

      throw new Error(
        `API error ${res.status}: ${text || res.statusText}`
      );
    }

    // Se c'è JSON → restituiscilo
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return null;
  } catch (err) {
    console.error(`🔥 FETCH FAILED @ ${url}:`, err);
    throw err;
  }
}

// ------------------------------------------------------------
// CATEGORIES
// ------------------------------------------------------------
export async function getCategories() {
  return apiFetch(`${API_URL}/categories`);
}

export async function createCategory(data) {
  return apiFetch(`${API_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ------------------------------------------------------------
// DEVICE MODELS
// ------------------------------------------------------------
export async function getDeviceModels() {
  return apiFetch(`${API_URL}/models`);
}

export async function getDeviceModel(id) {
  return apiFetch(`${API_URL}/models/${id}`);
}

export async function createDeviceModel(data) {
  return apiFetch(`${API_URL}/models`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDeviceModel(id, data) {
  return apiFetch(`${API_URL}/models/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDeviceModel(id) {
  return apiFetch(`${API_URL}/models/${id}`, {
    method: "DELETE",
  });
}

// ------------------------------------------------------------
// MODEL PORTS
// ------------------------------------------------------------
export async function createModelPort(modelId, data) {
  return apiFetch(`${API_URL}/models/${modelId}/ports`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateModelPort(portId, data) {
  return apiFetch(`${API_URL}/models/ports/${portId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteModelPort(portId) {
  return apiFetch(`${API_URL}/models/ports/${portId}`, {
    method: "DELETE",
  });
}

// ------------------------------------------------------------
// DEVICES
// ------------------------------------------------------------
export async function getDevices() {
  return apiFetch(`${API_URL}/devices`);
}

export async function getDevice(id) {
  return apiFetch(`${API_URL}/devices/${id}`);
}

export async function createDevice(data) {
  return apiFetch(`${API_URL}/devices`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDevice(id, data) {
  return apiFetch(`${API_URL}/devices/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDevice(id) {
  return apiFetch(`${API_URL}/devices/${id}`, {
    method: "DELETE",
  });
}

// ------------------------------------------------------------
// DEVICE PORTS
// ------------------------------------------------------------
export async function createDevicePort(deviceId, data) {
  return apiFetch(`${API_URL}/devices/${deviceId}/ports`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDevicePort(portId, data) {
  return apiFetch(`${API_URL}/devices/ports/${portId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDevicePort(portId) {
  return apiFetch(`${API_URL}/devices/ports/${portId}`, {
    method: "DELETE",
  });
}

// ------------------------------------------------------------
// CONNECTIONS
// ------------------------------------------------------------
export async function getConnections() {
  return apiFetch(`${API_URL}/connections`);
}

export async function createConnection(data) {
  return apiFetch(`${API_URL}/connections`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteConnection(id) {
  return apiFetch(`${API_URL}/connections/${id}`, {
    method: "DELETE",
  });
}

// ------------------------------------------------------------
// INSTANTIATE DEVICE FROM MODEL
// ------------------------------------------------------------
export async function instantiateDeviceModel(modelId) {
  return apiFetch(`${API_URL}/devices/from-model/${modelId}`, {
    method: "POST",
  });
}
