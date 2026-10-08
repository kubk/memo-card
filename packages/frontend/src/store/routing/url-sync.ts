import {
  Route,
  routeSchema,
  StartParamType,
  withoutRouteState,
} from "./route-types.ts";
import * as v from "valibot";

export function routeToUrl(route: Route): string {
  const currentParams = new URLSearchParams(window.location.search);
  const startParam = currentParams.get("start");
  const params = new URLSearchParams();

  if (startParam) {
    params.set("start", startParam);
  }

  if (route.type !== "main") {
    for (const [key, value] of Object.entries(withoutRouteState(route))) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
  }

  return params.size ? `/?${params}` : "/";
}

export function urlToRoute(url: string): Route | null {
  const urlObj = new URL(url, window.location.origin);

  if (urlObj.pathname === "/" && !urlObj.searchParams.get("type")) {
    return { type: "main" };
  }

  // Known Telegram start params are handled by the platform launch flow.
  const start = urlObj.searchParams.get("start");
  if (
    start &&
    Object.values(StartParamType).includes(start as StartParamType)
  ) {
    return null;
  }

  const params = Object.fromEntries(urlObj.searchParams);
  delete params.start;

  const result = v.safeParse(routeSchema, params);
  return result.success ? result.output : null;
}
