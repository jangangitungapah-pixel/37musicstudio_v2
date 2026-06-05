import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";

import "./styles/variables.css";
import "./styles/index.css";
import "./styles/landing.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
