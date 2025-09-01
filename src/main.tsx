import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/700.css";
import "./i18n";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 2. ENVUELVE TU APP CON BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);