import qs from "qs";
import { Route, routeSchema, StartParamType } from "./route-types.ts";
import * as v from "valibot";

export function routeToUrl(route: Route): string {
  const currentParams = new URLSearchParams(window.location.search);
  const startParam = currentParams.get("start");

  if (route.type === "main") {
    return startParam ? `/?start=${startParam}` : "/";
  }

  const routeParams = qs.stringify(route, { encode: false });
  const finalParams = startParam
    ? `start=${startParam}&${routeParams}`
    : routeParams;

  return `/?${finalParams}`;
}

export function urlToRoute(url: string): Route | null {
  const urlObj = new URL(url, window.location.origin);

  // Handle root path
  if (urlObj.pathname === "/" && !urlObj.searchParams.get("type")) {
    return { type: "main" };
  }

  // Handle legacy start params (for Telegram compatibility)
  const start = urlObj.searchParams.get("start");
  if (
    start &&
    Object.values(StartParamType).includes(start as StartParamType)
  ) {
    return null;
  }

  const params = qs.parse(urlObj.search, { ignoreQueryPrefix: true });

  const result = v.safeParse(routeSchema, params);
  return result.success ? result.output : null;
}
