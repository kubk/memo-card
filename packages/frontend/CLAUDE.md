# Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: MobX with mobx-react-lite
- **Routing**: Wouter (lightweight router)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React (use for all icons)
- **Build Tool**: Vite with React plugin and MobX observer babel plugin so you never wrap React components with observer
- **Multi-target**: Builds both main app and admin panel from same codebase

# Mobx & React
- Use `makeAutoObservable(this, {}, { autoBind: true })` for all the stores
- a global store is always singleton, a local store should be initialized like this: const [storeName] = useState(() => new StoreName())
- Whenever AI generates a component it should not wrap it with observer even if it is a mobx component. We use a plugin to wrap components with observer automatically.
- you must consult `./docs/mobx-guide.md` to understand how to use MobX
- you never add aria-label

Good example:

```tsx
export function Good({
  prop1,
  prop2,
}: {
  prop1: string;
  prop2: number;
}) {
  return // component code
}
```

# Icons
- Use `lucide-react`, full names like MoonIcon, PlusIcon, instead of Moon, Plus
- Use `TrashIcon` for removal

# Color theme

Since it's a Telegram Mini App colors come from Telegram for both light & dark mode automatically. You should avoid hardcoding colors because the app should work in both light and dark modes. Check `tailwind.config.js` for color variables

# RTL Support

The project supports both LTR and RTL. So avoid hardcoding side margins or text alignment.

Bad example (margin right is hardcoded):

```tsx
<div className="flex">
  <div className="w-4 h-4 mr-2">A</div>
  <div>B</div>
</div>
```

Good example (margin right is not hardcoded and on RTL it will be on the left):

```tsx
<div className="flex gap-2">
  <div className="w-4 h-4">A</div>
  <div>B</div>
</div>
```

# Shared Types
- API types exported from `packages/api/src/shared.ts`
- Frontend imports API types via workspace dependency (import { fn } from 'api')

# Special Considerations
- Telegram Web App has specific UI constraints and platform APIs
- Admin panel is a separate build target with different authentication requirements