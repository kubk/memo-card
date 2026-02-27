# Exhaustive Checks in TypeScript

## Overview

Exhaustive checks ensure that all possible values of a discriminated union, enum, or literal type are handled in a switch statement. This prevents bugs when new values are added to a type in the future.

## The Pattern

### Without Exhaustive Check (❌ Bad)

```typescript
type IntegrationType = "hubspotDeals" | "notionDatabase" | "prioritizedSummary";

function formatIntegration(type: string): string {
  switch (type) {
    case "hubspotDeals":
      return "HubSpot Deals";
    case "notionDatabase":
      return "Notion Database";
    case "prioritizedSummary":
      return "AI Summary";
    default:
      return type; // ❌ No compile-time guarantee all cases handled
  }
}
```

**Problems:**
- Accepts `string` instead of specific type
- Default case silently returns the input without errors
- If `IntegrationType` is extended, no compile error warning
- Function could return anything

### With Exhaustive Check (✅ Good)

```typescript
type IntegrationType = "hubspotDeals" | "notionDatabase" | "prioritizedSummary";

function formatIntegration(type: IntegrationType): string {
  switch (type) {
    case "hubspotDeals":
      return "HubSpot Deals";
    case "notionDatabase":
      return "Notion Database";
    case "prioritizedSummary":
      return "AI Summary";
    default:
      return type satisfies never; // ✅ Compile error if case missing
  }
}
```

**Benefits:**
- Accepts the specific type, not `string`
- `satisfies never` creates a type error if any case is unhandled
- TypeScript compiler catches missing cases immediately
- Developers are notified when types change

## Use Cases

### 1. Discriminated Unions

```typescript
import type { Source } from "api";

function formatSource(source: Source): string {
  switch (source.type) {
    case "folder":
      return `Folder: ${source.telegramFolderId}`;
    case "selectedChats":
      return `${source.chats?.length || 0} chats`;
    case "allInbox":
      return "All Inbox";
    default:
      return source satisfies never;
  }
}
```

### 2. String Literals

```typescript
type ScheduleType = "daily" | "weekly" | "everyMinute";

function getScheduleDescription(type: ScheduleType): string {
  switch (type) {
    case "daily":
      return "Every day";
    case "weekly":
      return "Every week";
    case "everyMinute":
      return "Every minute";
    default:
      return type satisfies never;
  }
}
```

## With Error Handling

For integrations that throw errors on unknown types:

```typescript
import type { Integration } from "api";

export async function executeWorkflow(workflow: ScheduledWorkflow): Promise<string> {
  switch (workflow.integration.type) {
    case "hubspotDeals":
      return executeHubspotDeals(chats, workflow.integration);
    case "notionDatabase":
      return executeNotionDatabase(chats, workflow.integration);
    case "prioritizedSummary":
      return executePrioritizedSummary(chats, workflow.integration);
    default:
      throw new Error(
        `Unknown integration type: ${(workflow.integration satisfies never)}`,
      );
  }
}
```

## Best Practices

### ✅ DO

1. **Use specific types**, not `string`
   ```typescript
   function formatIntegration(type: IntegrationType): string // ✅
   function formatIntegration(type: string): string          // ❌
   ```

2. **Always include exhaustive check in default case**
   ```typescript
   default:
     return type satisfies never; // ✅
   ```

### ❌ DON'T

1. **Don't accept `string` types**
   ```typescript
   function format(type: string): string { // ❌ Too broad
   ```

2. **Don't use `any` type assertions**
   ```typescript
   ${(workflow.integration as any).type} // ❌
   ```

3. **Don't silently return in default**
   ```typescript
   default:
     return type; // ❌ Hides bugs
   ```

4. **Don't ignore TypeScript errors**
   ```typescript
   // @ts-ignore // ❌ Defeats the purpose
   ```

## Testing

When you add a new type value, your TypeScript compiler will alert you to all switch statements that need updating:

```bash
npm run type-check
# Compilation error: Type '"newValue"' is not assignable to type 'never'
```

No additional test cases needed - the type system catches it!

## References

- [TypeScript Handbook: Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [TypeScript Satisfies Operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)

