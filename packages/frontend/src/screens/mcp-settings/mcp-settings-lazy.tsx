import { lazy } from "react";

export const McpSettingsLazy = lazy(() =>
  import("./mcp-settings-screen.tsx").then((module) => ({
    default: module.McpSettingsScreen,
  })),
);
