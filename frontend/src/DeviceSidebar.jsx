import { useState, useEffect } from "react";
import {
  getTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./api";

export default function DeviceSidebar({ onAdd }) {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");

  const [search, setSearch] = useState(""); // 🔍 ricerca

  const [name, setName] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newCatColor, setNewCatColor] = useState("#cccccc");
  const [templateCat, setTemplateCat] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    getTemplates().then(setTemplates);
    getCategories().then(setCategories);
  }, []);

  function getCategoryColor(catId) {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.color : "#dddddd";
  }

  function handleSaveTemplate() {
    if (!name.trim()) return;

    addTemplate({
      name,
      category_id: templateCat ? Number(templateCat) : null,
    }).then((t) => {
      setTemplates([...templates, t]);
      setName("");
    });
  }

  function handleAddCategory() {
    if (!newCat.trim()) return;

    addCategory({ name: newCat, color: newCatColor }).then((c) => {
      setCategories([...categories, c]);
      setNewCat("");
    });
  }

  function handleUpdateCategory(id, name, color) {
    updateCategory(id, { name, color }).then((updated) => {
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
    });
  }

  function handleDeleteCategory(id) {
    deleteCategory(id).then(() => {
      setCategories(categories.filter((c) => c.id !== id));
    });
  }

  function handleUpdateTemplate(id, name) {
    updateTemplate(id, { name }).then((updated) => {
      setTemplates(templates.map((t) => (t.id === id ? updated : t)));
    });
  }

  function handleDeleteTemplate(id) {
    deleteTemplate(id).then(() => {
      setTemplates(templates.filter((t) => t.id !== id));
    });
  }

  // 🔍 FILTRI DI RICERCA
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTemplates = templates.filter((t) => {
    const matchName = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCat === "all" || t.category_id === selectedCat;
    return matchName && matchCategory;
  });

  return (
    <div style={{ width: 260, padding: 20 }}>
      <h3>Categories</h3>

      {/* 🔍 SEARCH BAR */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 15,
          padding: 6,
          border: "1px solid #aaa",
        }}
      />

      {/* ALL BUTTON */}
      <button
        style={{
          width: "100%",
          marginBottom: 10,
          background: "#dddddd",
          color: "black",
          fontWeight: selectedCat === "all" ? "bold" : "normal",
          border: selectedCat === "all" ? "2px solid black" : "1px solid #666",
        }}
        onClick={() => setSelectedCat("all")}
      >
        All
      </button>

      {/* CATEGORY LIST */}
      {filteredCategories.map((c) => (
        <div key={c.id} style={{ marginBottom: 10, position: "relative" }}>
          <button
            style={{
              width: "100%",
              background: c.color,
              color: "#000",
              fontWeight: "bold",
              border: selectedCat === c.id ? "2px solid black" : "1px solid #666",
            }}
            onClick={() => setSelectedCat(c.id)}
          >
            {c.name}
          </button>

          {/* MENU BUTTON */}
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
          >
            ⋮
          </div>

          {/* MENU */}
          {openMenu === c.id && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 30,
                background: "#fff",
                border: "1px solid #aaa",
                padding: 10,
                zIndex: 10,
              }}
            >
              <input
                value={c.name}
                onChange={(e) =>
                  handleUpdateCategory(c.id, e.target.value, c.color)
                }
                style={{ width: "100%", marginBottom: 5 }}
              />

              <input
                type="color"
                value={c.color}
                onChange={(e) =>
                  handleUpdateCategory(c.id, c.name, e.target.value)
                }
                style={{ width: "100%", marginBottom: 5 }}
              />

              <button
                onClick={() => handleDeleteCategory(c.id)}
                style={{ width: "100%", background: "#ffdddd" }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* ADD CATEGORY */}
      <input
        placeholder="New category"
        value={newCat}
        onChange={(e) => setNewCat(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="color"
        value={newCatColor}
        onChange={(e) => setNewCatColor(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={handleAddCategory} style={{ width: "100%" }}>
        Add Category
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Device Library</h3>

      {filteredTemplates.map((t) => {
        const finalColor = getCategoryColor(t.category_id);

        return (
          <div key={t.id} style={{ marginBottom: 10, position: "relative" }}>
            <button
              style={{
                width: "100%",
                background: finalColor,
                padding: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => onAdd(t.name, finalColor)}
            >
              {t.name}
            </button>

            {/* MENU BUTTON */}
            <div
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
            >
              ⋮
            </div>

            {/* MENU */}
            {openMenu === t.id && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 30,
                  background: "#fff",
                  border: "1px solid #aaa",
                  padding: 10,
                  zIndex: 10,
                }}
              >
                <input
                  value={t.name}
                  onChange={(e) => handleUpdateTemplate(t.id, e.target.value)}
                  style={{ width: "100%", marginBottom: 5 }}
                />

                <button
                  onClick={() => handleDeleteTemplate(t.id)}
                  style={{ width: "100%", background: "#ffdddd" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      <hr style={{ margin: "20px 0" }} />

      <h3>Create Custom</h3>

      <input
        placeholder="Device name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <select
        value={templateCat}
        onChange={(e) => setTemplateCat(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          onAdd(
            name,
            templateCat ? getCategoryColor(Number(templateCat)) : "#dddddd"
          )
        }
        style={{ width: "100%", marginBottom: 10 }}
      >
        Add to Canvas
      </button>

      <button onClick={handleSaveTemplate} style={{ width: "100%" }}>
        Save to Library
      </button>
    </div>
  );
}
