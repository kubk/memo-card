import { CallbackQueue } from "../callback-queue/callback-queue.ts";
import { extractImageUrl, hasCardImage } from "./card-image.ts";

const imageCache = new Set<string>();
const preloadQueue = new CallbackQueue();

export function preloadCardImage(card: {
  front: string;
  back: string;
  example: string | null;
}) {
  preloadCardSideImage(card.front);
  preloadCardSideImage(card.back);
  preloadCardSideImage(card.example);
}

function preloadCardSideImage(side: string | null) {
  if (!side) {
    return;
  }
  const hasImage = hasCardImage(side);
  if (!hasImage) {
    return;
  }
  const url = extractImageUrl(side);
  if (!url || imageCache.has(url)) {
    return;
  }

  imageCache.add(url);
  preloadQueue.add(() => {
    const img = new Image();
    img.src = url;
  });
}
