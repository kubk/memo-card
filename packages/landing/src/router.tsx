import { createRouter } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({ routeTree });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface StaticDataRouteOption {
    language?: LandingLanguage;
  }
}
