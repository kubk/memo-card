import { LandingLanguage } from "api";
import { getTranslation } from "./translations";

export function getLandingHead(language: LandingLanguage) {
  const { meta } = getTranslation(language);

  return {
    meta: [
      { name: "description", content: meta.description },
      { name: "keywords", content: meta.keywords.join(",") },
    ],
  };
}
