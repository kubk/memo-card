# MobX Usage Guide

This guide provides a comprehensive overview of how MobX is used in this project, along with best practices to follow.

## Core Concepts

- **Stores as Classes**: MobX stores are defined as ES6 classes. This helps in organizing the state and related actions in a structured manner.
- **`makeAutoObservable`**: We use `makeAutoObservable` in the store's constructor to automatically make properties observable, methods as actions, and getters as computed values. This reduces boilerplate and simplifies store creation.
- **Automatic Component Updates**: The project uses `mobx-react-observer/babel-plugin`, which automatically wraps all React components with `observer`. This means you don't need to manually wrap your components with the `observer` HOC from `mobx-react-lite`.

## Global vs. Local Stores

### Global Stores

Global stores are singletons, meaning there is only one instance of the store throughout the application's lifecycle. They are suitable for managing application-wide state, such as user information, screen routing, etc.

**Definition:**

Global stores are instantiated in their own file and exported as a singleton.

```typescript
// packages/frontend/src/store/user-store.ts

import { makeAutoObservable } from "mobx";
// ... other imports

export class UserStore {
  userInfo?: UserDbType;
  // ... other properties

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser(user: UserDbType) {
    this.userInfo = user;
  }

  // ... other methods and getters
}

export const userStore = new UserStore();
```

**Usage:**

Import the global store instance directly into your components or other stores.

```tsx
// MyComponent.tsx

import { userStore } from "../store/user-store";

export function MyComponent() {
  return <div>{userStore.user?.name}</div>;
};
```

### Local Stores

Local stores are designed to manage the state of a specific component or a subtree of components. They are instantiated within a React component's lifecycle.

**Definition:**

Local stores are defined as classes, but they are not exported as singletons.

```typescript
// packages/frontend/src/screens/deck-review/store/review-store.ts

import { makeAutoObservable } from "mobx";
// ... other imports

export class ReviewStore {
  // ... properties

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // ... methods and getters
}
```

**Usage:**

Instantiate the local store within a functional component using the `useState` hook to ensure that the store instance is preserved across re-renders.

```tsx
// MyComponent.tsx

import { useState } from "react";
import { ReviewStore } from "../screens/deck-review/store/review-store";

export function MyComponent() {
  const [reviewStore] = useState(() => new ReviewStore());

  return (
    <div>
      {/* Use the local store */}
    </div>
  );
};
```

## Best Practices

### Never Modify Store State Directly from Components

**IMPORTANT: Always use store methods (actions) to modify state. Never assign to store properties directly from React components.**

Store methods provide a clear API, make state changes traceable, and keep business logic in the store where it belongs.

**❌ BAD - Direct property assignment in component:**
```tsx
export function DeleteButton({ store }: { store: WorkflowStore }) {
  return (
    <button onClick={() => store.workflowToDeleteId = workflow.id}>
      Delete
    </button>
  );
}
```

**✅ GOOD - Use store action method:**
```tsx
export function DeleteButton({ store }: { store: WorkflowStore }) {
  return (
    <button onClick={() => store.openDeleteDialog(workflow.id)}>
      Delete
    </button>
  );
}
```

### Always Pass Stores, Not Individual Props

**IMPORTANT: Always pass the store itself to child components, not individual observable values or actions.** Access store properties directly in the component that needs them.

The later you read an observable value, the better the reactivity. When you pass individual props, you're reading the observable early (in the parent), which causes the parent to re-render. When you pass the store and read observables late (in the child), only the child re-renders.

**❌ BAD - Prop drilling observables (causes parent rerenders):**
```tsx
// Parent component re-renders when ANY store property changes
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

**✅ GOOD - Pass store directly (optimal reactivity):**
```tsx
// Parent component never re-renders
export function Parent() {
  return <Child store={store} />;
}
```

**✅ ALSO GOOD - For global stores, import directly:**
```tsx
// Parent component
export function Parent() {
  return <Child />;
}

// Child component - access global store directly
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

This pattern:
- **Optimal reactivity**: Only components using specific observables re-render
- **No prop drilling**: Store is passed once, not multiple props
- **Late binding**: Observables are read as late as possible
- **Leverages MobX**: Uses MobX's fine-grained reactivity system

### Naming Conventions

Avoid using underscore prefixes for property names (e.g., `_prop` with a getter). Instead, use simple property names directly. If you need to distinguish between internal and external state, use computed getters that derive from other observable state.

### State Persistence

Use `mobx-persist-store` for state persistence

### Avoid `useEffect` for Reactions

Instead of using `useEffect` to react to state changes, use MobX's built-in reaction functions like `autorun`, `reaction`, and `when`. This keeps your components clean and separates the view logic from the business logic.

```typescript
// packages/frontend/src/store/user-store.ts
import { autorun } from "mobx";

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
  // ...
}
```

## Use Reactions Sparingly

The MobX documentation advises using reactions (`autorun`, `reaction`) sparingly. Here’s a summary of why and what to do instead:

### 1. Prefer `computed` for Derived State

Reactions run *after* an action completes, which can lead to unpredictable behavior if you rely on their results within the same action. `computed` values, on the other hand, are synchronous and update automatically, making them more reliable for deriving state.

**Instead of this (unreliable):**
```typescript
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

**Do this (reliable):**
```typescript
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

### 2. Avoid Chains of Reactions

MobX does not guarantee the execution order of multiple reactions that depend on each other. This can lead to inconsistent state. A chain of `computed` values, however, is always calculated in a strict, deterministic order.

### 3. Group State Changes and Side Effects

Avoid creating reactions in separate, unknown parts of your application that listen for state changes to trigger side effects (like API calls). This makes the code difficult to trace and debug. Instead, explicitly call the side effect within the action that changes the state.

**Instead of this (hard to track):**
```typescript
// Somewhere in the app
reaction(
  () => articleStore.text,
  (value) => apiSaveArticle(value)
);
```

**Do this (clear and predictable):**
```typescript
class ArticleStore {
  updateText(text: string) {
    this.text = text;
    apiSaveArticle(this.text); // Side effect is here
  }
  // ...
}
```

### When to Use Reactions

- **Data Serialization**: Automatically saving data to `localStorage`, `IndexedDB`, or other external storage when it changes is a good use case for reactions.

### Simple Rules for Reactions

1.  **Don't modify other observable state** inside a reaction.
2.  **Avoid reactions that depend on each other.**
3.  **Prefer `computed` values** for deriving state.
4.  **Group side effects with the actions** that trigger them.
