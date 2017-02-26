### Framer 5

A complete rewrite of the core, with everything on top.

- Completely move over to TypeScript for faster development, automated autocomplete and documentation.
- Virtual DOM based rendering while retaining fast performance, especially on mobile.
- A unified component system for easier extensibilty – loosely based on React components.
- An overhaul of the animation system adding animation groups and properties.
- A better way to deal with groups of states for multiple layers at the same time.
- Use points everywhere, without adding to the complexity by default.
- Better testing setup with replayable events for interaction testing.

#### Todo

+ Change css updates to be in renderer
+ Add print and describe in base, take rest out
- Add renderer _createdLayers for full css updates inc position
- Print
- A general system for multiple resolutions

- Port inspect tests

#### Changes

- .toInspect() became .describe()


#### Questions

- Should we move from `properties` to a more friendly `keys` and `values` everywhere?

---

#### Renderer

The renderer takes items to display like layers and contexts and renders them to html. The core is a React like system with lifecycle methods, but it's actually based on Preact under the hood because we don't need everything React does (synthetic events, etc.).

The way Framer stays fast is that it sets styles directly on the html elements (and does not use dom diffing). So Preact only diffs and renders changes in structure, like parents and events.

The different render calls we have:

- updateKeyStyle (layer keys like x, y, width etc.)
- updateCustomStyles (any custom style under layer.styles)
- updateStructure (parents and events)
