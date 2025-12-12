export function extractImageUrl(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export function hasCardImage(html: string): boolean {
  return html.includes("<img");
}

export function renderCardImage(url: string): string {
  return `<img src="${url}">`;
}
