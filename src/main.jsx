import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import "./assets/tailwind.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
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
    </ThemeProvider>
  </React.StrictMode>,
);
