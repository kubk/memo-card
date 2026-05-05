import * as v from "valibot";
import { paidPlanTypes } from "api";

export enum StartParamType {
  RepeatAll = "repeat_all",
  DeckCatalog = "catalog",
  Pro = "pro",
  Settings = "settings",
  Components = "ui_kit",
  Debug = "debug",
  Break = "break",
}

const stringToNumber = v.pipe(v.string(), v.transform(Number), v.number());
const optionalStringToNumber = v.optional(stringToNumber);

const cardFilterSortBySchema = v.optional(
  v.picklist(["createdAt", "frontAlpha", "backAlpha"]),
);
const cardFilterDirectionSchema = v.optional(v.picklist(["asc", "desc"]));

const mainRouteSchema = v.object({
  type: v.literal("main"),
});

const deckMineRouteSchema = v.object({
  type: v.literal("deckMine"),
  deckId: stringToNumber,
});

const deckPublicRouteSchema = v.object({
  type: v.literal("deckPublic"),
  deckId: stringToNumber,
});

const deckFormRouteSchema = v.object({
  type: v.literal("deckForm"),
  deckId: optionalStringToNumber,
  folder: v.optional(
    v.object({
      id: stringToNumber,
      name: v.string(),
    }),
  ),
  cardId: v.optional(v.union([stringToNumber, v.literal("new")])),
  sortBy: cardFilterSortBySchema,
  sortDirection: cardFilterDirectionSchema,
  searchText: v.optional(v.string()),
});

const ankiImportRouteSchema = v.object({
  type: v.literal("ankiImport"),
});

const cardListRouteSchema = v.object({
  type: v.literal("cardList"),
  deckId: stringToNumber,
  sortBy: cardFilterSortBySchema,
  sortDirection: cardFilterDirectionSchema,
  searchText: v.optional(v.string()),
});

const speakingCardsRouteSchema = v.object({
  type: v.literal("speakingCards"),
  deckId: stringToNumber,
});

const cardInputModeRouteSchema = v.object({
  type: v.literal("cardInputMode"),
  deckId: stringToNumber,
});

const cardInputModeFormRouteSchema = v.object({
  type: v.literal("cardInputModeForm"),
  deckId: stringToNumber,
  cardInputModeId: v.optional(v.string()),
});

const cardPreviewRouteSchema = v.object({
  type: v.literal("cardPreviewId"),
  cardId: stringToNumber,
  deckId: stringToNumber,
});

const folderFormRouteSchema = v.object({
  type: v.literal("folderForm"),
  folderId: optionalStringToNumber,
});

const folderPreviewRouteSchema = v.object({
  type: v.literal("folderPreview"),
  folderId: stringToNumber,
});

const reviewAllRouteSchema = v.object({
  type: v.literal("reviewAll"),
});

const reviewCustomRouteSchema = v.object({
  type: v.literal("reviewCustom"),
});

const deckCatalogRouteSchema = v.object({
  type: v.literal("deckCatalog"),
  availableIn: v.optional(v.string()),
  categoryId: v.optional(v.string()),
});

const aiMassCreationRouteSchema = v.object({
  type: v.literal("aiMassCreation"),
});

const catalogSettingsRouteSchema = v.object({
  type: v.literal("catalogSettings"),
  id: stringToNumber,
  itemType: v.picklist(["folder", "deck"]),
});

const paidPlanTypeSchema = v.picklist(paidPlanTypes);

const plansRouteSchema = v.object({
  type: v.literal("plans"),
  planType: v.optional(paidPlanTypeSchema),
});

const debugRouteSchema = v.object({
  type: v.literal("debug"),
});

const componentCatalogRouteSchema = v.object({
  type: v.literal("componentCatalog"),
});

const freezeCardsRouteSchema = v.object({
  type: v.literal("freezeCards"),
});

const userStatisticsRouteSchema = v.object({
  type: v.literal("userStatistics"),
});

const userStatisticsDailyRouteSchema = v.object({
  type: v.literal("userStatisticsDaily"),
});

const teacherStatisticsRouteSchema = v.object({
  type: v.literal("teacherStatistics"),
});

const teacherStatisticsListRouteSchema = v.object({
  type: v.literal("teacherStatisticsList"),
  listType: v.picklist(["students", "decks"]),
});

const browserLoginRouteSchema = v.object({
  type: v.literal("browserLogin"),
});

const userSettingsRouteSchema = v.object({
  type: v.literal("userSettings"),
  index: stringToNumber,
});

const globalSearchRouteSchema = v.object({
  type: v.literal("globalSearch"),
});

const aboutRouteSchema = v.object({
  type: v.literal("about"),
});

export const routeSchema = v.union([
  mainRouteSchema,
  deckMineRouteSchema,
  deckPublicRouteSchema,
  deckFormRouteSchema,
  ankiImportRouteSchema,
  cardListRouteSchema,
  speakingCardsRouteSchema,
  cardInputModeRouteSchema,
  cardInputModeFormRouteSchema,
  cardPreviewRouteSchema,
  folderFormRouteSchema,
  folderPreviewRouteSchema,
  reviewAllRouteSchema,
  reviewCustomRouteSchema,
  deckCatalogRouteSchema,
  aiMassCreationRouteSchema,
  catalogSettingsRouteSchema,
  plansRouteSchema,
  debugRouteSchema,
  componentCatalogRouteSchema,
  freezeCardsRouteSchema,
  userStatisticsRouteSchema,
  userStatisticsDailyRouteSchema,
  teacherStatisticsRouteSchema,
  teacherStatisticsListRouteSchema,
  browserLoginRouteSchema,
  userSettingsRouteSchema,
  globalSearchRouteSchema,
  aboutRouteSchema,
]);

export type Route = v.InferOutput<typeof routeSchema>;
export type DeckFormRoute = v.InferOutput<typeof deckFormRouteSchema>;
