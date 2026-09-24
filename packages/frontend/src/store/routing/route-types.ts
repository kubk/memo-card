import * as v from "valibot";
import { type CatalogFolderDbType } from "api";

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

const leaderboardRouteSchema = v.object({
  type: v.literal("leaderboard"),
});

const deckPreviewRouteSchema = v.object({
  type: v.literal("deckPreview"),
  deckId: stringToNumber,
});

const deckFormRouteSchema = v.object({
  type: v.literal("deckForm"),
  deckId: optionalStringToNumber,
  folderId: optionalStringToNumber,
  folderName: v.optional(v.string()),
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

const cardListPreviewRouteSchema = v.object({
  type: v.literal("cardListPreview"),
  deckId: stringToNumber,
  sortBy: cardFilterSortBySchema,
  sortDirection: cardFilterDirectionSchema,
  searchText: v.optional(v.string()),
});

const speakingCardsRouteSchema = v.object({
  type: v.literal("speakingCards"),
  deckId: stringToNumber,
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

const plansRouteSchema = v.object({
  type: v.literal("plans"),
  planType: v.literal("pro"),
});

const debugRouteSchema = v.object({
  type: v.literal("debug"),
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

const mcpSettingsRouteSchema = v.object({
  type: v.literal("mcpSettings"),
});

const globalSearchRouteSchema = v.object({
  type: v.literal("globalSearch"),
});

const aboutRouteSchema = v.object({
  type: v.literal("about"),
});

const sharedDeckNotFoundRouteSchema = v.object({
  type: v.literal("sharedDeckNotFound"),
});

export const routeSchema = v.union([
  mainRouteSchema,
  leaderboardRouteSchema,
  v.object({ type: v.literal("leaderboardStatistics") }),
  deckPreviewRouteSchema,
  deckFormRouteSchema,
  ankiImportRouteSchema,
  cardListRouteSchema,
  cardListPreviewRouteSchema,
  speakingCardsRouteSchema,
  cardPreviewRouteSchema,
  folderFormRouteSchema,
  folderPreviewRouteSchema,
  reviewAllRouteSchema,
  reviewCustomRouteSchema,
  deckCatalogRouteSchema,
  plansRouteSchema,
  debugRouteSchema,
  freezeCardsRouteSchema,
  userStatisticsRouteSchema,
  userStatisticsDailyRouteSchema,
  teacherStatisticsRouteSchema,
  teacherStatisticsListRouteSchema,
  browserLoginRouteSchema,
  userSettingsRouteSchema,
  mcpSettingsRouteSchema,
  globalSearchRouteSchema,
  aboutRouteSchema,
  sharedDeckNotFoundRouteSchema,
]);

type RouteWithoutState = v.InferOutput<typeof routeSchema>;

export type Route = RouteWithoutState & {
  state?: {
    folder?: CatalogFolderDbType;
  };
};
export type DeckFormRoute = Extract<Route, { type: "deckForm" }>;

export const withoutRouteState = (route: Route): RouteWithoutState => {
  const { state: _state, ...routeWithoutState } = route;
  return routeWithoutState as RouteWithoutState;
};
