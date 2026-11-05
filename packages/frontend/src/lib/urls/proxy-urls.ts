import { links } from "api";
import { env } from "../../env.ts";
import { trimEnd } from "../string/trim.ts";

// Users whose ISP blocks Cloudflare open the app through a proxy that serves
// the API at /api and R2 media at /media on the same origin
const isProxyHost = window.location.origin === links.appProxy;

const mediaUrl = `${trimEnd(env.VITE_R2_PUBLIC_URL, "/")}/`;
const proxyMediaUrl = `${links.appProxy}/media/`;

export const apiUrl = isProxyHost ? `${links.appProxy}/api` : env.VITE_API_URL;

// Display-only: stored content keeps canonical media URLs
export function toViewerMediaUrls(text: string) {
  return isProxyHost ? text.replaceAll(mediaUrl, proxyMediaUrl) : text;
}
