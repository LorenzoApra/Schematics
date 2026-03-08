export const API = "http://localhost:8000";

export async function getDevices() {
  return fetch(`${API}/devices`).then(r => r.json());
}

export async function addDevice(device) {
  return fetch(`${API}/devices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device),
  }).then(r => r.json());
}

export async function updateDevice(id, data) {
  return fetch(`${API}/devices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export async function deleteDevice(id) {
  return fetch(`${API}/devices/${id}`, { method: "DELETE" }).then(r => r.json());
}

export async function getTemplates() {
  return fetch(`${API}/templates`).then(r => r.json());
}

export async function addTemplate(template) {
  return fetch(`${API}/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(template),
  }).then(r => r.json());
}

export async function updateTemplate(id, data) {
  return fetch(`${API}/templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export async function deleteTemplate(id) {
  return fetch(`${API}/templates/${id}`, { method: "DELETE" }).then(r => r.json());
}

export async function getCategories() {
  return fetch(`${API}/categories`).then(r => r.json());
}

export async function addCategory(cat) {
  return fetch(`${API}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cat),
  }).then(r => r.json());
}

export async function updateCategory(id, data) {
  return fetch(`${API}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());
}

export async function deleteCategory(id) {
  return fetch(`${API}/categories/${id}`, { method: "DELETE" }).then(r => r.json());
}
