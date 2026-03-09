import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";   // 👈 IMPORTANTE: carica il layout corretto

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
