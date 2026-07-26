# TODO — zola-harmless

## ✅ Done (this session)

- **Initial commit** — theme skeleton: config, templates, partials, shortcodes, macros, scripts, static assets, demo content in `content/{p/,w/}`.
- **i18n** — `translate` macro in `macros/translate.html` with English defaults; override via `config.extra.translations`.
- **Playwright tests** — 23 tests across 8 spec files covering homepage, blog, wiki, backlinks, graph, link colours, responsive layout, and accessibility.
- **Screenshot** — `screenshot.png` showing the theme's Tufte layout with a sample wiki note.
- **README.md** — comprehensive project documentation covering quick start, features, configuration, content structure, shortcodes, build pipeline, and development commands.

## ☐ Next (near-term)

- [ ] **Submit Gallery PR** — submit `zola-harmless` to the [Zola Themes Gallery](https://github.com/getzola/themes).
  - Create theme gallery entry (metadata, screenshot, demo link).
  - Follow gallery submission guidelines (fork, add entry, PR).
- [ ] **Gallery PR merged** — wait for gallery maintainers to review and merge.

## ☐ Optional (later)

- [ ] **Visual regression baselines** — generate and commit Playwright screenshot snapshots (`tests/screenshots/`) to catch unintended visual changes in CI.
- [ ] **CI pipeline** — GitHub Actions (or equivalent) to run `make test` on push/PR.
- [ ] **More thorough edge cases** — empty content sections, pages without dates, long titles, large backlink maps, non-ASCII URLs.
