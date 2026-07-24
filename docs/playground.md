# Playground

## Do

- Add every page to `PLAYGROUND_COMPONENTS` and render it through `ComponentPreview`
- Set `propsPanel: false` when a page has no useful controls so the preview uses the full available width
- Reuse production components and keep story-only state local
- Render app-facing copy through `t(...)` or an existing translation helper

## Don't

- Don't show an empty Props panel
- Don't duplicate controls in Props when the preview already provides the necessary interaction
- Don't hardcode or paraphrase translated app copy in stories
