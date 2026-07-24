# Playground

## Do

- Add every page to `PLAYGROUND_COMPONENTS` and render it through `ComponentPreview`
- Set `propsPanel: false` when a page has no useful controls so the preview uses the full available width
- Reuse production components and keep story-only state local
- Keep playground-owned UI in English; use translations only for copy rendered by production components

## Don't

- Don't show an empty Props panel
- Don't duplicate controls in Props when the preview already provides the necessary interaction
- Don't reuse production translations for playground navigation or controls just because the labels happen to match
