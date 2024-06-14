export type LanguageShared = "en" | "ru" | "es" | "pt-br";

export enum LanguageCatalogItemAvailableIn {
  En = "en",
  Ru = "ru",
  Es = "es",
  Uk = "uk",
  PtBr = "pt-br",
}

export const languageCatalogItemAvailableInToNative = (
  type: LanguageCatalogItemAvailableIn,
) => {
  switch (type) {
    case LanguageCatalogItemAvailableIn.En:
      return "English";
    case LanguageCatalogItemAvailableIn.Ru:
      return "Русский";
    case LanguageCatalogItemAvailableIn.Es:
      return "Español";
    case LanguageCatalogItemAvailableIn.Uk:
      return "Українська";
    case LanguageCatalogItemAvailableIn.PtBr:
      return "Português (Brasil)";
    default:
      return type;
  }
};
