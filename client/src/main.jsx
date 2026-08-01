import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Feuilles de styles globales, importées une seule fois ici pour toute
// l'application (variables, reset, animations, puis styles par section).
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);