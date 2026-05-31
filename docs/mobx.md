# MobX Guide

Use this as the MobX source of truth for future AI-assisted work in this repo.

## Core Patterns

- Stores are ES6 classes.
- Use `makeAutoObservable(this, {}, { autoBind: true })` in store constructors so properties become observable, methods become actions, getters become computed values, and methods stay bound.
- The frontend uses `mobx-react-observer/babel-plugin`, so React components are automatically wrapped with `observer`. Do not manually add `observer` unless the local setup clearly requires it.
- Use `mobx-persist-store` for state persistence.
- Avoid underscore-prefixed backing fields such as `_prop` plus a getter. Prefer simple property names or computed getters derived from observable state.

## Global Stores

Global stores are singleton instances for app-wide state such as user data, routing, preferences, panels, connection state, and other shared UI state.

Define and export the singleton from the store file:

```ts
import { makeAutoObservable } from "mobx";

export class UserStore {
  userInfo?: UserDbType;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser(user: UserDbType) {
    this.userInfo = user;
  }
}

export const userStore = new UserStore();
```

Import global stores directly from components, other stores, classes, and plain functions:

```tsx
import { userStore } from "../store/user-store";

export function MyComponent() {
  return <div>{userStore.user?.name}</div>;
}
```

Read singleton store values at the point of use. Do not copy them into fields, constructor params, init params, local React state, or pass-through props. Copying creates stale snapshots.

Wrong:

```ts
class Foo {
  density: string;

  constructor(density: string) {
    this.density = density;
  }

  doWork() {
    // uses this.density
  }
}

const foo = new Foo(prefs.density);
```

Right:

```ts
class Foo {
  doWork() {
    // reads prefs.density directly
  }
}
```

## Local Stores

Local stores manage state for a component or subtree. Define them as classes, but do not export singleton instances.

```ts
import { makeAutoObservable } from "mobx";

export class ReviewStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
```

Create local stores at the React boundary with `useState` so the instance survives re-renders:

```tsx
import { useState } from "react";
import { ReviewStore } from "../screens/deck-review/store/review-store";

export function MyComponent() {
  const [reviewStore] = useState(() => new ReviewStore());

  return <ReviewPanel store={reviewStore} />;
}
```

For local stores, pass the store object itself. Do not split it into individual observable values and actions:

```tsx
const [store] = useState(() => new LocalStore());

return <Comp store={store} />;
```

## Props And Late Reads

Do not pass store values, store-derived values, or store methods through props, constructor args, or function params when the consumer can import the singleton store directly. Props are for parent-to-child data unique to a component instance, not for forwarding global state.

Wrong:

```tsx
<GameCanvas density={prefs.density} />
localGame.setDensity(prefs.density);
```

Right:

```tsx
import { prefs } from "../lib/prefs-store";

// Read prefs.density where it is actually needed.
```

For global stores, leaf components should import and read the store themselves:

```tsx
export function Parent() {
  return <Child />;
}

import { uiStore } from "@/store/ui-store";

export function Child() {
  return (
    <div
      className={uiStore.isOpen ? "open" : "closed"}
      onClick={uiStore.close}
    />
  );
}
```

For local stores, pass `store={store}` once:

```tsx
export function Parent() {
  return <Child store={store} />;
}
```

Avoid this:

```tsx
export function Parent() {
  return (
    <Child
      isOpen={store.isOpen}
      onClose={store.close}
      data={store.items}
    />
  );
}
```

Late reads improve MobX reactivity: the component that reads the observable re-renders, instead of a parent re-rendering because it read the observable early.

## Store Ownership

If something needs to be reactive and persisted, put it in a store. Consumers read store state; they do not own it.

Components must use store methods to modify state. Do not assign to store properties directly from React components.

Wrong:

```tsx
export function DeleteButton({ store }: { store: WorkflowStore }) {
  return (
    <button onClick={() => (store.workflowToDeleteId = workflow.id)}>
      Delete
    </button>
  );
}
```

Right:

```tsx
export function DeleteButton({ store }: { store: WorkflowStore }) {
  return (
    <button onClick={() => store.openDeleteDialog(workflow.id)}>
      Delete
    </button>
  );
}
```

Store actions should own loading flags, validation, side effects, async orchestration, analytics/logging, haptics, query invalidation, and follow-up state changes. React can choose which action to call, but should not split one user intent across React state and store state.

Wrong:

```tsx
async function handleCardClick(id: TournamentSelectorId) {
  const card = cards?.[id];
  if (!card || card.kind !== "fill_joinable") return;

  haptic("light");
  setJoiningCardId(id);
  await tournamentStore.joinFillRun();
  queryClient.invalidateQueries({
    queryKey: trpc.listTournamentRuns.queryKey(),
  });
}
```

Preferred:

```tsx
async function handleCardClick(id: TournamentSelectorId) {
  const card = cards?.[id];
  if (!card || card.kind !== "fill_joinable") return;

  await tournamentStore.joinFillRun(id);
}
```

```ts
joiningCardId: TournamentSelectorId | null = null;

async joinFillRun(cardId: TournamentSelectorId) {
  if (this.isJoiningTournament) return;

  haptic("light");
  this.isJoiningTournament = true;
  this.joiningCardId = cardId;

  try {
    const result = await trpcClient.joinFillTournamentRun.mutate();
    await this.waitForTournamentEntry(result.runId);
    queryClient.invalidateQueries({
      queryKey: trpc.listTournamentRuns.queryKey(),
    });
    this.setWaitingRun(result.runId);
    await this.connectRoom(result.runId);
  } finally {
    runInAction(() => {
      this.isJoiningTournament = false;
      this.joiningCardId = null;
    });
  }
}
```

Store-private constants and snapshot types should stay in the store file. Do not add a shared module for values that only one store uses.

## `runInAction`

Use `runInAction(...)` only inside an `async` function after an `await`, when execution has crossed an async boundary and observable writes need to be batched back into an action.

Right:

```ts
async load() {
  const data = await fetchStuff();

  runInAction(() => {
    this.items = data.items;
    this.loaded = true;
  });
}
```

Do not use `runInAction(...)` for synchronous code, promise chains, timers, or event/listener callbacks.

Wrong:

```ts
promise.then(() => {
  runInAction(() => {
    this.loaded = true;
  });
});
```

Right:

```ts
promise.then(
  action(() => {
    this.loaded = true;
  }),
);
```

The same callback rule applies to `catch`, `finally`, `setTimeout`, `setInterval`, room listeners, DOM listeners, and similar callback-based APIs: wrap the callback itself with `action(...)`.

## Reactions

Avoid `useEffect` for MobX reactions. Use MobX `autorun`, `reaction`, and `when` when code must react to observable changes.

```ts
import { autorun, makeAutoObservable } from "mobx";

export class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    autorun(() => {
      if (this.isRtl) {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }
    });
  }
}
```

Use reactions sparingly:

- Prefer computed getters for derived state.
- Do not modify other observable state inside a reaction.
- Avoid reactions that depend on each other; MobX does not guarantee execution order between dependent reactions.
- Group side effects with the action that triggers them when possible.
- Good reaction use case: data serialization to `localStorage`, `IndexedDB`, or another external storage target.

Prefer computed state:

```ts
class UserStore {
  age = 15;

  constructor() {
    makeAutoObservable(this);
  }

  get isAllowed() {
    return this.age >= 18;
  }
}
```

Avoid derived state through reactions:

```ts
class UserStore {
  age = 15;
  isAllowed = false;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this.isAllowed = this.age >= 18;
    });
  }
}
```

Prefer explicit side effects inside actions:

```ts
class ArticleStore {
  updateText(text: string) {
    this.text = text;
    apiSaveArticle(this.text);
  }
}
```

Avoid hard-to-trace side effects in unrelated reactions:

```ts
reaction(
  () => articleStore.text,
  (value) => apiSaveArticle(value),
);
```

## Shared Transient UI State

Move UI state into a global MobX store when all of these are true:

- The state is transient UI state, not domain data.
- Multiple components need to read or mutate it.
- The trigger and rendered UI are far apart in the tree.
- Props would only forward singleton state from parent to child.

Typical candidates:

- Drawer open state.
- Modal open state.
- Bottom sheet visibility.
- Shared overlay visibility.
- Global tabs or panels controlled from several places.
- App-level connection or presence state rendered by UI.

Keep `useState` local when state is truly component-local.

After moving shared UI state to a singleton store:

- Trigger components import the store and call store methods directly.
- Rendered UI components read store fields directly.
- Close handlers write back to the same store.
- One-store-only constants and snapshot types stay in the store file.
- Parent components stop forwarding singleton-derived props.
- Query `enabled` flags can read the same source of truth as the UI visibility state.

This creates one source of truth, reduces prop drilling, avoids stale snapshots, and keeps components dependent on the actual store instead of pass-through props.

Anti-pattern:

```tsx
<Trigger onOpen={uiStore.openPanel} />
<Panel open={uiStore.panelOpen} onOpenChange={uiStore.setPanelOpen} />
```

The parent is still wiring global store data through props.

Preferred:

```tsx
import { uiStore } from "../lib/ui-store";

function Trigger() {
  return <Button onClick={() => uiStore.setSomePanelOpen(true)} />;
}

function SomePanel() {
  return (
    <Panel
      open={uiStore.somePanelOpen}
      onOpenChange={uiStore.setSomePanelOpen}
    />
  );
}
```

For local stores, keep the boundary explicit:

```tsx
function Parent() {
  const [store] = useState(() => new LocalStore());

  return <SomePanel store={store} />;
}
```
