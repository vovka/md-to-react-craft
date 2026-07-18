# Dialogue / Polemical Article Layout

Last updated: 2026-07-18

## Overview

A post can be marked `layout: "dialogue"` in its frontmatter to render as a debate: one or more
primary/opponent argument pairs, shown as two aligned columns on desktop (bottom-aligned per pair)
and collapsing to a single stacked column on mobile or when the reader hides the "second opinion".

## Key Files

- `src/types/blog.ts`: `layout`, `primaryAuthor`, `opponentAuthor` fields on `BlogPost`.
- `scripts/process-posts.js`: carries the new frontmatter fields into `src/lib/posts.ts`.
- `src/lib/splitDialogueBlocks.ts`: parses `:::dialogue`/`:::primary`/`:::opponent` markers out of
  the raw markdown into an ordered list of plain-markdown and dialogue-pair segments.
- `src/components/blog/markdownConfig.tsx`: shared `remark`/`rehype`/component config, reused by
  both the normal renderer and the dialogue columns.
- `src/components/blog/DialogueContent.tsx`: maps segments to `<ReactMarkdown>` or `<DialoguePair>`.
- `src/components/blog/DialoguePair.tsx`: renders one primary/opponent row as a two-column grid.
- `src/pages/BlogPost.tsx`: wide container + "Hide/Show second opinion" toggle for dialogue posts.

## Conventions

- Markers must sit on their own line: `:::dialogue`, `:::primary`, `:::opponent`, `:::`.
- Nesting is fixed at two levels (`:::dialogue` containing `:::primary`/`:::opponent`).
- The opponent panel is visible by default (`showOpponent` starts `true`).
- Non-dialogue posts are unaffected — `BlogPost.tsx` only takes the dialogue path when
  `post.layout === "dialogue"`.

## Testing

```bash
docker compose run --rm app npm run process-posts
docker compose up -d app
```

Then verify a dialogue post in the browser: two bottom-aligned columns on desktop, toggle collapses
to a single centered column, and an existing non-dialogue post still renders exactly as before.

`node src/lib/splitDialogueBlocks.selfcheck.ts` runs the parser self-check directly (Node 24+ runs
`.ts` files natively; no build step or test framework needed).

## Known Issues

`npm run lint` currently fails on pre-existing shadcn/Tailwind lint issues outside this feature.
