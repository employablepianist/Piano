# AGENTS — zola-harmless

## Conventions

- **Content** in English (demo content, shortcode examples).
- **Documentation** in English (README, PLAN, TODO, AGENTS).
- **Commits** in English, imperative mood, short (< 72 chars).

---

## Key commands

| Command | What it does |
|---|---|
| `make deps` | Install Zola 0.22.1 + `npm ci` |
| `make dev` | `make build` + `zola serve` on port `DEV_PORT` (default 1111) |
| `make build` | Full double-build pipeline |
| `make test` | Run Playwright tests (23 tests, 8 spec files) |
| `make clean` | Remove `public/` and `.zola/` |

---

## Build pipeline

```
commit-hash → static/build.json
  → zola build (1st) → public/
  → backlinks.js → static/backlinks.json
  → zola build (2nd) → public/ (with backlinks)
  → sitemap.js → public/sitemap.xml
```

**Why double-build?** Zola lacks native backlinks. Build 1 renders all pages; `backlinks.js` scans `.html` files for `<a href>` links and writes a reverse map to `backlinks.json`. Build 2 lets `shortcodes/backlinks.html` `load_data("static/backlinks.json")` at compile time to render incoming links.

---

## Project structure

```
zola-harmless/
├── config.toml           # Demo site config (dev/testing only)
├── theme.toml            # Theme manifest
├── Makefile              # Build automation
├── content/{p,w}/        # Blog (p/) and wiki (w/) demo content
├── templates/            # Tera templates: base → post/wiki/section/index/graph
│   ├── partials/         # nav.html, footer.html
│   ├── shortcodes/       # backlinks.html, drawio.html, marginnote.html
│   └── macros/           # translate.html (i18n)
├── scripts/              # build-backlinks.js, build-sitemap.js
├── tests/e2e/            # 8 Playwright spec files (23 tests)
├── static/               # Favicon, D3.js, build.json, backlinks.json
└── public/               # Build output (gitignored)
```

---

## Key decisions

| Decision | Rationale |
|---|---|
| **CSS `@scope`** | Component-scoped styles without class name collisions or BEM. |
| **Double-build** | Enables backlinks at compile time despite Zola lacking the feature natively. |
| **Tufte CSS** | Content 55 % width, margin notes 35 %, serif typography. Suits long-form writing. |
| **No taxonomies** | Single-author digital garden; tags/categories add no value here. |
| **Footnotes in margin** | `bottom_footnotes = false` + CSS float renders footnotes inline in the right margin. |
| **i18n via `config.extra.translations`** | Lightweight Tera macro with key-based lookup; no external library. |
| **`make` for everything** | Reproducible builds across environments; Zola installed automatically. |

---

## Template hierarchy

```
base.html ← nav.html + footer.html (partials)
├── index.html     (content/_index.md)
├── section.html   (content/{p,w}/_index.md)
├── post.html      (content/p/*.md)
├── wiki.html      (content/w/*.md)
└── graph.html     (content/graph.md)
```

Every page template extends `base.html` and fills `{% block content %}` and `{% block title %}`. Styles are scoped via `@scope` with a class name matching the template (`.article-page`, `.wiki-page`, `.graph-page`, `.section-listing`, `.backlinks`).
