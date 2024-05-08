import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./screens/app.tsx";
import "./index.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { platform } from "./lib/platform/platform.ts";

platform.initialize();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
