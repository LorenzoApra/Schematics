import { useState, useRef, useEffect } from "react";

const PORT_TYPES = {
  Video: [
    "HDMI",
    "SDI",
    "DisplayPort",
    "NDI",
    "IP Video",
    "USB-C Video",
    "IP2110",
    "OPT",
  ],
  Audio: ["XLR", "Jack", "RCA", "Dante", "AES/EBU"],
  Network: ["Ethernet", "Ethernet + PoE", "Fiber"],
  Lighting: ["DMX", "ArtNet", "sACN"],
  Power: [
    "CEE 16 Mono",
    "CEE 32 Mono",
    "CEE 16 Penta",
    "CEE 32 Penta",
    "CEE 63 Penta",
    "CEE 125 Penta",
    "Powerlock",
    "Socapex",
    "Civile EU",
    "Civile Ita",
  ],
  Altro: ["Custom"],
};

export default function PortTypeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customValue, setCustomValue] = useState("");
  const wrapperRef = useRef(null);

  // -------------------------
  //   CLOSE ON CLICK OUTSIDE
  // -------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------
  //   FILTER TYPES
  // -------------------------
  function filterTypes(list) {
    if (!search.trim()) return list;
    return list.filter((t) =>
      t.toLowerCase().includes(search.toLowerCase())
    );
  }

  // -------------------------
  //   HANDLE SELECT
  // -------------------------
  function handleSelect(type) {
    if (type === "Custom") {
      // apri inline input
      setCustomValue("");
    } else {
      onChange(type);
      setOpen(false);
    }
  }

  // -------------------------
  //   RENDER DROPDOWN
  // -------------------------
  function renderDropdown() {
    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          width: 220,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: 6,
          padding: 8,
          zIndex: 999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {/* SEARCH BAR */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        {/* GROUPS */}
        <div style={{ maxHeight: 250, overflowY: "auto" }}>
          {Object.entries(PORT_TYPES).map(([group, types]) => {
            const filtered = filterTypes(types);
            if (filtered.length === 0) return null;

            return (
              <div key={group} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 13,
                    marginBottom: 4,
                    opacity: 0.7,
                  }}
                >
                  {group}
                </div>

                {filtered.map((type) => (
                  <div
                    key={type}
                    onClick={() => handleSelect(type)}
                    style={{
                      padding: "4px 6px",
                      borderRadius: 4,
                      cursor: "pointer",
                      background:
                        value === type ? "rgba(0,0,0,0.1)" : "transparent",
                    }}
                  >
                    {type}
                  </div>
                ))}

                {/* CUSTOM INLINE */}
                {filtered.includes("Custom") && (
                  <div style={{ marginTop: 6 }}>
                    <input
                      placeholder="Custom type..."
                      value={customValue}
                      onChange={(e) => {
                        setCustomValue(e.target.value);
                        onChange(e.target.value);
                      }}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #aaa",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* SELECTED VALUE */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: 4,
          cursor: "pointer",
          background: "white",
          minWidth: 80,
        }}
      >
        {value}
      </div>

      {open && renderDropdown()}
    </div>
  );
}