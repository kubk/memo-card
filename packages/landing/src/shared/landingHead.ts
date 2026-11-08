import { LandingLanguage, links } from "api";
import { getLandingPath, LandingPage } from "./landingPaths";
import { getTranslation } from "./translations";

// Crawlers (X, Telegram, Slack) need an absolute image URL. Rename the file
// when the image changes so cached previews refresh.
const shareImageUrl = `${links.landing}/og/memocard-og.png`;
const shareImageAlt = "MemoCard: Flashcards in Telegram";
const shareTitle = "MemoCard: Flashcards in Telegram";

const ogLocales: Record<LandingLanguage, string> = {
  [LandingLanguage.en]: "en_US",
  [LandingLanguage.ru]: "ru_RU",
  [LandingLanguage.es]: "es_ES",
  [LandingLanguage.ptBr]: "pt_BR",
  [LandingLanguage.uk]: "uk_UA",
};

export function getShareMeta({
  language,
  page,
  title,
  description,
}: {
  language: LandingLanguage;
  page: LandingPage;
  title: string;
  description: string;
}) {
  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: `${links.landing}${getLandingPath(language, page)}`,
    },
    { property: "og:site_name", content: "MemoCard" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: ogLocales[language] },
    { property: "og:image", content: shareImageUrl },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: shareImageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: shareImageUrl },
    { name: "twitter:image:alt", content: shareImageAlt },
  ];
}

export function getLandingHead(language: LandingLanguage) {
  const { meta } = getTranslation(language);

  return {
    meta: [
      { name: "description", content: meta.description },
      { name: "keywords", content: meta.keywords.join(",") },
      ...getShareMeta({
        language,
        page: "home",
        title: shareTitle,
        description: meta.description,
      }),
    ],
  };
}
