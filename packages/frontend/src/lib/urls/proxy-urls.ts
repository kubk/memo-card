import { links } from "api";

// Users whose ISP blocks Cloudflare open the app through a proxy that serves
// R2 media at /media on the same origin
const isProxyHost = window.location.origin === links.appProxy;

const mediaUrl = `${links.media}/`;
const proxyMediaUrl = `${links.appProxy}/media/`;

// Display-only: stored content keeps canonical media URLs
export function toViewerMediaUrls(text: string) {
  return isProxyHost ? text.replaceAll(mediaUrl, proxyMediaUrl) : text;
}
