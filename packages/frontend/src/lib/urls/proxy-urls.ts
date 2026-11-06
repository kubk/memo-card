import { links } from "api";
import { env } from "../../env.ts";

// Users whose ISP blocks Cloudflare open the app through a proxy that serves
// the API at /api and R2 media at /media on the same origin
const isProxyHost = window.location.origin === links.appProxy;

const mediaUrl = `${links.media}/`;
const proxyMediaUrl = `${links.appProxy}/media/`;

export const apiUrl = isProxyHost ? `${links.appProxy}/api` : env.VITE_API_URL;

// Display-only: stored content keeps canonical media URLs
export function toViewerMediaUrls(text: string) {
  return isProxyHost ? text.replaceAll(mediaUrl, proxyMediaUrl) : text;
}
