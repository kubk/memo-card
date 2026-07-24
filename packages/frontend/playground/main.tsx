import ReactDOM from "react-dom/client";
import "./playground.css";
import { Playground } from "./playground.tsx";
import { platform } from "../src/lib/platform/platform.ts";

platform.initialize();
ReactDOM.createRoot(document.getElementById("root")!).render(<Playground />);
