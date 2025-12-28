# Testing Mocks Pattern

## Approach

All mock files export a generic `mock()` function and are imported dynamically in tests using `vi.mock()` with import statements.

## Structure

Mock files live next to the modules they mock with a `.mock.ts` extension:

```
lib/platform/show-alert.ts
lib/platform/show-alert.mock.ts
```

Each mock exports a `mock()` function that returns the mocked implementation:

```ts
export function mock() {
  return {
    showAlert: () => {},
  };
}
```

## Usage in Tests

Use dynamic imports with the module path as an import statement:

```ts
vi.mock(import("../../../lib/platform/show-alert.ts"), () =>
  import("../../../lib/platform/show-alert.mock.ts").then((m) => m.mock()),
);
```

## Benefits

- **Type Safety**: Import statements provide full TypeScript path validation for both the module and mock
- **Reusability**: Standardized `mock()` export makes mocks consistent and easy to reuse
- **Dynamic Loading**: Ensures proper module mocking while maintaining module graph integrity
