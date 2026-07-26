+++
title = "Test Note"
date = 2024-01-10
+++

This is a **test wiki note**, created to verify the backlinks system
and cross-references between site sections.

## Site sections

The Zola Harmless theme supports two main content sections:

1. **Blog** (`/p/`) — chronological posts
2. **Wiki** (`/w/`) — topical notes

Each section uses its own template, but all pages participate in the same
backlinks system.

### Benefits of separation

- **Blog** is convenient for sequential reading
- **Wiki** is convenient for *exploration* and topic navigation

> Separating blog and wiki combines the strengths of both formats.

## Connections to other pages

This note is linked to the blog via the post
[«Links and Backlinks»](/p/links-and-backlinks/), which references it.

## A small list of ideas

- Use tags for categorization
- Add Mermaid diagrams
- Create a graph of connections between notes

```yaml
# Example link configuration
links:
  - target: "/p/links-and-backlinks/"
    type: "mention"
  - target: "/w/another-note/"
    type: "neighbouring note"
```
