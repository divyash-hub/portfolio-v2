import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/syne/wght.css";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./styles/tokens.css";
import "./styles/base.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
