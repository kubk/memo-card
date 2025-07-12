import * as v from "valibot";

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
  cardId: optionalStringToNumber,
  index: stringToNumber,
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

const cardQuickAddFormRouteSchema = v.object({
  type: v.literal("cardQuickAddForm"),
  deckId: stringToNumber,
});

const deckCatalogRouteSchema = v.object({
  type: v.literal("deckCatalog"),
});

const aiMassCreationRouteSchema = v.object({
  type: v.literal("aiMassCreation"),
  deckId: stringToNumber,
  deckTitle: v.nullable(v.optional(v.string())),
});

const catalogSettingsRouteSchema = v.object({
  type: v.literal("catalogSettings"),
  id: stringToNumber,
  itemType: v.picklist(["folder", "deck"]),
});

const plansRouteSchema = v.object({
  type: v.literal("plans"),
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

export const routeSchema = v.union([
  mainRouteSchema,
  deckMineRouteSchema,
  deckPublicRouteSchema,
  deckFormRouteSchema,
  cardPreviewRouteSchema,
  folderFormRouteSchema,
  folderPreviewRouteSchema,
  reviewAllRouteSchema,
  reviewCustomRouteSchema,
  cardQuickAddFormRouteSchema,
  deckCatalogRouteSchema,
  aiMassCreationRouteSchema,
  catalogSettingsRouteSchema,
  plansRouteSchema,
  debugRouteSchema,
  componentCatalogRouteSchema,
  freezeCardsRouteSchema,
  userStatisticsRouteSchema,
  browserLoginRouteSchema,
  userSettingsRouteSchema,
  globalSearchRouteSchema,
]);

export type Route = v.InferOutput<typeof routeSchema>;
export type DeckFormRoute = v.InferOutput<typeof deckFormRouteSchema>;
