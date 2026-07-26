+++
title = "Hello, World"
date = 2024-01-15
+++

This is the first post in my **digital garden**. The idea of a digital garden differs from
a traditional blog: notes aren't published in a finished state, but *grow*
over time, like real plants.

## What is a digital garden

A digital garden is a metaphor for a personal knowledge space where:

- Notes are constantly **refined** and expanded
- *Connections* and cross-references are created between notes
- There's no strict chronology — only a knowledge structure

> A digital garden is neither a blog nor a wiki. It's something in between: a personal space
> for growing ideas.
>
> — Adapted from Mike Caulfield's idea

### Tools for digital gardening

Here are a few popular tools for creating digital gardens:

1. **Zola** — a static site generator in Rust (that's what this site uses)
2. **Obsidian** — a note editor with graph support
3. **Roam Research** — a tool for networked thinking
4. **Logseq** — an open alternative to Roam

#### Markup languages

| Language   | Usage                   |
|------------|-------------------------|
| Markdown   | Primary note format     |
| TOML       | Metadata (frontmatter)  |
| HTML       | Theme templates         |

## Code

Example script for creating a new note:

```bash
#!/bin/bash
# Create a new Zola note
TITLE="$1"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
DATE=$(date +%Y-%m-%d)
cat > "content/w/$DATE-$SLUG.md" << EOF
+++
title = "$TITLE"
date = $DATE
+++

EOF
echo "Note created: content/w/$DATE-$SLUG.md"
```

Read more about Markdown features in the post
[«Markdown Features»](/p/markdown-test/).
