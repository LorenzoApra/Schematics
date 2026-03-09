import { useState, useEffect } from "react";
import {
  getTemplatePorts,
  addTemplatePort,
  updateTemplatePort,
  deleteTemplatePort,
  reorderTemplatePorts,
  updateTemplate,
  deleteTemplate,
  getCategories,
} from "./api";

import PortTypeSelector from "./PortTypeSelector";

export default function TemplateProperties({
  template,
  onBack,
  refreshTemplates,
}) {
  const [ports, setPorts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadPorts();
    loadCategories();
  }, [template]);

  function loadPorts() {
    getTemplatePorts(template.id).then(setPorts);
  }

  function loadCategories() {
    getCategories().then(setCategories);
  }

  // -------------------------
  //   FILTER IN / OUT
  // -------------------------
  const inPorts = ports.filter((p) => p.direction === "in");
  const outPorts = ports.filter((p) => p.direction === "out");

  // -------------------------
  //   UPDATE TEMPLATE NAME
  // -------------------------
  function handleNameChange(newName) {
    updateTemplate(template.id, { name: newName }).then(() =>
      refreshTemplates()
    );
  }

  // -------------------------
  //   UPDATE TEMPLATE CATEGORY
  // -------------------------
  function handleCategoryChange(newCatId) {
    updateTemplate(template.id, { category_id: Number(newCatId) }).then(() =>
      refreshTemplates()
    );
  }

  // -------------------------
  //   ADD PORT
  // -------------------------
  function handleAddPort(direction) {
    addTemplatePort(template.id, {
      name: direction === "in" ? "IN" : "OUT",
      type: "HDMI",
      direction,
    }).then(loadPorts);
  }

  // -------------------------
  //   UPDATE PORT NAME
  // -------------------------
  function handleNameChangePort(portId, newName) {
    updateTemplatePort(portId, { name: newName }).then(loadPorts);
  }

  // -------------------------
  //   UPDATE PORT TYPE
  // -------------------------
  function handleTypeChange(portId, newType) {
    updateTemplatePort(portId, { type: newType }).then(loadPorts);
  }

  // -------------------------
  //   DELETE PORT
  // -------------------------
  function handleDeletePort(portId) {
    deleteTemplatePort(portId).then(loadPorts);
  }

  // -------------------------
  //   DRAG & DROP
  // -------------------------
  const [draggingId, setDraggingId] = useState(null);

  function handleDragStart(portId) {
    setDraggingId(portId);
  }

  function handleDragEnter(portId, direction) {
    if (!draggingId || draggingId === portId) return;

    const list = direction === "in" ? [...inPorts] : [...outPorts];
    const draggingIndex = list.findIndex((p) => p.id === draggingId);
    const targetIndex = list.findIndex((p) => p.id === portId);

    if (draggingIndex === -1 || targetIndex === -1) return;

    const newList = [...list];
    const [moved] = newList.splice(draggingIndex, 1);
    newList.splice(targetIndex, 0, moved);

    const updated =
      direction === "in"
        ? [...newList, ...outPorts]
        : [...inPorts, ...newList];

    setPorts(updated);
  }

  function handleDragEnd(direction) {
    const list = direction === "in" ? inPorts : outPorts;
    const order = list.map((p) => p.id);

    reorderTemplatePorts(template.id, direction, order).then(() => {
      setDraggingId(null);
      loadPorts();
    });
  }

  // -------------------------
  //   RENDER PORT ROW
  // -------------------------
  function renderPort(port, direction) {
    return (
      <div
        key={port.id}
        draggable
        onDragStart={() => handleDragStart(port.id)}
        onDragEnter={() => handleDragEnter(port.id, direction)}
        onDragEnd={() => handleDragEnd(direction)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid #ddd",
          cursor: "grab",
        }}
      >
        {/* DRAG HANDLE */}
        <span style={{ cursor: "grab", fontSize: 18 }}>⠿</span>

        {/* TYPE SELECTOR */}
        <PortTypeSelector
          value={port.type}
          onChange={(v) => handleTypeChange(port.id, v)}
        />

        {/* NAME INPUT */}
        <input
          value={port.name}
          onChange={(e) => handleNameChangePort(port.id, e.target.value)}
          style={{
            flex: 1,
            padding: "4px 6px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        {/* DELETE */}
        <span
          onClick={() => handleDeletePort(port.id)}
          style={{
            cursor: "pointer",
            color: "red",
            fontWeight: "bold",
            padding: "0 6px",
          }}
        >
          ✕
        </span>
      </div>
    );
  }

  // -------------------------
  //   MAIN RENDER
  // -------------------------
  return (
    <div style={{ padding: 20 }}>
      <h2>Template Properties</h2>

      {/* NAME */}
      <label style={{ fontWeight: "bold" }}>Name</label>
      <input
        value={template.name}
        onChange={(e) => handleNameChange(e.target.value)}
        style={{
          width: "100%",
          padding: "6px",
          marginBottom: 10,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      {/* CATEGORY */}
      <label style={{ fontWeight: "bold" }}>Category</label>
      <select
        value={template.category_id || ""}
        onChange={(e) => handleCategoryChange(e.target.value)}
        style={{
          width: "100%",
          padding: "6px",
          marginBottom: 20,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* IN PORTS */}
      <h3>IN Ports</h3>
      {inPorts.map((p) => renderPort(p, "in"))}
      <button onClick={() => handleAddPort("in")}>+ Add IN</button>

      {/* OUT PORTS */}
      <h3 style={{ marginTop: 20 }}>OUT Ports</h3>
      {outPorts.map((p) => renderPort(p, "out"))}
      <button onClick={() => handleAddPort("out")}>+ Add OUT</button>

      {/* DELETE TEMPLATE */}
      <button
        onClick={() =>
          deleteTemplate(template.id).then(() => {
            refreshTemplates();
            onBack();
          })
        }
        style={{
          marginTop: 30,
          width: "100%",
          padding: 10,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Delete Template
      </button>

      {/* BACK */}
      <button
        onClick={onBack}
        style={{
          marginTop: 10,
          width: "100%",
          padding: 10,
          background: "#ccc",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}