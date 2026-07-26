# PLAN — zola-harmless

## Architecture overview

### Template hierarchy

```
base.html                  ← layout shell: nav, footer, global styles
├── index.html             ← homepage (content/_index.md)
├── section.html           ← blog/wiki listing pages (content/p/, content/w/)
├── post.html              ← individual blog post (content/p/*.md)
├── wiki.html              ← individual wiki note (content/w/*.md)
└── graph.html             ← D3.js link graph page (content/graph.md)
```

**Partials** (included by `base.html`):
- `partials/nav.html` — site navigation bar (home, blog, notes, graph, RSS)
- `partials/footer.html` — author email link + git commit hash

**Shortcodes** (used inside page content):
- `shortcodes/backlinks.html` — renders incoming links from `backlinks.json`
- `shortcodes/drawio.html` — embeds interactive draw.io diagrams
- `shortcodes/marginnote.html` — Tufte-style margin notes

**Macros**:
- `macros/translate.html` — i18n helper: `translate(key, default)` looks up translations from config

### Content structure

```
content/
├── _index.md              # Homepage
├── p/                     # Blog posts (chronological)
│   ├── _index.md          # Blog index (section.html)
│   └── *.md               # Posts (post.html)
├── w/                     # Wiki notes (evergreen, cross-linked)
│   ├── _index.md          # Wiki index (section.html)
│   └── *.md               # Notes (wiki.html)
└── graph.md               # Graph page (graph.html, template: graph.html)
```

### Build pipeline (double-build)

```
┌─────────┐    ┌──────────────┐    ┌─────────┐    ┌──────────────┐
│  Zola   │ →  │ backlinks.js │ →  │  Zola   │ →  │ sitemap.js   │
│ build 1 │    │ (reads HTML, │    │ build 2 │    │ (generates   │
│         │    │  writes JSON)│    │         │    │  sitemap.xml)│
└─────────┘    └──────────────┘    └─────────┘    └──────────────┘
```

1. **Zola build** — generates static site from content + templates
2. **backlinks.js** — scans all `.html` files, extracts `<a href>` links, builds reverse map (`backlinks.json`), copies to `static/` and `public/`
3. **Zola build (again)** — rebuilds with `backlinks.json` available at compile time via `load_data()`; `backlinks.html` shortcode renders incoming links
4. **sitemap.js** — generates `sitemap.xml` from final output (filters to `/p/`, `/w/`, `/`, `/graph/`)

---

## Key decisions

| Decision | Rationale |
|---|---|
| **CSS `@scope`** | Component-scoped styles without class name collisions or BEM. Each template scopes its rules (`.article-page`, `.wiki-page`, `.graph-page`, `.backlinks`, `.section-listing`). |
| **Tufte layout** | Content at 55 % width, margin notes at 35 %, serif typography. Inspired by Edward Tufte's handouts. Applicable to `p/` and `w/` only. |
| **No taxonomies** | No tags, categories, or authors. Single-author digital garden. Keeps templates simple and reduces build complexity. |
| **Double-build** | Backlinks are computed post-hoc from rendered HTML because Zola has no built-in backlink mechanism. A second build makes backlinks available as `load_data()` at compile time. |
| **Footnotes as margin notes** | Zola `bottom_footnotes = false` + custom CSS renders footnotes in the right margin, consistent with Tufte style. |
| **i18n via `config.extra.translations`** | Single `translate` macro looks up keys in `config.extra.translations`. Defaults are English. Users override per key. |
| **`make`-driven dev** | All commands (`deps`, `build`, `dev`, `test`) run through `Makefile` for reproducibility. |
| **Playwright for integration tests** | Full-page screenshots, navigation, backlinks, responsive breakpoints, accessibility, link colours. Tests run against the demo site content. |

---

## Test strategy

**23 Playwright tests** across 8 spec files, running against the demo content served via `python3 -m http.server`:

| Spec | Tests | What it covers |
|---|---|---|
| `homepage.spec.ts` | 3 | Page load, nav visibility, nav links work |
| `blog.spec.ts` | 2 | Blog listing, post rendering |
| `wiki.spec.ts` | 3 | Wiki listing, note rendering, updated date |
| `backlinks.spec.ts` | 2 | Backlinks appear, backlinks have correct links |
| `graph.spec.ts` | 4 | Graph page loads, SVG presence, script loading |
| `link-colors.spec.ts` | 3 | Content links are blue, nav links are grey |
| `responsive.spec.ts` | 3 | Mobile viewport, margin notes collapse |
| `accessibility.spec.ts` | 3 | Landmarks, heading hierarchy, alt text |

All tests run in `chromium` only. Snapshot directory: `tests/screenshots/`.
