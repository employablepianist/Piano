+++
title = "Another Note"
date = 2024-02-05
+++

This is a **second wiki note**, complementing the first one
([«Test Note»](/w/test-note/)). Together they form a small cluster
of connected pages for testing the link graph.

## About this note

This note doesn't have a specific topic — it serves as an **anchor**
for verifying the backlinks mechanism in the Zola Harmless theme.

### What we're checking

- Whether a link to this page appears on the **Test Note** page
- Whether backlinks display correctly
- Whether navigation between wiki notes works

## Markdown examples

*Italic* and **bold text**.

Numbered list:

1. Create content
2. Check links
3. Enjoy the result

Blockquote:

> Good information architecture is invisible.
> Bad information architecture destroys user experience.

## Code

```rust
// A simple struct for a note
struct Note {
    title: String,
    slug: String,
    links: Vec<String>,
    backlinks: Vec<String>,
}

impl Note {
    fn is_connected_to(&self, other: &Note) -> bool {
        self.links.contains(&other.slug)
            || self.backlinks.contains(&other.slug)
    }
}
```
