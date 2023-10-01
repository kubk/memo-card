import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./screens/App.tsx";
import "./index.css";
import WebApp from "@twa-dev/sdk";

WebApp.ready();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
