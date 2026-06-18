import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { RoleProvider } from "./context/RoleContext";
import { Toaster } from "react-hot-toast";
import "./assets/tailwind.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-surface)",
              color: "var(--text-strong)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            },
          }}
        />
      </RoleProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
